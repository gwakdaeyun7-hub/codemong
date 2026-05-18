/**
 * Lesson 8 design tokens.
 *
 * Identical to lesson-1/lesson-2/lesson-3/lesson-4/lesson-5/lesson-6 theme — kept as
 * a per-lesson copy (not imported) to keep
 * `videos/<courseId>/<lessonId>/03-composition/` as a self-contained unit
 * per the workspace-layout contract.
 *
 *   - background zinc-50 (#fafafa) for page; zinc-900 (#18181b) for code panels
 *   - violet accent (#8b5cf6 = violet-500, #7c3aed = violet-600, #a855f7 = purple-500)
 *   - rounded-2xl cards with soft shadow
 *   - Pretendard 1순위, fallback Noto Sans KR / system-ui
 *
 * Lesson 5 carry-over (also used in lesson-6/7/8):
 *   - indentBg1 / indentBg2 — 들여쓰기 깊이별 띠 배경
 *
 * Lesson 6 carry-over (also used in lesson-8 — KeyError / TypeError 강조):
 *   - highlightYellow / highlightYellowSoft — 정적 형광 박스
 *
 * Lesson 8 추가:
 *   - keyTokenColor — `dict` 의 키(이름표) 강조 색 (옅은 violet)
 *   - valueTokenColor — `dict` 의 값 강조 색 (zinc-200 = darkInk 그대로)
 *     키 박스 / 값 박스 시각 구분에 사용.
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
  // python syntax token colors (dark panel) — 정적 토크나이즈 대신 인라인 색칠 패턴
  syntaxKeyword: "#c084fc", // purple-400 — for/while/if/in
  syntaxString: "#fbbf24", // amber-400 — "수학"/"영어"/"과학"
  syntaxNumber: "#34d399", // emerald-400 — 95/80/70/37.5/127.0
  syntaxName: "#e4e4e7", // zinc-200 — scores / 좌표 / 수강과목
  syntaxFunc: "#60a5fa", // blue-400 — print / get
  syntaxOp: "#a1a1aa", // zinc-400 — = ( ) : { } [ ] ,
  // lesson-8 추가: dict 키/값 시각 구분 (다크 패널 안)
  syntaxDictKey: "#c4b5fd", // violet-300 — 이름표(키) 강조
  syntaxDictValue: "#e4e4e7", // zinc-200 — 값 (darkInk 와 동일하지만 명시)
  // status
  success: "#22c55e",
  danger: "#ef4444", // red-500 — KeyError / TypeError 박스 외곽
  dangerSoft: "rgba(239, 68, 68, 0.10)", // 빨간 박스 옅은 배경
  warn: "#f59e0b", // amber-500 — 형광펜 강조용
  warnSoft: "#fef3c7", // amber-100 — 노란 형광펜 배경
  // lesson-5 carry-over: 들여쓰기 깊이별 띠 배경
  indentBg1: "rgba(196, 181, 253, 0.10)", // violet-300 옅게 — 1단 깊이
  indentBg2: "rgba(139, 92, 246, 0.22)", // violet-500 진하게 — 2단 깊이
  indentEdge1: "#c4b5fd", // violet-300 — 1단 세로 가이드 라인
  indentEdge2: "#8b5cf6", // violet-500 — 2단 세로 가이드 라인
  // lesson-6 carry-over: 정적 형광 박스 outline
  highlightYellow: "#fde047", // yellow-300
  highlightYellowSoft: "rgba(253, 224, 71, 0.18)",
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
