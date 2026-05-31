// 강의 카드에 딸린 "코드 연습" 진입 하위 카드.
// 트리 하위항목처럼 들여쓴 자리에서 ↳ 분기로 읽히게 — "이 강에 딸린 세부항목".
// Server Component — 카드 전체가 연습 라우트로 가는 <Link>.

import Link from "next/link";
import { Check, ChevronRight, CornerDownRight, Pencil } from "lucide-react";

import { cn } from "@/lib/utils";

export function LessonPracticeLink({
  href,
  /** 연습 문제 수 — passedCount 없을 때 "N문제" 배지 */
  count,
  /** 통과한 문제 수 — 로그인 사용자에게만 전달. 있으면 "N/M 통과"(전부면 "완료 ✓") 배지 */
  passedCount,
}: {
  href: string;
  count: number;
  passedCount?: number;
}) {
  // passedCount 가 명시될 때만 통과 배지로 바꾼다 (비로그인이면 undefined → "N문제" 유지).
  const hasProgress = typeof passedCount === "number" && count > 0;
  const allDone = hasProgress && passedCount >= count;

  return (
    // 분기 아이콘 + 카드. 들여쓰기/상단 간격은 부모(LessonCard wrapper)가 책임진다.
    <div className="flex items-center gap-1.5 sm:gap-2">
      <CornerDownRight
        aria-hidden
        className="size-4 shrink-0 text-violet-400 sm:size-[18px]"
        strokeWidth={2.25}
      />
      <Link
        href={href}
        className="group/practice flex min-w-0 flex-1 items-center gap-2 rounded-xl bg-violet-50 px-3 py-2 ring-1 ring-violet-200 transition hover:bg-violet-100 hover:ring-violet-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 sm:px-3.5"
      >
        <span
          aria-hidden
          className="inline-flex size-6 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-600 sm:size-7"
        >
          <Pencil className="size-3.5 sm:size-4" strokeWidth={2.5} />
        </span>
        <span className="truncate text-xs font-semibold text-violet-800 sm:text-[13px]">
          코드 연습
        </span>
        {hasProgress ? (
          <span
            className={cn(
              "inline-flex shrink-0 items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-semibold tabular-nums sm:text-[11px]",
              allDone
                ? "bg-emerald-100 text-emerald-700"
                : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
            )}
          >
            {allDone ? (
              <>
                <Check className="size-3" strokeWidth={2.5} aria-hidden />
                완료
              </>
            ) : (
              `${passedCount}/${count} 통과`
            )}
          </span>
        ) : (
          <span className="inline-flex shrink-0 items-center rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-semibold text-violet-700 tabular-nums sm:text-[11px]">
            {count}문제
          </span>
        )}
        <ChevronRight
          aria-hidden
          className="ml-auto size-4 shrink-0 text-violet-400 transition group-hover/practice:translate-x-0.5 group-hover/practice:text-violet-600"
          strokeWidth={2.5}
        />
      </Link>
    </div>
  );
}
