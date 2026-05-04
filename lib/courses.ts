// 학습 강의 데이터 타입과 mock 데이터.
// 추후 backend-developer가 만든 API/Server Action 응답으로 교체할 예정.
// (이 파일은 클라이언트/서버 어디서든 import 가능한 순수 데이터 모듈)

export type CourseStatus = "in-progress" | "done" | "not-started"
export type CourseLevel = "beginner" | "intermediate" | "advanced"
export type CourseTrack = "frontend" | "backend"

export type CourseIcon = {
  /** lucide-react 아이콘 이름 또는 짧은 텍스트 글리프(예: "▲", "TS") */
  glyph: string
  /** Tailwind 색상 클래스 — 아이콘 박스 배경/포어그라운드 (예: "bg-blue-100 text-blue-600") */
  tone: string
}

export type Course = {
  id: string
  track: CourseTrack
  title: string
  description: string
  status: CourseStatus
  level: CourseLevel
  /** 진행 단원 수 / 전체 단원 수 */
  progress: { current: number; total: number }
  icon: CourseIcon
}

/** 카드 1장에 들어가는 모든 정보. id는 React key 용도. */
export const courses: Course[] = [
  // ── 프론트엔드 ─────────────────────────────────────────────
  {
    id: "fe-css",
    track: "frontend",
    title: "CSS 스타일링",
    description: "웹 페이지를 꾸미는 스타일을 배웁니다.",
    status: "in-progress",
    level: "beginner",
    progress: { current: 5, total: 12 },
    icon: { glyph: "Paintbrush", tone: "bg-blue-100 text-blue-600" },
  },
  {
    id: "fe-react",
    track: "frontend",
    title: "React 기초",
    description: "리액트로 UI를 만드는 방법을 배웁니다.",
    status: "in-progress",
    level: "beginner",
    progress: { current: 10, total: 18 },
    icon: { glyph: "Atom", tone: "bg-emerald-100 text-emerald-600" },
  },
  {
    id: "fe-next",
    track: "frontend",
    title: "Next.js 개발",
    description: "풀스택 React 프레임워크를 배웁니다",
    status: "not-started",
    level: "intermediate",
    progress: { current: 0, total: 16 },
    icon: { glyph: "Triangle", tone: "bg-zinc-200 text-zinc-700" },
  },
  {
    id: "fe-state",
    track: "frontend",
    title: "상태관리 심화",
    description: "Redux, Zustand로 복잡한 상태를 관리합니다",
    status: "in-progress",
    level: "intermediate",
    progress: { current: 4, total: 14 },
    icon: { glyph: "RefreshCw", tone: "bg-violet-100 text-violet-600" },
  },
  {
    id: "fe-html",
    track: "frontend",
    title: "HTML 기초",
    description: "시맨틱 HTML과 웹 접근성까지 깊게 다룹니다",
    status: "in-progress",
    level: "advanced",
    progress: { current: 3, total: 15 },
    icon: { glyph: "FileText", tone: "bg-orange-100 text-orange-600" },
  },
  {
    id: "fe-typescript",
    track: "frontend",
    title: "TypeScript 마스터",
    description: "고급 타입 시스템과 디자인 패턴을 배웁니다",
    status: "in-progress",
    level: "advanced",
    progress: { current: 1, total: 22 },
    icon: { glyph: "Diamond", tone: "bg-sky-100 text-sky-600" },
  },

  // ── 백엔드 ────────────────────────────────────────────────
  // MVP 범위 결정에 따라 Python 백엔드 1개만 노출.
  {
    id: "be-python",
    track: "backend",
    title: "Python 기초",
    description: "변수와 함수부터 차근차근 배웁니다",
    status: "in-progress",
    level: "beginner",
    progress: { current: 10, total: 15 },
    icon: { glyph: "Code2", tone: "bg-rose-100 text-rose-600" },
  },
]

export const frontendCourses = courses.filter((c) => c.track === "frontend")
export const backendCourses = courses.filter((c) => c.track === "backend")
