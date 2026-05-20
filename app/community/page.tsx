import Link from "next/link";

import { CategoryTabs } from "@/components/community/category-tabs";
import { communityIcons } from "@/components/community/icon-map";
import { PostCard } from "@/components/community/post-card";
import { TopNav } from "@/components/top-nav";
import { getCurrentUser } from "@/lib/auth/get-user";
import { listPosts } from "@/lib/community/posts-queries";
import type { PostCategory } from "@/lib/community/types";

export const metadata = { title: "커뮤니티 · CodeMong" };

export default async function CommunityPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category: rawCategory } = await searchParams;
  const category: PostCategory | undefined =
    rawCategory === "question" || rawCategory === "free"
      ? (rawCategory as PostCategory)
      : undefined;
  const active = (category ?? "all") as "all" | "question" | "free";

  const [{ items, total }, user] = await Promise.all([
    listPosts({ category, page: 1, pageSize: 20 }),
    getCurrentUser(),
  ]);

  const Plus = communityIcons.plus;

  return (
    <>
      <TopNav active="community" />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
              커뮤니티
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              막힌 부분을 질문하고, 학습기를 나눠보세요.
            </p>
          </div>
          <Link
            href={user ? "/community/new" : "/login?next=/community/new"}
            className="inline-flex h-10 shrink-0 items-center gap-1.5 self-start rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:brightness-105 sm:self-end"
          >
            <Plus className="size-4" />
            글 작성
          </Link>
        </header>

        <div className="mb-5">
          <CategoryTabs active={active} />
        </div>

        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-200 bg-white py-16 text-center">
            <p className="text-sm text-zinc-500">
              {category === "question"
                ? "아직 등록된 질문이 없어요."
                : category === "free"
                  ? "아직 등록된 자유글이 없어요."
                  : "아직 등록된 글이 없어요."}
            </p>
            <Link
              href={user ? "/community/new" : "/login?next=/community/new"}
              className="mt-3 inline-flex h-9 items-center gap-1.5 rounded-xl bg-zinc-900 px-3 text-sm font-medium text-white hover:bg-zinc-800"
            >
              <Plus className="size-4" />첫 글 작성하기
            </Link>
          </div>
        ) : (
          <>
            <p className="mb-2 text-xs text-zinc-500">총 {total}개</p>
            <ul className="space-y-3">
              {items.map((post) => (
                <li key={post.id}>
                  <PostCard post={post} />
                </li>
              ))}
            </ul>
          </>
        )}
      </main>
    </>
  );
}
