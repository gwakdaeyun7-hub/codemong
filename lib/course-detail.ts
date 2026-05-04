// 강좌 상세 페이지(소개 탭)에 들어갈 콘텐츠 데이터.
// MVP에서는 정적 객체로 두고, 추후 backend-developer가 만드는 API 응답으로 교체 예정.
// (이 파일은 클라이언트/서버 어디서든 import 가능한 순수 데이터 모듈)

export type CourseDetailStat = {
  totalHours: string
  totalLessons: string
  enrolledCount: string
  rating: string
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
    totalHours: "약 10시간",
    totalLessons: "15강",
    enrolledCount: "3,240명",
    rating: "4.9 / 5",
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
    { step: 1, label: "개념설명", description: "변수, 함수 등 기초 문법을 예제로 익혀요" },
    { step: 2, label: "개념응용", description: "배운 문법을 작은 코드에 직접 적용해요" },
    { step: 3, label: "문제해결", description: "퀴즈와 미니 과제로 실력을 점검해요" },
    { step: 4, label: "학습완료", description: "각 단원의 핵심 개념을 정리하고 마무리해요" },
    { step: 5, label: "성장피드백", description: "오답을 분석해 약한 부분을 보완해요" },
    { step: 6, label: "다음단계추천", description: "데이터 분석, 웹 백엔드 등 다음 길을 안내해요" },
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
    headline: "준비됐나요? Python 첫 줄을 함께 써봐요!",
    subtext: "개념설명 탭으로 이동해 첫 번째 강의를 시작합니다.",
    buttonLabel: "학습 시작",
  },
  reviews: [
    {
      name: "이서연",
      tag: "완전 입문자",
      rating: 5,
      comment:
        "코딩이 정말 처음이라 변수가 뭔지도 몰랐는데, 예제 하나하나 따라가다 보니 어느새 조건문까지 직접 짜고 있어요. 오답이 나와도 왜 틀렸는지 알려줘서 무섭지 않았어요.",
    },
    {
      name: "박준호",
      tag: "JS 경험자",
      rating: 5,
      comment:
        "JavaScript는 다뤄봤지만 Python은 처음이었어요. 리스트와 딕셔너리 부분에서 두 언어 차이를 자연스럽게 정리할 수 있어서 빠르게 익숙해졌습니다.",
    },
    {
      name: "김지민",
      tag: "마케터",
      rating: 5,
      comment:
        "퇴근 후 시간을 짜내서 듣고 있는데, 한 강의가 짧아 부담이 적어요. 반복문으로 간단한 작업을 자동화하는 예제를 보고 업무에도 바로 써먹을 수 있겠다 싶었어요.",
    },
  ],
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
