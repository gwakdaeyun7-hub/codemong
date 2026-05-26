// 우측 사이드바 — 등록한 뱃지 카드.
// Server Component. acquired=false 는 회색 처리 + 자물쇠 아이콘.

import { createElement } from "react"
import { Award, Lock } from "lucide-react"

import { resolveBadgeTone, resolveLessonIcon } from "@/components/lessons/icon-map"
import { cn } from "@/lib/utils"

import type { LessonBadge } from "@/lib/lesson-plan"

export function BadgesCard({ badges }: { badges: LessonBadge[] }) {
  return (
    <section className="rounded-2xl bg-white p-5 ring-1 ring-zinc-200/80 shadow-sm sm:p-6">
      <header className="mb-3 flex items-center gap-2 text-sm font-semibold text-zinc-900">
        <span
          aria-hidden
          className="inline-flex size-7 items-center justify-center rounded-full bg-rose-100 text-rose-600"
        >
          <Award className="size-3.5" strokeWidth={2.25} />
        </span>
        획득한 뱃지
        <span className="ml-auto rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-500">
          준비 중
        </span>
      </header>

      <ul className="grid grid-cols-5 gap-2 sm:gap-3">
        {badges.map((badge) => (
          <li key={badge.id} className="flex flex-col items-center gap-1.5">
            <BadgeIcon badge={badge} />
            <span
              className={cn(
                "text-center text-[10px] leading-tight sm:text-[11px]",
                badge.acquired ? "text-zinc-700" : "text-zinc-400",
              )}
            >
              {badge.label}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}

function BadgeIcon({ badge }: { badge: LessonBadge }) {
  if (!badge.acquired) {
    // 미획득: 회색 + 자물쇠
    return (
      <span
        aria-hidden
        className="inline-flex size-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 ring-1 ring-zinc-200/80 sm:size-11"
        title={`${badge.label} (미획득)`}
      >
        <Lock className="size-4" strokeWidth={2.25} />
      </span>
    )
  }

  const tone = resolveBadgeTone(badge.tone)
  // resolveLessonIcon 결과를 createElement 로 직접 호출.
  // 변수에 대문자 컴포넌트 참조를 담아 JSX 로 렌더하면
  // react-hooks/static-components 룰이 "render 중 새 컴포넌트 생성"으로 오탐.
  const iconNode = createElement(resolveLessonIcon(badge.iconHint), {
    className: "size-[18px]",
    strokeWidth: 2.25,
  })
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex size-10 items-center justify-center rounded-full ring-1 sm:size-11",
        tone.bg,
        tone.fg,
        tone.ring,
      )}
      title={badge.label}
    >
      {iconNode}
    </span>
  )
}
