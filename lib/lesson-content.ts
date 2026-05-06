// 강의 상세(개념 탭) 화면 데이터 모듈.
// MVP: Python `lesson-1` 만 정적 객체로 보유. 추후 backend-developer가 만들 API로 교체 예정.
// (이 파일은 클라이언트/서버 어디서든 import 가능한 순수 데이터 모듈)

export type ContentTone =
  | "violet"
  | "blue"
  | "amber"
  | "emerald"
  | "rose"
  | "sky"

export type ConceptPillar = {
  label: string
  description: string
  /** lesson-content/icon-map.ts 키 */
  iconHint: string
}

export type ConceptIntro = {
  headline: string
  paragraphs: string[]
  pillars: ConceptPillar[]
}

export type LessonVideo = {
  posterDescription: string
  transcriptSummary: string
}

export type StructureNode = {
  label: string
  caption: string
  tone: ContentTone
}

export type StructureDiagram = {
  title: string
  description: string
  nodes: StructureNode[]
  relation: string
}

export type SyntaxPart = {
  token: string
  role: string
}

export type SyntaxMainExample = {
  code: string
  parts: SyntaxPart[]
}

export type SyntaxPattern = {
  label: string
  code: string
  description: string
}

export type SyntaxGuide = {
  title: string
  description: string
  mainExample: SyntaxMainExample
  commonPatterns: SyntaxPattern[]
}

export type ExampleCode = {
  title: string
  intro: string
  code: string
  expectedOutput: string
  notes: string
}

export type KeyPoint = {
  text: string
  tone: ContentTone
}

export type RealWorldUse = {
  title: string
  description: string
  examples: string[]
  /** lesson-content/icon-map.ts 키 */
  iconHint: string
  tone: ContentTone
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
  conceptIntro: ConceptIntro
  video: LessonVideo
  structureDiagram: StructureDiagram
  syntaxGuide: SyntaxGuide
  exampleCode: ExampleCode
  keyPoints: KeyPoint[]
  realWorldUses: RealWorldUse[]
  navigation: LessonNavigation
}

export const pythonLesson1Content: LessonContent = {
  lessonId: "lesson-1",
  lessonNumber: 1,
  title: "파이썬 개요 & 개발환경",
  durationMinutes: 18,
  subtabs: ["개념", "응용", "시각자료"],
  activeSubtab: "개념",
  conceptIntro: {
    headline:
      "Python은 사람이 읽기 쉬운 문장처럼 쓸 수 있도록 만들어진 프로그래밍 언어예요.",
    paragraphs: [
      "Python(파이썬)은 컴퓨터에게 일을 시키는 언어 중에서도 가장 자연스럽게 읽히는 언어로 손꼽혀요. 영어 문장과 비슷한 형태라 처음 코드를 보는 사람도 무엇을 하려는 코드인지 어렴풋이 짐작할 수 있어요.",
      "그래서 데이터 분석가, 인공지능 연구자, 학생, 회사원까지 다양한 사람이 Python으로 자기 일을 자동화하고 새로운 것을 만들어요. 이 강의에서는 Python이 어떤 언어인지 큰 그림부터 천천히 살펴볼게요.",
    ],
    pillars: [
      {
        label: "쉬운 문법",
        description: "영어 문장처럼 읽혀 입문이 부담 없어요.",
        iconHint: "BookOpen",
      },
      {
        label: "다양한 활용",
        description: "데이터, 웹, AI, 자동화까지 폭넓어요.",
        iconHint: "Layers",
      },
      {
        label: "큰 커뮤니티",
        description: "자료와 도와줄 사람이 정말 많아요.",
        iconHint: "Users",
      },
    ],
  },
  video: {
    posterDescription: "Python의 첫 인사 — Hello, World!",
    transcriptSummary:
      "이 영상에서는 Python이 어떤 언어인지, 코드가 어떤 흐름으로 실행되는지 한눈에 보여드려요. 가장 짧은 코드 한 줄로 컴퓨터에게 인사하는 모습을 함께 따라가 볼게요.",
  },
  structureDiagram: {
    title: "Python 코드는 어떻게 실행될까?",
    description: "내가 쓴 코드가 결과로 바뀌기까지의 흐름이에요.",
    nodes: [
      {
        label: "코드 작성",
        caption: "에디터에 Python 문장을 적어요.",
        tone: "violet",
      },
      {
        label: "Python 인터프리터",
        caption: "코드를 한 줄씩 읽고 해석해요.",
        tone: "blue",
      },
      {
        label: "컴퓨터 실행",
        caption: "해석된 명령을 컴퓨터가 처리해요.",
        tone: "amber",
      },
      {
        label: "결과 출력",
        caption: "화면에 결과가 바로 나타나요.",
        tone: "emerald",
      },
    ],
    relation: "위에서 아래로 한 단계씩 이어지며 결과가 만들어져요.",
  },
  syntaxGuide: {
    title: "Python 문법, 이렇게 생겼어요",
    description: "가장 짧은 한 줄로 문법의 모양을 익혀 볼게요.",
    mainExample: {
      code: `print("Hello World!")`,
      parts: [
        { token: "print", role: "화면에 보여주는 함수" },
        { token: "( )", role: "함수에 값을 전달하는 괄호" },
        { token: `"Hello World!"`, role: "따옴표로 감싼 문자열" },
        { token: ";  없음", role: "Python은 줄 끝에 세미콜론을 안 써요" },
      ],
    },
    commonPatterns: [
      {
        label: "변수",
        code: `name = "민수"`,
        description: "값에 이름표를 붙여 저장해요.",
      },
      {
        label: "숫자 계산",
        code: `total = 1500 + 2000`,
        description: "숫자도 그대로 더하고 빼요.",
      },
      {
        label: "출력",
        code: `print(name)`,
        description: "변수 안의 값을 화면에 보여줘요.",
      },
      {
        label: "주석",
        code: `# 이 줄은 설명이에요`,
        description: "샵 뒤 글은 컴퓨터가 무시해요.",
      },
    ],
  },
  exampleCode: {
    title: "예시 코드",
    intro: "직접 한 줄씩 입력해 보고 결과가 어떻게 나오는지 확인해 보세요.",
    code: `# 첫 Python 코드
name = "민수"
lunch_price = 8500
dinner_price = 12000

print("안녕,", name + "님!")
print("오늘 식비는", lunch_price + dinner_price, "원이에요.")`,
    expectedOutput: `안녕, 민수님!
오늘 식비는 20500 원이에요.`,
    notes:
      "변수에 값을 담아 두면 이후 코드에서 그 이름만 불러도 같은 값을 다시 쓸 수 있어요. print는 쉼표로 여러 값을 한 번에 보여줘요.",
  },
  keyPoints: [
    { text: "Python은 사람이 읽기 쉬운 프로그래밍 언어예요.", tone: "violet" },
    { text: "코드는 위에서 아래로 한 줄씩 실행돼요.", tone: "blue" },
    { text: "값에 이름을 붙여 저장하는 도구가 변수예요.", tone: "emerald" },
    { text: "print는 결과를 화면에 보여주는 가장 기본적인 함수예요.", tone: "amber" },
  ],
  realWorldUses: [
    {
      title: "데이터 분석",
      description:
        "엑셀로 다루기 힘든 큰 표도 Python이라면 빠르게 정리하고 그래프까지 그릴 수 있어요.",
      examples: ["매출 표 분석", "설문 결과 정리"],
      iconHint: "BarChart3",
      tone: "violet",
    },
    {
      title: "업무 자동화",
      description:
        "매일 반복하는 단순 작업을 Python에게 맡기면 클릭 몇 번이 한 줄 명령으로 줄어들어요.",
      examples: ["엑셀 파일 정리", "PDF 합치기"],
      iconHint: "Workflow",
      tone: "emerald",
    },
    {
      title: "인공지능",
      description:
        "요즘 화제가 되는 챗봇과 이미지 생성 모델 대부분이 Python으로 만들어져요.",
      examples: ["챗봇 만들기", "이미지 분류"],
      iconHint: "Brain",
      tone: "rose",
    },
    {
      title: "웹 백엔드",
      description:
        "사용자 눈에 보이지 않는 서버 쪽 로직을 Python으로 만들어 사이트를 움직일 수 있어요.",
      examples: ["회원가입 처리", "API 서버"],
      iconHint: "Server",
      tone: "blue",
    },
    {
      title: "교육·연구",
      description:
        "학교 수업과 논문 실험에서도 자주 쓰여, 연구 결과를 코드로 빠르게 검증해요.",
      examples: ["수학 시각화", "실험 데이터 처리"],
      iconHint: "GraduationCap",
      tone: "amber",
    },
    {
      title: "게임·취미",
      description:
        "간단한 게임이나 그림판처럼 작은 프로그램도 Python으로 즐겁게 만들 수 있어요.",
      examples: ["숫자 맞추기 게임", "거북이 그래픽"],
      iconHint: "Gamepad2",
      tone: "sky",
    },
  ],
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
