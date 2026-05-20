"use server";

import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/lib/auth/get-user";
import { prisma } from "@/lib/prisma";
import { validateLessonRef } from "./validation";

export type LikeResult =
  | { ok: true; liked: boolean }
  | { ok: false; error: string };

// 게시글 좋아요 토글. likeCount 캐시도 함께 갱신.
export async function togglePostLikeAction(postId: string): Promise<LikeResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "로그인이 필요합니다." };

  const where = { postId_userId: { postId, userId: user.id } };
  const existing = await prisma.postLike.findUnique({ where });

  if (existing) {
    await prisma.$transaction([
      prisma.postLike.delete({ where }),
      prisma.post.update({
        where: { id: postId },
        data: { likeCount: { decrement: 1 } },
      }),
    ]);
    revalidatePath(`/community/${postId}`);
    revalidatePath("/community");
    return { ok: true, liked: false };
  }

  await prisma.$transaction([
    prisma.postLike.create({ data: { postId, userId: user.id } }),
    prisma.post.update({
      where: { id: postId },
      data: { likeCount: { increment: 1 } },
    }),
  ]);
  revalidatePath(`/community/${postId}`);
  revalidatePath("/community");
  return { ok: true, liked: true };
}

// 댓글 좋아요 토글. source path 정보가 없어 caller 가 router.refresh() 로 새로고침해야 함.
export async function toggleCommentLikeAction(
  commentId: string,
): Promise<LikeResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "로그인이 필요합니다." };

  const where = { commentId_userId: { commentId, userId: user.id } };
  const existing = await prisma.commentLike.findUnique({ where });

  if (existing) {
    await prisma.$transaction([
      prisma.commentLike.delete({ where }),
      prisma.comment.update({
        where: { id: commentId },
        data: { likeCount: { decrement: 1 } },
      }),
    ]);
    return { ok: true, liked: false };
  }

  await prisma.$transaction([
    prisma.commentLike.create({ data: { commentId, userId: user.id } }),
    prisma.comment.update({
      where: { id: commentId },
      data: { likeCount: { increment: 1 } },
    }),
  ]);
  return { ok: true, liked: true };
}

// 강의 좋아요 토글.
export async function toggleLessonLikeAction(
  lessonRef: string,
): Promise<LikeResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "로그인이 필요합니다." };

  const refErr = validateLessonRef(lessonRef);
  if (refErr) return { ok: false, error: refErr };

  const where = { lessonRef_userId: { lessonRef, userId: user.id } };
  const existing = await prisma.lessonLike.findUnique({ where });

  const [c, l] = lessonRef.split("/");

  if (existing) {
    await prisma.lessonLike.delete({ where });
    if (c && l) revalidatePath(`/courses/${c}/lessons/${l}`);
    return { ok: true, liked: false };
  }

  await prisma.lessonLike.create({ data: { lessonRef, userId: user.id } });
  if (c && l) revalidatePath(`/courses/${c}/lessons/${l}`);
  return { ok: true, liked: true };
}

// 강의 좋아요 상태/카운트 조회 (영상 페이지 하트 옆 카운트 표시)
export async function getLessonLikeStatus(
  lessonRef: string,
  userId: string | null,
): Promise<{ count: number; likedByMe: boolean }> {
  const [count, mine] = await Promise.all([
    prisma.lessonLike.count({ where: { lessonRef } }),
    userId
      ? prisma.lessonLike.findUnique({
          where: { lessonRef_userId: { lessonRef, userId } },
        })
      : Promise.resolve(null),
  ]);
  return { count, likedByMe: mine !== null };
}
