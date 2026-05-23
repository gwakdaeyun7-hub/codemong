/**
 * Lesson 9 design tokens.
 *
 * Identical to lesson-1 ~ lesson-8 theme — kept as a per-lesson copy (not
 * imported) to keep `videos/<courseId>/<lessonId>/03-composition/` as a
 * self-contained unit per the workspace-layout contract.
 *
 *   - background zinc-50 (#fafafa) for page; zinc-900 (#18181b) for code panels
 *   - violet accent (#8b5cf6 = violet-500, #7c3aed = violet-600, #a855f7 = purple-500)
 *   - rounded-2xl cards with soft shadow
 *   - Pretendard 1순위, fallback Noto Sans KR / system-ui
 *
 * Lesson 5 carry-over (also used in lesson-6/7/8/9):
 *   - indentBg1 / indentBg2 — 들여쓰기 깊이별 띠 배경 (함수 body 도 1단)
 *
 * Lesson 6 carry-over (also used in lesson-8/9 — error 강조):
 *   - highlightYellow / highlightYellowSoft — 정적 형광 박스
 *
 * Lesson 8 carry-over (also used in lesson-9 — dict 키 시각은 직접 등장 X 이나 token 색 유지):
 *   - syntaxDictKey / syntaxDictValue — 9강 에선 코드에 dict 가 등장하지 않으나
 *     theme 전체를 lesson-8 과 동일하게 유지 (재사용 primitive 호환)
 *
 * Lesson 9 추가:
 *   - sleepingBg / sleepingBorder — 함수 _정의만_ 된 상태 ("잠자는") 박스 색
 *   - runningBg / runningBorder — 함수가 _부른_ 상태 ("실행 중") 노란 박스 색
 *   - paramArrow / returnArrow — 매개변수 흐름 / return 되돌아오는 화살표
 *   - scopeOuter / scopeInner — 함수 바깥 / 함수 안 두 칸 메모리 배경 톤
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
  syntaxKeyword: "#c084fc", // purple-400 — def / return / if / in
  syntaxString: "#fbbf24", // amber-400 — "안녕," / "철수"
  syntaxNumber: "#34d399", // emerald-400 — 3 / 5 / 7 / 10 / 14
  syntaxName: "#e4e4e7", // zinc-200 — greet / add / double / result / x
  syntaxFunc: "#60a5fa", // blue-400 — print
  syntaxOp: "#a1a1aa", // zinc-400 — = ( ) : , [ ]
  // lesson-8 carry-over (9강 에선 등장 X 이나 token 색 유지 — 호환)
  syntaxDictKey: "#c4b5fd", // violet-300 — 이름표(키) 강조
  syntaxDictValue: "#e4e4e7", // zinc-200 — 값
  // status
  success: "#22c55e",
  danger: "#ef4444", // red-500 — 빨간 X (scene-10 "그런 이름 없음")
  dangerSoft: "rgba(239, 68, 68, 0.10)",
  warn: "#f59e0b", // amber-500 — 노란 형광 박스
  warnSoft: "#fef3c7", // amber-100
  // lesson-5 carry-over: 들여쓰기 깊이별 띠 배경 (함수 body 도 1단)
  indentBg1: "rgba(196, 181, 253, 0.10)", // violet-300 옅게 — 1단 깊이
  indentBg2: "rgba(139, 92, 246, 0.22)", // violet-500 진하게 — 2단 깊이
  indentEdge1: "#c4b5fd", // violet-300 — 1단 세로 가이드 라인
  indentEdge2: "#8b5cf6", // violet-500 — 2단 세로 가이드 라인
  // lesson-6 carry-over: 정적 형광 박스 outline
  highlightYellow: "#fde047", // yellow-300
  highlightYellowSoft: "rgba(253, 224, 71, 0.18)",
  // lesson-9 추가: 잠자는 상태 / 실행 중 상태 박스
  sleepingBg: "#f4f4f5", // zinc-100 — 함수 정의만 됨 (잠자는)
  sleepingBorder: "#a1a1aa", // zinc-400 — 회색 외곽
  runningBg: "#fef3c7", // amber-100 — 함수 부른 상태 (실행 중)
  runningBorder: "#f59e0b", // amber-500 — 노란 외곽
  // lesson-9 추가: 함수 안 / 바깥 두 칸 메모리 (scene-10)
  scopeOuterBg: "rgba(244, 244, 245, 0.6)", // zinc-100 옅게 — 함수 바깥
  scopeInnerBg: "rgba(237, 233, 254, 0.5)", // violet-100 옅게 — 함수 안
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
