import { createClient } from "@/lib/supabase/server";

export type CurrentUser = {
  id: string;
  email: string;
  nickname: string;
  avatarUrl: string | null;
  provider: string; // "email" | "google" | "kakao"
};

/**
 * 현재 로그인한 사용자 정보. 미로그인이면 null.
 * Server Component / Route Handler 에서 호출.
 *
 * nickname 우선순위:
 *   1) user_metadata.nickname (가입 폼에서 입력)
 *   2) user_metadata.full_name / name (OAuth provider가 주는 표시명)
 *   3) email의 @ 앞 부분 (fallback)
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;

  const u = data.user;
  const meta = (u.user_metadata ?? {}) as Record<string, unknown>;
  const nickname =
    (typeof meta.nickname === "string" && meta.nickname.trim()) ||
    (typeof meta.full_name === "string" && meta.full_name.trim()) ||
    (typeof meta.name === "string" && meta.name.trim()) ||
    (u.email?.split("@")[0] ?? "사용자");

  return {
    id: u.id,
    email: u.email ?? "",
    nickname,
    avatarUrl: typeof meta.avatar_url === "string" ? meta.avatar_url : null,
    provider: u.app_metadata?.provider ?? "email",
  };
}
