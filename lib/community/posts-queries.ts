import { prisma } from "@/lib/prisma";

import type { PostCategory, PostDetail, PostListItem } from "./types";

const EXCERPT_LEN = 120;

function toExcerpt(body: string): string {
  const single = body.replace(/\s+/g, " ").trim();
  return single.length > EXCERPT_LEN ? single.slice(0, EXCERPT_LEN) + "…" : single;
}

/**
 * 커뮤니티 게시글 목록.
 * - category 가 주어지면 그 카테고리만, 아니면 전체.
 * - deletedAt is null 인 것만.
 * - 최신순.
 */
export async function listPosts({
  category,
  page = 1,
  pageSize = 20,
}: {
  category?: PostCategory;
  page?: number;
  pageSize?: number;
}): Promise<{ items: PostListItem[]; total: number }> {
  const where = {
    deletedAt: null,
    ...(category ? { category } : {}),
  };

  const [rows, total] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.post.count({ where }),
  ]);

  const items: PostListItem[] = rows.map((r) => ({
    id: r.id,
    category: r.category as PostCategory,
    title: r.title,
    excerpt: toExcerpt(r.body),
    authorId: r.authorId,
    authorNickname: r.authorNickname,
    authorAvatarUrl: r.authorAvatarUrl,
    createdAt: r.createdAt,
    resolved: r.resolved,
    likeCount: r.likeCount,
    commentCount: r.commentCount,
  }));

  return { items, total };
}

export async function getPost(
  postId: string,
  currentUserId: string | null,
): Promise<PostDetail | null> {
  const post = await prisma.post.findFirst({
    where: { id: postId, deletedAt: null },
  });
  if (!post) return null;

  let likedByMe = false;
  if (currentUserId) {
    const like = await prisma.postLike.findUnique({
      where: { postId_userId: { postId, userId: currentUserId } },
    });
    likedByMe = like !== null;
  }

  return {
    id: post.id,
    category: post.category as PostCategory,
    title: post.title,
    body: post.body,
    authorId: post.authorId,
    authorNickname: post.authorNickname,
    authorAvatarUrl: post.authorAvatarUrl,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    resolved: post.resolved,
    likeCount: post.likeCount,
    commentCount: post.commentCount,
    likedByMe,
    isMine: currentUserId === post.authorId,
  };
}

// 마이페이지 — 내가 쓴 글
export async function listMyPosts(
  userId: string,
  page: number = 1,
  pageSize: number = 20,
): Promise<{ items: PostListItem[]; total: number }> {
  const where = { authorId: userId, deletedAt: null };

  const [rows, total] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.post.count({ where }),
  ]);

  const items: PostListItem[] = rows.map((r) => ({
    id: r.id,
    category: r.category as PostCategory,
    title: r.title,
    excerpt: toExcerpt(r.body),
    authorId: r.authorId,
    authorNickname: r.authorNickname,
    authorAvatarUrl: r.authorAvatarUrl,
    createdAt: r.createdAt,
    resolved: r.resolved,
    likeCount: r.likeCount,
    commentCount: r.commentCount,
  }));

  return { items, total };
}
