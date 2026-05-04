// "준비됐나요?" CTA 카드.
// Server Component — 버튼은 강의 목록 화면으로 라우팅하는 next/link.

import Link from "next/link"
import { ChevronRight, Play } from "lucide-react"

import type { CourseCta } from "@/lib/course-detail"

type Props = {
  cta: CourseCta
  /** 강의 목록 라우트 생성용 — `/courses/${courseId}/lessons` */
  courseId: string
}

export function CtaCard({ cta, courseId }: Props) {
  return (
    <section className="rounded-2xl bg-white p-5 ring-1 ring-zinc-200/80 shadow-sm sm:p-6">
      <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* 좌측: 헤드라인 + 서브 */}
        <div className="min-w-0">
          <p className="text-[15px] font-bold text-zinc-900 sm:text-base">
            {cta.headline}
          </p>
          <p className="mt-1 text-xs text-zinc-500">{cta.subtext}</p>
        </div>

        {/* 우측: 보라 풀폭 Link (모바일은 풀폭, 데스크톱은 정해진 폭) */}
        <Link
          href={`/courses/${courseId}/lessons`}
          className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:from-violet-700 hover:to-purple-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 sm:w-auto"
        >
          <Play className="size-4 fill-white" strokeWidth={0} aria-hidden />
          {cta.buttonLabel}
          <ChevronRight className="size-4" strokeWidth={2.5} aria-hidden />
        </Link>
      </div>
    </section>
  )
}
