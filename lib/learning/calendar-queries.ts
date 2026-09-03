// 학습 캘린더 집계 — 날짜별(KST) 학습 활동을 캘린더가 바로 렌더할 형태로 모은다.
//
// 칸 규칙 (사용자 확정 2026-07-28):
//  · 색상   = 그날 대표 테마(가장 많이 활동한 단원 그룹) — lesson-themes.ts
//  · 진하기 = 학습 깊이. light(영상 시청/문제 시도만) vs deep(문제·연습을 실제로 통과한 날)
//  · 배지   = 이전에 틀렸던 문제를 그날 처음 해결하면 복습 완료 체크
// 하루에 여러 테마를 공부하면 대표 1개로 칠하고, 나머지는 날짜 상세에서 전부 보여준다.
//
// 데이터 소스 (전부 기존 모델 — 새 테이블 없음):
//  · LessonProgress    videoWatchedAt(시청) / learnCompletedAt(완료)
//  · ProblemSubmission 실력향상 제출 (append-only, 통과·오답·errorType·AI 감점)
//  · ExerciseAttempt   연습 시도 (append-only)
//  · ProjectProgress   프로젝트 완료 시점
// 서버 전용(prisma). 조회 범위는 기본 6개월 — 캘린더 월 이동에 필요한 만큼만.

import { cache } from "react";

import { prisma } from "@/lib/prisma";
import { getLessonPlan } from "@/lib/lesson-plan";
import { themeOfLesson, type LessonThemeKey } from "./lesson-themes";

const KST_OFFSET_MS = 9 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

/** UTC 시각 → KST 기준 날짜 키 "YYYY-MM-DD" */
export function kstDateKey(d: Date): string {
  return new Date(d.getTime() + KST_OFFSET_MS).toISOString().slice(0, 10);
}

/** "YYYY-MM-DD" 하루 전 */
function prevDateKey(key: string): string {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d) - DAY_MS).toISOString().slice(0, 10);
}

/** lessonRef("<courseId>/lesson-N") → 강 번호. 파싱 실패 시 null */
function lessonNumberOf(lessonRef: string): number | null {
  const lessonId = lessonRef.split("/")[1] ?? "";
  const n = Number(lessonId.replace("lesson-", ""));
  return Number.isFinite(n) && n > 0 ? n : null;
}

export type CalendarDay = {
  /** "YYYY-MM-DD" (KST) */
  date: string;
  /** 영상만/시도만 = light, 문제·연습을 통과한 날 = deep */
  depth: "light" | "deep";
  /** 칸을 칠할 대표 테마 */
  themeKey: LessonThemeKey | null;
  /** 그날 공부한 모든 테마 (상세용) */
  themes: LessonThemeKey[];
  /** 이전에 틀렸던 문제를 그날 처음 해결한 개수 */
  revisitSolved: number;
  /** 그날 시청/완료한 강의 (예: "4강 입력과 연산자") */
  videos: { label: string; completed: boolean }[];
  problemsTried: number;
  problemsPassed: number;
  exercisesTried: number;
  exercisesPassed: number;
  /** 오답 태그 — 단원명·파이썬 예외명·AI 감점 축 조합 (빈도순 최대 3개) */
  tags: string[];
};

export type LearningCalendar = {
  /** 날짜 키 → 그날 요약 (활동 없는 날은 키 자체가 없음) */
  days: Record<string, CalendarDay>;
  /** 오늘(또는 어제)부터 거슬러 올라간 연속 학습일 */
  streak: number;
  /** 조회 범위 안에서 학습한 총 일수 */
  activeDays: number;
};

type Bucket = {
  videos: Map<string, boolean>; // label → completed (하나라도 완료면 true)
  lessonHits: Map<number, number>; // 강 번호 → 활동 수 (대표 테마 판정)
  problemsTried: number;
  problemsPassed: number;
  exercisesTried: number;
  exercisesPassed: number;
  revisitSolved: number;
  hasPass: boolean;
  tagCounts: Map<string, number>;
};

function emptyBucket(): Bucket {
  return {
    videos: new Map(),
    lessonHits: new Map(),
    problemsTried: 0,
    problemsPassed: 0,
    exercisesTried: 0,
    exercisesPassed: 0,
    revisitSolved: 0,
    hasPass: false,
    tagCounts: new Map(),
  };
}

const AXIS_TAG: Record<string, string> = {
  concept: "개념이해도",
  efficiency: "코드효율성",
  interpretation: "문제해석력",
};

/** AI 감점 근거(Json)에서 축 이름만 안전하게 뽑는다 */
function axesOf(deductions: unknown): string[] {
  if (!Array.isArray(deductions)) return [];
  const out: string[] = [];
  for (const d of deductions) {
    if (typeof d === "object" && d !== null) {
      const axis = (d as { axis?: unknown }).axis;
      if (typeof axis === "string" && AXIS_TAG[axis]) out.push(AXIS_TAG[axis]);
    }
  }
  return out;
}

// cache() = 같은 요청 안에서 중복 호출 1회로 합침 (캘린더 페이지가 이 집계와
// getLearningStats(내부에서 또 호출)를 함께 쓰기 때문 — 6개월 집계를 두 번 돌리지 않는다).
export const getLearningCalendar = cache(async function getLearningCalendar(
  userId: string | null,
  monthsBack = 6,
): Promise<LearningCalendar> {
  if (!userId) return { days: {}, streak: 0, activeDays: 0 };

  const since = new Date(Date.now() - monthsBack * 31 * DAY_MS);

  const [lessonRows, submissions, attempts, projects] = await Promise.all([
    prisma.lessonProgress.findMany({
      where: { userId },
      select: { lessonRef: true, videoWatchedAt: true, learnCompletedAt: true },
    }),
    prisma.problemSubmission.findMany({
      where: { userId, createdAt: { gte: since } },
      orderBy: { createdAt: "asc" },
      select: {
        lessonRef: true,
        problemId: true,
        passed: true,
        errorType: true,
        aiDeductions: true,
        createdAt: true,
      },
    }),
    prisma.exerciseAttempt.findMany({
      where: { userId, createdAt: { gte: since } },
      orderBy: { createdAt: "asc" },
      select: {
        lessonRef: true,
        exerciseId: true,
        hadError: true,
        errorType: true,
        casesPassed: true,
        casesTotal: true,
        createdAt: true,
      },
    }),
    prisma.projectProgress.findMany({
      where: { userId, completedAt: { not: null } },
      select: { lessonRef: true, completedAt: true },
    }),
  ]);

  // 강 번호 → 제목 (영상 라벨·오답 태그용)
  const plan = getLessonPlan("be-python");
  const titleOf = new Map<number, string>();
  for (const l of plan?.lessons ?? []) titleOf.set(l.number, l.title);

  const buckets = new Map<string, Bucket>();
  const bucketAt = (key: string): Bucket => {
    let b = buckets.get(key);
    if (!b) {
      b = emptyBucket();
      buckets.set(key, b);
    }
    return b;
  };
  const hitLesson = (b: Bucket, n: number | null) => {
    if (n === null) return;
    b.lessonHits.set(n, (b.lessonHits.get(n) ?? 0) + 1);
  };
  const labelOf = (lessonRef: string, n: number | null): string =>
    n !== null ? `${n}강 ${titleOf.get(n) ?? ""}`.trim() : lessonRef;

  // 1) 영상 시청 / 완료
  for (const row of lessonRows) {
    const n = lessonNumberOf(row.lessonRef);
    const label = labelOf(row.lessonRef, n);
    const marks: Array<[Date | null, boolean]> = [
      [row.videoWatchedAt, false],
      [row.learnCompletedAt, true],
    ];
    for (const [at, completed] of marks) {
      if (!at || at < since) continue;
      const b = bucketAt(kstDateKey(at));
      b.videos.set(label, (b.videos.get(label) ?? false) || completed);
      hitLesson(b, n);
    }
  }

  // 2) 프로젝트 완료 — 강의 목록에 "완료"로 함께 표시
  for (const row of projects) {
    if (!row.completedAt || row.completedAt < since) continue;
    const n = lessonNumberOf(row.lessonRef);
    const b = bucketAt(kstDateKey(row.completedAt));
    b.videos.set(labelOf(row.lessonRef, n), true);
    b.hasPass = true;
    hitLesson(b, n);
  }

  // 3) 실력향상 제출 — 통과/오답, 오답 태그, 복습 해결 판정
  const solvedProblems = new Set<string>(); // 이미 통과한 (lessonRef|problemId)
  const failedProblems = new Set<string>(); // 통과 전에 틀린 적 있는 문제
  for (const s of submissions) {
    const b = bucketAt(kstDateKey(s.createdAt));
    const n = lessonNumberOf(s.lessonRef);
    hitLesson(b, n);
    b.problemsTried += 1;

    const id = `${s.lessonRef}|${s.problemId}`;
    if (s.passed) {
      b.problemsPassed += 1;
      b.hasPass = true;
      // 첫 통과이면서 그 전에 틀린 적이 있으면 = 오답 복습 해결
      if (!solvedProblems.has(id)) {
        if (failedProblems.has(id)) b.revisitSolved += 1;
        solvedProblems.add(id);
      }
    } else {
      failedProblems.add(id);
      // 오답 태그: 단원명 + 파이썬 예외명 + AI 감점 축
      const tags: string[] = [];
      const title = n !== null ? titleOf.get(n) : undefined;
      if (title) tags.push(title);
      if (s.errorType) tags.push(s.errorType);
      tags.push(...axesOf(s.aiDeductions));
      for (const t of tags) b.tagCounts.set(t, (b.tagCounts.get(t) ?? 0) + 1);
    }
  }

  // 4) 연습 시도 — 같은 규칙 (전 케이스 통과 = 통과)
  const solvedExercises = new Set<string>();
  const failedExercises = new Set<string>();
  for (const a of attempts) {
    const b = bucketAt(kstDateKey(a.createdAt));
    const n = lessonNumberOf(a.lessonRef);
    hitLesson(b, n);
    b.exercisesTried += 1;

    const id = `${a.lessonRef}|${a.exerciseId}`;
    const passed = !a.hadError && a.casesTotal > 0 && a.casesPassed === a.casesTotal;
    if (passed) {
      b.exercisesPassed += 1;
      b.hasPass = true;
      if (!solvedExercises.has(id)) {
        if (failedExercises.has(id)) b.revisitSolved += 1;
        solvedExercises.add(id);
      }
    } else {
      failedExercises.add(id);
      const tags: string[] = [];
      const title = n !== null ? titleOf.get(n) : undefined;
      if (title) tags.push(title);
      if (a.errorType) tags.push(a.errorType);
      for (const t of tags) b.tagCounts.set(t, (b.tagCounts.get(t) ?? 0) + 1);
    }
  }

  // 버킷 → 캘린더 일자
  const days: Record<string, CalendarDay> = {};
  for (const [date, b] of buckets) {
    // 대표 테마 = 활동이 가장 많은 강의 테마 (동점이면 진도가 앞선 강)
    let topLesson: number | null = null;
    let topHits = -1;
    const themeSet = new Set<LessonThemeKey>();
    for (const [n, hits] of b.lessonHits) {
      const theme = themeOfLesson(n);
      if (theme) themeSet.add(theme.key);
      if (hits > topHits || (hits === topHits && topLesson !== null && n > topLesson)) {
        topHits = hits;
        topLesson = n;
      }
    }
    const tags = [...b.tagCounts.entries()]
      .sort((a, c) => c[1] - a[1])
      .slice(0, 3)
      .map(([t]) => `#${t.replace(/\s+/g, "")}`);

    days[date] = {
      date,
      depth: b.hasPass ? "deep" : "light",
      themeKey: topLesson !== null ? (themeOfLesson(topLesson)?.key ?? null) : null,
      themes: [...themeSet],
      revisitSolved: b.revisitSolved,
      videos: [...b.videos.entries()].map(([label, completed]) => ({ label, completed })),
      problemsTried: b.problemsTried,
      problemsPassed: b.problemsPassed,
      exercisesTried: b.exercisesTried,
      exercisesPassed: b.exercisesPassed,
      tags,
    };
  }

  // 연속 학습일 — 오늘 활동이 없으면 어제부터 센다
  // (오늘은 아직 끝나지 않았으므로 "오늘 안 했다"를 끊김으로 보지 않는다.)
  const todayKey = kstDateKey(new Date());
  let cursor: string | null = null;
  if (days[todayKey]) {
    cursor = todayKey;
  } else {
    const y = prevDateKey(todayKey);
    if (days[y]) cursor = y;
  }
  let streak = 0;
  while (cursor && days[cursor]) {
    streak += 1;
    cursor = prevDateKey(cursor);
  }

  return { days, streak, activeDays: Object.keys(days).length };
});
