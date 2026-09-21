import { redirect } from "next/navigation";

import { WeeklyReportCard } from "@/components/skill/weekly-report-card";
import {
  WeeklyActivitySection,
  WeeklyProblemsSection,
  WeeklyTagsSection,
} from "@/components/mypage/weekly-dashboard";
import { getCurrentUser } from "@/lib/auth/get-user";
import { getWeeklyDashboard } from "@/lib/skill/weekly-dashboard-queries";
import { kstWeekStartDate } from "@/lib/skill/weekly-report-queries";

export const metadata = { title: "주간 성장 리포트 · CodeMong" };

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

function koDate(key: string): string {
  const [, m, d] = key.split("-").map(Number);
  return `${m}월 ${d}일`;
}

// 주간 리포트 대시보드 — 지난주(KST 월~일) 활동을 한 화면에.
// 맨 위 히어로 = WeeklyReportCard(full): 미니 레이더(전주 vs 지난주)·축별 점수·AI 코멘트 — "열 때 생성" 액션.
// 그 아래 활동·푼 문제·오류 태그는 서버 집계(getWeeklyDashboard, 읽기 전용).
// 카드(/skill·/mypage)는 요약만 보여주고 이 페이지로 링크한다.
export default async function WeeklyReportPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/mypage/weekly");

  const lastWeek = new Date(kstWeekStartDate().getTime() - WEEK_MS);
  const data = await getWeeklyDashboard(user.id, lastWeek);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">주간 성장 리포트</h1>
        <p className="mt-1 text-sm text-zinc-500">
          지난주 {koDate(data.weekStart)} ~ {koDate(data.weekEnd)} 학습을 돌아봐요. 리포트는 매주
          월요일 이후 이 화면을 열 때 만들어집니다.
        </p>
      </header>

      {!data.hasActivity && (
        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-zinc-200/80 sm:p-6">
          <p className="text-[13px] leading-relaxed text-zinc-500">
            지난주에는 학습 기록이 없어요. 이번 주에 강의를 보거나 문제를 풀면 다음 주에 리포트가
            채워집니다.
          </p>
        </section>
      )}

      <WeeklyReportCard variant="full" />

      <WeeklyActivitySection data={data} />

      <WeeklyProblemsSection data={data} />

      <WeeklyTagsSection data={data} />
    </div>
  );
}
