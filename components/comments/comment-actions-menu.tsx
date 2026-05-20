"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { deleteCommentAction } from "@/lib/community/comments-actions";
import { commentsIcons } from "./icon-map";

type Props = {
  commentId: string;
  isMine: boolean;
  canReport: boolean; // 미로그인이거나 본인 댓글이면 false
  onStartEdit: () => void;
  onStartReport: () => void;
};

/**
 * 댓글 우측 상단 ... 메뉴.
 * 본인: 수정/삭제
 * 타인: 신고 (로그인 사용자만)
 * 미로그인: 메뉴 자체 비노출.
 */
export function CommentActionsMenu({
  commentId,
  isMine,
  canReport,
  onStartEdit,
  onStartReport,
}: Props) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    function onMouseDown(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!isMine && !canReport) return null;

  const More = commentsIcons.more;
  const Pencil = commentsIcons.pencil;
  const Trash = commentsIcons.trash;
  const Flag = commentsIcons.flag;

  const onDelete = () => {
    if (!confirm("댓글을 삭제할까요? 삭제된 댓글은 복구되지 않습니다.")) return;
    startTransition(async () => {
      const r = await deleteCommentAction(commentId);
      if (!r?.ok) {
        alert(r && "error" in r ? r.error : "삭제에 실패했습니다.");
        return;
      }
      router.refresh();
      setOpen(false);
    });
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        aria-label="댓글 메뉴 열기"
        aria-haspopup="menu"
        aria-expanded={open}
        disabled={pending}
        className="inline-flex size-7 items-center justify-center rounded-md text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700"
      >
        <More className="size-4" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-20 mt-1 w-36 origin-top-right rounded-xl border border-zinc-200 bg-white p-1 shadow-lg"
        >
          {isMine && (
            <>
              <button
                role="menuitem"
                onClick={() => {
                  onStartEdit();
                  setOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm text-zinc-700 transition hover:bg-zinc-50"
              >
                <Pencil className="size-3.5" />
                수정
              </button>
              <button
                role="menuitem"
                onClick={onDelete}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm text-rose-600 transition hover:bg-rose-50"
              >
                <Trash className="size-3.5" />
                삭제
              </button>
            </>
          )}
          {!isMine && canReport && (
            <button
              role="menuitem"
              onClick={() => {
                onStartReport();
                setOpen(false);
              }}
              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm text-zinc-700 transition hover:bg-zinc-50"
            >
              <Flag className="size-3.5" />
              신고
            </button>
          )}
        </div>
      )}
    </div>
  );
}
