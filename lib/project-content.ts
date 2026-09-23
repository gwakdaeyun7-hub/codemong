// 프로젝트형 강의(13강~) 콘텐츠 데이터 모듈.
// MVP는 정적 객체 — 추후 backend-developer가 만든 API/Server Action 응답으로 교체 가능.
// (순수 데이터 모듈 — 클라이언트/서버 어디서든 import 가능)
//
// 코딩테스트(백준/프로그래머스) 스타일 — 문제 하나를 읽고 코드를 "한 번에" 완성해 제출한다.
// 스텝별 누적 빌드가 아니라 단일 에디터 + 종합 테스트케이스 채점.
//
// 13강 "계산기 만들기"는 영상 없이 텍스트 문제를 읽고 직접 코드를 작성·실행·채점받는다.
// 1~6강 범위(변수·입출력·연산자·조건문)만으로 구성한다. (반복문도 쓰지 않는 단일 계산.)
// 함수(def)·리스트·딕셔너리·예외처리(try)·split() 은 의도적으로 사용하지 않는다.
// 14강 "랜덤 복습 퀴즈"는 7~8강(리스트·딕셔너리)+10강(random) 중심, 15강 "키오스크"는 1~12강 전체 종합.
// 세 프로젝트 모두 강의에서 다루지 않은 문법(클래스·try/except·람다·컴프리헨션·f-string·split·strip/lower·and/or)은 쓰지 않는다.
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
  /**
   * 채점 시 random 을 고정할 시드 (10강 연습의 Exercise.seed 와 같은 규약).
   * 무작위를 쓰는 프로젝트(14강 랜덤 퀴즈)만 지정 — "실행"은 진짜 무작위, "제출"만 이 시드로 결정적 채점.
   */
  seed?: number;
};

// ─── 13강 「계산기 만들기」 ──────────────────────────────────────────
// 1~6강 문법만으로 사칙연산 계산기를 한 번에 완성한다.

export const pythonLesson13Project: Project = {
  courseId: "be-python",
  lessonId: "lesson-13",
  lessonNumber: 13,
  title: "계산기 만들기",
  overview: "수와 연산자를 입력받아 결과를 출력하는 사칙연산 계산기를 한 번에 완성하는 미션입니다.",
  goal: "입력 → 형변환 → 조건 분기로 사칙연산 계산기를 완성합니다.",
  concepts: ["변수와 출력", "입력과 형변환", "연산자", "조건문"],
  prompt: `1~6강에서 배운 것만으로 사칙연산 계산기를 완성하세요.

프로그램은 다음 순서로 동작합니다.
1) 첫 번째 수를 입력받습니다.
2) 연산자(+, -, *, /)를 입력받습니다.
3) 두 번째 수를 입력받습니다.
4) 연산자에 맞게 계산한 결과를 한 번 출력합니다.

[규칙]
· 입력한 두 수는 float() 로 숫자로 바꿔 계산합니다. (연산자는 글자라서 바꾸지 않아요)
· 나누기인데 두 번째 수가 0 이면, 계산 대신 "0으로 나눌 수 없습니다" 를 출력합니다.
· +, -, *, / 가 아닌 연산자가 들어오면 "알 수 없는 연산자" 를 출력합니다.

입력은 한 줄에 하나씩, 첫 수 → 연산자 → 둘째 수 순서로 받습니다.`,
  examples: [
    { stdin: ["3", "+", "4"], stdout: "7.0" },
    { stdin: ["5", "/", "0"], stdout: "0으로 나눌 수 없습니다" },
    { stdin: ["10", "%", "3"], stdout: "알 수 없는 연산자" },
  ],
  starterCode: `# 1~6강 문법만으로 계산기를 완성하세요.
# 두 수와 연산자를 입력받아 계산하고,
# 0으로 나누기와 모르는 연산자를 처리한 뒤 결과를 출력하세요.

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
    "세 줄을 입력받으세요. a = float(input()), op = input(), b = float(input()). (연산자 op 는 글자라서 float() 을 쓰지 않아요.)",
    'if op == "+": print(a + b) 처럼 +, -, *, / 를 if/elif 로 나누고, 그 외 연산자는 else: 에서 "알 수 없는 연산자" 를 출력하세요.',
    '나누기(/) 갈래 안에서 다시 if b == 0: 으로 확인해, 0 이면 "0으로 나눌 수 없습니다", 아니면 a / b 를 출력하세요. (조건문 안의 조건문 = 중첩 조건문)',
    `정답 예시:
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
    print("알 수 없는 연산자")`,
  ],
  tests: [
    { label: "덧셈 (3 + 4)", stdin: ["3", "+", "4"], expect: [{ kind: "number", value: 7 }] },
    { label: "뺄셈 (10 - 3)", stdin: ["10", "-", "3"], expect: [{ kind: "number", value: 7 }] },
    { label: "곱셈 (6 * 2)", stdin: ["6", "*", "2"], expect: [{ kind: "number", value: 12 }] },
    { label: "나눗셈 (9 / 2)", stdin: ["9", "/", "2"], expect: [{ kind: "number", value: 4.5 }] },
    {
      label: "0으로 나누기 (5 / 0)",
      stdin: ["5", "/", "0"],
      expect: [{ kind: "text", contains: "0으로 나눌 수 없습니다" }],
    },
    {
      label: "모르는 연산자 (3 % 2)",
      stdin: ["3", "%", "2"],
      expect: [{ kind: "text", contains: "알 수 없는 연산자" }],
    },
    {
      label: "소수 곱셈 (2.5 * 4)",
      stdin: ["2.5", "*", "4"],
      expect: [{ kind: "number", value: 10 }],
    },
    {
      label: "음수 빼기 (-5 - -3)",
      stdin: ["-5", "-", "-3"],
      expect: [{ kind: "number", value: -2 }],
    },
  ],
};

// ─── 14강 「랜덤 복습 퀴즈」 ────────────────────────────────────────
// 7~8강(리스트·딕셔너리) + 10강(random) 이 핵심, 9강(함수)·11강(파일 쓰고 읽기)·12강(오류 읽기) 보조.
// 1~12강 문법만 사용. strip/lower/random.sample/and/or 는 강의에 없어 쓰지 않는다.
// 채점은 seed 로 random 을 고정하므로 출제 순서에 의존하는 케이스는 [seed] 1개뿐,
// 나머지는 "전부 오답" / "같은 답만 입력(정답 정확히 1개)" / 범위 밖 N 처럼 순서와 무관하게 설계.

export const pythonLesson14Project: Project = {
  courseId: "be-python",
  lessonId: "lesson-14",
  lessonNumber: 14,
  title: "랜덤 복습 퀴즈",
  overview:
    "파이썬 개념 문제를 딕셔너리 리스트로 모아 두고, 무작위로 뽑아 출제·채점한 뒤 결과를 파일에 남기는 복습 퀴즈를 완성하는 미션입니다.",
  goal: "리스트·딕셔너리로 문제 은행 → random 으로 무작위 출제 → 함수로 채점·저장을 한 프로그램에 담습니다.",
  concepts: ["리스트", "딕셔너리", "함수", "random", "파일 입출력"],
  prompt: `7~12강에서 배운 것(리스트·딕셔너리·함수·random·파일 입출력)을 중심으로 "랜덤 복습 퀴즈" 프로그램을 완성하세요.

문제 은행은 아래 8문항을 딕셔너리 리스트로 만듭니다. 각 문항은 {"question": 질문, "answer": 정답} 형태입니다. 질문 문구는 조금 바꿔도 되지만, 문항의 순서와 정답은 그대로 두세요. (채점에 쓰입니다)
1) 값을 화면에 보여주는 함수의 이름은? → print
2) 키보드로 입력받은 값의 자료형은? (영어) → str
3) 7 % 3 의 결과는? → 1
4) 조건이 참일 때만 실행되게 하는 키워드는? → if
5) range(5) 로 반복하면 몇 번 반복될까요? → 5
6) 여러 값을 순서대로 담는 자료형은? (영어) → list
7) 함수를 만들 때 쓰는 키워드는? → def
8) len([10, 20, 30]) 의 결과는? → 3

프로그램은 다음 순서로 동작합니다.
1) 첫 줄에서 출제할 문제 수 N 을 입력받습니다. (int 로 바꿉니다)
2) N 이 1 미만이거나 8 보다 크면 "문제 수는 1 이상 8 이하로 입력하세요" 를 출력하고 끝냅니다.
3) N 번 반복하며 문제를 냅니다. 번호는 random.randint(0, 7) 로 뽑고, 이미 낸 번호가 나오면 새 번호가 나올 때까지 다시 뽑습니다. (낸 번호를 리스트에 모아 두고 in 으로 확인)
4) 문제마다 질문을 출력하고 답을 한 줄 입력받아, 정답과 같으면 "정답!" 을, 다르면 "오답! 정답은 X" 를 출력합니다. (X 자리에 그 문항의 정답)
5) 다 풀면 "N문제 중 M개 정답" 을 출력합니다. (M = 맞힌 개수)
6) 그 한 줄을 result.txt 에 저장하고, 파일을 다시 열어 읽은 내용을 "저장된 결과: " 뒤에 붙여 출력합니다.

[규칙]
· 답은 소문자·숫자를 그대로 입력하는 것으로 봅니다. 입력받은 문자열을 정답 문자열과 == 로 그대로 비교하세요. 숫자 답도 문자로 비교하니 int() 로 바꾸지 않습니다.
· 문제 하나를 내고 채점하는 함수, 결과를 파일에 저장하고 다시 읽어 출력하는 함수 — 최소 2개의 함수로 역할을 나눕니다.
· 범위 검사는 if 와 elif 두 갈래로 나눠도 됩니다. (두 갈래에서 같은 문구를 출력)
· 파일은 with open("result.txt", "w") 로 쓰고, with open("result.txt", "r") 로 다시 읽습니다.
· 실행 중 빨간 오류가 나면 마지막 줄의 오류 이름과 줄 번호부터 읽어 보세요. (12강) 그래도 막히면 힌트를 열어 보세요.

[실행] 버튼은 매번 다른 순서로 문제가 나옵니다. [제출] 채점은 무작위를 고정해서 확인하니, 위 순서대로 문제 은행을 만들었다면 그대로 통과합니다.

입력은 한 줄에 하나씩, 문제 수 → 답 → 답 → … 순서로 받습니다.`,
  examples: [
    {
      stdin: ["2", "print", "x"],
      stdout:
        "1번. 값을 화면에 보여주는 함수의 이름은?\n정답!\n2번. 함수를 만들 때 쓰는 키워드는?\n오답! 정답은 def\n2문제 중 1개 정답\n저장된 결과: 2문제 중 1개 정답\n(출제 순서는 실행할 때마다 달라요)",
    },
    { stdin: ["0"], stdout: "문제 수는 1 이상 8 이하로 입력하세요" },
    {
      stdin: ["1", "x"],
      stdout:
        "1번. 7 % 3 의 결과는?\n오답! 정답은 1\n1문제 중 0개 정답\n저장된 결과: 1문제 중 0개 정답\n(출제 순서는 실행할 때마다 달라요)",
    },
  ],
  starterCode: `# 1~12강 문법만으로 랜덤 복습 퀴즈를 완성하세요.
# 1) 문제 은행: 딕셔너리 8개를 담은 리스트 (순서·정답은 문제 설명대로)
#    bank = [
#        {"question": "값을 화면에 보여주는 함수의 이름은?", "answer": "print"},
#        ...
#    ]
# 2) 문제 수 N 입력 → 범위 밖이면 안내 문구 출력 후 종료
# 3) random.randint 로 번호를 뽑되 이미 낸 번호는 다시 뽑기 (리스트 + in)
# 4) 문제 하나를 내고 채점하는 함수 / 결과를 저장하고 다시 읽어 출력하는 함수

import random

`,
  solutionCode: `import random

bank = [
    {"question": "값을 화면에 보여주는 함수의 이름은?", "answer": "print"},
    {"question": "키보드로 입력받은 값의 자료형은? (영어)", "answer": "str"},
    {"question": "7 % 3 의 결과는?", "answer": "1"},
    {"question": "조건이 참일 때만 실행되게 하는 키워드는?", "answer": "if"},
    {"question": "range(5) 로 반복하면 몇 번 반복될까요?", "answer": "5"},
    {"question": "여러 값을 순서대로 담는 자료형은? (영어)", "answer": "list"},
    {"question": "함수를 만들 때 쓰는 키워드는?", "answer": "def"},
    {"question": "len([10, 20, 30]) 의 결과는?", "answer": "3"},
]

def ask(number, item):
    print(str(number) + "번. " + item["question"])
    answer = input()
    if answer == item["answer"]:
        print("정답!")
        return 1
    else:
        print("오답! 정답은 " + item["answer"])
        return 0

def save_result(summary):
    with open("result.txt", "w") as f:
        f.write(summary)
    with open("result.txt", "r") as f:
        saved = f.read()
    print("저장된 결과: " + saved)

n = int(input())
warning = "문제 수는 1 이상 " + str(len(bank)) + " 이하로 입력하세요"
if n < 1:
    print(warning)
elif n > len(bank):
    print(warning)
else:
    used = []
    score = 0
    for i in range(n):
        num = random.randint(0, len(bank) - 1)
        while num in used:
            num = random.randint(0, len(bank) - 1)
        used.append(num)
        score = score + ask(i + 1, bank[num])
    summary = str(n) + "문제 중 " + str(score) + "개 정답"
    print(summary)
    save_result(summary)
`,
  hints: [
    '먼저 문제 은행을 만드세요. bank = [ {"question": "...", "answer": "print"}, ... ] 처럼 딕셔너리 8개를 리스트에 담습니다(7~8강). 그 다음 n = int(input()) 으로 문제 수를 받고, if n < 1: / elif n > len(bank): 두 갈래에서 같은 안내 문구를 출력한 뒤 else: 안에서 퀴즈를 진행하세요.',
    "번호 뽑기: num = random.randint(0, len(bank) - 1) 로 0~7 사이 번호를 뽑습니다(10강). 이미 낸 번호를 used = [] 에 모아 두고, while num in used: 안에서 다시 뽑으면 새 번호가 나올 때까지 반복돼요. 새 번호가 정해지면 used.append(num) 으로 기록하고 bank[num] 이 이번 문제입니다.",
    '문제 하나를 내는 함수를 만드세요. def ask(number, item): 안에서 item["question"] 을 출력하고 answer = input() 으로 답을 받은 뒤, answer == item["answer"] 이면 "정답!" 을 출력하고 return 1, 아니면 "오답! 정답은 " + item["answer"] 를 출력하고 return 0. 바깥에서는 score = score + ask(i + 1, bank[num]) 처럼 돌려받은 값을 더합니다(9강).',
    '마지막으로 summary = str(n) + "문제 중 " + str(score) + "개 정답" 을 출력하고, 저장 함수에 넘기세요. def save_result(summary): 안에서 with open("result.txt", "w") as f: f.write(summary) 로 쓰고, 다시 with open("result.txt", "r") as f: saved = f.read() 로 읽어 print("저장된 결과: " + saved) 합니다(11강). 오류가 나면 메시지 마지막 줄의 오류 이름(NameError, TypeError 등)과 줄 번호부터 확인하세요(12강).',
    `정답 예시:
import random

bank = [
    {"question": "값을 화면에 보여주는 함수의 이름은?", "answer": "print"},
    {"question": "키보드로 입력받은 값의 자료형은? (영어)", "answer": "str"},
    {"question": "7 % 3 의 결과는?", "answer": "1"},
    {"question": "조건이 참일 때만 실행되게 하는 키워드는?", "answer": "if"},
    {"question": "range(5) 로 반복하면 몇 번 반복될까요?", "answer": "5"},
    {"question": "여러 값을 순서대로 담는 자료형은? (영어)", "answer": "list"},
    {"question": "함수를 만들 때 쓰는 키워드는?", "answer": "def"},
    {"question": "len([10, 20, 30]) 의 결과는?", "answer": "3"},
]

def ask(number, item):
    print(str(number) + "번. " + item["question"])
    answer = input()
    if answer == item["answer"]:
        print("정답!")
        return 1
    else:
        print("오답! 정답은 " + item["answer"])
        return 0

def save_result(summary):
    with open("result.txt", "w") as f:
        f.write(summary)
    with open("result.txt", "r") as f:
        saved = f.read()
    print("저장된 결과: " + saved)

n = int(input())
warning = "문제 수는 1 이상 " + str(len(bank)) + " 이하로 입력하세요"
if n < 1:
    print(warning)
elif n > len(bank):
    print(warning)
else:
    used = []
    score = 0
    for i in range(n):
        num = random.randint(0, len(bank) - 1)
        while num in used:
            num = random.randint(0, len(bank) - 1)
        used.append(num)
        score = score + ask(i + 1, bank[num])
    summary = str(n) + "문제 중 " + str(score) + "개 정답"
    print(summary)
    save_result(summary)`,
  ],
  tests: [
    {
      label: "문제 수 0 (범위 밖)",
      stdin: ["0"],
      expect: [{ kind: "text", contains: "문제 수는 1 이상 8 이하로 입력하세요" }],
    },
    {
      label: "문제 수 9 (은행보다 많음)",
      stdin: ["9"],
      expect: [{ kind: "text", contains: "문제 수는 1 이상 8 이하로 입력하세요" }],
    },
    {
      label: "문제 수 -3 (음수)",
      stdin: ["-3"],
      expect: [{ kind: "text", contains: "문제 수는 1 이상 8 이하로 입력하세요" }],
    },
    {
      label: "1문제, 오답",
      stdin: ["1", "x"],
      expect: [
        { kind: "text", contains: "오답! 정답은" },
        { kind: "text", contains: "1문제 중 0개 정답" },
        { kind: "text", contains: "저장된 결과: 1문제 중 0개 정답" },
      ],
    },
    {
      label: "3문제 전부 오답",
      stdin: ["3", "x", "x", "x"],
      expect: [
        { kind: "text", contains: "오답! 정답은" },
        { kind: "text", contains: "오답! 정답은" },
        { kind: "text", contains: "오답! 정답은" },
        { kind: "text", contains: "3문제 중 0개 정답" },
        { kind: "text", contains: "저장된 결과: 3문제 중 0개 정답" },
      ],
    },
    {
      label: "8문제 전부 오답 (은행 전체, 중복 없이 출제)",
      stdin: ["8", "x", "x", "x", "x", "x", "x", "x", "x"],
      expect: [
        { kind: "text", contains: "오답! 정답은" },
        { kind: "text", contains: "오답! 정답은" },
        { kind: "text", contains: "오답! 정답은" },
        { kind: "text", contains: "오답! 정답은" },
        { kind: "text", contains: "오답! 정답은" },
        { kind: "text", contains: "오답! 정답은" },
        { kind: "text", contains: "오답! 정답은" },
        { kind: "text", contains: "오답! 정답은" },
        { kind: "text", contains: "8문제 중 0개 정답" },
        { kind: "text", contains: "저장된 결과: 8문제 중 0개 정답" },
      ],
    },
    {
      label: "8문제 모두 print 라고 답하기 (정답 정확히 1개)",
      stdin: ["8", "print", "print", "print", "print", "print", "print", "print", "print"],
      expect: [
        { kind: "text", contains: "정답!" },
        { kind: "text", contains: "8문제 중 1개 정답" },
        { kind: "text", contains: "저장된 결과: 8문제 중 1개 정답" },
      ],
    },
    {
      label: "[seed] 4문제, 셋째만 오답 (시드 2026 출제 순서: str → list → if → def)",
      stdin: ["4", "str", "list", "x", "def"],
      expect: [
        { kind: "text", contains: "정답!" },
        { kind: "text", contains: "정답!" },
        { kind: "text", contains: "오답! 정답은 if" },
        { kind: "text", contains: "정답!" },
        { kind: "text", contains: "4문제 중 3개 정답" },
        { kind: "text", contains: "저장된 결과: 4문제 중 3개 정답" },
      ],
    },
  ],
  seed: 2026,
};

// ─── 15강 「키오스크 만들기」 ──────────────────────────────────────
// 1~12강 전체 종합: 메뉴 딕셔너리 · while 주문 반복 · 리스트 누적 · 함수 분리 · 합계 · 영수증 파일 저장/읽기 · 잘못된 입력 처리.
// 무작위 없음(seed 미지정). "\n" 은 강의에 없어 [규칙] 에서 줄바꿈 글자로 한 줄 소개한다.

export const pythonLesson15Project: Project = {
  courseId: "be-python",
  lessonId: "lesson-15",
  lessonNumber: 15,
  title: "키오스크 만들기",
  overview:
    "메뉴를 보여주고 주문을 반복해서 받아 담은 뒤, 합계가 적힌 영수증을 파일로 저장하는 카페 키오스크를 한 번에 완성하는 미션입니다.",
  goal: "딕셔너리·리스트·while·함수·파일 입출력을 한 프로그램에 모아 주문부터 영수증 저장까지 완성합니다.",
  concepts: ["딕셔너리", "리스트", "반복문", "함수", "파일 입출력", "조건문"],
  prompt: `1~12강에서 배운 것을 모두 모아 카페 키오스크 프로그램을 완성하세요.

메뉴는 아래 4가지를 딕셔너리로 만듭니다. (이름 → 가격, 원 단위 정수)
아메리카노 3000 / 카페라떼 4000 / 녹차 3500 / 샌드위치 5500
메뉴를 순서대로 출력할 수 있게 이름만 담은 리스트도 함께 만들어 두세요. (7강 리스트 + 8강 딕셔너리 조회)

프로그램은 다음 순서로 동작합니다.
1) 시작하면 "[메뉴]" 를 출력한 뒤, 메뉴 이름과 가격을 한 줄에 하나씩 "아메리카노 3000원" 형태로 출력합니다.
2) 메뉴 이름을 한 줄 입력받습니다. "종료" 가 들어오면 주문 받기를 끝냅니다.
3) 메뉴에 없는 이름이면 "메뉴에 없습니다" 를 출력하고 2) 로 돌아갑니다. (수량은 묻지 않아요)
4) 메뉴에 있으면 수량을 한 줄 입력받아 int 로 바꿉니다. 1 미만이면 "수량은 1 이상이어야 합니다" 를 출력하고 2) 로 돌아갑니다.
5) 주문을 리스트에 담고 "아메리카노 2개 담았습니다" 처럼 출력합니다.
6) 주문 받기가 끝났을 때 담긴 주문이 하나도 없으면 "주문한 메뉴가 없습니다" 를 출력하고 끝냅니다.
7) 주문이 있으면 영수증을 만들어 receipt.txt 에 저장한 뒤, 파일을 다시 열어 읽은 내용을 화면에 출력하고 마지막에 "영수증 저장 완료" 를 출력합니다.

영수증 형식 (한 줄에 하나씩):
[영수증]
아메리카노 x 2 = 6000원
카페라떼 x 1 = 4000원
합계 10000원

[규칙]
· 함수를 최소 3개 만들어 역할을 나눕니다: 메뉴 출력 / 주문을 리스트에 담기 / 영수증 줄들을 만들어 돌려주기.
· 9강에서는 함수에 숫자·문자열만 넘겼지만, 여기서는 주문 리스트를 함수에 그대로 넘겨 담고 읽습니다. 넘기는 방법은 똑같아요 — 괄호 안에 변수 이름을 적으면 됩니다.
· 주문 하나는 {"name": 이름, "count": 수량} 딕셔너리로 리스트에 담습니다. 같은 메뉴를 두 번 담으면 영수증에도 두 줄로 나옵니다. (합치지 않아도 됩니다)
· 금액 = 가격 × 수량. 정수로 계산하고, 문자열과 이어 붙일 땐 str() 로 바꿉니다.
· 파일에 여러 줄을 적을 땐 줄마다 f.write(줄 + "\\n") 처럼 씁니다. "\\n" 은 줄바꿈 글자예요. 파일은 with open("receipt.txt", "w") 로 쓰고, with open("receipt.txt", "r") 로 다시 읽습니다.
· 반복은 while True: 와 break 로, 메뉴 확인은 if 이름 in 메뉴: 로 합니다. and / or 는 쓰지 않아도 풀립니다.

입력은 한 줄에 하나씩, 메뉴 이름 → 수량 → 메뉴 이름 → 수량 → … → 종료 순서로 받습니다.`,
  examples: [
    {
      stdin: ["아메리카노", "2", "카페라떼", "1", "종료"],
      stdout:
        "[메뉴]\n아메리카노 3000원\n카페라떼 4000원\n녹차 3500원\n샌드위치 5500원\n아메리카노 2개 담았습니다\n카페라떼 1개 담았습니다\n[영수증]\n아메리카노 x 2 = 6000원\n카페라떼 x 1 = 4000원\n합계 10000원\n\n영수증 저장 완료",
    },
    {
      stdin: ["콜라", "녹차", "0", "종료"],
      stdout:
        "[메뉴]\n아메리카노 3000원\n카페라떼 4000원\n녹차 3500원\n샌드위치 5500원\n메뉴에 없습니다\n수량은 1 이상이어야 합니다\n주문한 메뉴가 없습니다",
    },
    {
      stdin: ["종료"],
      stdout:
        "[메뉴]\n아메리카노 3000원\n카페라떼 4000원\n녹차 3500원\n샌드위치 5500원\n주문한 메뉴가 없습니다",
    },
  ],
  starterCode: `# 1~12강 문법만으로 카페 키오스크를 완성하세요.
# 1) 메뉴 딕셔너리: 아메리카노 3000 / 카페라떼 4000 / 녹차 3500 / 샌드위치 5500
# 2) 함수 3개: 메뉴 출력 / 주문을 리스트에 담기 / 영수증 줄 리스트 만들기
# 3) while True 로 주문 반복 — "종료" 면 break, 없는 메뉴·1 미만 수량은 안내 후 다시
# 4) 주문이 없으면 안내, 있으면 영수증을 receipt.txt 에 저장하고 다시 읽어 출력

`,
  solutionCode: `menu = {"아메리카노": 3000, "카페라떼": 4000, "녹차": 3500, "샌드위치": 5500}
names = ["아메리카노", "카페라떼", "녹차", "샌드위치"]

def show_menu():
    print("[메뉴]")
    for name in names:
        print(name + " " + str(menu[name]) + "원")

def add_order(orders, name, count):
    orders.append({"name": name, "count": count})
    print(name + " " + str(count) + "개 담았습니다")

def make_receipt(orders):
    lines = ["[영수증]"]
    total = 0
    for order in orders:
        price = menu[order["name"]] * order["count"]
        lines.append(order["name"] + " x " + str(order["count"]) + " = " + str(price) + "원")
        total = total + price
    lines.append("합계 " + str(total) + "원")
    return lines

show_menu()
orders = []
while True:
    name = input()
    if name == "종료":
        break
    if name in menu:
        count = int(input())
        if count < 1:
            print("수량은 1 이상이어야 합니다")
        else:
            add_order(orders, name, count)
    else:
        print("메뉴에 없습니다")

if len(orders) == 0:
    print("주문한 메뉴가 없습니다")
else:
    lines = make_receipt(orders)
    with open("receipt.txt", "w") as f:
        for line in lines:
            f.write(line + "\\n")
    with open("receipt.txt", "r") as f:
        print(f.read())
    print("영수증 저장 완료")
`,
  hints: [
    '메뉴 딕셔너리와 이름 리스트를 함께 만드세요. menu = {"아메리카노": 3000, ...} 와 names = ["아메리카노", "카페라떼", "녹차", "샌드위치"]. 메뉴 출력 함수는 def show_menu(): 안에서 "[메뉴]" 를 출력하고, for name in names: 로 이름을 하나씩 꺼내(7강) print(name + " " + str(menu[name]) + "원") 으로 그 이름의 가격을 조회해 출력합니다(8강). 가격은 숫자라서 str() 로 바꿔야 이어 붙일 수 있어요.',
    'orders = [] 를 만들고 while True: 로 반복하세요. name = input() 으로 이름을 받아 if name == "종료": break. 그 다음 if name in menu: 로 메뉴에 있는지 확인하고, else: 에서 "메뉴에 없습니다" 를 출력하면 자동으로 다음 반복(다시 이름 입력)으로 갑니다(6강). 없는 메뉴일 땐 수량을 묻지 않도록 int(input()) 은 if 안쪽에 두세요.',
    '메뉴에 있으면 count = int(input()) 으로 수량을 받고, if count < 1: "수량은 1 이상이어야 합니다" 를 출력, else: 에서 담기 함수를 부르세요. def add_order(orders, name, count): 안에서 orders.append({"name": name, "count": count}) 로 딕셔너리를 리스트에 넣고 print(name + " " + str(count) + "개 담았습니다") 합니다(7강·9강).',
    '반복이 끝나면 if len(orders) == 0: "주문한 메뉴가 없습니다". 아니면 def make_receipt(orders): 로 영수증 줄을 만드세요 — lines = ["[영수증]"] 에서 시작해 for order in orders: 마다 price = menu[order["name"]] * order["count"] 를 계산해 lines.append(order["name"] + " x " + str(order["count"]) + " = " + str(price) + "원"), total 에 price 를 누적하고 마지막에 "합계 " + str(total) + "원" 을 append 한 뒤 return lines. 파일은 with open("receipt.txt", "w") as f: 안에서 for line in lines: f.write(line + "\\n"), 다시 "r" 로 열어 print(f.read()), 끝으로 "영수증 저장 완료" 를 출력합니다(11강).',
    `정답 예시:
menu = {"아메리카노": 3000, "카페라떼": 4000, "녹차": 3500, "샌드위치": 5500}
names = ["아메리카노", "카페라떼", "녹차", "샌드위치"]

def show_menu():
    print("[메뉴]")
    for name in names:
        print(name + " " + str(menu[name]) + "원")

def add_order(orders, name, count):
    orders.append({"name": name, "count": count})
    print(name + " " + str(count) + "개 담았습니다")

def make_receipt(orders):
    lines = ["[영수증]"]
    total = 0
    for order in orders:
        price = menu[order["name"]] * order["count"]
        lines.append(order["name"] + " x " + str(order["count"]) + " = " + str(price) + "원")
        total = total + price
    lines.append("합계 " + str(total) + "원")
    return lines

show_menu()
orders = []
while True:
    name = input()
    if name == "종료":
        break
    if name in menu:
        count = int(input())
        if count < 1:
            print("수량은 1 이상이어야 합니다")
        else:
            add_order(orders, name, count)
    else:
        print("메뉴에 없습니다")

if len(orders) == 0:
    print("주문한 메뉴가 없습니다")
else:
    lines = make_receipt(orders)
    with open("receipt.txt", "w") as f:
        for line in lines:
            f.write(line + "\\n")
    with open("receipt.txt", "r") as f:
        print(f.read())
    print("영수증 저장 완료")`,
  ],
  tests: [
    {
      label: "아메리카노 2잔 주문",
      stdin: ["아메리카노", "2", "종료"],
      expect: [
        { kind: "text", contains: "[메뉴]" },
        { kind: "text", contains: "아메리카노 3000원" },
        { kind: "text", contains: "아메리카노 2개 담았습니다" },
        { kind: "text", contains: "[영수증]" },
        { kind: "text", contains: "아메리카노 x 2 = 6000원" },
        { kind: "text", contains: "합계 " },
        { kind: "number", value: 6000 },
        { kind: "text", contains: "영수증 저장 완료" },
      ],
    },
    {
      label: "여러 메뉴 주문 (카페라떼 1, 샌드위치 2)",
      stdin: ["카페라떼", "1", "샌드위치", "2", "종료"],
      expect: [
        { kind: "text", contains: "카페라떼 1개 담았습니다" },
        { kind: "text", contains: "샌드위치 2개 담았습니다" },
        { kind: "text", contains: "카페라떼 x 1 = 4000원" },
        { kind: "text", contains: "샌드위치 x 2 = 11000원" },
        { kind: "text", contains: "합계 " },
        { kind: "number", value: 15000 },
        { kind: "text", contains: "영수증 저장 완료" },
      ],
    },
    {
      label: "없는 메뉴 입력 뒤 정상 주문",
      stdin: ["콜라", "녹차", "1", "종료"],
      expect: [
        { kind: "text", contains: "메뉴에 없습니다" },
        { kind: "text", contains: "녹차 1개 담았습니다" },
        { kind: "text", contains: "녹차 x 1 = 3500원" },
        { kind: "text", contains: "합계 " },
        { kind: "number", value: 3500 },
      ],
    },
    {
      label: "수량 0 입력 뒤 다시 주문",
      stdin: ["아메리카노", "0", "아메리카노", "3", "종료"],
      expect: [
        { kind: "text", contains: "수량은 1 이상이어야 합니다" },
        { kind: "text", contains: "아메리카노 3개 담았습니다" },
        { kind: "text", contains: "아메리카노 x 3 = 9000원" },
        { kind: "text", contains: "합계 " },
        { kind: "number", value: 9000 },
      ],
    },
    {
      label: "같은 메뉴 두 번 담기 (녹차 1, 녹차 2)",
      stdin: ["녹차", "1", "녹차", "2", "종료"],
      expect: [
        { kind: "text", contains: "녹차 x 1 = 3500원" },
        { kind: "text", contains: "녹차 x 2 = 7000원" },
        { kind: "text", contains: "합계 " },
        { kind: "number", value: 10500 },
        { kind: "text", contains: "영수증 저장 완료" },
      ],
    },
    {
      label: "바로 종료 (주문 없음)",
      stdin: ["종료"],
      expect: [
        { kind: "text", contains: "[메뉴]" },
        { kind: "text", contains: "주문한 메뉴가 없습니다" },
      ],
    },
    {
      label: "없는 메뉴만 입력하고 종료",
      stdin: ["콜라", "종료"],
      expect: [
        { kind: "text", contains: "메뉴에 없습니다" },
        { kind: "text", contains: "주문한 메뉴가 없습니다" },
      ],
    },
    {
      label: "음수 수량 입력 뒤 종료",
      stdin: ["샌드위치", "-1", "종료"],
      expect: [
        { kind: "text", contains: "수량은 1 이상이어야 합니다" },
        { kind: "text", contains: "주문한 메뉴가 없습니다" },
      ],
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
  "be-python/lesson-14": pythonLesson14Project,
  "python/lesson-14": pythonLesson14Project,
  "be-python/lesson-15": pythonLesson15Project,
  "python/lesson-15": pythonLesson15Project,
};

export function getProject(courseId: string, lessonId: string): Project | undefined {
  return projectByRef[`${courseId}/${lessonId}`];
}
