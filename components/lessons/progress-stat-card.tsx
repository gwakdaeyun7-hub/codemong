// 우측 사이드바 — 학습 진행도 (보라 그라데이션 카드).
// Server Component.

import { BarChart3 } from "lucide-react"

type Props = {
  /** 0~100 정수 */
  percent: number
  completedCount: number
  remainingCount: number
}

export function ProgressStatCard({
  percent,
  completedCount,
  remainingCount,
}: Props) {
  const safePercent = Math.max(0, Math.min(100, percent))
  return (
    <section className="rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 p-5 text-white shadow-sm ring-1 ring-violet-400/30 sm:p-6">
      <header className="flex items-center gap-2 text-sm font-semibold text-white/90">
        <BarChart3 className="size-4" strokeWidth={2.25} aria-hidden />
        학습 진행도
      </header>

      <p className="mt-2 text-4xl font-extrabold tracking-tight tabular-nums sm:text-[44px]">
        {safePercent}%
      </p>

      <div
        role="progressbar"
        aria-valuenow={safePercent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`전체 진행률 ${safePercent}%`}
        className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/25"
      >
        <div
          className="h-full rounded-full bg-white transition-[width] duration-500"
          style={{ width: `${safePercent}%` }}
        />
      </div>

      <p className="mt-2 text-xs text-white/80">
        {completedCount}개 완료 · {remainingCount}개 남음
      </p>
    </section>
  )
}
