import { prisma } from "@/lib/prisma";
import type { NotificationType } from "@/lib/generated/prisma/client";

/**
 * 프론트(종 드롭다운)가 그대로 렌더할 알림 항목.
 *
 * 한국어 문구(message)는 넣지 않는다 — 프론트가 type 기반으로 조립한다.
 * backend 는 type / actorNickname / excerpt 같은 raw 데이터와,
 * 클릭 시 이동할 href 만 계산해 내려준다.
 */
export type NotificationItem = {
  id: string;
  type: NotificationType; // "post_comment" | "comment_reply" | "post_like" | "comment_like"
  actorNickname: string;
  actorAvatarUrl: string | null;
  excerpt: string | null; // 댓글 본문 일부 또는 글 제목
  href: string | null; // 이동 대상 (backend 계산) — 식별자 부족 시 null
  read: boolean; // readAt !== null
  createdAt: Date;
};

/**
 * 알림 행 → 이동 href 계산.
 *  · post 관련(post_comment / post_like / post 댓글의 답글·좋아요) → /community/{postId}
 *  · lesson 댓글의 답글(comment_reply, lessonRef 보유) → /courses/{courseId}/lessons/{lessonId}
 * 식별자가 없으면 null (프론트는 href 없으면 클릭 비활성 처리).
 */
function buildHref(row: {
  postId: string | null;
  lessonRef: string | null;
}): string | null {
  if (row.postId) return `/community/${row.postId}`;

  if (row.lessonRef) {
    const [courseId, lessonId] = row.lessonRef.split("/");
    if (courseId && lessonId) return `/courses/${courseId}/lessons/${lessonId}`;
  }

  return null;
}

/**
 * 안읽음 알림 개수. TopNav 종 뱃지용.
 * 비로그인 호출은 없음(호출부에서 getCurrentUser 가드 후 userId 전달).
 */
export async function getUnreadNotificationCount(
  userId: string,
): Promise<number> {
  return prisma.notification.count({
    where: { recipientId: userId, readAt: null },
  });
}

/**
 * 내 알림 목록 (최신순, 기본 10개). 읽음/안읽음 모두 포함.
 * 각 항목에 이동 href 를 backend 에서 계산해 포함한다(프론트 단순화).
 */
export async function listNotifications(
  userId: string,
  limit = 10,
): Promise<NotificationItem[]> {
  const rows = await prisma.notification.findMany({
    where: { recipientId: userId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return rows.map((r) => ({
    id: r.id,
    type: r.type,
    actorNickname: r.actorNickname,
    actorAvatarUrl: r.actorAvatarUrl,
    excerpt: r.excerpt,
    href: buildHref(r),
    read: r.readAt !== null,
    createdAt: r.createdAt,
  }));
}
