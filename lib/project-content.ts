// 프로젝트형 강의(13강~) 콘텐츠 데이터 모듈.
// MVP는 정적 객체 — 추후 backend-developer가 만든 API/Server Action 응답으로 교체 가능.
// (순수 데이터 모듈 — 클라이언트/서버 어디서든 import 가능)
//
// 코딩테스트(백준/프로그래머스) 스타일 — 문제 하나를 읽고 코드를 "한 번에" 완성해 제출한다.
// 스텝별 누적 빌드가 아니라 단일 에디터 + 종합 테스트케이스 채점.
//
// 13강 "계산기 만들기"는 영상 없이 텍스트 문제를 읽고 직접 코드를 작성·실행·채점받는다.
// 1~6강 문법(변수·입출력·연산자·조건문·반복문)만으로 구성한다.
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

/** 입출력 예시 (문제 카드에 표시) */
export type ProjectExample = { stdin: string[]; stdout: string };

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
  /** 문제 설명 — 한 번에 완성할 전체 요구사항. 빈 줄로 단락 구분 */
  prompt: string;
  /** 입출력 예시 (여러 개) */
  examples: ProjectExample[];
  /** 에디터 시작 코드 (주석 가이드) */
  starterCode: string;
  /** 모범 정답 (그 자체로 실행 가능한 완전한 코드) */
  solutionCode: string;
  /** 힌트 사다리 (단계적으로 공개, 마지막은 정답 안내) */
  hints: string[];
  /** 채점 테스트 (종합) */
  tests: TestCase[];
};

// ─── 13강 「계산기 만들기」 ──────────────────────────────────────────
// 1~6강 문법만으로 사칙연산 계산기를 한 번에 완성한다.

export const pythonLesson13Project: Project = {
  courseId: "be-python",
  lessonId: "lesson-13",
  lessonNumber: 13,
  title: "계산기 만들기",
  overview: "1~6강에서 배운 것만으로 동작하는 사칙연산 계산기를 한 번에 완성하는 프로젝트입니다.",
  goal: "입력 → 연산 → 조건 분기 → 반복을 모두 담아, 사칙연산 계산기를 완성합니다.",
  concepts: ["변수와 출력", "입력과 형변환", "연산자", "조건문", "반복문"],
  prompt: `1~6강에서 배운 것만으로 사칙연산 계산기를 완성하세요.

프로그램은 다음을 반복합니다.
1) 첫 번째 수를 입력받습니다.
2) 연산자(+, -, *, /)를 입력받습니다.
3) 두 번째 수를 입력받습니다.
4) 연산자에 맞게 계산한 결과를 출력합니다.
5) 계산이 끝나면 계속할지 물어봅니다. "y" 를 입력하면 처음부터 다시, 아니면 프로그램을 끝냅니다.

[규칙]
· 입력한 수는 float() 로 숫자로 바꿔 계산합니다. (연산자는 글자라서 바꾸지 않아요)
· 나누기인데 두 번째 수가 0 이면, 계산 대신 "0으로 나눌 수 없습니다" 를 출력합니다.
· +, -, *, / 가 아닌 연산자가 들어오면 "알 수 없는 연산자" 를 출력합니다.

입력은 한 줄에 하나씩 받습니다. (첫 수 → 연산자 → 둘째 수 → 계속 여부 순서)`,
  examples: [
    { stdin: ["3", "+", "4", "n"], stdout: "7.0" },
    { stdin: ["5", "/", "0", "n"], stdout: "0으로 나눌 수 없습니다" },
    { stdin: ["3", "+", "4", "y", "6", "*", "2", "n"], stdout: "7.0\n12.0" },
  ],
  starterCode: `# 1~6강 문법만으로 계산기를 완성하세요.
# while 반복 안에서: 두 수와 연산자를 입력받아 계산하고,
# 0으로 나누기와 모르는 연산자를 처리한 뒤, 계속할지 물어보세요.

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
    "먼저 한 번만 계산하는 것부터 만들어요. a = float(input()), op = input(), b = float(input()) 로 세 줄을 입력받으세요. (연산자 op 는 글자라서 float() 을 쓰지 않아요.)",
    'if op == "+": print(a + b) 처럼 +, -, *, / 를 elif 로 나누고, 그 외 연산자는 else: 에서 "알 수 없는 연산자" 를 출력하세요.',
    '나누기(/) 갈래 안에서 다시 if b == 0: 으로 확인해, 0 이면 "0으로 나눌 수 없습니다", 아니면 a / b 를 출력하세요. (조건문 안의 조건문 = 중첩 조건문)',
    '마지막으로 전체를 while True: 로 감싸고(아래를 모두 들여쓰기), 맨 끝에 again = input() 으로 계속할지 받아 if again != "y": break 로 빠져나오세요.',
    `정답 예시:
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
      label: "한 번 계산 후 종료 (10 - 3)",
      stdin: ["10", "-", "3", "n"],
      expect: [{ kind: "number", value: 7 }],
    },
    {
      label: "0으로 나누기",
      stdin: ["5", "/", "0", "n"],
      expect: [{ kind: "text", contains: "0으로 나눌 수 없습니다" }],
    },
    {
      label: "0으로 나눈 뒤 계속 계산",
      stdin: ["5", "/", "0", "y", "9", "+", "1", "n"],
      expect: [
        { kind: "text", contains: "0으로 나눌 수 없습니다" },
        { kind: "number", value: 10 },
      ],
    },
    {
      label: "모르는 연산자",
      stdin: ["3", "%", "2", "n"],
      expect: [{ kind: "text", contains: "알 수 없는 연산자" }],
    },
    {
      label: "모르는 연산자 뒤 계속 계산",
      stdin: ["3", "%", "2", "y", "3", "+", "2", "n"],
      expect: [
        { kind: "text", contains: "알 수 없는 연산자" },
        { kind: "number", value: 5 },
      ],
    },
    {
      label: "소수와 음수 (2.5*4, -3+3)",
      stdin: ["2.5", "*", "4", "y", "-3", "+", "3", "n"],
      expect: [
        { kind: "number", value: 10 },
        { kind: "number", value: 0 },
      ],
    },
    {
      label: "여러 번 반복 (1+1, 2+2, 3+3, 4+4)",
      stdin: ["1", "+", "1", "y", "2", "+", "2", "y", "3", "+", "3", "y", "4", "+", "4", "n"],
      expect: [
        { kind: "number", value: 2 },
        { kind: "number", value: 4 },
        { kind: "number", value: 6 },
        { kind: "number", value: 8 },
      ],
    },
    {
      label: "0을 피연산자로 (5*0, 0+7)",
      stdin: ["5", "*", "0", "y", "0", "+", "7", "n"],
      expect: [
        { kind: "number", value: 0 },
        { kind: "number", value: 7 },
      ],
    },
    {
      label: "0으로 나누기 두 번 연속",
      stdin: ["4", "/", "0", "y", "8", "/", "0", "n"],
      expect: [
        { kind: "text", contains: "0으로 나눌 수 없습니다" },
        { kind: "text", contains: "0으로 나눌 수 없습니다" },
      ],
    },
    {
      label: "큰 수 (1000+2000)",
      stdin: ["1000", "+", "2000", "n"],
      expect: [{ kind: "number", value: 3000 }],
    },
    {
      label: "음수 입력 빼기 (-5 - -3)",
      stdin: ["-5", "-", "-3", "n"],
      expect: [{ kind: "number", value: -2 }],
    },
  ],
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
