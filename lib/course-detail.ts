// 강좌 상세 페이지(소개 탭)에 들어갈 콘텐츠 데이터.
// MVP에서는 정적 객체로 두고, 추후 backend-developer가 만드는 API 응답으로 교체 예정.
// (이 파일은 클라이언트/서버 어디서든 import 가능한 순수 데이터 모듈)

export type CourseDetailStat = {
  totalHours: string
  totalLessons: string
  // 수강생 수·평점은 실데이터가 쌓이기 전까지 미노출 (가짜 수치 금지). optional.
  enrolledCount?: string
  rating?: string
}

export type LearningOutcome = {
  text: string
  /** course-detail 컴포넌트 내부 ICON_MAP 키 */
  iconHint: string
}

export type RoadmapStep = {
  step: number
  label: string
  description: string
}

export type Review = {
  name: string
  tag: string
  rating: number
  comment: string
}

export type CourseCta = {
  headline: string
  subtext: string
  buttonLabel: string
}

export type CourseDetail = {
  title: string
  levelLabel: string
  description: string
  stats: CourseDetailStat
  learningOutcomes: LearningOutcome[]
  roadmap: RoadmapStep[]
  recommendedFor: string[]
  prerequisites: string[]
  cta: CourseCta
  reviews: Review[]
}

export const pythonCourseDetail: CourseDetail = {
  title: "Python 기초",
  levelLabel: "초급",
  description: "변수와 함수부터 차근차근 배웁니다",
  stats: {
    // 예상 학습 시간 = lesson-plan 의 durationMinutes 합계 375분(6시간 15분 — 영상 12강 265 + 프로젝트 13~15강 40/50/60) → 표기 "약 6시간".
    // (강별 = 영상 실측 + 연습 문제 수 × 7분. 영상 실측 합계는 43분.)
    // 실력향상 문제 은행(34문제)은 별도 트랙이라 이 값에 포함하지 않는다.
    totalHours: "약 6시간",
    totalLessons: "13강",
    // enrolledCount·rating: 실제 수강생/평점 데이터가 없어 미노출 (정직 톤 — 가짜 수치 금지).
  },
  learningOutcomes: [
    { text: "변수와 자료형으로 데이터를 다루기", iconHint: "Variable" },
    { text: "조건문으로 상황에 맞는 분기 만들기", iconHint: "GitBranch" },
    { text: "반복문으로 같은 작업을 자동화하기", iconHint: "Repeat" },
    { text: "리스트와 딕셔너리로 데이터 정리하기", iconHint: "Brackets" },
    { text: "함수로 코드를 깔끔하게 묶기", iconHint: "FunctionSquare" },
    { text: "파일 읽고 쓰는 작은 프로그램 완성하기", iconHint: "FileText" },
  ],
  roadmap: [
    { step: 1, label: "개념설명", description: "강의 영상으로 문법을 익혀요" },
    { step: 2, label: "개념응용", description: "강별 연습 문제로 배운 문법을 바로 코드로 써 봐요" },
    { step: 3, label: "문제해결", description: "실력향상 문제에서 전체 코드를 작성하고 자동 채점받아요" },
    { step: 4, label: "학습완료", description: "영상과 연습을 모두 마치면 그 강의가 완료로 기록돼요" },
    { step: 5, label: "성장피드백", description: "AI 진단과 5축 레이더, 주간 리포트로 약한 부분을 봐요" },
    { step: 6, label: "다음단계추천", description: "준비 중 — 다음 코스 안내는 아직 없어요" },
  ],
  recommendedFor: [
    "코딩 자체가 처음이라 두려운 분",
    "다른 언어는 알지만 Python은 처음인 분",
    "비전공자로 새 분야에 도전하는 분",
    "업무 자동화나 데이터에 호기심 있는 분",
  ],
  prerequisites: [
    "Python 3.x 설치된 노트북 또는 PC",
    "VS Code 등 코드 에디터 준비",
    "코딩 경험 없어도 충분히 시작 가능",
    "주 3~4시간 학습 시간 확보 권장",
  ],
  cta: {
    headline: "Python 첫 줄을 함께 써봐요",
    subtext: "영상 12강 + 프로젝트 3강, 예상 6시간",
    buttonLabel: "학습 시작",
  },
  // 실제 수강생 후기가 쌓이기 전까지 미노출 (가짜 후기 금지). 빈 배열이면 소개 페이지에서 후기 섹션을 렌더하지 않는다.
  reviews: [],
}

/**
 * courseId → CourseDetail 룩업.
 * MVP는 python 1건만 지원. 그 외 id는 호출부에서 notFound() 처리.
 */
export const courseDetailById: Record<string, CourseDetail> = {
  "be-python": pythonCourseDetail,
  python: pythonCourseDetail, // 사용자 요청 — `python` 경로도 매칭
}

export function getCourseDetail(courseId: string): CourseDetail | undefined {
  return courseDetailById[courseId]
}
