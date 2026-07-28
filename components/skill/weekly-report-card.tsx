"use client";

// 주간 성장 리포트 카드 — mount 시 getOrCreateWeeklyReportAction 호출("열 때 생성" —
// 알림 종의 markNotificationsReadAction 패턴). 지난주 제출이 없으면 안내 카피만.
// Server Component 렌더 중 write 를 피하려고 client 에서 액션을 트리거한다.

import { useEffect, useState } from "react";

import { getOrCreateWeeklyReportAction } from "@/lib/skill/weekly-report-actions";
import type { WeeklyReportPayload } from "@/lib/skill/weekly-report-queries";
import { cn } from "@/lib/utils";

// 축 순서·라벨 (클라 전용 사본 — lib/learning/skill-radar.ts 는 prisma 를 import 하는
// 서버 전용 모듈이라 client 번들에 끌어올 수 없다. 축 변경 시 여기도 함께 수정).
const AXES: Array<{ key: string; label: string }> = [
  { key: "syntax", label: "구문 정확도" },
  { key: "logic", label: "로직 구현도" },
  { key: "concept", label: "개념 이해도" },
  { key: "efficiency", label: "코드 효율성" },
  { key: "interpretation", label: "문제 해석력" },
];

type State =
  | { status: "loading" }
  | { status: "empty" }
  | { status: "error" }
  | { status: "ready"; report: WeeklyReportPayload };

export function WeeklyReportCard() {
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const result = await getOrCreateWeeklyReportAction();
        if (cancelled) return;
        if (!result.ok) setState({ status: "error" });
        else if (result.report === null) setState({ status: "empty" });
        else setState({ status: "ready", report: result.report });
      } catch (err) {
        console.error("[CodeMong] 주간 리포트 로드 실패:", err);
        if (!cancelled) setState({ status: "error" });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-zinc-200/80 sm:p-6">
      <p className="text-xs font-semibold tracking-wide text-violet-600">주간 성장 리포트</p>

      {state.status === "loading" && (
        <p className="mt-2 text-[13px] text-zinc-400">지난주 기록을 정리하는 중…</p>
      )}

      {state.status === "error" && (
        <p className="mt-2 text-[13px] text-zinc-500">
          리포트를 불러오지 못했어요. 잠시 후 다시 열어 주세요.
        </p>
      )}

      {state.status === "empty" && (
        <p className="mt-2 text-[13px] leading-relaxed text-zinc-500">
          지난주에는 제출한 문제가 없어요. 이번 주에 실력향상 문제를 풀면 다음 주 초에 리포트가
          만들어집니다.
        </p>
      )}

      {state.status === "ready" && (
        <div className="mt-2">
          <p className="text-[11px] text-zinc-400">{state.report.weekStart} 주 기준</p>

          {/* 주간 요약 수치 */}
          <div className="mt-2 grid grid-cols-2 gap-2">
            <div className="rounded-xl bg-zinc-50 px-3 py-2.5 text-center ring-1 ring-zinc-200">
              <p className="text-[11px] font-medium text-zinc-500">지난주 제출</p>
              <p className="mt-0.5 text-lg font-bold text-zinc-900">
                {state.report.submissionCount}회
              </p>
            </div>
            <div className="rounded-xl bg-zinc-50 px-3 py-2.5 text-center ring-1 ring-zinc-200">
              <p className="text-[11px] font-medium text-zinc-500">통과율</p>
              <p className="mt-0.5 text-lg font-bold text-zinc-900">{state.report.passRate}%</p>
            </div>
          </div>

          {/* 축별 점수 + 전주 대비 변화 */}
          <div className="mt-3 flex flex-col gap-1">
            {AXES.map((axis) => {
              const score = state.report.axisScores[axis.key];
              if (score === undefined) return null;
              const delta = state.report.axisDeltas[axis.key];
              return (
                <div key={axis.key} className="flex items-center gap-2 text-[12px]">
                  <span className="w-20 shrink-0 text-zinc-500">{axis.label}</span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-100">
                    <div
                      className="h-full rounded-full bg-violet-500"
                      style={{ width: `${Math.max(0, Math.min(100, score))}%` }}
                    />
                  </div>
                  <span className="w-8 shrink-0 text-right font-semibold text-zinc-700">
                    {score}
                  </span>
                  {delta !== undefined && delta !== 0 && (
                    <span
                      className={cn(
                        "w-9 shrink-0 text-right text-[11px] font-semibold",
                        delta > 0 ? "text-emerald-600" : "text-rose-500",
                      )}
                    >
                      {delta > 0 ? "+" : ""}
                      {delta}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* 약점 축 안내 (규칙 기반) */}
          {state.report.weakestAxisLabel && (
            <p className="mt-3 text-[12px] leading-relaxed text-zinc-600">
              지금 가장 약한 축은{" "}
              <span className="font-semibold text-violet-700">{state.report.weakestAxisLabel}</span>
              이에요. 이 축을 다루는 문제를 골라 풀면 균형 있게 성장할 수 있어요.
            </p>
          )}

          {/* LLM 코멘트 (있을 때만) */}
          {state.report.llmComment && (
            <p className="mt-2 rounded-xl bg-violet-50 px-4 py-3 text-[13px] leading-relaxed text-zinc-700">
              {state.report.llmComment}
            </p>
          )}
        </div>
      )}
    </section>
  );
}
