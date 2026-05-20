"use client";

import { useActionState, useEffect, useRef } from "react";

import {
  createLessonCommentAction,
  createPostCommentAction,
  updateCommentAction,
  type ActionState,
} from "@/lib/community/comments-actions";
import { FieldError, FormFeedback } from "@/components/auth/form-feedback";
import { commentsIcons } from "./icon-map";

type Target =
  | { kind: "lesson"; lessonRef: string }
  | { kind: "post"; postId: string };

type Create = {
  mode: "create";
  target: Target;
  parentId?: string;
  placeholder?: string;
  onDone?: () => void;
  onCancel?: () => void;
};
type Edit = {
  mode: "edit";
  commentId: string;
  initialBody: string;
  onDone?: () => void;
  onCancel?: () => void;
};

type Props = Create | Edit;

export function CommentForm(props: Props) {
  const action =
    props.mode === "edit"
      ? updateCommentAction
      : props.target.kind === "lesson"
        ? createLessonCommentAction
        : createPostCommentAction;

  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    action,
    null,
  );

  const formRef = useRef<HTMLFormElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // 작성 성공 시 폼 초기화 + onDone 콜백
  useEffect(() => {
    if (state?.ok) {
      formRef.current?.reset();
      props.onDone?.();
    }
  }, [state, props]);

  const Loader = commentsIcons.loader;
  const fieldErrors = state && !state.ok ? state.fieldErrors : undefined;
  const isReply = props.mode === "create" && props.parentId !== undefined;

  return (
    <form action={formAction} ref={formRef} className="space-y-2">
      <FormFeedback state={state?.ok ? null : state} />

      {/* hidden fields */}
      {props.mode === "create" && props.target.kind === "lesson" && (
        <input type="hidden" name="lessonRef" value={props.target.lessonRef} />
      )}
      {props.mode === "create" && props.target.kind === "post" && (
        <input type="hidden" name="postId" value={props.target.postId} />
      )}
      {props.mode === "create" && props.parentId !== undefined && (
        <input type="hidden" name="parentId" value={props.parentId} />
      )}
      {props.mode === "edit" && (
        <input type="hidden" name="commentId" value={props.commentId} />
      )}

      <textarea
        ref={textareaRef}
        name="body"
        defaultValue={props.mode === "edit" ? props.initialBody : ""}
        placeholder={
          props.mode === "edit"
            ? "댓글 수정"
            : props.placeholder
              ? props.placeholder
              : isReply
                ? "답글을 입력하세요…"
                : "댓글을 입력하세요. 입문자도 함께 보고 있어요."
        }
        rows={isReply || props.mode === "edit" ? 2 : 3}
        maxLength={1000}
        required
        className="w-full resize-y rounded-xl border border-zinc-200 bg-white p-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100"
      />
      <FieldError message={fieldErrors?.body} />

      <div className="flex items-center justify-end gap-2">
        {(props.mode === "edit" || isReply) && (
          <button
            type="button"
            onClick={() => {
              if (props.mode === "edit") props.onCancel?.();
              else props.onDone?.();
            }}
            className="inline-flex h-9 items-center rounded-lg px-3 text-sm font-medium text-zinc-600 hover:bg-zinc-100"
          >
            취소
          </button>
        )}
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-zinc-900 px-4 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending && <Loader className="size-3.5 animate-spin" />}
          {props.mode === "edit" ? "수정" : isReply ? "답글 등록" : "등록"}
        </button>
      </div>
    </form>
  );
}
