// 강의 카드 1건. status 별로 색/아이콘/액션 버튼이 달라짐.
// Server Component — 액션 버튼은 강의 상세 라우트로 가는 <Link>.

import Link from "next/link"
import { CheckCircle2, Circle, Clock, Flame, Play, RotateCcw } from "lucide-react"

import { cn } from "@/lib/utils"

import type { Lesson, LessonStatus } from "@/lib/lesson-plan"

const STATUS_LABEL: Record<LessonStatus, string> = {
  completed: "완료",
  "in-progress": "진행중",
  "not-started": "미시작",
}

// 카드 배경 / 링 / 텍스트 톤
const STATUS_CARD_TONE: Record<LessonStatus, string> = {
  completed: "bg-emerald-50/60 ring-emerald-100",
  "in-progress": "bg-orange-50/60 ring-orange-100",
  "not-started": "bg-zinc-50/60 ring-zinc-200",
}

// 좌측 동그라미 아이콘 톤
const STATUS_ICON_TONE: Record<LessonStatus, string> = {
  completed: "bg-emerald-100 text-emerald-600",
  "in-progress": "bg-orange-100 text-orange-600",
  "not-started": "bg-zinc-100 text-zinc-400",
}

// 상태 pill 톤
const STATUS_PILL_TONE: Record<LessonStatus, string> = {
  completed: "bg-emerald-100 text-emerald-700",
  "in-progress": "bg-orange-100 text-orange-700",
  "not-started": "bg-zinc-200 text-zinc-600",
}

export function LessonCard({
  lesson,
  courseId,
}: {
  lesson: Lesson
  /** 강의 상세 라우트 prefix 용 — `/courses/{courseId}/lessons/{lessonId}` */
  courseId: string
}) {
  const StatusIcon =
    lesson.status === "completed"
      ? CheckCircle2
      : lesson.status === "in-progress"
        ? Flame
        : Circle

  return (
    <article
      className={cn(
        "group flex items-center gap-3 rounded-2xl p-3 ring-1 transition hover:shadow-sm sm:gap-4 sm:p-4",
        STATUS_CARD_TONE[lesson.status],
      )}
    >
      {/* 좌측 상태 동그라미 아이콘 */}
      <span
        aria-hidden
        className={cn(
          "inline-flex size-9 shrink-0 items-center justify-center rounded-full sm:size-10",
          STATUS_ICON_TONE[lesson.status],
        )}
      >
        <StatusIcon
          className="size-4 sm:size-[18px]"
          strokeWidth={2.25}
          {...(lesson.status === "in-progress" ? { fill: "currentColor" } : {})}
        />
      </span>

      {/* 가운데: 번호+제목, 상태 pill, 시간 */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <h3 className="truncate text-sm font-semibold text-zinc-900 sm:text-[15px]">
            {lesson.number}. {lesson.title}
          </h3>
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold",
              STATUS_PILL_TONE[lesson.status],
            )}
          >
            {STATUS_LABEL[lesson.status]}
          </span>
        </div>
        <p className="mt-1 flex items-center gap-1 text-[11px] text-zinc-500 sm:text-xs">
          <Clock className="size-3" strokeWidth={2.25} aria-hidden />
          {lesson.durationMinutes}분
        </p>
      </div>

      {/* 우측: 액션 버튼 */}
      <LessonAction status={lesson.status} href={`/courses/${courseId}/lessons/${lesson.id}`} />
    </article>
  )
}

function LessonAction({ status, href }: { status: LessonStatus; href: string }) {
  switch (status) {
    case "completed":
      return (
        <Link
          href={href}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-emerald-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 sm:px-3 sm:py-2 sm:text-[13px]"
        >
          <RotateCcw className="size-3.5" strokeWidth={2.5} aria-hidden />
          다시보기
        </Link>
      )
    case "in-progress":
      return (
        <Link
          href={href}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-rose-500 px-2.5 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:from-orange-600 hover:to-rose-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 sm:px-3 sm:py-2 sm:text-[13px]"
        >
          <Play className="size-3.5 fill-white" strokeWidth={0} aria-hidden />
          이어보기
        </Link>
      )
    case "not-started":
      return (
        <Link
          href={href}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-zinc-900 px-2.5 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-700 sm:px-3 sm:py-2 sm:text-[13px]"
        >
          <Play className="size-3.5 fill-white" strokeWidth={0} aria-hidden />
          시작하기
        </Link>
      )
  }
}
