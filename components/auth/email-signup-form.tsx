"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { signUpWithEmailAction, type ActionState } from "@/lib/auth/actions";
import { authIcons } from "./icon-map";
import { FieldError, FormFeedback } from "./form-feedback";

export function EmailSignupForm() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    signUpWithEmailAction,
    null,
  );
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // 가입 성공 시 안내 페이지로 이동 (메일에 입력한 주소를 query로 전달).
  useEffect(() => {
    if (state?.ok && state.message) {
      router.push(`/verify-email?email=${encodeURIComponent(state.message)}`);
    }
  }, [state, router]);

  const fieldErrors = state && !state.ok ? state.fieldErrors : undefined;
  const Loader = authIcons.loader;
  const Mail = authIcons.mail;
  const Lock = authIcons.lock;
  const User = authIcons.user;
  const Eye = showPassword ? authIcons.eyeOff : authIcons.eye;

  return (
    <form action={formAction} className="space-y-4">
      <FormFeedback state={state?.ok ? null : state} />

      <div>
        <label
          htmlFor="nickname"
          className="block text-xs font-medium text-zinc-700"
        >
          닉네임
        </label>
        <div className="relative mt-1.5">
          <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
          <input
            id="nickname"
            name="nickname"
            type="text"
            autoComplete="nickname"
            required
            minLength={2}
            maxLength={16}
            placeholder="다른 학습자에게 보여질 이름"
            className="h-11 w-full rounded-xl border border-zinc-200 bg-white pl-10 pr-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100"
          />
        </div>
        <FieldError message={fieldErrors?.nickname} />
      </div>

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
        <label
          htmlFor="password"
          className="block text-xs font-medium text-zinc-700"
        >
          비밀번호
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

      <p className="text-xs text-zinc-500">
        가입 시 CodeMong 의 서비스 정책에 동의하는 것으로 간주됩니다.
      </p>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-sm font-semibold text-white shadow-sm transition hover:brightness-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending && <Loader className="size-4 animate-spin" />}
        회원가입
      </button>
    </form>
  );
}
