import { redirect } from "next/navigation";

import { PostCard } from "@/components/community/post-card";
import { getCurrentUser } from "@/lib/auth/get-user";
import { listMyPosts } from "@/lib/community/posts-queries";

export const metadata = { title: "내 글 · CodeMong" };

export default async function MyPostsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/mypage/posts");

  const { page: pageRaw } = await searchParams;
  const page = Math.max(1, parseInt(pageRaw ?? "1", 10) || 1);
  const { items, total } = await listMyPosts(user.id, page, 20);

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          내 글
        </h1>
        <p className="mt-1 text-sm text-zinc-500">총 {total}개</p>
      </header>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-200 bg-white py-12 text-center text-sm text-zinc-500">
          아직 작성한 글이 없어요.
        </div>
      ) : (
        <ul className="space-y-3">
          {items.map((p) => (
            <li key={p.id}>
              <PostCard post={p} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
