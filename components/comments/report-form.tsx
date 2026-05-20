"use client";

import { useActionState } from "react";

import { FieldError, FormFeedback } from "@/components/auth/form-feedback";
import { reportCommentAction } from "@/lib/community/comments-actions";
import { reportPostAction } from "@/lib/community/posts-actions";
import { REPORT_REASONS } from "@/lib/community/types";
import type { FieldErrors } from "@/lib/community/validation";
import { commentsIcons } from "./icon-map";

type Props = {
  target: { kind: "comment"; commentId: string } | { kind: "post"; postId: string };
  onDone?: () => void;
  onCancel?: () => void;
};

// 신고는 응답 data 필드를 사용하지 않으므로 통합 state 로 좁힘.
type ReportState =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: FieldErrors }
  | null;

type ReportAction = (state: ReportState, fd: FormData) => Promise<ReportState>;

export function ReportForm({ target, onDone, onCancel }: Props) {
  // 두 action 의 ActionState 가 동형(데이터 미사용)이라 cast 로 통합.
  const action = (
    target.kind === "comment" ? reportCommentAction : reportPostAction
  ) as unknown as ReportAction;

  const [state, formAction, pending] = useActionState<ReportState, FormData>(
    action,
    null,
  );
  const Loader = commentsIcons.loader;
  const fieldErrors = state && !state.ok ? state.fieldErrors : undefined;

  // 성공 시 자동 닫힘
  if (state?.ok) {
    setTimeout(() => onDone?.(), 800);
  }

  return (
    <form
      action={formAction}
      className="space-y-3 rounded-xl border border-zinc-200 bg-zinc-50/60 p-3"
    >
      <FormFeedback state={state} />

      {target.kind === "comment" ? (
        <input type="hidden" name="commentId" value={target.commentId} />
      ) : (
        <input type="hidden" name="postId" value={target.postId} />
      )}

      <fieldset className="space-y-1.5">
        <legend className="text-xs font-medium text-zinc-700">신고 사유</legend>
        <div className="grid grid-cols-2 gap-1.5">
          {REPORT_REASONS.map((r) => (
            <label
              key={r.value}
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs has-checked:border-violet-500 has-checked:bg-violet-50 has-checked:text-violet-700"
            >
              <input
                type="radio"
                name="reason"
                value={r.value}
                required
                className="size-3 accent-violet-600"
              />
              {r.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="report-detail" className="block text-xs font-medium text-zinc-700">
          상세 설명 <span className="text-zinc-400">(기타 선택 시 필수)</span>
        </label>
        <textarea
          id="report-detail"
          name="detail"
          rows={2}
          maxLength={200}
          placeholder="구체적인 사유를 적어주세요."
          className="mt-1 w-full resize-y rounded-lg border border-zinc-200 bg-white p-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100"
        />
        <FieldError message={fieldErrors?.detail} />
      </div>

      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex h-8 items-center rounded-lg px-3 text-xs font-medium text-zinc-600 hover:bg-zinc-100"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={pending || state?.ok}
          className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-rose-600 px-3 text-xs font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending && <Loader className="size-3 animate-spin" />}
          신고하기
        </button>
      </div>
    </form>
  );
}
