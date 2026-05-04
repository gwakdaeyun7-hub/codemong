// 강의 상세(개념 탭) — Python 문법 카드.
// mainExample: 큰 코드 한 줄 + 토큰 설명 chip 그리드
// commonPatterns: 4개 카드 그리드
// Server Component.

import { Code } from "lucide-react"

import type { SyntaxGuide } from "@/lib/lesson-content"

export function SyntaxGuideCard({ guide }: { guide: SyntaxGuide }) {
  return (
    <section className="rounded-2xl bg-white p-5 ring-1 ring-zinc-200/80 shadow-sm sm:p-6">
      <header className="mb-2 flex items-center gap-2.5">
        <span
          aria-hidden
          className="inline-flex size-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600"
        >
          <Code className="size-4" strokeWidth={2.25} />
        </span>
        <h2 className="text-[15px] font-bold text-zinc-900 sm:text-base">
          {guide.title}
        </h2>
      </header>
      <p className="mb-5 text-[13px] text-zinc-500 sm:text-sm">
        {guide.description}
      </p>

      {/* mainExample: 옅은 박스 안에 큰 코드 한 줄 + 토큰 설명 grid */}
      <div className="rounded-xl bg-zinc-50 p-4 ring-1 ring-zinc-100 sm:p-5">
        {/* 코드 라인: 가로 스크롤 가능 (모바일에서 wrap 방지) */}
        <pre className="overflow-x-auto rounded-lg bg-white px-4 py-3.5 ring-1 ring-zinc-200/80 [scrollbar-width:thin]">
          <code className="font-mono text-sm font-semibold text-zinc-900 sm:text-[15px]">
            {guide.mainExample.code}
          </code>
        </pre>

        {/* 토큰 설명 chip — 데스크톱 4열, 모바일 2열 */}
        <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {guide.mainExample.parts.map((part) => (
            <li
              key={part.token}
              className="flex flex-col gap-1 rounded-lg bg-white px-2.5 py-2 ring-1 ring-zinc-200/70"
            >
              <code className="truncate font-mono text-[12px] font-bold text-violet-700 sm:text-[13px]">
                {part.token}
              </code>
              <span className="text-[11px] leading-snug text-zinc-600 sm:text-[12px]">
                {part.role}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* commonPatterns 그리드 — 데스크톱 2열 (코드라 가로 여유 필요), 모바일 1열 */}
      <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {guide.commonPatterns.map((pattern) => (
          <li
            key={pattern.label}
            className="flex flex-col gap-2 rounded-xl bg-zinc-50/80 p-3.5 ring-1 ring-zinc-100"
          >
            <span className="inline-flex w-fit items-center rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-violet-700">
              {pattern.label}
            </span>
            <pre className="overflow-x-auto rounded-lg bg-white px-3 py-2 ring-1 ring-zinc-200/80 [scrollbar-width:thin]">
              <code className="font-mono text-[12px] font-medium text-zinc-900 sm:text-[13px]">
                {pattern.code}
              </code>
            </pre>
            <p className="text-[12px] leading-relaxed text-zinc-600 sm:text-[13px]">
              {pattern.description}
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}
