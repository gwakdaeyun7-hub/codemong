// "수강생 후기" 카드.
// Server Component.

import { Star } from "lucide-react"

import { SectionCard } from "@/components/course-detail/section-card"
import { cn } from "@/lib/utils"

import type { Review } from "@/lib/course-detail"

// 아바타 배경 톤 — 후기 인덱스별로 살짝 다르게
const AVATAR_TONES = [
  "bg-violet-100 text-violet-600",
  "bg-blue-100 text-blue-600",
  "bg-emerald-100 text-emerald-600",
]

export function ReviewsCard({ reviews }: { reviews: Review[] }) {
  return (
    <SectionCard
      title="수강생 후기"
      icon={Star}
      tone="bg-amber-100 text-amber-600"
    >
      <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {reviews.map((r, i) => (
          <li
            key={r.name}
            className="flex flex-col gap-3 rounded-xl bg-zinc-50/70 p-4 ring-1 ring-zinc-200/60"
          >
            {/* 상단: 아바타 + 이름 + 태그 */}
            <div className="flex items-center gap-2.5">
              <span
                aria-hidden
                className={cn(
                  "inline-flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                  AVATAR_TONES[i % AVATAR_TONES.length],
                )}
              >
                {r.name.charAt(0)}
              </span>
              <div className="min-w-0">
                <p className="text-[13px] font-bold text-zinc-900">{r.name}</p>
                <span className="mt-0.5 inline-block rounded-full bg-zinc-200/80 px-2 py-0.5 text-[10px] font-medium text-zinc-600">
                  {r.tag}
                </span>
              </div>
            </div>

            {/* 별점 */}
            <StarRating rating={r.rating} />

            {/* 후기 본문 */}
            <p className="text-[12px] leading-relaxed text-zinc-600">
              {r.comment}
            </p>
          </li>
        ))}
      </ul>
    </SectionCard>
  )
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div
      className="flex items-center gap-0.5"
      role="img"
      aria-label={`${rating}점 만점에 5점 중 ${rating}점`}
    >
      {Array.from({ length: 5 }, (_, i) => {
        const filled = i < rating
        return (
          <Star
            key={i}
            aria-hidden
            className={cn(
              "size-3.5",
              filled ? "fill-amber-400 text-amber-400" : "text-zinc-300",
            )}
            strokeWidth={1.5}
          />
        )
      })}
    </div>
  )
}
