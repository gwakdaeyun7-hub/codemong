"use client"

// 강좌 상세 좌측 탭 사이드바.
// 클라이언트 컴포넌트인 이유: 탭 활성 상태를 화면 안에서만 토글 (라우트 분리 전 단계).
// 추후 각 탭이 별도 라우트로 분리되면 next/navigation 의 usePathname 으로 derive 하도록 교체.
//
// 모바일/태블릿(md 미만): 상단 가로 스크롤 탭바
// 데스크톱(lg 이상): 좌측 세로 sticky 사이드바

import { useState } from "react"
import {
  BarChart3,
  BookOpen,
  CheckCircle2,
  Code2,
  Lightbulb,
  Rocket,
  Sparkles,
  type LucideIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"

type TabKey =
  | "intro"
  | "concept"
  | "apply"
  | "solve"
  | "complete"
  | "feedback"
  | "next"

const TABS: { key: TabKey; label: string; icon: LucideIcon }[] = [
  { key: "intro", label: "소개", icon: BookOpen },
  { key: "concept", label: "개념설명", icon: Lightbulb },
  { key: "apply", label: "개념응용", icon: Sparkles },
  { key: "solve", label: "문제해결", icon: Code2 },
  { key: "complete", label: "학습완료", icon: CheckCircle2 },
  { key: "feedback", label: "성장피드백", icon: BarChart3 },
  { key: "next", label: "다음단계추천", icon: Rocket },
]

export function CourseDetailSidebar({
  defaultTab = "intro",
}: {
  defaultTab?: TabKey
}) {
  const [active, setActive] = useState<TabKey>(defaultTab)

  return (
    <>
      {/* ── 모바일/태블릿: 가로 스크롤 탭바 ─────────────────────────── */}
      <nav
        aria-label="강좌 상세 탭"
        className="lg:hidden -mx-4 mb-4 sm:-mx-6"
      >
        <ul
          role="tablist"
          className="flex gap-1.5 overflow-x-auto px-4 pb-2 sm:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {TABS.map((t) => {
            const Icon = t.icon
            const isActive = t.key === active
            return (
              <li key={t.key} className="shrink-0">
                <button
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActive(t.key)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold transition",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500",
                    isActive
                      ? "bg-violet-600 text-white shadow-sm"
                      : "bg-white text-zinc-500 ring-1 ring-zinc-200 hover:text-zinc-800",
                  )}
                >
                  <Icon className="size-3.5" strokeWidth={2.25} />
                  {t.label}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* ── 데스크톱: 좌측 세로 sticky 사이드바 ─────────────────────── */}
      <aside
        aria-label="강좌 상세 탭"
        className="hidden lg:block lg:w-[88px] xl:w-[104px] shrink-0"
      >
        <ul
          role="tablist"
          className="sticky top-20 flex flex-col gap-1.5 rounded-2xl bg-white p-2 ring-1 ring-zinc-200/80 shadow-sm"
        >
          {TABS.map((t) => {
            const Icon = t.icon
            const isActive = t.key === active
            return (
              <li key={t.key}>
                <button
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActive(t.key)}
                  className={cn(
                    "flex w-full flex-col items-center gap-1 rounded-xl px-2 py-3 text-[11px] font-semibold transition",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500",
                    isActive
                      ? "bg-violet-600 text-white shadow-sm"
                      : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800",
                  )}
                >
                  <Icon className="size-4" strokeWidth={2.25} />
                  <span className="leading-tight tracking-tight">{t.label}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </aside>
    </>
  )
}
