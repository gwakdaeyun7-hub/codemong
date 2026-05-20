// 회원가입/로그인/프로필 변경에 쓰이는 입력 검증 헬퍼.
// zod 같은 외부 의존성 없이 native로 — 회원가입 폼 규모가 작아 충분.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NICKNAME_RE = /^[\p{L}\p{N}_\- ]+$/u; // 한글/영문/숫자/언더스코어/하이픈/공백

export type FieldErrors = Record<string, string>;

export function validateEmail(value: string): string | null {
  const v = value.trim();
  if (!v) return "이메일을 입력해주세요.";
  if (v.length > 254) return "이메일이 너무 깁니다.";
  if (!EMAIL_RE.test(v)) return "이메일 형식이 올바르지 않습니다.";
  return null;
}

export function validatePassword(value: string): string | null {
  if (!value) return "비밀번호를 입력해주세요.";
  if (value.length < 8) return "비밀번호는 8자 이상이어야 합니다.";
  if (value.length > 72) return "비밀번호는 72자 이하여야 합니다.";
  return null;
}

export function validateNickname(value: string): string | null {
  const v = value.trim();
  if (!v) return "닉네임을 입력해주세요.";
  if (v.length < 2) return "닉네임은 2자 이상이어야 합니다.";
  if (v.length > 16) return "닉네임은 16자 이하여야 합니다.";
  if (!NICKNAME_RE.test(v)) return "닉네임에 사용할 수 없는 문자가 포함되어 있습니다.";
  return null;
}

// Supabase 에러를 사용자 친화적인 한국어 메시지로 매핑.
// 정확한 에러 코드 목록은 Supabase가 자주 바꾸므로 message 패턴 매칭으로 처리.
export function translateAuthError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials")) return "이메일 또는 비밀번호가 올바르지 않습니다.";
  if (m.includes("email not confirmed")) return "이메일 인증이 완료되지 않았습니다. 받은편지함을 확인해주세요.";
  if (m.includes("user already registered")) return "이미 가입된 이메일입니다.";
  if (m.includes("password should be at least")) return "비밀번호가 너무 짧습니다.";
  if (m.includes("rate limit")) return "요청이 너무 잦습니다. 잠시 후 다시 시도해주세요.";
  if (m.includes("for security purposes")) return "보안을 위해 잠시 후 다시 시도해주세요.";
  if (m.includes("invalid email")) return "이메일 형식이 올바르지 않습니다.";
  if (m.includes("token has expired")) return "링크가 만료되었습니다. 다시 요청해주세요.";
  return "처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
}
