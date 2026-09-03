// 강의 목록 화면 데이터 모듈.
// MVP는 정적 객체 — 추후 backend-developer가 만든 API/Server Action 응답으로 교체 예정.
// (이 파일은 클라이언트/서버 어디서든 import 가능한 순수 데이터 모듈)

export type LessonStatus = "completed" | "in-progress" | "not-started"

export type Lesson = {
  id: string
  /** 강의 번호 (1-based, UI에서 그대로 노출) */
  number: number
  title: string
  /**
   * 예상 학습 시간(분) = 실제 영상 길이(ffprobe 실측, 분 단위 반올림) + 그 강 연습 문제 수 × 7분.
   * 영상 길이는 사실, 연습 7분은 추정치라 UI 라벨에 "예상"을 반드시 붙인다.
   * 영상을 다시 렌더하거나 연습 문제를 추가하면 이 값도 함께 갱신할 것.
   */
  durationMinutes: number
  /** 강의 종류 — 미지정/"video"=영상 강의, "project"=직접 코드 구현 프로젝트(13강~) */
  kind?: "video" | "project"
}

/**
 * 화면 렌더용 — 정적 강의 메타 + 사용자별 진도.
 * status 는 정적 데이터에 두지 않는다(사용자마다 다름). 페이지가
 * `getCourseLessonStatuses` 결과를 붙여서 만든다.
 */
export type LessonWithStatus = Lesson & { status: LessonStatus }

/**
 * 뱃지 표시 데이터. 획득 여부(acquired)는 정적 값이 아니라
 * `lib/learning/stats-queries.ts` 의 deriveBadges 가 실데이터에서 파생한다.
 * (이 파일은 prisma 를 import 하지 않는 순수 모듈이라 타입만 여기 둔다.)
 */
export type LessonBadge = {
  id: string
  label: string
  /** lessons icon-map 키 — Rocket, Flame, Zap, Target, Trophy 등 */
  iconHint: string
  acquired: boolean
  /** 옅은 배경 톤 키 — rose, amber, sky, violet, emerald 등 */
  tone: string
  /** 획득 조건 설명 (예: "3일 연속 학습") */
  hint?: string
}

export type LessonPlan = {
  courseId: string
  totalLessons: number
  lessons: Lesson[]
  tips: string[]
}

export const pythonLessonPlan: LessonPlan = {
  courseId: "be-python",
  totalLessons: 13,
  // durationMinutes 산출 (2026-09-04 실측 반영):
  //   영상 = public/videos/python-lesson-N.mp4 ffprobe 실측을 분 단위 반올림 (합계 43분)
  //   연습 = 그 강 exercise-content.ts 문제 수 × 7분 (추정 — UI 라벨에 "예상" 표기)
  //   강별 내역: 1강 3+7 / 2강 3+0(연습 없음) / 3강 4+14 / 4강 4+21 / 5강 3+21 / 6강 4+21 /
  //             7강 5+21 / 8강 4+21 / 9강 3+21 / 10강 3+14 / 11강 3+7 / 12강 4+14
  //   13강은 영상 없는 프로젝트(계산기) — 문제 1개를 직접 완성하는 시간 40분으로 추정
  lessons: [
    { id: "lesson-1", number: 1, title: "파이썬 개요 & 개발환경", durationMinutes: 10 },
    { id: "lesson-2", number: 2, title: "코딩의 표현 방법", durationMinutes: 3 },
    { id: "lesson-3", number: 3, title: "변수와 자료형", durationMinutes: 18 },
    { id: "lesson-4", number: 4, title: "입력과 연산자", durationMinutes: 25 },
    { id: "lesson-5", number: 5, title: "조건문", durationMinutes: 24 },
    { id: "lesson-6", number: 6, title: "반복문", durationMinutes: 25 },
    { id: "lesson-7", number: 7, title: "리스트", durationMinutes: 26 },
    { id: "lesson-8", number: 8, title: "딕셔너리 & 자료구조", durationMinutes: 25 },
    { id: "lesson-9", number: 9, title: "함수", durationMinutes: 24 },
    { id: "lesson-10", number: 10, title: "모듈 & 랜덤", durationMinutes: 17 },
    { id: "lesson-11", number: 11, title: "파일 입출력", durationMinutes: 10 },
    { id: "lesson-12", number: 12, title: "디버깅 & AI 활용", durationMinutes: 18 },
    { id: "lesson-13", number: 13, title: "계산기 만들기", durationMinutes: 40, kind: "project" },
  ],
  tips: [
    "매일 짧게라도 코드를 직접 쳐보세요",
    "에러 메시지를 천천히 읽어 보세요",
    "배운 예제를 살짝 바꿔서 실험해 보세요",
    "이해 안 되면 다시보기로 복습하세요",
  ],
  // 뱃지는 정적 데이터가 아니라 실데이터 파생 — lib/learning/stats-queries.ts 의 deriveBadges 참조.
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
