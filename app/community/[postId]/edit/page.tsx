import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { communityIcons } from "@/components/community/icon-map";
import { PostForm } from "@/components/community/post-form";
import { TopNav } from "@/components/top-nav";
import { getCurrentUser } from "@/lib/auth/get-user";
import { getPost } from "@/lib/community/posts-queries";

export const metadata = { title: "글 수정 · CodeMong" };

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = await params;
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=/community/${postId}/edit`);

  const post = await getPost(postId, user.id);
  if (!post) notFound();
  if (!post.isMine) redirect(`/community/${postId}`); // 권한 없음 → 상세로

  const ArrowLeft = communityIcons.arrowLeft;

  return (
    <>
      <TopNav active="community" />

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <Link
          href={`/community/${postId}`}
          className="mb-3 inline-flex items-center gap-1 text-xs font-medium text-zinc-500 hover:text-zinc-900"
        >
          <ArrowLeft className="size-3.5" />
          글로 돌아가기
        </Link>
        <header className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            글 수정
          </h1>
        </header>

        <PostForm
          mode="edit"
          postId={post.id}
          initialCategory={post.category}
          initialTitle={post.title}
          initialBody={post.body}
        />
      </main>
    </>
  );
}
