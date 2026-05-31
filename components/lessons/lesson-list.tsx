"use client"

// 강의 목록 + status 필터 칩.
// Client Component — 필터 칩의 토글 상태가 클라이언트 상태이기 때문.
// (LessonCard 자체는 Server-renderable 하지만 부모가 client 라 자연스럽게 같이 client 트리에 들어감.
//  카드 안에 인터랙션이 거의 없어 비용은 작음.)

import { useState } from "react"

import { LessonCard } from "@/components/lessons/lesson-card"
import { cn } from "@/lib/utils"

import type { Lesson, LessonStatus } from "@/lib/lesson-plan"

type FilterKey = LessonStatus

const FILTERS: {
  key: FilterKey
  label: string
  /** 활성 상태 톤 */
  active: string
  /** 비활성 상태 톤 */
  inactive: string
  /** 좌측 색 dot */
  dot: string
}[] = [
  {
    key: "completed",
    label: "완료",
    active: "bg-emerald-100 text-emerald-700 ring-emerald-200",
    inactive: "bg-white text-zinc-400 ring-zinc-200",
    dot: "bg-emerald-500",
  },
  {
    key: "in-progress",
    label: "진행중",
    active: "bg-orange-100 text-orange-700 ring-orange-200",
    inactive: "bg-white text-zinc-400 ring-zinc-200",
    dot: "bg-orange-500",
  },
  {
    key: "not-started",
    label: "미시작",
    active: "bg-zinc-200 text-zinc-700 ring-zinc-300",
    inactive: "bg-white text-zinc-400 ring-zinc-200",
    dot: "bg-zinc-400",
  },
]

export function LessonList({
  lessons,
  courseId,
  exerciseStatuses,
}: {
  lessons: Lesson[]
  /** 강의 카드의 액션 버튼 Link href prefix 용 */
  courseId: string
  /**
   * 강의별 연습 통과 현황 (lessonId → {passed,total}). 연습 없는 강은 키 없음.
   * 비로그인이면 빈 맵 — 하위 카드는 "N문제"만 표시. 카드로 그대로 prop 전달(명시적, cloneElement X).
   */
  exerciseStatuses?: Record<string, { passed: number; total: number }>
}) {
  // 기본값: 모든 status 활성. 칩 클릭 시 해당 status 가 visible 토글.
  const [active, setActive] = useState<Set<FilterKey>>(
    () => new Set(["completed", "in-progress", "not-started"]),
  )

  function toggle(key: FilterKey) {
    setActive((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }

  // status 별 강의 수 — 필터 칩 라벨 옆에 작게 표시.
  const counts: Record<FilterKey, number> = {
    completed: 0,
    "in-progress": 0,
    "not-started": 0,
  }
  for (const lesson of lessons) counts[lesson.status] += 1

  const visible = lessons.filter((l) => active.has(l.status))

  return (
    <section className="rounded-2xl bg-white p-5 ring-1 ring-zinc-200/80 shadow-sm sm:p-6">
      <header className="mb-4 flex items-center justify-between gap-2">
        <h2 className="text-[15px] font-bold text-zinc-900 sm:text-base">
          강의 목록
        </h2>
      </header>

      {/* 필터 칩 행 */}
      <div
        role="group"
        aria-label="강의 상태 필터"
        className="mb-4 flex flex-wrap items-center gap-2"
      >
        {FILTERS.map((f) => {
          const isActive = active.has(f.key)
          return (
            <button
              key={f.key}
              type="button"
              aria-pressed={isActive}
              onClick={() => toggle(f.key)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500",
                isActive ? f.active : f.inactive,
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "inline-block size-1.5 rounded-full",
                  isActive ? f.dot : "bg-zinc-300",
                )}
              />
              {f.label}
              <span
                className={cn(
                  "tabular-nums text-[11px] font-medium",
                  isActive ? "opacity-70" : "opacity-50",
                )}
              >
                {counts[f.key]}
              </span>
            </button>
          )
        })}
      </div>

      {/* 카드 리스트 */}
      {visible.length > 0 ? (
        <ul className="flex flex-col gap-3">
          {visible.map((lesson) => (
            <li key={lesson.id}>
              <LessonCard
                lesson={lesson}
                courseId={courseId}
                exerciseStatus={exerciseStatuses?.[lesson.id]}
              />
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-xl bg-zinc-50 px-4 py-8 text-center text-sm text-zinc-500">
          선택한 상태의 강의가 없어요. 필터를 다시 켜보세요.
        </p>
      )}
    </section>
  )
}
