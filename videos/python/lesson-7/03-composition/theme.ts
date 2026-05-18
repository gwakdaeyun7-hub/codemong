/**
 * Lesson 7 design tokens.
 *
 * Identical to lesson-1/lesson-2/lesson-3/lesson-4/lesson-5/lesson-6 theme —
 * kept as a per-lesson copy (not imported) to keep
 * `videos/<courseId>/<lessonId>/03-composition/` as a self-contained unit
 * per the workspace-layout contract.
 *
 *   - background zinc-50 (#fafafa) for page; zinc-900 (#18181b) for code panels
 *   - violet accent (#8b5cf6 = violet-500, #7c3aed = violet-600, #a855f7 = purple-500)
 *   - rounded-2xl cards with soft shadow
 *   - Pretendard 1순위, fallback Noto Sans KR / system-ui
 *
 * Lesson 5 carry-over: indentBg1 / indentBg2 — 들여쓰기 깊이별 띠 배경
 * Lesson 6 carry-over: highlightYellow / highlightYellowSoft — 형광 박스
 *
 * Lesson 7 신규:
 *   - emptySlotBorder — 빈 자리 점선 박스 border 색 (scene-04 / scene-12)
 *   - gridCellBg — 표 격자 한 칸의 기본 배경 (scene-11)
 *   - gridCellBgHighlighted — 표 격자 행/열 강조 시 배경 (scene-11 — violet-200 톤)
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
  accentLight: "#c4b5fd", // violet-300 — type-on 새 토큰 강조용 / 1단 들여쓰기 가이드
  accentInk: "#5b21b6", // violet-800
  // dark surfaces (terminal / code panel)
  darkBg: "#18181b", // zinc-900
  darkBg2: "#27272a", // zinc-800
  darkInk: "#e4e4e7", // zinc-200
  darkMuted: "#a1a1aa", // zinc-400
  darkAccent: "#a78bfa", // violet-400
  // python syntax token colors (dark panel)
  syntaxKeyword: "#c084fc", // purple-400 — for/in/if/del
  syntaxString: "#fbbf24", // amber-400
  syntaxNumber: "#34d399", // emerald-400 — 0/1/2/3/88/92/76/100/95
  syntaxName: "#e4e4e7", // zinc-200 — scores / s / grid
  syntaxFunc: "#60a5fa", // blue-400 — print / append / len
  syntaxOp: "#a1a1aa", // zinc-400 — = ( ) [ ] . , : #
  syntaxComment: "#71717a", // zinc-500 — # 주석
  // status
  success: "#22c55e",
  danger: "#ef4444", // red-500 — 빈 자리 X 표시 / 점선 박스 / 빨간 X
  warn: "#f59e0b",
  warnSoft: "#fef3c7",
  // lesson-5 carry-over: 들여쓰기 깊이별 띠 배경
  indentBg1: "rgba(196, 181, 253, 0.10)",
  indentBg2: "rgba(139, 92, 246, 0.22)",
  indentEdge1: "#c4b5fd",
  indentEdge2: "#8b5cf6",
  // lesson-6 carry-over: 형광 박스
  highlightYellow: "#fde047",
  highlightYellowSoft: "rgba(253, 224, 71, 0.18)",
  // lesson-7 신규
  emptySlotBorder: "#ef4444", // red-500 — 빈 자리 점선 박스 border
  gridCellBg: "#ffffff", // 표 격자 한 칸 기본 배경
  gridCellBgHighlighted: "rgba(196, 181, 253, 0.45)", // 행 강조 violet-200 톤
  gridCellBgPicked: "#8b5cf6", // 한 칸 강조 violet-500
} as const;

export const fonts = {
  sans: 'Pretendard, "Noto Sans KR", system-ui, -apple-system, sans-serif',
  mono: '"JetBrains Mono", "Fira Code", ui-monospace, "SF Mono", Menlo, Consolas, monospace',
} as const;

export const radii = {
  card: 24, // rounded-2xl
  pill: 999,
  sm: 8,
  md: 12,
} as const;

export const shadows = {
  card: "0 4px 24px -8px rgba(24, 24, 27, 0.10), 0 1px 2px rgba(24, 24, 27, 0.04)",
  cardSoft: "0 2px 12px -4px rgba(24, 24, 27, 0.06)",
} as const;
