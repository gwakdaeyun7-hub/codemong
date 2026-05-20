"use client";

import { useActionState, useState } from "react";

import { updatePasswordAction, type ActionState } from "@/lib/auth/actions";
import { FieldError, FormFeedback } from "@/components/auth/form-feedback";
import { authIcons } from "@/components/auth/icon-map";

export function PasswordChangeForm() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    updatePasswordAction,
    null,
  );
  const [showPassword, setShowPassword] = useState(false);
  const fieldErrors = state && !state.ok ? state.fieldErrors : undefined;
  const Loader = authIcons.loader;
  const Eye = showPassword ? authIcons.eyeOff : authIcons.eye;

  return (
    <form action={formAction} className="space-y-3">
      <FormFeedback state={state} />

      <div>
        <label
          htmlFor="new-password"
          className="block text-xs font-medium text-zinc-700"
        >
          새 비밀번호
        </label>
        <div className="relative mt-1.5">
          <input
            id="new-password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            minLength={8}
            placeholder="8자 이상"
            autoComplete="new-password"
            className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 pr-10 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100"
          />
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
            className="absolute right-2 top-1/2 inline-flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-zinc-400 hover:text-zinc-600"
          >
            <Eye className="size-4" />
          </button>
        </div>
        <FieldError message={fieldErrors?.password} />
      </div>

      <div>
        <label
          htmlFor="new-password-confirm"
          className="block text-xs font-medium text-zinc-700"
        >
          새 비밀번호 확인
        </label>
        <input
          id="new-password-confirm"
          name="passwordConfirm"
          type={showPassword ? "text" : "password"}
          required
          minLength={8}
          placeholder="다시 한 번 입력"
          autoComplete="new-password"
          className="mt-1.5 h-11 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100"
        />
        <FieldError message={fieldErrors?.passwordConfirm} />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending && <Loader className="size-4 animate-spin" />}
        비밀번호 변경
      </button>
    </form>
  );
}
