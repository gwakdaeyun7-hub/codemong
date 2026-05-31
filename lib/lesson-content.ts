// 강의 상세(개념 탭) 화면 데이터 모듈 — 영상-only 모드.
// 화면은 강의 헤더 + 영상 카드 + 이전/다음 네비만 표시. 본문 카드(개념/구조/문법/예시/핵심정리/활용)는 제거됨.
// 추후 본문을 다시 채우거나 새 콘텐츠 모델로 확장할 때 타입을 다시 늘릴 것.
// MVP: lesson-1 ~ lesson-12 정적 객체 보유 (12강 = 마지막 영상 강의, 13강은 프로젝트형).
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

export const pythonLesson7Content: LessonContent = {
  lessonId: "lesson-7",
  lessonNumber: 7,
  title: "리스트",
  durationMinutes: 22,
  subtabs: ["개념", "응용", "시각자료"],
  activeSubtab: "개념",
  video: {
    posterDescription: "여러 값을 하나의 묶음으로 — 리스트와 인덱스, append / del, for 순회",
    transcriptSummary:
      "이 영상에서는 여러 값을 하나의 묶음으로 다루는 리스트를 배웁니다. 자리 번호(인덱스)가 0부터 시작한다는 점, append 로 끝에 더하고 del 로 자리를 빼고 자리 값을 바꾸는 세 동작이 리스트의 모양과 길이를 어떻게 바꾸는지, for 로 값을 하나씩 따라가는 흐름을 학생 점수 묶음 하나로 따라가 볼게요. 마지막엔 2차원 리스트에서 행과 열로 한 칸을 짚는 방법도 살펴봅니다.",
    videoSrc: "/videos/python-lesson-7.mp4",
  },
  navigation: {
    previous: { number: 6, title: "반복문" },
    next: { number: 8, title: "딕셔너리 & 자료구조" },
  },
};

export const pythonLesson8Content: LessonContent = {
  lessonId: "lesson-8",
  lessonNumber: 8,
  title: "딕셔너리 & 자료구조",
  durationMinutes: 20,
  subtabs: ["개념", "응용", "시각자료"],
  activeSubtab: "개념",
  video: {
    posterDescription: "번호 대신 이름표로 찾기 — 딕셔너리 / 튜플 / 셋",
    transcriptSummary:
      "이 영상에서는 리스트 너머의 세 가지 자료구조 — 이름표(키)로 값을 찾는 딕셔너리, 만든 뒤 바꿀 수 없는 튜플, 중복 없이 모으는 셋 — 을 배웁니다. 같은 데이터를 리스트와 딕셔너리로 나란히 두고 어느 쪽이 의미가 바로 보이는지 비교한 뒤, 좌표와 태그 예시로 각 자료구조가 언제 어울리는지 한 문장 기준으로 골라 보는 흐름을 따라가 볼게요.",
    videoSrc: "/videos/python-lesson-8.mp4",
  },
  navigation: {
    previous: { number: 7, title: "리스트" },
    next: { number: 9, title: "함수" },
  },
};

export const pythonLesson9Content: LessonContent = {
  lessonId: "lesson-9",
  lessonNumber: 9,
  title: "함수",
  durationMinutes: 24,
  subtabs: ["개념", "응용", "시각자료"],
  activeSubtab: "개념",
  video: {
    posterDescription: "코드 한 덩어리에 이름 붙이기 — def / 매개변수 / return",
    transcriptSummary:
      "이 영상에서는 반복되는 작업을 이름 붙은 박스로 묶는 함수를 배웁니다. def 로 정의한 함수가 부를 때만 실행된다는 점, 넣어 준 값이 매개변수로 흘러 들어가는 흐름, 그리고 화면에 보여 주는 print 와 값을 돌려주는 return 이 어떻게 다른지 같은 함수의 두 버전을 나란히 비교하며 따라가 볼게요. 마지막엔 함수 안에서 만든 변수가 왜 함수 밖에서는 보이지 않는지도 살펴봅니다.",
    videoSrc: "/videos/python-lesson-9.mp4",
  },
  navigation: {
    previous: { number: 8, title: "딕셔너리 & 자료구조" },
    next: { number: 10, title: "모듈 & 랜덤" },
  },
};

export const pythonLesson10Content: LessonContent = {
  lessonId: "lesson-10",
  lessonNumber: 10,
  title: "모듈 & 랜덤",
  durationMinutes: 18,
  subtabs: ["개념", "응용", "시각자료"],
  activeSubtab: "개념",
  video: {
    posterDescription: "이미 만들어진 도구 상자 꺼내 쓰기 — import 와 random",
    transcriptSummary:
      "이 영상에서는 남이 미리 만들어 둔 코드 묶음을 가져와 쓰는 import 와, 무작위 값을 만드는 random 모듈을 배웁니다. import 는 도구 상자를 데려오는 것일 뿐 도구를 실제로 부르는 것과 다른 일이라는 점, random.randint 로 범위 안 정수를 뽑고 random.choice 로 목록에서 하나를 고르는 두 도구의 쓰임 차이를 주사위와 가위바위보로 따라가 볼게요.",
    videoSrc: "/videos/python-lesson-10.mp4",
  },
  navigation: {
    previous: { number: 9, title: "함수" },
    next: { number: 11, title: "파일 입출력" },
  },
};

export const pythonLesson11Content: LessonContent = {
  lessonId: "lesson-11",
  lessonNumber: 11,
  title: "파일 입출력",
  durationMinutes: 20,
  subtabs: ["개념", "응용", "시각자료"],
  activeSubtab: "개념",
  video: {
    posterDescription: "프로그램이 끝나도 남는 데이터 — with open / write / read",
    transcriptSummary:
      "이 영상에서는 프로그램이 끝나도 결과가 사라지지 않도록 파일에 저장하고 다시 불러오는 방법을 배웁니다. with open 한 줄로 파일을 안전하게 열고, 쓰기 모드에서 write 로 저장하고 읽기 모드에서 read 로 불러오는 흐름을 메모 한 줄로 따라가 볼게요. 쓰기 모드가 기존 내용을 덮어쓴다는 점, with 블록이 끝나면 파일이 자동으로 닫힌다는 점도 짚어 봅니다.",
    videoSrc: "/videos/python-lesson-11.mp4",
  },
  navigation: {
    previous: { number: 10, title: "모듈 & 랜덤" },
    next: { number: 12, title: "디버깅 & AI 활용" },
  },
};

export const pythonLesson12Content: LessonContent = {
  lessonId: "lesson-12",
  lessonNumber: 12,
  title: "디버깅 & AI 활용",
  durationMinutes: 22,
  subtabs: ["개념", "응용", "시각자료"],
  activeSubtab: "개념",
  video: {
    posterDescription: "안 돌아가는 코드를 읽고 고치기 — 에러는 마지막 줄부터, 흐름은 print 로",
    transcriptSummary:
      "이 영상에서는 새 문법 대신, 짠 코드가 안 돌아갈 때 무엇을 보고 어떻게 고치는지를 배웁니다. 빨간 에러(Traceback)는 마지막 줄부터 읽어 원인을 좁히고(문법오류), 에러가 없는데 결과가 틀릴 땐 print 로 중간값을 찍어 기대와 갈라지는 자리를 찾습니다(논리오류). 모르겠으면 그 개념의 강의로 돌아가고(개념미숙), AI 에게는 안 된 코드와 에러를 같이 붙여 묻는 태도까지 — 다음 계산기 만들기 프로젝트에서 막힐 때 빠져나오는 힘을 익혀 봅니다.",
    videoSrc: "/videos/python-lesson-12.mp4",
  },
  navigation: {
    previous: { number: 11, title: "파일 입출력" },
    next: { number: 13, title: "계산기 만들기" },
  },
};

/**
 * (courseId, lessonId) → LessonContent 룩업.
 * MVP: (python | be-python) + (lesson-1 ~ lesson-12) 매칭.
 * lesson-13 은 프로젝트형(영상 콘텐츠 아님) — getProject 로 별도 분기.
 */
const LESSON_CONTENT_INDEX: Record<string, Record<string, LessonContent>> = {
  python: {
    "lesson-1": pythonLesson1Content,
    "lesson-2": pythonLesson2Content,
    "lesson-3": pythonLesson3Content,
    "lesson-4": pythonLesson4Content,
    "lesson-5": pythonLesson5Content,
    "lesson-6": pythonLesson6Content,
    "lesson-7": pythonLesson7Content,
    "lesson-8": pythonLesson8Content,
    "lesson-9": pythonLesson9Content,
    "lesson-10": pythonLesson10Content,
    "lesson-11": pythonLesson11Content,
    "lesson-12": pythonLesson12Content,
  },
  "be-python": {
    "lesson-1": pythonLesson1Content,
    "lesson-2": pythonLesson2Content,
    "lesson-3": pythonLesson3Content,
    "lesson-4": pythonLesson4Content,
    "lesson-5": pythonLesson5Content,
    "lesson-6": pythonLesson6Content,
    "lesson-7": pythonLesson7Content,
    "lesson-8": pythonLesson8Content,
    "lesson-9": pythonLesson9Content,
    "lesson-10": pythonLesson10Content,
    "lesson-11": pythonLesson11Content,
    "lesson-12": pythonLesson12Content,
  },
};

export function getLessonContent(courseId: string, lessonId: string): LessonContent | undefined {
  return LESSON_CONTENT_INDEX[courseId]?.[lessonId];
}
