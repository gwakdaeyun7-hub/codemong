import Link from "next/link";
import { redirect } from "next/navigation";

import { mypageIcons } from "@/components/mypage/icon-map";
import { getCurrentUser } from "@/lib/auth/get-user";
import { listMyComments } from "@/lib/community/comments-queries";
import { timeAgoKo } from "@/lib/format";

export const metadata = { title: "내 댓글 · CodeMong" };

export default async function MyCommentsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/mypage/comments");

  const { page: pageRaw } = await searchParams;
  const page = Math.max(1, parseInt(pageRaw ?? "1", 10) || 1);
  const { items, total } = await listMyComments(user.id, page, 20);

  const ChevronRight = mypageIcons.chevronRight;

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          내 댓글
        </h1>
        <p className="mt-1 text-sm text-zinc-500">총 {total}개</p>
      </header>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-200 bg-white py-12 text-center text-sm text-zinc-500">
          아직 작성한 댓글이 없어요.
        </div>
      ) : (
        <ul className="space-y-2">
          {items.map((c) => {
            const href =
              c.target.kind === "lesson"
                ? `/courses/${c.target.courseId}/lessons/${c.target.lessonId}`
                : `/community/${c.target.postId}`;
            const label =
              c.target.kind === "lesson"
                ? `${c.target.courseId} · ${c.target.lessonId}`
                : "커뮤니티 글";
            return (
              <li key={c.id}>
                <Link
                  href={href}
                  className="flex items-start gap-3 rounded-2xl border border-zinc-200 bg-white p-4 transition hover:border-violet-200 hover:bg-violet-50/30"
                >
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm text-zinc-700">
                      {c.body}
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-xs text-zinc-500">
                      <span className="rounded-full bg-zinc-100 px-2 py-0.5 font-medium text-zinc-600">
                        {label}
                      </span>
                      <span>{timeAgoKo(c.createdAt)}</span>
                    </div>
                  </div>
                  <ChevronRight className="size-4 shrink-0 self-center text-zinc-400" />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
