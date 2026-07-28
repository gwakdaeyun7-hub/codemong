// AI(코드 진단) 기능 환경 설정 — 서버 전용.
// GEMINI_API_KEY 가 없으면 AI 기능 전체가 조용히 꺼진다 (제출·채점 기록은 정상 동작).
// 키는 절대 NEXT_PUBLIC_ 으로 노출하지 말 것.

export function isAiEnabled(): boolean {
  return Boolean(process.env.GEMINI_API_KEY);
}

export function getGeminiApiKey(): string | null {
  return process.env.GEMINI_API_KEY ?? null;
}

/**
 * 모델 교체 seam — env 로 갈아탈 수 있게.
 * 기본은 gemini-3.1-flash-lite: 원래 계획하던 2.5 Flash-Lite 가 2026-07 기준
 * 신규 사용자에게 404("no longer available to new users")라 후속 저가 티어로 대체.
 */
export function getGeminiModel(): string {
  return process.env.GEMINI_MODEL || "gemini-3.1-flash-lite";
}

/** 무료 사용자 하루 AI 분석 한도 (기본 10회) */
export function getAiDailyLimit(): number {
  const n = Number(process.env.AI_FEEDBACK_DAILY_LIMIT);
  return Number.isFinite(n) && n > 0 ? Math.trunc(n) : 10;
}
