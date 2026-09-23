"use client";

// 주간 성장 리포트 카드 — mount 시 getOrCreateWeeklyReportAction 호출("열 때 생성" —
// 알림 종의 markNotificationsReadAction 패턴). 지난주 제출이 없으면 안내 카피만.
// Server Component 렌더 중 write 를 피하려고 client 에서 액션을 트리거한다.
//
// variant
//  · "summary" (기본, /skill·/mypage) — 제출·통과율 타일 + AI 코멘트 + [자세히 보기 → /mypage/weekly]
//  · "full" (대시보드 /mypage/weekly 맨 위 히어로) — 미니 레이더(전주 스냅샷 vs 지난주 스냅샷) +
//    축별 점수 바 + 전주 대비 변화 + 약한 축 안내 + AI 코멘트
//    (제출·통과율·활동은 대시보드가 서버에서 따로 그리므로 여기선 뺀다)

import Link from "next/link";
import { useEffect, useState } from "react";

import { SkillRadarChart } from "@/components/mypage/skill-radar-chart";
import type { RadarPoint } from "@/lib/learning/skill-radar";
import { WEEKLY_COMMENT_AXES } from "@/lib/skill/weekly-comment-prompt";
import { getOrCreateWeeklyReportAction } from "@/lib/skill/weekly-report-actions";
import type { WeeklyReportPayload } from "@/lib/skill/weekly-report-queries";
import { cn } from "@/lib/utils";

// 축 순서·라벨은 weekly-comment-prompt.ts(순수 모듈)의 것을 그대로 쓴다 —
// lib/learning/skill-radar.ts 는 prisma 를 import 하는 서버 전용 모듈이라 client 번들에 못 올린다.
const AXES = WEEKLY_COMMENT_AXES;

/** "2026-09-14" → "9월 14일 ~ 9월 20일" (KST 월~일 — 대시보드 헤더와 같은 표기) */
function weekRangeLabel(weekStart: string): string {
  const [y, m, d] = weekStart.split("-").map(Number);
  const start = new Date(Date.UTC(y, m - 1, d));
  const end = new Date(start.getTime() + 6 * 24 * 60 * 60 * 1000);
  const fmt = (x: Date) => `${x.getUTCMonth() + 1}월 ${x.getUTCDate()}일`;
  return `${fmt(start)} ~ ${fmt(end)}`;
}

/**
 * 리포트 스냅샷 → 레이더 점. userValue = 지난주 스냅샷, averageValue = 전주 스냅샷(= 지난주 − delta).
 * 전주 리포트가 없으면(delta 없음) 두 번째 폴리곤은 그리지 않는다 — 지어낸 비교선 금지.
 */
function radarPointsOf(report: WeeklyReportPayload): RadarPoint[] {
  return AXES.map((axis) => {
    const cur = report.axisScores[axis.key];
    const delta = report.axisDeltas[axis.key];
    const measured = cur !== undefined;
    const hasPrev = measured && delta !== undefined;
    return {
      axisKey: axis.key,
      label: axis.label,
      userValue: measured ? cur : 0,
      averageValue: hasPrev ? cur - delta : 0,
      userMeasured: measured,
      averageMeasured: hasPrev,
    };
  });
}

type State =
  | { status: "loading" }
  | { status: "empty" }
  | { status: "error" }
  | { status: "ready"; report: WeeklyReportPayload };

export function WeeklyReportCard({ variant = "summary" }: { variant?: "summary" | "full" }) {
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

  const full = variant === "full";

  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-zinc-200/80 sm:p-6">
      {full ? (
        <>
          <h2 className="text-base font-bold text-zinc-900">지난주 성장</h2>
          <p className="mt-0.5 text-[12px] text-zinc-500">
            문제를 새로 제출한 축만 점수가 움직여요.
          </p>
        </>
      ) : (
        <p className="text-xs font-semibold tracking-wide text-violet-600">주간 성장 리포트</p>
      )}

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
          {!full && (
            <p className="text-[11px] text-zinc-400">
              지난주 {weekRangeLabel(state.report.weekStart)}
            </p>
          )}

          {/* 요약: 주간 수치 타일 */}
          {!full && (
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
          )}

          {/* 전체(히어로): 미니 레이더 + 축별 점수·전주 대비 변화 */}
          {full && (
            <div className="mt-3 grid gap-4 md:grid-cols-[minmax(0,280px)_minmax(0,1fr)] md:items-center">
              <div>
                <SkillRadarChart
                  points={radarPointsOf(state.report)}
                  ariaLabel="주간 성장 레이더 (전주 스냅샷 vs 지난주 스냅샷)"
                />
                <div className="mt-1 flex items-center justify-center gap-4 text-[11px] text-zinc-600">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="inline-block size-2.5 rounded-sm bg-violet-500" />
                    지난주
                  </span>
                  {Object.keys(state.report.axisDeltas).length > 0 && (
                    <span className="inline-flex items-center gap-1.5">
                      <span className="inline-block size-2.5 rounded-sm bg-amber-500" />
                      전주
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                {AXES.map((axis) => {
                  const score = state.report.axisScores[axis.key];
                  if (score === undefined) return null;
                  const delta = state.report.axisDeltas[axis.key];
                  const weakest = state.report.weakestAxis === axis.key;
                  return (
                    <div key={axis.key} className="flex items-center gap-2 text-[12px]">
                      <span
                        className={cn(
                          "w-20 shrink-0",
                          weakest ? "font-semibold text-violet-700" : "text-zinc-500",
                        )}
                      >
                        {axis.label}
                      </span>
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-100">
                        <div
                          className="h-full rounded-full bg-violet-500"
                          style={{ width: `${Math.max(0, Math.min(100, score))}%` }}
                        />
                      </div>
                      <span className="w-8 shrink-0 text-right font-semibold text-zinc-700">
                        {score}
                      </span>
                      <span
                        className={cn(
                          "w-9 shrink-0 text-right text-[11px] font-semibold",
                          delta === undefined || delta === 0
                            ? "text-zinc-300"
                            : delta > 0
                              ? "text-emerald-600"
                              : "text-rose-500",
                        )}
                      >
                        {delta === undefined
                          ? ""
                          : delta > 0
                            ? `+${delta}`
                            : delta === 0
                              ? "±0"
                              : delta}
                      </span>
                    </div>
                  );
                })}
                {Object.keys(state.report.axisDeltas).length === 0 && (
                  <p className="mt-1 text-[11px] text-zinc-400">
                    첫 리포트라 전주와 비교할 값이 아직 없어요. 다음 주부터 변화가 표시됩니다.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* 약점 축 안내 (규칙 기반) — 전체 보기에서만 */}
          {full && state.report.weakestAxisLabel && (
            <p className="mt-3 text-[12px] leading-relaxed text-zinc-600">
              지금 가장 약한 축은{" "}
              <span className="font-semibold text-violet-700">{state.report.weakestAxisLabel}</span>
              이에요.
            </p>
          )}

          {/* LLM 코멘트 (있을 때만) */}
          {state.report.llmComment && (
            <p className="mt-2 rounded-xl bg-violet-50 px-4 py-3 text-[13px] leading-relaxed text-zinc-700">
              {state.report.llmComment}
            </p>
          )}

          {!full && (
            <Link
              href="/mypage/weekly"
              className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl bg-violet-600 px-4 py-2.5 text-[13px] font-semibold text-white transition hover:bg-violet-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
            >
              리포트 자세히 보기
              <span aria-hidden>→</span>
            </Link>
          )}
        </div>
      )}
    </section>
  );
}
