import { prisma } from "@/lib/prisma";
import { getExercises } from "@/lib/exercise-content";
import { getLessonPlan } from "@/lib/lesson-plan";

// 강별 연습 문제 통과 조회 (Server Component / page 용).
//  · getExerciseProgress       — 한 강의 통과 맵 (연습 페이지 초기 ✓ 복원).
//  · getCourseExerciseStatuses — 코스 전체 강별 통과 수 (강의 목록 N/M 표시).
// userId 는 caller(page)가 넘긴다 — 비로그인 처리는 caller 책임 (userId === null → 빈 결과).
// 이번 범위는 "통과 저장/조회"만. 이수율 집계(progress-queries.ts)와는 분리돼 있다.

function asPassedMap(value: unknown): Record<string, boolean> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return {};
  return value as Record<string, boolean>;
}

// 한 강의 통과 맵. 행이 없거나 비로그인이면 { passed: {} }.
export async function getExerciseProgress(
  lessonRef: string,
  userId: string | null,
): Promise<{ passed: Record<string, boolean> }> {
  if (!userId) return { passed: {} };

  const row = await prisma.exerciseProgress.findUnique({
    where: { lessonRef_userId: { lessonRef, userId } },
  });

  return { passed: asPassedMap(row?.passed) };
}

// 코스 전체 강별 통과 수 (key = lessonId, 예: "lesson-4").
//  · total  = getExercises(courseId, lessonId).exercises.length.
//  · passed = ExerciseProgress.passed 중 "현재 존재하는 문제 id" 에 한해 true 인 개수 (min(passed, total) 보장).
//  · 연습 없는 강(2강 등)은 결과 맵에 키를 넣지 않는다.
// 구현: lesson-plan 으로 코스의 lessonId 목록을 얻어 연습 있는 강만 추리고(getExercises),
//       그 강들의 ExerciseProgress 를 userId 로 한 번에 조회(lessonRef in [...])해서 매핑한다.
export async function getCourseExerciseStatuses(
  courseId: string,
  userId: string | null,
): Promise<Record<string, { passed: number; total: number }>> {
  const plan = getLessonPlan(courseId);
  const result: Record<string, { passed: number; total: number }> = {};
  if (!plan) return result;

  // 연습 있는 강만 추려서 total 과 (id → lessonId) 매핑을 만든다.
  const lessonIdByRef = new Map<string, string>();
  const validIds: Record<string, Set<string>> = {}; // lessonId → 현재 존재하는 문제 id 집합
  const refs: string[] = [];

  for (const lesson of plan.lessons) {
    const set = getExercises(courseId, lesson.id);
    if (!set || set.exercises.length === 0) continue; // 연습 없는 강은 키 자체를 넣지 않음
    result[lesson.id] = { passed: 0, total: set.exercises.length };
    validIds[lesson.id] = new Set(set.exercises.map((ex) => ex.id));
    const ref = `${courseId}/${lesson.id}`;
    lessonIdByRef.set(ref, lesson.id);
    refs.push(ref);
  }

  if (!userId || refs.length === 0) return result;

  const rows = await prisma.exerciseProgress.findMany({
    where: { userId, lessonRef: { in: refs } },
    select: { lessonRef: true, passed: true },
  });

  for (const row of rows) {
    const lessonId = lessonIdByRef.get(row.lessonRef);
    if (!lessonId) continue;
    const ids = validIds[lessonId];
    const passedMap = asPassedMap(row.passed);
    // 현재 존재하는 문제 id 에 한해 true 인 것만 센다 (삭제된 문제 잔재 방어 + min(passed, total) 보장).
    let count = 0;
    for (const id of ids) if (passedMap[id] === true) count += 1;
    result[lessonId].passed = count;
  }

  return result;
}
