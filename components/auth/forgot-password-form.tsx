"use client";

import { useActionState } from "react";

import {
  requestPasswordResetAction,
  type ActionState,
} from "@/lib/auth/actions";
import { authIcons } from "./icon-map";
import { FieldError, FormFeedback } from "./form-feedback";

export function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    requestPasswordResetAction,
    null,
  );
  const fieldErrors = state && !state.ok ? state.fieldErrors : undefined;
  const Loader = authIcons.loader;
  const Mail = authIcons.mail;

  return (
    <form action={formAction} className="space-y-4">
      <FormFeedback state={state} />

      <div>
        <label
          htmlFor="email"
          className="block text-xs font-medium text-zinc-700"
        >
          가입한 이메일
        </label>
        <div className="relative mt-1.5">
          <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            placeholder="you@example.com"
            className="h-11 w-full rounded-xl border border-zinc-200 bg-white pl-10 pr-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100"
          />
        </div>
        <FieldError message={fieldErrors?.email} />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-sm font-semibold text-white shadow-sm transition hover:brightness-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending && <Loader className="size-4 animate-spin" />}
        재설정 링크 받기
      </button>
    </form>
  );
}
