"use client";

import Link from "next/link";
import { useActionState, useState } from "react";

import { signInWithEmailAction, type ActionState } from "@/lib/auth/actions";
import { authIcons } from "./icon-map";
import { FieldError, FormFeedback } from "./form-feedback";

export function EmailLoginForm({ redirectTo }: { redirectTo?: string }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    signInWithEmailAction,
    null,
  );
  const [showPassword, setShowPassword] = useState(false);

  const fieldErrors = state && !state.ok ? state.fieldErrors : undefined;
  const Loader = authIcons.loader;
  const Mail = authIcons.mail;
  const Lock = authIcons.lock;
  const Eye = showPassword ? authIcons.eyeOff : authIcons.eye;

  return (
    <form action={formAction} className="space-y-4">
      <FormFeedback state={state} />

      {redirectTo && (
        <input type="hidden" name="redirectTo" value={redirectTo} />
      )}

      <div>
        <label
          htmlFor="email"
          className="block text-xs font-medium text-zinc-700"
        >
          이메일
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

      <div>
        <div className="flex items-center justify-between">
          <label
            htmlFor="password"
            className="block text-xs font-medium text-zinc-700"
          >
            비밀번호
          </label>
          <Link
            href="/forgot-password"
            className="text-xs font-medium text-violet-600 hover:text-violet-700"
          >
            비밀번호 찾기
          </Link>
        </div>
        <div className="relative mt-1.5">
          <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            placeholder="비밀번호를 입력하세요"
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

      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-sm font-semibold text-white shadow-sm transition hover:brightness-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending && <Loader className="size-4 animate-spin" />}
        로그인
      </button>
    </form>
  );
}
