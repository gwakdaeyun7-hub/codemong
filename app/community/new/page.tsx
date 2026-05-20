import Link from "next/link";
import { redirect } from "next/navigation";

import { communityIcons } from "@/components/community/icon-map";
import { PostForm } from "@/components/community/post-form";
import { TopNav } from "@/components/top-nav";
import { getCurrentUser } from "@/lib/auth/get-user";

export const metadata = { title: "글 작성 · CodeMong" };

export default async function NewPostPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/community/new");

  const ArrowLeft = communityIcons.arrowLeft;

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
        <header className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            새 글 작성
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            다른 학습자에게 도움이 되는 글이 좋아요. 정직하게 적어주세요.
          </p>
        </header>

        <PostForm mode="create" />
      </main>
    </>
  );
}
