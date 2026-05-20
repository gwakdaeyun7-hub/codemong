import Link from "next/link";

import { AuthLayout } from "@/components/auth/auth-layout";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata = { title: "비밀번호 찾기 · CodeMong" };

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="비밀번호를 잊으셨나요?"
      description="가입하신 이메일을 입력하시면 비밀번호 재설정 링크를 보내드립니다."
      footer={
        <>
          비밀번호가 기억나셨나요?{" "}
          <Link
            href="/login"
            className="font-medium text-violet-600 hover:text-violet-700"
          >
            로그인으로 돌아가기
          </Link>
        </>
      }
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
