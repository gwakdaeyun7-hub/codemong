import Link from "next/link";

import type { PostListItem } from "@/lib/community/types";
import { fmtCount, timeAgoKo } from "@/lib/format";
import { communityIcons } from "./icon-map";

export function PostCard({ post }: { post: PostListItem }) {
  const initial = post.authorNickname.charAt(0).toUpperCase();
  const Heart = communityIcons.helpCircle; // unused, replaced below
  const Check = communityIcons.check;
  const Help = communityIcons.helpCircle;
  const Pen = communityIcons.penSquare;
  const Msg = communityIcons.messageSquare;

  void Heart; // explicit lint-friendly mark; kept for icon-map consistency

  return (
    <Link
      href={`/community/${post.id}`}
      className="block rounded-2xl border border-zinc-200 bg-white p-4 transition hover:border-violet-200 hover:shadow-sm sm:p-5"
    >
      <div className="flex items-start gap-3">
        {/* 카테고리 뱃지 */}
        <div
          className={
            post.category === "question"
              ? "inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600"
              : "inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600"
          }
        >
          {post.category === "question" ? (
            <Help className="size-4" />
          ) : (
            <Pen className="size-4" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-base font-bold text-zinc-900">
              {post.title}
            </h3>
            {post.category === "question" && post.resolved && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                <Check className="size-3" />
                해결
              </span>
            )}
          </div>
          <p className="mt-1 line-clamp-2 text-sm text-zinc-600">
            {post.excerpt}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-500">
            <span className="inline-flex items-center gap-1.5">
              {post.authorAvatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={post.authorAvatarUrl}
                  alt=""
                  className="size-4 rounded-full object-cover"
                />
              ) : (
                <span className="inline-flex size-4 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-[8px] font-bold text-white">
                  {initial}
                </span>
              )}
              {post.authorNickname}
            </span>
            <span>{timeAgoKo(post.createdAt)}</span>
            <span className="ml-auto inline-flex items-center gap-3">
              <span className="inline-flex items-center gap-1">
                <Msg className="size-3.5" />
                {fmtCount(post.commentCount)}
              </span>
              <span>좋아요 {fmtCount(post.likeCount)}</span>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
