import { prisma } from "@/lib/prisma";
import { getLessonPlan } from "@/lib/lesson-plan";

// 학습 진도 조회 (Server Component 용).
//  · getLessonProgress   — 강의 상세에서 현재 강의의 진도 상태
//  · getCourseCompletion — 코스 이수율 (학습 완료 강의 수 / 전체 강의 수)

export type LessonProgressStatus = {
  videoWatched: boolean;
  learnCompleted: boolean;
  quizPassed: boolean;
};

// 해당 강의의 현재 진도 상태. 비로그인이면 전부 false.
export async function getLessonProgress(
  lessonRef: string,
  userId: string | null,
): Promise<LessonProgressStatus> {
  if (!userId) {
    return { videoWatched: false, learnCompleted: false, quizPassed: false };
  }
  const row = await prisma.lessonProgress.findUnique({
    where: { lessonRef_userId: { lessonRef, userId } },
  });
  return {
    videoWatched: row?.videoWatchedAt != null,
    learnCompleted: row?.learnCompletedAt != null,
    quizPassed: row?.quizPassedAt != null,
  };
}

// 코스 이수율 — "학습 완료(learnCompletedAt)" 강의 수 / 전체 강의 수.
// total 은 정적 lesson-plan 기준. 비로그인이면 completed 0.
// lessonRef 포맷이 "<courseId>/<lessonId>" 라 courseId prefix 로 이 코스의 진도만 센다.
export async function getCourseCompletion(
  courseId: string,
  userId: string | null,
): Promise<{ completed: number; total: number }> {
  const plan = getLessonPlan(courseId);
  const total = plan?.lessons.length ?? 0;

  if (!userId || total === 0) return { completed: 0, total };

  const completed = await prisma.lessonProgress.count({
    where: {
      userId,
      learnCompletedAt: { not: null },
      lessonRef: { startsWith: `${courseId}/` },
    },
  });

  // 완료 기록이 정적 강의 수를 넘지 않도록 보정 (lessonRef 잔재 등 방어).
  return { completed: Math.min(completed, total), total };
}
