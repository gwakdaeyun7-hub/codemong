"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import {
  translateAuthError,
  validateEmail,
  validateNickname,
  validatePassword,
  type FieldErrors,
} from "./validation";

export type ActionState =
  | { ok: true; message?: string }
  | { ok: false; error: string; fieldErrors?: FieldErrors }
  | null;

// origin 우선순위:
//   1) request headers의 origin (정확한 protocol+host)
//   2) NEXT_PUBLIC_SITE_URL (fallback, 프로덕션 배포 환경)
//   3) http://localhost:3000 (마지막 fallback)
async function getOrigin(): Promise<string> {
  const h = await headers();
  return (
    h.get("origin") ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000"
  );
}

// ─── 이메일 로그인 ─────────────────────────────────────────────
export async function signInWithEmailAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const fieldErrors: FieldErrors = {};
  const emailErr = validateEmail(email);
  if (emailErr) fieldErrors.email = emailErr;
  if (!password) fieldErrors.password = "비밀번호를 입력해주세요.";
  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, error: "입력값을 확인해주세요.", fieldErrors };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { ok: false, error: translateAuthError(error.message) };

  revalidatePath("/", "layout");
  const redirectTo = String(formData.get("redirectTo") ?? "/");
  redirect(redirectTo);
}

// ─── 이메일 회원가입 ───────────────────────────────────────────
export async function signUpWithEmailAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const nickname = String(formData.get("nickname") ?? "").trim();

  const fieldErrors: FieldErrors = {};
  const emailErr = validateEmail(email);
  if (emailErr) fieldErrors.email = emailErr;
  const passwordErr = validatePassword(password);
  if (passwordErr) fieldErrors.password = passwordErr;
  const nicknameErr = validateNickname(nickname);
  if (nicknameErr) fieldErrors.nickname = nicknameErr;
  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, error: "입력값을 확인해주세요.", fieldErrors };
  }

  const supabase = await createClient();
  const origin = await getOrigin();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { nickname },
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });
  if (error) return { ok: false, error: translateAuthError(error.message) };

  // 이메일 확인이 활성화된 상태에서는 세션이 잡히지 않고 메일이 발송됨.
  // 호출 측은 ok 응답을 받고 /verify-email 안내 페이지로 리다이렉트한다.
  return { ok: true, message: email };
}

// ─── OAuth (Google / Kakao) ───────────────────────────────────
async function signInWithOAuth(provider: "google" | "kakao"): Promise<never> {
  const supabase = await createClient();
  const origin = await getOrigin();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: `${origin}/auth/callback` },
  });
  if (error || !data.url) {
    // OAuth 시작 자체가 실패한 경우 — 환경 설정 문제일 가능성이 큼.
    // login 페이지로 에러 쿼리 달아 돌려보냄.
    redirect(`/login?error=${encodeURIComponent(translateAuthError(error?.message ?? ""))}`);
  }
  redirect(data.url);
}

export async function signInWithGoogleAction(): Promise<never> {
  return signInWithOAuth("google");
}

export async function signInWithKakaoAction(): Promise<never> {
  return signInWithOAuth("kakao");
}

// ─── 로그아웃 ────────────────────────────────────────────────
export async function signOutAction(): Promise<never> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

// ─── 비밀번호 재설정 요청 (이메일 발송) ───────────────────────
export async function requestPasswordResetAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const email = String(formData.get("email") ?? "");
  const emailErr = validateEmail(email);
  if (emailErr) {
    return { ok: false, error: "입력값을 확인해주세요.", fieldErrors: { email: emailErr } };
  }

  const supabase = await createClient();
  const origin = await getOrigin();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/reset-password`,
  });
  if (error) return { ok: false, error: translateAuthError(error.message) };

  return { ok: true, message: "재설정 링크를 이메일로 보냈습니다." };
}

// ─── 새 비밀번호 설정 (메일 링크로 진입한 직후, 또는 로그인 상태에서 변경) ─
export async function updatePasswordAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const password = String(formData.get("password") ?? "");
  const passwordConfirm = String(formData.get("passwordConfirm") ?? "");

  const fieldErrors: FieldErrors = {};
  const passwordErr = validatePassword(password);
  if (passwordErr) fieldErrors.password = passwordErr;
  if (password !== passwordConfirm) fieldErrors.passwordConfirm = "비밀번호가 일치하지 않습니다.";
  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, error: "입력값을 확인해주세요.", fieldErrors };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { ok: false, error: translateAuthError(error.message) };

  return { ok: true, message: "비밀번호가 변경되었습니다." };
}

// ─── 닉네임 변경 (user_metadata.nickname) ─────────────────────
export async function updateNicknameAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const nickname = String(formData.get("nickname") ?? "").trim();
  const nicknameErr = validateNickname(nickname);
  if (nicknameErr) {
    return { ok: false, error: "입력값을 확인해주세요.", fieldErrors: { nickname: nicknameErr } };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ data: { nickname } });
  if (error) return { ok: false, error: translateAuthError(error.message) };

  revalidatePath("/mypage", "layout");
  revalidatePath("/", "layout");
  return { ok: true, message: "닉네임이 변경되었습니다." };
}
