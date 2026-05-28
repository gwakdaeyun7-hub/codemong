// 강의 상세(영상 강의)에서 "이 강 연습 풀기" 진입 버튼.
// Server Component — practice 라우트로 가는 <Link>. 연습 데이터가 있을 때만 page 가 렌더한다.

import Link from "next/link";
import { Pencil, ChevronRight } from "lucide-react";

export function PracticeEntryLink({
  href,
  exerciseCount,
}: {
  /** practice 라우트 — `/courses/{courseId}/lessons/{lessonId}/practice` */
  href: string;
  /** 문제 수 (안내 문구용) */
  exerciseCount: number;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-violet-200/80 transition hover:ring-violet-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 sm:p-5"
    >
      <span
        aria-hidden
        className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600"
      >
        <Pencil className="size-5" strokeWidth={2.25} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-bold text-zinc-900 sm:text-[15px]">
          이 강 연습 풀기
        </span>
        <span className="mt-0.5 block text-[12px] leading-relaxed text-zinc-500 sm:text-[13px]">
          배운 문법으로 코드 연습 문제 {exerciseCount}개를 직접 풀어보세요.
        </span>
      </span>
      <ChevronRight
        className="size-5 shrink-0 text-violet-400 transition group-hover:translate-x-0.5 group-hover:text-violet-600"
        strokeWidth={2.25}
        aria-hidden
      />
    </Link>
  );
}
