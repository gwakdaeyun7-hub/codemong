"use client"

import Link from "next/link"
import { useEffect } from "react"
import { AlertTriangle, RotateCcw } from "lucide-react"

// 전역 에러 바운더리 — 라우트 렌더 중 예상 못한 오류를 잡아 CodeMong 톤 폴백을 보여준다.
// (Server Action throw, 데이터/DB 조회 실패 등이 여기로 떨어진다. reset() 으로 해당 세그먼트 재시도.)
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // 운영 환경에선 여기서 모니터링(Sentry 등)으로 보고. 현재는 콘솔만.
    console.error(error)
  }, [error])

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <section className="flex w-full max-w-md flex-col items-center rounded-2xl bg-white px-6 py-12 text-center ring-1 ring-zinc-200/80 shadow-sm sm:px-10">
        <span
          aria-hidden
          className="inline-flex size-14 items-center justify-center rounded-2xl bg-rose-100 text-rose-600"
        >
          <AlertTriangle className="size-7" strokeWidth={2.25} />
        </span>
        <h1 className="mt-5 text-xl font-bold tracking-tight text-zinc-900">
          잠시 문제가 생겼어요
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-zinc-500">
          예상치 못한 오류로 화면을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-full bg-violet-600 px-5 text-sm font-semibold text-white transition hover:bg-violet-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
          >
            <RotateCcw className="size-4" strokeWidth={2.5} aria-hidden />
            다시 시도
          </button>
          <Link
            href="/"
            className="inline-flex h-10 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-zinc-700 ring-1 ring-zinc-200 transition hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-400"
          >
            홈으로
          </Link>
        </div>
      </section>
    </main>
  )
}
