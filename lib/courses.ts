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
  // ── 백엔드 ────────────────────────────────────────────────
  // MVP 범위 결정에 따라 Python 백엔드 1개만 노출.
  {
    id: "be-python",
    track: "backend",
    title: "Python 기초",
    description: "변수와 함수부터 차근차근 배웁니다",
    status: "in-progress",
    level: "beginner",
    progress: { current: 7, total: 12 },
    icon: { glyph: "Code2", tone: "bg-rose-100 text-rose-600" },
  },
]

export const backendCourses = courses.filter((c) => c.track === "backend")
