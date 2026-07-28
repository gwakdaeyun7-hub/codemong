// Gemini REST 호출 래퍼 — 서버 전용. SDK 없이 fetch 만 사용 (의존성 0 유지).
// 구조화 출력(responseMimeType + responseSchema)으로 JSON 을 강제한다.
//
// ⚠ 2.5 계열 함정: thinking 토큰이 maxOutputTokens 를 잠식해 JSON 이 잘릴 수 있다 —
//   generationConfig.thinkingConfig.thinkingBudget 을 반드시 0 으로 고정한다.
//   (Flash-Lite 는 기본 off 지만, GEMINI_MODEL 을 Flash 로 바꿔도 안전하도록 명시.)

import { getGeminiApiKey, getGeminiModel } from "./config";

const API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";
const DEFAULT_TIMEOUT_MS = 15_000;

export class GeminiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GeminiError";
  }
}

/** 호출 1회의 토큰 사용량 (usageMetadata 실측) — 무료/유료 티어 모두 응답에 포함된다 */
export type GeminiUsage = {
  promptTokens: number;
  outputTokens: number;
};

/**
 * 구조화 JSON 생성 1회 호출. 성공 시 JSON.parse 결과와 토큰 사용량을 돌려준다.
 * 키 없음/HTTP 실패/타임아웃/파싱 실패는 전부 GeminiError throw — 호출부가 failed 처리.
 */
export async function generateJson({
  system,
  user,
  schema,
  maxOutputTokens = 1024,
  timeoutMs = DEFAULT_TIMEOUT_MS,
}: {
  system: string;
  user: string;
  schema: unknown;
  maxOutputTokens?: number;
  timeoutMs?: number;
}): Promise<{ data: unknown; usage: GeminiUsage | null }> {
  const key = getGeminiApiKey();
  if (!key) throw new GeminiError("GEMINI_API_KEY 미설정");

  const model = getGeminiModel();
  // AI_DEBUG=1 이면 프롬프트/응답 전문을 서버 콘솔(pnpm dev 터미널)에 출력 — 프롬프트 튜닝용.
  const debug = process.env.AI_DEBUG === "1";
  if (debug) {
    console.log(`\n[AI_DEBUG] ── 요청 (${model}) ──\n[system]\n${system}\n\n[user]\n${user}\n`);
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${API_BASE}/${model}:generateContent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": key,
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: [{ role: "user", parts: [{ text: user }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: schema,
          maxOutputTokens,
          temperature: 0.2,
          thinkingConfig: { thinkingBudget: 0 },
        },
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      // 에러 본문은 로그 진단용으로 앞부분만 (키 노출 없음 — 요청 헤더는 안 담김).
      const body = await res.text().catch(() => "");
      throw new GeminiError(`HTTP ${res.status} — ${body.slice(0, 300)}`);
    }

    const data = (await res.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
      usageMetadata?: { promptTokenCount?: number; candidatesTokenCount?: number };
    };
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (debug) {
      console.log(`[AI_DEBUG] ── 응답 ──\n${text ?? "(없음)"}\n`);
    }
    if (!text) throw new GeminiError("응답에 텍스트가 없음");

    const meta = data.usageMetadata;
    const usage: GeminiUsage | null =
      meta && typeof meta.promptTokenCount === "number"
        ? { promptTokens: meta.promptTokenCount, outputTokens: meta.candidatesTokenCount ?? 0 }
        : null;

    try {
      return { data: JSON.parse(text) as unknown, usage };
    } catch {
      throw new GeminiError(`JSON 파싱 실패 — ${text.slice(0, 200)}`);
    }
  } catch (err) {
    if (err instanceof GeminiError) throw err;
    if (err instanceof Error && err.name === "AbortError") {
      throw new GeminiError(`타임아웃 (${timeoutMs}ms)`);
    }
    throw new GeminiError(err instanceof Error ? err.message : String(err));
  } finally {
    clearTimeout(timer);
  }
}
