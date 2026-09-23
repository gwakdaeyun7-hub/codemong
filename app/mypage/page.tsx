import { redirect } from "next/navigation";

import { GrowthReportCard } from "@/components/mypage/growth-report-card";
import { MasteryStatsCard } from "@/components/mypage/mastery-stats-card";
import { ProfileSummaryCard } from "@/components/mypage/profile-summary-card";
import { RecentActivityCard } from "@/components/mypage/recent-activity-card";
import { WeeklyReportCard } from "@/components/skill/weekly-report-card";
import { getCurrentUser } from "@/lib/auth/get-user";
import { getLearningStats, listRecentLessons } from "@/lib/learning/stats-queries";

export const metadata = { title: "마이페이지 · CodeMong" };

export default async function MypagePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/mypage");

  // 학습 현황·최근 학습 실데이터. courseId 는 홈/강의 목록과 같은 정식 id 사용.
  const [stats, recentLessons] = await Promise.all([
    getLearningStats("be-python", user.id),
    listRecentLessons("be-python", user.id),
  ]);

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">마이페이지</h1>
      </header>

      <ProfileSummaryCard user={user} />
      <MasteryStatsCard stats={stats} />
      <GrowthReportCard userId={user.id} />
      <WeeklyReportCard />
      <RecentActivityCard items={recentLessons} />
    </div>
  );
}
