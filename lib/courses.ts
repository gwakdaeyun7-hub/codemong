// 코스 카드의 정적 메타 데이터 (제목·설명·난이도·아이콘).
// 사용자별 진행 상태(status/progress)는 여기 두지 않고 렌더 시점에 실데이터로 채운다.
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

/**
 * 코스의 정적 메타 (제목·설명·난이도·아이콘).
 * status / progress 는 이 파일에 두지 않는다 — 사용자별 실데이터이므로
 * 렌더 시점에 progress-queries 의 이수율로 채워 넣는다 (CourseCardData 참조).
 */
export type Course = {
  id: string
  track: CourseTrack
  title: string
  description: string
  level: CourseLevel
  icon: CourseIcon
}

/** 카드 렌더에 필요한 형태 — 정적 메타 + 사용자별 진행 상태. */
export type CourseCardData = Course & {
  status: CourseStatus
  /** 완료 단원 수 / 전체 단원 수 */
  progress: { current: number; total: number }
}

/** 카드 1장에 들어가는 정적 정보. id는 React key 용도. */
export const courses: Course[] = [
  // ── 백엔드 ────────────────────────────────────────────────
  // MVP 범위 결정에 따라 Python 백엔드 1개만 노출.
  {
    id: "be-python",
    track: "backend",
    title: "Python 기초",
    description: "변수와 함수부터 차근차근 배웁니다",
    level: "beginner",
    icon: { glyph: "Code2", tone: "bg-rose-100 text-rose-600" },
  },
]

export const backendCourses = courses.filter((c) => c.track === "backend")
