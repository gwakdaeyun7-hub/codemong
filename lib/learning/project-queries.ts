import { prisma } from "@/lib/prisma";

// 프로젝트형 강의(13강~) 진도 조회 (Server Component 용).
//  · getProjectProgress — 스텝별 통과 여부 + 마지막 작성 코드(이어하기) + 완료 여부.
// 코스 단위 진도(목록/홈/마이페이지)는 lib/learning/progress-queries.ts 가
// LessonProgress 와 함께 집계한다.

export type ProjectProgressState = {
  stepStatuses: Record<string, boolean>;
  submittedCode: Record<string, string>;
  completed: boolean;
};

export async function getProjectProgress(
  lessonRef: string,
  userId: string | null,
): Promise<ProjectProgressState> {
  if (!userId) return { stepStatuses: {}, submittedCode: {}, completed: false };

  const row = await prisma.projectProgress.findUnique({
    where: { lessonRef_userId: { lessonRef, userId } },
  });
  if (!row) return { stepStatuses: {}, submittedCode: {}, completed: false };

  const stepStatuses =
    row.stepStatuses && typeof row.stepStatuses === "object" && !Array.isArray(row.stepStatuses)
      ? (row.stepStatuses as unknown as Record<string, boolean>)
      : {};
  const submittedCode =
    row.submittedCode && typeof row.submittedCode === "object" && !Array.isArray(row.submittedCode)
      ? (row.submittedCode as unknown as Record<string, string>)
      : {};

  return { stepStatuses, submittedCode, completed: row.completedAt != null };
}
