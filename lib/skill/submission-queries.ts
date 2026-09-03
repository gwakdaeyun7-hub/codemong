// 실력향상(시험) 트랙 조회 — Server Component 용.
// exercise-queries.ts 패턴 답습: 비로그인이면 빈 결과, 현재 존재하는 문제 id 에 한해 카운트.

import { cache } from "react";

import { prisma } from "@/lib/prisma";
import { listProblemSets } from "@/lib/problems";
import type { Prisma } from "@/lib/generated/prisma/client";

/** 제출 히스토리 한 건 — 화면 표시용 서브셋 (히든 케이스 상세는 담지 않는다) */
export type SubmissionItem = {
  id: string;
  passed: boolean;
  hadError: boolean;
  errorType: string | null;
  casesPassed: number;
  casesTotal: number;
  code: string;
  aiStatus: string;
  conceptScore: number | null;
  efficiencyScore: number | null;
  interpretationScore: number | null;
  aiFeedback: string | null;
  createdAt: Date;
};

/** 문제 페이지 "내 제출" — 최신순 (기본 20건) */
export async function listMySubmissions(
  lessonRef: string,
  problemId: string,
  userId: string | undefined,
  limit = 20,
): Promise<SubmissionItem[]> {
  if (!userId) return [];
  const rows = await prisma.problemSubmission.findMany({
    where: { userId, lessonRef, problemId },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id: true,
      passed: true,
      hadError: true,
      errorType: true,
      casesPassed: true,
      casesTotal: true,
      code: true,
      aiStatus: true,
      conceptScore: true,
      efficiencyScore: true,
      interpretationScore: true,
      aiFeedback: true,
      createdAt: true,
    },
  });
  return rows;
}

/** 단원별 해결 현황 — lessonId → { solved(해결한 문제 수), total } + 문제별 해결 맵 */
export type CourseSolveStatuses = {
  byLesson: Record<string, { solved: number; total: number }>;
  /** `${lessonId}/${problemId}` → 해결 여부 */
  solvedProblems: Record<string, boolean>;
};

// cache() = 같은 요청 안에서 중복 호출 1회로 합침 (실력향상 화면이 직접 쓰고
// getLearningStats 도 해결 문제 수를 같은 함수로 센다).
export const getCourseSolveStatuses = cache(async function getCourseSolveStatuses(
  courseId: string,
  userId: string | undefined,
): Promise<CourseSolveStatuses> {
  const sets = listProblemSets(courseId);
  const byLesson: Record<string, { solved: number; total: number }> = {};
  for (const set of sets) {
    byLesson[set.lessonId] = { solved: 0, total: set.problems.length };
  }
  if (!userId || sets.length === 0) return { byLesson, solvedProblems: {} };

  // 통과 제출이 한 번이라도 있는 (lessonRef, problemId) 조합만 뽑는다.
  const refs = sets.map((s) => `${s.courseId}/${s.lessonId}`);
  const rows: Array<{ lessonRef: string; problemId: string }> =
    await prisma.problemSubmission.findMany({
      where: { userId, passed: true, lessonRef: { in: refs } },
      select: { lessonRef: true, problemId: true },
      distinct: ["lessonRef", "problemId"] as Prisma.ProblemSubmissionScalarFieldEnum[],
    });

  const solvedProblems: Record<string, boolean> = {};
  for (const row of rows) {
    const lessonId = row.lessonRef.split("/")[1];
    const set = sets.find((s) => s.lessonId === lessonId);
    // 현재 존재하는 문제만 카운트 (삭제된 문제 잔재 방어 — exercise-queries 규약).
    if (!set || !set.problems.some((p) => p.id === row.problemId)) continue;
    const key = `${lessonId}/${row.problemId}`;
    if (solvedProblems[key]) continue;
    solvedProblems[key] = true;
    byLesson[lessonId].solved += 1;
  }
  return { byLesson, solvedProblems };
});
