// 강별 코드 연습 문제 트랙 — 13강 프로젝트(project-content.ts)와 별개인 경량 단일 문제 세트.
// 영상 1~12강을 보고 "그 강까지 배운 문법만"으로 푸는 코딩테스트식 미니 문제다.
//   · 강당 0~3문제. N강 문제는 1~N강 누적 범위만 사용 (미래 강 문법 배제).
//   · 영상에 안 나온 응용 포인트는 note(항상 보이는 설명글)로 보충 — 펼치는 힌트 사다리 아님.
//   · 채점은 13강과 동일한 stdin→stdout 엔진(lib/project/grader.ts) 재사용.
//     random 을 쓰는 강은 grader 가 seed 를 주입해 결과를 결정적으로 만든다(학습자 코드엔 seed 없음).
//
// 채점 규약(13강과 동일): expect 를 "순차 소비". 숫자는 허용오차 비교, 텍스트는 부분일치.
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
  /** random 등 비결정 코드를 결정적으로 만들기 위해 grader 가 주입할 시드. 없으면 주입 안 함 */
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

// ─── 4강 「입력과 연산자」 연습 ──────────────────────────────────────
// 누적 범위: 1~4강 (print / 변수·자료형 / input() / int() 형변환 / 산술·비교·논리 연산자).
// 조건문(5강)·반복문(6강) 없이 풀리는 "입력 → 계산 → 출력" 직선 코드만.

const ex1: Exercise = {
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

const ex2: Exercise = {
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

const ex3: Exercise = {
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
  exercises: [ex1, ex2, ex3],
};

/**
 * "<courseId>/<lessonId>" → ExerciseSet 룩업.
 * 홈 카드 ID(python)와 detail fallback ID(be-python)를 모두 매칭 (lesson-plan 컨벤션과 동일).
 */
export const exercisesByRef: Record<string, ExerciseSet> = {
  "be-python/lesson-4": pythonLesson4Exercises,
  "python/lesson-4": pythonLesson4Exercises,
};

export function getExercises(courseId: string, lessonId: string): ExerciseSet | undefined {
  return exercisesByRef[`${courseId}/${lessonId}`];
}
