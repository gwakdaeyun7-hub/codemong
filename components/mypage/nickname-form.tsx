"use client";

import { useActionState } from "react";

import { updateNicknameAction, type ActionState } from "@/lib/auth/actions";
import { FieldError, FormFeedback } from "@/components/auth/form-feedback";
import { authIcons } from "@/components/auth/icon-map";

export function NicknameForm({ currentNickname }: { currentNickname: string }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    updateNicknameAction,
    null,
  );
  const fieldErrors = state && !state.ok ? state.fieldErrors : undefined;
  const Loader = authIcons.loader;

  return (
    <form action={formAction} className="space-y-3">
      <FormFeedback state={state} />

      <div>
        <label
          htmlFor="nickname"
          className="block text-xs font-medium text-zinc-700"
        >
          닉네임
        </label>
        <input
          id="nickname"
          name="nickname"
          type="text"
          required
          minLength={2}
          maxLength={16}
          defaultValue={currentNickname}
          autoComplete="nickname"
          className="mt-1.5 h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100"
        />
        <FieldError message={fieldErrors?.nickname} />
        <p className="mt-1.5 text-xs text-zinc-500">
          다른 학습자에게 표시되는 이름입니다. 2~16자.
        </p>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending && <Loader className="size-4 animate-spin" />}
        변경 저장
      </button>
    </form>
  );
}
