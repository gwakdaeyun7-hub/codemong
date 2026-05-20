import { NextResponse, type NextRequest } from "next/server";

import { createClient } from "@/lib/supabase/server";

/**
 * OAuth (Google / Kakao) / 이메일 인증 / 비밀번호 재설정의 공통 콜백.
 *
 * Supabase가 주는 query string:
 *   - code: 교환 가능한 인증 코드 (PKCE)
 *   - next: 교환 성공 후 보낼 경로 (requestPasswordReset 에서 우리가 직접 부여)
 *   - error / error_description: 실패 사유
 *
 * 흐름:
 *   1) error 가 있으면 /login 에 에러 메시지 달아 리다이렉트
 *   2) code 가 있으면 exchangeCodeForSession 으로 세션 확립 → next 로 리다이렉트
 *   3) 그 외(둘 다 없음)에는 /login 으로 안전하게 안내
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";
  const errorDescription =
    searchParams.get("error_description") ?? searchParams.get("error");

  if (errorDescription) {
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(errorDescription)}`,
    );
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(
        "인증 처리 중 문제가 발생했습니다. 다시 시도해주세요.",
      )}`,
    );
  }

  return NextResponse.redirect(`${origin}/login`);
}
