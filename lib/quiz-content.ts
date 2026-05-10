// 강의별 평가 문제 데이터 모듈 — 추천 알고리즘 친화 스키마.
// 보기마다 misconceptionId 가 붙어 있어, 학습자가 어떤 오답을 골랐는지로
// 어떤 오개념을 가졌는지 자동 라벨링됨. 누적되면 학습자별 약점 벡터가 됨.
// MVP: lesson-1, lesson-2 정적 객체 보유. 추후 backend-developer가 만들 API로 교체 예정.
// (이 파일은 클라이언트/서버 어디서든 import 가능한 순수 데이터 모듈)

export type QuizDifficulty = "easy" | "medium" | "hard"
export type QuizType = "multiple-choice" | "short-answer"
export type QuizScope = "in-lesson" | "applied"

export type Misconception = {
  id: string
  label: string
  description: string
}

export type QuizOption = {
  label: string
  isCorrect: boolean
  /** 오답일 때 어떤 오개념을 진단하는지. 정답 보기에는 없음. */
  misconceptionId?: string
}

export type DisallowedAnswer = {
  value: string
  /** 어떤 오개념을 진단하는 오답 표기인지. 진단 정보가 없는 표기는 생략. */
  misconceptionId?: string
}

export type QuizQuestion = {
  id: string
  lessonId: string
  difficulty: QuizDifficulty
  type: QuizType
  scope: QuizScope
  learningGoal: string
  prompt: string
  /** 객관식만 사용. */
  options?: QuizOption[]
  /** 단답형만 사용 — 정답 표기 (canonical). */
  answer?: string
  /** 단답형만 사용 — 정답으로 인정할 표기 변형들 (대소문자/공백/동의어 등). */
  allowedAnswers?: string[]
  /** 단답형만 사용 — 자주 나올 오답 표기와 그 진단 라벨. */
  disallowedAnswers?: DisallowedAnswer[]
  explanation: string
}

// 1강 오개념 카탈로그.
// M1~M8: programming-language-education-expert 가 강의 본문에서 도출한 main 카테고리.
// M9~M11: 보기 라벨링 시 자연스럽게 추가된 supplementary 라벨
//         (모든 보기/오답 표기가 ID 기반으로 추적되도록).
export const pythonLesson1Misconceptions: Misconception[] = [
  {
    id: "M1",
    label: "언어/에디터 혼동",
    description: "Python 과 VS Code 를 같은 것/세트/대체재로 오해",
  },
  {
    id: "M2",
    label: "PATH 체크 의미 모름",
    description: "Add Python to PATH 를 옵션/꾸밈/UI 설정으로 오해",
  },
  {
    id: "M3",
    label: "버전 확인 명령 혼동",
    description: "python --version 을 설치/업데이트/실행 명령으로 착각",
  },
  {
    id: "M4",
    label: "확장자 오해",
    description: ".py 가 아닌 다른 확장자로 저장해도 된다고 생각",
  },
  {
    id: "M5",
    label: "저장-실행 인과 누락",
    description: "코드를 고치면 자동 반영된다고 생각 (저장 단계 생략)",
  },
  {
    id: "M6",
    label: "Python 2/3 혼동",
    description: "2가 더 새것이거나 어느 쪽을 깔지 모름",
  },
  {
    id: "M7",
    label: "설치 출처 오해",
    description: "공식 사이트 = python.org 가 흐릿함 (앱스토어/광고/임의 사이트도 OK라 오해)",
  },
  {
    id: "M8",
    label: "활용처 협소화",
    description: "파이썬을 특정 분야 (AI 전용, 게임 전용) 언어로 오해 — 1강 quiz 미사용",
  },
  {
    id: "M9",
    label: "카테고리 오해",
    description: "프로그래밍 언어를 OS/앱 등 다른 종류의 소프트웨어로 분류",
  },
  {
    id: "M10",
    label: "강의 외 명령어 추측",
    description: "강의에 없는 가짜 명령어 (run, execute 등) 를 사용해도 된다고 생각",
  },
  {
    id: "M11",
    label: "별도 사이트 혼동",
    description: "pypi.org 등 파이썬 관련 다른 공식 사이트와 혼동",
  },
]

export const pythonLesson1Quiz: QuizQuestion[] = [
  {
    id: "lesson-1-q1",
    lessonId: "lesson-1",
    difficulty: "easy",
    type: "multiple-choice",
    scope: "in-lesson",
    learningGoal: "파이썬을 한 문장으로 정의할 수 있다",
    prompt: "파이썬은 무엇인가요?",
    options: [
      { label: "사람이 읽기 쉽게 만들어진 프로그래밍 언어", isCorrect: true },
      { label: "코드를 작성하고 편집하는 무료 에디터 도구", isCorrect: false, misconceptionId: "M1" },
      { label: "윈도우와 맥에서 쓰는 운영체제의 한 종류", isCorrect: false, misconceptionId: "M9" },
      { label: "인터넷 사이트를 보여 주는 웹 브라우저 프로그램", isCorrect: false, misconceptionId: "M9" },
    ],
    explanation: "파이썬은 프로그래밍 언어. B 처럼 쓰는 도구 (VS Code) 와 헷갈리기 쉬워요.",
  },
  {
    id: "lesson-1-q2",
    lessonId: "lesson-1",
    difficulty: "easy",
    type: "multiple-choice",
    scope: "in-lesson",
    learningGoal: "파이썬과 VS Code 가 서로 다른 것임을 구분한다",
    prompt: "파이썬과 VS Code 의 관계로 알맞은 것은?",
    options: [
      { label: "파이썬은 언어, VS Code 는 그 언어로 코드를 쓰는 도구", isCorrect: true },
      { label: "파이썬은 옛날 이름이고, 지금은 VS Code 라는 이름으로 쓴다", isCorrect: false, misconceptionId: "M1" },
      { label: "VS Code 안에 파이썬이 들어 있어 둘은 항상 함께 설치된다", isCorrect: false, misconceptionId: "M1" },
      { label: "VS Code 는 파이썬을 더 빠르게 만든 새 버전이다", isCorrect: false, misconceptionId: "M1" },
    ],
    explanation: "파이썬은 \"언어\", VS Code 는 \"그 언어로 코드를 쓰는 도구\". 한국어와 워드프로세서의 관계와 비슷.",
  },
  {
    id: "lesson-1-q3",
    lessonId: "lesson-1",
    difficulty: "easy",
    type: "short-answer",
    scope: "in-lesson",
    learningGoal: "파이썬 공식 사이트 주소를 기억한다",
    prompt: "파이썬 공식 다운로드 사이트 주소를 적으세요. (도메인만)",
    answer: "python.org",
    allowedAnswers: [
      "python.org",
      "Python.org",
      "PYTHON.ORG",
      "www.python.org",
      "https://python.org",
      "https://www.python.org",
    ],
    disallowedAnswers: [
      { value: "python.com", misconceptionId: "M7" },
      { value: "python.co.kr", misconceptionId: "M7" },
      { value: "python.io", misconceptionId: "M7" },
      { value: "pypi.org", misconceptionId: "M11" },
    ],
    explanation: "공식은 python.org. 검색 광고·비공식 미러는 변조된 설치 파일일 수 있어 위험.",
  },
  {
    id: "lesson-1-q4",
    lessonId: "lesson-1",
    difficulty: "easy",
    type: "multiple-choice",
    scope: "in-lesson",
    learningGoal: "파이썬 코드 파일의 확장자를 안다",
    prompt: "파이썬 코드 파일은 어떤 확장자로 끝나야 하나요?",
    options: [
      { label: ".py", isCorrect: true },
      { label: ".python", isCorrect: false, misconceptionId: "M4" },
      { label: ".txt", isCorrect: false, misconceptionId: "M4" },
      { label: ".code", isCorrect: false, misconceptionId: "M4" },
    ],
    explanation: ".py 로 끝나야 `python 파일이름.py` 로 실행 가능. .txt 로 저장하면 코드로 인식 안 됨.",
  },
  {
    id: "lesson-1-q5",
    lessonId: "lesson-1",
    difficulty: "medium",
    type: "multiple-choice",
    scope: "in-lesson",
    learningGoal: "Add Python to PATH 체크의 의미를 안다",
    prompt: "윈도우에서 'Add Python to PATH' 를 체크하지 않으면 어떤 일이 생기나요?",
    options: [
      { label: "터미널에서 `python` 명령을 입력해도 인식되지 않는다", isCorrect: true },
      { label: "파이썬이 아예 컴퓨터에 설치되지 않는다", isCorrect: false, misconceptionId: "M2" },
      { label: "파이썬 코드의 실행 속도가 절반으로 느려진다", isCorrect: false, misconceptionId: "M2" },
      { label: "다음번에 컴퓨터를 켤 때마다 다시 설치해야 한다", isCorrect: false, misconceptionId: "M2" },
    ],
    explanation: "PATH 는 \"터미널이 명령을 찾을 위치 목록\". 추가 안 하면 설치는 됐어도 `python` 명령을 못 찾음.",
  },
  {
    id: "lesson-1-q6",
    lessonId: "lesson-1",
    difficulty: "medium",
    type: "multiple-choice",
    scope: "in-lesson",
    learningGoal: "python --version 명령의 목적을 안다",
    prompt: "터미널에 `python --version` 을 입력하는 목적은?",
    options: [
      { label: "파이썬이 잘 설치됐는지, 어떤 버전인지 확인", isCorrect: true },
      { label: "파이썬을 새 버전으로 업데이트", isCorrect: false, misconceptionId: "M3" },
      { label: "파이썬을 처음 설치", isCorrect: false, misconceptionId: "M3" },
      { label: "파이썬 코드를 한 줄 실행", isCorrect: false, misconceptionId: "M3" },
    ],
    explanation: "`--version` 은 \"버전을 알려달라\" 는 요청. `Python 3.12.5` 같은 숫자가 나오면 설치 OK.",
  },
  {
    id: "lesson-1-q7",
    lessonId: "lesson-1",
    difficulty: "medium",
    type: "short-answer",
    scope: "in-lesson",
    learningGoal: "권장 파이썬 메이저 버전을 기억한다",
    prompt: "현재 권장되는 파이썬 메이저 버전 숫자를 적으세요. (숫자 한 글자)",
    answer: "3",
    allowedAnswers: ["3", "Python 3", "python 3", "파이썬 3", "3.x"],
    disallowedAnswers: [
      { value: "2", misconceptionId: "M6" },
      { value: "최신 버전" }, // 진단 정보 없음 — 라벨 부여 X
    ],
    explanation: "파이썬 3 권장. 2 는 더 이상 권장되지 않음.",
  },
  {
    id: "lesson-1-q8",
    lessonId: "lesson-1",
    difficulty: "hard",
    type: "multiple-choice",
    scope: "applied",
    learningGoal: "코드 수정 후 저장하지 않고 실행했을 때 결과를 추론한다",
    prompt:
      "`hello.py` 에 `print(\"Hello, Python\")` 을 저장하고 실행해 화면에 `Hello, Python` 이 나왔다. 코드를 `print(\"안녕, 파이썬\")` 으로 고쳤지만 저장하지 않고 다시 실행하면 화면에 무엇이 나오나요?",
    options: [
      { label: "Hello, Python (이전에 저장된 내용 그대로)", isCorrect: true },
      { label: "안녕, 파이썬 (방금 화면에서 고친 내용)", isCorrect: false, misconceptionId: "M5" },
      { label: "Hello, Python 과 안녕, 파이썬 이 두 줄로 나온다", isCorrect: false, misconceptionId: "M5" },
      { label: "저장하지 않았으므로 아무것도 나오지 않고 오류가 난다", isCorrect: false, misconceptionId: "M5" },
    ],
    explanation: "파이썬은 파일에 저장된 내용을 실행. 화면에서 고쳐도 저장 전이면 파일 내용은 그대로.",
  },
  {
    id: "lesson-1-q9",
    lessonId: "lesson-1",
    difficulty: "hard",
    type: "multiple-choice",
    scope: "applied",
    learningGoal: "Python ≠ VS Code 구분을 잘못된 행동에 적용한다",
    prompt: "친구가 VS Code 를 설치하고 \"파이썬 설치 끝났다\" 라고 합니다. 가장 정확한 조언은?",
    options: [
      { label: "VS Code 는 도구일 뿐, 파이썬은 따로 설치해야 한다", isCorrect: true },
      { label: "VS Code 가 곧 파이썬이니 그대로 쓰면 된다", isCorrect: false, misconceptionId: "M1" },
      { label: "VS Code 를 지우고 파이썬을 다시 설치하라", isCorrect: false, misconceptionId: "M1" },
      { label: "VS Code 안에 파이썬도 같이 설치되니 한 번 더 설치하면 된다", isCorrect: false, misconceptionId: "M1" },
    ],
    explanation: "파이썬과 VS Code 는 별개. VS Code 만으로는 파이썬 코드를 실행할 수 없음. python.org 에서 따로 설치해야 함.",
  },
  {
    id: "lesson-1-q10",
    lessonId: "lesson-1",
    difficulty: "hard",
    type: "short-answer",
    scope: "applied",
    learningGoal: "강의 시연의 명령어 패턴을 다른 파일명에 일반화한다",
    prompt: "`study.py` 파일을 터미널에서 실행하는 명령어 한 줄을 적으세요. (`$` 제외)",
    answer: "python study.py",
    allowedAnswers: ["python study.py", "python3 study.py"],
    disallowedAnswers: [
      { value: "study.py" }, // 인터프리터 호출 누락 — 라벨 부여 X
      { value: "python study", misconceptionId: "M4" },
      { value: "run study.py", misconceptionId: "M10" },
      { value: "execute study.py", misconceptionId: "M10" },
      { value: "python --version study.py", misconceptionId: "M3" },
    ],
    explanation:
      "`python` (실행할 도구) + `study.py` (실행할 파일) 두 부분. 맥에서 `python3` 으로 깔린 분은 `python3 study.py`.",
  },
]

// 2강 오개념 카탈로그.
// M1~M4: 00-objectives.md §3 의 4개 오개념 — 영상에서 정면 처리하는 main 카테고리.
// M5~M10: 보기 라벨링 시 자연스럽게 추가된 supplementary 라벨.
// (1강의 ID 공간과 별개 — lessonId 로 구분되므로 ID 충돌 없음.)
export const pythonLesson2Misconceptions: Misconception[] = [
  {
    id: "M1",
    label: "의사코드를 진짜 코드로 착각",
    description: "의사코드를 파이썬 인터프리터가 읽는 코드로 오해. 그대로 실행해 보려 하거나, 정해진 문법이 하나라고 가정",
  },
  {
    id: "M2",
    label: "판단 기호 한 방향 분기",
    description: "순서도 마름모(판단)에서 화살표가 한쪽으로만 나가도 된다고 생각. 분기는 항상 둘 이상 나가야 흐름이 끊기지 않음",
  },
  {
    id: "M3",
    label: "빠진 단계 자동 채움 기대",
    description: "자연어로 적은 절차에 빠진 암묵 단계를 컴퓨터가 추론해 채워줄 거라 기대. \"사인 누락\" 패턴",
  },
  {
    id: "M4",
    label: "셋 중 우열 가리기",
    description: "자연어/의사코드/순서도 중 어느 하나가 가장 좋거나 정답이라고 생각. 실제로는 용도가 다를 뿐",
  },
  {
    id: "M5",
    label: "표현 단계 생략",
    description: "문제를 받자마자 코드부터 쓸 수 있다고 생각. 표현 단계의 존재 자체를 인식 못 함",
  },
  {
    id: "M6",
    label: "단계 순서 오해",
    description: "자연어 → 의사코드 → 순서도 → 코드 흐름의 순서를 거꾸로 또는 임의로 인식 (예: 순서도부터 그린 뒤 자연어로 푼다고 생각)",
  },
  {
    id: "M7",
    label: "도형 ↔ 역할 매칭 오류",
    description: "순서도 4기호와 역할의 짝을 잘못 외움 (예: 마름모를 처리, 사각형을 판단으로)",
  },
  {
    id: "M8",
    label: "기호의 시각적 의미 무시",
    description: "도형 모양과 역할의 시각적 단서 (마름모의 갈라지는 모서리 = 분기) 를 무시하고 임의로 해석",
  },
  {
    id: "M9",
    label: "의사코드 = 영어 강제",
    description: "의사코드는 반드시 IF/THEN 같은 영어 키워드여야 한다고 오해. 한국어 의사코드도 정당한 표현임을 인식 못 함",
  },
  {
    id: "M10",
    label: "자연어/의사코드 형식 혼동",
    description: "자연어와 의사코드를 같은 형식으로 인식 (둘 다 줄글이거나 둘 다 들여쓰기 코드 모양이라고 생각)",
  },
]

export const pythonLesson2Quiz: QuizQuestion[] = [
  {
    id: "lesson-2-q1",
    lessonId: "lesson-2",
    difficulty: "easy",
    type: "multiple-choice",
    scope: "in-lesson",
    learningGoal: "문제와 코드 사이에 표현 단계가 들어간다는 흐름을 인지한다",
    prompt: "문제를 받았을 때, 코드를 쓰기 전에 보통 거치는 표현 단계의 순서로 가장 자연스러운 것은?",
    options: [
      { label: "자연어 → 의사코드 → 순서도 → 코드", isCorrect: true },
      { label: "코드 → 자연어 → 의사코드 → 순서도", isCorrect: false, misconceptionId: "M5" },
      { label: "순서도 → 자연어 → 의사코드 → 코드", isCorrect: false, misconceptionId: "M6" },
      { label: "의사코드 → 자연어 → 순서도 → 코드", isCorrect: false, misconceptionId: "M6" },
    ],
    explanation: "사람 말로 풀어 쓰고(자연어), 형식을 정돈하고(의사코드), 필요하면 흐름을 그린(순서도) 뒤에 코드로 옮기는 흐름.",
  },
  {
    id: "lesson-2-q2",
    lessonId: "lesson-2",
    difficulty: "easy",
    type: "multiple-choice",
    scope: "in-lesson",
    learningGoal: "자연어가 무엇이고 언제 쓰는지 안다",
    prompt: "\"자연어\" 단계에 대한 설명으로 알맞은 것은?",
    options: [
      { label: "문제를 사람 말로 풀어 쓰는 단계", isCorrect: true },
      { label: "코드 형식에 가깝게 정돈하는 단계", isCorrect: false, misconceptionId: "M10" },
      { label: "절차의 흐름을 도형으로 시각화하는 단계", isCorrect: false, misconceptionId: "M7" },
      { label: "파이썬이 직접 읽고 실행할 수 있는 단계", isCorrect: false, misconceptionId: "M5" },
    ],
    explanation: "자연어는 문제를 처음 받았을 때 사람 말로 풀어 보는 출발점. 도형도 코드도 아님.",
  },
  {
    id: "lesson-2-q3",
    lessonId: "lesson-2",
    difficulty: "easy",
    type: "multiple-choice",
    scope: "in-lesson",
    learningGoal: "의사코드가 파이썬이 실행하는 코드가 아님을 안다",
    prompt: "의사코드에 대한 설명으로 옳은 것은?",
    options: [
      { label: "사람이 절차를 정돈해 읽기 위한 표기로, 파이썬이 직접 읽지는 않는다", isCorrect: true },
      { label: "파이썬이 그대로 읽어 실행할 수 있는 정식 코드의 한 종류이다", isCorrect: false, misconceptionId: "M1" },
      { label: "영어 키워드 IF, THEN, FOR 형식으로만 적어야 한다", isCorrect: false, misconceptionId: "M9" },
      { label: "절차의 흐름을 도형으로 시각화한 그림이다", isCorrect: false, misconceptionId: "M7" },
    ],
    explanation: "의사코드는 우리끼리 약속한 표기. 한국어로 적어도 되고, 정해진 형식이 하나로 고정돼 있지도 않음.",
  },
  {
    id: "lesson-2-q4",
    lessonId: "lesson-2",
    difficulty: "easy",
    type: "short-answer",
    scope: "in-lesson",
    learningGoal: "순서도 기본 4기호 이름을 안다",
    prompt: "순서도의 기본 도형 4가지를 모두 적으세요. (쉼표로 구분)",
    answer: "둥근 사각형, 사각형, 마름모, 평행사변형",
    allowedAnswers: [
      "둥근 사각형, 사각형, 마름모, 평행사변형",
      "둥근사각형, 사각형, 마름모, 평행사변형",
      "타원, 사각형, 마름모, 평행사변형",
    ],
    disallowedAnswers: [
      { value: "둥근 사각형, 사각형, 마름모", misconceptionId: "M7" },
      { value: "사각형, 사각형, 마름모, 평행사변형", misconceptionId: "M7" },
      { value: "원, 삼각형, 사각형, 마름모", misconceptionId: "M8" },
    ],
    explanation: "둥근 사각형(시작/끝), 사각형(처리), 마름모(판단), 평행사변형(입출력). 외우기보다 보면 알아본다 수준이면 충분.",
  },
  {
    id: "lesson-2-q5",
    lessonId: "lesson-2",
    difficulty: "medium",
    type: "multiple-choice",
    scope: "in-lesson",
    learningGoal: "순서도의 도형과 역할의 짝을 구분한다",
    prompt: "순서도에서 \"조건이 갈라지는 판단\" 단계를 나타내는 도형은?",
    options: [
      { label: "마름모", isCorrect: true },
      { label: "사각형", isCorrect: false, misconceptionId: "M7" },
      { label: "평행사변형", isCorrect: false, misconceptionId: "M7" },
      { label: "둥근 사각형", isCorrect: false, misconceptionId: "M7" },
    ],
    explanation: "마름모의 갈라지는 모서리는 \"여기서 흐름이 둘로 나뉜다\" 는 시각 단서. 처리(사각형)와 헷갈리지 않도록.",
  },
  {
    id: "lesson-2-q6",
    lessonId: "lesson-2",
    difficulty: "medium",
    type: "multiple-choice",
    scope: "in-lesson",
    learningGoal: "자연어와 의사코드의 형식 차이를 구분한다",
    prompt: "다음 중 \"의사코드\"에 가까운 것은?",
    options: [
      {
        label: "만약 가격이 5000보다 크면:\n    카드로 결제한다\n아니면:\n    현금으로 결제한다",
        isCorrect: true,
      },
      {
        label: "음료를 골라서 가격을 본다. 5천 원이 넘으면 카드를 내고, 아니면 현금을 낸다.",
        isCorrect: false,
        misconceptionId: "M10",
      },
      {
        label: "[시작] → [가격 확인] → ◇(5천 원 초과?) → [카드/현금] → [끝]",
        isCorrect: false,
        misconceptionId: "M7",
      },
      {
        label: "print(\"가격: \" + str(price))",
        isCorrect: false,
        misconceptionId: "M1",
      },
    ],
    explanation: "의사코드는 코드 형식에 가깝게 정돈한 절차. 줄글(자연어)도, 도형(순서도)도, 실제 파이썬 문법(D)도 아님.",
  },
  {
    id: "lesson-2-q7",
    lessonId: "lesson-2",
    difficulty: "medium",
    type: "multiple-choice",
    scope: "in-lesson",
    learningGoal: "자연어/의사코드/순서도 셋의 우열에 대한 사고를 정리한다",
    prompt: "자연어, 의사코드, 순서도 중 어느 것을 써야 하는지에 대한 설명으로 가장 알맞은 것은?",
    options: [
      { label: "셋 중 하나만 정답인 게 아니라, 상황에 맞춰 골라 쓰거나 셋 다 안 쓸 수도 있다", isCorrect: true },
      { label: "순서도가 가장 정확하므로 모든 절차는 순서도부터 그려야 한다", isCorrect: false, misconceptionId: "M4" },
      { label: "의사코드가 코드에 가장 가까우므로 항상 의사코드만 쓰면 충분하다", isCorrect: false, misconceptionId: "M4" },
      { label: "자연어는 부정확하므로 입문자에게는 권장되지 않는다", isCorrect: false, misconceptionId: "M4" },
    ],
    explanation: "셋은 우열이 아니라 용도가 다름. 처음 풀어쓸 땐 자연어, 정돈할 땐 의사코드, 분기·반복이 복잡할 땐 순서도.",
  },
  {
    id: "lesson-2-q8",
    lessonId: "lesson-2",
    difficulty: "hard",
    type: "multiple-choice",
    scope: "applied",
    learningGoal: "잘못 그린 순서도를 보고 어디가 틀렸는지 짚는다",
    prompt: "다음 순서도가 잘못된 가장 큰 이유는?\n\n[시작] → (가격 확인) → ◇(5천 원 초과?) → \"예\" → [카드 결제] → [끝]",
    options: [
      { label: "판단 마름모에서 \"아니오\" 방향 화살표가 빠져 있다", isCorrect: true },
      { label: "시작은 둥근 사각형이 아니라 평행사변형이어야 한다", isCorrect: false, misconceptionId: "M7" },
      { label: "가격 확인은 처리이므로 평행사변형이 아니라 사각형이어야 한다", isCorrect: false, misconceptionId: "M8" },
      { label: "화살표는 \"예\" / \"아니오\" 라벨 없이 그려야 한다", isCorrect: false, misconceptionId: "M2" },
    ],
    explanation: "마름모는 항상 둘 이상의 분기가 나가야 함. \"예\" 만 있고 \"아니오\" 가 없으면 5천 원 이하일 때 흐름이 막힘.",
  },
  {
    id: "lesson-2-q9",
    lessonId: "lesson-2",
    difficulty: "hard",
    type: "multiple-choice",
    scope: "applied",
    learningGoal: "자연어 절차에 빠진 암묵 단계를 식별한다",
    prompt: "다음 자연어 절차에서 코드로 옮기기 전에 추가로 명시해야 할 단계로 가장 가까운 것은?\n\n1) 음료를 고른다\n2) 가격을 확인한다\n3) 5천 원이 넘으면 카드를 낸다\n4) 아니면 현금을 낸다",
    options: [
      { label: "카드를 낸 뒤 \"사인을 한다\" 단계", isCorrect: true },
      { label: "음료를 고르기 전에 \"편의점에 들어간다\" 단계 (시작 전 상황은 컴퓨터가 자동 처리)", isCorrect: false, misconceptionId: "M3" },
      { label: "\"5천 원이 넘으면 카드를 낸다\" 를 영어 키워드 IF 로 바꾼 단계", isCorrect: false, misconceptionId: "M9" },
      { label: "각 단계 옆에 도형 모양을 그려 넣는 단계", isCorrect: false, misconceptionId: "M7" },
    ],
    explanation: "사람은 \"사인\" 단계를 당연히 채워 읽지만, 컴퓨터는 빠진 단계를 추론하지 않음. 빠진 암묵 단계를 명시해야 다음 단계로 옮길 수 있음.",
  },
  {
    id: "lesson-2-q10",
    lessonId: "lesson-2",
    difficulty: "hard",
    type: "short-answer",
    scope: "applied",
    learningGoal: "셋의 차이를 이해해 예시를 보고 종류를 분류한다",
    prompt: "다음 표현은 자연어, 의사코드, 순서도 중 어느 것에 해당하는지 적으세요.\n\n만약 가격이 5000보다 크면:\n    카드로 결제한다\n아니면:\n    현금으로 결제한다",
    answer: "의사코드",
    allowedAnswers: ["의사코드", "pseudocode", "슈도코드", "의사 코드"],
    disallowedAnswers: [
      { value: "자연어", misconceptionId: "M10" },
      { value: "순서도", misconceptionId: "M7" },
      { value: "파이썬 코드", misconceptionId: "M1" },
      { value: "코드", misconceptionId: "M1" },
    ],
    explanation: "도형 없음 → 순서도 아님. 줄글이 아니라 들여쓰기/콜론으로 형식 정돈됨 → 자연어 아님. 한국어이고 파이썬이 읽지 않음 → 파이썬 코드 아님. 의사코드.",
  },
]

const LESSON_QUIZ_INDEX: Record<string, Record<string, QuizQuestion[]>> = {
  python: { "lesson-1": pythonLesson1Quiz, "lesson-2": pythonLesson2Quiz },
  "be-python": { "lesson-1": pythonLesson1Quiz, "lesson-2": pythonLesson2Quiz },
}

const LESSON_MISCONCEPTIONS_INDEX: Record<
  string,
  Record<string, Misconception[]>
> = {
  python: {
    "lesson-1": pythonLesson1Misconceptions,
    "lesson-2": pythonLesson2Misconceptions,
  },
  "be-python": {
    "lesson-1": pythonLesson1Misconceptions,
    "lesson-2": pythonLesson2Misconceptions,
  },
}

/**
 * (courseId, lessonId) → 평가 문제 배열 룩업.
 * MVP: (python | be-python) + (lesson-1 | lesson-2) 매칭. 그 외는 호출부에서 빈 배열/notFound 처리.
 */
export function getQuiz(
  courseId: string,
  lessonId: string,
): QuizQuestion[] | undefined {
  return LESSON_QUIZ_INDEX[courseId]?.[lessonId]
}

/**
 * (courseId, lessonId) → 해당 강의의 오개념 카탈로그 룩업.
 * 추천 알고리즘이 학습자별 약점 벡터를 만들 때 ID 공간으로 사용.
 * 1강과 2강은 별개 ID 공간 (lessonId 로 구분).
 */
export function getMisconceptions(
  courseId: string,
  lessonId: string,
): Misconception[] | undefined {
  return LESSON_MISCONCEPTIONS_INDEX[courseId]?.[lessonId]
}
