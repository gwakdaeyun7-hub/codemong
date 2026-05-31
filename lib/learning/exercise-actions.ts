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
// 이번 범위는 "통과 저장"만. 이수율(강 완료 조건) 연동은 별도 라운드 — 여기서 LessonProgress 등을 건드리지 않는다.

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

  // 통과 기록이라 강의 목록(N/M 표시)·practice 페이지(초기 ✓ 복원)를 재검증.
  // 이수율(홈/마이페이지) 은 이번 범위가 아니라 revalidate 하지 않는다.
  revalidatePath(`/courses/${courseId}/lessons`);
  revalidatePath(`/courses/${courseId}/lessons/${lessonId}/practice`);

  return { ok: true };
}
