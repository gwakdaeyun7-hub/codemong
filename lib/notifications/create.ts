import { prisma } from "@/lib/prisma";
import type { NotificationType } from "@/lib/generated/prisma/client";

const EXCERPT_LEN = 80;

/**
 * 알림 미리보기 텍스트 정규화. 공백 접고 80자에서 자른다.
 * (커뮤니티 excerpt 와 같은 방식이되 알림은 더 짧게.)
 */
export function toNotificationExcerpt(text: string): string {
  const single = text.replace(/\s+/g, " ").trim();
  return single.length > EXCERPT_LEN
    ? single.slice(0, EXCERPT_LEN) + "…"
    : single;
}

export type CreateNotificationInput = {
  recipientId: string; // 알림 받는 userId
  actorId: string; // 행위자 userId
  actorNickname: string; // 행위자 표시명 스냅샷 (호출부에서 current user metadata)
  actorAvatarUrl: string | null;
  type: NotificationType;
  postId?: string | null;
  lessonRef?: string | null;
  commentId?: string | null;
  excerpt?: string | null;
};

/**
 * 알림 1행 생성 — 기존 커뮤니티 액션(댓글/좋아요)에서 호출하는 내부 헬퍼.
 *
 * 정책:
 *  · 본인→본인 행위(recipientId === actorId)는 생성하지 않고 early return.
 *  · 알림은 부가 기능 — 생성 실패가 본래 액션을 깨면 안 되므로 try/catch 로 감싼 best-effort.
 *    실패 시 조용히 무시하고 서버 로그만 남긴다(throw 하지 않음).
 *
 * actorNickname / actorAvatarUrl 은 호출부에서 getCurrentUser() 의 nickname/avatarUrl 을
 * 그대로 넘긴다 (Comment/Post 의 작성자 스냅샷 패턴 재사용).
 */
export async function createNotification(
  input: CreateNotificationInput,
): Promise<void> {
  // 자기 행위는 알림 대상 아님
  if (input.recipientId === input.actorId) return;

  try {
    await prisma.notification.create({
      data: {
        recipientId: input.recipientId,
        actorId: input.actorId,
        actorNickname: input.actorNickname,
        actorAvatarUrl: input.actorAvatarUrl,
        type: input.type,
        postId: input.postId ?? null,
        lessonRef: input.lessonRef ?? null,
        commentId: input.commentId ?? null,
        excerpt: input.excerpt ?? null,
      },
    });
  } catch (e) {
    // best-effort: 알림 생성 실패가 본래 액션(댓글/좋아요)을 깨지 않도록 삼킨다.
    console.error("[notifications] createNotification failed", e);
  }
}
