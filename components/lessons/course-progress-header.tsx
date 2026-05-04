// 강의 목록 화면 좌측 상단 — 강좌 헤더 카드.
// Server Component — 인터랙션 없음. 진행률 progress bar 포함.

import { BookOpen, Clock, TrendingUp } from "lucide-react"

import { CourseIcon } from "@/components/course-icon"
import { LevelBadge } from "@/components/level-badge"

import type { Course, CourseLevel } from "@/lib/courses"

type Props = {
  title: string
  description: string
  level: CourseLevel
  icon: Course["icon"]
  /** 완료한 강의 수 */
  completedCount: number
  /** 전체 강의 수 */
  totalCount: number
  /** 누적 학습 시간 (예: "약 10시간") */
  totalHours: string
}

export function CourseProgressHeader({
  title,
  description,
  level,
  icon,
  completedCount,
  totalCount,
  totalHours,
}: Props) {
  // 진행률은 화면에서 0~100 정수로 노출. 소수점 버림.
  const progressPercent =
    totalCount > 0 ? Math.floor((completedCount / totalCount) * 100) : 0

  return (
    <section className="rounded-2xl bg-white p-5 ring-1 ring-zinc-200/80 shadow-sm sm:p-6">
      {/* 상단: 아이콘 + 타이틀 + 설명 */}
      <div className="flex items-start gap-3 sm:gap-4">
        <CourseIcon
          glyph={icon.glyph}
          tone={icon.tone}
          className="size-12 rounded-xl sm:size-14"
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-lg font-bold tracking-tight text-zinc-900 sm:text-xl">
              {title}
            </h1>
            <LevelBadge level={level} />
          </div>
          <p className="mt-1 text-xs text-zinc-500 sm:text-sm">{description}</p>
        </div>
      </div>

      {/* 통계 가로 배치 */}
      <dl className="mt-5 grid grid-cols-3 gap-3 sm:gap-4">
        <Stat
          icon={<BookOpen className="size-3.5" strokeWidth={2.25} />}
          value={`${completedCount}/${totalCount}`}
          label="단원별 강의"
          tone="text-amber-500"
        />
        <Stat
          icon={<Clock className="size-3.5" strokeWidth={2.25} />}
          value={totalHours}
          label="누적 시간"
          tone="text-violet-500"
        />
        <Stat
          icon={<TrendingUp className="size-3.5" strokeWidth={2.25} />}
          value={`${progressPercent}%`}
          label="진행률"
          tone="text-emerald-500"
        />
      </dl>

      {/* 진행률 progress bar */}
      <div className="mt-4">
        <div
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`강좌 진행률 ${progressPercent}%`}
          className="h-2 w-full overflow-hidden rounded-full bg-zinc-100"
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-600 transition-[width] duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </section>
  )
}

function Stat({
  icon,
  value,
  label,
  tone,
}: {
  icon: React.ReactNode
  value: string
  label: string
  tone: string
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center gap-1.5">
        <span aria-hidden className={tone}>
          {icon}
        </span>
        <dd className="text-sm font-bold text-zinc-900 sm:text-[15px]">
          {value}
        </dd>
      </div>
      <dt className="text-[11px] text-zinc-500 sm:text-xs">{label}</dt>
    </div>
  )
}
