"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { updatePasswordAction, type ActionState } from "@/lib/auth/actions";
import { authIcons } from "./icon-map";
import { FieldError, FormFeedback } from "./form-feedback";

export function ResetPasswordForm() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    updatePasswordAction,
    null,
  );
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // 변경 성공 시 1.2초 안내 후 홈으로 이동.
  useEffect(() => {
    if (state?.ok) {
      const t = setTimeout(() => router.push("/"), 1200);
      return () => clearTimeout(t);
    }
  }, [state, router]);

  const fieldErrors = state && !state.ok ? state.fieldErrors : undefined;
  const Loader = authIcons.loader;
  const Lock = authIcons.lock;
  const Eye = showPassword ? authIcons.eyeOff : authIcons.eye;

  return (
    <form action={formAction} className="space-y-4">
      <FormFeedback state={state} />

      <div>
        <label
          htmlFor="password"
          className="block text-xs font-medium text-zinc-700"
        >
          새 비밀번호
        </label>
        <div className="relative mt-1.5">
          <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            minLength={8}
            placeholder="8자 이상"
            className="h-11 w-full rounded-xl border border-zinc-200 bg-white pl-10 pr-10 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100"
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
          htmlFor="passwordConfirm"
          className="block text-xs font-medium text-zinc-700"
        >
          새 비밀번호 확인
        </label>
        <div className="relative mt-1.5">
          <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
          <input
            id="passwordConfirm"
            name="passwordConfirm"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            minLength={8}
            placeholder="다시 한 번 입력"
            className="h-11 w-full rounded-xl border border-zinc-200 bg-white pl-10 pr-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100"
          />
        </div>
        <FieldError message={fieldErrors?.passwordConfirm} />
      </div>

      <button
        type="submit"
        disabled={pending || state?.ok}
        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-sm font-semibold text-white shadow-sm transition hover:brightness-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending && <Loader className="size-4 animate-spin" />}
        비밀번호 변경
      </button>
    </form>
  );
}
