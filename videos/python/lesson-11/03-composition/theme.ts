/**
 * Lesson 11 design tokens.
 *
 * Identical to lesson-10 theme (carry-over) plus lesson-11 추가 색상.
 * Kept as a per-lesson copy (not imported from lesson-10) to keep
 * `videos/<courseId>/<lessonId>/03-composition/` as a self-contained
 * unit per the workspace-layout contract.
 *
 *   - background zinc-50 (#fafafa) for page; zinc-900 (#18181b) for code panels
 *   - violet accent (#8b5cf6 = violet-500, #7c3aed = violet-600, #a855f7 = purple-500)
 *   - rounded-2xl cards with soft shadow
 *   - Pretendard 1순위, fallback Noto Sans KR / system-ui
 *
 * Lesson-11 추가 색상:
 *   - notePaper / noteLine — 노트(공책) 일러스트 (scene-02/04/06/08).
 *   - 4분해용 4색은 lesson-10 carry-over 그대로 사용
 *     (scene-03 의 `open` / `"memo.txt"` / `"w"` / `as f` 박스).
 *   - dangerRed / dangerRedSoft / dangerRedBorder — `"w"` 덮어쓰기 경고 (scene-08).
 *   - safeGreen / safeGreenSoft / safeGreenBorder — with 자동 닫기 안전망 (scene-04/09).
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
  syntaxKeyword: "#c084fc", // purple-400 — with/as/import
  syntaxString: "#fbbf24", // amber-400 — "memo.txt"/"오늘 할 일: 청소"/"w"/"r"
  syntaxNumber: "#34d399", // emerald-400
  syntaxName: "#e4e4e7", // zinc-200 — f/내용
  syntaxFunc: "#60a5fa", // blue-400 — open / print / write / read
  syntaxOp: "#a1a1aa", // zinc-400 — = ( ) : , .
  syntaxDictKey: "#c4b5fd", // violet-300 — 강조 토큰
  syntaxDictValue: "#e4e4e7", // zinc-200
  // status
  success: "#22c55e",
  danger: "#ef4444",
  dangerSoft: "rgba(239, 68, 68, 0.10)",
  warn: "#f59e0b",
  warnSoft: "#fef3c7",
  // lesson-5 carry-over
  indentBg1: "rgba(196, 181, 253, 0.10)",
  indentBg2: "rgba(139, 92, 246, 0.22)",
  indentEdge1: "#c4b5fd",
  indentEdge2: "#8b5cf6",
  // lesson-6 carry-over
  highlightYellow: "#fde047",
  highlightYellowSoft: "rgba(253, 224, 71, 0.18)",
  // lesson-10 carry-over — 점 표기 4분해 (lesson-11 scene-03 에서 재활용)
  fourBoxAccentSoft: "#ede9fe", // violet-100 — `open` (도구)
  fourBoxAccentDeep: "#5b21b6", // violet-800
  fourBoxYellowSoft: "#fef9c3", // yellow-100 — `"memo.txt"` (어느 파일)
  fourBoxYellowDeep: "#854d0e", // yellow-800
  fourBoxPinkSoft: "#fce7f3", // pink-100 — `"w"` (어떤 방식)
  fourBoxPinkDeep: "#9d174d", // pink-800
  fourBoxBlueSoft: "#dbeafe", // blue-100 — `as f` (이름표)
  fourBoxBlueDeep: "#1e40af", // blue-800
  fourBoxAccentBorder: "#a78bfa",
  fourBoxYellowBorder: "#facc15",
  fourBoxPinkBorder: "#f472b6",
  fourBoxBlueBorder: "#60a5fa",
  // lesson-11 추가 — 노트(공책) 일러스트 (scene-02/04/06/08)
  notePaper: "#ede9fe", // violet-100 — 공책 종이 배경
  notePaperEdge: "#c4b5fd", // violet-300 — 공책 테두리
  noteLine: "rgba(139, 92, 246, 0.28)", // violet-500 alpha — 공책 가로줄
  noteLabelBg: "#ffffff",
  noteLabelText: "#5b21b6", // violet-800 — `memo.txt` 라벨
  // lesson-11 추가 — `"w"` 덮어쓰기 경고 (scene-08)
  dangerRed: "#dc2626", // red-600
  dangerRedDeep: "#991b1b", // red-800
  dangerRedSoft: "#fee2e2", // red-100
  dangerRedBorder: "#fca5a5", // red-300
  // lesson-11 추가 — with 자동 닫기 안전망 (scene-04/09)
  safeGreen: "#22c55e", // green-500
  safeGreenDeep: "#15803d", // green-700
  safeGreenSoft: "#dcfce7", // green-100
  safeGreenBorder: "#86efac", // green-300
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
