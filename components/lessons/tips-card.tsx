// 우측 사이드바 — 학습 팁 카드 (옅은 노랑 배경).
// Server Component.

import { Lightbulb } from "lucide-react"

export function TipsCard({ tips }: { tips: string[] }) {
  return (
    <section className="rounded-2xl bg-amber-50 p-5 ring-1 ring-amber-100 shadow-sm sm:p-6">
      <header className="mb-3 flex items-center gap-2 text-sm font-semibold text-amber-900">
        <span
          aria-hidden
          className="inline-flex size-7 items-center justify-center rounded-full bg-amber-200 text-amber-700"
        >
          <Lightbulb className="size-3.5" strokeWidth={2.25} />
        </span>
        학습 팁
      </header>

      <ul className="flex flex-col gap-1.5">
        {tips.map((tip) => (
          <li
            key={tip}
            className="flex items-start gap-2 text-xs leading-relaxed text-amber-900/85 sm:text-[13px]"
          >
            <span aria-hidden className="mt-1.5 size-1 shrink-0 rounded-full bg-amber-500" />
            <span>{tip}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
