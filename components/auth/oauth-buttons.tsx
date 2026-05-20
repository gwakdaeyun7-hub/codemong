import {
  signInWithGoogleAction,
  signInWithKakaoAction,
} from "@/lib/auth/actions";

// Kakao OAuth provider 가 Supabase Dashboard 에 아직 등록되지 않은 상태.
// 등록 완료(Kakao Developers + Supabase Auth Providers 양쪽 셋업)되면 true 로 변경.
const KAKAO_ENABLED = false;

/**
 * OAuth provider 버튼 그룹 (Google / Kakao).
 * 각 버튼은 Server Action을 form action으로 사용해 안전하게 호출 (CSRF 보호 자동).
 *
 * 로고는 외부 이미지 의존성을 피하기 위해 인라인 SVG 사용.
 * 한국 학습자 비중을 고려해 Kakao를 위에 배치 (활성화 시).
 */
export function OAuthButtons() {
  // 사용 안 하는 action 이라도 import 는 유지 — KAKAO_ENABLED 토글 시 즉시 재사용.
  void signInWithKakaoAction;

  return (
    <div className="space-y-2">
      {KAKAO_ENABLED && (
        <form action={signInWithKakaoAction}>
          <button
            type="submit"
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#FEE500] px-4 text-sm font-medium text-[#191600] transition hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FEE500]"
          >
            <KakaoIcon className="size-4" />
            카카오로 계속하기
          </button>
        </form>
      )}

      <form action={signInWithGoogleAction}>
        <button
          type="submit"
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
        >
          <GoogleIcon className="size-4" />
          Google로 계속하기
        </button>
      </form>
    </div>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="#EA4335"
        d="M12 5c1.617 0 3.077.557 4.224 1.642l3.144-3.144C17.452 1.633 14.937.5 12 .5 7.387.5 3.408 3.142 1.5 7l3.667 2.844C6.083 7.05 8.789 5 12 5z"
      />
      <path
        fill="#34A853"
        d="M23.5 12.275c0-.84-.075-1.65-.215-2.428H12v4.594h6.43c-.277 1.493-1.12 2.76-2.388 3.61l3.668 2.842c2.146-1.98 3.39-4.9 3.39-8.618z"
      />
      <path
        fill="#FBBC05"
        d="M5.167 14.156A7.227 7.227 0 0 1 4.792 12c0-.75.13-1.475.375-2.156L1.5 7C.69 8.524.25 10.21.25 12c0 1.79.44 3.476 1.25 5l3.667-2.844z"
      />
      <path
        fill="#4285F4"
        d="M12 23.5c3.213 0 5.93-1.063 7.91-2.892l-3.668-2.842c-1.012.683-2.31 1.084-4.242 1.084-3.211 0-5.917-2.05-6.833-4.844L1.5 17c1.908 3.858 5.887 6.5 10.5 6.5z"
      />
    </svg>
  );
}

function KakaoIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="#191600"
        d="M12 3C6.477 3 2 6.477 2 10.79c0 2.745 1.83 5.16 4.59 6.57-.2.73-.73 2.68-.83 3.1-.13.52.19.51.4.37.16-.11 2.6-1.77 3.65-2.48.72.1 1.46.16 2.19.16 5.523 0 10-3.477 10-7.72S17.523 3 12 3z"
      />
    </svg>
  );
}
