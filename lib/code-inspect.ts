// 제출 코드 검사 유틸 — 서버(제출 액션)와 클라(러너) 공용 순수 함수.

/**
 * 사실상 빈 제출인지 — 모든 줄이 공백이거나 주석(#)으로 시작하면 true.
 * 평가할 코드가 없는 제출은 AI 채점을 스킵하고(쿼터 절약) 레이더 표본에서도 제외한다
 * (빈 코드는 "비효율 없음 → 효율 100", "오류 없이 실행 → 구문 깨끗" 같은 무의미한
 * 만점 표본을 만들기 때문 — 2026-07-28 팀 테스트에서 발견).
 * 실제 코드 줄은 # 로 시작하지 않으므로 오탐 없음 (코드 뒤 주석은 코드로 판정).
 */
export function isEffectivelyEmptyCode(code: string): boolean {
  if (typeof code !== "string") return true;
  return code.split("\n").every((line) => {
    const t = line.trim();
    return t === "" || t.startsWith("#");
  });
}
