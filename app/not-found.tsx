import Link from "next/link"
import { Compass } from "lucide-react"

// 404 — 없는 주소로 들어왔거나 라우트에서 notFound() 가 호출됐을 때의 폴백.
export default function NotFound() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <section className="flex w-full max-w-md flex-col items-center rounded-2xl bg-white px-6 py-12 text-center ring-1 ring-zinc-200/80 shadow-sm sm:px-10">
        <span
          aria-hidden
          className="inline-flex size-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-600"
        >
          <Compass className="size-7" strokeWidth={2.25} />
        </span>
        <p className="mt-5 text-sm font-bold tracking-wide text-violet-600">404</p>
        <h1 className="mt-1 text-xl font-bold tracking-tight text-zinc-900">
          페이지를 찾을 수 없어요
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-zinc-500">
          주소가 바뀌었거나 없는 페이지예요. 주소를 다시 확인하거나 홈에서 다시 찾아보세요.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex h-10 items-center rounded-full bg-zinc-900 px-5 text-sm font-semibold text-white transition hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
        >
          홈으로 가기
        </Link>
      </section>
    </main>
  )
}
