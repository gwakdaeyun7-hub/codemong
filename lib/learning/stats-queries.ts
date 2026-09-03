import { prisma } from "@/lib/prisma";
import { getLessonPlan, type LessonBadge } from "@/lib/lesson-plan";
import { getLearningCalendar } from "@/lib/learning/calendar-queries";
import { getCourseExerciseStatuses } from "@/lib/learning/exercise-queries";
import { getCourseCompletion, getCourseLessonStatuses } from "@/lib/learning/progress-queries";
import { getCourseSolveStatuses } from "@/lib/skill/submission-queries";

// 마이페이지 학습 현황 / 최근 학습 / 배지의 실데이터 소스.
// 새 집계 규칙을 만들지 않고 기존 단일 진실 원천을 조합만 한다 —
// 이수율은 getCourseCompletion, 연속일은 getLearningCalendar, 문제 해결은 getCourseSolveStatuses,
// 연습 통과는 getCourseExerciseStatuses. 그래서 홈·강의 목록·캘린더와 숫자가 어긋나지 않는다.
// (문제 은행은 courseId "be-python" 기준 — 실력향상 화면들과 동일.)

export type LearningStats = {
  /** 강 완료 수 (영상+연습 AND 규칙) / 전체 강 수 */
  completedLessons: number;
  totalLessons: number;
  /** 실력향상(시험) 트랙 해결 문제 수 / 전체 문제 수 */
  solvedProblems: number;
  totalProblems: number;
  /** 강별 연습 통과 수 / 전체 연습 문제 수 */
  passedExercises: number;
  totalExercises: number;
  /** 연속 학습일 (KST, 오늘 활동 없으면 어제까지) */
  streak: number;
  /** 학습 활동이 있던 날 수 (최근 6개월) */
  activeDays: number;
  /** 내가 쓴 댓글 수 (삭제 제외) */
  commentCount: number;
};

const EMPTY_STATS: LearningStats = {
  completedLessons: 0,
  totalLessons: 0,
  solvedProblems: 0,
  totalProblems: 0,
  passedExercises: 0,
  totalExercises: 0,
  streak: 0,
  activeDays: 0,
  commentCount: 0,
};

export async function getLearningStats(
  courseId: string,
  userId: string | null,
): Promise<LearningStats> {
  const plan = getLessonPlan(courseId);
  const totalLessons = plan?.lessons.length ?? 0;
  if (!userId) return { ...EMPTY_STATS, totalLessons };

  const [completion, calendar, solve, exercises, commentCount] = await Promise.all([
    getCourseCompletion(courseId, userId),
    getLearningCalendar(userId),
    getCourseSolveStatuses("be-python", userId),
    getCourseExerciseStatuses(courseId, userId),
    prisma.comment.count({ where: { authorId: userId, deletedAt: null } }),
  ]);

  let solvedProblems = 0;
  let totalProblems = 0;
  for (const s of Object.values(solve.byLesson)) {
    solvedProblems += s.solved;
    totalProblems += s.total;
  }

  let passedExercises = 0;
  let totalExercises = 0;
  for (const s of Object.values(exercises)) {
    passedExercises += s.passed;
    totalExercises += s.total;
  }

  return {
    completedLessons: completion.completed,
    totalLessons: completion.total,
    solvedProblems,
    totalProblems,
    passedExercises,
    totalExercises,
    streak: calendar.streak,
    activeDays: calendar.activeDays,
    commentCount,
  };
}

// ─── 최근 학습 ────────────────────────────────────────────────

export type RecentLessonItem = {
  lessonId: string;
  lessonNumber: number;
  title: string;
  href: string;
  /** 그 강이 완료 상태인지 (강의 목록 배지와 같은 판정) */
  completed: boolean;
};

/**
 * 최근에 손댄 강의 — LessonProgress(영상) + ProjectProgress(프로젝트) 를 updatedAt 기준으로 합쳐
 * 최신 limit개. 제목·번호는 정적 lesson-plan 에서 채우고, 완료 배지는 getCourseLessonStatuses 판정을 쓴다.
 */
export async function listRecentLessons(
  courseId: string,
  userId: string | null,
  limit = 3,
): Promise<RecentLessonItem[]> {
  const plan = getLessonPlan(courseId);
  if (!plan || !userId) return [];

  const [lessonRows, projectRows, statuses] = await Promise.all([
    prisma.lessonProgress.findMany({
      where: { userId, lessonRef: { startsWith: `${courseId}/` } },
      select: { lessonRef: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
      take: limit,
    }),
    prisma.projectProgress.findMany({
      where: { userId, lessonRef: { startsWith: `${courseId}/` } },
      select: { lessonRef: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
      take: limit,
    }),
    getCourseLessonStatuses(courseId, userId),
  ]);

  const merged = [...lessonRows, ...projectRows]
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .map((row) => row.lessonRef.split("/")[1])
    .filter((id): id is string => Boolean(id));

  const seen = new Set<string>();
  const items: RecentLessonItem[] = [];
  for (const lessonId of merged) {
    if (seen.has(lessonId)) continue;
    seen.add(lessonId);
    const lesson = plan.lessons.find((l) => l.id === lessonId);
    if (!lesson) continue; // 커리큘럼에서 사라진 강 잔재 방어
    items.push({
      lessonId,
      lessonNumber: lesson.number,
      title: lesson.title,
      href: `/courses/${courseId}/lessons/${lessonId}`,
      completed: statuses[lessonId] === "completed",
    });
    if (items.length >= limit) break;
  }
  return items;
}

// ─── 배지 ─────────────────────────────────────────────────────
// 획득 조건을 별도 모델 없이 기존 실데이터에서 파생한다 (저장 X — 볼 때 계산).
// 조건은 화면에 그대로 적어 두는 것이 정직 톤: hint 에 "무엇을 하면 받는지" 를 남긴다.

export function deriveBadges(stats: LearningStats): LessonBadge[] {
  const courseDone = stats.totalLessons > 0 && stats.completedLessons >= stats.totalLessons;
  return [
    {
      id: "badge-starter",
      label: "첫걸음",
      iconHint: "Rocket",
      tone: "rose",
      acquired: stats.completedLessons >= 1,
      hint: "강의 1개 완료",
    },
    {
      id: "badge-streak",
      label: "연속 학습",
      iconHint: "Flame",
      tone: "amber",
      acquired: stats.streak >= 3,
      hint: "3일 연속 학습",
    },
    {
      id: "badge-practice",
      label: "연습 벌레",
      iconHint: "Target",
      tone: "violet",
      acquired: stats.passedExercises >= 5,
      hint: "연습 문제 5개 통과",
    },
    {
      id: "badge-solver",
      label: "문제 해결",
      iconHint: "Zap",
      tone: "sky",
      acquired: stats.solvedProblems >= 1,
      hint: "실력향상 문제 1개 해결",
    },
    {
      id: "badge-finisher",
      label: "완주",
      iconHint: "Trophy",
      tone: "emerald",
      acquired: courseDone,
      hint: "코스 전체 강의 완료",
    },
  ];
}
