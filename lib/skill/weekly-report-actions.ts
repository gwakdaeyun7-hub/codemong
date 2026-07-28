"use server";

import { getCurrentUser } from "@/lib/auth/get-user";
import { prisma } from "@/lib/prisma";
import { isAiEnabled } from "@/lib/ai/config";
import { GeminiError, generateJson } from "@/lib/ai/gemini";
import { PYTHON_SKILL_AXES } from "@/lib/learning/skill-radar";
import {
  buildWeeklyReportData,
  kstWeekStartDate,
  toPayload,
  type WeeklyReportPayload,
} from "./weekly-report-queries";

// 주간 성장 리포트 — "열 때 생성" (알림의 "열 때 조회" 철학과 동일, cron 없음).
// 카드(weekly-report-card)가 mount 시 이 액션을 부른다:
//  · 지난주(KST 월~일) 리포트가 있으면 그대로 반환
//  · 없고 지난주 제출이 1건 이상이면 생성 후 반환 (유저·주당 1행 멱등 — 복합 PK)
//  · 지난주 제출이 0건이면 행을 만들지 않고 report: null (카드가 "지난주 제출이 없어요" 표시)
// LLM 코멘트는 best-effort — 실패/키 없음이면 llmComment=null 로 숫자 리포트만 저장.

export type WeeklyReportResult =
  | { ok: true; report: WeeklyReportPayload | null }
  | { ok: false; error: string };

const COMMENT_SCHEMA = {
  type: "OBJECT",
  properties: { comment: { type: "STRING" } },
  required: ["comment"],
} as const;

const COMMENT_SYSTEM = `당신은 파이썬 입문자 교육 플랫폼의 주간 학습 리포트 작성자입니다. 주어진 숫자 요약만 근거로 학습자에게 보여줄 한국어 코멘트를 2~3문장으로 작성합니다. 입문자 친화적이고 정직한 톤, 과장 금지, 이모지 금지. 잘한 점 하나와 다음 주에 집중할 축 하나를 짚어줍니다. 숫자에 없는 사실을 지어내지 않습니다.`;

async function generateComment(data: {
  submissionCount: number;
  passRate: number;
  axisScores: Record<string, number>;
  axisDeltas: Record<string, number>;
  weakestAxis: string | null;
}): Promise<string | null> {
  if (!isAiEnabled()) return null;
  const label = (k: string) => PYTHON_SKILL_AXES.find((a) => a.key === k)?.label ?? k;
  const lines = [
    `지난주 제출 ${data.submissionCount}회, 통과율 ${data.passRate}%`,
    `축별 점수: ${Object.entries(data.axisScores)
      .map(([k, v]) => `${label(k)} ${v}`)
      .join(", ")}`,
  ];
  const deltas = Object.entries(data.axisDeltas);
  if (deltas.length > 0) {
    lines.push(
      `전주 대비 변화: ${deltas.map(([k, v]) => `${label(k)} ${v >= 0 ? "+" : ""}${v}`).join(", ")}`,
    );
  }
  if (data.weakestAxis) lines.push(`가장 약한 축: ${label(data.weakestAxis)}`);

  try {
    const raw = await generateJson({
      system: COMMENT_SYSTEM,
      user: lines.join("\n"),
      schema: COMMENT_SCHEMA,
      maxOutputTokens: 400,
    });
    const comment =
      typeof raw === "object" &&
      raw !== null &&
      typeof (raw as { comment?: unknown }).comment === "string"
        ? ((raw as { comment: string }).comment.trim().slice(0, 600) ?? null)
        : null;
    return comment || null;
  } catch (err) {
    if (!(err instanceof GeminiError)) console.error("[CodeMong] 주간 코멘트 실패:", err);
    return null;
  }
}

export async function getOrCreateWeeklyReportAction(): Promise<WeeklyReportResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "로그인이 필요해요" };

  // 지난주 = 이번 주 월요일에서 7일 전.
  const thisWeek = kstWeekStartDate();
  const lastWeek = new Date(thisWeek.getTime() - 7 * 24 * 60 * 60 * 1000);
  const where = { userId_weekStart: { userId: user.id, weekStart: lastWeek } };

  const existing = await prisma.weeklyReport.findUnique({ where });
  if (existing) return { ok: true, report: toPayload(existing) };

  const data = await buildWeeklyReportData(user.id, lastWeek);
  if (data.submissionCount === 0) return { ok: true, report: null };

  const llmComment = await generateComment(data);

  try {
    const created = await prisma.weeklyReport.create({
      data: {
        userId: user.id,
        weekStart: lastWeek,
        submissionCount: data.submissionCount,
        passRate: data.passRate,
        axisScores: data.axisScores,
        axisDeltas: data.axisDeltas,
        weakestAxis: data.weakestAxis,
        llmComment,
      },
    });
    return { ok: true, report: toPayload(created) };
  } catch {
    // 복합 PK 충돌 = 다른 탭이 먼저 생성 — 그 행을 다시 읽는다 (멱등).
    const raced = await prisma.weeklyReport.findUnique({ where });
    if (raced) return { ok: true, report: toPayload(raced) };
    return { ok: false, error: "리포트를 만들지 못했어요. 잠시 후 다시 시도해 주세요." };
  }
}
