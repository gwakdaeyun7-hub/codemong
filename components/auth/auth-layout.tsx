import Link from "next/link";
import type { ReactNode } from "react";

/**
 * 인증 페이지 공통 레이아웃.
 * 좌측: CodeMong 브랜드 + 학습 카피 (lg+에서만 노출)
 * 우측: 폼 영역 (모바일 풀폭)
 */
export function AuthLayout({
  title,
  description,
  footer,
  children,
}: {
  title: string;
  description?: string;
  footer?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="grid min-h-screen w-full lg:grid-cols-2">
      {/* 좌측 브랜드 패널 — lg 이상에서만 */}
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-violet-500 to-purple-700 lg:block">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -left-20 -top-20 size-72 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-10 right-10 size-96 rounded-full bg-violet-300 blur-3xl" />
        </div>
        <div className="relative flex h-full flex-col justify-between px-12 py-12 text-white">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="inline-flex size-9 items-center justify-center rounded-full bg-white text-base font-bold text-violet-600 shadow-lg">
              C
            </span>
            <span className="text-lg font-bold tracking-tight">CodeMong</span>
          </Link>

          <div className="space-y-3">
            <p className="text-3xl font-bold leading-snug tracking-tight">
              이해한 만큼
              <br />
              자라는 학습.
            </p>
            <p className="max-w-sm text-sm text-white/80">
              활동량이 아니라 이해도에 따라 캐릭터가 성장합니다. 매일 조금씩,
              제대로 이해하며 코딩을 익혀보세요.
            </p>
          </div>

          <p className="text-xs text-white/60">© CodeMong</p>
        </div>
      </div>

      {/* 우측 폼 패널 */}
      <div className="flex flex-col">
        <header className="flex h-14 items-center px-4 sm:px-6 lg:hidden">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="inline-flex size-7 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-sm font-bold text-white shadow-sm">
              C
            </span>
            <span className="text-[15px] font-bold tracking-tight text-zinc-900">
              CodeMong
            </span>
          </Link>
        </header>

        <main className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6 lg:py-12">
          <div className="w-full max-w-sm space-y-7">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
                {title}
              </h1>
              {description && (
                <p className="text-sm text-zinc-500">{description}</p>
              )}
            </div>

            {children}

            {footer && (
              <div className="border-t border-zinc-100 pt-5 text-center text-sm text-zinc-500">
                {footer}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
