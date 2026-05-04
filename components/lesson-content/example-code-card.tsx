"use client"

// 강의 상세(개념 탭) — 예시 코드 카드.
// Client Component: 코드 복사 버튼이 navigator.clipboard 사용.
// 복사 직후 1.5초간 "복사됨" 라벨 표시.

import { useState } from "react"
import { Check, Copy, Lightbulb, Terminal } from "lucide-react"

import { cn } from "@/lib/utils"

import type { ExampleCode } from "@/lib/lesson-content"

export function ExampleCodeCard({ example }: { example: ExampleCode }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    // 일부 환경(권한 거부, http) 에서 clipboard.writeText 가 실패할 수 있어 try/catch.
    try {
      await navigator.clipboard.writeText(example.code)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      // 의도적 무음 실패 — 사용자에게 토스트 띄울 인프라가 아직 없음.
    }
  }

  return (
    <section className="rounded-2xl bg-white p-5 ring-1 ring-zinc-200/80 shadow-sm sm:p-6">
      <header className="mb-2 flex items-center gap-2.5">
        <span
          aria-hidden
          className="inline-flex size-8 items-center justify-center rounded-full bg-zinc-900 text-white"
        >
          <Terminal className="size-4" strokeWidth={2.25} />
        </span>
        <h2 className="text-[15px] font-bold text-zinc-900 sm:text-base">
          {example.title}
        </h2>
      </header>
      <p className="mb-4 text-[13px] text-zinc-500 sm:text-sm">
        {example.intro}
      </p>

      {/* 다크 코드 블록 + 우상단 복사 버튼 */}
      <div className="relative overflow-hidden rounded-xl bg-zinc-900 ring-1 ring-zinc-800">
        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? "코드 복사됨" : "코드 복사하기"}
          className={cn(
            "absolute right-2.5 top-2.5 inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-semibold transition",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400",
            copied
              ? "bg-emerald-500/20 text-emerald-300"
              : "bg-white/10 text-zinc-200 hover:bg-white/20",
          )}
        >
          {copied ? (
            <>
              <Check className="size-3" strokeWidth={2.5} aria-hidden />
              복사됨
            </>
          ) : (
            <>
              <Copy className="size-3" strokeWidth={2.25} aria-hidden />
              복사하기
            </>
          )}
        </button>

        <pre className="overflow-x-auto px-4 py-4 pr-20 [scrollbar-width:thin] sm:px-5 sm:py-5">
          <code className="font-mono text-[12px] leading-relaxed text-zinc-100 sm:text-[13px]">
            {example.code}
          </code>
        </pre>
      </div>

      {/* 출력 결과 */}
      <div className="mt-3 rounded-xl bg-zinc-50 p-3.5 ring-1 ring-zinc-100 sm:p-4">
        <div className="mb-1.5 inline-flex items-center gap-1.5 rounded-full bg-zinc-200/70 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-zinc-600">
          출력 결과
        </div>
        <pre className="overflow-x-auto whitespace-pre-wrap [scrollbar-width:thin]">
          <code className="font-mono text-[12px] leading-relaxed text-zinc-800 sm:text-[13px]">
            {example.expectedOutput}
          </code>
        </pre>
      </div>

      {/* notes — 노란 톤 */}
      <div className="mt-3 flex items-start gap-2.5 rounded-xl bg-amber-50 p-3.5 ring-1 ring-amber-100 sm:p-4">
        <span
          aria-hidden
          className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-amber-200/80 text-amber-700"
        >
          <Lightbulb className="size-3.5" strokeWidth={2.25} />
        </span>
        <p className="text-[12px] leading-relaxed text-amber-900/90 sm:text-[13px]">
          {example.notes}
        </p>
      </div>
    </section>
  )
}
