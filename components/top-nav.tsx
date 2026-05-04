import Link from "next/link"
import { Bell, Search } from "lucide-react"

import { cn } from "@/lib/utils"

type NavKey = "study" | "skill" | "community" | "mypage"

const NAV_ITEMS: { key: NavKey; label: string; href: string }[] = [
  { key: "study", label: "코드학습", href: "/" },
  { key: "skill", label: "실력향상", href: "/skill" },
  { key: "community", label: "커뮤니티", href: "/community" },
  { key: "mypage", label: "마이페이지", href: "/mypage" },
]

/**
 * 글로벌 상단 네비.
 * Server Component — 활성 항목은 prop으로 받음 (App Router에서 segment를 직접 읽어도 되지만
 * MVP에선 prop 주입이 가장 단순하고 테스트하기 쉬움).
 *
 * 모바일에서는 메뉴를 숨기고 좌측 로고 + 우측 액션만 노출.
 * 추후 모바일 햄버거/하단탭 도입 시 이 컴포넌트의 모바일 영역을 교체.
 */
export function TopNav({ active = "study" }: { active?: NavKey }) {
  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/95 backdrop-blur">
      {/* 상단 진행 표시 — 보라색 얇은 strip */}
      <div className="h-0.5 w-full bg-gradient-to-r from-violet-400 via-purple-500 to-violet-600" />

      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* 좌측: 로고 + 메뉴 (메뉴는 모바일 숨김) */}
        <div className="flex shrink-0 items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="inline-flex size-7 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-sm font-bold text-white shadow-sm">
              C
            </span>
            <span className="text-[15px] font-bold tracking-tight text-zinc-900">
              CodeMong
            </span>
          </Link>

          <nav
            aria-label="주요 메뉴"
            className="hidden items-center gap-1 md:flex"
          >
            {NAV_ITEMS.map((item) => {
              const isActive = item.key === active
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "relative px-3 py-2 text-sm font-medium transition",
                    isActive
                      ? "text-violet-600"
                      : "text-zinc-600 hover:text-zinc-900",
                  )}
                >
                  {item.label}
                  {isActive && (
                    <span
                      aria-hidden
                      className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-violet-500"
                    />
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* 우측: 검색/알림/프로필 */}
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            aria-label="검색"
            className="inline-flex size-9 items-center justify-center rounded-full text-zinc-600 transition hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
          >
            <Search className="size-4" />
          </button>

          <button
            type="button"
            aria-label="알림"
            className="relative inline-flex size-9 items-center justify-center rounded-full text-zinc-600 transition hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
          >
            <Bell className="size-4" />
            <span
              aria-hidden
              className="absolute right-2 top-2 size-1.5 rounded-full bg-rose-500 ring-2 ring-white"
            />
            <span className="sr-only">읽지 않은 알림 있음</span>
          </button>

          <button
            type="button"
            aria-label="프로필"
            className="ml-1 inline-flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-xs font-bold text-white shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
          >
            킹
          </button>
        </div>
      </div>
    </header>
  )
}
