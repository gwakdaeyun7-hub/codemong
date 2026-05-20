// 강의 상세(개념 탭) 화면 데이터 모듈 — 영상-only 모드.
// 화면은 강의 헤더 + 영상 카드 + 이전/다음 네비만 표시. 본문 카드(개념/구조/문법/예시/핵심정리/활용)는 제거됨.
// 추후 본문을 다시 채우거나 새 콘텐츠 모델로 확장할 때 타입을 다시 늘릴 것.
// MVP: lesson-1 ~ lesson-6 정적 객체 보유. lesson-7+ 는 영상 임베드 미진행 — 별도 라운드.
// 추후 backend-developer가 만들 API로 교체 예정.
// (이 파일은 클라이언트/서버 어디서든 import 가능한 순수 데이터 모듈)

export type LessonVideo = {
  posterDescription: string;
  transcriptSummary: string;
  /** Next.js public/ 기준 절대 경로. 없으면 placeholder 카드만 노출. */
  videoSrc?: string;
};

export type LessonNavTarget = {
  number: number;
  title: string;
};

export type LessonNavigation = {
  previous: LessonNavTarget | null;
  next: LessonNavTarget | null;
};

export type LessonSubtab = "개념" | "응용" | "시각자료";

export type LessonContent = {
  lessonId: string;
  lessonNumber: number;
  title: string;
  durationMinutes: number;
  subtabs: LessonSubtab[];
  activeSubtab: LessonSubtab;
  video: LessonVideo;
  navigation: LessonNavigation;
};

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
};

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
};

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
};

export const pythonLesson4Content: LessonContent = {
  lessonId: "lesson-4",
  lessonNumber: 4,
  title: "입력과 연산자",
  durationMinutes: 16,
  subtabs: ["개념", "응용", "시각자료"],
  activeSubtab: "개념",
  video: {
    posterDescription: "사용자에게 받고, 계산하고, 보여주기 — input() 과 연산자",
    transcriptSummary:
      "이 영상에서는 input() 한 줄로 사용자 값을 받아 변수에 담는 방법부터, int() 형변환의 필요성, 산술·비교·논리 연산자가 어떤 결과를 만드는지 차례로 살펴봅니다. 두 숫자를 받아 합·차·곱·몫을 출력하는 짧은 코드를 함께 읽으며 '받고 → 계산하고 → 보여주는' 흐름을 손으로 따라가 볼게요.",
    videoSrc: "/videos/python-lesson-4.mp4",
  },
  navigation: {
    previous: { number: 3, title: "변수와 자료형" },
    next: { number: 5, title: "조건문" },
  },
};

export const pythonLesson5Content: LessonContent = {
  lessonId: "lesson-5",
  lessonNumber: 5,
  title: "조건문",
  durationMinutes: 20,
  subtabs: ["개념", "응용", "시각자료"],
  activeSubtab: "개념",
  video: {
    posterDescription: "조건에 따라 갈래로 흐르는 코드 — if / elif / else",
    transcriptSummary:
      "이 영상에서는 시험 점수에 따라 합격·재시험·불합격으로 갈라지는 예제로 if / elif / else 의 흐름을 따라가 봅니다. 마지막엔 로그인 상태와 관리자 권한을 함께 따지는 2단 중첩 코드를 읽으며, 입력값이 어느 분기로 흘러 들어가는지 한 줄씩 짚어 볼게요.",
    videoSrc: "/videos/python-lesson-5.mp4",
  },
  navigation: {
    previous: { number: 4, title: "입력과 연산자" },
    next: { number: 6, title: "반복문" },
  },
};

export const pythonLesson6Content: LessonContent = {
  lessonId: "lesson-6",
  lessonNumber: 6,
  title: "반복문",
  durationMinutes: 22,
  subtabs: ["개념", "응용", "시각자료"],
  activeSubtab: "개념",
  video: {
    posterDescription: "같은 일을 여러 번 — for / while / break / continue",
    transcriptSummary:
      "이 영상에서는 2강의 순서도에서 보았던 '위로 되돌아오는 고리'가 코드에서 어떻게 반복문이 되는지 따라가 봅니다. for 와 range 로 정해진 횟수만큼 반복하는 흐름, while 로 조건이 거짓이 될 때까지 반복하는 흐름, 그리고 break · continue 로 루프의 진행을 끊거나 건너뛰는 모습을 한 줄씩 짚어 볼게요.",
    videoSrc: "/videos/python-lesson-6.mp4",
  },
  navigation: {
    previous: { number: 5, title: "조건문" },
    next: { number: 7, title: "리스트" },
  },
};

/**
 * (courseId, lessonId) → LessonContent 룩업.
 * MVP: (python | be-python) + (lesson-1 ~ lesson-6) 매칭.
 * lesson-7+ 는 영상 임베드 미진행 — 호출부에서 notFound() 로 떨어짐.
 */
const LESSON_CONTENT_INDEX: Record<string, Record<string, LessonContent>> = {
  python: {
    "lesson-1": pythonLesson1Content,
    "lesson-2": pythonLesson2Content,
    "lesson-3": pythonLesson3Content,
    "lesson-4": pythonLesson4Content,
    "lesson-5": pythonLesson5Content,
    "lesson-6": pythonLesson6Content,
  },
  "be-python": {
    "lesson-1": pythonLesson1Content,
    "lesson-2": pythonLesson2Content,
    "lesson-3": pythonLesson3Content,
    "lesson-4": pythonLesson4Content,
    "lesson-5": pythonLesson5Content,
    "lesson-6": pythonLesson6Content,
  },
};

export function getLessonContent(courseId: string, lessonId: string): LessonContent | undefined {
  return LESSON_CONTENT_INDEX[courseId]?.[lessonId];
}
