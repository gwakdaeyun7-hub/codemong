// 실력향상 문제 페이지 — 프로그래머스식 2-pane (좌 지문 / 우 다크 에디터) + 내 제출 히스토리.
// Server Component — 데이터 룩업 + 화면 조립. 인터랙션은 leaf(ProblemRunner)로 한정.
// 로그인 필수 — 제출 기록을 저장하므로 (practice 페이지와 동일한 redirect 패턴).

import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { SiteFooter } from "@/components/site-footer";
import { TopNav } from "@/components/top-nav";
import { ArrowLeft } from "@/components/skill/icon-map";
import { ProblemRunner } from "@/components/skill/problem-runner";
import {
  SubmissionHistory,
  type SubmissionHistoryItem,
} from "@/components/skill/submission-history";
import { getCurrentUser } from "@/lib/auth/get-user";
import { getProblem, getProblemSet, toClientProblem } from "@/lib/problems";
import { listMySubmissions } from "@/lib/skill/submission-queries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lessonId: string; problemId: string }>;
}) {
  const { lessonId, problemId } = await params;
  const problem = getProblem("be-python", lessonId, problemId);
  return { title: problem ? `${problem.title} · 실력향상 · CodeMong` : "실력향상 · CodeMong" };
}

export default async function SkillProblemPage({
  params,
}: {
  params: Promise<{ lessonId: string; problemId: string }>;
}) {
  const { lessonId, problemId } = await params;

  const set = getProblemSet("be-python", lessonId);
  const problem = set?.problems.find((p) => p.id === problemId);
  if (!set || !problem) {
    notFound();
  }

  // 제출 기록 저장이 있으므로 로그인 필수.
  const user = await getCurrentUser();
  if (!user) {
    redirect(`/login?next=${encodeURIComponent(`/skill/${lessonId}/${problemId}`)}`);
  }

  // lessonRef 는 데이터 정식 courseId("be-python") 기준 — 제출/조회 모두 같은 키를 쓴다.
  const lessonRef = `${set.courseId}/${set.lessonId}`;
  const submissions = await listMySubmissions(lessonRef, problem.id, user.id);
  const historyItems: SubmissionHistoryItem[] = submissions.map((s) => ({
    id: s.id,
    passed: s.passed,
    errorType: s.errorType,
    casesPassed: s.casesPassed,
    casesTotal: s.casesTotal,
    code: s.code,
    aiStatus: s.aiStatus,
    conceptScore: s.conceptScore,
    efficiencyScore: s.efficiencyScore,
    interpretationScore: s.interpretationScore,
    aiFeedback: s.aiFeedback,
    createdAt: s.createdAt.toISOString(),
  }));
  const initialSolved = submissions.some((s) => s.passed);

  return (
    <>
      <TopNav active="skill" />

      <main className="mx-auto w-full max-w-7xl flex-1 bg-zinc-50 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <Link
          href={`/skill/${set.lessonId}`}
          className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-zinc-500 transition hover:text-zinc-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
        >
          <ArrowLeft className="size-4" strokeWidth={2.25} aria-hidden />
          {set.lessonNumber}강 문제 목록
        </Link>

        <ProblemRunner
          problem={toClientProblem(problem)}
          lessonRef={lessonRef}
          initialSolved={initialSolved}
        />

        <div className="mt-4">
          <SubmissionHistory items={historyItems} />
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
