/**
 * Lesson 10 design tokens.
 *
 * Identical to lesson-8 theme — kept as a per-lesson copy (not imported) to
 * keep `videos/<courseId>/<lessonId>/03-composition/` as a self-contained
 * unit per the workspace-layout contract.
 *
 *   - background zinc-50 (#fafafa) for page; zinc-900 (#18181b) for code panels
 *   - violet accent (#8b5cf6 = violet-500, #7c3aed = violet-600, #a855f7 = purple-500)
 *   - rounded-2xl cards with soft shadow
 *   - Pretendard 1순위, fallback Noto Sans KR / system-ui
 *
 * Lesson-10 추가 색상:
 *   - 점 표기 4분해용 4색 (scene-05): accent (random), yellow (.), pink (randint),
 *     blue ((1, 6)). 각 색에 soft (배경) / deep (텍스트) 페어 정의.
 *   - boxGrey / boxGreyBorder — 도구 상자 회색 톤 (scene-03 의 import-only 상태).
 *   - boxActive / boxActiveBorder — 도구 상자 정상색 (scene-04 의 호출 후 상태).
 *     scene-04 의 회색→정상색 변환 interpolate(frame, [start, end], [boxGrey, boxActive])
 *     로 색 자체를 보간.
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
  syntaxKeyword: "#c084fc", // purple-400 — for/while/if/in/import/from
  syntaxString: "#fbbf24", // amber-400 — "가위"/"바위"/"보"
  syntaxNumber: "#34d399", // emerald-400 — 1/6
  syntaxName: "#e4e4e7", // zinc-200 — random / 눈 / scores
  syntaxFunc: "#60a5fa", // blue-400 — print / randint / choice
  syntaxOp: "#a1a1aa", // zinc-400 — = ( ) : { } [ ] , .
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
  // lesson-10 추가 — 점 표기 4분해 (scene-05)
  fourBoxAccentSoft: "#ede9fe", // violet-100
  fourBoxAccentDeep: "#5b21b6", // violet-800
  fourBoxYellowSoft: "#fef9c3", // yellow-100
  fourBoxYellowDeep: "#854d0e", // yellow-800
  fourBoxPinkSoft: "#fce7f3", // pink-100
  fourBoxPinkDeep: "#9d174d", // pink-800
  fourBoxBlueSoft: "#dbeafe", // blue-100
  fourBoxBlueDeep: "#1e40af", // blue-800
  fourBoxAccentBorder: "#a78bfa",
  fourBoxYellowBorder: "#facc15",
  fourBoxPinkBorder: "#f472b6",
  fourBoxBlueBorder: "#60a5fa",
  // lesson-10 추가 — 도구 상자 회색/정상 토글 (scene-02 / 03 / 04)
  boxGrey: "#e4e4e7", // zinc-200 (회색 톤)
  boxGreyBorder: "#a1a1aa", // zinc-400
  boxGreyText: "#71717a", // zinc-500 (라벨 텍스트)
  boxActive: "#ede9fe", // violet-100 (정상 톤)
  boxActiveBorder: "#8b5cf6", // violet-500
  boxActiveText: "#5b21b6", // violet-800
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
