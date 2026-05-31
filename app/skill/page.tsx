import Link from "next/link"
import { TrendingUp } from "lucide-react"

import { SiteFooter } from "@/components/site-footer"
import { TopNav } from "@/components/top-nav"

export const metadata = { title: "실력향상 · CodeMong" }

// 실력향상 — 아직 기능이 없어 '준비 중' 안내만 노출.
// (TopNav "실력향상" 메뉴가 가리키던 /skill 라우트 부재로 404 나던 것을 해소.)
export default function SkillPage() {
  return (
    <>
      <TopNav active="skill" />

      <main className="mx-auto flex w-full max-w-7xl flex-1 items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
        <section className="flex max-w-md flex-col items-center rounded-2xl bg-white px-6 py-12 text-center ring-1 ring-zinc-200/80 shadow-sm sm:px-10">
          <span
            aria-hidden
            className="inline-flex size-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-600"
          >
            <TrendingUp className="size-7" strokeWidth={2.25} />
          </span>
          <h1 className="mt-5 text-xl font-bold tracking-tight text-zinc-900">
            실력향상 기능은 준비 중이에요
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-zinc-500">
            배운 개념을 문제로 점검하고 약한 부분을 보강하는 실력향상 기능을 준비하고 있어요.
            먼저 강의 영상으로 기초를 차근차근 다져보세요.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex h-10 items-center rounded-full bg-zinc-900 px-5 text-sm font-semibold text-white transition hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
          >
            코드 학습으로 가기
          </Link>
        </section>
      </main>

      <SiteFooter />
    </>
  )
}
