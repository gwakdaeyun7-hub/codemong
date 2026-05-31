"use server";

import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/lib/auth/get-user";
import { prisma } from "@/lib/prisma";
import { validateLessonRef } from "@/lib/community/validation";
import { getExercises } from "@/lib/exercise-content";

// 강별 연습 문제 통과 기록 Server Action — 13강 ProjectProgress 패턴 답습.
//  · passExerciseAction — 한 문제 통과를 ExerciseProgress.passed 맵에 멱등 병합.
// 채점 자체는 클라이언트(Pyodide, lib/project/grader.ts)에서 끝나고 통과 결과(boolean)만 기록한다.
// (학습용이라 정답 노출/우회 위험이 낮음 — ProjectProgress 와 동일하게 서버 재검증은 하지 않는다.)
//
// 연습 통과는 이제 "강 완료(이수율)" 조건의 일부다 (강 완료 = 학습 완료 AND 연습 전부 통과).
// 따라서 통과 1건이 코스 이수율·강별 status·성장 레이더까지 바꾼다 — 관련 화면을 모두 revalidate 한다.

export type ExerciseActionResult = { ok: true } | { ok: false; error: string };

function isStringBoolMap(value: unknown): value is Record<string, boolean> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// 한 연습 문제 통과 기록.
//  · 로그인 필수 (비로그인이면 throw 대신 { ok: false } 반환).
//  · (lessonRef, userId) 행의 passed 맵에 passed[exerciseId] = true 를 병합 (멱등 — 기존 통과 유지).
//  · Prisma Json 컬럼은 부분 업데이트가 안 되므로 기존 맵을 읽어 머지 후 통째로 쓴다.
//    동시성은 학습용이라 last-write-wins 허용.
export async function passExerciseAction(
  lessonRef: string,
  exerciseId: string,
): Promise<ExerciseActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "로그인이 필요해요" };

  const refErr = validateLessonRef(lessonRef);
  if (refErr) return { ok: false, error: refErr };

  if (!exerciseId) return { ok: false, error: "문제 정보가 없어요" };

  // 존재하지 않는 강/문제는 거른다 (잘못된 ref 로 빈 행이 쌓이는 것 방지).
  const [courseId, lessonId] = lessonRef.split("/");
  const set = courseId && lessonId ? getExercises(courseId, lessonId) : undefined;
  if (!set) return { ok: false, error: "연습 문제를 찾을 수 없어요" };
  if (!set.exercises.some((ex) => ex.id === exerciseId)) {
    return { ok: false, error: "연습 문제를 찾을 수 없어요" };
  }

  const where = { lessonRef_userId: { lessonRef, userId: user.id } };
  const existing = await prisma.exerciseProgress.findUnique({ where });

  const prevPassed = isStringBoolMap(existing?.passed) ? existing.passed : {};
  // 이미 통과로 기록돼 있으면 쓰기 자체를 생략 (멱등 — 불필요한 write/revalidate 회피).
  if (prevPassed[exerciseId] === true) return { ok: true };

  const passed: Record<string, boolean> = { ...prevPassed, [exerciseId]: true };

  await prisma.exerciseProgress.upsert({
    where,
    update: { passed },
    create: { lessonRef, userId: user.id, passed },
  });

  // 통과 1건이 바꾸는 화면을 모두 재검증:
  //  · practice               — 초기 ✓ 복원 (getExerciseProgress)
  //  · lessons (목록)          — 강별 N/M 배지 + 강 완료 status (getCourseExerciseStatuses / getCourseLessonStatuses)
  //  · lessons/[lessonId]      — 영상 상세 우측 통계 + 진입 카드 N/M + 단일 강 완료 (getCourseLessonStatuses / getLessonProgress)
  //  · / (홈)                  — 코스 이수율 카드 (getCourseCompletion)
  //  · /mypage                 — 성장 레이더 (getSkillRadar → getCourseLessonStatuses)
  // (강좌 소개 /courses/[courseId] 는 이수율/진행률을 조회하지 않아 제외.)
  revalidatePath(`/courses/${courseId}/lessons/${lessonId}/practice`);
  revalidatePath(`/courses/${courseId}/lessons`);
  revalidatePath(`/courses/${courseId}/lessons/${lessonId}`);
  revalidatePath("/");
  revalidatePath("/mypage");

  return { ok: true };
}
