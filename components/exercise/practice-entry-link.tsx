// 강의 상세(영상 강의)에서 "이 강 연습 풀기" 진입 버튼.
// Server Component — practice 라우트로 가는 <Link>. 연습 데이터가 있을 때만 page 가 렌더한다.

import Link from "next/link";
import { Check, Pencil, ChevronRight } from "lucide-react";

export function PracticeEntryLink({
  href,
  exerciseCount,
  passedCount,
}: {
  /** practice 라우트 — `/courses/{courseId}/lessons/{lessonId}/practice` */
  href: string;
  /** 문제 수 (안내 문구용) */
  exerciseCount: number;
  /** 통과한 문제 수 — 로그인 사용자에게만 전달. 있으면 "N/M 통과" 배지, 전부 통과면 "완료" 강조 */
  passedCount?: number;
}) {
  // passedCount 가 명시될 때만 배지를 노출 (비로그인이면 undefined → 배지 없음).
  const hasProgress = typeof passedCount === "number" && exerciseCount > 0;
  const allDone = hasProgress && passedCount >= exerciseCount;

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
        <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="text-sm font-bold text-zinc-900 sm:text-[15px]">이 강 연습 풀기</span>
          {hasProgress &&
            (allDone ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                <Check className="size-3" strokeWidth={2.5} aria-hidden />
                완료
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-200 tabular-nums">
                {passedCount}/{exerciseCount} 통과
              </span>
            ))}
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
