/**
 * Lesson 12 design tokens.
 *
 * Carry-over from lesson-11 theme (시즌 통일 — self-contained per-lesson copy,
 * NOT imported across lessons, per workspace-layout contract) plus lesson-12
 * 추가 색상.
 *
 *   - background zinc-50 (#fafafa) for page; zinc-900 (#18181b) for code panels
 *   - violet accent (#8b5cf6 = violet-500, #7c3aed = violet-600)
 *   - rounded-2xl cards with soft shadow
 *   - Pretendard 1순위, fallback Noto Sans KR / system-ui
 *
 * Lesson-12 추가 색상:
 *   - traceErr* — Traceback 박스 (어두운 콘솔 배경 + 빨간 좌측 막대). scene-02/03.
 *   - 에러 강조용 노란 highlight 는 lesson-6 carry-over highlightYellow* 재활용.
 *   - 오답분류 칩 (문법오류 빨간 / 논리오류 violet / 개념미숙 회색) 은
 *     dangerRed* + accent* + zinc 톤 재활용. scene-02/06/09.
 *   - aiGood* / aiBad* — AI 좋은/나쁜 질문 패널 (scene-08).
 */

export const colors = {
  bg: "#fafafa", // zinc-50
  bgWhite: "#ffffff",
  ink: "#18181b", // zinc-900
  inkSoft: "#3f3f46", // zinc-700
  inkMuted: "#71717a", // zinc-500
  inkSubtle: "#a1a1aa", // zinc-400
  border: "#e4e4e7", // zinc-200
  borderSoft: "#f4f4f5", // zinc-100
  accent: "#8b5cf6", // violet-500
  accentDeep: "#7c3aed", // violet-600
  accentSoft: "#ede9fe", // violet-100
  accentLight: "#c4b5fd", // violet-300 — type-on 새 토큰 강조용
  accentInk: "#5b21b6", // violet-800
  // dark surfaces (terminal / code panel)
  darkBg: "#18181b", // zinc-900
  darkBg2: "#27272a", // zinc-800
  darkInk: "#e4e4e7", // zinc-200
  darkMuted: "#a1a1aa", // zinc-400
  darkAccent: "#a78bfa", // violet-400
  // python syntax token colors (dark panel)
  syntaxKeyword: "#c084fc", // purple-400 — for/in/as
  syntaxString: "#fbbf24", // amber-400 — "3" / "내 점수:"
  syntaxNumber: "#34d399", // emerald-400 — 90 / 5 / 0
  syntaxName: "#e4e4e7", // zinc-200 — score / 합계 / n
  syntaxFunc: "#60a5fa", // blue-400 — print
  syntaxOp: "#a1a1aa", // zinc-400 — = ( ) : , . [ ]
  syntaxDictKey: "#c4b5fd", // violet-300 — 강조 토큰
  syntaxDictValue: "#e4e4e7", // zinc-200
  // status
  success: "#22c55e",
  danger: "#ef4444",
  dangerSoft: "rgba(239, 68, 68, 0.10)",
  warn: "#f59e0b",
  warnSoft: "#fef3c7",
  // lesson-5 carry-over (indent visuals)
  indentBg1: "rgba(196, 181, 253, 0.10)",
  indentBg2: "rgba(139, 92, 246, 0.22)",
  indentEdge1: "#c4b5fd",
  indentEdge2: "#8b5cf6",
  // lesson-6 carry-over — 노란 line highlight (Traceback 마지막 줄 강조 scene-03)
  highlightYellow: "#fde047",
  highlightYellowSoft: "rgba(253, 224, 71, 0.20)",
  highlightYellowEdge: "#facc15",
  highlightYellowInk: "#854d0e", // yellow-800 — 노란 강조 위 텍스트는 어둡게 (가독)
  // lesson-10 carry-over — 점 표기 4분해 색 (scene-04 TypeError 문자열/숫자 구분에 재활용)
  fourBoxAccentSoft: "#ede9fe",
  fourBoxAccentDeep: "#5b21b6",
  fourBoxYellowSoft: "#fef9c3", // yellow-100 — 문자열 "3"
  fourBoxYellowDeep: "#854d0e",
  fourBoxPinkSoft: "#fce7f3",
  fourBoxPinkDeep: "#9d174d",
  fourBoxBlueSoft: "#dbeafe", // blue-100 — 숫자 5
  fourBoxBlueDeep: "#1e40af",
  fourBoxAccentBorder: "#a78bfa",
  fourBoxYellowBorder: "#facc15",
  fourBoxPinkBorder: "#f472b6",
  fourBoxBlueBorder: "#60a5fa",
  // lesson-11 carry-over — 빨간 경고 / 녹색 안전
  dangerRed: "#dc2626", // red-600
  dangerRedDeep: "#991b1b", // red-800
  dangerRedSoft: "#fee2e2", // red-100
  dangerRedBorder: "#fca5a5", // red-300
  safeGreen: "#22c55e", // green-500
  safeGreenDeep: "#15803d", // green-700
  safeGreenSoft: "#dcfce7", // green-100
  safeGreenBorder: "#86efac", // green-300
  // lesson-12 추가 — Traceback 박스 (scene-02/03)
  traceBg: "#1e1e2e", // 어두운 콘솔 배경 (살짝 보라기 — catppuccin mocha 톤)
  traceBgGlow: "rgba(139, 92, 246, 0.10)", // 재프레이밍 후 옅은 violet glow
  traceBarRed: "#f87171", // red-400 — 좌측 세로 막대
  traceInk: "#cdd6f4", // 밝은 콘솔 텍스트
  traceMuted: "#6c7086", // 흐릿 처리용 (윗줄 opacity 0.4 톤)
  traceErrName: "#f38ba8", // 에러 이름 (NameError) 핑크-레드
  // lesson-12 추가 — AI 좋은/나쁜 질문 패널 (scene-08)
  aiGoodBorder: "#86efac", // green-300
  aiGoodTint: "#f0fdf4", // green-50
  aiBadBorder: "#e4e4e7", // zinc-200 (톤 다운)
  aiBadTint: "#fafafa", // zinc-50
  aiBubbleBg: "#ffffff",
} as const;

export const fonts = {
  sans: 'Pretendard, "Noto Sans KR", system-ui, -apple-system, sans-serif',
  mono: '"JetBrains Mono", "Fira Code", ui-monospace, "SF Mono", Menlo, Consolas, monospace',
} as const;

export const radii = {
  card: 24,
  pill: 999,
  sm: 8,
  md: 12,
} as const;

export const shadows = {
  card: "0 4px 24px -8px rgba(24, 24, 27, 0.10), 0 1px 2px rgba(24, 24, 27, 0.04)",
  cardSoft: "0 2px 12px -4px rgba(24, 24, 27, 0.06)",
} as const;
