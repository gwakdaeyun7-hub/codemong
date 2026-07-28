"use client";

// 문제 페이지 "내 제출" — 백준 내 제출 스타일. 페이지(Server)가 조회한 목록을 prop 으로 받아
// 행 펼침(코드 원문 + AI 피드백)만 클라이언트에서 처리한다.
// AI 3축 점수/피드백은 aiStatus === "ok" 일 때만 표시 (C단계 Gemini 연동 후 채워진다).

import { useState } from "react";

import { ChevronDown } from "@/components/skill/icon-map";
import { timeAgoKo } from "@/lib/format";
import { cn } from "@/lib/utils";

export type SubmissionHistoryItem = {
  id: string;
  passed: boolean;
  errorType: string | null;
  casesPassed: number;
  casesTotal: number;
  code: string;
  aiStatus: string;
  conceptScore: number | null;
  efficiencyScore: number | null;
  interpretationScore: number | null;
  aiFeedback: string | null;
  /** ISO 문자열 (서버에서 직렬화해 넘김) */
  createdAt: string;
};

export function SubmissionHistory({ items }: { items: SubmissionHistoryItem[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-zinc-200/80 sm:p-6">
        <h2 className="text-sm font-bold text-zinc-900">내 제출</h2>
        <p className="mt-2 text-[13px] text-zinc-500">
          아직 제출 기록이 없어요. 제출하면 채점 결과가 여기에 쌓입니다.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-zinc-200/80 sm:p-6">
      <h2 className="text-sm font-bold text-zinc-900">내 제출 ({items.length})</h2>
      <ul className="mt-3 flex flex-col gap-1.5">
        {items.map((s) => {
          const open = openId === s.id;
          return (
            <li key={s.id} className="rounded-xl ring-1 ring-zinc-200">
              <button
                type="button"
                onClick={() => setOpenId(open ? null : s.id)}
                aria-expanded={open}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left transition hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
              >
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[11px] font-semibold",
                    s.passed
                      ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                      : "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
                  )}
                >
                  {s.passed ? "정답" : "오답"}
                </span>
                <span className="text-[12px] text-zinc-600">
                  {s.casesPassed}/{s.casesTotal} 통과
                </span>
                {s.errorType && (
                  <span className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[11px] text-zinc-500">
                    {s.errorType}
                  </span>
                )}
                <span className="ml-auto text-[11px] text-zinc-400">{timeAgoKo(s.createdAt)}</span>
                <ChevronDown
                  className={cn("size-4 text-zinc-400 transition-transform", open && "rotate-180")}
                  strokeWidth={2.25}
                  aria-hidden
                />
              </button>

              {open && (
                <div className="border-t border-zinc-100 px-3 py-3">
                  <p className="mb-1 text-[11px] font-semibold text-zinc-500">제출한 코드</p>
                  <pre className="overflow-x-auto rounded-lg bg-zinc-900 px-3 py-2.5 font-mono text-[12px] leading-relaxed whitespace-pre-wrap text-zinc-100">
                    {s.code}
                  </pre>

                  {s.aiStatus === "ok" && (
                    <div className="mt-3">
                      <p className="mb-1 text-[11px] font-semibold text-violet-600">AI 진단</p>
                      <div className="flex flex-wrap gap-1.5">
                        {s.conceptScore !== null && (
                          <span className="rounded-full bg-violet-50 px-2 py-0.5 text-[11px] font-medium text-violet-700">
                            개념 {s.conceptScore}
                          </span>
                        )}
                        {s.efficiencyScore !== null && (
                          <span className="rounded-full bg-violet-50 px-2 py-0.5 text-[11px] font-medium text-violet-700">
                            효율 {s.efficiencyScore}
                          </span>
                        )}
                        {s.interpretationScore !== null && (
                          <span className="rounded-full bg-violet-50 px-2 py-0.5 text-[11px] font-medium text-violet-700">
                            해석 {s.interpretationScore}
                          </span>
                        )}
                      </div>
                      {s.aiFeedback && (
                        <p className="mt-2 text-[13px] leading-relaxed whitespace-pre-wrap text-zinc-700">
                          {s.aiFeedback}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
