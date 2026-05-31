import Link from "next/link"

// 전역 푸터.
// TopNav 와 동일하게 "앱 셸" 페이지가 직접 배치(공통 셸 레이아웃이 없는 구조).
// 정직 톤: 실제로 존재하는 라우트만 링크. 약관/개인정보/문의 등 미구현 페이지는 링크하지 않는다.
export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        {/* 브랜드 + 한 줄 소개 */}
        <div className="flex items-center gap-2.5">
          <span className="inline-flex size-7 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-sm font-bold text-white shadow-sm">
            C
          </span>
          <div className="flex flex-col">
            <span className="text-[15px] font-bold tracking-tight text-zinc-900">
              CodeMong
            </span>
            <span className="text-xs text-zinc-500">
              이해 기반으로 자라는 코딩 학습
            </span>
          </div>
        </div>

        {/* 실재 라우트 링크만 */}
        <nav
          aria-label="푸터 메뉴"
          className="flex items-center gap-5 text-sm text-zinc-600"
        >
          <Link href="/" className="transition hover:text-violet-600">
            코드학습
          </Link>
          <Link href="/community" className="transition hover:text-violet-600">
            커뮤니티
          </Link>
        </nav>
      </div>

      <div className="border-t border-zinc-100">
        <div className="mx-auto max-w-7xl px-4 py-4 text-xs text-zinc-400 sm:px-6 lg:px-8">
          © 2026 CodeMong
        </div>
      </div>
    </footer>
  )
}
