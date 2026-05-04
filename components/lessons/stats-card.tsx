// 우측 사이드바 — 학습 통계 카드 (라벨/값 4줄).
// Server Component.

import { BarChart3 } from "lucide-react"

import { cn } from "@/lib/utils"

type Props = {
  completedCount: number
  inProgressCount: number
  notStartedCount: number
  /** 남은 강의들의 분 합 — 컴포넌트 내부에서 표기 변환 */
  remainingMinutes: number
}

export function StatsCard({
  completedCount,
  inProgressCount,
  notStartedCount,
  remainingMinutes,
}: Props) {
  return (
    <section className="rounded-2xl bg-white p-5 ring-1 ring-zinc-200/80 shadow-sm sm:p-6">
      <header className="mb-3 flex items-center gap-2 text-sm font-semibold text-zinc-900">
        <span
          aria-hidden
          className="inline-flex size-7 items-center justify-center rounded-full bg-violet-100 text-violet-600"
        >
          <BarChart3 className="size-3.5" strokeWidth={2.25} />
        </span>
        학습 통계
      </header>

      <dl className="flex flex-col divide-y divide-zinc-100">
        <Row label="완료한 강의" value={`${completedCount}개`} tone="text-emerald-600" />
        <Row label="진행중 강의" value={`${inProgressCount}개`} tone="text-orange-600" />
        <Row label="남은 강의" value={`${notStartedCount}개`} tone="text-zinc-500" />
        <Row label="예상 시간" value={formatMinutes(remainingMinutes)} tone="text-violet-600" />
      </dl>
    </section>
  )
}

function Row({
  label,
  value,
  tone,
}: {
  label: string
  value: string
  tone: string
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <dt className="text-xs text-zinc-600 sm:text-[13px]">{label}</dt>
      <dd className={cn("text-sm font-bold tabular-nums sm:text-[15px]", tone)}>
        {value}
      </dd>
    </div>
  )
}

/**
 * 분 → "약 N시간" / "N시간 N분" / "N분" 변환.
 * - 60분 미만: "N분"
 * - 60분 이상이고 정확히 시간 단위로 떨어지면: "약 N시간"
 * - 그 외: "N시간 N분"
 */
function formatMinutes(minutes: number): string {
  if (minutes <= 0) return "0분"
  if (minutes < 60) return `${minutes}분`
  const hours = Math.floor(minutes / 60)
  const remain = minutes % 60
  if (remain === 0) return `약 ${hours}시간`
  return `${hours}시간 ${remain}분`
}
