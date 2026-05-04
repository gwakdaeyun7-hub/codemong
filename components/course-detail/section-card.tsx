// course-detail 화면의 섹션 카드 공통 래퍼.
// 모든 섹션이 "원형 컬러 배지 + 아이콘 + 타이틀" 패턴을 공유하므로 한 곳에서 관리.

import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

type Props = {
  /** 섹션 타이틀 */
  title: string
  /** 좌측 원형 배지 안에 들어갈 lucide 아이콘 컴포넌트 */
  icon: LucideIcon
  /** 배지 색 톤 — 예: "bg-violet-100 text-violet-600" */
  tone?: string
  /** 카드 외부 추가 클래스 */
  className?: string
  children: ReactNode
}

export function SectionCard({
  title,
  icon: Icon,
  tone = "bg-violet-100 text-violet-600",
  className,
  children,
}: Props) {
  return (
    <section
      className={cn(
        "rounded-2xl bg-white p-5 ring-1 ring-zinc-200/80 shadow-sm sm:p-6",
        className,
      )}
    >
      <header className="mb-4 flex items-center gap-2.5 sm:mb-5">
        <span
          aria-hidden
          className={cn(
            "inline-flex size-8 items-center justify-center rounded-full",
            tone,
          )}
        >
          <Icon className="size-4" strokeWidth={2.25} />
        </span>
        <h2 className="text-[15px] font-bold text-zinc-900 sm:text-base">
          {title}
        </h2>
      </header>
      {children}
    </section>
  )
}
