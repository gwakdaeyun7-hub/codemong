// 강의 상세(개념 탭) — "일상 속에서 보는 Python 활용" 카드.
// 6개 카드 그리드: 데스크톱 3열, 모바일 1열. 각 카드 = 컬러 아이콘 박스 + 제목 + 설명 + 예시 pill.
// Server Component.

import { createElement } from "react"
import { Globe } from "lucide-react"

import {
  resolveContentTone,
  resolveLessonContentIcon,
} from "@/components/lesson-content/icon-map"
import { cn } from "@/lib/utils"

import type { RealWorldUse } from "@/lib/lesson-content"

export function RealWorldUsesCard({ uses }: { uses: RealWorldUse[] }) {
  return (
    <section className="rounded-2xl bg-violet-50/60 p-5 ring-1 ring-violet-100 shadow-sm sm:p-6">
      <header className="mb-4 flex items-center gap-2.5">
        <span
          aria-hidden
          className="inline-flex size-8 items-center justify-center rounded-full bg-violet-200/80 text-violet-700"
        >
          <Globe className="size-4" strokeWidth={2.25} />
        </span>
        <h2 className="text-[15px] font-bold text-violet-900 sm:text-base">
          일상 속에서 보는 Python 활용
        </h2>
      </header>

      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {uses.map((use) => {
          const tone = resolveContentTone(use.tone)
          // resolveLessonContentIcon 결과를 createElement 로 직접 호출.
          const iconNode = createElement(
            resolveLessonContentIcon(use.iconHint),
            { className: "size-4", strokeWidth: 2.25 },
          )
          return (
            <li
              key={use.title}
              className="flex flex-col gap-2.5 rounded-xl bg-white p-3.5 ring-1 ring-zinc-200/80 transition hover:shadow-sm sm:p-4"
            >
              <div className="flex items-center gap-2">
                <span
                  aria-hidden
                  className={cn(
                    "inline-flex size-9 items-center justify-center rounded-xl",
                    tone.badge,
                  )}
                >
                  {iconNode}
                </span>
                <span className="text-sm font-bold text-zinc-900">
                  {use.title}
                </span>
              </div>

              <p className="text-[12px] leading-relaxed text-zinc-600 sm:text-[13px]">
                {use.description}
              </p>

              <ul className="mt-auto flex flex-wrap gap-1.5 pt-1">
                {use.examples.map((ex) => (
                  <li
                    key={ex}
                    className="inline-flex items-center rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-600"
                  >
                    {ex}
                  </li>
                ))}
              </ul>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
