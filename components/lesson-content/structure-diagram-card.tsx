// 강의 상세(개념 탭) — Python 코드 흐름 다이어그램 카드.
// 데스크톱: 가로 4열 + ChevronRight 화살표
// 모바일: 세로 4행 + ChevronDown 화살표
// Server Component.

import { ChevronDown, ChevronRight, Code2 } from "lucide-react"

import { resolveContentTone } from "@/components/lesson-content/icon-map"
import { cn } from "@/lib/utils"

import type { StructureDiagram } from "@/lib/lesson-content"

export function StructureDiagramCard({
  diagram,
}: {
  diagram: StructureDiagram
}) {
  return (
    <section className="rounded-2xl bg-white p-5 ring-1 ring-zinc-200/80 shadow-sm sm:p-6">
      <header className="mb-2 flex items-center gap-2.5">
        <span
          aria-hidden
          className="inline-flex size-8 items-center justify-center rounded-full bg-blue-100 text-blue-600"
        >
          <Code2 className="size-4" strokeWidth={2.25} />
        </span>
        <h2 className="text-[15px] font-bold text-zinc-900 sm:text-base">
          {diagram.title}
        </h2>
      </header>
      <p className="mb-5 text-[13px] text-zinc-500 sm:text-sm">
        {diagram.description}
      </p>

      {/* 노드 흐름 */}
      <ol className="flex flex-col items-stretch gap-2 md:flex-row md:items-center md:gap-1.5">
        {diagram.nodes.map((node, i) => {
          const tone = resolveContentTone(node.tone)
          const isLast = i === diagram.nodes.length - 1
          return (
            <li
              key={node.label}
              className="flex flex-col items-stretch gap-2 md:flex-1 md:flex-row md:items-center md:gap-1.5"
            >
              <div
                className={cn(
                  "flex flex-1 flex-col gap-0.5 rounded-xl px-3.5 py-3 ring-1",
                  tone.softBg,
                  tone.softRing,
                )}
              >
                <span className={cn("text-[13px] font-bold sm:text-sm", tone.text)}>
                  {node.label}
                </span>
                <span className="text-[11px] leading-relaxed text-zinc-600 sm:text-xs">
                  {node.caption}
                </span>
              </div>

              {/* 화살표 — 마지막 노드 뒤에는 안 둠 */}
              {!isLast && (
                <span
                  aria-hidden
                  className="inline-flex shrink-0 items-center justify-center text-zinc-400"
                >
                  <ChevronDown className="size-4 md:hidden" strokeWidth={2.25} />
                  <ChevronRight
                    className="hidden size-4 md:inline"
                    strokeWidth={2.25}
                  />
                </span>
              )}
            </li>
          )
        })}
      </ol>

      <p className="mt-4 text-center text-[12px] text-zinc-500 sm:text-[13px]">
        {diagram.relation}
      </p>
    </section>
  )
}
