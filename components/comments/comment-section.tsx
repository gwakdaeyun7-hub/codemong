import Link from "next/link";

import { getCurrentUser } from "@/lib/auth/get-user";
import {
  listLessonComments,
  listPostComments,
} from "@/lib/community/comments-queries";
import { fmtCount } from "@/lib/format";
import { CommentForm } from "./comment-form";
import { CommentItem } from "./comment-item";
import { commentsIcons } from "./icon-map";

type Target =
  | { kind: "lesson"; lessonRef: string }
  | { kind: "post"; postId: string };

/**
 * 강의 영상 또는 커뮤니티 글에 임베드하는 댓글 섹션.
 * Server Component — 댓글 트리 fetch + 현재 유저 조회 후 client component 들에 넘김.
 */
export async function CommentSection({ target }: { target: Target }) {
  const user = await getCurrentUser();
  const comments =
    target.kind === "lesson"
      ? await listLessonComments(target.lessonRef, user?.id ?? null)
      : await listPostComments(target.postId, user?.id ?? null);

  // 실제 노출 댓글 수(soft-delete 제외, 답글 포함)
  const visibleCount = comments.reduce(
    (sum, c) =>
      sum + (c.deletedAt ? 0 : 1) + c.replies.filter((r) => !r.deletedAt).length,
    0,
  );

  const MessageCircle = commentsIcons.messageCircle;

  return (
    <section
      aria-label="댓글"
      className="rounded-2xl border border-zinc-200 bg-white/40 p-4 sm:p-5"
    >
      <header className="mb-4 flex items-center gap-2">
        <MessageCircle className="size-4 text-violet-600" />
        <h3 className="text-base font-bold text-zinc-900">
          댓글 {fmtCount(visibleCount)}
        </h3>
      </header>

      {/* 작성 폼 — 로그인 사용자만 */}
      {user ? (
        <div className="mb-5 rounded-2xl border border-zinc-200 bg-white p-4">
          <CommentForm
            mode="create"
            target={
              target.kind === "lesson"
                ? { kind: "lesson", lessonRef: target.lessonRef }
                : { kind: "post", postId: target.postId }
            }
          />
        </div>
      ) : (
        <div className="mb-5 rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/60 p-4 text-center text-sm text-zinc-500">
          <Link href="/login" className="font-medium text-violet-600 hover:text-violet-700">
            로그인
          </Link>
          {" 후 댓글을 남길 수 있어요."}
        </div>
      )}

      {/* 리스트 */}
      {comments.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/40 py-10 text-center text-sm text-zinc-500">
          아직 댓글이 없어요. 첫 댓글을 남겨보세요.
        </div>
      ) : (
        <ul className="space-y-3">
          {comments.map((c) => (
            <li key={c.id}>
              <CommentItem
                node={c}
                target={target}
                canInteract={user !== null}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
