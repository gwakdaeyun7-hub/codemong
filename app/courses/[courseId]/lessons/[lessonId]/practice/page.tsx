// 강별 코드 연습 문제 화면.
// Server Component — 데이터 룩업 + 화면 조립. 인터랙션은 leaf(ExerciseRunner)로 한정.
//
// 라우팅: /courses/[courseId]/lessons/[lessonId]/practice
//   - getExercises(courseId, lessonId) 가 없으면 notFound()
//   - 로그인 필수 — 통과 기록을 저장하므로 (영상 상세 page.tsx 와 동일한 redirect 패턴).
//   - 로그인 시 getExerciseProgress 로 초기 통과 상태를 조회해 ExerciseRunner 에 넘긴다.

import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { ExerciseRunner } from "@/components/exercise/exercise-runner";
import { TopNav } from "@/components/top-nav";
import { getCurrentUser } from "@/lib/auth/get-user";
import { getExercises } from "@/lib/exercise-content";
import { getExerciseProgress } from "@/lib/learning/exercise-queries";

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

  // 통과 기록 저장이 있으므로 로그인 필수 — 비로그인은 로그인 후 이 연습으로 돌아오게 한다.
  const user = await getCurrentUser();
  if (!user) {
    redirect(
      `/login?next=${encodeURIComponent(`/courses/${courseId}/lessons/${lessonId}/practice`)}`,
    );
  }

  const lessonRef = `${courseId}/${lessonId}`;
  const { passed } = await getExerciseProgress(lessonRef, user.id);

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

        <ExerciseRunner set={set} lessonRef={lessonRef} initialPassed={passed} />
      </main>
    </>
  );
}
