// 실력향상 대시보드 — 단원별 문제 은행 입구.
// Server Component. 비로그인 열람 가능 (해결 현황만 로그인 시 표시).
// 문제 세트가 있는 단원(현재 4~9강)만 카드로 노출한다.

import Link from "next/link";

import { SiteFooter } from "@/components/site-footer";
import { TopNav } from "@/components/top-nav";
import { ChevronRight } from "@/components/skill/icon-map";
import { DIFFICULTY_LABEL } from "@/components/skill/difficulty";
import { SkillRadarChart } from "@/components/mypage/skill-radar-chart";
import { WeeklyReportCard } from "@/components/skill/weekly-report-card";
import { getCurrentUser } from "@/lib/auth/get-user";
import { getSkillRadarDetail } from "@/lib/learning/skill-radar";
import { listProblemSets } from "@/lib/problems";
import { getCourseSolveStatuses } from "@/lib/skill/submission-queries";

export const metadata = { title: "실력향상 · CodeMong" };

export default async function SkillPage() {
  const user = await getCurrentUser();
  const sets = listProblemSets("be-python");
  const [{ byLesson }, radar] = await Promise.all([
    getCourseSolveStatuses("be-python", user?.id),
    user ? getSkillRadarDetail("be-python", user.id) : Promise.resolve(null),
  ]);

  return (
    <>
      <TopNav active="skill" />

      <main className="mx-auto w-full max-w-5xl flex-1 bg-zinc-50 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* 헤더 */}
        <header className="mb-5 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-zinc-200/80 sm:p-6">
          <p className="text-xs font-semibold tracking-wide text-violet-600">실력향상</p>
          <h1 className="mt-1 text-lg font-bold tracking-tight text-zinc-900 sm:text-xl">
            단원별 코드 작성 문제
          </h1>
          <p className="mt-1.5 text-[13px] leading-relaxed text-zinc-600 sm:text-sm">
            배운 단원의 문법으로 전체 코드를 직접 작성해 푸는 문제예요. 제출하면 공개 테스트와
            숨겨진 테스트로 자동 채점됩니다.
            {!user && " 로그인하면 제출과 해결 기록이 저장돼요."}
          </p>
        </header>

        {/* 종합 실력 레이더 (로그인 + 제출 표본 있을 때만) — 표시되는 값은 전부 실측 */}
        {user && radar && radar.meta.hasUserData && (
          <section className="mb-5 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-zinc-200/80 sm:p-6">
            <h2 className="text-sm font-bold text-zinc-900">내 실력 레이더</h2>
            <p className="mt-1 text-[12px] text-zinc-500">
              문제를 제출할 때마다 5개 축의 점수가 쌓여요. 같은 문제는 최신 제출 기준으로
              갱신됩니다.
            </p>
            <div className="mt-2">
              <SkillRadarChart points={radar.points} />
            </div>
            <div className="mt-1 flex items-center justify-center gap-5 text-xs">
              <span className="inline-flex items-center gap-1.5 text-zinc-600">
                <span className="inline-block size-2.5 rounded-sm bg-violet-500" />나
              </span>
              {radar.meta.averageLive && (
                <span className="inline-flex items-center gap-1.5 text-zinc-600">
                  <span className="inline-block size-2.5 rounded-sm bg-amber-500" />
                  전체 평균
                </span>
              )}
            </div>
            {!radar.meta.aiLive && (
              <p className="mt-2 text-center text-[11px] text-zinc-400">
                개념·효율·해석 축은 문제를 제출하면 AI 진단으로 측정돼요.
              </p>
            )}
          </section>
        )}

        {/* 주간 성장 리포트 (로그인 시) — 지난주 제출 기준, 열 때 생성 */}
        {user && (
          <div className="mb-5">
            <WeeklyReportCard />
          </div>
        )}

        {/* 단원 카드 */}
        <div className="grid gap-4 sm:grid-cols-2">
          {sets.map((set) => {
            const status = byLesson[set.lessonId];
            const counts = { easy: 0, medium: 0, hard: 0 };
            for (const p of set.problems) counts[p.difficulty] += 1;
            return (
              <Link
                key={set.lessonId}
                href={`/skill/${set.lessonId}`}
                className="group rounded-2xl bg-white p-5 shadow-sm ring-1 ring-zinc-200/80 transition hover:ring-violet-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 sm:p-6"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold tracking-wide text-violet-600">
                      {set.lessonNumber}강
                    </p>
                    <h2 className="mt-1 text-base font-bold text-zinc-900">{set.title}</h2>
                  </div>
                  <ChevronRight
                    className="mt-1 size-4 shrink-0 text-zinc-300 transition group-hover:text-violet-500"
                    strokeWidth={2.25}
                    aria-hidden
                  />
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[11px]">
                  {(["easy", "medium", "hard"] as const).map(
                    (d) =>
                      counts[d] > 0 && (
                        <span
                          key={d}
                          className="rounded-full bg-zinc-100 px-2 py-0.5 font-medium text-zinc-600"
                        >
                          {DIFFICULTY_LABEL[d]} {counts[d]}
                        </span>
                      ),
                  )}
                </div>

                {user && status && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-[12px]">
                      <span className="text-zinc-500">해결</span>
                      <span className="font-semibold text-zinc-700">
                        {status.solved}/{status.total}
                      </span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-zinc-100">
                      <div
                        className="h-full rounded-full bg-violet-500 transition-all"
                        style={{
                          width: `${status.total > 0 ? Math.round((status.solved / status.total) * 100) : 0}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
