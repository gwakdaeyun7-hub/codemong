// 강별 코드 연습 문제 화면.
// Server Component — 데이터 룩업 + 화면 조립. 인터랙션은 leaf(ExerciseRunner)로 한정.
//
// 라우팅: /courses/[courseId]/lessons/[lessonId]/practice
//   - getExercises(courseId, lessonId) 가 없으면 notFound()
//   - 로그인 게이팅 없음 — 이번 라운드는 진행 저장이 없어 비로그인도 풀 수 있다.
//     (영상 상세 page.tsx 의 로그인 redirect 는 여기엔 적용하지 않는다.)

import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { ExerciseRunner } from "@/components/exercise/exercise-runner";
import { TopNav } from "@/components/top-nav";
import { getExercises } from "@/lib/exercise-content";

export default async function LessonPracticePage({
  params,
}: {
  params: Promise<{ courseId: string; lessonId: string }>;
}) {
  const { courseId, lessonId } = await params;

  const set = getExercises(courseId, lessonId);
  if (!set) {
    notFound();
  }

  const lessonHref = `/courses/${courseId}/lessons/${lessonId}`;

  return (
    <>
      <TopNav active="study" />

      <main className="mx-auto w-full max-w-3xl flex-1 bg-zinc-50 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* 강의 상세로 돌아가기 */}
        <Link
          href={lessonHref}
          className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-zinc-500 transition hover:text-zinc-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
        >
          <ArrowLeft className="size-4" strokeWidth={2.25} aria-hidden />
          강의로 돌아가기
        </Link>

        {/* 헤더 */}
        <header className="mb-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-zinc-200/80 sm:mb-5 sm:p-6">
          <p className="text-xs font-semibold tracking-wide text-violet-600">
            {set.lessonNumber}강 · 연습
          </p>
          <h1 className="mt-1 text-lg font-bold tracking-tight text-zinc-900 sm:text-xl">
            {set.title}
          </h1>
          <p className="mt-1.5 text-[13px] leading-relaxed text-zinc-600 sm:text-sm">
            이 강에서 배운 문법으로 푸는 코딩 연습 문제예요. 코드를 직접 작성하고 제출하면 자동으로
            채점됩니다.
          </p>
        </header>

        <ExerciseRunner set={set} />
      </main>
    </>
  );
}
