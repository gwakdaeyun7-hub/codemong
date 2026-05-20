import Link from "next/link";

import { AuthLayout } from "@/components/auth/auth-layout";
import { EmailLoginForm } from "@/components/auth/email-login-form";
import { OAuthButtons } from "@/components/auth/oauth-buttons";
import { OrDivider } from "@/components/auth/or-divider";

export const metadata = { title: "로그인 · CodeMong" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const params = await searchParams;
  const next = params.next ?? "/";
  const oauthError = params.error;

  return (
    <AuthLayout
      title="다시 만나서 반가워요"
      description="이메일로 로그인하거나 소셜 계정으로 빠르게 시작하세요."
      footer={
        <>
          아직 계정이 없으신가요?{" "}
          <Link
            href="/signup"
            className="font-medium text-violet-600 hover:text-violet-700"
          >
            회원가입
          </Link>
        </>
      }
    >
      {oauthError && (
        <div
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm text-rose-700"
        >
          {oauthError}
        </div>
      )}

      <OAuthButtons />
      <OrDivider />
      <EmailLoginForm redirectTo={next} />
    </AuthLayout>
  );
}
