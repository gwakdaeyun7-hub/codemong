// 강의 상세(개념 탭) — 개념 소개 카드.
// 보라 톤 배경 + headline + paragraphs + 3-pillar grid.
// Server Component.

import { createElement } from "react"

import { resolveLessonContentIcon } from "@/components/lesson-content/icon-map"

import type { ConceptIntro } from "@/lib/lesson-content"

export function ConceptIntroCard({ intro }: { intro: ConceptIntro }) {
  return (
    <section className="rounded-2xl bg-violet-50/70 p-5 ring-1 ring-violet-100 shadow-sm sm:p-6">
      <header className="mb-3 flex items-center gap-2.5">
        <span
          aria-hidden
          className="inline-flex size-7 items-center justify-center rounded-full bg-violet-200/80"
        >
          <span className="size-2 rounded-full bg-violet-600" />
        </span>
        <h2 className="text-[15px] font-bold text-violet-900 sm:text-base">
          개념 소개
        </h2>
      </header>

      <p className="text-[15px] font-semibold leading-relaxed text-zinc-900 sm:text-base">
        {intro.headline}
      </p>

      <div className="mt-3 flex flex-col gap-3 text-[13px] leading-relaxed text-zinc-700 sm:text-sm">
        {intro.paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      {/* 3-pillar grid: 데스크톱 3열, 모바일 1열 */}
      <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        {intro.pillars.map((pillar) => {
          // resolveLessonContentIcon 결과를 createElement 로 직접 호출.
          // 변수에 컴포넌트 참조를 담아 JSX 로 렌더하면 react-hooks/static-components 오탐 회피.
          const iconNode = createElement(
            resolveLessonContentIcon(pillar.iconHint),
            { className: "size-4", strokeWidth: 2.25 },
          )
          return (
            <li
              key={pillar.label}
              className="flex flex-col gap-2 rounded-xl bg-white/80 p-3.5 ring-1 ring-violet-100/70"
            >
              <div className="flex items-center gap-2">
                <span
                  aria-hidden
                  className="inline-flex size-7 items-center justify-center rounded-lg bg-violet-100 text-violet-600"
                >
                  {iconNode}
                </span>
                <span className="text-[13px] font-bold text-zinc-900 sm:text-sm">
                  {pillar.label}
                </span>
              </div>
              <p className="text-[12px] leading-relaxed text-zinc-600 sm:text-[13px]">
                {pillar.description}
              </p>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
