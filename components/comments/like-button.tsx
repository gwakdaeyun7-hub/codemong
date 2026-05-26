"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { cn } from "@/lib/utils";
import { fmtCount } from "@/lib/format";
import {
  toggleCommentLikeAction,
  toggleLessonLikeAction,
  togglePostLikeAction,
  type LikeResult,
} from "@/lib/community/likes-actions";
import { useToast } from "@/components/toast";
import { commentsIcons } from "./icon-map";

type Target =
  | { kind: "comment"; commentId: string }
  | { kind: "lesson"; lessonRef: string }
  | { kind: "post"; postId: string };

type Props = {
  target: Target;
  count: number;
  liked: boolean;
  disabled?: boolean; // 미로그인 시 true
  size?: "sm" | "md";
};

/**
 * 좋아요 토글 버튼.
 * - 미로그인(disabled)이면 클릭 시 로그인 페이지로 이동
 * - 정상 시 server action 호출 후 router.refresh() 로 화면 새로고침
 * - lesson/post 토글은 server action에서 revalidatePath 처리
 * - comment 토글은 path를 모르므로 router.refresh()로 처리
 */
export function LikeButton({
  target,
  count,
  liked,
  disabled = false,
  size = "md",
}: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const { error: toastError } = useToast();
  const Heart = commentsIcons.heart;

  const onClick = () => {
    if (disabled) {
      router.push("/login");
      return;
    }
    if (pending) return;
    startTransition(async () => {
      try {
        let result: LikeResult;
        if (target.kind === "comment") {
          result = await toggleCommentLikeAction(target.commentId);
        } else if (target.kind === "lesson") {
          result = await toggleLessonLikeAction(target.lessonRef);
        } else {
          result = await togglePostLikeAction(target.postId);
        }
        if (!result.ok) {
          toastError(result.error);
          return;
        }
        router.refresh();
      } catch {
        toastError("잠시 후 다시 시도해 주세요.");
      }
    });
  };

  const sizes =
    size === "sm"
      ? "h-7 px-2 text-xs gap-1"
      : "h-9 px-3 text-sm gap-1.5";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      aria-pressed={liked}
      aria-label={liked ? "좋아요 취소" : "좋아요"}
      title={disabled ? "로그인 후 사용할 수 있어요" : undefined}
      className={cn(
        "inline-flex items-center rounded-full font-medium transition",
        sizes,
        liked
          ? "bg-rose-50 text-rose-600 ring-1 ring-rose-200"
          : "bg-white text-zinc-600 ring-1 ring-zinc-200 hover:bg-zinc-50",
        pending && "opacity-60",
      )}
    >
      <Heart
        className={cn(
          size === "sm" ? "size-3.5" : "size-4",
          liked && "fill-current",
        )}
      />
      {fmtCount(count)}
    </button>
  );
}
