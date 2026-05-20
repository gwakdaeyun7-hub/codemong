import Link from "next/link";
import { Bell, Search } from "lucide-react";

import { getCurrentUser } from "@/lib/auth/get-user";
import { cn } from "@/lib/utils";
import { UserMenu } from "./user-menu";

type NavKey = "study" | "skill" | "community" | "mypage";

const NAV_ITEMS: { key: NavKey; label: string; href: string }[] = [
  { key: "study", label: "코드학습", href: "/" },
  { key: "skill", label: "실력향상", href: "/skill" },
  { key: "community", label: "커뮤니티", href: "/community" },
  { key: "mypage", label: "마이페이지", href: "/mypage" },
];

/**
 * 글로벌 상단 네비.
 * Server Component — getCurrentUser() 로 로그인 상태를 직접 읽어
 *   - 미로그인: [검색] + [로그인 버튼]
 *   - 로그인: [검색] + [알림] + [UserMenu 드롭다운]
 * 으로 우측 액션을 분기. 활성 메뉴는 active prop 으로 받음.
 */
export async function TopNav({ active = "study" }: { active?: NavKey }) {
  const user = await getCurrentUser();

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
              const isActive = item.key === active;
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
              );
            })}
          </nav>
        </div>

        {/* 우측: 검색 / (알림) / 프로필 또는 로그인 */}
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            aria-label="검색"
            className="inline-flex size-9 items-center justify-center rounded-full text-zinc-600 transition hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
          >
            <Search className="size-4" />
          </button>

          {user ? (
            <>
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

              <UserMenu
                nickname={user.nickname}
                email={user.email}
                avatarUrl={user.avatarUrl}
              />
            </>
          ) : (
            <Link
              href="/login"
              className="ml-1 inline-flex h-9 items-center rounded-full bg-zinc-900 px-4 text-sm font-semibold text-white transition hover:bg-zinc-800"
            >
              로그인
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
