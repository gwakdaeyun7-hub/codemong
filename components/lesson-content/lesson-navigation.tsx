// 강의 상세(개념 탭) — 페이지 맨 아래 이전/다음 강의 네비게이션.
// previous/next 가 null 이면 해당 슬롯 비활성(visual hidden 자리만 차지).
// MVP에선 클릭 동작 X — button 으로 두고 disabled 처리. 추후 다음/이전 lesson 라우트로 교체.

import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"

import type { LessonNavigation as LessonNavData } from "@/lib/lesson-content"

export function LessonNavigation({
  navigation,
}: {
  navigation: LessonNavData
}) {
  return (
    <nav
      aria-label="강의 이동"
      className="rounded-2xl bg-white p-4 ring-1 ring-zinc-200/80 shadow-sm sm:p-5"
    >
      <div className="grid grid-cols-2 items-stretch gap-3">
        {/* 이전 — null 이면 visibility hidden 으로 자리만 유지 (그리드 정렬 깨짐 방지) */}
        {navigation.previous ? (
          <button
            type="button"
            disabled
            className="group inline-flex w-full items-center gap-2 rounded-xl bg-zinc-100 px-3 py-2.5 text-left text-zinc-600 disabled:cursor-not-allowed sm:px-4 sm:py-3"
          >
            <ChevronLeft
              className="size-4 shrink-0 text-zinc-500"
              strokeWidth={2.25}
              aria-hidden
            />
            <span className="min-w-0 flex-1">
              <span className="block text-[10px] font-semibold uppercase tracking-wide text-zinc-400">
                이전 강의
              </span>
              <span className="block truncate text-[12px] font-semibold text-zinc-700 sm:text-[13px]">
                {navigation.previous.number}. {navigation.previous.title}
              </span>
            </span>
          </button>
        ) : (
          <span aria-hidden className="invisible" />
        )}

        {/* 다음 — 보라 버튼 */}
        {navigation.next ? (
          <button
            type="button"
            disabled
            className={cn(
              "group inline-flex w-full items-center justify-end gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 px-3 py-2.5 text-right text-white shadow-sm",
              "disabled:cursor-not-allowed disabled:opacity-95",
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
        ) : (
          <span aria-hidden className="invisible" />
        )}
      </div>
    </nav>
  )
}
