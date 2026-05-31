import Link from "next/link"

// 전역 푸터 — 담백한 한 줄(저작권 + 실재 라우트 링크만). 시선 끌지 않도록 작은 회색,
// 배경도 페이지와 같은 zinc-50 으로 깔아 경계선(border-t)만 남긴다.
// TopNav 와 동일하게 앱 셸 페이지가 직접 배치 — auth 풀스크린은 제외.
export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-zinc-200 bg-zinc-50">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-zinc-400 sm:flex-row sm:px-6 lg:px-8">
        <span>© 2026 CodeMong</span>
        <nav aria-label="푸터 메뉴" className="flex items-center gap-4">
          <Link href="/" className="transition hover:text-zinc-600">
            코드학습
          </Link>
          <Link href="/community" className="transition hover:text-zinc-600">
            커뮤니티
          </Link>
        </nav>
      </div>
    </footer>
  )
}
