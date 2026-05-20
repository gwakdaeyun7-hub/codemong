import Link from "next/link";

import type { CurrentUser } from "@/lib/auth/get-user";
import { mypageIcons } from "./icon-map";

/**
 * 프로필 카드 — 마이페이지 상단에 표시.
 * provider 가 "google" / "kakao" 이면 소셜 가입 표시.
 */
export function ProfileSummaryCard({ user }: { user: CurrentUser }) {
  const Settings = mypageIcons.settings;
  const Mail = mypageIcons.mail;
  const initial = user.nickname.charAt(0).toUpperCase();

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        {/* 아바타 */}
        <div className="relative shrink-0">
          {user.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.avatarUrl}
              alt=""
              className="size-16 rounded-2xl object-cover"
            />
          ) : (
            <div className="inline-flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 text-2xl font-bold text-white shadow-sm">
              {initial}
            </div>
          )}
          <ProviderBadge provider={user.provider} />
        </div>

        {/* 정보 */}
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-xl font-bold text-zinc-900">
            {user.nickname}
          </h2>
          <p className="mt-0.5 flex items-center gap-1.5 truncate text-sm text-zinc-500">
            <Mail className="size-3.5" />
            {user.email}
          </p>
        </div>

        {/* 액션 */}
        <Link
          href="/mypage/settings"
          className="inline-flex h-10 shrink-0 items-center gap-1.5 self-start rounded-xl border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 sm:self-center"
        >
          <Settings className="size-4" />
          프로필 편집
        </Link>
      </div>
    </section>
  );
}

function ProviderBadge({ provider }: { provider: string }) {
  if (provider === "email") return null;
  const label =
    provider === "google" ? "Google" : provider === "kakao" ? "Kakao" : provider;
  const tone =
    provider === "kakao"
      ? "bg-[#FEE500] text-[#191600]"
      : "bg-white text-zinc-700 ring-1 ring-zinc-200";
  return (
    <span
      title={`${label} 계정으로 가입`}
      className={`absolute -bottom-1 -right-1 inline-flex h-5 items-center rounded-full px-1.5 text-[10px] font-semibold shadow-sm ${tone}`}
    >
      {label}
    </span>
  );
}
