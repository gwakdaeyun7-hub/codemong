// 강의 상세(개념 탭) — 핵심 포인트 정리 카드.
// 각 포인트는 tone 별 옅은 박스 + 좌측 컬러 dot.
// Server Component.

import { Sparkles } from "lucide-react"

import { resolveContentTone } from "@/components/lesson-content/icon-map"
import { cn } from "@/lib/utils"

import type { KeyPoint } from "@/lib/lesson-content"

export function KeyPointsCard({ points }: { points: KeyPoint[] }) {
  return (
    <section className="rounded-2xl bg-white p-5 ring-1 ring-zinc-200/80 shadow-sm sm:p-6">
      <header className="mb-4 flex items-center gap-2.5">
        <span
          aria-hidden
          className="inline-flex size-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600"
        >
          <Sparkles className="size-4" strokeWidth={2.25} />
        </span>
        <h2 className="text-[15px] font-bold text-zinc-900 sm:text-base">
          핵심 포인트 정리
        </h2>
      </header>

      <ul className="flex flex-col gap-2.5">
        {points.map((p, i) => {
          const tone = resolveContentTone(p.tone)
          return (
            <li
              key={i}
              className={cn(
                "flex items-start gap-3 rounded-xl px-3.5 py-3 ring-1",
                tone.softBg,
                tone.softRing,
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "mt-1.5 inline-block size-2 shrink-0 rounded-full",
                  tone.dot,
                )}
              />
              <span className="text-[13px] font-medium leading-relaxed text-zinc-800 sm:text-sm">
                {p.text}
              </span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
