import Link from "next/link";
import { notFound } from "next/navigation";

import { CommentSection } from "@/components/comments/comment-section";
import { LikeButton } from "@/components/comments/like-button";
import { communityIcons } from "@/components/community/icon-map";
import { PostActions } from "@/components/community/post-actions";
import { SiteFooter } from "@/components/site-footer";
import { TopNav } from "@/components/top-nav";
import { getCurrentUser } from "@/lib/auth/get-user";
import { getPost } from "@/lib/community/posts-queries";
import { timeAgoKo } from "@/lib/format";

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = await params;
  const user = await getCurrentUser();
  const post = await getPost(postId, user?.id ?? null);

  if (!post) notFound();

  const ArrowLeft = communityIcons.arrowLeft;
  const Check = communityIcons.check;
  const Help = communityIcons.helpCircle;
  const Pen = communityIcons.penSquare;
  const initial = post.authorNickname.charAt(0).toUpperCase();

  return (
    <>
      <TopNav active="community" />

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <Link
          href="/community"
          className="mb-3 inline-flex items-center gap-1 text-xs font-medium text-zinc-500 hover:text-zinc-900"
        >
          <ArrowLeft className="size-3.5" />
          커뮤니티로
        </Link>

        <article className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
          {/* 카테고리 / 해결됨 */}
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span
              className={
                post.category === "question"
                  ? "inline-flex items-center gap-1 rounded-full bg-sky-50 px-2 py-0.5 text-[11px] font-semibold text-sky-700"
                  : "inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700"
              }
            >
              {post.category === "question" ? (
                <Help className="size-3" />
              ) : (
                <Pen className="size-3" />
              )}
              {post.category === "question" ? "Q&A" : "자유"}
            </span>
            {post.category === "question" && post.resolved && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                <Check className="size-3" />
                해결됨
              </span>
            )}
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            {post.title}
          </h1>

          <div className="mt-3 flex items-center gap-2 text-xs text-zinc-500">
            {post.authorAvatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={post.authorAvatarUrl}
                alt=""
                className="size-5 rounded-full object-cover"
              />
            ) : (
              <span className="inline-flex size-5 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-[10px] font-bold text-white">
                {initial}
              </span>
            )}
            <span className="font-medium text-zinc-700">
              {post.authorNickname}
            </span>
            <span>· {timeAgoKo(post.createdAt)}</span>
            {post.updatedAt.getTime() - post.createdAt.getTime() > 1000 && (
              <span>· 수정됨</span>
            )}
          </div>

          <div className="mt-5 whitespace-pre-wrap text-[15px] leading-relaxed text-zinc-800">
            {post.body}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-zinc-100 pt-4">
            <LikeButton
              target={{ kind: "post", postId: post.id }}
              count={post.likeCount}
              liked={post.likedByMe}
              disabled={!user}
            />
            <div className="ml-auto">
              <PostActions
                postId={post.id}
                isMine={post.isMine}
                canReport={user !== null}
                category={post.category}
                resolved={post.resolved}
              />
            </div>
          </div>
        </article>

        <div className="mt-5">
          <CommentSection target={{ kind: "post", postId: post.id }} />
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
