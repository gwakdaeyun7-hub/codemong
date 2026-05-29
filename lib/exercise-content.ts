// 강별 코드 연습 문제 트랙 — 13강 프로젝트(project-content.ts)와 별개인 경량 단일 문제 세트.
// 영상 1~12강을 보고 "그 강까지 배운 문법만"으로 푸는 코딩테스트식 미니 문제다.
//   · 강당 0~3문제. N강 문제는 1~N강 누적 범위만 사용 (미래 강 문법 배제).
//   · 영상에 안 나온 응용 포인트는 note(항상 보이는 설명글)로 보충 — 펼치는 힌트 사다리 아님.
//   · 채점은 13강과 동일한 stdin→stdout 엔진(lib/project/grader.ts) 재사용.
//     random 을 쓰는 강(10강)은 Exercise.seed 를 grader 가 채점 시 주입해 결과를 결정적으로
//     만든다(학습자 코드엔 seed 없음). 실행("직접 돌려보기")은 seed 없이 진짜 무작위.
//
// 채점 규약(13강과 동일): expect 를 "순차 소비". 숫자는 허용오차 비교, 텍스트는 부분일치.
// 모든 expect 는 실제 Python 3.12(= Pyodide 동일 CPython)로 solutionCode 를 돌려 확인한 값이다.
// (순수 데이터 모듈 — 클라이언트/서버 어디서든 import 가능)

import type { TestCase } from "@/lib/project-content";

export type Exercise = {
  id: string;
  /** 1-based 문제 번호 (UI 칩) */
  number: number;
  title: string;
  /** 문제 설명 — 빈 줄로 단락 구분 */
  prompt: string;
  /**
   * 영상에 없는 응용·헷갈리는 지점 보충 설명 (문제 아래 항상 노출되는 고정 글).
   * "배운 것의 조합/리마인드"만 — 안 배운 새 문법을 가르치는 용도가 아니다.
   */
  note?: string;
  /** 어느 강 문법인지 태그 (UI 칩) */
  conceptTags: string[];
  /** 입출력 예시 (문제 카드 표시 + 입력칸 placeholder). 보통 채점 첫 케이스와 일치 */
  example?: { stdin: string[]; stdout: string };
  /** 에디터 시작 스캐폴드 */
  starterCode: string;
  /** 모범 정답 (그 자체로 실행 가능한 완전한 코드) */
  solutionCode: string;
  /** random 등 비결정 코드를 채점 시 결정적으로 만들기 위해 grader 가 주입할 시드. 없으면 주입 안 함 */
  seed?: number;
  /** 채점 테스트 (stdin → expect). 13강 TestCase 재사용 */
  tests: TestCase[];
};

export type ExerciseSet = {
  courseId: string;
  lessonId: string;
  lessonNumber: number;
  /** 강 제목 */
  title: string;
  exercises: Exercise[];
};

// ─── 1강 「파이썬 개요 & 개발환경」 ───────────────────────────────────
// 영상은 print 를 설명 없이 시연(`print("Hello, Python")`)만 했다. 가장 가벼운 출력 따라하기 1문제.

const l1ex1: Exercise = {
  id: "ex-1",
  number: 1,
  title: "화면에 인사 출력하기",
  prompt: `화면에 Hello, World! 라고 정확히 출력하세요.

영상에서 본 것처럼 print( ) 괄호 안에 따옴표로 감싼 글자를 넣으면, 그 글자가 화면에 나옵니다.`,
  note: `print( ) 는 괄호 안의 값을 화면에 보여주는 명령이에요. 글자는 "큰따옴표"나 '작은따옴표'로 감싸면 됩니다. 따옴표 안의 내용(Hello, World!)은 대문자·쉼표·느낌표까지 똑같이 적어야 통과해요.`,
  conceptTags: ["1강 print()"],
  example: { stdin: [], stdout: "Hello, World!" },
  starterCode: `# 화면에 Hello, World! 를 출력하세요
`,
  solutionCode: `print("Hello, World!")
`,
  tests: [{ label: "Hello, World! 출력", stdin: [], expect: [{ kind: "text", contains: "Hello, World!" }] }],
};

const pythonLesson1Exercises: ExerciseSet = {
  courseId: "be-python",
  lessonId: "lesson-1",
  lessonNumber: 1,
  title: "파이썬 개요 & 개발환경",
  exercises: [l1ex1],
};

// ─── 3강 「변수와 자료형」 ────────────────────────────────────────────
// 입력(input)은 4강에서 배우므로, 3강 문제는 값을 코드에 직접 대입하고 print 로 출력한다.

const l3ex1: Exercise = {
  id: "ex-1",
  number: 1,
  title: "자기소개 카드 만들기",
  prompt: `세 가지 정보를 변수에 담고, 각각 한 줄씩 출력하세요.

· 이름: 코드몽 (문자열 — 따옴표로 감쌈)
· 나이: 5 (숫자 — 따옴표 없이)
· 학생 여부: True (불린 — 첫 글자 대문자)

출력 순서는 이름 → 나이 → 학생 여부 입니다.`,
  note: `자료형 세 가지를 한 번에 쓰는 연습이에요. 문자열은 따옴표로 감싸고, 숫자는 따옴표 없이, 불린은 True / False 처럼 첫 글자를 대문자로 씁니다 (3강).`,
  conceptTags: ["3강 변수", "3강 자료형", "3강 print()"],
  example: { stdin: [], stdout: "코드몽\n5\nTrue" },
  starterCode: `# 이름을 name 에 담으세요 (문자열)
name = "코드몽"

# 나이를 age 에 담으세요 (숫자)


# 학생 여부를 is_student 에 담으세요 (불린)


# name, age, is_student 를 각각 한 줄씩 출력하세요
`,
  solutionCode: `name = "코드몽"
age = 5
is_student = True
print(name)
print(age)
print(is_student)
`,
  tests: [
    {
      label: "코드몽 / 5 / True",
      stdin: [],
      expect: [
        { kind: "text", contains: "코드몽" },
        { kind: "number", value: 5 },
        { kind: "text", contains: "True" },
      ],
    },
  ],
};

const l3ex2: Exercise = {
  id: "ex-2",
  number: 2,
  title: "변수에 새 값 넣기",
  prompt: `age 라는 변수에 먼저 5 를 넣었다가, 다시 6 을 넣은 뒤, age 를 출력하세요.

같은 변수에 새 값을 넣으면 이전 값은 사라집니다. 그래서 출력은 5 가 아니라 6 이 됩니다.`,
  note: `변수는 "값을 담는 상자"라서, 새 값을 넣으면 들어 있던 값이 밀려나고 마지막에 넣은 값만 남아요 (3강). 직접 출력해서 정말 6 이 나오는지 확인해 보세요.`,
  conceptTags: ["3강 변수", "3강 재할당"],
  example: { stdin: [], stdout: "6" },
  starterCode: `age = 5

# age 에 6 을 다시 넣으세요


# age 를 출력하세요
`,
  solutionCode: `age = 5
age = 6
print(age)
`,
  tests: [{ label: "마지막 값 6 출력", stdin: [], expect: [{ kind: "number", value: 6 }] }],
};

const pythonLesson3Exercises: ExerciseSet = {
  courseId: "be-python",
  lessonId: "lesson-3",
  lessonNumber: 3,
  title: "변수와 자료형",
  exercises: [l3ex1, l3ex2],
};

// ─── 4강 「입력과 연산자」 ────────────────────────────────────────────
// 누적 범위: 1~4강 (print / 변수·자료형 / input() / int() 형변환 / 산술·비교·논리 연산자).
// 조건문(5강)·반복문(6강) 없이 풀리는 "입력 → 계산 → 출력" 직선 코드만.

const l4ex1: Exercise = {
  id: "ex-1",
  number: 1,
  title: "입력 그대로 출력하기",
  prompt: `사용자가 입력한 한 줄을 그대로 다시 출력하세요.

input() 으로 받은 값은 "글자(문자열)"라서, 따로 바꾸지 않아도 그대로 출력할 수 있어요.`,
  conceptTags: ["4강 input()", "3강 print()"],
  example: { stdin: ["안녕하세요"], stdout: "안녕하세요" },
  starterCode: `# 한 줄을 입력받으세요


# 입력받은 값을 그대로 출력하세요
`,
  solutionCode: `s = input()
print(s)
`,
  tests: [
    { label: '"안녕하세요" 입력', stdin: ["안녕하세요"], expect: [{ kind: "text", contains: "안녕하세요" }] },
    { label: '"파이썬" 입력', stdin: ["파이썬"], expect: [{ kind: "text", contains: "파이썬" }] },
    { label: '"123" 입력 (숫자처럼 보여도 글자)', stdin: ["123"], expect: [{ kind: "text", contains: "123" }] },
  ],
};

const l4ex2: Exercise = {
  id: "ex-2",
  number: 2,
  title: "두 수의 합",
  prompt: `정수 두 개를 한 줄에 하나씩 입력받아, 두 수의 합을 출력하세요.

input() 이 돌려주는 값은 항상 "글자"입니다. 그대로 더하면 두 글자가 이어붙어요 (예: "3" + "5" → "35"). 진짜 숫자로 더하려면 int() 로 감싸야 합니다.

예) 3 과 5 를 입력하면 → 8 이 출력됩니다.`,
  conceptTags: ["4강 input()", "4강 int() 형변환", "4강 산술 연산자"],
  example: { stdin: ["3", "5"], stdout: "8" },
  starterCode: `# 첫 번째 수를 입력받아 int() 로 숫자로 바꾸세요
a = int(input())

# 두 번째 수도 같은 방식으로 받으세요


# 두 수의 합을 출력하세요
`,
  solutionCode: `a = int(input())
b = int(input())
print(a + b)
`,
  tests: [
    { label: "3, 5", stdin: ["3", "5"], expect: [{ kind: "number", value: 8 }] },
    { label: "10, 20", stdin: ["10", "20"], expect: [{ kind: "number", value: 30 }] },
    { label: "-4, 4", stdin: ["-4", "4"], expect: [{ kind: "number", value: 0 }] },
    { label: "100, 250", stdin: ["100", "250"], expect: [{ kind: "number", value: 350 }] },
  ],
};

const l4ex3: Exercise = {
  id: "ex-3",
  number: 3,
  title: "합·차·곱·몫 한 번에",
  prompt: `정수 두 개를 입력받아, 두 수의 합·차·곱·몫을 각 줄에 차례로 출력하세요.

첫 줄에 합(+), 둘째 줄에 차(-), 셋째 줄에 곱(*), 넷째 줄에 몫(//) 입니다.

예) 10 과 3 을 입력하면 → 13, 7, 30, 3 이 한 줄씩 출력됩니다.`,
  note: `나누기는 두 가지예요. / 는 실수까지 주고(10 / 3 → 3.33…), // 는 "몫"만 줍니다(10 // 3 → 3). 4강 영상에서 둘을 나란히 비교했죠. 이 문제는 몫 // 를 씁니다.`,
  conceptTags: ["4강 산술 연산자", "4강 int() 형변환"],
  example: { stdin: ["10", "3"], stdout: "13\n7\n30\n3" },
  starterCode: `a = int(input())
b = int(input())

# 합, 차, 곱, 몫(//) 을 각 줄에 출력하세요
`,
  solutionCode: `a = int(input())
b = int(input())
print(a + b)
print(a - b)
print(a * b)
print(a // b)
`,
  tests: [
    {
      label: "10, 3",
      stdin: ["10", "3"],
      expect: [
        { kind: "number", value: 13 },
        { kind: "number", value: 7 },
        { kind: "number", value: 30 },
        { kind: "number", value: 3 },
      ],
    },
    {
      label: "8, 2",
      stdin: ["8", "2"],
      expect: [
        { kind: "number", value: 10 },
        { kind: "number", value: 6 },
        { kind: "number", value: 16 },
        { kind: "number", value: 4 },
      ],
    },
    {
      label: "7, 5",
      stdin: ["7", "5"],
      expect: [
        { kind: "number", value: 12 },
        { kind: "number", value: 2 },
        { kind: "number", value: 35 },
        { kind: "number", value: 1 },
      ],
    },
  ],
};

export const pythonLesson4Exercises: ExerciseSet = {
  courseId: "be-python",
  lessonId: "lesson-4",
  lessonNumber: 4,
  title: "입력과 연산자",
  exercises: [l4ex1, l4ex2, l4ex3],
};

// ─── 5강 「조건문」 ───────────────────────────────────────────────────
// 누적 범위: 1~5강 (+ if / elif / else). and·or·not 없이 단일 비교로만.

const l5ex1: Exercise = {
  id: "ex-1",
  number: 1,
  title: "합격 판정",
  prompt: `점수를 입력받아, 60 점 이상이면 합격, 아니면 불합격 을 출력하세요.

if 로 조건을 적고, 아니면 else 로 보냅니다 (5강).

예) 75 → 합격 / 40 → 불합격`,
  conceptTags: ["5강 if/else", "4강 input/int", "4강 비교 연산"],
  example: { stdin: ["75"], stdout: "합격" },
  starterCode: `score = int(input())

# 60 이상이면 "합격", 아니면 "불합격" 을 출력하세요
`,
  solutionCode: `score = int(input())
if score >= 60:
    print("합격")
else:
    print("불합격")
`,
  tests: [
    { label: "75 → 합격", stdin: ["75"], expect: [{ kind: "text", contains: "합격" }] },
    { label: "40 → 불합격", stdin: ["40"], expect: [{ kind: "text", contains: "불합격" }] },
    { label: "60 → 합격 (경계값)", stdin: ["60"], expect: [{ kind: "text", contains: "합격" }] },
  ],
};

const l5ex2: Exercise = {
  id: "ex-2",
  number: 2,
  title: "짝수 홀수 판별",
  prompt: `정수를 입력받아, 짝수면 짝수, 홀수면 홀수 를 출력하세요.

예) 8 → 짝수 / 3 → 홀수`,
  note: `짝수인지 어떻게 알까요? 2로 나눈 "나머지"가 0이면 짝수예요. 나머지는 4강에서 배운 % 연산자로 구합니다. n % 2 가 0 이면 짝수, 아니면 홀수.`,
  conceptTags: ["5강 if/else", "4강 나머지 %"],
  example: { stdin: ["8"], stdout: "짝수" },
  starterCode: `n = int(input())

# n 을 2로 나눈 나머지(n % 2)가 0이면 "짝수", 아니면 "홀수"
`,
  solutionCode: `n = int(input())
if n % 2 == 0:
    print("짝수")
else:
    print("홀수")
`,
  tests: [
    { label: "8 → 짝수", stdin: ["8"], expect: [{ kind: "text", contains: "짝수" }] },
    { label: "3 → 홀수", stdin: ["3"], expect: [{ kind: "text", contains: "홀수" }] },
    { label: "0 → 짝수", stdin: ["0"], expect: [{ kind: "text", contains: "짝수" }] },
  ],
};

const l5ex3: Exercise = {
  id: "ex-3",
  number: 3,
  title: "점수 등급 매기기",
  prompt: `점수를 입력받아 등급을 출력하세요.

· 90 점 이상 → A
· 80 점 이상 → B
· 그 외 → C

세 갈래라서 if / elif / else 를 씁니다 (5강). 위에서부터 차례로 검사하고, 처음 맞는 갈래에서 멈춰요.

예) 95 → A / 85 → B / 70 → C`,
  conceptTags: ["5강 if/elif/else"],
  example: { stdin: ["95"], stdout: "A" },
  starterCode: `score = int(input())

# 90 이상 A, 80 이상 B, 그 외 C
`,
  solutionCode: `score = int(input())
if score >= 90:
    print("A")
elif score >= 80:
    print("B")
else:
    print("C")
`,
  tests: [
    { label: "95 → A", stdin: ["95"], expect: [{ kind: "text", contains: "A" }] },
    { label: "85 → B", stdin: ["85"], expect: [{ kind: "text", contains: "B" }] },
    { label: "70 → C", stdin: ["70"], expect: [{ kind: "text", contains: "C" }] },
    { label: "90 → A (경계값)", stdin: ["90"], expect: [{ kind: "text", contains: "A" }] },
  ],
};

const pythonLesson5Exercises: ExerciseSet = {
  courseId: "be-python",
  lessonId: "lesson-5",
  lessonNumber: 5,
  title: "조건문",
  exercises: [l5ex1, l5ex2, l5ex3],
};

// ─── 6강 「반복문」 ───────────────────────────────────────────────────
// 누적 범위: 1~6강 (+ for / range / while / break / continue). 리스트(7강) 없이 range 로만.

const l6ex1: Exercise = {
  id: "ex-1",
  number: 1,
  title: "1부터 N까지 출력",
  prompt: `정수 N 을 입력받아, 1 부터 N 까지의 수를 한 줄에 하나씩 출력하세요.

for 와 range 를 씁니다. range(1, N + 1) 은 1 부터 N 까지를 만들어요 (끝값은 포함되지 않으니 N + 1).

예) 5 → 1, 2, 3, 4, 5 가 한 줄씩`,
  note: `range(1, N + 1) 인 이유: range 는 끝값을 포함하지 않아요(6강). range(1, 6) 은 1,2,3,4,5 까지죠. 그래서 N 까지 출력하려면 끝값을 N + 1 로 적습니다.`,
  conceptTags: ["6강 for/range"],
  example: { stdin: ["5"], stdout: "1\n2\n3\n4\n5" },
  starterCode: `n = int(input())

# 1 부터 n 까지 한 줄에 하나씩 출력하세요
for i in range(1, n + 1):
    print(i)
`,
  solutionCode: `n = int(input())
for i in range(1, n + 1):
    print(i)
`,
  tests: [
    {
      label: "5 → 1~5",
      stdin: ["5"],
      expect: [
        { kind: "number", value: 1 },
        { kind: "number", value: 2 },
        { kind: "number", value: 3 },
        { kind: "number", value: 4 },
        { kind: "number", value: 5 },
      ],
    },
    {
      label: "3 → 1~3",
      stdin: ["3"],
      expect: [
        { kind: "number", value: 1 },
        { kind: "number", value: 2 },
        { kind: "number", value: 3 },
      ],
    },
    { label: "1 → 1", stdin: ["1"], expect: [{ kind: "number", value: 1 }] },
  ],
};

const l6ex2: Exercise = {
  id: "ex-2",
  number: 2,
  title: "1부터 N까지의 합",
  prompt: `정수 N 을 입력받아, 1 부터 N 까지 모두 더한 합을 출력하세요.

합을 담을 변수(total)를 0 으로 시작하고, 반복하면서 한 개씩 더해 나갑니다 (6강).

예) 10 → 55 (1+2+...+10)`,
  conceptTags: ["6강 for/range", "누적 변수"],
  example: { stdin: ["10"], stdout: "55" },
  starterCode: `n = int(input())

# 합을 담을 변수를 0 으로 시작하세요
total = 0

# 1 부터 n 까지 반복하면서 total 에 더하세요


# total 을 출력하세요
`,
  solutionCode: `n = int(input())
total = 0
for i in range(1, n + 1):
    total = total + i
print(total)
`,
  tests: [
    { label: "10 → 55", stdin: ["10"], expect: [{ kind: "number", value: 55 }] },
    { label: "100 → 5050", stdin: ["100"], expect: [{ kind: "number", value: 5050 }] },
    { label: "1 → 1", stdin: ["1"], expect: [{ kind: "number", value: 1 }] },
  ],
};

const l6ex3: Exercise = {
  id: "ex-3",
  number: 3,
  title: "구구단 한 단 출력",
  prompt: `정수 N 을 입력받아, N 단을 출력하세요. (N×1 부터 N×9 까지의 결과를 한 줄에 하나씩)

예) 2 → 2, 4, 6, 8, 10, 12, 14, 16, 18`,
  note: `반복(6강)과 곱셈(4강)을 합치는 문제예요. range(1, 10) 으로 1부터 9까지 돌면서, 매번 N * i 를 출력하면 한 단이 완성됩니다. (영상에서 구구단을 직접 다루진 않았지만, 배운 for·range·곱셈만으로 풀 수 있어요.)`,
  conceptTags: ["6강 for/range", "4강 곱셈"],
  example: { stdin: ["2"], stdout: "2\n4\n6\n8\n10\n12\n14\n16\n18" },
  starterCode: `n = int(input())

# 1 부터 9 까지 반복하면서 n * i 를 출력하세요
`,
  solutionCode: `n = int(input())
for i in range(1, 10):
    print(n * i)
`,
  tests: [
    {
      label: "2단",
      stdin: ["2"],
      expect: [
        { kind: "number", value: 2 },
        { kind: "number", value: 4 },
        { kind: "number", value: 6 },
        { kind: "number", value: 8 },
        { kind: "number", value: 10 },
        { kind: "number", value: 12 },
        { kind: "number", value: 14 },
        { kind: "number", value: 16 },
        { kind: "number", value: 18 },
      ],
    },
    {
      label: "7단",
      stdin: ["7"],
      expect: [
        { kind: "number", value: 7 },
        { kind: "number", value: 14 },
        { kind: "number", value: 21 },
        { kind: "number", value: 28 },
        { kind: "number", value: 35 },
        { kind: "number", value: 42 },
        { kind: "number", value: 49 },
        { kind: "number", value: 56 },
        { kind: "number", value: 63 },
      ],
    },
  ],
};

const pythonLesson6Exercises: ExerciseSet = {
  courseId: "be-python",
  lessonId: "lesson-6",
  lessonNumber: 6,
  title: "반복문",
  exercises: [l6ex1, l6ex2, l6ex3],
};

// ─── 7강 「리스트」 ───────────────────────────────────────────────────
// 누적 범위: 1~7강 (+ 리스트 생성·인덱싱·append·del·list[i]=x·for 순회·len).
// 영상 충실하게 "고정 리스트"로 — 빈 리스트 누적/슬라이싱/sort/max/in 은 영상 밖이라 배제.

const l7ex1: Exercise = {
  id: "ex-1",
  number: 1,
  title: "리스트 만들고 꺼내기",
  prompt: `값 10, 20, 30 을 담은 리스트 nums 를 만들고, 0번 자리와 2번 자리의 값을 각 줄에 출력하세요.

리스트의 자리 번호(인덱스)는 0 부터 시작합니다. 그래서 nums[0] 은 첫 번째 값, nums[2] 는 세 번째 값이에요 (7강).

출력: 10 (0번), 30 (2번)`,
  conceptTags: ["7강 리스트", "7강 인덱싱"],
  example: { stdin: [], stdout: "10\n30" },
  starterCode: `# 10, 20, 30 을 담은 리스트 nums 를 만드세요
nums = [10, 20, 30]

# 0번 자리와 2번 자리 값을 각 줄에 출력하세요
`,
  solutionCode: `nums = [10, 20, 30]
print(nums[0])
print(nums[2])
`,
  tests: [
    {
      label: "nums[0], nums[2]",
      stdin: [],
      expect: [
        { kind: "number", value: 10 },
        { kind: "number", value: 30 },
      ],
    },
  ],
};

const l7ex2: Exercise = {
  id: "ex-2",
  number: 2,
  title: "추가·수정·삭제",
  prompt: `리스트 scores = [88, 92, 76] 에 다음 세 동작을 차례로 적용한 뒤, scores 를 출력하세요.

1) 끝에 100 을 추가 (append)
2) 0번 자리 값을 95 로 바꾸기 (scores[0] = 95)
3) 1번 자리를 통째로 삭제 (del scores[1])

결과: [95, 76, 100]`,
  note: `세 동작이 리스트의 길이와 자리를 어떻게 바꾸는지 따라가 보세요 (7강). append 는 끝에 한 칸 늘리고, scores[0] = 95 는 그 자리 값만 바꾸며(길이 그대로), del 은 한 칸을 빼서 뒤 값들을 한 칸씩 앞으로 당깁니다.`,
  conceptTags: ["7강 append/del", "7강 수정"],
  example: { stdin: [], stdout: "[95, 76, 100]" },
  starterCode: `scores = [88, 92, 76]

# 1) 끝에 100 추가


# 2) 0번 자리를 95 로 변경


# 3) 1번 자리 삭제


# scores 를 출력
`,
  solutionCode: `scores = [88, 92, 76]
scores.append(100)
scores[0] = 95
del scores[1]
print(scores)
`,
  tests: [
    {
      label: "[95, 76, 100]",
      stdin: [],
      expect: [
        { kind: "number", value: 95 },
        { kind: "number", value: 76 },
        { kind: "number", value: 100 },
      ],
    },
  ],
};

const l7ex3: Exercise = {
  id: "ex-3",
  number: 3,
  title: "리스트 값 하나씩 출력",
  prompt: `리스트 nums = [10, 20, 30] 의 값들을 반복문으로 하나씩 출력하세요.

for 변수 in 리스트: 형태를 쓰면, 변수에 리스트의 값이 하나씩 차례로 들어옵니다 (7강).

출력: 10, 20, 30 (한 줄씩)`,
  note: `6강의 for i in range(...) 는 "자리 번호"가 나왔지만, for x in 리스트 는 "값 자체"가 하나씩 나와요. range 를 거치지 않고 리스트를 바로 따라갑니다.`,
  conceptTags: ["7강 for 순회"],
  example: { stdin: [], stdout: "10\n20\n30" },
  starterCode: `nums = [10, 20, 30]

# nums 의 값을 하나씩 출력하세요
`,
  solutionCode: `nums = [10, 20, 30]
for x in nums:
    print(x)
`,
  tests: [
    {
      label: "10, 20, 30",
      stdin: [],
      expect: [
        { kind: "number", value: 10 },
        { kind: "number", value: 20 },
        { kind: "number", value: 30 },
      ],
    },
  ],
};

const pythonLesson7Exercises: ExerciseSet = {
  courseId: "be-python",
  lessonId: "lesson-7",
  lessonNumber: 7,
  title: "리스트",
  exercises: [l7ex1, l7ex2, l7ex3],
};

// ─── 8강 「딕셔너리 & 자료구조」 ──────────────────────────────────────
// 누적 범위: 1~8강 (+ dict 생성·조회·추가 / set 중복 제거·in / 7강 len).
// set 의 print 순서는 비결정적이라 채점에서 배제 — len·in 으로만.

const l8ex1: Exercise = {
  id: "ex-1",
  number: 1,
  title: "딕셔너리에서 값 찾기",
  prompt: `딕셔너리 scores = {"수학": 95, "영어": 80} 를 만들고, "수학" 의 점수를 출력하세요.

딕셔너리는 번호가 아니라 "이름표(키)"로 값을 찾습니다. scores["수학"] 은 95 예요 (8강).`,
  conceptTags: ["8강 딕셔너리"],
  example: { stdin: [], stdout: "95" },
  starterCode: `scores = {"수학": 95, "영어": 80}

# "수학" 의 점수를 출력하세요
`,
  solutionCode: `scores = {"수학": 95, "영어": 80}
print(scores["수학"])
`,
  tests: [{ label: '수학 → 95', stdin: [], expect: [{ kind: "number", value: 95 }] }],
};

const l8ex2: Exercise = {
  id: "ex-2",
  number: 2,
  title: "딕셔너리에 항목 추가",
  prompt: `딕셔너리 scores = {"수학": 95, "영어": 80} 에 "과학": 70 을 새로 추가하고, "과학" 의 점수를 출력하세요.

새 항목 추가는 한 줄이에요: scores["과학"] = 70 (8강).`,
  conceptTags: ["8강 딕셔너리 추가"],
  example: { stdin: [], stdout: "70" },
  starterCode: `scores = {"수학": 95, "영어": 80}

# "과학" 키에 70 을 추가하세요


# "과학" 의 점수를 출력하세요
`,
  solutionCode: `scores = {"수학": 95, "영어": 80}
scores["과학"] = 70
print(scores["과학"])
`,
  tests: [{ label: '과학 → 70', stdin: [], expect: [{ kind: "number", value: 70 }] }],
};

const l8ex3: Exercise = {
  id: "ex-3",
  number: 3,
  title: "셋으로 중복 제거",
  prompt: `과목 = {"수학", "영어", "수학"} 처럼 같은 값이 들어간 셋(set)을 만들고, 두 가지를 출력하세요.

1) 셋 안에 값이 몇 개 남았는지 (len)
2) "수학" 이 셋 안에 있는지 (in)

셋은 중복을 자동으로 없애므로, 출력은 2 와 True 입니다.`,
  note: `셋은 같은 값을 두 번 넣어도 하나만 남겨요(8강). 개수는 len( ) 으로 세고(7강), 어떤 값이 들어 있는지는 "수학" in 과목 으로 묻습니다 — 결과는 True / False. (셋은 순서가 없어서 번호로 꺼내거나 통째로 출력하면 매번 순서가 달라요. 그래서 개수와 포함 여부로 확인합니다.)`,
  conceptTags: ["8강 셋", "8강 in", "7강 len"],
  example: { stdin: [], stdout: "2\nTrue" },
  starterCode: `과목 = {"수학", "영어", "수학"}

# 1) 과목 안에 값이 몇 개인지 출력 (len)


# 2) "수학" 이 과목 안에 있는지 출력 (in)
`,
  solutionCode: `과목 = {"수학", "영어", "수학"}
print(len(과목))
print("수학" in 과목)
`,
  tests: [
    {
      label: "len 2, 수학 in True",
      stdin: [],
      expect: [
        { kind: "number", value: 2 },
        { kind: "text", contains: "True" },
      ],
    },
  ],
};

const pythonLesson8Exercises: ExerciseSet = {
  courseId: "be-python",
  lessonId: "lesson-8",
  lessonNumber: 8,
  title: "딕셔너리 & 자료구조",
  exercises: [l8ex1, l8ex2, l8ex3],
};

// ─── 9강 「함수」 ─────────────────────────────────────────────────────
// 누적 범위: 1~9강 (+ def / 매개변수 / return). *args·lambda·기본인자 없이 단순 함수만.

const l9ex1: Exercise = {
  id: "ex-1",
  number: 1,
  title: "인사 함수",
  prompt: `이름을 받아 "안녕, 이름" 을 출력하는 함수 greet 를 만들고, 입력받은 이름으로 호출하세요.

def greet(name): 으로 정의하고, 함수 안에서 print 로 인사를 출력합니다 (9강).

예) 코드몽 입력 → 안녕, 코드몽`,
  note: `함수는 def 로 "적어두기"만 해서는 실행되지 않아요. 마지막에 greet(input()) 처럼 이름에 괄호를 붙여 "불러야" 비로소 실행됩니다 (9강).`,
  conceptTags: ["9강 def", "9강 매개변수"],
  example: { stdin: ["코드몽"], stdout: "안녕, 코드몽" },
  starterCode: `# 이름을 받아 "안녕, 이름" 을 출력하는 함수 greet 를 정의하세요
def greet(name):
    print("안녕,", name)

# 입력받은 이름으로 greet 를 호출하세요
`,
  solutionCode: `def greet(name):
    print("안녕,", name)

greet(input())
`,
  tests: [
    { label: "코드몽", stdin: ["코드몽"], expect: [{ kind: "text", contains: "안녕, 코드몽" }] },
    { label: "지윤", stdin: ["지윤"], expect: [{ kind: "text", contains: "안녕, 지윤" }] },
  ],
};

const l9ex2: Exercise = {
  id: "ex-2",
  number: 2,
  title: "더하기 함수 (return)",
  prompt: `두 수를 받아 그 합을 돌려주는(return) 함수 add 를 만드세요. 두 정수를 입력받아 add 로 합을 구해 출력하세요.

return 은 print 와 달라요. return 으로 돌려준 값은 변수에 담거나 print 로 출력할 수 있습니다 (9강).

예) 3, 5 입력 → 8`,
  note: `print 는 "화면에 보여주기", return 은 "값을 돌려주기"예요. add 안에서 return a + b 로 돌려주면, 바깥에서 print(add(x, y)) 처럼 그 값을 다시 쓸 수 있습니다.`,
  conceptTags: ["9강 def/return", "4강 input/int"],
  example: { stdin: ["3", "5"], stdout: "8" },
  starterCode: `# 두 수를 받아 합을 돌려주는 함수 add 를 정의하세요
def add(a, b):
    return a + b

# 두 정수를 입력받아 add 로 합을 구해 출력하세요
`,
  solutionCode: `def add(a, b):
    return a + b

x = int(input())
y = int(input())
print(add(x, y))
`,
  tests: [
    { label: "3, 5 → 8", stdin: ["3", "5"], expect: [{ kind: "number", value: 8 }] },
    { label: "10, 20 → 30", stdin: ["10", "20"], expect: [{ kind: "number", value: 30 }] },
  ],
};

const l9ex3: Exercise = {
  id: "ex-3",
  number: 3,
  title: "더 큰 값 돌려주기",
  prompt: `두 수를 받아 더 큰 값을 돌려주는 함수 bigger 를 만드세요. 두 정수를 입력받아 더 큰 값을 출력하세요.

예) 3, 7 → 7 / 10, 2 → 10 / 5, 5 → 5`,
  note: `함수 안에서 조건문(5강)과 return(9강)을 함께 써요. if a > b: return a / else: return b — 큰 쪽을 돌려주면 됩니다. (max 같은 함수는 아직 안 배웠으니, if 로 직접 비교해 보세요.)`,
  conceptTags: ["9강 return", "5강 if/else"],
  example: { stdin: ["3", "7"], stdout: "7" },
  starterCode: `# 두 수 중 더 큰 값을 돌려주는 함수 bigger 를 정의하세요
def bigger(a, b):
    if a > b:
        return a
    else:
        return b

# 두 정수를 입력받아 더 큰 값을 출력하세요
`,
  solutionCode: `def bigger(a, b):
    if a > b:
        return a
    else:
        return b

x = int(input())
y = int(input())
print(bigger(x, y))
`,
  tests: [
    { label: "3, 7 → 7", stdin: ["3", "7"], expect: [{ kind: "number", value: 7 }] },
    { label: "10, 2 → 10", stdin: ["10", "2"], expect: [{ kind: "number", value: 10 }] },
    { label: "5, 5 → 5 (같을 때)", stdin: ["5", "5"], expect: [{ kind: "number", value: 5 }] },
  ],
};

const pythonLesson9Exercises: ExerciseSet = {
  courseId: "be-python",
  lessonId: "lesson-9",
  lessonNumber: 9,
  title: "함수",
  exercises: [l9ex1, l9ex2, l9ex3],
};

// ─── 10강 「모듈 & 랜덤」 ─────────────────────────────────────────────
// 누적 범위: 1~10강 (+ import / random.randint / random.choice).
// 채점은 seed 고정(grader 가 주입)으로 결정적. 실행("직접 돌려보기")은 seed 없이 진짜 무작위.
// seed 별 정답값은 실제 Python 3.12 로 확인: seed(42)→randint(1,6)=6, seed(5)→choice(가위/바위/보)=보.

const l10ex1: Exercise = {
  id: "ex-1",
  number: 1,
  title: "주사위 굴리기",
  prompt: `주사위를 한 번 굴린 것처럼, 1 부터 6 사이의 정수 하나를 무작위로 뽑아 출력하세요.

random 모듈을 가져와(import), random.randint(1, 6) 으로 뽑습니다 (10강). randint 는 끝값 6도 포함해요.`,
  note: `[실행] 을 누르면 매번 다른 숫자가 나와요 — 그게 무작위(random)죠. 하지만 [제출하고 채점] 은 공정하게 정해진 방식으로 확인하니, random.randint(1, 6) 만 바르게 쓰면 결과 숫자와 상관없이 통과합니다. (randint(1, 5) 나 randint(0, 6) 처럼 범위를 다르게 쓰면 통과하지 않아요.)`,
  conceptTags: ["10강 import", "10강 random.randint"],
  seed: 42,
  starterCode: `# random 모듈을 가져오세요
import random

# 1 부터 6 사이 정수를 무작위로 뽑아 출력하세요
`,
  solutionCode: `import random
print(random.randint(1, 6))
`,
  tests: [{ label: "1~6 정수 (채점은 고정 시드)", stdin: [], expect: [{ kind: "number", value: 6 }] }],
};

const l10ex2: Exercise = {
  id: "ex-2",
  number: 2,
  title: "가위바위보 뽑기",
  prompt: `"가위", "바위", "보" 중 하나를 무작위로 뽑아 출력하세요.

목록(리스트) 중에서 하나를 고를 땐 random.choice 를 씁니다 (10강).

random.choice(["가위", "바위", "보"]) 처럼요.`,
  note: `randint 는 "범위 안의 숫자", choice 는 "목록에서 하나"를 뽑아요(10강). [실행] 은 매번 다른 걸 뽑지만, [제출] 채점은 고정된 방식으로 확인하니 random.choice 에 ["가위", "바위", "보"] 세 개를 그대로 넣으면 통과합니다.`,
  conceptTags: ["10강 import", "10강 random.choice"],
  seed: 5,
  starterCode: `import random

# "가위", "바위", "보" 중 하나를 무작위로 뽑아 출력하세요
`,
  solutionCode: `import random
print(random.choice(["가위", "바위", "보"]))
`,
  tests: [{ label: "가위/바위/보 중 하나 (채점은 고정 시드)", stdin: [], expect: [{ kind: "text", contains: "보" }] }],
};

const pythonLesson10Exercises: ExerciseSet = {
  courseId: "be-python",
  lessonId: "lesson-10",
  lessonNumber: 10,
  title: "모듈 & 랜덤",
  exercises: [l10ex1, l10ex2],
};

// ─── 11강 「파일 입출력」 ─────────────────────────────────────────────
// 누적 범위: 1~11강 (+ with open / write / read). 한 코드 안에서 저장→읽기 (Pyodide 가상 FS).

const l11ex1: Exercise = {
  id: "ex-1",
  number: 1,
  title: "메모 저장하고 다시 읽기",
  prompt: `메모 한 줄을 입력받아 "memo.txt" 파일에 저장하고, 그 파일을 다시 열어 내용을 읽어 출력하세요.

저장은 쓰기 모드("w") 로 열어 write, 읽기는 읽기 모드("r") 로 열어 read 합니다 (11강).

예) "오늘 할 일: 청소" 입력 → 그대로 다시 출력`,
  note: `파일은 프로그램이 끝나도 남는 저장 공간이에요(11강). 여기서는 저장한 직후, 같은 파일을 다시 열어 읽어옵니다. with open(...) as f: 로 열면 블록이 끝날 때 파일이 자동으로 닫혀요. 쓰기 "w" 와 읽기 "r" 은 모드 한 글자만 다릅니다.`,
  conceptTags: ["11강 with open", "11강 write/read"],
  example: { stdin: ["오늘 할 일: 청소"], stdout: "오늘 할 일: 청소" },
  starterCode: `# 메모를 한 줄 입력받으세요
memo = input()

# memo 를 "memo.txt" 에 저장하세요 (쓰기 모드 "w")
with open("memo.txt", "w") as f:
    f.write(memo)

# "memo.txt" 를 다시 열어(읽기 모드 "r") 내용을 읽고 출력하세요
`,
  solutionCode: `memo = input()
with open("memo.txt", "w") as f:
    f.write(memo)
with open("memo.txt", "r") as f:
    print(f.read())
`,
  tests: [
    { label: "오늘 할 일: 청소", stdin: ["오늘 할 일: 청소"], expect: [{ kind: "text", contains: "오늘 할 일: 청소" }] },
    { label: "파이썬 공부", stdin: ["파이썬 공부"], expect: [{ kind: "text", contains: "파이썬 공부" }] },
  ],
};

const pythonLesson11Exercises: ExerciseSet = {
  courseId: "be-python",
  lessonId: "lesson-11",
  lessonNumber: 11,
  title: "파일 입출력",
  exercises: [l11ex1],
};

// ─── 12강 「디버깅 & AI 활용」 ────────────────────────────────────────
// "구현"이 아니라 "버그 수정" 포맷 — starterCode 가 버그 있는 코드, 학습자가 고쳐 통과시킨다.
// 12강 영상의 핵심: 문법오류(에러로 잡힘) / 논리오류(에러 없이 틀림) 를 읽고 고치기.

const l12ex1: Exercise = {
  id: "ex-1",
  number: 1,
  title: "버그 고치기 ① — 합이 이상해요",
  prompt: `아래 코드는 두 수를 입력받아 합을 구하려 합니다. 그런데 3 과 5 를 넣으면 8 이 아니라 35 가 나와요. 빨간 에러는 없는데 결과가 틀린, 전형적인 "논리오류"입니다.

버그를 찾아 고친 뒤 제출하세요. (목표: 3, 5 → 8)`,
  note: `input() 이 돌려주는 값은 항상 "글자"예요(4강). 글자끼리 + 하면 두 글자가 이어붙어서 "3" + "5" → "35" 가 됩니다. 진짜 숫자로 더하려면 int() 로 감싸야 해요. 어디에 int() 를 넣어야 할지 찾아보세요.`,
  conceptTags: ["12강 디버깅", "12강 논리오류", "4강 형변환"],
  example: { stdin: ["3", "5"], stdout: "8" },
  starterCode: `a = input()
b = input()
print(a + b)
`,
  solutionCode: `a = int(input())
b = int(input())
print(a + b)
`,
  tests: [
    { label: "3, 5 → 8", stdin: ["3", "5"], expect: [{ kind: "number", value: 8 }] },
    { label: "10, 20 → 30", stdin: ["10", "20"], expect: [{ kind: "number", value: 30 }] },
  ],
};

const l12ex2: Exercise = {
  id: "ex-2",
  number: 2,
  title: "버그 고치기 ② — 빨간 에러가 나요",
  prompt: `아래 코드를 실행하면 빨간 에러(NameError) 가 납니다. 에러 메시지의 마지막 줄부터 읽어 원인을 찾아 고치세요.

이렇게 에러로 잡히는 실수를 "문법오류" 라고 불러요. 점수 90 이 그대로 출력되게 만들면 됩니다. (목표: 90 출력)`,
  note: `에러 메시지는 아래에서 위로 읽는 게 핵심이에요(12강). 마지막 줄에 "name 'scroe' is not defined" 처럼 어떤 이름이 정의된 적 없다고 나오죠. 변수를 만들 때 쓴 이름(score)과 꺼낼 때 쓴 이름(scroe)이 다른, 흔한 오타예요.`,
  conceptTags: ["12강 디버깅", "12강 문법오류", "3강 변수"],
  example: { stdin: [], stdout: "90" },
  starterCode: `score = 90
print(scroe)
`,
  solutionCode: `score = 90
print(score)
`,
  tests: [{ label: "90 출력", stdin: [], expect: [{ kind: "number", value: 90 }] }],
};

const pythonLesson12Exercises: ExerciseSet = {
  courseId: "be-python",
  lessonId: "lesson-12",
  lessonNumber: 12,
  title: "디버깅 & AI 활용",
  exercises: [l12ex1, l12ex2],
};

/**
 * "<courseId>/<lessonId>" → ExerciseSet 룩업.
 * 홈 카드 ID(python)와 detail fallback ID(be-python)를 모두 매칭 (lesson-plan 컨벤션과 동일).
 * 2강(코딩의 표현 방법)은 코드 작성이 없어 연습 문제가 없다 — 매칭에서 자연히 빠짐.
 */
const SETS: ExerciseSet[] = [
  pythonLesson1Exercises,
  pythonLesson3Exercises,
  pythonLesson4Exercises,
  pythonLesson5Exercises,
  pythonLesson6Exercises,
  pythonLesson7Exercises,
  pythonLesson8Exercises,
  pythonLesson9Exercises,
  pythonLesson10Exercises,
  pythonLesson11Exercises,
  pythonLesson12Exercises,
];

export const exercisesByRef: Record<string, ExerciseSet> = Object.fromEntries(
  SETS.flatMap((set) => [
    [`be-python/${set.lessonId}`, set],
    [`python/${set.lessonId}`, set],
  ]),
);

export function getExercises(courseId: string, lessonId: string): ExerciseSet | undefined {
  return exercisesByRef[`${courseId}/${lessonId}`];
}
