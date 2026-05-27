// 프로젝트형 강의(13강~) 콘텐츠 데이터 모듈.
// MVP는 정적 객체 — 추후 backend-developer가 만든 API/Server Action 응답으로 교체 가능.
// (순수 데이터 모듈 — 클라이언트/서버 어디서든 import 가능)
//
// 13강 "계산기 만들기"는 영상 없이 텍스트 문제를 읽고 직접 코드를 작성·실행·채점받는
// 인터랙티브 프로젝트다. 1~6강 문법(변수·입출력·연산자·조건문·반복문)만으로 구성한다.
// 함수(def)·리스트·딕셔너리·예외처리(try)·split() 은 의도적으로 사용하지 않는다.
//
// 채점: 함수가 없으므로 함수 단위 assert 가 불가 → 전부 stdin→stdout 시나리오 채점.
//   · stdin : input() 호출이 순서대로 반환할 값들
//   · expect: 출력에서 "순서대로" 만족해야 할 항목 (숫자는 허용오차 비교, 텍스트는 부분일치)
//   채점기는 expect 를 순차적으로 소비하며, 텍스트 매칭 위치 "이후"부터 다음 항목을 찾는다.
//   (예: "0으로 나눌 수 없습니다" 안의 0 이 뒤따르는 number 매칭을 오염시키지 않도록.)

/** 출력에서 순서대로 만족해야 할 한 항목 */
export type ExpectedOutput =
  | { kind: "number"; value: number } // 출력의 다음 숫자가 value 와 일치 (부동소수 허용오차)
  | { kind: "text"; contains: string }; // 출력에 이 문자열이 포함

export type TestCase = {
  /** 케이스 설명 (UI 표시) */
  label: string;
  /** input() 이 순서대로 반환할 값들 */
  stdin: string[];
  /** 출력에서 순서대로 만족해야 할 항목들 */
  expect: ExpectedOutput[];
};

export type ProjectStep = {
  id: string;
  /** 0-based 스텝 번호 (0 = 설계 워밍업) */
  number: number;
  title: string;
  /** 문제 설명 — 빈 줄로 단락 구분. 별도 마크다운 렌더 없이 단락 + 인라인 코드 정도로 표시 */
  prompt: string;
  /** 어느 강 문법인지 태그 (UI 칩) */
  conceptTags: string[];
  /** 에디터 시작 스캐폴드 (이전 스텝에 작성한 코드가 있으면 그쪽을 우선 복원) */
  starterCode: string;
  /** 모범 정답 (그 자체로 실행 가능한 완전한 코드) */
  solutionCode: string;
  /** 힌트 사다리 (단계적으로 공개, 마지막은 정답 안내) */
  hints: string[];
  /** 입출력 예시 (문제 카드에 표시 + 입력칸 placeholder). 보통 채점 첫 케이스와 일치 */
  example?: { stdin: string[]; stdout: string };
  /** 채점 테스트. 빈 배열이면 채점 없는 읽기 스텝(Step 0 설계) */
  tests: TestCase[];
};

export type Project = {
  courseId: string;
  lessonId: string;
  lessonNumber: number;
  title: string;
  /** 프로젝트 한 줄 소개 */
  overview: string;
  /** 완성 목표 설명 */
  goal: string;
  /** 이 프로젝트를 하려면 필요한 강의 개념 (카드/헤더 태그) */
  concepts: string[];
  steps: ProjectStep[];
};

// ─── 13강 「계산기 만들기」 ──────────────────────────────────────────
// 누적형: 이전 스텝 정답 위에 한 겹씩 쌓는다. 각 스텝 solutionCode 는 그 자체로 실행 가능.

const step0: ProjectStep = {
  id: "step-0",
  number: 0,
  title: "설계 — 계산기의 순서 그리기",
  prompt: `코드를 바로 짜기 전에, 계산기가 어떤 순서로 동작할지 우리말로 먼저 그려봅니다. 이렇게 순서를 적어 보는 것을 "의사코드"라고 해요 (2강).

아래 순서를 눈으로 따라가 보세요. 다음 스텝부터 이 순서를 한 줄씩 코드로 옮깁니다.

반복한다:
    1) 첫 번째 수를 입력받는다
    2) 연산자(+ - * /)를 입력받는다
    3) 두 번째 수를 입력받는다
    4) 연산자에 따라 계산한다
    5) 결과를 출력한다
    6) 계속할지 물어본다 → "y" 가 아니면 멈춘다`,
  conceptTags: ["2강 의사코드"],
  starterCode: "",
  solutionCode: "",
  hints: [],
  tests: [],
};

const step1: ProjectStep = {
  id: "step-1",
  number: 1,
  title: "두 수를 입력받아 출력하기",
  prompt: `사용자에게 숫자 두 개를 한 줄에 하나씩 입력받아, 그대로 다시 출력하세요.

input() 으로 받은 값은 "글자"라서, float() 로 감싸 숫자로 바꿔야 계산에 쓸 수 있어요 (3·4강).

예) 3 과 4 를 입력하면 → 3.0 과 4.0 이 출력됩니다.`,
  conceptTags: ["3강 변수/print", "4강 input/형변환"],
  example: { stdin: ["3", "4"], stdout: "3.0\n4.0" },
  starterCode: `# 첫 번째 수를 입력받아 숫자로 바꾸세요
a = float(input())

# 두 번째 수도 같은 방식으로 입력받으세요


# 두 값을 각각 출력하세요
`,
  solutionCode: `a = float(input())
b = float(input())
print(a)
print(b)
`,
  hints: [
    "input() 은 글자를 주기 때문에, 계산하려면 float() 로 감싸 숫자로 바꿔야 해요.",
    "두 번째 수도 b = float(input()) 처럼 똑같이 받으면 됩니다.",
    "print(a) 와 print(b) 로 두 값을 각각 출력하세요.",
    `정답:
a = float(input())
b = float(input())
print(a)
print(b)`,
  ],
  tests: [
    {
      label: "3, 4 입력",
      stdin: ["3", "4"],
      expect: [
        { kind: "number", value: 3 },
        { kind: "number", value: 4 },
      ],
    },
    {
      label: "10, 2.5 입력",
      stdin: ["10", "2.5"],
      expect: [
        { kind: "number", value: 10 },
        { kind: "number", value: 2.5 },
      ],
    },
    {
      label: "-1, 0 입력",
      stdin: ["-1", "0"],
      expect: [
        { kind: "number", value: -1 },
        { kind: "number", value: 0 },
      ],
    },
  ],
};

const step2: ProjectStep = {
  id: "step-2",
  number: 2,
  title: "두 수를 더하기",
  prompt: `입력받은 두 수를 "더한 결과"를 출력하세요 (4강 산술 연산자).

예) 3 과 4 를 입력하면 → 7.0 이 출력됩니다.`,
  conceptTags: ["4강 산술 연산자"],
  example: { stdin: ["3", "4"], stdout: "7.0" },
  starterCode: `a = float(input())
b = float(input())

# 두 수를 더한 결과를 출력하세요
`,
  solutionCode: `a = float(input())
b = float(input())
print(a + b)
`,
  hints: [
    "두 수를 더할 때는 + 연산자를 씁니다.",
    "print(a + b) 처럼 더한 결과를 바로 출력할 수 있어요.",
    `정답:
a = float(input())
b = float(input())
print(a + b)`,
  ],
  tests: [
    { label: "3 + 4", stdin: ["3", "4"], expect: [{ kind: "number", value: 7 }] },
    { label: "10 + 2.5", stdin: ["10", "2.5"], expect: [{ kind: "number", value: 12.5 }] },
    { label: "-1 + 1", stdin: ["-1", "1"], expect: [{ kind: "number", value: 0 }] },
    { label: "0 + 0", stdin: ["0", "0"], expect: [{ kind: "number", value: 0 }] },
  ],
};

const step3: ProjectStep = {
  id: "step-3",
  number: 3,
  title: "연산자에 따라 계산하기",
  prompt: `이번엔 더하기 말고도 빼기·곱하기·나누기까지 되게 만듭니다.

첫 번째 수 → 연산자(+ - * /) → 두 번째 수 순서로 입력받고, 연산자에 맞는 결과를 출력하세요. 조건문 if / elif / else 로 네 갈래로 나눕니다 (5강).

만약 + - * / 가 아닌 다른 글자가 들어오면 "알 수 없는 연산자" 를 출력하세요.

주의: 연산자는 글자라서 float() 로 바꾸면 안 돼요. op = input() 그대로 받습니다.`,
  conceptTags: ["5강 if/elif/else", "4강 비교 연산"],
  example: { stdin: ["3", "+", "4"], stdout: "7.0" },
  starterCode: `a = float(input())
op = input()   # 연산자는 글자 — float() 쓰지 않기
b = float(input())

# op 가 "+" 이면 더하기, "-" 이면 빼기, "*" 이면 곱하기, "/" 이면 나누기
# 그 외에는 "알 수 없는 연산자" 출력
`,
  solutionCode: `a = float(input())
op = input()
b = float(input())
if op == "+":
    print(a + b)
elif op == "-":
    print(a - b)
elif op == "*":
    print(a * b)
elif op == "/":
    print(a / b)
else:
    print("알 수 없는 연산자")
`,
  hints: [
    "연산자는 숫자가 아니라 글자예요. op = input() 으로 받고 float() 는 쓰지 마세요.",
    'if op == "+": 로 시작해 elif op == "-": / elif op == "*": / elif op == "/": 로 네 갈래를 만드세요.',
    '어떤 연산자도 아니면 else: 에서 print("알 수 없는 연산자") 를 출력하세요.',
    `정답:
a = float(input())
op = input()
b = float(input())
if op == "+":
    print(a + b)
elif op == "-":
    print(a - b)
elif op == "*":
    print(a * b)
elif op == "/":
    print(a / b)
else:
    print("알 수 없는 연산자")`,
  ],
  tests: [
    { label: "3 + 4", stdin: ["3", "+", "4"], expect: [{ kind: "number", value: 7 }] },
    { label: "10 - 3", stdin: ["10", "-", "3"], expect: [{ kind: "number", value: 7 }] },
    { label: "2 * 5", stdin: ["2", "*", "5"], expect: [{ kind: "number", value: 10 }] },
    { label: "8 / 2", stdin: ["8", "/", "2"], expect: [{ kind: "number", value: 4 }] },
    {
      label: "알 수 없는 연산자",
      stdin: ["5", "?", "2"],
      expect: [{ kind: "text", contains: "알 수 없는 연산자" }],
    },
  ],
};

const step4: ProjectStep = {
  id: "step-4",
  number: 4,
  title: "0으로 나누기 막기",
  prompt: `나누기에서 두 번째 수가 0 이면 오류가 납니다. 0 으로 나누려 하면 계산 대신 "0으로 나눌 수 없습니다" 를 출력하도록 고치세요.

나누기(/) 갈래 "안에서" 다시 한 번 if 로 b 가 0 인지 확인합니다. 이렇게 조건문 안에 조건문을 넣는 것을 중첩 조건문이라고 해요 (5강).`,
  conceptTags: ["5강 중첩 조건문"],
  example: { stdin: ["5", "/", "0"], stdout: "0으로 나눌 수 없습니다" },
  starterCode: `a = float(input())
op = input()
b = float(input())
if op == "+":
    print(a + b)
elif op == "-":
    print(a - b)
elif op == "*":
    print(a * b)
elif op == "/":
    # b 가 0 이면 "0으로 나눌 수 없습니다", 아니면 a / b 출력
    print(a / b)
else:
    print("알 수 없는 연산자")
`,
  solutionCode: `a = float(input())
op = input()
b = float(input())
if op == "+":
    print(a + b)
elif op == "-":
    print(a - b)
elif op == "*":
    print(a * b)
elif op == "/":
    if b == 0:
        print("0으로 나눌 수 없습니다")
    else:
        print(a / b)
else:
    print("알 수 없는 연산자")
`,
  hints: [
    "나누기(/) 갈래 안에서 다시 if b == 0: 으로 0 인지 확인하세요.",
    '0 이면 print("0으로 나눌 수 없습니다"), 아니면(else:) print(a / b) 입니다. 들여쓰기가 한 칸 더 깊어져요.',
    `정답의 나누기 부분:
elif op == "/":
    if b == 0:
        print("0으로 나눌 수 없습니다")
    else:
        print(a / b)`,
  ],
  tests: [
    { label: "8 / 2", stdin: ["8", "/", "2"], expect: [{ kind: "number", value: 4 }] },
    {
      label: "5 / 0 (0으로 나누기)",
      stdin: ["5", "/", "0"],
      expect: [{ kind: "text", contains: "0으로 나눌 수 없습니다" }],
    },
    {
      label: "7 + 0 (덧셈은 영향 없음)",
      stdin: ["7", "+", "0"],
      expect: [{ kind: "number", value: 7 }],
    },
  ],
};

const step5: ProjectStep = {
  id: "step-5",
  number: 5,
  title: "계속 반복하기",
  prompt: `지금은 한 번 계산하면 프로그램이 끝납니다. 계산이 끝날 때마다 "계속할까요?" 를 물어, 사용자가 y 를 입력하면 다시 계산하고, 아니면 멈추게 만드세요 (6강 while / break).

while True: 로 전체를 감싸고, 맨 끝에서 계속 여부를 입력받아 "y" 가 아니면 break 로 빠져나옵니다.

주의: 계산하는 부분 전체가 while 안으로 들어가야 합니다 (들여쓰기).`,
  conceptTags: ["6강 while/break"],
  example: { stdin: ["3", "+", "4", "y", "10", "-", "2", "n"], stdout: "7.0\n8.0" },
  starterCode: `# 전체를 while True: 로 감싸고, 끝에서 계속할지 물어보세요
while True:
    a = float(input())
    op = input()
    b = float(input())
    if op == "+":
        print(a + b)
    elif op == "-":
        print(a - b)
    elif op == "*":
        print(a * b)
    elif op == "/":
        if b == 0:
            print("0으로 나눌 수 없습니다")
        else:
            print(a / b)
    else:
        print("알 수 없는 연산자")
    # 계속할지 물어보고, "y" 가 아니면 멈추세요
`,
  solutionCode: `while True:
    a = float(input())
    op = input()
    b = float(input())
    if op == "+":
        print(a + b)
    elif op == "-":
        print(a - b)
    elif op == "*":
        print(a * b)
    elif op == "/":
        if b == 0:
            print("0으로 나눌 수 없습니다")
        else:
            print(a / b)
    else:
        print("알 수 없는 연산자")
    again = input()
    if again != "y":
        break
`,
  hints: [
    "맨 끝에 again = input() 으로 계속 여부를 받으세요.",
    'if again != "y": 이면 break 로 반복을 빠져나옵니다.',
    "계산하는 줄들이 모두 while True: 안으로 들여쓰기 되어 있는지 확인하세요.",
    `정답의 마지막 부분:
    again = input()
    if again != "y":
        break`,
  ],
  tests: [
    {
      label: "3+4 → y → 10-2 → n",
      stdin: ["3", "+", "4", "y", "10", "-", "2", "n"],
      expect: [
        { kind: "number", value: 7 },
        { kind: "number", value: 8 },
      ],
    },
    {
      label: "8/0 → n",
      stdin: ["8", "/", "0", "n"],
      expect: [{ kind: "text", contains: "0으로 나눌 수 없습니다" }],
    },
  ],
};

const step6: ProjectStep = {
  id: "step-6",
  number: 6,
  title: "계산기 완성",
  prompt: `이제 지금까지 만든 것을 모두 합쳐 "완성된 계산기" 를 만드세요.

· 여러 번 반복해서 계산할 수 있어야 합니다
· + - * / 를 모두 처리해야 합니다
· 0 으로 나누면 "0으로 나눌 수 없습니다" 를 출력해야 합니다
· 모르는 연산자는 "알 수 없는 연산자" 를 출력해야 합니다

아래 빈 칸에 완성된 계산기를 직접 작성해 제출하세요. 막히면 5단계까지 만든 코드를 떠올려 보세요.`,
  conceptTags: ["1~6강 종합"],
  example: { stdin: ["6", "+", "2", "y", "6", "/", "2", "n"], stdout: "8.0\n3.0" },
  starterCode: `# 지금까지 배운 것을 합쳐 완성된 계산기를 작성하세요.
# (반복 + 사칙연산 분기 + 0 나누기 처리 + 모르는 연산자 처리)
`,
  solutionCode: `while True:
    a = float(input())
    op = input()
    b = float(input())
    if op == "+":
        print(a + b)
    elif op == "-":
        print(a - b)
    elif op == "*":
        print(a * b)
    elif op == "/":
        if b == 0:
            print("0으로 나눌 수 없습니다")
        else:
            print(a / b)
    else:
        print("알 수 없는 연산자")
    again = input()
    if again != "y":
        break
`,
  hints: [
    "5단계에서 만든 코드가 사실상 완성본이에요. 그대로 떠올려 작성해 보세요.",
    "구조: while True: 안에 (입력 3줄) → (if/elif 분기, 나누기엔 중첩 if) → (계속 여부 묻고 break).",
    "0 나누기 처리와 모르는 연산자 처리가 빠지지 않았는지 확인하세요.",
    `정답:
while True:
    a = float(input())
    op = input()
    b = float(input())
    if op == "+":
        print(a + b)
    elif op == "-":
        print(a - b)
    elif op == "*":
        print(a * b)
    elif op == "/":
        if b == 0:
            print("0으로 나눌 수 없습니다")
        else:
            print(a / b)
    else:
        print("알 수 없는 연산자")
    again = input()
    if again != "y":
        break`,
  ],
  tests: [
    {
      label: "사칙연산 연속 (6+2, 6-2, 6*2, 6/2)",
      stdin: ["6", "+", "2", "y", "6", "-", "2", "y", "6", "*", "2", "y", "6", "/", "2", "n"],
      expect: [
        { kind: "number", value: 8 },
        { kind: "number", value: 4 },
        { kind: "number", value: 12 },
        { kind: "number", value: 3 },
      ],
    },
    {
      label: "0 나누기 후 계속",
      stdin: ["5", "/", "0", "y", "9", "+", "1", "n"],
      expect: [
        { kind: "text", contains: "0으로 나눌 수 없습니다" },
        { kind: "number", value: 10 },
      ],
    },
    {
      label: "모르는 연산자 후 계속",
      stdin: ["3", "%", "2", "y", "3", "+", "2", "n"],
      expect: [
        { kind: "text", contains: "알 수 없는 연산자" },
        { kind: "number", value: 5 },
      ],
    },
  ],
};

export const pythonLesson13Project: Project = {
  courseId: "be-python",
  lessonId: "lesson-13",
  lessonNumber: 13,
  title: "계산기 만들기",
  overview: "1~6강에서 배운 것만으로 직접 동작하는 계산기를 완성하는 첫 프로젝트입니다.",
  goal: "입력 → 연산 → 조건 분기 → 반복을 한 줄씩 쌓아, 사칙연산 계산기를 완성합니다.",
  concepts: ["변수와 출력", "입력과 형변환", "연산자", "조건문", "반복문"],
  steps: [step0, step1, step2, step3, step4, step5, step6],
};

/**
 * "<courseId>/<lessonId>" → Project 룩업.
 * 홈 카드 ID(python)와 detail fallback ID(be-python)를 모두 매칭 (lesson-plan 컨벤션과 동일).
 */
export const projectByRef: Record<string, Project> = {
  "be-python/lesson-13": pythonLesson13Project,
  "python/lesson-13": pythonLesson13Project,
};

export function getProject(courseId: string, lessonId: string): Project | undefined {
  return projectByRef[`${courseId}/${lessonId}`];
}
