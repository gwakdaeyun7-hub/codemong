import { getCurrentUser } from "@/lib/auth/get-user";
import { getLessonLikeStatus } from "@/lib/community/likes-actions";
import { prisma } from "@/lib/prisma";
import { fmtCount } from "@/lib/format";
import { commentsIcons } from "./icon-map";
import { LikeButton } from "./like-button";

/**
 * 강의 영상 바로 아래에 노출하는 좋아요 + 댓글 수 작은 bar.
 * Server Component — 좋아요/댓글 카운트를 한 번에 fetch 해 client `LikeButton` 에 넘김.
 */
export async function LessonLikeBar({ lessonRef }: { lessonRef: string }) {
  const user = await getCurrentUser();
  const [status, commentCount] = await Promise.all([
    getLessonLikeStatus(lessonRef, user?.id ?? null),
    prisma.comment.count({ where: { lessonRef, deletedAt: null } }),
  ]);

  const MessageCircle = commentsIcons.messageCircle;

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white px-4 py-3">
      <LikeButton
        target={{ kind: "lesson", lessonRef }}
        count={status.count}
        liked={status.likedByMe}
        disabled={!user}
      />
      <span className="inline-flex items-center gap-1.5 text-sm text-zinc-500">
        <MessageCircle className="size-4" />
        댓글 {fmtCount(commentCount)}
      </span>
      <span className="ml-auto text-xs text-zinc-400">
        {user ? "이해가 되었다면 좋아요로 응원해주세요" : "로그인 후 좋아요/댓글을 남길 수 있어요"}
      </span>
    </div>
  );
}
