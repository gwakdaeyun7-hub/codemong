"use client";

import { useState } from "react";

import type { CommentNode } from "@/lib/community/types";
import { timeAgoKo } from "@/lib/format";
import { CommentActionsMenu } from "./comment-actions-menu";
import { CommentForm } from "./comment-form";
import { commentsIcons } from "./icon-map";
import { LikeButton } from "./like-button";
import { ReportForm } from "./report-form";

type Target =
  | { kind: "lesson"; lessonRef: string }
  | { kind: "post"; postId: string };

type Props = {
  node: CommentNode;
  target: Target;
  canInteract: boolean; // 로그인 여부
  depth?: 0 | 1; // 0=최상위, 1=답글. 1에선 답글 작성 불가
};

export function CommentItem({ node, target, canInteract, depth = 0 }: Props) {
  const [editing, setEditing] = useState(false);
  const [replyOpen, setReplyOpen] = useState(false);
  const [reporting, setReporting] = useState(false);

  const Reply = commentsIcons.reply;
  const isDeleted = node.deletedAt !== null;

  const initial = (node.authorNickname || "•").charAt(0).toUpperCase();
  const canReply = depth === 0 && canInteract && !isDeleted;

  return (
    <article
      className={
        depth === 0
          ? "rounded-2xl border border-zinc-200 bg-white p-4"
          : "border-t border-zinc-100 pt-3"
      }
      aria-label="댓글"
    >
      <header className="flex items-start gap-3">
        {/* 아바타 */}
        {node.authorAvatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={node.authorAvatarUrl}
            alt=""
            className="size-8 shrink-0 rounded-full object-cover"
          />
        ) : (
          <div className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-xs font-bold text-white">
            {isDeleted ? "·" : initial}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="truncate text-sm font-semibold text-zinc-900">
                {isDeleted ? "(삭제됨)" : node.authorNickname}
              </span>
              <span className="text-xs text-zinc-400">
                {timeAgoKo(node.createdAt)}
                {!isDeleted &&
                  node.updatedAt.getTime() - node.createdAt.getTime() > 1000 && (
                    <span className="ml-1">· 수정됨</span>
                  )}
              </span>
            </div>
            {!isDeleted && (
              <CommentActionsMenu
                commentId={node.id}
                isMine={node.isMine}
                canReport={canInteract && !node.isMine}
                onStartEdit={() => setEditing(true)}
                onStartReport={() => setReporting(true)}
              />
            )}
          </div>

          {/* 본문 또는 수정 폼 */}
          <div className="mt-1.5">
            {editing && !isDeleted ? (
              <CommentForm
                mode="edit"
                commentId={node.id}
                initialBody={node.body}
                onDone={() => setEditing(false)}
                onCancel={() => setEditing(false)}
              />
            ) : (
              <p
                className={
                  isDeleted
                    ? "whitespace-pre-wrap text-sm italic text-zinc-400"
                    : "whitespace-pre-wrap break-words text-sm text-zinc-700"
                }
              >
                {node.body}
              </p>
            )}
          </div>

          {/* 액션 row */}
          {!editing && !isDeleted && (
            <div className="mt-2.5 flex flex-wrap items-center gap-2">
              <LikeButton
                target={{ kind: "comment", commentId: node.id }}
                count={node.likeCount}
                liked={node.likedByMe}
                disabled={!canInteract}
                size="sm"
              />
              {canReply && (
                <button
                  type="button"
                  onClick={() => setReplyOpen((p) => !p)}
                  className="inline-flex h-7 items-center gap-1 rounded-full bg-white px-2 text-xs font-medium text-zinc-600 ring-1 ring-zinc-200 transition hover:bg-zinc-50"
                >
                  <Reply className="size-3.5" />
                  {replyOpen ? "답글 접기" : "답글"}
                </button>
              )}
            </div>
          )}

          {/* 답글 폼 펼침 */}
          {replyOpen && canReply && (
            <div className="mt-3">
              <CommentForm
                mode="create"
                target={target}
                parentId={node.id}
                onDone={() => setReplyOpen(false)}
              />
            </div>
          )}

          {/* 신고 폼 펼침 */}
          {reporting && (
            <div className="mt-3">
              <ReportForm
                target={{ kind: "comment", commentId: node.id }}
                onDone={() => setReporting(false)}
                onCancel={() => setReporting(false)}
              />
            </div>
          )}
        </div>
      </header>

      {/* 답글 리스트 */}
      {node.replies.length > 0 && (
        <div className="mt-3 space-y-3 border-l-2 border-zinc-100 pl-4">
          {node.replies.map((r) => (
            <CommentItem
              key={r.id}
              node={r}
              target={target}
              canInteract={canInteract}
              depth={1}
            />
          ))}
        </div>
      )}
    </article>
  );
}
