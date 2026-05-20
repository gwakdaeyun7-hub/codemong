"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { signOutAction } from "@/lib/auth/actions";
import { cn } from "@/lib/utils";

type Props = {
  nickname: string;
  email: string;
  avatarUrl: string | null;
};

/**
 * TopNav 우측 프로필 드롭다운.
 * 외부 헤드리스 라이브러리 없이 a11y 최소 요구만 만족하게 구현:
 *   - aria-haspopup / aria-expanded
 *   - Escape 키로 닫기
 *   - 외부 클릭으로 닫기
 *
 * Tailwind keyframe 없이 inline transition 만 사용해 디자인 톤 일관.
 */
export function UserMenu({ nickname, email, avatarUrl }: Props) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const initial = nickname.charAt(0).toUpperCase();

  useEffect(() => {
    if (!open) return;
    function onMouseDown(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function close() {
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="프로필 메뉴 열기"
        className="ml-1 inline-flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-xs font-bold text-white shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
      >
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl}
            alt=""
            className="size-8 rounded-full object-cover"
          />
        ) : (
          initial
        )}
      </button>

      {open && (
        <div
          role="menu"
          aria-label="프로필 메뉴"
          className="absolute right-0 top-full z-40 mt-2 w-64 origin-top-right rounded-2xl border border-zinc-200 bg-white p-1.5 shadow-lg"
        >
          <div className="border-b border-zinc-100 px-3 py-2.5">
            <p className="truncate text-sm font-semibold text-zinc-900">
              {nickname}
            </p>
            <p className="truncate text-xs text-zinc-500">{email}</p>
          </div>

          <div className="py-1">
            <MenuLink href="/mypage" onClick={close}>
              마이페이지
            </MenuLink>
            <MenuLink href="/mypage/settings" onClick={close}>
              설정
            </MenuLink>
          </div>

          <div className="border-t border-zinc-100 pt-1">
            <form action={signOutAction}>
              <button
                type="submit"
                role="menuitem"
                className="flex w-full items-center rounded-lg px-3 py-2 text-left text-sm text-zinc-600 transition hover:bg-zinc-50 hover:text-zinc-900"
              >
                로그아웃
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function MenuLink({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      role="menuitem"
      onClick={onClick}
      className={cn(
        "block rounded-lg px-3 py-2 text-sm text-zinc-700 transition hover:bg-zinc-50 hover:text-zinc-900",
      )}
    >
      {children}
    </Link>
  );
}
