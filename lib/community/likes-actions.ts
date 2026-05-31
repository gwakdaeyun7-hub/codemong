"use server";

import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/lib/auth/get-user";
import { prisma } from "@/lib/prisma";
import {
  createNotification,
  toNotificationExcerpt,
} from "@/lib/notifications/create";
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

  // 기존 트랜잭션/카운트 캐시 그대로. update 결과로 글 작성자/제목을 얻어 알림에 쓴다.
  const [, post] = await prisma.$transaction([
    prisma.postLike.create({ data: { postId, userId: user.id } }),
    prisma.post.update({
      where: { id: postId },
      data: { likeCount: { increment: 1 } },
    }),
  ]);

  // 알림(best-effort): 좋아요를 누를 때만 글 작성자에게 post_like. 취소(위 분기)는 알림 없음.
  await createNotification({
    recipientId: post.authorId,
    actorId: user.id,
    actorNickname: user.nickname,
    actorAvatarUrl: user.avatarUrl,
    type: "post_like",
    postId,
    excerpt: toNotificationExcerpt(post.title),
  });

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

  // 기존 트랜잭션/카운트 캐시 그대로. update 결과로 댓글 작성자/본문/대상을 얻어 알림에 쓴다.
  const [, comment] = await prisma.$transaction([
    prisma.commentLike.create({ data: { commentId, userId: user.id } }),
    prisma.comment.update({
      where: { id: commentId },
      data: { likeCount: { increment: 1 } },
    }),
  ]);

  // 알림(best-effort): 좋아요를 누를 때만 댓글 작성자에게 comment_like. 취소(위 분기)는 알림 없음.
  // postId/lessonRef 를 그대로 넘겨 조회 시 이동 href 를 계산하게 한다(댓글은 둘 중 하나만 보유).
  await createNotification({
    recipientId: comment.authorId,
    actorId: user.id,
    actorNickname: user.nickname,
    actorAvatarUrl: user.avatarUrl,
    type: "comment_like",
    postId: comment.postId,
    lessonRef: comment.lessonRef,
    commentId: comment.id,
    excerpt: toNotificationExcerpt(comment.body),
  });

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
