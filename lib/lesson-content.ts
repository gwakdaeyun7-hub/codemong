// 강의 상세(개념 탭) 화면 데이터 모듈 — 영상-only 모드.
// 화면은 강의 헤더 + 영상 카드 + 이전/다음 네비만 표시. 본문 카드(개념/구조/문법/예시/핵심정리/활용)는 제거됨.
// 추후 본문을 다시 채우거나 새 콘텐츠 모델로 확장할 때 타입을 다시 늘릴 것.
// MVP: lesson-1, lesson-2, lesson-3 정적 객체 보유. 추후 backend-developer가 만들 API로 교체 예정.
// (이 파일은 클라이언트/서버 어디서든 import 가능한 순수 데이터 모듈)

export type LessonVideo = {
  posterDescription: string
  transcriptSummary: string
  /** Next.js public/ 기준 절대 경로. 없으면 placeholder 카드만 노출. */
  videoSrc?: string
}

export type LessonNavTarget = {
  number: number
  title: string
}

export type LessonNavigation = {
  previous: LessonNavTarget | null
  next: LessonNavTarget | null
}

export type LessonSubtab = "개념" | "응용" | "시각자료"

export type LessonContent = {
  lessonId: string
  lessonNumber: number
  title: string
  durationMinutes: number
  subtabs: LessonSubtab[]
  activeSubtab: LessonSubtab
  video: LessonVideo
  navigation: LessonNavigation
}

export const pythonLesson1Content: LessonContent = {
  lessonId: "lesson-1",
  lessonNumber: 1,
  title: "파이썬 개요 & 개발환경",
  durationMinutes: 18,
  subtabs: ["개념", "응용", "시각자료"],
  activeSubtab: "개념",
  video: {
    posterDescription: "Python의 첫 인사 — Hello, World!",
    transcriptSummary:
      "이 영상에서는 Python이 어떤 언어인지, 코드가 어떤 흐름으로 실행되는지 한눈에 보여드려요. 가장 짧은 코드 한 줄로 컴퓨터에게 인사하는 모습을 함께 따라가 볼게요.",
    videoSrc: "/videos/python-lesson-1.mp4",
  },
  navigation: {
    previous: null,
    next: { number: 2, title: "코딩의 표현 방법" },
  },
}

export const pythonLesson2Content: LessonContent = {
  lessonId: "lesson-2",
  lessonNumber: 2,
  title: "코딩의 표현 방법",
  durationMinutes: 12,
  subtabs: ["개념", "응용", "시각자료"],
  activeSubtab: "개념",
  video: {
    posterDescription: "자연어 → 의사코드 → 순서도, 문제와 코드 사이의 다리",
    transcriptSummary:
      "이 영상에서는 코드를 쓰기 전에 절차를 머리 밖으로 꺼내 정리하는 세 가지 방법 — 자연어, 의사코드, 순서도 — 를 배웁니다. 셋이 어떻게 다른지, 언제 어떤 걸 쓰는지 편의점 결제 시나리오 하나로 따라가 볼게요.",
    videoSrc: "/videos/python-lesson-2.mp4",
  },
  navigation: {
    previous: { number: 1, title: "파이썬 개요 & 개발환경" },
    next: { number: 3, title: "변수와 자료형" },
  },
}

export const pythonLesson3Content: LessonContent = {
  lessonId: "lesson-3",
  lessonNumber: 3,
  title: "변수와 자료형",
  durationMinutes: 18,
  subtabs: ["개념", "응용", "시각자료"],
  activeSubtab: "개념",
  video: {
    posterDescription: "이름표를 붙여 값을 보관하기 — 변수와 세 가지 자료형",
    transcriptSummary:
      "이 영상에서는 자기소개 카드를 만들며 변수의 개념과 사용법을 익히고, 문자열·정수·실수 세 가지 자료형이 각각 어떤 값에 어울리는지 살펴봅니다. 마지막엔 print 로 변수에 담긴 값을 한 줄씩 출력해 결과를 확인해 볼게요.",
    videoSrc: "/videos/python-lesson-3.mp4",
  },
  navigation: {
    previous: { number: 2, title: "코딩의 표현 방법" },
    next: { number: 4, title: "입력과 연산자" },
  },
}

/**
 * (courseId, lessonId) → LessonContent 룩업.
 * MVP: (python | be-python) + (lesson-1 | lesson-2 | lesson-3) 매칭. 그 외는 호출부에서 notFound() 처리.
 */
const LESSON_CONTENT_INDEX: Record<string, Record<string, LessonContent>> = {
  python: {
    "lesson-1": pythonLesson1Content,
    "lesson-2": pythonLesson2Content,
    "lesson-3": pythonLesson3Content,
  },
  "be-python": {
    "lesson-1": pythonLesson1Content,
    "lesson-2": pythonLesson2Content,
    "lesson-3": pythonLesson3Content,
  },
}

export function getLessonContent(
  courseId: string,
  lessonId: string,
): LessonContent | undefined {
  return LESSON_CONTENT_INDEX[courseId]?.[lessonId]
}
