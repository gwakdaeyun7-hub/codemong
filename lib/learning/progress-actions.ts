"use server";

import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/lib/auth/get-user";
import { prisma } from "@/lib/prisma";
import { validateLessonRef } from "@/lib/community/validation";

// 학습 진도 1층(이수율) Server Actions.
//  · markVideoWatchedAction   — 영상 90% 도달 시 최초 1회 videoWatchedAt 기록 (완료 버튼 활성 신호)
//  · toggleLessonCompleteAction — 완료 버튼 토글 (learnCompletedAt on/off = 이수율 집계 대상)
// 2층(이해도, quizPassedAt)은 퀴즈 화면 구현 후 별도 action 추가 예정.

export type ProgressResult =
  | { ok: true; videoWatched: boolean; learnCompleted: boolean }
  | { ok: false; error: string };

// 영상 90% 도달 — videoWatchedAt 최초 1회 기록 (멱등). 시청 자체는 이수율을 바꾸지 않아 강의 페이지만 가볍게 revalidate.
export async function markVideoWatchedAction(lessonRef: string): Promise<ProgressResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "로그인이 필요합니다." };

  const refErr = validateLessonRef(lessonRef);
  if (refErr) return { ok: false, error: refErr };

  const where = { lessonRef_userId: { lessonRef, userId: user.id } };
  const existing = await prisma.lessonProgress.findUnique({ where });

  // 이미 시청 기록이 있으면 최초 도달 시점을 유지한다.
  if (existing?.videoWatchedAt) {
    return {
      ok: true,
      videoWatched: true,
      learnCompleted: existing.learnCompletedAt !== null,
    };
  }

  const row = await prisma.lessonProgress.upsert({
    where,
    update: { videoWatchedAt: new Date() },
    create: { lessonRef, userId: user.id, videoWatchedAt: new Date() },
  });

  const [c, l] = lessonRef.split("/");
  if (c && l) revalidatePath(`/courses/${c}/lessons/${l}`);

  return {
    ok: true,
    videoWatched: true,
    learnCompleted: row.learnCompletedAt !== null,
  };
}

// 완료 버튼 토글 — learnCompletedAt on/off. 이수율 집계 대상이라 홈/마이페이지도 revalidate.
export async function toggleLessonCompleteAction(lessonRef: string): Promise<ProgressResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "로그인이 필요합니다." };

  const refErr = validateLessonRef(lessonRef);
  if (refErr) return { ok: false, error: refErr };

  const where = { lessonRef_userId: { lessonRef, userId: user.id } };
  const existing = await prisma.lessonProgress.findUnique({ where });
  const nowCompleted = !existing?.learnCompletedAt;

  const row = await prisma.lessonProgress.upsert({
    where,
    update: { learnCompletedAt: nowCompleted ? new Date() : null },
    // 완료 버튼은 보통 영상 시청 후 활성화되지만, 안전하게 시청 시점도 함께 채운다.
    create: {
      lessonRef,
      userId: user.id,
      videoWatchedAt: new Date(),
      learnCompletedAt: nowCompleted ? new Date() : null,
    },
  });

  const [c, l] = lessonRef.split("/");
  if (c && l) revalidatePath(`/courses/${c}/lessons/${l}`);
  revalidatePath("/"); // 홈 카드 이수율
  revalidatePath("/mypage"); // 마이페이지 학습 통계

  return {
    ok: true,
    videoWatched: row.videoWatchedAt !== null,
    learnCompleted: row.learnCompletedAt !== null,
  };
}
