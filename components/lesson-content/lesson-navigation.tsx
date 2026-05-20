// 강의 상세(개념 탭) — 페이지 맨 아래 이전/다음 강의 네비게이션.
// previous/next 가 null 이면 해당 슬롯 비활성(visual hidden 자리만 차지).
// href 가 null 이면 (= 해당 강의 콘텐츠 미등록) 회색 박스로 자리만 유지하고 클릭 불가.
// href 가 있으면 Link 로 실 라우팅.

import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"

import type { LessonNavigation as LessonNavData } from "@/lib/lesson-content"

export function LessonNavigation({
  navigation,
  previousHref,
  nextHref,
}: {
  navigation: LessonNavData
  /** 이전 강의 라우트. null 이면 navigation.previous 가 있어도 콘텐츠 미등록이라 비활성 처리. */
  previousHref: string | null
  /** 다음 강의 라우트. 동상. */
  nextHref: string | null
}) {
  return (
    <nav
      aria-label="강의 이동"
      className="rounded-2xl bg-white p-4 ring-1 ring-zinc-200/80 shadow-sm sm:p-5"
    >
      <div className="grid grid-cols-2 items-stretch gap-3">
        {/* 이전 */}
        {navigation.previous ? (
          previousHref ? (
            <Link
              href={previousHref}
              className="group inline-flex w-full items-center gap-2 rounded-xl bg-zinc-100 px-3 py-2.5 text-left text-zinc-700 transition hover:bg-zinc-200 hover:text-zinc-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 sm:px-4 sm:py-3"
            >
              <ChevronLeft
                className="size-4 shrink-0 text-zinc-500 transition group-hover:-translate-x-0.5 group-hover:text-zinc-700"
                strokeWidth={2.25}
                aria-hidden
              />
              <span className="min-w-0 flex-1">
                <span className="block text-[10px] font-semibold uppercase tracking-wide text-zinc-400">
                  이전 강의
                </span>
                <span className="block truncate text-[12px] font-semibold sm:text-[13px]">
                  {navigation.previous.number}. {navigation.previous.title}
                </span>
              </span>
            </Link>
          ) : (
            <button
              type="button"
              disabled
              aria-disabled
              title="아직 준비 중인 강의입니다"
              className="group inline-flex w-full items-center gap-2 rounded-xl bg-zinc-100 px-3 py-2.5 text-left text-zinc-500 opacity-60 disabled:cursor-not-allowed sm:px-4 sm:py-3"
            >
              <ChevronLeft className="size-4 shrink-0 text-zinc-400" strokeWidth={2.25} aria-hidden />
              <span className="min-w-0 flex-1">
                <span className="block text-[10px] font-semibold uppercase tracking-wide text-zinc-400">
                  이전 강의
                </span>
                <span className="block truncate text-[12px] font-semibold text-zinc-600 sm:text-[13px]">
                  {navigation.previous.number}. {navigation.previous.title}
                </span>
              </span>
            </button>
          )
        ) : (
          <span aria-hidden className="invisible" />
        )}

        {/* 다음 — 보라 버튼 */}
        {navigation.next ? (
          nextHref ? (
            <Link
              href={nextHref}
              className={cn(
                "group inline-flex w-full items-center justify-end gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 px-3 py-2.5 text-right text-white shadow-sm transition",
                "hover:from-violet-600 hover:to-purple-700 hover:shadow-md",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2",
                "sm:px-4 sm:py-3",
              )}
            >
              <span className="min-w-0 flex-1">
                <span className="block text-[10px] font-semibold uppercase tracking-wide text-white/70">
                  다음 강의
                </span>
                <span className="block truncate text-[12px] font-semibold sm:text-[13px]">
                  {navigation.next.number}. {navigation.next.title}
                </span>
              </span>
              <ChevronRight
                className="size-4 shrink-0 transition group-hover:translate-x-0.5"
                strokeWidth={2.25}
                aria-hidden
              />
            </Link>
          ) : (
            <button
              type="button"
              disabled
              aria-disabled
              title="아직 준비 중인 강의입니다"
              className={cn(
                "group inline-flex w-full items-center justify-end gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 px-3 py-2.5 text-right text-white shadow-sm",
                "disabled:cursor-not-allowed disabled:opacity-60",
                "sm:px-4 sm:py-3",
              )}
            >
              <span className="min-w-0 flex-1">
                <span className="block text-[10px] font-semibold uppercase tracking-wide text-white/70">
                  다음 강의
                </span>
                <span className="block truncate text-[12px] font-semibold sm:text-[13px]">
                  {navigation.next.number}. {navigation.next.title}
                </span>
              </span>
              <ChevronRight className="size-4 shrink-0" strokeWidth={2.25} aria-hidden />
            </button>
          )
        ) : (
          <span aria-hidden className="invisible" />
        )}
      </div>
    </nav>
  )
}
