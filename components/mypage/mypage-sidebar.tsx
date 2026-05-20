"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { mypageIcons } from "./icon-map";
import { signOutAction } from "@/lib/auth/actions";

const NAV = [
  { href: "/mypage", label: "내 학습", icon: mypageIcons.book },
  { href: "/mypage/comments", label: "내 댓글", icon: mypageIcons.messageSquare },
  { href: "/mypage/posts", label: "내 글", icon: mypageIcons.penSquare },
  { href: "/mypage/likes", label: "좋아요", icon: mypageIcons.heart },
  { href: "/mypage/calendar", label: "학습 캘린더", icon: mypageIcons.calendar },
  { href: "/mypage/settings", label: "설정", icon: mypageIcons.settings },
] as const;

export function MypageSidebar() {
  const pathname = usePathname();
  const LogOut = mypageIcons.logOut;

  return (
    <aside className="lg:sticky lg:top-20">
      {/* 모바일: 가로 스크롤 탭 */}
      <div className="-mx-4 flex gap-1 overflow-x-auto px-4 pb-2 lg:hidden">
        {NAV.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition",
                isActive
                  ? "bg-violet-50 text-violet-700"
                  : "bg-white text-zinc-600 ring-1 ring-zinc-200 hover:bg-zinc-50",
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* 데스크톱: 세로 nav */}
      <nav
        aria-label="마이페이지 메뉴"
        className="hidden flex-col gap-1 rounded-2xl border border-zinc-200 bg-white p-2 lg:flex"
      >
        {NAV.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                isActive
                  ? "bg-violet-50 text-violet-700"
                  : "text-zinc-600 hover:bg-zinc-50",
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}

        <div className="my-1.5 h-px bg-zinc-100" />

        <form action={signOutAction}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-500 transition hover:bg-zinc-50 hover:text-zinc-900"
          >
            <LogOut className="size-4" />
            로그아웃
          </button>
        </form>
      </nav>
    </aside>
  );
}
