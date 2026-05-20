import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// 인증이 반드시 필요한 경로. 미로그인 시 /login?next=<원래경로> 로 보냄.
const PROTECTED_PREFIXES = ["/mypage"];

// 로그인 상태에서 들어오면 홈으로 돌려보낼 경로.
const AUTH_ONLY_PREFIXES = ["/login", "/signup", "/forgot-password"];

function matches(pathname: string, prefixes: string[]): boolean {
  return prefixes.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

// Next.js 16: `middleware` → `proxy` 로 rename. 시그니처/동작은 동일.
export async function proxy(request: NextRequest) {
  const { response, user } = await updateSession(request);
  const { pathname, search } = request.nextUrl;

  // 보호 경로인데 미로그인 → 로그인 페이지로
  if (!user && matches(pathname, PROTECTED_PREFIXES)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    url.searchParams.set("next", pathname + (search || ""));
    return NextResponse.redirect(url);
  }

  // 이미 로그인했는데 로그인/회원가입 페이지 접근 → 홈으로
  // 단, /reset-password 는 비밀번호 재설정 메일 링크의 임시 세션에서 접근하므로 예외.
  if (user && matches(pathname, AUTH_ONLY_PREFIXES)) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  // 정적 자원과 이미지 / 파비콘은 미들웨어 제외 (불필요한 Auth 서버 호출 방지)
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4|mp3|json|ico|css|js)$).*)",
  ],
};
