import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/lib/generated/prisma/client";

import type { CommentNode } from "./types";

/**
 * 강의 또는 게시글의 댓글을 트리 형태로 가져온다.
 *
 * 동작:
 *   1) where 조건으로 모든 댓글(부모+답글)을 한 번에 fetch
 *   2) currentUserId가 있으면 좋아요 상태를 한 번에 fetch 해서 합침
 *   3) 메모리에서 parentId 기준 트리 구성
 *   4) 최상위 댓글은 최신순(desc), 답글은 시간순(asc)
 *   5) 부모가 soft-delete 됐어도 답글이 있으면 "삭제된 댓글입니다" 로 자리 유지
 */
async function buildCommentTree(
  where: Prisma.CommentWhereInput,
  currentUserId: string | null,
): Promise<CommentNode[]> {
  const all = await prisma.comment.findMany({
    where,
    orderBy: { createdAt: "asc" },
  });

  const ids = all.map((c) => c.id);
  const likedSet = new Set<string>();
  if (currentUserId && ids.length > 0) {
    const liked = await prisma.commentLike.findMany({
      where: { userId: currentUserId, commentId: { in: ids } },
      select: { commentId: true },
    });
    liked.forEach((l) => likedSet.add(l.commentId));
  }

  const byId = new Map<string, CommentNode>();
  all.forEach((c) => {
    const isDeleted = c.deletedAt !== null;
    byId.set(c.id, {
      id: c.id,
      body: isDeleted ? "삭제된 댓글입니다." : c.body,
      authorId: c.authorId,
      authorNickname: isDeleted ? "" : c.authorNickname,
      authorAvatarUrl: isDeleted ? null : c.authorAvatarUrl,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      deletedAt: c.deletedAt,
      likeCount: c.likeCount,
      likedByMe: likedSet.has(c.id),
      isMine: currentUserId !== null && currentUserId === c.authorId,
      parentId: c.parentId,
      replies: [],
    });
  });

  const roots: CommentNode[] = [];
  byId.forEach((node) => {
    if (node.parentId) {
      const parent = byId.get(node.parentId);
      if (parent) parent.replies.push(node);
      else roots.push(node); // orphan (보통 cascade로 안 생기지만 safety)
    } else {
      roots.push(node);
    }
  });

  // 최상위 최신순, 자식은 fetch 시점에 이미 시간순.
  roots.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  // 부모가 deleted 이면서 답글도 없으면 노출하지 않음.
  return roots.filter((r) => !r.deletedAt || r.replies.length > 0);
}

export async function listLessonComments(
  lessonRef: string,
  currentUserId: string | null,
): Promise<CommentNode[]> {
  return buildCommentTree({ lessonRef }, currentUserId);
}

export async function listPostComments(
  postId: string,
  currentUserId: string | null,
): Promise<CommentNode[]> {
  return buildCommentTree({ postId }, currentUserId);
}

// 마이페이지 — 내가 쓴 댓글 (페이지네이션 offset 기반, 답글도 포함, 삭제된 것 제외)
export async function listMyComments(
  userId: string,
  page: number = 1,
  pageSize: number = 20,
): Promise<{
  items: {
    id: string;
    body: string;
    createdAt: Date;
    target: { kind: "lesson"; courseId: string; lessonId: string } | { kind: "post"; postId: string };
  }[];
  total: number;
}> {
  const where: Prisma.CommentWhereInput = { authorId: userId, deletedAt: null };
  const [rows, total] = await Promise.all([
    prisma.comment.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        body: true,
        createdAt: true,
        lessonRef: true,
        postId: true,
      },
    }),
    prisma.comment.count({ where }),
  ]);

  const items = rows.map((r) => {
    if (r.lessonRef) {
      const [courseId, lessonId] = r.lessonRef.split("/");
      return {
        id: r.id,
        body: r.body,
        createdAt: r.createdAt,
        target: { kind: "lesson" as const, courseId, lessonId },
      };
    }
    return {
      id: r.id,
      body: r.body,
      createdAt: r.createdAt,
      target: { kind: "post" as const, postId: r.postId! },
    };
  });

  return { items, total };
}
