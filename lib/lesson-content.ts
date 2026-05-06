// 강의 상세(개념 탭) 화면 데이터 모듈 — 영상-only 모드.
// 화면은 강의 헤더 + 영상 카드 + 이전/다음 네비만 표시. 본문 카드(개념/구조/문법/예시/핵심정리/활용)는 제거됨.
// 추후 본문을 다시 채우거나 새 콘텐츠 모델로 확장할 때 타입을 다시 늘릴 것.
// MVP: lesson-1 만 정적 객체 보유. 추후 backend-developer가 만들 API로 교체 예정.
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

/**
 * (courseId, lessonId) → LessonContent 룩업.
 * MVP: (python | be-python) + lesson-1 만 매칭. 그 외는 호출부에서 notFound() 처리.
 */
const LESSON_CONTENT_INDEX: Record<string, Record<string, LessonContent>> = {
  python: { "lesson-1": pythonLesson1Content },
  "be-python": { "lesson-1": pythonLesson1Content },
}

export function getLessonContent(
  courseId: string,
  lessonId: string,
): LessonContent | undefined {
  return LESSON_CONTENT_INDEX[courseId]?.[lessonId]
}
