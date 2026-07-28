// 실력향상(시험) 트랙 문제 은행 룩업.
// 강별 연습(lib/exercise-content.ts)과 동일한 규약 — 룩업은 python / be-python 둘 다 매칭.
// 문제 세트가 있는 강만 /skill 에 노출된다 (현재 4~9강. 억지 문제 금지 원칙으로 1·3·10·11·12강은 제외).

import { lesson4Problems } from "./lesson-4";
import { lesson5Problems } from "./lesson-5";
import { lesson6Problems } from "./lesson-6";
import { lesson7Problems } from "./lesson-7";
import { lesson8Problems } from "./lesson-8";
import { lesson9Problems } from "./lesson-9";
import type { ClientProblem, Problem, ProblemSet } from "./types";

export type { ClientProblem, Problem, ProblemSet, ProblemDifficulty } from "./types";

// 단원 순서대로 (대시보드 카드 순서).
const SETS: ProblemSet[] = [
  lesson4Problems,
  lesson5Problems,
  lesson6Problems,
  lesson7Problems,
  lesson8Problems,
  lesson9Problems,
];

// 홈 카드 ID("python")와 데이터 정식 ID("be-python")가 분리돼 있어 둘 다 매칭 (기존 룩업 규약).
function matchesCourse(courseId: string): boolean {
  return courseId === "python" || courseId === "be-python";
}

/** 코스의 문제 세트 목록 (단원 순). courseId 미매칭이면 빈 배열 */
export function listProblemSets(courseId: string): ProblemSet[] {
  return matchesCourse(courseId) ? SETS : [];
}

export function getProblemSet(courseId: string, lessonId: string): ProblemSet | undefined {
  if (!matchesCourse(courseId)) return undefined;
  return SETS.find((s) => s.lessonId === lessonId);
}

export function getProblem(
  courseId: string,
  lessonId: string,
  problemId: string,
): Problem | undefined {
  return getProblemSet(courseId, lessonId)?.problems.find((p) => p.id === problemId);
}

/** 클라이언트 러너에 넘기는 안전 서브셋 — solutionCode 를 뺀다 */
export function toClientProblem(problem: Problem): ClientProblem {
  const { solutionCode: _solutionCode, ...client } = problem;
  return client;
}
