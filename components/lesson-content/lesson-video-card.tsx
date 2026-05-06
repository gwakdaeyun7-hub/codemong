// 강의 상세(개념 탭) — 강의 영상 카드.
// videoSrc가 있으면 native <video controls>를 16:9로 렌더,
// 없으면 다크 그라데이션 placeholder + Play 동그라미 + posterDescription 오버레이.
// 트랜스크립트 요약은 두 모드 모두에서 그대로 노출.
// Server Component — 영상 컨트롤은 native HTML5 <video>가 처리.

import { Play } from "lucide-react"

import type { LessonVideo } from "@/lib/lesson-content"

export function LessonVideoCard({
  video,
  durationMinutes,
}: {
  video: LessonVideo
  durationMinutes: number
}) {
  const totalLabel = `${durationMinutes.toString().padStart(2, "0")}:00`
  const hasVideo = Boolean(video.videoSrc)

  return (
    <section className="overflow-hidden rounded-2xl bg-white ring-1 ring-zinc-200/80 shadow-sm">
      {/* 16:9 영상 자리 */}
      {hasVideo ? (
        <video
          controls
          preload="metadata"
          playsInline
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
            <button
              type="button"
              aria-label="강의 영상 재생"
              className="group inline-flex size-16 items-center justify-center rounded-full bg-white/95 text-violet-600 shadow-lg ring-4 ring-white/20 transition hover:scale-105 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-400 sm:size-20"
            >
              <Play
                className="size-7 fill-current sm:size-9"
                strokeWidth={0}
                aria-hidden
              />
            </button>
          </div>

          {/* 하단 라벨 오버레이 */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-3 sm:p-4">
            <p className="text-[13px] font-medium text-white/95 sm:text-sm">
              {video.posterDescription}
            </p>
          </div>
        </div>
      )}

      {/* 영상 컨트롤 행 — placeholder 모드에서만 (실 영상은 native controls가 대체) */}
      {!hasVideo && (
        <div className="flex items-center justify-between gap-3 border-b border-zinc-100 px-4 py-2.5 sm:px-5">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-600 transition hover:text-violet-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
          >
            <Play className="size-3.5 fill-current" strokeWidth={0} aria-hidden />
            재생하기
          </button>
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
