// 주간 리포트 대시보드(/mypage/weekly) 집계 — 지난주(KST 월~일) 활동을 기존 4개 모델에서 그대로 읽는다.
// 새 저장 모델 없음: LessonProgress(영상) · ExerciseAttempt(연습) · ProblemSubmission(문제) 를 주 범위로 잘라
// 날짜별 활동 스트립 / KPI / 푼 문제 목록 / 오류·감점 태그를 만든다. 축 점수·delta·LLM 코멘트는
// WeeklyReport 행(weekly-report-card 가 "열 때 생성")이 따로 담당 — 이 파일은 읽기만 한다.

import { cache } from "react";

import { kstDateKey } from "@/lib/learning/calendar-queries";
import { getLessonPlan } from "@/lib/lesson-plan";
import { prisma } from "@/lib/prisma";
import { getProblem, type ProblemDifficulty } from "@/lib/problems";
import { WEEKLY_COMMENT_AXES } from "./weekly-comment-prompt";
import { kstWeekInstantRange } from "./weekly-report-queries";

const DAY_MS = 24 * 60 * 60 * 1000;
const WEEKDAY = ["월", "화", "수", "목", "금", "토", "일"];

export type WeeklyDay = {
  /** "YYYY-MM-DD" (KST) */
  key: string;
  weekday: string;
  videos: number;
  exercises: number;
  submissions: number;
  active: boolean;
};

export type WeeklyProblemRow = {
  lessonId: string;
  lessonNumber: number;
  lessonTitle: string;
  problemId: string;
  number: number;
  title: string;
  difficulty: ProblemDifficulty;
  /** 그 주 제출 횟수 */
  attempts: number;
  /** 그 주에 한 번이라도 전체 통과 */
  passed: boolean;
  /** 가장 잘 푼 제출의 통과 케이스 수 */
  bestPassed: number;
  casesTotal: number;
  /** 마지막 제출의 실행 오류 종류 (없으면 null) */
  lastErrorType: string | null;
  href: string;
};

export type WeeklyTag = { label: string; count: number; kind: "error" | "deduction" };

export type WeeklyDashboard = {
  weekStart: string;
  weekEnd: string;
  days: WeeklyDay[];
  activeDays: number;
  videos: number;
  exercisesPassed: number;
  exerciseAttempts: number;
  submissionCount: number;
  solvedProblems: number;
  passRate: number;
  problems: WeeklyProblemRow[];
  tags: WeeklyTag[];
  hasActivity: boolean;
};

const axisLabel = (key: string) => WEEKLY_COMMENT_AXES.find((a) => a.key === key)?.label ?? key;

/** AI 감점 근거(Json)에서 축 key 만 안전하게 뽑는다 */
function deductionAxes(deductions: unknown): string[] {
  if (!Array.isArray(deductions)) return [];
  const out: string[] = [];
  for (const d of deductions) {
    if (typeof d === "object" && d !== null) {
      const axis = (d as { axis?: unknown }).axis;
      if (typeof axis === "string") out.push(axis);
    }
  }
  return out;
}

function splitRef(lessonRef: string): { courseId: string; lessonId: string } {
  const i = lessonRef.indexOf("/");
  return i < 0
    ? { courseId: lessonRef, lessonId: "" }
    : { courseId: lessonRef.slice(0, i), lessonId: lessonRef.slice(i + 1) };
}

export const getWeeklyDashboard = cache(async function getWeeklyDashboard(
  userId: string,
  weekStartDate: Date,
): Promise<WeeklyDashboard> {
  const { start, end } = kstWeekInstantRange(weekStartDate);
  const inWeek = { gte: start, lt: end };

  const [submissions, attempts, progress] = await Promise.all([
    prisma.problemSubmission.findMany({
      where: { userId, createdAt: inWeek },
      orderBy: { createdAt: "asc" },
      select: {
        lessonRef: true,
        problemId: true,
        passed: true,
        errorType: true,
        casesPassed: true,
        casesTotal: true,
        aiStatus: true,
        aiDeductions: true,
        createdAt: true,
      },
    }),
    prisma.exerciseAttempt.findMany({
      where: { userId, createdAt: inWeek },
      select: {
        lessonRef: true,
        exerciseId: true,
        errorType: true,
        casesPassed: true,
        casesTotal: true,
        createdAt: true,
      },
    }),
    prisma.lessonProgress.findMany({
      where: {
        userId,
        OR: [{ videoWatchedAt: inWeek }, { learnCompletedAt: inWeek }],
      },
      select: { lessonRef: true, videoWatchedAt: true, learnCompletedAt: true },
    }),
  ]);

  // 날짜 버킷 (월~일)
  const days: WeeklyDay[] = Array.from({ length: 7 }, (_, i) => ({
    key: new Date(weekStartDate.getTime() + i * DAY_MS).toISOString().slice(0, 10),
    weekday: WEEKDAY[i],
    videos: 0,
    exercises: 0,
    submissions: 0,
    active: false,
  }));
  const dayOf = (d: Date) => days.find((x) => x.key === kstDateKey(d));

  for (const p of progress) {
    // 그 주 안의 시각 하나로 버킷 (완료가 그 주면 완료 시각, 아니면 시청 시각)
    const at =
      p.learnCompletedAt && p.learnCompletedAt >= start && p.learnCompletedAt < end
        ? p.learnCompletedAt
        : p.videoWatchedAt;
    if (at) {
      const d = dayOf(at);
      if (d) d.videos += 1;
    }
  }
  for (const a of attempts) {
    const d = dayOf(a.createdAt);
    if (d) d.exercises += 1;
  }
  for (const s of submissions) {
    const d = dayOf(s.createdAt);
    if (d) d.submissions += 1;
  }
  for (const d of days) d.active = d.videos + d.exercises + d.submissions > 0;

  // 연습: 통과 = 케이스 전부 통과, 문제 단위로 distinct
  const passedExercises = new Set<string>();
  for (const a of attempts) {
    if (a.casesTotal > 0 && a.casesPassed >= a.casesTotal) {
      passedExercises.add(`${a.lessonRef}|${a.exerciseId}`);
    }
  }

  // 문제: 문제 단위로 묶어 시도 수·통과 여부·최고 케이스·마지막 오류
  type Agg = {
    lessonRef: string;
    problemId: string;
    attempts: number;
    passed: boolean;
    bestPassed: number;
    casesTotal: number;
    lastErrorType: string | null;
    lastAt: Date;
  };
  const byProblem = new Map<string, Agg>();
  for (const s of submissions) {
    const key = `${s.lessonRef}|${s.problemId}`;
    const cur = byProblem.get(key);
    if (!cur) {
      byProblem.set(key, {
        lessonRef: s.lessonRef,
        problemId: s.problemId,
        attempts: 1,
        passed: s.passed,
        bestPassed: s.casesPassed,
        casesTotal: s.casesTotal,
        lastErrorType: s.errorType,
        lastAt: s.createdAt,
      });
    } else {
      cur.attempts += 1;
      cur.passed = cur.passed || s.passed;
      cur.bestPassed = Math.max(cur.bestPassed, s.casesPassed);
      cur.casesTotal = Math.max(cur.casesTotal, s.casesTotal);
      cur.lastErrorType = s.errorType;
      cur.lastAt = s.createdAt;
    }
  }

  const plan = getLessonPlan("be-python");
  const problems: WeeklyProblemRow[] = [];
  for (const agg of [...byProblem.values()].sort(
    (a, b) => b.lastAt.getTime() - a.lastAt.getTime(),
  )) {
    const { lessonId } = splitRef(agg.lessonRef);
    const problem = getProblem("be-python", lessonId, agg.problemId);
    if (!problem) continue; // 지금 존재하지 않는 문제는 목록에서 뺀다 (해결 현황과 같은 규칙)
    const lesson = plan?.lessons.find((l) => l.id === lessonId);
    problems.push({
      lessonId,
      lessonNumber: lesson?.number ?? (Number(lessonId.replace("lesson-", "")) || 0),
      lessonTitle: lesson?.title ?? lessonId,
      problemId: agg.problemId,
      number: problem.number,
      title: problem.title,
      difficulty: problem.difficulty,
      attempts: agg.attempts,
      passed: agg.passed,
      bestPassed: agg.bestPassed,
      casesTotal: agg.casesTotal,
      lastErrorType: agg.lastErrorType,
      href: `/skill/${lessonId}/${agg.problemId}`,
    });
  }

  // 오류·감점 태그 (빈도순)
  const tagCounts = new Map<string, WeeklyTag>();
  const bump = (label: string, kind: WeeklyTag["kind"]) => {
    const cur = tagCounts.get(label);
    if (cur) cur.count += 1;
    else tagCounts.set(label, { label, count: 1, kind });
  };
  for (const s of submissions) {
    if (s.errorType) bump(s.errorType, "error");
    if (s.aiStatus === "ok")
      for (const axis of deductionAxes(s.aiDeductions))
        bump(`${axisLabel(axis)} 감점`, "deduction");
  }
  for (const a of attempts) if (a.errorType) bump(a.errorType, "error");
  const tags = [...tagCounts.values()].sort((a, b) => b.count - a.count).slice(0, 8);

  const submissionCount = submissions.length;
  const passRate =
    submissionCount > 0
      ? Math.round((submissions.filter((s) => s.passed).length / submissionCount) * 100)
      : 0;
  const activeDays = days.filter((d) => d.active).length;

  return {
    weekStart: days[0].key,
    weekEnd: days[6].key,
    days,
    activeDays,
    videos: new Set(progress.map((p) => p.lessonRef)).size,
    exercisesPassed: passedExercises.size,
    exerciseAttempts: attempts.length,
    submissionCount,
    solvedProblems: problems.filter((p) => p.passed).length,
    passRate,
    problems,
    tags,
    hasActivity: activeDays > 0,
  };
});
