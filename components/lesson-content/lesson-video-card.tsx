"use client"

// 강의 상세 — 강의 영상 카드 + 학습 완료 버튼 (Client Component).
// videoSrc가 있으면 native <video controls> 16:9 렌더 + 영상 90% 도달 시 시청 기록(markVideoWatchedAction),
// 없으면 다크 placeholder. 완료 버튼은 영상 시청(90%) 후 활성화되며 toggleLessonCompleteAction → 이수율 집계.
// 트랜스크립트 요약은 두 모드 모두 노출.
// (lesson-content 폴더는 사용 아이콘이 적어 lucide 직접 import — CLAUDE.md 예외 케이스.)

import { useRef, useState, useTransition, type SyntheticEvent } from "react"
import { Check, Play } from "lucide-react"

import {
  markVideoWatchedAction,
  toggleLessonCompleteAction,
} from "@/lib/learning/progress-actions"
import { useToast } from "@/components/toast"
import { cn } from "@/lib/utils"

import type { LessonVideo } from "@/lib/lesson-content"

export function LessonVideoCard({
  video,
  durationMinutes,
  lessonRef,
  initialVideoWatched,
  initialLearnCompleted,
}: {
  video: LessonVideo
  durationMinutes: number
  lessonRef: string
  initialVideoWatched: boolean
  initialLearnCompleted: boolean
}) {
  const totalLabel = `${durationMinutes.toString().padStart(2, "0")}:00`
  const hasVideo = Boolean(video.videoSrc)

  const [watched, setWatched] = useState(initialVideoWatched)
  const [completed, setCompleted] = useState(initialLearnCompleted)
  const [pending, startTransition] = useTransition()
  const { error: toastError } = useToast()
  // 90% 시청 액션이 영상당 한 번만 나가도록 가드.
  const firedRef = useRef(initialVideoWatched)

  function handleTimeUpdate(e: SyntheticEvent<HTMLVideoElement>) {
    const v = e.currentTarget
    if (firedRef.current || !v.duration || v.duration === Infinity) return
    if (v.currentTime / v.duration >= 0.9) {
      firedRef.current = true
      setWatched(true)
      // fire-and-forget — 비로그인 등 실패해도 화면은 진행. 완료 버튼 클릭 시 서버에서 다시 검증.
      void markVideoWatchedAction(lessonRef)
    }
  }

  function handleToggleComplete() {
    startTransition(async () => {
      try {
        const res = await toggleLessonCompleteAction(lessonRef)
        if (res.ok) {
          setCompleted(res.learnCompleted)
          setWatched(res.videoWatched)
        } else {
          toastError(res.error)
        }
      } catch {
        toastError("잠시 후 다시 시도해 주세요.")
      }
    })
  }

  const canComplete = watched || completed

  return (
    <section className="overflow-hidden rounded-2xl bg-white ring-1 ring-zinc-200/80 shadow-sm">
      {/* 16:9 영상 자리 */}
      {hasVideo ? (
        <video
          controls
          preload="metadata"
          playsInline
          onTimeUpdate={handleTimeUpdate}
          className="block aspect-video w-full bg-black"
          aria-label={`${video.posterDescription} 영상`}
        >
          <source src={video.videoSrc} type="video/mp4" />
          이 브라우저는 영상 재생을 지원하지 않습니다.
        </video>
      ) : (
        <div className="relative aspect-video w-full bg-gradient-to-br from-zinc-800 via-zinc-900 to-black">
          {/* 가운데 큰 Play 동그라미 (장식) */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              aria-hidden
              className="inline-flex size-16 items-center justify-center rounded-full bg-white/95 text-violet-600 shadow-lg ring-4 ring-white/20 sm:size-20"
            >
              <Play className="size-7 fill-current sm:size-9" strokeWidth={0} />
            </span>
          </div>
          {/* 하단 라벨 오버레이 */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-3 sm:p-4">
            <p className="text-[13px] font-medium text-white/95 sm:text-sm">
              {video.posterDescription}
            </p>
          </div>
        </div>
      )}

      {/* 학습 완료 행 (실 영상 모드) */}
      {hasVideo ? (
        <div className="border-b border-zinc-100 px-4 py-3 sm:px-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[12px] text-zinc-500">
              {completed
                ? "이 강의를 학습 완료로 표시했어요."
                : watched
                  ? "영상 시청 완료 — 학습을 완료로 표시할 수 있어요."
                  : "영상을 끝까지 보면 완료로 표시할 수 있어요."}
            </p>
            <button
              type="button"
              onClick={handleToggleComplete}
              disabled={!canComplete || pending}
              aria-pressed={completed}
              className={cn(
                "inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg px-3.5 py-2 text-[13px] font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2",
                completed
                  ? "border border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 focus-visible:outline-emerald-500"
                  : "bg-violet-600 text-white hover:bg-violet-700 focus-visible:outline-violet-500",
                !canComplete && "cursor-not-allowed opacity-50",
              )}
            >
              {completed ? (
                <>
                  <Check className="size-4" strokeWidth={2.5} aria-hidden />
                  학습 완료됨
                </>
              ) : (
                "학습 완료하기"
              )}
            </button>
          </div>
        </div>
      ) : (
        // placeholder 컨트롤 행 — 영상이 없을 때만 (장식)
        <div className="flex items-center justify-between gap-3 border-b border-zinc-100 px-4 py-2.5 sm:px-5">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-600">
            <Play className="size-3.5 fill-current" strokeWidth={0} aria-hidden />
            재생하기
          </span>
          <span className="font-mono text-[11px] tabular-nums text-zinc-500 sm:text-xs">
            00:00 / {totalLabel}
          </span>
        </div>
      )}

      {/* 트랜스크립트 요약 */}
      <div className="px-4 py-4 sm:px-5 sm:py-5">
        <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-2.5 py-1 text-[11px] font-semibold text-zinc-600">
          <span aria-hidden>📝</span>
          트랜스크립트
        </div>
        <p className="text-[13px] leading-relaxed text-zinc-700 sm:text-sm">
          {video.transcriptSummary}
        </p>
      </div>
    </section>
  )
}
