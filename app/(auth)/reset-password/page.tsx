import { redirect } from "next/navigation";

import { AuthLayout } from "@/components/auth/auth-layout";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "비밀번호 재설정 · CodeMong" };

// 이 페이지는 메일 링크를 통해 들어온 임시 세션(recovery) 또는
// 일반 로그인 세션에서 접근 가능. 세션이 전혀 없으면 비밀번호 찾기로 돌려보냄.
export default async function ResetPasswordPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/forgot-password");
  }

  return (
    <AuthLayout
      title="새 비밀번호 설정"
      description="사용하실 새 비밀번호를 입력해주세요."
    >
      <ResetPasswordForm />
    </AuthLayout>
  );
}
