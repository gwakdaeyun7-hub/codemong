// 주간 성장 리포트 — 집계 순수 로직 + KST 주 경계 유틸.
// 생성 트리거는 "열 때 생성"(weekly-report-actions.ts) — cron/Batch 없음 (무료 티어 Batch 불가 확인).
// 향후 Vercel Cron 으로 승급할 때도 이 build 함수를 그대로 재사용한다 (seam).

import { prisma } from "@/lib/prisma";
import { getSkillRadarDetail, PYTHON_SKILL_AXES } from "@/lib/learning/skill-radar";

const KST_OFFSET_MS = 9 * 60 * 60 * 1000;
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * 기준 시각이 속한 KST 주의 월요일을 "날짜 전용" Date(UTC 자정)로.
 * WeeklyReport.weekStart(@db.Date) 의 PK 값 규약 — 항상 이 함수로 만든 값만 저장/조회한다.
 */
export function kstWeekStartDate(now: Date = new Date()): Date {
  const kst = new Date(now.getTime() + KST_OFFSET_MS);
  // getUTCDay: 0(일)~6(토) → 월요일 기준 오프셋
  const day = kst.getUTCDay();
  const sinceMonday = (day + 6) % 7;
  return new Date(
    Date.UTC(kst.getUTCFullYear(), kst.getUTCMonth(), kst.getUTCDate() - sinceMonday),
  );
}

/** weekStart(날짜 전용, KST 월요일) → 그 주가 실제로 시작/끝나는 UTC 시각 [start, end) */
export function kstWeekInstantRange(weekStartDate: Date): { start: Date; end: Date } {
  const start = new Date(weekStartDate.getTime() - KST_OFFSET_MS);
  return { start, end: new Date(start.getTime() + WEEK_MS) };
}

export type WeeklyReportPayload = {
  /** ISO 날짜 (KST 월요일) */
  weekStart: string;
  submissionCount: number;
  passRate: number;
  /** 축 key → 리포트 생성 시점의 누적 점수 스냅샷 */
  axisScores: Record<string, number>;
  /** 축 key → 전주 리포트 대비 변화 (전주 리포트 없으면 빈 객체) */
  axisDeltas: Record<string, number>;
  weakestAxis: string | null;
  weakestAxisLabel: string | null;
  llmComment: string | null;
};

function asScoreMap(value: unknown): Record<string, number> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return {};
  const out: Record<string, number> = {};
  for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
    if (typeof v === "number" && Number.isFinite(v)) out[k] = v;
  }
  return out;
}

export function toPayload(row: {
  weekStart: Date;
  submissionCount: number;
  passRate: number;
  axisScores: unknown;
  axisDeltas: unknown;
  weakestAxis: string | null;
  llmComment: string | null;
}): WeeklyReportPayload {
  const weakestAxisLabel = PYTHON_SKILL_AXES.find((a) => a.key === row.weakestAxis)?.label ?? null;
  return {
    weekStart: row.weekStart.toISOString().slice(0, 10),
    submissionCount: row.submissionCount,
    passRate: row.passRate,
    axisScores: asScoreMap(row.axisScores),
    axisDeltas: asScoreMap(row.axisDeltas),
    weakestAxis: row.weakestAxis,
    weakestAxisLabel,
    llmComment: row.llmComment,
  };
}

/**
 * 지난주 리포트에 넣을 집계 재료.
 *  · 주간 제출 수/통과율 — 그 주(KST)의 ProblemSubmission
 *  · 축 스냅샷 — 현재 누적 레이더 값 (문제당 최신 제출 규칙 그대로)
 *  · delta — 전전주 리포트의 스냅샷과 비교 (없으면 빈 객체)
 *  · weakestAxis — 스냅샷 최저 축 (규칙 기반 다음 문제 추천 seam)
 */
export async function buildWeeklyReportData(userId: string, weekStartDate: Date) {
  const { start, end } = kstWeekInstantRange(weekStartDate);
  const prevWeekStart = new Date(weekStartDate.getTime() - WEEK_MS);

  const [submissions, radar, prevReport] = await Promise.all([
    prisma.problemSubmission.findMany({
      where: { userId, createdAt: { gte: start, lt: end } },
      select: { passed: true },
    }),
    getSkillRadarDetail("be-python", userId),
    prisma.weeklyReport.findUnique({
      where: { userId_weekStart: { userId, weekStart: prevWeekStart } },
    }),
  ]);

  const submissionCount = submissions.length;
  const passRate =
    submissionCount > 0
      ? Math.round((submissions.filter((s) => s.passed).length / submissionCount) * 100)
      : 0;

  const axisScores: Record<string, number> = {};
  for (const p of radar.points) axisScores[p.axisKey] = p.userValue;

  const prevScores = prevReport ? asScoreMap(prevReport.axisScores) : {};
  const axisDeltas: Record<string, number> = {};
  for (const [k, v] of Object.entries(axisScores)) {
    if (typeof prevScores[k] === "number") axisDeltas[k] = v - prevScores[k];
  }

  let weakestAxis: string | null = null;
  for (const [k, v] of Object.entries(axisScores)) {
    if (weakestAxis === null || v < axisScores[weakestAxis]) weakestAxis = k;
  }

  return { submissionCount, passRate, axisScores, axisDeltas, weakestAxis };
}
