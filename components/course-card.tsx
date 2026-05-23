import Link from "next/link"
import { Check, Play } from "lucide-react"

import { CourseIcon } from "@/components/course-icon"
import { LevelBadge } from "@/components/level-badge"
import { StatusBadge } from "@/components/status-badge"
import { cn } from "@/lib/utils"

import type { Course, CourseStatus } from "@/lib/courses"

// 카드 하단 액션 — status 기반으로 라벨/색상이 달라짐.
// 모든 status 에서 강좌 상세 페이지(`/courses/{id}`)로 이동.
function CardAction({
  status,
  courseId,
  title,
}: {
  status: CourseStatus
  courseId: string
  title: string
}) {
  const href = `/courses/${courseId}`

  if (status === "done") {
    return (
      <Link
        href={href}
        aria-label={`${title} 다시보기`}
        className="inline-flex items-center gap-1 rounded-md border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
      >
        <Check className="size-3" strokeWidth={3} />
        다시보기
      </Link>
    )
  }

  if (status === "not-started") {
    return (
      <Link
        href={href}
        aria-label={`${title} 시작하기`}
        className="inline-flex items-center gap-1 rounded-md bg-zinc-900 px-2.5 py-1 text-xs font-semibold text-white transition hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
      >
        <Play className="size-3 fill-white" strokeWidth={0} />
        시작하기
      </Link>
    )
  }

  // in-progress
  return (
    <Link
      href={href}
      aria-label={`${title} 이어가기`}
      className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-2.5 py-1 text-xs font-semibold text-white transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <Play className="size-3 fill-white" strokeWidth={0} />
      이어가기
    </Link>
  )
}

export function CourseCard({ course }: { course: Course }) {
  const { status, level, progress, icon, title, description } = course
  const ratio =
    progress.total === 0 ? 0 : Math.min(100, (progress.current / progress.total) * 100)

  // 미시작 카드는 약간 디저챠된 톤 (이미지의 Next.js 카드 참고)
  const isMuted = status === "not-started"
  // 완료 진행률은 초록, 그 외엔 보라 그라데이션
  const barFill =
    status === "done"
      ? "bg-emerald-500"
      : "bg-gradient-to-r from-violet-500 to-purple-500"

  return (
    <article
      className={cn(
        "flex flex-col gap-3 rounded-2xl bg-white p-4 ring-1 ring-zinc-200/80 shadow-sm transition hover:shadow-md",
        isMuted && "bg-zinc-50/60",
      )}
    >
      {/* 상단: 아이콘 + 타이틀 + 상태 배지 */}
      <header className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2.5">
          <CourseIcon glyph={icon.glyph} tone={icon.tone} />
          <h3
            className={cn(
              "truncate text-[15px] font-bold text-zinc-900",
              isMuted && "text-zinc-500",
            )}
          >
            {title}
          </h3>
        </div>
        <StatusBadge status={status} />
      </header>

      {/* 난이도 배지 */}
      <div>
        <LevelBadge level={level} />
      </div>

      {/* 설명 */}
      <p className="text-xs leading-relaxed text-zinc-500">{description}</p>

      {/* 진행률 영역 */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-[11px] text-zinc-500">
          <span>학습 현황</span>
          <span className="font-medium text-zinc-700">
            {progress.current}/{progress.total}
          </span>
        </div>
        <div
          className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={progress.total}
          aria-valuenow={progress.current}
          aria-label={`${title} 진행률`}
        >
          <div
            className={cn("h-full rounded-full transition-all", barFill)}
            style={{ width: `${ratio}%` }}
          />
        </div>
      </div>

      {/* 푸터: 이수율 라벨 + 액션 버튼 */}
      <footer className="flex items-center justify-between pt-1">
        <span className="text-[11px] text-zinc-500">이수율 {Math.round(ratio)}%</span>
        <CardAction status={status} courseId={course.id} title={title} />
      </footer>
    </article>
  )
}
