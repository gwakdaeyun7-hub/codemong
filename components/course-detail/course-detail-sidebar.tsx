// 강좌/강의 상세 좌측 탭 사이드바.
// Server Component — 각 탭은 라우팅 Link. 콘텐츠가 있는 탭(소개·개념설명)만 활성이고,
// 아직 기능이 없는 탭은 '준비 중'으로 비활성 처리해 가짜 클릭을 막는다.
//   - 소개      → 강좌 소개 페이지 (/courses/[id])
//   - 개념설명  → 강의 목록 (/courses/[id]/lessons) — 거기서 강의를 골라 영상 학습
//   - 그 외 5탭 → 미구현 (퀴즈/오답분석/추천 등). 준비 중 비활성.
//
// 활성 탭은 active prop 으로 받아 강조. (강좌 상세 = "intro", 강의 상세 = "concept")
//
// 모바일/태블릿(lg 미만): 상단 가로 스크롤 탭바
// 데스크톱(lg 이상): 좌측 세로 sticky 사이드바

import Link from "next/link"
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

type TabDef = {
  key: TabKey
  label: string
  icon: LucideIcon
  /** 콘텐츠/기능이 구현돼 실제로 이동 가능한가 */
  ready: boolean
  /** ready=true 일 때 이동 경로 */
  href?: (courseId: string) => string
}

const TABS: TabDef[] = [
  { key: "intro", label: "소개", icon: BookOpen, ready: true, href: (c) => `/courses/${c}` },
  {
    key: "concept",
    label: "개념설명",
    icon: Lightbulb,
    ready: true,
    href: (c) => `/courses/${c}/lessons`,
  },
  { key: "apply", label: "개념응용", icon: Sparkles, ready: false },
  { key: "solve", label: "문제해결", icon: Code2, ready: false },
  { key: "complete", label: "학습완료", icon: CheckCircle2, ready: false },
  { key: "feedback", label: "성장피드백", icon: BarChart3, ready: false },
  { key: "next", label: "다음단계추천", icon: Rocket, ready: false },
]

export function CourseDetailSidebar({
  courseId,
  active,
}: {
  courseId: string
  active: TabKey
}) {
  return (
    <>
      {/* ── 모바일/태블릿: 가로 스크롤 탭바 ─────────────────────────── */}
      <nav aria-label="강좌 상세 탭" className="lg:hidden -mx-4 mb-4 sm:-mx-6">
        <ul
          role="tablist"
          className="flex gap-1.5 overflow-x-auto px-4 pb-2 sm:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {TABS.map((t) => (
            <li key={t.key} className="shrink-0">
              <SidebarTab tab={t} courseId={courseId} active={active} variant="horizontal" />
            </li>
          ))}
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
          {TABS.map((t) => (
            <li key={t.key}>
              <SidebarTab tab={t} courseId={courseId} active={active} variant="vertical" />
            </li>
          ))}
        </ul>
      </aside>
    </>
  )
}

function SidebarTab({
  tab,
  courseId,
  active,
  variant,
}: {
  tab: TabDef
  courseId: string
  active: TabKey
  variant: "horizontal" | "vertical"
}) {
  const Icon = tab.icon
  const isActive = tab.key === active
  const iconSize = variant === "horizontal" ? "size-3.5" : "size-4"

  const base =
    variant === "horizontal"
      ? "inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
      : "flex w-full flex-col items-center gap-1 rounded-xl px-2 py-3 text-[11px] font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"

  const label = (
    <span className={variant === "vertical" ? "leading-tight tracking-tight" : undefined}>
      {tab.label}
    </span>
  )

  // 미구현 탭 — '준비 중' 비활성 (클릭 불가, 흐린 톤 + 툴팁)
  if (!tab.ready || !tab.href) {
    return (
      <span
        role="tab"
        aria-selected={false}
        aria-disabled
        title="준비 중이에요"
        className={cn(
          base,
          "cursor-not-allowed",
          variant === "horizontal"
            ? "bg-white text-zinc-300 ring-1 ring-zinc-100"
            : "text-zinc-300",
        )}
      >
        <Icon className={iconSize} strokeWidth={2.25} aria-hidden />
        {label}
      </span>
    )
  }

  // 활성 가능 탭 — 실제 라우팅 Link
  return (
    <Link
      href={tab.href(courseId)}
      role="tab"
      aria-selected={isActive}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        base,
        isActive
          ? "bg-violet-600 text-white shadow-sm"
          : variant === "horizontal"
            ? "bg-white text-zinc-500 ring-1 ring-zinc-200 hover:text-zinc-800"
            : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800",
      )}
    >
      <Icon className={iconSize} strokeWidth={2.25} aria-hidden />
      {label}
    </Link>
  )
}
