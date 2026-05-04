// "이런 분께 추천해요" / "수강 전 준비사항" 두 카드의 공통 컴포넌트.
// 헤더 색·아이콘과 항목 글머리 스타일만 variant 로 분기.
// Server Component.

import { CheckCircle2, Lightbulb, Sparkles, Users } from "lucide-react"

import { SectionCard } from "@/components/course-detail/section-card"
import { cn } from "@/lib/utils"

type Variant = "audience" | "prerequisite"

const VARIANT_CONFIG: Record<
  Variant,
  {
    title: string
    headerIcon: typeof Users
    headerTone: string
    bulletIcon: typeof CheckCircle2
    bulletTone: string
  }
> = {
  audience: {
    title: "이런 분께 추천해요",
    headerIcon: Users,
    headerTone: "bg-emerald-100 text-emerald-600",
    bulletIcon: CheckCircle2,
    bulletTone: "text-emerald-500",
  },
  prerequisite: {
    title: "수강 전 준비사항",
    headerIcon: Lightbulb,
    headerTone: "bg-amber-100 text-amber-600",
    bulletIcon: Sparkles,
    bulletTone: "text-amber-500",
  },
}

export function ChecklistCard({
  variant,
  items,
}: {
  variant: Variant
  items: string[]
}) {
  const cfg = VARIANT_CONFIG[variant]
  const Bullet = cfg.bulletIcon

  return (
    <SectionCard
      title={cfg.title}
      icon={cfg.headerIcon}
      tone={cfg.headerTone}
      className="h-full"
    >
      <ul className="flex flex-col gap-2.5">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-2.5 text-[13px] text-zinc-700"
          >
            <Bullet
              aria-hidden
              className={cn("mt-0.5 size-4 shrink-0", cfg.bulletTone)}
              strokeWidth={2.25}
            />
            <span className="leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    </SectionCard>
  )
}
