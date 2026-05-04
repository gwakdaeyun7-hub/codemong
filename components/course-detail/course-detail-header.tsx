// 강좌 상세 페이지 최상단 헤더 카드.
// Server Component — 인터랙션 없음.

import { BookOpen, Clock, Star, Users } from "lucide-react"

import { CourseIcon } from "@/components/course-icon"
import { LevelBadge } from "@/components/level-badge"

import type { CourseDetailStat } from "@/lib/course-detail"
import type { Course, CourseLevel } from "@/lib/courses"

type Props = {
  title: string
  description: string
  level: CourseLevel
  stats: CourseDetailStat
  icon: Course["icon"]
}

export function CourseDetailHeader({
  title,
  description,
  level,
  stats,
  icon,
}: Props) {
  return (
    <section className="rounded-2xl bg-white p-6 ring-1 ring-zinc-200/80 shadow-sm sm:p-8">
      {/* 큰 아이콘 박스 (중앙 정렬) */}
      <div className="flex justify-center">
        <CourseIcon
          glyph={icon.glyph}
          tone={icon.tone}
          className="size-16 rounded-2xl"
        />
      </div>

      {/* 타이틀 + 난이도 배지 */}
      <div className="mt-4 flex items-center justify-center gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-[28px]">
          {title}
        </h1>
        <LevelBadge level={level} />
      </div>

      {/* 설명 */}
      <p className="mt-2 text-center text-sm text-zinc-500">{description}</p>

      {/* 4개 스탯 그리드 */}
      <dl className="mt-6 grid grid-cols-2 gap-3 border-t border-zinc-100 pt-6 sm:mt-8 sm:grid-cols-4 sm:gap-4 sm:pt-8">
        <Stat
          icon={<Clock className="size-4" strokeWidth={2.25} />}
          tone="bg-rose-50 text-rose-500"
          value={stats.totalHours}
          label="총 학습 시간"
        />
        <Stat
          icon={<BookOpen className="size-4" strokeWidth={2.25} />}
          tone="bg-violet-50 text-violet-500"
          value={stats.totalLessons}
          label="강의 수"
        />
        <Stat
          icon={<Users className="size-4" strokeWidth={2.25} />}
          tone="bg-emerald-50 text-emerald-500"
          value={stats.enrolledCount}
          label="수강생"
        />
        <Stat
          icon={<Star className="size-4" strokeWidth={2.25} />}
          tone="bg-amber-50 text-amber-500"
          value={stats.rating}
          label="평점"
        />
      </dl>
    </section>
  )
}

function Stat({
  icon,
  tone,
  value,
  label,
}: {
  icon: React.ReactNode
  tone: string
  value: string
  label: string
}) {
  return (
    <div className="flex flex-col items-center gap-1.5 text-center">
      <span
        aria-hidden
        className={`inline-flex size-8 items-center justify-center rounded-lg ${tone}`}
      >
        {icon}
      </span>
      <dd className="text-[15px] font-bold text-zinc-900 sm:text-base">
        {value}
      </dd>
      <dt className="text-[11px] text-zinc-500 sm:text-xs">{label}</dt>
    </div>
  )
}
