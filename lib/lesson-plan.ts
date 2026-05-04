// 강의 목록 화면 데이터 모듈.
// MVP는 정적 객체 — 추후 backend-developer가 만든 API/Server Action 응답으로 교체 예정.
// (이 파일은 클라이언트/서버 어디서든 import 가능한 순수 데이터 모듈)

export type LessonStatus = "completed" | "in-progress" | "not-started"

export type Lesson = {
  id: string
  /** 강의 번호 (1-based, UI에서 그대로 노출) */
  number: number
  title: string
  /** 예상 학습 시간(분) */
  durationMinutes: number
  status: LessonStatus
}

export type LessonBadge = {
  id: string
  label: string
  /** lessons icon-map 키 — Rocket, Flame, Zap, Target, Trophy 등 */
  iconHint: string
  acquired: boolean
  /** 옅은 배경 톤 키 — rose, amber, sky, violet, emerald 등 */
  tone: string
}

export type LessonPlan = {
  courseId: string
  totalLessons: number
  lessons: Lesson[]
  tips: string[]
  badges: LessonBadge[]
}

export const pythonLessonPlan: LessonPlan = {
  courseId: "be-python",
  totalLessons: 15,
  lessons: [
    { id: "lesson-1", number: 1, title: "Python이란?", durationMinutes: 10, status: "completed" },
    { id: "lesson-2", number: 2, title: "개발 환경 설치하고 첫 실행하기", durationMinutes: 15, status: "completed" },
    { id: "lesson-3", number: 3, title: "print로 화면에 출력해보기", durationMinutes: 12, status: "completed" },
    { id: "lesson-4", number: 4, title: "변수에 값 담아 사용하기", durationMinutes: 14, status: "completed" },
    { id: "lesson-5", number: 5, title: "숫자, 문자열, 불린 자료형", durationMinutes: 18, status: "completed" },
    { id: "lesson-6", number: 6, title: "연산자로 값 계산하기", durationMinutes: 15, status: "completed" },
    { id: "lesson-7", number: 7, title: "input으로 사용자 입력 받기", durationMinutes: 13, status: "completed" },
    { id: "lesson-8", number: 8, title: "조건문 if / elif / else", durationMinutes: 20, status: "completed" },
    { id: "lesson-9", number: 9, title: "반복문 for와 while", durationMinutes: 22, status: "completed" },
    { id: "lesson-10", number: 10, title: "리스트로 여러 값 다루기", durationMinutes: 20, status: "completed" },
    { id: "lesson-11", number: 11, title: "딕셔너리로 짝지어 저장하기", durationMinutes: 22, status: "in-progress" },
    { id: "lesson-12", number: 12, title: "함수로 코드 묶어 재사용하기", durationMinutes: 24, status: "in-progress" },
    { id: "lesson-13", number: 13, title: "문자열 다루기와 간단 예외 처리", durationMinutes: 20, status: "not-started" },
    { id: "lesson-14", number: 14, title: "파일을 읽고 쓰는 방법", durationMinutes: 22, status: "not-started" },
    { id: "lesson-15", number: 15, title: "프로젝트: 나만의 단어장 만들기", durationMinutes: 40, status: "not-started" },
  ],
  tips: [
    "매일 짧게라도 코드를 직접 쳐보세요",
    "에러 메시지를 천천히 읽어 보세요",
    "배운 예제를 살짝 바꿔서 실험해 보세요",
    "이해 안 되면 다시보기로 복습하세요",
  ],
  badges: [
    { id: "badge-starter", label: "첫걸음", iconHint: "Rocket", acquired: true, tone: "rose" },
    { id: "badge-streak", label: "연속 학습", iconHint: "Flame", acquired: true, tone: "amber" },
    { id: "badge-speed", label: "스피드", iconHint: "Zap", acquired: true, tone: "sky" },
    { id: "badge-grit", label: "끈기", iconHint: "Target", acquired: true, tone: "violet" },
    { id: "badge-finisher", label: "완주", iconHint: "Trophy", acquired: false, tone: "emerald" },
  ],
}

/**
 * courseId → LessonPlan 룩업.
 * MVP는 python 1건만 지원. `python` / `be-python` 둘 다 매칭.
 * 그 외 id는 호출부에서 notFound() 처리.
 */
export const lessonPlanById: Record<string, LessonPlan> = {
  "be-python": pythonLessonPlan,
  python: pythonLessonPlan,
}

export function getLessonPlan(courseId: string): LessonPlan | undefined {
  return lessonPlanById[courseId]
}
