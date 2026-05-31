"use server";

import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/lib/auth/get-user";
import { prisma } from "@/lib/prisma";
import { validateLessonRef } from "@/lib/community/validation";
import { getProject } from "@/lib/project-content";

// 프로젝트형 강의(13강~) 진도 Server Actions — 코딩테스트 스타일(문제 1개, 한 번에 제출).
//  · passProjectAction      — 채점 통과 기록 + 코드 저장 (= 학습 완료, completedAt, 이수율 집계).
//  · saveProjectCodeAction  — 코드만 저장 (통과 못해도 이어하기용).
// 채점 자체는 클라이언트(Pyodide)에서 수행하고 통과 결과(passed)만 기록한다.
// (학습용이라 정답 노출/우회 위험이 낮음 — 신뢰가 필요해지면 서버 재검증을 얹는다.)
//
// ProjectProgress 의 stepStatuses/submittedCode 는 Json 맵이라, 단일 문제는 "solution" 키 하나만 쓴다.
// (스텝 구조였던 흔적 — 스키마 변경 없이 단일 문제로 운용. 완료 신호는 completedAt.)

const CODE_KEY = "solution";
const MAX_CODE_LEN = 10000;

export type ProjectActionResult = { ok: true; completed: boolean } | { ok: false; error: string };

function ensureProject(lessonRef: string) {
  const [courseId, lessonId] = lessonRef.split("/");
  const project = courseId && lessonId ? getProject(courseId, lessonId) : undefined;
  return { courseId, lessonId, project };
}

export async function passProjectAction(
  lessonRef: string,
  code: string,
): Promise<ProjectActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "로그인이 필요합니다." };

  const refErr = validateLessonRef(lessonRef);
  if (refErr) return { ok: false, error: refErr };

  const { courseId, lessonId, project } = ensureProject(lessonRef);
  if (!project) return { ok: false, error: "프로젝트를 찾을 수 없습니다." };

  const where = { lessonRef_userId: { lessonRef, userId: user.id } };
  const existing = await prisma.projectProgress.findUnique({ where });

  const stepStatuses = { [CODE_KEY]: true };
  const submittedCode = { [CODE_KEY]: code.slice(0, MAX_CODE_LEN) };
  const completedAt = existing?.completedAt ?? new Date();

  await prisma.projectProgress.upsert({
    where,
    update: { stepStatuses, submittedCode, completedAt },
    create: { lessonRef, userId: user.id, stepStatuses, submittedCode, completedAt },
  });

  revalidatePath(`/courses/${courseId}/lessons/${lessonId}`);
  revalidatePath("/"); // 홈 카드 이수율
  revalidatePath("/mypage"); // 마이페이지 학습 통계

  return { ok: true, completed: true };
}

export async function saveProjectCodeAction(
  lessonRef: string,
  code: string,
): Promise<{ ok: boolean }> {
  const user = await getCurrentUser();
  if (!user) return { ok: false };
  if (validateLessonRef(lessonRef)) return { ok: false };

  const { project } = ensureProject(lessonRef);
  if (!project) return { ok: false };

  const where = { lessonRef_userId: { lessonRef, userId: user.id } };
  const submittedCode = { [CODE_KEY]: code.slice(0, MAX_CODE_LEN) };

  await prisma.projectProgress.upsert({
    where,
    update: { submittedCode },
    create: { lessonRef, userId: user.id, submittedCode },
  });

  return { ok: true };
}
