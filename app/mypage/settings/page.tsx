import { redirect } from "next/navigation";

import { NicknameForm } from "@/components/mypage/nickname-form";
import { PasswordChangeForm } from "@/components/mypage/password-change-form";
import { SettingsSection } from "@/components/mypage/settings-section";
import { mypageIcons } from "@/components/mypage/icon-map";
import { getCurrentUser } from "@/lib/auth/get-user";

export const metadata = { title: "설정 · CodeMong" };

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/mypage/settings");

  const isEmailUser = user.provider === "email";
  const Warning = mypageIcons.warning;

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          설정
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          프로필 정보와 계정 보안을 관리하세요.
        </p>
      </header>

      <SettingsSection
        title="프로필"
        description="다른 학습자에게 보여질 표시 이름입니다."
      >
        <NicknameForm currentNickname={user.nickname} />
      </SettingsSection>

      {isEmailUser ? (
        <SettingsSection
          title="비밀번호"
          description="안전을 위해 정기적으로 변경하는 것을 권장합니다."
        >
          <PasswordChangeForm />
        </SettingsSection>
      ) : (
        <SettingsSection
          title="비밀번호"
          description={`${
            user.provider === "google" ? "Google" : user.provider === "kakao" ? "Kakao" : user.provider
          } 계정으로 가입하셨기 때문에 별도의 비밀번호가 없습니다.`}
        >
          <p className="text-sm text-zinc-600">
            소셜 로그인 계정의 비밀번호 변경은 해당 서비스에서 진행해주세요.
          </p>
        </SettingsSection>
      )}

      <SettingsSection
        title="계정 삭제"
        description="계정과 모든 학습 기록이 영구적으로 삭제됩니다."
        tone="danger"
      >
        <div className="flex items-start gap-3 rounded-xl bg-rose-50 p-4 text-sm text-rose-800">
          <Warning className="mt-0.5 size-4 shrink-0" />
          <div className="space-y-1">
            <p>
              계정 삭제는 현재 자동 처리되지 않습니다. 삭제를 원하시면{" "}
              <a
                href="mailto:support@codemong.kr?subject=계정%20삭제%20요청"
                className="font-medium underline underline-offset-2 hover:text-rose-900"
              >
                support@codemong.kr
              </a>{" "}
              로 문의해주세요.
            </p>
            <p className="text-xs text-rose-600">
              자동 삭제는 백엔드 라운드에서 추가될 예정입니다.
            </p>
          </div>
        </div>
      </SettingsSection>
    </div>
  );
}
