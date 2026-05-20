import Link from "next/link";
import { Mail } from "lucide-react";

import { AuthLayout } from "@/components/auth/auth-layout";

export const metadata = { title: "이메일 인증 · CodeMong" };

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;

  return (
    <AuthLayout
      title="이메일을 확인해주세요"
      footer={
        <>
          잘못된 이메일을 입력하셨나요?{" "}
          <Link
            href="/signup"
            className="font-medium text-violet-600 hover:text-violet-700"
          >
            다시 가입하기
          </Link>
        </>
      }
    >
      <div className="space-y-5 text-sm text-zinc-700">
        <div className="inline-flex size-12 items-center justify-center rounded-2xl bg-violet-50">
          <Mail className="size-6 text-violet-600" />
        </div>

        <div className="space-y-2">
          <p>
            {email ? (
              <>
                <span className="font-medium text-zinc-900">{email}</span> 로
                인증 메일을 보냈습니다.
              </>
            ) : (
              <>입력하신 이메일로 인증 메일을 보냈습니다.</>
            )}
          </p>
          <p className="text-zinc-500">
            메일의 링크를 클릭하면 가입이 완료됩니다. 메일이 보이지 않는다면
            스팸함도 확인해주세요.
          </p>
        </div>

        <Link
          href="/login"
          className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-zinc-200 bg-white text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
        >
          로그인 화면으로
        </Link>
      </div>
    </AuthLayout>
  );
}
