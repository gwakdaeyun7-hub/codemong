import Link from "next/link";
import { redirect } from "next/navigation";

import { PostCard } from "@/components/community/post-card";
import { mypageIcons } from "@/components/mypage/icon-map";
import { getCurrentUser } from "@/lib/auth/get-user";
import {
  listMyLikedLessons,
  listMyLikedPosts,
} from "@/lib/community/likes-queries";
import { timeAgoKo } from "@/lib/format";

export const metadata = { title: "좋아요 · CodeMong" };

export default async function MyLikesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/mypage/likes");

  const [lessons, posts] = await Promise.all([
    listMyLikedLessons(user.id, 1, 20),
    listMyLikedPosts(user.id, 1, 20),
  ]);

  const Heart = mypageIcons.heart;
  const Book = mypageIcons.book;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          좋아요
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          내가 좋아요 표시한 강의와 글이 모입니다.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="flex items-center gap-2 text-base font-bold text-zinc-900">
          <Book className="size-4 text-violet-600" />
          좋아요한 강의 ({lessons.total})
        </h2>
        {lessons.items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-200 bg-white py-10 text-center text-sm text-zinc-500">
            아직 좋아요한 강의가 없어요.
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {lessons.items.map((l) => (
              <li key={l.lessonRef}>
                <Link
                  href={`/courses/${l.courseId}/lessons/${l.lessonId}`}
                  className="flex items-center justify-between gap-2 rounded-2xl border border-zinc-200 bg-white px-4 py-3 transition hover:border-violet-200 hover:bg-violet-50/30"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-zinc-900">
                      {l.title}
                    </p>
                    <p className="mt-0.5 text-xs text-zinc-500">
                      {l.courseId} · {timeAgoKo(l.likedAt)}
                    </p>
                  </div>
                  <Heart className="size-4 shrink-0 fill-rose-500 text-rose-500" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="flex items-center gap-2 text-base font-bold text-zinc-900">
          <Heart className="size-4 text-rose-500" />
          좋아요한 글 ({posts.total})
        </h2>
        {posts.items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-200 bg-white py-10 text-center text-sm text-zinc-500">
            아직 좋아요한 글이 없어요.
          </div>
        ) : (
          <ul className="space-y-3">
            {posts.items.map((p) => (
              <li key={p.id}>
                <PostCard post={p} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
