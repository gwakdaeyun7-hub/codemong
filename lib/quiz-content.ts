// 강의별 평가 문제 데이터 모듈 — 추천 알고리즘 친화 스키마.
// 보기마다 misconceptionId 가 붙어 있어, 학습자가 어떤 오답을 골랐는지로
// 어떤 오개념을 가졌는지 자동 라벨링됨. 누적되면 학습자별 약점 벡터가 됨.
// MVP: lesson-1, lesson-2 정적 객체 보유. 추후 backend-developer가 만들 API로 교체 예정.
// (이 파일은 클라이언트/서버 어디서든 import 가능한 순수 데이터 모듈)

export type QuizDifficulty = "easy" | "medium" | "hard"
export type QuizType = "multiple-choice" | "short-answer"
export type QuizScope = "in-lesson" | "applied"
/**
 * 문항 풀 구분.
 * - "evaluation": 강의 직후 모든 학습자에게 동일 노출되는 평가 문항. base mastery 측정 (cold-start).
 * - "practice"  : 추천 알고리즘이 약점/이력에 따라 동적으로 매칭하는 처방 문항. 학습자에게 "복습" 으로 노출.
 */
export type QuizPool = "evaluation" | "practice"

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
  /** 평가/처방 풀 구분. evaluation 은 강의 직후 노출, practice 는 추천 매칭 전용. */
  pool: QuizPool
  /**
   * 같은 학습목표·오개념을 다른 surface 로 묻는 isomorph 묶음 ID.
   * 추천 알고리즘이 같은 그룹에서 두 번 안 뽑게 하거나,
   * Pool A 에서 틀린 문항의 isomorph 를 Pool B 에서 처방할 때 사용.
   * 그룹 네이밍: `<lessonId>-<짧은 의미 키>` (예: "lesson-1-path", "lesson-2-pseudocode-form")
   */
  isomorphGroup?: string
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
    pool: "evaluation",
    isomorphGroup: "lesson-1-python-identity",
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
    pool: "evaluation",
    isomorphGroup: "lesson-1-python-vs-vscode",
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
    pool: "evaluation",
    isomorphGroup: "lesson-1-official-source",
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
    pool: "evaluation",
    isomorphGroup: "lesson-1-extension",
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
    pool: "evaluation",
    isomorphGroup: "lesson-1-path",
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
    pool: "evaluation",
    isomorphGroup: "lesson-1-version-check",
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
    pool: "evaluation",
    isomorphGroup: "lesson-1-py3",
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
    pool: "evaluation",
    isomorphGroup: "lesson-1-save-execute",
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
    pool: "evaluation",
    isomorphGroup: "lesson-1-python-vs-vscode",
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
    pool: "evaluation",
    isomorphGroup: "lesson-1-run-command",
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
  // ─── Pool B (q11~q30) — 추천 시스템이 약점에 따라 동적 매칭하는 처방 문항 ───
  {
    id: "lesson-1-q11",
    lessonId: "lesson-1",
    pool: "practice",
    isomorphGroup: "lesson-1-python-vs-vscode",
    difficulty: "medium",
    type: "multiple-choice",
    scope: "applied",
    learningGoal: "VS Code 의 Run 버튼이 실제로는 별도 설치된 파이썬을 호출함을 이해한다",
    prompt:
      "VS Code 에서 `.py` 파일을 열고 우측 상단의 \"Run\" 버튼을 눌렀더니 코드가 실행됐습니다. 이때 실제로 코드를 \"읽고 실행\" 한 것은 누구인가요?",
    options: [
      { label: "VS Code 가 호출한, 따로 설치된 파이썬 인터프리터", isCorrect: true },
      { label: "VS Code 자체. Run 버튼이 곧 파이썬 역할을 한다", isCorrect: false, misconceptionId: "M1" },
      { label: "운영체제가 자동으로 코드를 해석해 실행한다", isCorrect: false, misconceptionId: "M9" },
      { label: "Run 버튼은 코드를 클라우드 서버에 보내 실행시킨다", isCorrect: false, misconceptionId: "M1" },
    ],
    explanation:
      "Run 버튼은 편의 기능일 뿐. 실제 실행은 따로 설치된 파이썬이 담당. 파이썬을 안 깔면 같은 버튼을 눌러도 실행되지 않음.",
  },
  {
    id: "lesson-1-q12",
    lessonId: "lesson-1",
    pool: "practice",
    isomorphGroup: "lesson-1-python-vs-vscode",
    difficulty: "easy",
    type: "short-answer",
    scope: "in-lesson",
    learningGoal: "파이썬과 VS Code 의 카테고리를 한 줄로 구분한다",
    prompt:
      "빈칸을 채우세요. \"파이썬은 ___, VS Code 는 ___ 이다.\" (쉼표로 구분, 두 단어)",
    answer: "언어, 도구",
    allowedAnswers: [
      "언어, 도구",
      "프로그래밍 언어, 에디터",
      "프로그래밍 언어, 도구",
      "언어, 에디터",
      "프로그래밍언어, 에디터",
      "언어,도구",
      "프로그래밍 언어, 코드 에디터",
    ],
    disallowedAnswers: [
      { value: "도구, 언어", misconceptionId: "M1" },
      { value: "에디터, 언어", misconceptionId: "M1" },
      { value: "언어, 언어", misconceptionId: "M1" },
      { value: "도구, 도구", misconceptionId: "M1" },
    ],
    explanation: "파이썬은 \"언어\", VS Code 는 \"그 언어로 코드를 쓰는 도구\". 한국어와 워드프로세서의 관계.",
  },
  {
    id: "lesson-1-q13",
    lessonId: "lesson-1",
    pool: "practice",
    isomorphGroup: "lesson-1-editor-agnostic",
    difficulty: "medium",
    type: "multiple-choice",
    scope: "applied",
    learningGoal: "코드 작성 도구가 VS Code 에 한정되지 않음을 일반화한다",
    prompt:
      "친구가 \"VS Code 가 없어서 윈도우 메모장으로 파이썬 코드를 적어 봤다\" 고 합니다. 이 코드를 그대로 `.py` 로 저장한 뒤 터미널에서 실행할 수 있을까요?",
    options: [
      { label: "있다. 메모장이든 다른 에디터든 텍스트만 같으면 파이썬이 똑같이 실행한다", isCorrect: true },
      { label: "없다. 파이썬 코드는 반드시 VS Code 에서 작성한 것만 실행된다", isCorrect: false, misconceptionId: "M1" },
      { label: "없다. 메모장은 파이썬과 호환되지 않는 다른 회사 프로그램이다", isCorrect: false, misconceptionId: "M1" },
      { label: "있다. 단, 메모장 안에 파이썬이 내장돼 있어야 가능하다", isCorrect: false, misconceptionId: "M1" },
    ],
    explanation:
      "파이썬은 \"파일 안의 글자\" 만 본다. 어느 에디터로 적었든 글자가 같으면 결과도 같음. VS Code 는 편의 도구일 뿐.",
  },
  {
    id: "lesson-1-q14",
    lessonId: "lesson-1",
    pool: "practice",
    isomorphGroup: "lesson-1-path",
    difficulty: "hard",
    type: "multiple-choice",
    scope: "applied",
    learningGoal: "PATH 변경이 즉시 반영되지 않는 상황을 추론한다",
    prompt:
      "윈도우에서 파이썬을 설치한 뒤 \"Add Python to PATH\" 를 깜박해서 환경변수를 직접 추가했습니다. 그런데 \"이미 열려 있던 터미널 창\" 에 `python --version` 을 쳤더니 여전히 \"인식되지 않는 명령\" 이라고 뜹니다. 이유로 가장 알맞은 것은?",
    options: [
      { label: "PATH 변경은 새로 여는 터미널부터 적용된다. 기존 창은 옛 PATH 를 그대로 들고 있다", isCorrect: true },
      { label: "환경변수에 직접 추가한 PATH 는 효력이 없고, 반드시 설치 시 체크박스로만 가능하다", isCorrect: false, misconceptionId: "M2" },
      { label: "VS Code 를 함께 켜 놓아야 PATH 가 활성화된다", isCorrect: false, misconceptionId: "M1" },
      { label: "파이썬 설치 자체가 실패한 것이므로 다시 설치해야 한다", isCorrect: false, misconceptionId: "M2" },
    ],
    explanation:
      "PATH 는 터미널이 켜질 때 한 번 읽힘. 변경 후엔 터미널을 새로 열어야 새 PATH 가 반영됨. 설치나 VS Code 와는 무관.",
  },
  {
    id: "lesson-1-q15",
    lessonId: "lesson-1",
    pool: "practice",
    isomorphGroup: "lesson-1-path-meaning",
    difficulty: "medium",
    type: "short-answer",
    scope: "in-lesson",
    learningGoal: "PATH 가 무엇을 위한 목록인지 한 단어로 설명한다",
    prompt:
      "빈칸을 채우세요. \"PATH 는 ___ 가 명령을 찾을 위치 목록이다.\" (한 단어)",
    answer: "터미널",
    allowedAnswers: [
      "터미널",
      "쉘",
      "셸",
      "운영체제",
      "OS",
      "command line",
      "커맨드라인",
      "명령 프롬프트",
      "cmd",
    ],
    disallowedAnswers: [
      { value: "VS Code", misconceptionId: "M1" },
      { value: "파이썬", misconceptionId: "M2" },
      { value: "에디터", misconceptionId: "M1" },
      { value: "브라우저", misconceptionId: "M9" },
    ],
    explanation:
      "PATH 는 터미널(쉘) 이 `python` 같은 명령을 입력받았을 때 \"이 명령의 실제 프로그램이 어디 있지?\" 하고 찾아보는 폴더 목록.",
  },
  {
    id: "lesson-1-q16",
    lessonId: "lesson-1",
    pool: "practice",
    isomorphGroup: "lesson-1-path",
    difficulty: "medium",
    type: "multiple-choice",
    scope: "applied",
    learningGoal: "PATH 미체크 시 실제로 나타나는 증상을 식별한다",
    prompt:
      "회사 컴퓨터에 파이썬을 깔면서 \"Add Python to PATH\" 를 체크하지 않았습니다. 이 상태에서 가장 직접적으로 나타나는 증상은?",
    options: [
      { label: "터미널에 `python` 을 쳐도 \"인식되지 않는 명령\" 이라는 메시지가 뜬다", isCorrect: true },
      { label: "VS Code 가 아예 실행되지 않는다", isCorrect: false, misconceptionId: "M1" },
      { label: "컴퓨터를 켤 때마다 파이썬이 알아서 지워진다", isCorrect: false, misconceptionId: "M2" },
      { label: "파이썬으로 만든 모든 파일이 바이러스로 분류된다", isCorrect: false, misconceptionId: "M2" },
    ],
    explanation:
      "설치는 됐지만 터미널이 `python` 을 어디서 찾을지 모름. VS Code 실행 여부와는 무관.",
  },
  {
    id: "lesson-1-q17",
    lessonId: "lesson-1",
    pool: "practice",
    isomorphGroup: "lesson-1-version-check",
    difficulty: "medium",
    type: "multiple-choice",
    scope: "applied",
    learningGoal: "버전 확인 명령의 짧은 형태를 알아본다",
    prompt:
      "스터디에서 친구가 `python --version` 대신 `python -V` (대문자 V) 를 쳤습니다. 이 명령은 무엇을 하나요?",
    options: [
      { label: "`--version` 과 같은 동작. 설치된 파이썬 버전을 알려 준다", isCorrect: true },
      { label: "파이썬을 새 버전으로 자동 업데이트한다", isCorrect: false, misconceptionId: "M3" },
      { label: "파이썬을 처음 설치하는 명령이다", isCorrect: false, misconceptionId: "M3" },
      { label: "현재 폴더의 모든 `.py` 파일을 한꺼번에 실행한다", isCorrect: false, misconceptionId: "M10" },
    ],
    explanation:
      "`-V` 는 `--version` 의 짧은 형태. 둘 다 같은 결과를 보여 줌. 설치·업데이트·실행 명령이 아님.",
  },
  {
    id: "lesson-1-q18",
    lessonId: "lesson-1",
    pool: "practice",
    isomorphGroup: "lesson-1-version-check",
    difficulty: "hard",
    type: "short-answer",
    scope: "applied",
    learningGoal: "버전 확인 출력 결과의 의미를 한 줄로 해석한다",
    prompt:
      "터미널에 `python --version` 을 쳤더니 `Python 3.12.5` 가 출력됐습니다. 이 결과는 무엇을 의미하나요? (한 줄)",
    answer: "파이썬이 잘 설치되어 있고 버전이 3.12.5 임을 의미한다",
    allowedAnswers: [
      "파이썬이 잘 설치되어 있고 버전이 3.12.5 임을 의미한다",
      "파이썬이 설치되어 있고 버전은 3.12.5 다",
      "설치 확인",
      "버전 확인",
      "설치 확인 및 버전 확인",
      "파이썬 3.12.5 가 설치되어 있다",
      "파이썬이 정상 설치되어 있다",
      "설치되어 있다",
      "파이썬 설치됨",
      "파이썬 버전이 3.12.5",
    ],
    disallowedAnswers: [
      { value: "파이썬을 업데이트했다", misconceptionId: "M3" },
      { value: "파이썬이 새로 설치됐다", misconceptionId: "M3" },
      { value: "코드가 실행됐다", misconceptionId: "M3" },
      { value: "최신 버전이다" },
    ],
    explanation:
      "버전 숫자가 출력됐다 = 설치 OK + 그 버전이 깔려 있음. 업데이트나 새 설치를 한 게 아님.",
  },
  {
    id: "lesson-1-q19",
    lessonId: "lesson-1",
    pool: "practice",
    isomorphGroup: "lesson-1-extension",
    difficulty: "medium",
    type: "multiple-choice",
    scope: "applied",
    learningGoal: "확장자가 다르면 파이썬이 인식하지 못함을 추론한다",
    prompt:
      "코드를 적은 파일을 `quiz.txt` 로 저장한 뒤 터미널에서 `python quiz.txt` 라고 실행했습니다. 가장 가능성 높은 결과는?",
    options: [
      { label: "확장자가 `.py` 가 아니어도 파이썬은 텍스트 내용을 보고 실행을 시도하지만, 안전한 방법이 아니라 일반적으로 `.py` 로 저장하는 것이 원칙이다", isCorrect: true },
      { label: "`.txt` 도 파이썬 공식 확장자 중 하나라 정상 실행된다", isCorrect: false, misconceptionId: "M4" },
      { label: "파이썬이 자동으로 `.py` 로 이름을 바꾸어 실행한다", isCorrect: false, misconceptionId: "M4" },
      { label: "`.txt` 파일은 워드 프로그램에서만 열 수 있어 터미널에서 실행 자체가 불가능하다", isCorrect: false, misconceptionId: "M9" },
    ],
    explanation:
      "원칙은 `.py` 로 저장하기. 다른 확장자는 도구·협업·자동화에서 모두 어긋나 사고의 출발점부터 무너짐.",
  },
  {
    id: "lesson-1-q20",
    lessonId: "lesson-1",
    pool: "practice",
    isomorphGroup: "lesson-1-extension",
    difficulty: "easy",
    type: "short-answer",
    scope: "in-lesson",
    learningGoal: "확장자만으로 파이썬 코드 파일 여부를 판별한다",
    prompt: "`hello.world` 라는 파일은 파이썬 코드 파일인가요? (예 / 아니오)",
    answer: "아니오",
    allowedAnswers: ["아니오", "아니다", "아니요", "X", "x", "no", "No", "NO", "ㄴ"],
    disallowedAnswers: [
      { value: "예", misconceptionId: "M4" },
      { value: "맞다", misconceptionId: "M4" },
      { value: "yes", misconceptionId: "M4" },
      { value: "Yes", misconceptionId: "M4" },
      { value: "ㅇ", misconceptionId: "M4" },
    ],
    explanation:
      "파이썬 코드 파일은 `.py` 로 끝남. `.world` 같은 다른 확장자는 파일 이름이 그럴듯해 보여도 파이썬 코드가 아님.",
  },
  {
    id: "lesson-1-q21",
    lessonId: "lesson-1",
    pool: "practice",
    isomorphGroup: "lesson-1-save-execute",
    difficulty: "hard",
    type: "multiple-choice",
    scope: "applied",
    learningGoal: "저장 누락 상황을 다른 코드 시나리오로 일반화한다",
    prompt:
      "VS Code 에 `quiz.py` 라는 파일을 만들고 `print(\"A\")` 를 적어 저장한 뒤 터미널에서 실행해 `A` 를 봤습니다. 이어서 코드를 `print(\"B\")` 로 고쳤지만 Ctrl+S 를 누르지 않은 채 터미널에서 다시 `python quiz.py` 를 실행했습니다. 무엇이 출력되나요?",
    options: [
      { label: "A. 파일에 저장된 내용은 아직 `print(\"A\")` 그대로이기 때문", isCorrect: true },
      { label: "B. 화면에서 고친 내용이 자동 반영됐기 때문", isCorrect: false, misconceptionId: "M5" },
      { label: "A 와 B 가 두 줄로 같이 나온다", isCorrect: false, misconceptionId: "M5" },
      { label: "저장하지 않은 채 실행했으므로 오류가 난다", isCorrect: false, misconceptionId: "M5" },
    ],
    explanation:
      "파이썬은 저장된 파일을 읽음. 화면 글자가 어떻든 저장 전이면 디스크의 옛 내용이 그대로 실행됨.",
  },
  {
    id: "lesson-1-q22",
    lessonId: "lesson-1",
    pool: "practice",
    isomorphGroup: "lesson-1-save-execute",
    difficulty: "medium",
    type: "short-answer",
    scope: "applied",
    learningGoal: "수정-실행 사이의 필수 단계를 한 단어로 답한다",
    prompt:
      "코드를 고친 다음 터미널에서 다시 실행하기 전에 반드시 해야 할 한 가지를 적으세요. (한 단어)",
    answer: "저장",
    allowedAnswers: [
      "저장",
      "파일 저장",
      "파일저장",
      "Ctrl+S",
      "ctrl+s",
      "Ctrl + S",
      "Cmd+S",
      "cmd+s",
      "save",
      "Save",
    ],
    disallowedAnswers: [
      { value: "재시작", misconceptionId: "M5" },
      { value: "터미널 재시작", misconceptionId: "M5" },
      { value: "VS Code 재실행", misconceptionId: "M5" },
      { value: "컴파일", misconceptionId: "M10" },
      { value: "빌드", misconceptionId: "M10" },
    ],
    explanation:
      "저장(Ctrl+S 또는 Cmd+S) 이 핵심. 파이썬은 디스크에 저장된 내용을 읽기 때문에, 저장하지 않으면 변경이 적용되지 않음.",
  },
  {
    id: "lesson-1-q23",
    lessonId: "lesson-1",
    pool: "practice",
    isomorphGroup: "lesson-1-save-execute-cause",
    difficulty: "hard",
    type: "multiple-choice",
    scope: "applied",
    learningGoal: "\"고쳤는데 결과가 안 바뀐다\" 호소를 듣고 가장 먼저 의심할 원인을 추론한다",
    prompt:
      "팀원이 \"`menu.py` 를 분명히 고쳤는데 다시 실행해 봐도 결과가 그대로다\" 라고 말합니다. 가장 먼저 의심해야 할 원인은?",
    options: [
      { label: "고친 뒤 저장(Ctrl+S) 을 안 했을 가능성", isCorrect: true },
      { label: "파이썬을 다시 설치해야 할 가능성", isCorrect: false, misconceptionId: "M2" },
      { label: "VS Code 버전이 너무 낮을 가능성", isCorrect: false, misconceptionId: "M1" },
      { label: "터미널 자체가 망가졌을 가능성", isCorrect: false, misconceptionId: "M10" },
    ],
    explanation:
      "입문자에게 가장 흔한 원인은 저장 누락. 화면의 글자만 고친 채 파일은 그대로라서 실행 결과도 그대로 나옴.",
  },
  {
    id: "lesson-1-q24",
    lessonId: "lesson-1",
    pool: "practice",
    isomorphGroup: "lesson-1-py3",
    difficulty: "medium",
    type: "multiple-choice",
    scope: "applied",
    learningGoal: "Python 2 와 3 중 입문자가 골라야 할 쪽과 그 이유를 안다",
    prompt:
      "유튜브에서 파이썬 강의를 검색하니 \"Python 2 입문\" 과 \"Python 3 입문\" 이 둘 다 보입니다. 입문자에게 알맞은 추천은?",
    options: [
      { label: "Python 3 강의. 현재 권장 버전이며 Python 2 는 더 이상 권장되지 않는다", isCorrect: true },
      { label: "Python 2 강의. 숫자가 작아서 더 기초이고, 다 익히면 자동으로 3 으로 넘어간다", isCorrect: false, misconceptionId: "M6" },
      { label: "Python 2 강의. 숫자가 작은 쪽이 더 새 버전이라 빠르다", isCorrect: false, misconceptionId: "M6" },
      { label: "둘 다 똑같으므로 영상 길이가 짧은 쪽을 고른다", isCorrect: false, misconceptionId: "M6" },
    ],
    explanation:
      "현재 표준은 Python 3. Python 2 는 공식 지원이 끝났으므로 입문 단계부터 3 으로 시작하는 것이 맞음.",
  },
  {
    id: "lesson-1-q25",
    lessonId: "lesson-1",
    pool: "practice",
    isomorphGroup: "lesson-1-official-source",
    difficulty: "medium",
    type: "multiple-choice",
    scope: "applied",
    learningGoal: "공식 사이트가 아닌 출처에서 받지 말아야 함을 추론한다",
    prompt:
      "구글에 \"파이썬 다운로드\" 를 검색했더니 광고 자리에 `python-download.com` 이 떠 있고, 아래에 `python.org`, 그 옆 추천 결과에 `pypi.org` 가 보입니다. 어디서 받아야 하나요?",
    options: [
      { label: "python.org. 공식 사이트이며 검증된 설치 파일을 받을 수 있다", isCorrect: true },
      { label: "python-download.com. 광고 자리에 떠 있어서 가장 빠르게 받을 수 있다", isCorrect: false, misconceptionId: "M7" },
      { label: "pypi.org. 파이썬 관련이면 어느 공식 사이트든 동일하다", isCorrect: false, misconceptionId: "M11" },
      { label: "셋 다 같은 회사가 운영하므로 어느 곳에서 받아도 무방하다", isCorrect: false, misconceptionId: "M7" },
    ],
    explanation:
      "공식은 python.org 한 곳. `python-download.com` 같은 비공식 도메인은 변조된 설치 파일일 수 있고, pypi.org 는 라이브러리 저장소이지 본체 설치 사이트가 아님.",
  },
  {
    id: "lesson-1-q26",
    lessonId: "lesson-1",
    pool: "practice",
    isomorphGroup: "lesson-1-official-source",
    difficulty: "hard",
    type: "short-answer",
    scope: "applied",
    learningGoal: "공식 도메인을 비공식 후보들과 구분해 정확히 적는다",
    prompt:
      "파이썬을 새로 설치하려는 친구에게 추천할 공식 도메인 하나만 정확히 적으세요. (도메인만)",
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
      { value: "python.io", misconceptionId: "M7" },
      { value: "python.co.kr", misconceptionId: "M7" },
      { value: "python-download.com", misconceptionId: "M7" },
      { value: "pypi.org", misconceptionId: "M11" },
    ],
    explanation:
      "공식은 python.org. .com / .io / .co.kr 은 비공식이며, pypi.org 는 라이브러리 저장소라 본체 설치와 다른 사이트.",
  },
  {
    id: "lesson-1-q27",
    lessonId: "lesson-1",
    pool: "practice",
    isomorphGroup: "lesson-1-python-domain",
    difficulty: "easy",
    type: "multiple-choice",
    scope: "in-lesson",
    learningGoal: "파이썬이 특정 분야 전용이 아님을 일반적으로 이해한다",
    prompt: "파이썬은 어떤 분야에서 쓰이나요?",
    options: [
      { label: "분야 제한 없이 데이터 분석, 자동화, 웹, AI 등 다양한 분야에서 쓰인다", isCorrect: true },
      { label: "AI 분야에서만 쓰인다", isCorrect: false, misconceptionId: "M8" },
      { label: "게임 개발 분야에서만 쓰인다", isCorrect: false, misconceptionId: "M8" },
      { label: "웹 사이트 제작 분야에서만 쓰인다", isCorrect: false, misconceptionId: "M8" },
    ],
    explanation:
      "파이썬은 특정 분야 전용 언어가 아님. 한 가지 이미지로만 알고 있으면 다른 분야에서 쓸 수 있다는 사실을 놓치기 쉬움.",
  },
  {
    id: "lesson-1-q28",
    lessonId: "lesson-1",
    pool: "practice",
    isomorphGroup: "lesson-1-python-domain",
    difficulty: "medium",
    type: "multiple-choice",
    scope: "applied",
    learningGoal: "활용처 협소화 오개념을 잘못된 조언 형태로 식별한다",
    prompt:
      "친구가 학교 과제로 엑셀 데이터 분석을 하려고 \"파이썬을 써 볼까?\" 라고 묻습니다. 가장 정확한 조언은?",
    options: [
      { label: "데이터 분석은 파이썬이 자주 쓰이는 분야 중 하나니 시작해도 좋다", isCorrect: true },
      { label: "파이썬은 AI 전용 언어라 데이터 분석에는 맞지 않으니 다른 도구를 쓰라", isCorrect: false, misconceptionId: "M8" },
      { label: "파이썬은 게임 만들 때만 쓰이므로 엑셀 데이터에는 쓸 수 없다", isCorrect: false, misconceptionId: "M8" },
      { label: "파이썬은 웹 사이트 만들 때만 쓰이므로 분석에는 부적합하다", isCorrect: false, misconceptionId: "M8" },
    ],
    explanation:
      "데이터 분석은 파이썬이 가장 활발히 쓰이는 분야 중 하나. \"AI 전용\" / \"게임 전용\" 식의 단정은 활용처 협소화 오개념.",
  },
  {
    id: "lesson-1-q29",
    lessonId: "lesson-1",
    pool: "practice",
    isomorphGroup: "lesson-1-python-identity",
    difficulty: "easy",
    type: "short-answer",
    scope: "in-lesson",
    learningGoal: "파이썬을 소프트웨어 카테고리 안에서 정확히 분류한다",
    prompt:
      "파이썬은 다음 중 어디에 속하나요? (운영체제 / 프로그래밍 언어 / 웹 브라우저 / 사무용 프로그램 — 하나만 적으세요)",
    answer: "프로그래밍 언어",
    allowedAnswers: [
      "프로그래밍 언어",
      "프로그래밍언어",
      "언어",
      "programming language",
      "language",
    ],
    disallowedAnswers: [
      { value: "운영체제", misconceptionId: "M9" },
      { value: "OS", misconceptionId: "M9" },
      { value: "웹 브라우저", misconceptionId: "M9" },
      { value: "브라우저", misconceptionId: "M9" },
      { value: "사무용 프로그램", misconceptionId: "M9" },
      { value: "에디터", misconceptionId: "M1" },
      { value: "도구", misconceptionId: "M1" },
    ],
    explanation:
      "파이썬은 프로그래밍 언어. 운영체제(윈도우/맥) 나 브라우저(크롬) 같은 다른 종류의 소프트웨어와는 카테고리가 다름.",
  },
  {
    id: "lesson-1-q30",
    lessonId: "lesson-1",
    pool: "practice",
    isomorphGroup: "lesson-1-run-command",
    difficulty: "hard",
    type: "short-answer",
    scope: "applied",
    learningGoal: "강의 시연 명령어 패턴을 새로운 파일명에 일반화한다",
    prompt:
      "터미널에서 `chat.py` 파일을 실행하는 명령어 한 줄을 적으세요. (`$` 제외)",
    answer: "python chat.py",
    allowedAnswers: ["python chat.py", "python3 chat.py"],
    disallowedAnswers: [
      { value: "chat.py" },
      { value: "python chat", misconceptionId: "M4" },
      { value: "run chat.py", misconceptionId: "M10" },
      { value: "execute chat.py", misconceptionId: "M10" },
      { value: "start chat.py", misconceptionId: "M10" },
      { value: "python --version chat.py", misconceptionId: "M3" },
    ],
    explanation:
      "`python` (실행할 도구) + `chat.py` (실행할 파일) 두 부분. 맥에서 `python3` 으로 깔린 분은 `python3 chat.py`.",
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
    pool: "evaluation",
    isomorphGroup: "lesson-2-stage-order",
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
    pool: "evaluation",
    isomorphGroup: "lesson-2-nl-definition",
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
    pool: "evaluation",
    isomorphGroup: "lesson-2-pseudocode-definition",
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
    pool: "evaluation",
    isomorphGroup: "lesson-2-flowchart-shapes",
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
    pool: "evaluation",
    isomorphGroup: "lesson-2-flowchart-shape-role",
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
    pool: "evaluation",
    isomorphGroup: "lesson-2-pseudocode-form",
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
    pool: "evaluation",
    isomorphGroup: "lesson-2-three-equal",
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
    pool: "evaluation",
    isomorphGroup: "lesson-2-decision-branch",
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
    pool: "evaluation",
    isomorphGroup: "lesson-2-implicit-step",
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
    pool: "evaluation",
    isomorphGroup: "lesson-2-pseudocode-form",
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
  // ─── Pool B (q11~q30) — 추천 시스템이 약점에 따라 동적 매칭하는 처방 문항 ───
  {
    id: "lesson-2-q11",
    lessonId: "lesson-2",
    pool: "practice",
    isomorphGroup: "lesson-2-pseudocode-vs-code",
    difficulty: "easy",
    type: "multiple-choice",
    scope: "in-lesson",
    learningGoal: "의사코드를 파이썬이 그대로 실행할 수 있는지 빠르게 회상한다",
    prompt: "한국어로 적은 의사코드를 그대로 `.py` 파일에 옮겨 저장하고 파이썬으로 실행하면 어떻게 되나요?",
    options: [
      { label: "실행되지 않고 오류가 난다. 의사코드는 사람이 읽기 위한 표기이고, 파이썬이 직접 읽는 코드가 아니다", isCorrect: true },
      { label: "들여쓰기만 맞춰 두면 파이썬이 한국어 의사코드를 그대로 실행한다", isCorrect: false, misconceptionId: "M1" },
      { label: "한국어라서 안 되지만 영어 IF/THEN 으로 적었다면 그대로 실행된다", isCorrect: false, misconceptionId: "M9" },
      { label: "의사코드와 파이썬 코드는 같은 것이므로 항상 그대로 실행된다", isCorrect: false, misconceptionId: "M1" },
    ],
    explanation: "의사코드는 사람끼리 절차를 읽기 위한 표기. 한국어든 영어든 파이썬은 의사코드를 직접 읽지 않음.",
  },
  {
    id: "lesson-2-q12",
    lessonId: "lesson-2",
    pool: "practice",
    isomorphGroup: "lesson-2-pseudocode-vs-code",
    difficulty: "medium",
    type: "short-answer",
    scope: "applied",
    learningGoal: "의사코드를 그대로 실행했을 때 나오는 결과를 한 단어로 답한다",
    prompt:
      "다음 한 줄을 그대로 `note.py` 에 저장한 뒤 터미널에서 `python note.py` 를 실행하면 결과는? (한 단어)\n\n만약 가격이 5000보다 크면:",
    answer: "오류",
    allowedAnswers: [
      "오류",
      "에러",
      "Error",
      "error",
      "SyntaxError",
      "syntax error",
      "구문 오류",
      "문법 오류",
      "실행 안 됨",
      "실행되지 않음",
      "안 돌아감",
    ],
    disallowedAnswers: [
      { value: "그대로 실행됨", misconceptionId: "M1" },
      { value: "정상 실행", misconceptionId: "M1" },
      { value: "5000 출력", misconceptionId: "M1" },
      { value: "5000", misconceptionId: "M1" },
      { value: "True", misconceptionId: "M1" },
    ],
    explanation: "한국어 키워드 \"만약\" 은 파이썬 문법이 아님. 의사코드는 사람용 표기라서 그대로 저장해 실행하면 SyntaxError.",
  },
  {
    id: "lesson-2-q13",
    lessonId: "lesson-2",
    pool: "practice",
    isomorphGroup: "lesson-2-pseudocode-vs-code",
    difficulty: "hard",
    type: "multiple-choice",
    scope: "applied",
    learningGoal: "의사코드와 실행 가능한 코드의 차이를 친구의 잘못된 요청에 적용한다",
    prompt:
      "친구가 카톡으로 다음 메모를 보내며 \"이거 그대로 돌려봐\" 라고 합니다. 가장 정확한 답변은?\n\n만약 가격이 5000보다 크면:\n    카드로 결제한다\n아니면:\n    현금으로 결제한다",
    options: [
      { label: "이건 의사코드라 파이썬이 직접 읽지 못한다. 코드로 옮겨야 실행 가능하다고 알려 준다", isCorrect: true },
      { label: "들여쓰기가 맞으니 그대로 `.py` 로 저장해 실행하면 잘 돌아간다", isCorrect: false, misconceptionId: "M1" },
      { label: "한국어라서 안 되지만 영어 IF / THEN 으로만 다시 적으면 그대로 실행된다", isCorrect: false, misconceptionId: "M9" },
      { label: "의사코드와 파이썬 코드는 같은 것이라 어떤 형태든 그대로 실행된다", isCorrect: false, misconceptionId: "M1" },
    ],
    explanation: "의사코드는 사람용 표기. 영어로 바꾸어도 파이썬 문법이 아니면 실행되지 않음. 코드로 변환하는 단계가 따로 필요.",
  },
  {
    id: "lesson-2-q14",
    lessonId: "lesson-2",
    pool: "practice",
    isomorphGroup: "lesson-2-decision-branch",
    difficulty: "medium",
    type: "multiple-choice",
    scope: "applied",
    learningGoal: "마름모에서 한쪽 분기만 그린 순서도의 오류를 식별한다",
    prompt:
      "도서관 출입 게이트의 순서도가 다음과 같습니다. 가장 큰 문제는?\n\n[시작] → (학생증 인식) → ◇(정회원인가?) → \"예\" → [게이트 열림] → [끝]",
    options: [
      { label: "마름모에서 \"아니오\" 방향 화살표가 빠져 있어 정회원이 아닐 때 흐름이 끊긴다", isCorrect: true },
      { label: "학생증 인식은 입출력이 아니라 처리이므로 사각형 대신 평행사변형이어야 한다", isCorrect: false, misconceptionId: "M7" },
      { label: "시작은 둥근 사각형이 아니라 마름모로 그려야 한다", isCorrect: false, misconceptionId: "M7" },
      { label: "화살표에 \"예\" / \"아니오\" 같은 라벨을 달면 안 된다", isCorrect: false, misconceptionId: "M2" },
    ],
    explanation: "판단 마름모는 둘 이상의 분기가 나가야 함. \"아니오\" 방향이 없으면 비회원일 때 흐름이 막혀 절차가 미완성.",
  },
  {
    id: "lesson-2-q15",
    lessonId: "lesson-2",
    pool: "practice",
    isomorphGroup: "lesson-2-decision-branch-fix",
    difficulty: "hard",
    type: "short-answer",
    scope: "applied",
    learningGoal: "판단 마름모 한 방향 분기 오류에서 빠진 요소를 정확히 짚는다",
    prompt:
      "ATM 출금 순서도에서 마름모 ◇(잔액 충분?) 에 \"예\" 화살표만 그려져 있고 \"아니오\" 방향이 없습니다. 이 마름모에서 빠진 것은 무엇인가요?",
    answer: "아니오 화살표",
    allowedAnswers: [
      "아니오 화살표",
      "아니오",
      "다른 분기",
      "다른 방향 화살표",
      "False 방향",
      "false 방향",
      "거짓일 때 화살표",
      "거짓 방향",
      "No 화살표",
      "no 화살표",
      "반대 방향 화살표",
      "두 번째 화살표",
    ],
    disallowedAnswers: [
      { value: "사각형", misconceptionId: "M7" },
      { value: "평행사변형", misconceptionId: "M7" },
      { value: "값" },
      { value: "조건" },
    ],
    explanation: "판단 마름모는 항상 둘 이상의 분기. \"아니오\" 화살표가 없으면 잔액 부족일 때 흐름이 끊겨 절차가 완성되지 않음.",
  },
  {
    id: "lesson-2-q16",
    lessonId: "lesson-2",
    pool: "practice",
    isomorphGroup: "lesson-2-implicit-step",
    difficulty: "medium",
    type: "multiple-choice",
    scope: "applied",
    learningGoal: "자판기 절차에 빠진 암묵 단계를 식별한다",
    prompt:
      "자판기에서 음료를 사는 자연어 절차를 다음과 같이 적었습니다. 코드로 옮기기 전에 추가로 명시해야 할 단계로 가장 가까운 것은?\n\n1) 음료를 고른다\n2) 돈을 넣는다\n3) 음료를 받는다",
    options: [
      { label: "2) 와 3) 사이에 \"넣은 돈이 가격보다 많거나 같은지 확인한다\" 단계", isCorrect: true },
      { label: "단계는 충분하다. 빠진 부분이 있어도 컴퓨터가 알아서 채워 넣는다", isCorrect: false, misconceptionId: "M3" },
      { label: "각 단계 옆에 영어 키워드 IF / FOR 를 붙이는 단계", isCorrect: false, misconceptionId: "M9" },
      { label: "각 단계 옆에 도형 모양을 그려 넣는 단계", isCorrect: false, misconceptionId: "M7" },
    ],
    explanation: "사람은 \"가격 확인\" 을 당연히 채워 읽지만 컴퓨터는 빠진 단계를 추론하지 않음. 암묵 단계를 명시해야 코드로 옮길 수 있음.",
  },
  {
    id: "lesson-2-q17",
    lessonId: "lesson-2",
    pool: "practice",
    isomorphGroup: "lesson-2-implicit-step",
    difficulty: "hard",
    type: "multiple-choice",
    scope: "applied",
    learningGoal: "지도 길찾기 절차에 빠진 암묵 단계를 식별한다",
    prompt:
      "지도 앱의 길찾기 자연어 절차가 다음과 같습니다. 코드로 옮기기 전에 가장 먼저 보강해야 할 단계는?\n\n1) 출발지를 입력한다\n2) 도착지를 입력한다\n3) 길찾기 버튼을 누른다",
    options: [
      { label: "3) 뒤에 \"경로를 계산해 결과를 화면에 보여 준다\" 단계", isCorrect: true },
      { label: "단계는 충분하다. 결과 표시는 자판기처럼 컴퓨터가 알아서 처리한다", isCorrect: false, misconceptionId: "M3" },
      { label: "표현 단계는 코드 작성과 무관하므로 굳이 보강하지 않아도 된다", isCorrect: false, misconceptionId: "M5" },
      { label: "단계마다 IF / THEN 같은 영어 키워드를 붙인 줄을 추가한다", isCorrect: false, misconceptionId: "M9" },
    ],
    explanation: "버튼을 눌렀다고 사용자가 결과를 보는 것은 아님. 빠진 \"결과 표시\" 단계를 명시해야 절차가 완성됨.",
  },
  {
    id: "lesson-2-q18",
    lessonId: "lesson-2",
    pool: "practice",
    isomorphGroup: "lesson-2-three-equal",
    difficulty: "easy",
    type: "short-answer",
    scope: "in-lesson",
    learningGoal: "자연어/의사코드/순서도 셋의 우열에 대한 메타 인식을 정리한다",
    prompt:
      "자연어, 의사코드, 순서도 중 \"항상 가장 좋은 표현\" 은 무엇인가요? (한 줄)",
    answer: "정답 없음",
    allowedAnswers: [
      "정답 없음",
      "없다",
      "없음",
      "용도가 다르다",
      "상황에 따라 다르다",
      "상황마다 다르다",
      "셋 다 안 쓸 수도 있다",
      "셋 다 우열 없음",
      "우열 없음",
      "우열이 없다",
      "상황에 맞춰 골라 쓴다",
    ],
    disallowedAnswers: [
      { value: "순서도", misconceptionId: "M4" },
      { value: "의사코드", misconceptionId: "M4" },
      { value: "자연어", misconceptionId: "M4" },
      { value: "코드", misconceptionId: "M1" },
      { value: "파이썬 코드", misconceptionId: "M1" },
    ],
    explanation: "셋은 우열이 아니라 용도가 다름. 처음 풀어쓸 땐 자연어, 형식 정돈은 의사코드, 분기·반복이 복잡할 땐 순서도.",
  },
  {
    id: "lesson-2-q19",
    lessonId: "lesson-2",
    pool: "practice",
    isomorphGroup: "lesson-2-three-context-pick",
    difficulty: "medium",
    type: "short-answer",
    scope: "applied",
    learningGoal: "표현 셋 중 상황에 가장 적합한 것을 골라낸다",
    prompt:
      "회의실 예약 시스템처럼 분기와 반복이 여러 번 얽혀 있는 절차의 흐름을 한눈에 보고 싶을 때 가장 적합한 표현은? (한 단어)",
    answer: "순서도",
    allowedAnswers: ["순서도", "flowchart", "Flowchart", "플로우차트", "흐름도"],
    disallowedAnswers: [
      { value: "자연어", misconceptionId: "M4" },
      { value: "의사코드", misconceptionId: "M4" },
      { value: "슈도코드", misconceptionId: "M4" },
      { value: "파이썬 코드", misconceptionId: "M1" },
      { value: "코드", misconceptionId: "M1" },
    ],
    explanation: "분기·반복이 얽힌 흐름은 도형으로 시각화하는 순서도가 가장 한눈에 들어옴. 줄글이나 들여쓰기 표기는 흐름이 잘 안 보임.",
  },
  {
    id: "lesson-2-q20",
    lessonId: "lesson-2",
    pool: "practice",
    isomorphGroup: "lesson-2-stage-existence",
    difficulty: "easy",
    type: "multiple-choice",
    scope: "in-lesson",
    learningGoal: "표현 단계의 존재 자체를 인식한다",
    prompt: "문제를 받자마자 곧장 코드부터 쓰는 행동의 가장 큰 문제는?",
    options: [
      { label: "자연어/의사코드/순서도 같은 \"표현 단계\" 를 건너뛰어 절차가 정리되지 않은 채 코드만 써 내려가게 된다", isCorrect: true },
      { label: "타이핑 속도가 느리면 다른 사람보다 코드가 늦게 완성된다", isCorrect: false, misconceptionId: "M5" },
      { label: "좋은 에디터를 쓰지 않으면 코드를 못 쓴다", isCorrect: false, misconceptionId: "M5" },
      { label: "곧장 코드를 쓰는 게 가장 빠른 방법이라 문제가 없다", isCorrect: false, misconceptionId: "M5" },
    ],
    explanation: "표현 단계는 절차를 정돈하는 중간 단계. 건너뛰면 머릿속만으로 코딩하다 막히기 쉬움.",
  },
  {
    id: "lesson-2-q21",
    lessonId: "lesson-2",
    pool: "practice",
    isomorphGroup: "lesson-2-stage-order",
    difficulty: "medium",
    type: "short-answer",
    scope: "applied",
    learningGoal: "표현 단계의 표준 흐름에서 빠진 단계를 채워 넣는다",
    prompt:
      "친구가 자연어로 절차를 적은 뒤 곧장 코드로 넘어가려다 막혔습니다. 다음 흐름의 빈칸을 채우세요. (한 단어)\n\n자연어 → ___ → 순서도 → 코드",
    answer: "의사코드",
    allowedAnswers: [
      "의사코드",
      "의사 코드",
      "슈도코드",
      "슈도 코드",
      "pseudocode",
      "Pseudocode",
      "pseudo code",
    ],
    disallowedAnswers: [
      { value: "파이썬 코드", misconceptionId: "M1" },
      { value: "코드", misconceptionId: "M1" },
      { value: "주석" },
      { value: "한국어" },
    ],
    explanation: "자연어로 풀어쓴 다음 \"형식을 정돈하는 단계\" 가 의사코드. 자연어와 코드 사이의 다리 역할.",
  },
  {
    id: "lesson-2-q22",
    lessonId: "lesson-2",
    pool: "practice",
    isomorphGroup: "lesson-2-stage-existence",
    difficulty: "hard",
    type: "multiple-choice",
    scope: "applied",
    learningGoal: "표현 단계 누락 상황에 적절한 조언을 추론한다",
    prompt:
      "친구가 \"문제를 봤는데 30분째 코드만 쓰다 지웠다 반복 중\" 이라고 합니다. 가장 정확한 조언은?",
    options: [
      { label: "잠깐 멈추고 자연어로 절차를 풀어 적어 본 뒤, 의사코드로 정돈하고 코드로 옮겨 보라고 한다", isCorrect: true },
      { label: "타이핑이 느려서 그러니 더 빨리 입력해 보라고 한다", isCorrect: false, misconceptionId: "M5" },
      { label: "에디터 단축키를 외우면 자연스럽게 코드가 풀린다고 한다", isCorrect: false, misconceptionId: "M5" },
      { label: "빠진 단계는 컴퓨터가 알아서 채울 테니 그냥 더 써 보라고 한다", isCorrect: false, misconceptionId: "M3" },
    ],
    explanation: "코드만 붙들고 있으면 절차가 정리되지 않아 같은 자리에서 맴돔. 자연어 → 의사코드 단계로 한번 돌아가야 함.",
  },
  {
    id: "lesson-2-q23",
    lessonId: "lesson-2",
    pool: "practice",
    isomorphGroup: "lesson-2-stage-order",
    difficulty: "medium",
    type: "short-answer",
    scope: "applied",
    learningGoal: "표현 단계 흐름이 항상 강제되지 않음을 메타 인식한다",
    prompt:
      "알람 앱의 간단한 동작을 코딩할 때 \"항상 자연어 단계부터 시작해야만 한다\" 가 맞는 말인가요? (한 단어 또는 한 줄)",
    answer: "아니다",
    allowedAnswers: [
      "아니다",
      "아니오",
      "아니요",
      "X",
      "x",
      "no",
      "No",
      "NO",
      "ㄴ",
      "상황에 따라 다르다",
      "상황마다 다르다",
      "셋 다 안 쓸 수도 있다",
      "필요할 때만 쓴다",
    ],
    disallowedAnswers: [
      { value: "그렇다", misconceptionId: "M6" },
      { value: "예", misconceptionId: "M6" },
      { value: "맞다", misconceptionId: "M6" },
      { value: "yes", misconceptionId: "M6" },
      { value: "순서도부터", misconceptionId: "M6" },
      { value: "의사코드부터", misconceptionId: "M6" },
      { value: "코드부터", misconceptionId: "M5" },
    ],
    explanation: "표현 단계는 도구일 뿐 의무가 아님. 간단한 절차는 자연어를 건너뛰고 의사코드만 거치거나 셋 다 생략할 수도 있음.",
  },
  {
    id: "lesson-2-q24",
    lessonId: "lesson-2",
    pool: "practice",
    isomorphGroup: "lesson-2-flowchart-shape-role",
    difficulty: "medium",
    type: "multiple-choice",
    scope: "applied",
    learningGoal: "사각형과 평행사변형의 역할 차이를 식별한다",
    prompt:
      "출퇴근 카드 시스템 순서도에 [카드 태그] 와 (출입 기록 저장) 두 단계가 있습니다. 사각형(처리) 과 평행사변형(입출력) 의 역할 차이로 가장 정확한 것은?",
    options: [
      { label: "평행사변형은 사용자/외부와 데이터를 주고받는 입출력, 사각형은 내부에서 일어나는 처리", isCorrect: true },
      { label: "평행사변형은 판단, 사각형은 처리이므로 마름모 대신 평행사변형을 써도 같다", isCorrect: false, misconceptionId: "M7" },
      { label: "평행사변형은 시작/끝, 사각형은 판단이다", isCorrect: false, misconceptionId: "M7" },
      { label: "사각형과 평행사변형은 같은 의미라 어느 쪽을 써도 무관하다", isCorrect: false, misconceptionId: "M7" },
    ],
    explanation: "평행사변형은 입출력(사용자가 카드를 태그하는 행위), 사각형은 처리(내부에서 기록을 저장하는 행위). 도형이 역할을 구분.",
  },
  {
    id: "lesson-2-q25",
    lessonId: "lesson-2",
    pool: "practice",
    isomorphGroup: "lesson-2-flowchart-input-output",
    difficulty: "hard",
    type: "short-answer",
    scope: "applied",
    learningGoal: "입출력 단계를 어떤 도형으로 그려야 하는지 정확히 답한다",
    prompt:
      "카페 주문 순서도에서 \"손님에게 주문을 받는다\" 단계는 어떤 도형으로 그려야 하나요? (한 단어)",
    answer: "평행사변형",
    allowedAnswers: [
      "평행사변형",
      "기울어진 사각형",
      "기운 사각형",
      "평행 사변형",
      "parallelogram",
    ],
    disallowedAnswers: [
      { value: "사각형", misconceptionId: "M7" },
      { value: "직사각형", misconceptionId: "M7" },
      { value: "마름모", misconceptionId: "M7" },
      { value: "둥근 사각형", misconceptionId: "M7" },
      { value: "타원", misconceptionId: "M7" },
    ],
    explanation: "주문을 받는 행위는 외부(손님)와 데이터를 주고받는 입출력. 평행사변형이 입출력 도형.",
  },
  {
    id: "lesson-2-q26",
    lessonId: "lesson-2",
    pool: "practice",
    isomorphGroup: "lesson-2-flowchart-shape-meaning",
    difficulty: "medium",
    type: "multiple-choice",
    scope: "in-lesson",
    learningGoal: "마름모 모양이 시각적으로 의미하는 바를 해석한다",
    prompt: "순서도에서 마름모의 \"갈라지는 모서리\" 가 시각적으로 의미하는 것은?",
    options: [
      { label: "이 단계에서 흐름이 둘 이상의 방향으로 나뉜다", isCorrect: true },
      { label: "특별한 의미는 없고 단순한 디자인 차이일 뿐이다", isCorrect: false, misconceptionId: "M8" },
      { label: "마름모는 무조건 순서도의 정중앙에만 두라는 표시이다", isCorrect: false, misconceptionId: "M8" },
      { label: "마름모 안에는 처리 동작만 적어야 한다는 표시이다", isCorrect: false, misconceptionId: "M8" },
    ],
    explanation: "도형의 모양은 그 자체로 역할의 단서. 마름모의 갈라지는 모서리는 \"여기서 흐름이 나뉜다\" 는 시각적 신호.",
  },
  {
    id: "lesson-2-q27",
    lessonId: "lesson-2",
    pool: "practice",
    isomorphGroup: "lesson-2-pseudocode-language",
    difficulty: "easy",
    type: "multiple-choice",
    scope: "in-lesson",
    learningGoal: "한국어로 적은 의사코드도 의사코드임을 인식한다",
    prompt: "한국어로 적은 다음 표기는 의사코드라고 부를 수 있나요?\n\n만약 가격이 5000보다 크면:\n    카드로 결제한다",
    options: [
      { label: "그렇다. 의사코드는 언어가 아니라 형식의 문제라 한국어로 적어도 의사코드다", isCorrect: true },
      { label: "아니다. 의사코드는 반드시 영어 IF / THEN 같은 키워드여야 한다", isCorrect: false, misconceptionId: "M9" },
      { label: "아니다. 한국어로 적은 절차는 모두 자연어로 분류된다", isCorrect: false, misconceptionId: "M10" },
      { label: "아니다. 의사코드는 반드시 파이썬 문법을 따라야 한다", isCorrect: false, misconceptionId: "M1" },
    ],
    explanation: "의사코드는 \"형식을 코드에 가깝게 정돈한 표기\" 일 뿐 정해진 언어가 따로 없음. 한국어 의사코드도 정당한 표현.",
  },
  {
    id: "lesson-2-q28",
    lessonId: "lesson-2",
    pool: "practice",
    isomorphGroup: "lesson-2-pseudocode-language",
    difficulty: "medium",
    type: "short-answer",
    scope: "applied",
    learningGoal: "영어/한국어 의사코드를 모두 의사코드로 분류한다",
    prompt:
      "다음 두 표기 (가) 와 (나) 가 모두 의사코드인가요? (한 단어 또는 한 줄)\n\n(가) IF price > 5000 THEN\n    pay by card\n(나) 만약 가격이 5000보다 크면:\n    카드로 결제한다",
    answer: "그렇다",
    allowedAnswers: [
      "그렇다",
      "예",
      "맞다",
      "둘 다 의사코드",
      "둘 다 의사코드다",
      "둘 다 맞다",
      "yes",
      "Yes",
      "YES",
      "ㅇ",
      "O",
      "o",
    ],
    disallowedAnswers: [
      { value: "영어만", misconceptionId: "M9" },
      { value: "(가)만 의사코드", misconceptionId: "M9" },
      { value: "한국어만", misconceptionId: "M9" },
      { value: "(나)만 의사코드", misconceptionId: "M9" },
      { value: "둘 다 아니다", misconceptionId: "M1" },
      { value: "둘 다 코드", misconceptionId: "M1" },
      { value: "둘 다 자연어", misconceptionId: "M10" },
    ],
    explanation: "둘 다 \"형식이 코드에 가깝게 정돈된 사람용 표기\" 라는 의사코드의 조건을 만족. 언어(영어/한국어)는 의사코드 여부와 무관.",
  },
  {
    id: "lesson-2-q29",
    lessonId: "lesson-2",
    pool: "practice",
    isomorphGroup: "lesson-2-nl-vs-pseudocode-form",
    difficulty: "medium",
    type: "multiple-choice",
    scope: "in-lesson",
    learningGoal: "자연어와 의사코드의 형식 차이를 일반적으로 식별한다",
    prompt: "자연어와 의사코드의 형식 차이로 가장 정확한 것은?",
    options: [
      { label: "자연어는 줄글로 풀어 쓰고, 의사코드는 들여쓰기·콜론 같은 형식으로 정돈해 적는다", isCorrect: true },
      { label: "자연어와 의사코드는 둘 다 줄글이라 형식상 차이가 없다", isCorrect: false, misconceptionId: "M10" },
      { label: "자연어와 의사코드는 둘 다 들여쓰기로 적어야 하므로 형식이 같다", isCorrect: false, misconceptionId: "M10" },
      { label: "자연어는 영어로, 의사코드는 한국어로 적는다는 차이가 있다", isCorrect: false, misconceptionId: "M9" },
    ],
    explanation: "자연어는 사람 말 그대로 줄글, 의사코드는 코드에 가까운 형식으로 정돈. 같은 내용도 형식이 달라 구분됨.",
  },
  {
    id: "lesson-2-q30",
    lessonId: "lesson-2",
    pool: "practice",
    isomorphGroup: "lesson-2-nl-vs-pseudocode-form",
    difficulty: "hard",
    type: "multiple-choice",
    scope: "applied",
    learningGoal: "지하철 환승 시나리오 표기 4개 중 자연어가 아닌 것을 가려낸다",
    prompt:
      "지하철 환승 절차를 네 사람이 각자 다른 방식으로 적었습니다. 다음 중 \"자연어\" 가 아닌 것은?",
    options: [
      {
        label: "만약 환승역이면:\n    내려서 다른 호선으로 갈아탄다\n아니면:\n    그대로 앉아 있는다",
        isCorrect: true,
      },
      {
        label: "환승역에 도착하면 내려서 다른 호선으로 갈아탑니다. 환승역이 아니면 그대로 앉아 있습니다.",
        isCorrect: false,
        misconceptionId: "M10",
      },
      {
        label: "도착한 역이 환승역이라면 내려서 다른 호선으로 갈아타고, 그렇지 않다면 그대로 앉아 있는다.",
        isCorrect: false,
        misconceptionId: "M10",
      },
      {
        label: "역에 도착하면 환승역인지 본다. 환승역이라면 내려서 다른 호선으로 갈아타고, 아니면 자리에 그대로 있는다.",
        isCorrect: false,
        misconceptionId: "M10",
      },
    ],
    explanation: "A 는 들여쓰기·콜론으로 형식을 정돈한 의사코드. 나머지 셋은 사람 말 줄글 형태의 자연어. 형식의 차이가 분류 기준.",
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
