// 무료 사용자 하루 AI 분석 한도 — 서버 전용.
// 별도 카운터 테이블 없이 ProblemSubmission 을 [userId, createdAt] 인덱스로 센다.
// skipped_* 는 실제 호출을 안 했으므로 차감하지 않는다.
// 두 탭 동시 제출 race 로 ±1 초과가 가능하지만 학습용이라 허용 (트랜잭션 잠금 불필요).

import { prisma } from "@/lib/prisma";
import { getAiDailyLimit } from "./config";

/** KST(UTC+9) 기준 오늘 00:00 을 UTC Date 로. 서버 타임존에 의존하지 않는다. */
export function kstStartOfToday(now: Date = new Date()): Date {
  const KST_OFFSET_MS = 9 * 60 * 60 * 1000;
  const kst = new Date(now.getTime() + KST_OFFSET_MS);
  const dayStartKst = Date.UTC(kst.getUTCFullYear(), kst.getUTCMonth(), kst.getUTCDate());
  return new Date(dayStartKst - KST_OFFSET_MS);
}

/** 오늘(KST) AI 호출로 이어진 제출 수 — pending(호출 직전 상태 포함)/ok/failed 만 센다. */
export async function countTodayAiCalls(userId: string): Promise<number> {
  return prisma.problemSubmission.count({
    where: {
      userId,
      createdAt: { gte: kstStartOfToday() },
      aiStatus: { in: ["pending", "ok", "failed"] },
    },
  });
}

/** 오늘 한도가 남아 있는지 */
export async function hasAiQuotaToday(userId: string): Promise<boolean> {
  const used = await countTodayAiCalls(userId);
  return used < getAiDailyLimit();
}
