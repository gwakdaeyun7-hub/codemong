"use server";

import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/lib/auth/get-user";
import { prisma } from "@/lib/prisma";
import { validateLessonRef } from "@/lib/community/validation";
import { getGeminiModel, isAiEnabled } from "@/lib/ai/config";
import { gradeSubmissionWithAi } from "@/lib/ai/grade-submission";
import { hasAiQuotaToday } from "@/lib/ai/limits";
import type { AiDeduction } from "@/lib/ai/rubric";
import { getProblem } from "@/lib/problems";

// 실력향상(시험) 트랙 제출 Server Action.
// 채점은 클라이언트(Pyodide, lib/project/grader.ts)에서 끝나고 결과 요약만 기록한다
// (ExerciseAttempt 와 동일한 "서버 재검증 안 함" 정책 — 랭킹/보상이 없어 위조 인센티브가 낮다).
//
// 2단계 write:
//  1) ProblemSubmission.create — 여기까지 성공하면 제출 기록은 확정 (AI 와 무관하게 항상 남는다)
//  2) AI 게이트(키 존재 + 하루 한도) 통과 시 Gemini 3축 채점 → 같은 행 update (ok/failed)
//     실패해도 원 제출 기록 불변 — 알림 생성과 같은 best-effort 철학.
// AI 결과는 반환값으로도 내려 클라가 즉시 피드백 카드를 그린다.

export type SubmissionAiPayload = {
  status: "ok" | "failed" | "skipped_no_key" | "skipped_limit";
  conceptScore: number | null;
  efficiencyScore: number | null;
  interpretationScore: number | null;
  feedback: string | null;
  deductions: AiDeduction[];
};

export type SubmissionActionResult =
  | { ok: true; ai: SubmissionAiPayload }
  | { ok: false; error: string };

/** 케이스별 결과 요약 — stdout 은 담지 않는다 (용량/히든 유출 방지) */
export type SubmissionCaseSummary = {
  label: string;
  passed: boolean;
  hidden: boolean;
};

export type SubmissionSummary = {
  /** 공개+히든 전체 통과 여부 */
  passed: boolean;
  /** 실행 자체 실패(문법/런타임 예외)가 있었는지 — 구문 정확도 축 proxy */
  hadError: boolean;
  /** 첫 에러 종류("SyntaxError" 등) — 없으면 null */
  errorType: string | null;
  casesPassed: number;
  casesTotal: number;
  caseResults: SubmissionCaseSummary[];
};

const CODE_MAX_BYTES = 10_000;

function skippedPayload(status: "skipped_no_key" | "skipped_limit"): SubmissionAiPayload {
  return {
    status,
    conceptScore: null,
    efficiencyScore: null,
    interpretationScore: null,
    feedback: null,
    deductions: [],
  };
}

export async function submitProblemAction(
  lessonRef: string,
  problemId: string,
  code: string,
  summary: SubmissionSummary,
): Promise<SubmissionActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "로그인이 필요해요" };

  const refErr = validateLessonRef(lessonRef);
  if (refErr) return { ok: false, error: refErr };
  if (!problemId) return { ok: false, error: "문제 정보가 없어요" };

  // 존재하는 강/문제만 기록 (recordAttemptAction 과 동일 가드).
  const [courseId, lessonId] = lessonRef.split("/");
  const problem = courseId && lessonId ? getProblem(courseId, lessonId, problemId) : undefined;
  if (!problem) return { ok: false, error: "문제를 찾을 수 없어요" };

  // 클라가 넘긴 값을 방어적으로 정규화 (음수/역전/과대값 차단).
  const casesTotal = Math.max(0, Math.min(1000, Math.trunc(summary.casesTotal)));
  const casesPassed = Math.max(0, Math.min(casesTotal, Math.trunc(summary.casesPassed)));
  const errorType = summary.errorType ? summary.errorType.slice(0, 60) : null;
  const trimmedCode = typeof code === "string" ? code.slice(0, CODE_MAX_BYTES) : "";
  const caseResults = Array.isArray(summary.caseResults)
    ? summary.caseResults.slice(0, 1000).map((c) => ({
        label: String(c.label ?? "").slice(0, 80),
        passed: Boolean(c.passed),
        hidden: Boolean(c.hidden),
      }))
    : [];
  const normalized: SubmissionSummary = {
    passed: Boolean(summary.passed),
    hadError: Boolean(summary.hadError),
    errorType,
    casesPassed,
    casesTotal,
    caseResults,
  };

  // AI 게이트 — 키 없으면 전부 off, 있으면 하루 한도 확인 (skipped_* 는 한도 미차감).
  let aiStatus: "pending" | "skipped_no_key" | "skipped_limit";
  if (!isAiEnabled()) {
    aiStatus = "skipped_no_key";
  } else if (!(await hasAiQuotaToday(user.id))) {
    aiStatus = "skipped_limit";
  } else {
    aiStatus = "pending";
  }

  // 1단계 write — 제출 기록 확정.
  const submission = await prisma.problemSubmission.create({
    data: {
      userId: user.id,
      lessonRef,
      problemId,
      code: trimmedCode,
      passed: normalized.passed,
      hadError: normalized.hadError,
      errorType,
      casesPassed,
      casesTotal,
      caseResults,
      aiStatus,
    },
  });

  // 2단계 write — AI 채점 (best-effort: 실패해도 제출 기록 불변).
  let ai: SubmissionAiPayload;
  if (aiStatus !== "pending") {
    ai = skippedPayload(aiStatus);
  } else {
    try {
      const { verdict, usage } = await gradeSubmissionWithAi(problem, trimmedCode, normalized);
      await prisma.problemSubmission.update({
        where: { id: submission.id },
        data: {
          aiStatus: "ok",
          conceptScore: verdict.concept,
          efficiencyScore: verdict.efficiency,
          interpretationScore: verdict.interpretation,
          aiFeedback: verdict.feedback,
          aiDeductions: verdict.deductions,
          aiModel: getGeminiModel(),
          // 토큰 사용량 로깅 (무료 티어에서도 usageMetadata 는 온다) — scripts/ai-usage.mjs 가 집계.
          promptTokens: usage?.promptTokens ?? null,
          outputTokens: usage?.outputTokens ?? null,
        },
      });
      ai = {
        status: "ok",
        conceptScore: verdict.concept,
        efficiencyScore: verdict.efficiency,
        interpretationScore: verdict.interpretation,
        feedback: verdict.feedback,
        deductions: verdict.deductions,
      };
    } catch (err) {
      console.error("[CodeMong] Gemini 채점 실패:", err);
      // 실패 마킹도 best-effort — 이 update 가 죽어도 pending 은 failed 취급 (스키마 주석 참조).
      await prisma.problemSubmission
        .update({ where: { id: submission.id }, data: { aiStatus: "failed" } })
        .catch(() => {});
      ai = {
        status: "failed",
        conceptScore: null,
        efficiencyScore: null,
        interpretationScore: null,
        feedback: null,
        deductions: [],
      };
    }
  }

  // 제출 1건이 바꾸는 화면 재검증:
  //  · 문제 페이지 — 제출 히스토리
  //  · 단원 페이지 / 대시보드 — 해결 배지, 해결 N/M
  //  · /mypage — 성장 레이더 (D단계에서 ProblemSubmission 합산 예정이라 미리 포함)
  revalidatePath(`/skill/${lessonId}/${problemId}`);
  revalidatePath(`/skill/${lessonId}`);
  revalidatePath("/skill");
  revalidatePath("/mypage");

  return { ok: true, ai };
}
