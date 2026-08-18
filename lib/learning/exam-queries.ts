// 시험 일정 조회 + 보강 추천용 약점 단원 계산 (서버 전용).
//
// D-Day 카드가 쓰는 두 가지:
//  · listUpcomingExams — 오늘(KST) 이후의 시험을 가까운 순으로
//  · getWeakestLesson  — "가장 점수가 낮았던 단원" (사용자 확정 규칙)
//      1순위: 제출이 있는 단원 중 점수가 가장 낮은 곳 (AI 3축 평균, 없으면 해결률)
//      2순위: 제출이 하나도 없으면 아직 안 푼 가장 앞 단원을 안내
// 점수 집계는 성장 레이더와 같은 규칙을 따른다 — 문제당 최신 제출 1건, skipped_empty 제외.

import { prisma } from "@/lib/prisma";
import { listProblemSets } from "@/lib/problems";

const KST_OFFSET_MS = 9 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

/** KST 기준 오늘 날짜 키 "YYYY-MM-DD" */
export function kstTodayKey(now: Date = new Date()): string {
  return new Date(now.getTime() + KST_OFFSET_MS).toISOString().slice(0, 10);
}

/** "YYYY-MM-DD" → @db.Date 저장용 Date (UTC 자정 — WeeklyReport.weekStart 규약과 동일) */
export function dateKeyToUtcDate(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

/** 두 날짜 키의 일수 차 (to - from) */
export function daysBetween(fromKey: string, toKey: string): number {
  return Math.round(
    (dateKeyToUtcDate(toKey).getTime() - dateKeyToUtcDate(fromKey).getTime()) / DAY_MS,
  );
}

export type ExamItem = {
  id: string;
  title: string;
  /** "YYYY-MM-DD" */
  date: string;
  /** 오늘부터 남은 일수 (0 = 오늘) */
  dday: number;
};

/** 오늘 포함 이후의 시험을 가까운 순으로 (지난 시험은 행은 남기되 노출하지 않는다) */
export async function listUpcomingExams(userId: string | null): Promise<ExamItem[]> {
  if (!userId) return [];
  const todayKey = kstTodayKey();
  const rows = await prisma.examSchedule.findMany({
    where: { userId, examDate: { gte: dateKeyToUtcDate(todayKey) } },
    orderBy: { examDate: "asc" },
    select: { id: true, title: true, examDate: true },
  });
  return rows.map((r) => {
    const date = r.examDate.toISOString().slice(0, 10);
    return { id: r.id, title: r.title, date, dday: daysBetween(todayKey, date) };
  });
}

export type WeakestLesson = {
  lessonId: string;
  lessonNumber: number;
  title: string;
  /** score = 점수가 가장 낮은 단원 / unstudied = 아직 풀지 않은 단원 */
  reason: "score" | "unstudied";
  /** 0~100 (reason === "unstudied" 이면 null) */
  score: number | null;
  /** 점수 근거 — "AI 진단 평균" 또는 "문제 해결률" */
  basis: "ai" | "solveRate" | null;
  solved: number;
  total: number;
  href: string;
};

/**
 * 보강할 단원 하나를 고른다.
 * 문제 세트가 있는 단원(현재 4~9강)만 대상 — 문제가 없는 단원은 추천해도 풀 것이 없다.
 */
export async function getWeakestLesson(userId: string | null): Promise<WeakestLesson | null> {
  const sets = listProblemSets("be-python");
  if (sets.length === 0) return null;
  if (!userId) return null;

  const refs = sets.map((s) => `${s.courseId}/${s.lessonId}`);
  const rows = await prisma.problemSubmission.findMany({
    where: { userId, lessonRef: { in: refs } },
    orderBy: { createdAt: "desc" },
    select: {
      lessonRef: true,
      problemId: true,
      passed: true,
      aiStatus: true,
      conceptScore: true,
      efficiencyScore: true,
      interpretationScore: true,
    },
  });

  // 문제당 최신 제출 1건만 (레이더 집계 규칙과 동일). 빈 제출은 표본에서 제외.
  const seen = new Set<string>();
  type Latest = (typeof rows)[number];
  const latest: Latest[] = [];
  for (const r of rows) {
    if (r.aiStatus === "skipped_empty") continue;
    const key = `${r.lessonRef}|${r.problemId}`;
    if (seen.has(key)) continue;
    seen.add(key);
    latest.push(r);
  }

  // 해결(한 번이라도 통과) 판정은 전체 이력 기준 — 화면의 "N/M 해결"과 맞춘다.
  const solvedKeys = new Set<string>();
  for (const r of rows) {
    if (r.passed) solvedKeys.add(`${r.lessonRef}|${r.problemId}`);
  }

  let best: WeakestLesson | null = null;
  let firstUnstudied: WeakestLesson | null = null;

  for (const set of sets) {
    const ref = `${set.courseId}/${set.lessonId}`;
    const total = set.problems.length;
    const solved = set.problems.filter((p) => solvedKeys.has(`${ref}|${p.id}`)).length;
    const mine = latest.filter((r) => r.lessonRef === ref);

    const candidate = {
      lessonId: set.lessonId,
      lessonNumber: set.lessonNumber,
      title: set.title,
      solved,
      total,
      href: `/skill/${set.lessonId}`,
    };

    if (mine.length === 0) {
      // 아직 손대지 않은 단원 — 점수 기반 후보가 없을 때만 쓴다 (가장 앞 단원 우선).
      if (!firstUnstudied) {
        firstUnstudied = { ...candidate, reason: "unstudied", score: null, basis: null };
      }
      continue;
    }

    // 점수: AI 진단이 있으면 3축 평균, 없으면 해결률
    const scored = mine.filter(
      (r) =>
        r.aiStatus === "ok" &&
        r.conceptScore !== null &&
        r.efficiencyScore !== null &&
        r.interpretationScore !== null,
    );
    let score: number;
    let basis: "ai" | "solveRate";
    if (scored.length > 0) {
      const sum = scored.reduce(
        (acc, r) =>
          acc +
          ((r.conceptScore as number) +
            (r.efficiencyScore as number) +
            (r.interpretationScore as number)) /
            3,
        0,
      );
      score = Math.round(sum / scored.length);
      basis = "ai";
    } else {
      score = total > 0 ? Math.round((solved / total) * 100) : 0;
      basis = "solveRate";
    }

    // 최저 점수 단원 (동점이면 앞 단원 = 기초부터 다지도록)
    if (!best || score < (best.score ?? 101)) {
      best = { ...candidate, reason: "score", score, basis };
    }
  }

  return best ?? firstUnstudied;
}
