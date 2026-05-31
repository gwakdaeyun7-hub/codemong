"use client";

// Client Component (leaf 인터랙션) — TopNav(Server)에서 props 로 데이터를 받아
// 토글/바깥클릭/Escape 닫기 + "처음 열 때 읽음 처리" 인터랙션만 담당.
// 데이터 조회("열 때 조회")는 server 의 top-nav 가 page render 시 수행한다.

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { Bell } from "lucide-react";

import { markNotificationsReadAction } from "@/lib/notifications/actions";
import type { NotificationItem } from "@/lib/notifications/queries";
import { timeAgoKo } from "@/lib/format";
import { cn } from "@/lib/utils";

// 아이콘이 Bell 하나뿐이라 lesson-content/project 와 동일하게
// 폴더 icon-map 없이 직접 import (CLAUDE.md 컨벤션의 명시 예외).

type Props = {
  unreadCount: number;
  items: NotificationItem[];
};

/**
 * type → 한국어 문구. actorNickname 은 굵게, 나머지는 일반.
 * backend 는 message 를 주지 않으므로 프론트에서 조립 (CodeMong 톤: 정직·담백).
 */
function NotificationMessage({ item }: { item: NotificationItem }) {
  const name = <strong className="font-semibold text-zinc-900">{item.actorNickname}</strong>;
  switch (item.type) {
    case "post_comment":
      return <>{name}님이 회원님의 글에 댓글을 남겼어요</>;
    case "comment_reply":
      return <>{name}님이 회원님의 댓글에 답글을 남겼어요</>;
    case "post_like":
      return <>{name}님이 회원님의 글을 좋아합니다</>;
    case "comment_like":
      return <>{name}님이 회원님의 댓글을 좋아합니다</>;
    default:
      return <>{name}님이 새 소식을 남겼어요</>;
  }
}

export function NotificationMenu({ unreadCount, items }: Props) {
  const [open, setOpen] = useState(false);
  // 이번 마운트에서 이미 읽음 처리를 시도했는지 (열 때마다 중복 호출 방지)
  const markedRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [, startTransition] = useTransition();

  const hasUnread = unreadCount > 0;
  const badgeLabel = unreadCount > 9 ? "9+" : String(unreadCount);

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

  function toggle() {
    const next = !open;
    setOpen(next);

    // 처음 여는 순간 + 안읽음이 있을 때만 읽음 처리.
    // 부가 동작이라 실패해도 조용히(콘솔) — 토스트 X.
    if (next && hasUnread && !markedRef.current) {
      markedRef.current = true;
      startTransition(async () => {
        try {
          const res = await markNotificationsReadAction();
          if (res.ok) {
            // 다음 server render 때 read 반영 → 뱃지 사라짐.
            router.refresh();
          }
        } catch (e) {
          console.error("[notifications] mark read failed", e);
        }
      });
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={toggle}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={hasUnread ? `알림 (안 읽음 ${unreadCount}개)` : "알림"}
        className="relative inline-flex size-9 items-center justify-center rounded-full text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
      >
        <Bell className="size-4" />
        {hasUnread && (
          <span
            aria-hidden
            className={cn(
              "absolute right-1.5 top-1.5 inline-flex min-w-3.5 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold leading-none text-white ring-2 ring-white",
              unreadCount > 9 ? "h-3.5" : "size-2.5 px-0",
            )}
          >
            {unreadCount > 9 ? badgeLabel : ""}
          </span>
        )}
      </button>

      {open && (
        <div
          role="menu"
          aria-label="알림 목록"
          className="absolute right-0 top-full z-40 mt-2 w-80 max-w-[calc(100vw-1.5rem)] origin-top-right overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-zinc-200/80"
        >
          <div className="border-b border-zinc-100 px-4 py-2.5">
            <p className="text-sm font-semibold text-zinc-900">알림</p>
          </div>

          {items.length === 0 ? (
            <div className="px-4 py-10 text-center text-sm text-zinc-500">
              아직 새 알림이 없어요.
            </div>
          ) : (
            <ul className="max-h-96 divide-y divide-zinc-50 overflow-y-auto">
              {items.map((item) => (
                <li key={item.id}>
                  <NotificationRow item={item} onNavigate={() => setOpen(false)} />
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function NotificationRow({
  item,
  onNavigate,
}: {
  item: NotificationItem;
  onNavigate: () => void;
}) {
  const body = (
    <div
      className={cn(
        "flex gap-3 px-4 py-3 transition",
        !item.read && "bg-violet-50/60",
        item.href && "hover:bg-zinc-50",
      )}
    >
      <Avatar nickname={item.actorNickname} avatarUrl={item.actorAvatarUrl} />
      <div className="min-w-0 flex-1">
        <p className="text-sm leading-snug text-zinc-700">
          <NotificationMessage item={item} />
        </p>
        {item.excerpt && (
          <p className="mt-0.5 truncate text-xs text-zinc-500">{item.excerpt}</p>
        )}
        <p className="mt-1 text-[11px] text-zinc-400">{timeAgoKo(item.createdAt)}</p>
      </div>
      {!item.read && (
        <span
          aria-hidden
          className="mt-1.5 size-2 shrink-0 rounded-full bg-violet-500"
        />
      )}
    </div>
  );

  if (item.href) {
    return (
      <Link
        href={item.href}
        role="menuitem"
        onClick={onNavigate}
        className="block focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-violet-500"
      >
        {body}
      </Link>
    );
  }

  // href 없으면 비링크 (커서 기본).
  return <div role="menuitem">{body}</div>;
}

function Avatar({
  nickname,
  avatarUrl,
}: {
  nickname: string;
  avatarUrl: string | null;
}) {
  if (avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={avatarUrl}
        alt=""
        className="size-8 shrink-0 rounded-full object-cover"
      />
    );
  }
  const initial = nickname.charAt(0).toUpperCase();
  return (
    <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-xs font-bold text-white">
      {initial}
    </span>
  );
}
