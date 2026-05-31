"use server";

import { getCurrentUser } from "@/lib/auth/get-user";
import { prisma } from "@/lib/prisma";

/**
 * 현재 로그인 사용자의 안읽음 알림을 전부 읽음 처리(readAt = now).
 * 종 드롭다운을 열 때 호출한다("열 때 조회" 정책 — 폴링/Realtime 아님).
 *
 * 반환은 기존 액션 컨벤션({ ok }) 을 따른다. 미로그인이면 ok:false.
 */
export async function markNotificationsReadAction(): Promise<{ ok: boolean }> {
  const user = await getCurrentUser();
  if (!user) return { ok: false };

  try {
    await prisma.notification.updateMany({
      where: { recipientId: user.id, readAt: null },
      data: { readAt: new Date() },
    });
    return { ok: true };
  } catch (e) {
    console.error("[notifications] markNotificationsReadAction failed", e);
    return { ok: false };
  }
}
