// "이 과정에서 배우는 것" 카드.
// Server Component.

import { Target } from "lucide-react"

import { SectionCard } from "@/components/course-detail/section-card"
import { resolveDetailIcon } from "@/components/course-detail/icon-map"

import type { LearningOutcome } from "@/lib/course-detail"

// 항목별로 살짝씩 다른 컬러 톤을 줘서 시각적으로 단조롭지 않게 함.
// (의미 색이 아닌 "강세 다양성" 용도이므로 a11y엔 영향 없음)
const TONE_CYCLE = [
  "bg-rose-100 text-rose-600",
  "bg-amber-100 text-amber-600",
  "bg-yellow-100 text-yellow-600",
  "bg-zinc-200 text-zinc-700",
  "bg-violet-100 text-violet-600",
  "bg-emerald-100 text-emerald-600",
]

export function LearningOutcomesCard({
  outcomes,
}: {
  outcomes: LearningOutcome[]
}) {
  return (
    <SectionCard
      title="이 과정에서 배우는 것"
      icon={Target}
      tone="bg-violet-100 text-violet-600"
    >
      <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {outcomes.map((o, i) => {
          const Icon = resolveDetailIcon(o.iconHint)
          const tone = TONE_CYCLE[i % TONE_CYCLE.length]
          return (
            <li
              key={o.text}
              className="flex items-center gap-2.5 rounded-xl bg-violet-50/60 px-3 py-2.5 ring-1 ring-violet-100/60"
            >
              <span
                aria-hidden
                className={`inline-flex size-7 shrink-0 items-center justify-center rounded-lg ${tone}`}
              >
                <Icon className="size-3.5" strokeWidth={2.5} />
              </span>
              <span className="text-[13px] font-medium text-zinc-800">
                {o.text}
              </span>
            </li>
          )
        })}
      </ul>
    </SectionCard>
  )
}
