"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import {
  deletePostAction,
  toggleResolvedAction,
} from "@/lib/community/posts-actions";
import { ReportForm } from "@/components/comments/report-form";
import { communityIcons } from "./icon-map";

type Props = {
  postId: string;
  isMine: boolean;
  canReport: boolean;
  category: "question" | "free";
  resolved: boolean;
};

/**
 * 게시글 상세 우측 액션 영역.
 * 본인: 수정/삭제, Q&A 면 해결 토글
 * 타인 + 로그인: 신고
 */
export function PostActions({ postId, isMine, canReport, category, resolved }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [reporting, setReporting] = useState(false);

  const Pencil = communityIcons.pencil;
  const Trash = communityIcons.trash;
  const Flag = communityIcons.flag;
  const Check = communityIcons.check;

  const onDelete = () => {
    if (!confirm("게시글을 삭제할까요? 삭제된 글은 복구되지 않습니다.")) return;
    startTransition(async () => {
      const r = await deletePostAction(postId);
      if (r && "ok" in r && !r.ok) {
        alert(r.error);
        return;
      }
      router.push("/community");
    });
  };

  const onToggleResolved = () => {
    startTransition(async () => {
      const r = await toggleResolvedAction(postId);
      if (r && "ok" in r && !r.ok) {
        alert(r.error);
        return;
      }
      router.refresh();
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        {isMine && category === "question" && (
          <button
            type="button"
            onClick={onToggleResolved}
            disabled={pending}
            className={
              resolved
                ? "inline-flex h-9 items-center gap-1.5 rounded-full bg-emerald-50 px-3 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200"
                : "inline-flex h-9 items-center gap-1.5 rounded-full bg-white px-3 text-xs font-medium text-zinc-600 ring-1 ring-zinc-200 hover:bg-zinc-50"
            }
          >
            <Check className="size-3.5" />
            {resolved ? "해결됨 (해제)" : "해결됨으로 표시"}
          </button>
        )}

        {isMine && (
          <>
            <Link
              href={`/community/${postId}/edit`}
              className="inline-flex h-9 items-center gap-1.5 rounded-full bg-white px-3 text-xs font-medium text-zinc-700 ring-1 ring-zinc-200 hover:bg-zinc-50"
            >
              <Pencil className="size-3.5" />
              수정
            </Link>
            <button
              type="button"
              onClick={onDelete}
              disabled={pending}
              className="inline-flex h-9 items-center gap-1.5 rounded-full bg-white px-3 text-xs font-medium text-rose-600 ring-1 ring-rose-200 hover:bg-rose-50"
            >
              <Trash className="size-3.5" />
              삭제
            </button>
          </>
        )}

        {canReport && !isMine && (
          <button
            type="button"
            onClick={() => setReporting((p) => !p)}
            className="inline-flex h-9 items-center gap-1.5 rounded-full bg-white px-3 text-xs font-medium text-zinc-600 ring-1 ring-zinc-200 hover:bg-zinc-50"
          >
            <Flag className="size-3.5" />
            {reporting ? "신고 닫기" : "신고"}
          </button>
        )}
      </div>

      {reporting && (
        <ReportForm
          target={{ kind: "post", postId }}
          onDone={() => setReporting(false)}
          onCancel={() => setReporting(false)}
        />
      )}
    </div>
  );
}
