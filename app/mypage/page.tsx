import { redirect } from "next/navigation";

import { MasteryStatsCard } from "@/components/mypage/mastery-stats-card";
import { ProfileSummaryCard } from "@/components/mypage/profile-summary-card";
import { RecentActivityCard } from "@/components/mypage/recent-activity-card";
import { getCurrentUser } from "@/lib/auth/get-user";

export const metadata = { title: "마이페이지 · CodeMong" };

export default async function MypagePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/mypage");

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          마이페이지
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          내 학습 현황과 프로필을 확인하세요.
        </p>
      </header>

      <ProfileSummaryCard user={user} />
      <MasteryStatsCard />
      <RecentActivityCard />
    </div>
  );
}
