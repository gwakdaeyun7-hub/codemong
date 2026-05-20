import Link from "next/link";

import { AuthLayout } from "@/components/auth/auth-layout";
import { EmailSignupForm } from "@/components/auth/email-signup-form";
import { OAuthButtons } from "@/components/auth/oauth-buttons";
import { OrDivider } from "@/components/auth/or-divider";

export const metadata = { title: "회원가입 · CodeMong" };

export default function SignupPage() {
  return (
    <AuthLayout
      title="CodeMong 시작하기"
      description="이해한 만큼 자라는 학습. 지금 시작해보세요."
      footer={
        <>
          이미 계정이 있으신가요?{" "}
          <Link
            href="/login"
            className="font-medium text-violet-600 hover:text-violet-700"
          >
            로그인
          </Link>
        </>
      }
    >
      <OAuthButtons />
      <OrDivider />
      <EmailSignupForm />
    </AuthLayout>
  );
}
