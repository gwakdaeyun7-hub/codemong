"use server";

import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/lib/auth/get-user";
import { prisma } from "@/lib/prisma";
import { validateLessonRef } from "@/lib/community/validation";
import { getProject } from "@/lib/project-content";

// 프로젝트형 강의(13강~) 진도 Server Actions.
//  · passStepAction     — 스텝 채점 통과 기록 + 코드 저장. 채점 스텝을 모두 통과하면 completedAt(= 학습 완료, 이수율 집계).
//  · saveStepCodeAction — 코드만 저장 (통과 못해도 이어하기용).
// 채점 자체는 클라이언트(Pyodide)에서 수행하고 결과(passed)만 기록한다.
// (학습용이라 정답 노출/우회 위험이 낮음 — 신뢰가 필요해지면 서버 재검증을 얹는다.)

export type ProjectActionResult = { ok: true; completed: boolean } | { ok: false; error: string };

type StepStatusMap = Record<string, boolean>;
type StepCodeMap = Record<string, string>;

const MAX_CODE_LEN = 10000;

function asStatusMap(v: unknown): StepStatusMap {
  return v && typeof v === "object" && !Array.isArray(v) ? (v as StepStatusMap) : {};
}
function asCodeMap(v: unknown): StepCodeMap {
  return v && typeof v === "object" && !Array.isArray(v) ? (v as StepCodeMap) : {};
}

export async function passStepAction(
  lessonRef: string,
  stepId: string,
  code: string,
): Promise<ProjectActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "로그인이 필요합니다." };

  const refErr = validateLessonRef(lessonRef);
  if (refErr) return { ok: false, error: refErr };

  const [courseId, lessonId] = lessonRef.split("/");
  const project = courseId && lessonId ? getProject(courseId, lessonId) : undefined;
  if (!project) return { ok: false, error: "프로젝트를 찾을 수 없습니다." };
  if (!project.steps.some((s) => s.id === stepId)) {
    return { ok: false, error: "잘못된 스텝입니다." };
  }

  const where = { lessonRef_userId: { lessonRef, userId: user.id } };
  const existing = await prisma.projectProgress.findUnique({ where });

  const stepStatuses: StepStatusMap = { ...asStatusMap(existing?.stepStatuses), [stepId]: true };
  const submittedCode: StepCodeMap = {
    ...asCodeMap(existing?.submittedCode),
    [stepId]: code.slice(0, MAX_CODE_LEN),
  };

  // 채점 대상 스텝(테스트가 있는 스텝)을 모두 통과하면 프로젝트 완료.
  const gradedStepIds = project.steps.filter((s) => s.tests.length > 0).map((s) => s.id);
  const allPassed = gradedStepIds.every((id) => stepStatuses[id] === true);
  const completedAt = allPassed ? (existing?.completedAt ?? new Date()) : null;

  await prisma.projectProgress.upsert({
    where,
    update: { stepStatuses, submittedCode, completedAt },
    create: { lessonRef, userId: user.id, stepStatuses, submittedCode, completedAt },
  });

  revalidatePath(`/courses/${courseId}/lessons/${lessonId}`);
  if (allPassed) {
    revalidatePath("/"); // 홈 카드 이수율
    revalidatePath("/mypage"); // 마이페이지 학습 통계
  }

  return { ok: true, completed: allPassed };
}

export async function saveStepCodeAction(
  lessonRef: string,
  stepId: string,
  code: string,
): Promise<{ ok: boolean }> {
  const user = await getCurrentUser();
  if (!user) return { ok: false };
  if (validateLessonRef(lessonRef)) return { ok: false };

  const [courseId, lessonId] = lessonRef.split("/");
  const project = courseId && lessonId ? getProject(courseId, lessonId) : undefined;
  if (!project || !project.steps.some((s) => s.id === stepId)) return { ok: false };

  const where = { lessonRef_userId: { lessonRef, userId: user.id } };
  const existing = await prisma.projectProgress.findUnique({ where });
  const submittedCode: StepCodeMap = {
    ...asCodeMap(existing?.submittedCode),
    [stepId]: code.slice(0, MAX_CODE_LEN),
  };

  await prisma.projectProgress.upsert({
    where,
    update: { submittedCode },
    create: { lessonRef, userId: user.id, submittedCode },
  });

  return { ok: true };
}
