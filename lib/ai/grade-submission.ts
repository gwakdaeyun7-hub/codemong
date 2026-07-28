// 제출 1건의 AI 3축 채점 — 서버 전용 헬퍼. submitProblemAction 이 호출한다.
// 실패는 GeminiError throw 로 알린다 (호출부가 aiStatus=failed 처리).

import { GeminiError, generateJson, type GeminiUsage } from "./gemini";
import {
  RUBRIC_RESPONSE_SCHEMA,
  RUBRIC_SYSTEM_PROMPT,
  buildProblemBlock,
  buildSubmissionBlock,
  validateAiVerdict,
  type AiVerdict,
} from "./rubric";
import type { Problem } from "@/lib/problems";
import type { SubmissionSummary } from "@/lib/skill/submission-actions";

export async function gradeSubmissionWithAi(
  problem: Problem,
  code: string,
  summary: SubmissionSummary,
): Promise<{ verdict: AiVerdict; usage: GeminiUsage | null }> {
  // 캐싱 최적화 순서 유지: [고정 루브릭(system)] → [문제별 고정] → [가변 제출] (rubric.ts 주석 참조).
  const user = `${buildProblemBlock(problem)}\n\n${buildSubmissionBlock(code, summary)}`;
  const { data, usage } = await generateJson({
    system: RUBRIC_SYSTEM_PROMPT,
    user,
    schema: RUBRIC_RESPONSE_SCHEMA,
    maxOutputTokens: 1024,
  });
  const verdict = validateAiVerdict(data);
  if (!verdict) throw new GeminiError("응답이 스키마 검증을 통과하지 못함");
  return { verdict, usage };
}
