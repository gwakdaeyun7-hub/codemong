import { prisma } from "@/lib/prisma";
import { getLessonPlan } from "@/lib/lesson-plan";

import type {
  LikedLessonItem,
  LikedPostItem,
  PostCategory,
} from "./types";

// 마이페이지 — 내가 좋아요한 강의들.
// lesson 메타(제목)는 정적 lib/lesson-plan.ts 에서 매핑. 없으면 ref 그대로.
export async function listMyLikedLessons(
  userId: string,
  page: number = 1,
  pageSize: number = 20,
): Promise<{ items: LikedLessonItem[]; total: number }> {
  const [rows, total] = await Promise.all([
    prisma.lessonLike.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.lessonLike.count({ where: { userId } }),
  ]);

  const items: LikedLessonItem[] = rows.map((r) => {
    const [courseId, lessonId] = r.lessonRef.split("/");
    const plan = courseId ? getLessonPlan(courseId) : null;
    const lesson = plan?.lessons.find((l) => l.id === lessonId);
    return {
      lessonRef: r.lessonRef,
      courseId: courseId ?? "",
      lessonId: lessonId ?? "",
      title: lesson?.title ?? r.lessonRef,
      likedAt: r.createdAt,
    };
  });

  return { items, total };
}

// 마이페이지 — 내가 좋아요한 게시글들.
export async function listMyLikedPosts(
  userId: string,
  page: number = 1,
  pageSize: number = 20,
): Promise<{ items: LikedPostItem[]; total: number }> {
  const [likes, total] = await Promise.all([
    prisma.postLike.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        post: true,
      },
    }),
    prisma.postLike.count({ where: { userId } }),
  ]);

  const items: LikedPostItem[] = likes
    // 글이 삭제되었으면 보여주지 않음.
    .filter((l) => l.post && l.post.deletedAt === null)
    .map((l) => {
      const post = l.post!;
      return {
        id: post.id,
        category: post.category as PostCategory,
        title: post.title,
        excerpt:
          post.body.length > 120
            ? post.body.replace(/\s+/g, " ").trim().slice(0, 120) + "…"
            : post.body.replace(/\s+/g, " ").trim(),
        authorId: post.authorId,
        authorNickname: post.authorNickname,
        authorAvatarUrl: post.authorAvatarUrl,
        createdAt: post.createdAt,
        resolved: post.resolved,
        likeCount: post.likeCount,
        commentCount: post.commentCount,
        likedAt: l.createdAt,
      };
    });

  return { items, total };
}
