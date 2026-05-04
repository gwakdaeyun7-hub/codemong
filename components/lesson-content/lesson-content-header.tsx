// 강의 상세(개념 탭) 본문 최상단 — 강의 번호+타이틀 + 시간 + 서브탭(개념/응용/시각자료).
// Server Component — 서브탭 활성 표시는 prop 으로 정적 결정 (MVP). 활성 외엔 시각적으로 disabled.

import { Clock } from "lucide-react"

import { cn } from "@/lib/utils"

import type { LessonSubtab } from "@/lib/lesson-content"

type Props = {
  lessonNumber: number
  title: string
  durationMinutes: number
  subtabs: LessonSubtab[]
  activeSubtab: LessonSubtab
}

export function LessonContentHeader({
  lessonNumber,
  title,
  durationMinutes,
  subtabs,
  activeSubtab,
}: Props) {
  return (
    <section className="rounded-2xl bg-white p-5 ring-1 ring-zinc-200/80 shadow-sm sm:p-6">
      {/* 타이틀 행 */}
      <div className="flex items-start justify-between gap-3">
        <h1 className="text-lg font-bold tracking-tight text-zinc-900 sm:text-xl">
          {lessonNumber}. {title}
        </h1>

        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-zinc-100 px-2.5 py-1 text-[11px] font-semibold text-zinc-600 sm:text-xs">
          <Clock className="size-3" strokeWidth={2.5} aria-hidden />
          {durationMinutes}분
        </span>
      </div>

      {/* 서브탭 행 */}
      <nav
        aria-label="강의 콘텐츠 서브탭"
        className="mt-3.5 -mx-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <ul role="tablist" className="flex gap-1.5 px-1">
          {subtabs.map((tab) => {
            const isActive = tab === activeSubtab
            return (
              <li key={tab}>
                <button
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  // MVP: 비활성 탭은 클릭 막아 학습 흐름 혼란 방지.
                  disabled={!isActive}
                  className={cn(
                    "inline-flex items-center rounded-full px-3.5 py-1.5 text-xs font-semibold transition",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500",
                    isActive
                      ? "bg-violet-600 text-white shadow-sm"
                      : "bg-zinc-100 text-zinc-400 cursor-not-allowed",
                  )}
                >
                  {tab}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>
    </section>
  )
}
