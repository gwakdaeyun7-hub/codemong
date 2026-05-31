import { prisma } from "@/lib/prisma";
import { getExercises } from "@/lib/exercise-content";
import { getCourseExerciseStatuses } from "@/lib/learning/exercise-queries";
import { getLessonPlan, type LessonStatus } from "@/lib/lesson-plan";

// 학습 진도 조회 (Server Component 용).
//  · getLessonProgress   — 강의 상세에서 현재 강의의 진도 상태
//  · getCourseCompletion — 코스 이수율 (강 완료 강의 수 / 전체 강의 수)
//  · getCourseLessonStatuses — 코스 강별 status 맵 (강의 목록/상세/홈 카드 진행률)
//
// 강 완료(completed) 판정 규칙 (사용자 합의):
//   강 완료 = 학습 완료 AND 연습 완료, 단 연습 없는 강은 연습 조건 면제.
//   · 영상 강의(LessonProgress): learnCompletedAt 있음 AND (연습 0개 OR 연습 전부 통과(passed === total))
//   · 프로젝트 강의(ProjectProgress): 연습 트랙 없음 → 자동 면제. completedAt 그대로 사용.
// "영상만 보면 완료"였던 것이 이제 "영상 + 그 강 연습 전부 통과"라야 완료다.

export type LessonProgressStatus = {
  videoWatched: boolean;
  learnCompleted: boolean;
  quizPassed: boolean;
  /**
   * 그 강의 연습 문제까지 포함한 "강 완료" 여부.
   *   = learnCompleted AND (연습 0개 OR 연습 전부 통과)
   * 영상 시청/완료(videoWatched/learnCompleted)만으로는 알 수 없는 최종 완료 상태라 별도 필드로 노출한다.
   * (기존 필드는 그대로 유지 — 호출부가 안 깨지게 추가만.)
   */
  lessonCompleted: boolean;
};

// 해당 강의의 현재 진도 상태. 비로그인이면 전부 false.
//  · lessonRef 포맷은 "<courseId>/<lessonId>" — 연습 완료 여부를 따지려면 이 ref 로 그 강 문제 수와 통과 맵을 조회한다.
//  · 영상 진도(LessonProgress)만 보는 강과, 그 강의 연습(ExerciseProgress)을 함께 봐야 하는 강을 한 번에 처리한다.
export async function getLessonProgress(
  lessonRef: string,
  userId: string | null,
): Promise<LessonProgressStatus> {
  if (!userId) {
    return {
      videoWatched: false,
      learnCompleted: false,
      quizPassed: false,
      lessonCompleted: false,
    };
  }

  const [courseId, lessonId] = lessonRef.split("/");
  const exerciseSet = courseId && lessonId ? getExercises(courseId, lessonId) : undefined;
  const exerciseTotal = exerciseSet?.exercises.length ?? 0;

  // 영상 진도 + (연습 있는 강이면) 통과 맵을 한 번에 조회.
  const [row, exerciseProgress] = await Promise.all([
    prisma.lessonProgress.findUnique({
      where: { lessonRef_userId: { lessonRef, userId } },
    }),
    exerciseTotal > 0
      ? prisma.exerciseProgress.findUnique({
          where: { lessonRef_userId: { lessonRef, userId } },
        })
      : Promise.resolve(null),
  ]);

  const learnCompleted = row?.learnCompletedAt != null;
  // 현재 존재하는 문제 id 에 한해 통과 수를 센다 (삭제된 문제 잔재 방어).
  const passedCount = countPassed(exerciseProgress?.passed, exerciseSet);
  const exercisesDone = exerciseTotal === 0 || passedCount >= exerciseTotal;

  return {
    videoWatched: row?.videoWatchedAt != null,
    learnCompleted,
    quizPassed: row?.quizPassedAt != null,
    lessonCompleted: learnCompleted && exercisesDone,
  };
}

// 코스 이수율 — "강 완료" 강의 수 / 전체 강의 수.
// 강 완료 판정은 getCourseLessonStatuses 와 동일해야 하므로(홈 카드 ↔ 강의 목록 일관),
// 그 맵을 그대로 재사용해 completed 를 센다. total 은 정적 lesson-plan 기준. 비로그인이면 completed 0.
export async function getCourseCompletion(
  courseId: string,
  userId: string | null,
): Promise<{ completed: number; total: number }> {
  const plan = getLessonPlan(courseId);
  const total = plan?.lessons.length ?? 0;

  if (!userId || total === 0) return { completed: 0, total };

  // 단일 진실 원천 = getCourseLessonStatuses. (영상/프로젝트 + 연습 완료 규칙이 거기 한 곳에 모여 있음.)
  const statuses = await getCourseLessonStatuses(courseId, userId);
  const completed = plan!.lessons.filter((l) => statuses[l.id] === "completed").length;

  return { completed, total };
}

// 코스의 강의별 진도 상태 맵 (lessonId → status). 강의 목록/상세/홈 카드가 mock 대신 실데이터를 쓰도록.
//
// 영상 강의(LessonProgress 트랙):
//   · completed   : learnCompletedAt 있음 AND (연습 0개 OR 연습 전부 통과)
//   · in-progress : completed 아니면서 — videoWatchedAt 있음 / learnCompletedAt 있음(연습 미완) / 연습 일부 통과(passed > 0)
//   · not-started : 위 어디에도 안 걸림 (영상 진도 없음 + 연습 통과 0)
// 프로젝트 강의(ProjectProgress 트랙): 연습 트랙 없음 → completedAt 있으면 completed, 진도 행만 있으면 in-progress.
//
// lessonRef 는 "<courseId>/<lessonId>" 포맷이라 courseId prefix 로 이 코스 진도만 모은다.
// 연습 통과 수는 getCourseExerciseStatuses 로 코스 전체를 한 번에 조회(per-lesson N+1 회피).
// 비로그인이면 전부 not-started.
export async function getCourseLessonStatuses(
  courseId: string,
  userId: string | null,
): Promise<Record<string, LessonStatus>> {
  const plan = getLessonPlan(courseId);
  const result: Record<string, LessonStatus> = {};
  if (!plan) return result;

  // 기본값: 전 강의 미시작.
  for (const lesson of plan.lessons) result[lesson.id] = "not-started";
  if (!userId) return result;

  // 영상 진도 / 프로젝트 진도 / 코스 연습 통과 현황을 한 번에 조회.
  //  · exerciseStatuses: Record<lessonId, { passed, total }> — 연습 있는 강만 키 존재.
  const [lessonRows, projectRows, exerciseStatuses] = await Promise.all([
    prisma.lessonProgress.findMany({
      where: { userId, lessonRef: { startsWith: `${courseId}/` } },
      select: { lessonRef: true, videoWatchedAt: true, learnCompletedAt: true },
    }),
    prisma.projectProgress.findMany({
      where: { userId, lessonRef: { startsWith: `${courseId}/` } },
      select: { lessonRef: true, completedAt: true },
    }),
    getCourseExerciseStatuses(courseId, userId),
  ]);

  // 영상 강의 — 학습 완료 + 연습 완료 AND 규칙.
  for (const row of lessonRows) {
    const lessonId = row.lessonRef.split("/")[1];
    if (!lessonId || !(lessonId in result)) continue;

    const ex = exerciseStatuses[lessonId]; // 연습 없는 강이면 undefined
    const hasExercises = ex != null && ex.total > 0;
    const exercisesDone = !hasExercises || ex.passed >= ex.total;

    if (row.learnCompletedAt != null && exercisesDone) {
      // 학습 완료 + (연습 0개 또는 전부 통과) → 강 완료.
      result[lessonId] = "completed";
    } else if (row.videoWatchedAt != null || row.learnCompletedAt != null) {
      // 영상 시청/완료 흔적이 있으면 진행 중 (연습이 남아 완료가 아닌 경우 포함).
      result[lessonId] = "in-progress";
    }
  }

  // 영상 진도 행이 아예 없어도 연습을 일부라도 통과했으면 진행 중으로 끌어올린다.
  // (영상은 안 보고 연습부터 통과한 경우 — not-started 로 두면 진행이 묻힘.)
  for (const [lessonId, ex] of Object.entries(exerciseStatuses)) {
    if (!(lessonId in result)) continue;
    if (result[lessonId] === "not-started" && ex.passed > 0) {
      result[lessonId] = "in-progress";
    }
  }

  // 프로젝트형 강의: 연습 트랙 없음 — 진도 행이 있으면 최소 진행 중, completedAt 있으면 완료.
  for (const row of projectRows) {
    const lessonId = row.lessonRef.split("/")[1];
    if (!lessonId || !(lessonId in result)) continue;
    result[lessonId] = row.completedAt != null ? "completed" : "in-progress";
  }

  return result;
}

// ExerciseProgress.passed(Json) 에서 "현재 존재하는 문제 id" 에 한해 true 인 개수를 센다.
// getCourseExerciseStatuses 와 동일한 카운팅 규칙 (삭제된 문제 잔재 방어 + min(passed, total) 보장).
function countPassed(
  passed: unknown,
  exerciseSet: ReturnType<typeof getExercises>,
): number {
  if (!exerciseSet || typeof passed !== "object" || passed === null || Array.isArray(passed)) {
    return 0;
  }
  const map = passed as Record<string, boolean>;
  let count = 0;
  for (const ex of exerciseSet.exercises) if (map[ex.id] === true) count += 1;
  return count;
}
