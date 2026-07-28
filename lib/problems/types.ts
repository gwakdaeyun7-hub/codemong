// 실력향상(시험) 트랙 문제 은행 타입.
// 강별 연습(lib/exercise-content.ts, 이수율용)과는 별개 트랙 — 백준/프로그래머스 스타일로
// 전체 코드를 작성해 제출하는 문제. 채점 규약(TestCase/ExpectedOutput)은 13강 프로젝트와 공유한다.
//
// 공개/히든 분리:
//  · publicTests — 입출력 예시와 같은 케이스. 「코드 실행」 버튼이 이것만 돌리고,
//    실패 시 입력/내 출력/기대 출력을 보여준다.
//  · hiddenTests — 「제출 후 채점하기」에서만 돌며, UI 에는 "히든 N" 라벨과 통과/실패만 보인다.
//    채점이 클라이언트(Pyodide)라 번들에는 포함된다 — UI 미노출이 방어의 전부
//    (기존 "서버 재검증 안 함" 정책과 일관. 신뢰가 필요해지면 서버 채점을 얹는다).

import type { ProjectExample, TestCase } from "@/lib/project-content";

export type ProblemDifficulty = "easy" | "medium" | "hard";

export type Problem = {
  /** 단원 내 고유 id ("prob-1"...) */
  id: string;
  /** 1-based 문제 번호 (UI 표시) */
  number: number;
  title: string;
  difficulty: ProblemDifficulty;
  /** 문제 지문 — 배경 + [입력] + [출력]. 빈 줄로 단락 구분, 평문(줄표·불릿 없음) */
  prompt: string;
  /** "4강 input()" 같은 강별 문법 태그 — UI 칩 + AI 루브릭 입력 */
  conceptTags: string[];
  /** 공개 입출력 예시 (publicTests 와 1:1 대응) */
  examples: ProjectExample[];
  /** 시작 코드 — 안내 주석 1줄로 통일 (9강 함수 문제만 def 뼈대 예외) */
  starterCode: string;
  /** 모범답안 — 클라이언트에 절대 전송하지 않는다 (ClientProblem 에서 제외) */
  solutionCode: string;
  /** random 채점 고정용 시드 (10강 규약 — 현재 4~9강 문제엔 없음) */
  seed?: number;
  publicTests: TestCase[];
  hiddenTests: TestCase[];
  /** 이 문제 전용 AI 채점 보조 (개념 축 감점 기준 등) — C단계 Gemini 프롬프트에 들어간다 */
  rubricNote?: string;
};

export type ProblemSet = {
  /** 데이터 정식 courseId ("be-python") — lessonRef 는 이 값으로 만든다 */
  courseId: string;
  lessonId: string;
  lessonNumber: number;
  /** 단원 제목 */
  title: string;
  problems: Problem[];
};

/** 클라이언트 러너에 넘기는 안전 서브셋 — solutionCode 제거 */
export type ClientProblem = Omit<Problem, "solutionCode">;
