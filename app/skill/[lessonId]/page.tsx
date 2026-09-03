// 실력향상 단원 페이지 — 문제 목록.
// Server Component. 비로그인 열람 가능 (해결 배지만 로그인 시 표시).

import Link from "next/link";
import { notFound } from "next/navigation";

import { SiteFooter } from "@/components/site-footer";
import { TopNav } from "@/components/top-nav";
import { ArrowLeft, Check, ChevronRight } from "@/components/skill/icon-map";
import { DIFFICULTY_CHIP_CLASS, DIFFICULTY_LABEL } from "@/components/skill/difficulty";
import { SkillRadarChart } from "@/components/mypage/skill-radar-chart";
import { getCurrentUser } from "@/lib/auth/get-user";
import { getLessonSkillRadar } from "@/lib/learning/skill-radar";
import { getProblemSet } from "@/lib/problems";
import { getCourseSolveStatuses } from "@/lib/skill/submission-queries";
import { cn } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await params;
  const set = getProblemSet("be-python", lessonId);
  return {
    title: set ? `${set.lessonNumber}강 ${set.title} 문제 · CodeMong` : "실력향상 · CodeMong",
  };
}

export default async function SkillLessonPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = await params;
  const set = getProblemSet("be-python", lessonId);
  if (!set) {
    notFound();
  }

  const user = await getCurrentUser();
  const [{ byLesson, solvedProblems }, lessonRadar] = await Promise.all([
    getCourseSolveStatuses("be-python", user?.id),
    getLessonSkillRadar("be-python", set.lessonId, user?.id ?? null),
  ]);
  const status = byLesson[set.lessonId];

  return (
    <>
      <TopNav active="skill" />

      <main className="mx-auto w-full max-w-3xl flex-1 bg-zinc-50 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <Link
          href="/skill"
          className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-zinc-500 transition hover:text-zinc-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
        >
          <ArrowLeft className="size-4" strokeWidth={2.25} aria-hidden />
          실력향상으로 돌아가기
        </Link>

        {/* 헤더 */}
        <header className="mb-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-zinc-200/80 sm:mb-5 sm:p-6">
          <p className="text-xs font-semibold tracking-wide text-violet-600">
            {set.lessonNumber}강 · 문제 {set.problems.length}개
          </p>
          <h1 className="mt-1 text-lg font-bold tracking-tight text-zinc-900 sm:text-xl">
            {set.title}
          </h1>
          <p className="mt-1.5 text-[13px] leading-relaxed text-zinc-600 sm:text-sm">
            이 단원까지 배운 문법만으로 풀 수 있는 문제들이에요.
            {user && status ? ` 지금까지 ${status.solved}/${status.total}문제를 해결했어요.` : ""}
          </p>
        </header>

        {/* 단원 실력 레이더 — 이 단원 제출이 있을 때만 (문제당 최신 제출 기준) */}
        {lessonRadar && (
          <section className="mb-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-zinc-200/80 sm:mb-5 sm:p-6">
            <h2 className="text-sm font-bold text-zinc-900">이 단원 실력 레이더</h2>
            <p className="mt-1 text-[12px] text-zinc-500">
              이 단원 문제 제출만으로 계산한 5축이에요. 같은 문제는 최신 제출 기준으로 갱신됩니다.
            </p>
            <div className="mt-2">
              <SkillRadarChart points={lessonRadar.points} />
            </div>
            <div className="mt-1 flex items-center justify-center gap-5 text-xs">
              <span className="inline-flex items-center gap-1.5 text-zinc-600">
                <span className="inline-block size-2.5 rounded-sm bg-violet-500" />나
              </span>
              {lessonRadar.meta.averageLive && (
                <span className="inline-flex items-center gap-1.5 text-zinc-600">
                  <span className="inline-block size-2.5 rounded-sm bg-amber-500" />
                  전체 평균
                </span>
              )}
            </div>
          </section>
        )}

        {/* 문제 목록 */}
        <ul className="flex flex-col gap-2">
          {set.problems.map((p) => {
            const solved = Boolean(solvedProblems[`${set.lessonId}/${p.id}`]);
            return (
              <li key={p.id}>
                <Link
                  href={`/skill/${set.lessonId}/${p.id}`}
                  className="group flex items-center gap-3 rounded-2xl bg-white px-4 py-3.5 shadow-sm ring-1 ring-zinc-200/80 transition hover:ring-violet-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 sm:px-5"
                >
                  <span
                    className={cn(
                      "inline-flex size-7 shrink-0 items-center justify-center rounded-full text-[12px] font-bold",
                      solved ? "bg-emerald-100 text-emerald-700" : "bg-zinc-100 text-zinc-500",
                    )}
                    aria-hidden
                  >
                    {solved ? <Check className="size-3.5" strokeWidth={2.5} /> : p.number}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14px] font-semibold text-zinc-900">
                      {p.title}
                    </span>
                    {solved && (
                      <span className="text-[11px] font-medium text-emerald-600">해결</span>
                    )}
                  </span>
                  <span
                    className={cn(
                      "shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold",
                      DIFFICULTY_CHIP_CLASS[p.difficulty],
                    )}
                  >
                    {DIFFICULTY_LABEL[p.difficulty]}
                  </span>
                  <ChevronRight
                    className="size-4 shrink-0 text-zinc-300 transition group-hover:text-violet-500"
                    strokeWidth={2.25}
                    aria-hidden
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </main>

      <SiteFooter />
    </>
  );
}
