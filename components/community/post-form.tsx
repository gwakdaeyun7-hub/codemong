"use client";

import { useActionState } from "react";

import {
  createPostAction,
  updatePostAction,
  type ActionState,
} from "@/lib/community/posts-actions";
import { FieldError, FormFeedback } from "@/components/auth/form-feedback";
import { communityIcons } from "./icon-map";

type Props =
  | { mode: "create" }
  | {
      mode: "edit";
      postId: string;
      initialCategory: "question" | "free";
      initialTitle: string;
      initialBody: string;
    };

export function PostForm(props: Props) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    props.mode === "edit" ? updatePostAction : createPostAction,
    null,
  );
  const fieldErrors = state && !state.ok ? state.fieldErrors : undefined;
  const Loader = communityIcons.loader;

  return (
    <form action={formAction} className="space-y-5">
      <FormFeedback state={state?.ok ? null : state} />

      {props.mode === "edit" && (
        <input type="hidden" name="postId" value={props.postId} />
      )}

      {props.mode === "create" ? (
        <fieldset className="space-y-1.5">
          <legend className="text-xs font-medium text-zinc-700">카테고리</legend>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: "question", label: "Q&A — 학습 질문" },
              { value: "free", label: "자유 — 학습기 · 잡담" },
            ].map((c, i) => (
              <label
                key={c.value}
                className="flex cursor-pointer items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm transition has-checked:border-violet-500 has-checked:bg-violet-50 has-checked:text-violet-700"
              >
                <input
                  type="radio"
                  name="category"
                  value={c.value}
                  defaultChecked={i === 0}
                  required
                  className="size-3.5 accent-violet-600"
                />
                {c.label}
              </label>
            ))}
          </div>
        </fieldset>
      ) : (
        // 수정 시에는 카테고리 고정 (제목/본문만 변경 가능)
        <p className="text-xs text-zinc-500">
          카테고리는 변경할 수 없습니다 ({props.initialCategory === "question" ? "Q&A" : "자유"}).
        </p>
      )}

      <div>
        <label htmlFor="title" className="block text-xs font-medium text-zinc-700">
          제목
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          minLength={2}
          maxLength={80}
          defaultValue={props.mode === "edit" ? props.initialTitle : ""}
          placeholder="궁금한 점이나 공유할 내용을 한 줄로"
          className="mt-1.5 h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100"
        />
        <FieldError message={fieldErrors?.title} />
      </div>

      <div>
        <label htmlFor="body" className="block text-xs font-medium text-zinc-700">
          내용
        </label>
        <textarea
          id="body"
          name="body"
          required
          maxLength={5000}
          rows={12}
          defaultValue={props.mode === "edit" ? props.initialBody : ""}
          placeholder={
            props.mode === "edit"
              ? ""
              : "어떤 부분에서 막혔는지, 어떻게 해보려고 했는지 적어주시면 다른 학습자가 더 잘 도와줄 수 있어요."
          }
          className="mt-1.5 w-full resize-y rounded-xl border border-zinc-200 bg-white p-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100"
        />
        <FieldError message={fieldErrors?.body} />
      </div>

      <div className="flex items-center justify-end gap-2">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending && <Loader className="size-4 animate-spin" />}
          {props.mode === "edit" ? "수정 저장" : "등록"}
        </button>
      </div>
    </form>
  );
}
