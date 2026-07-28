// AI 진단 카드 — 제출 직후 러너가 받은 SubmissionAiPayload 를 그린다.
// 상태별 카피:
//  · ok            — 3축 점수 칩 + 감점 근거 + 힌트형 피드백 문단
//  · skipped_limit — 오늘 무료 분석 횟수 소진 안내 (채점 결과는 정상 저장)
//  · failed        — 짧은 안내 한 줄 (채점 결과는 정상 저장)
//  · skipped_no_key — 아무것도 렌더하지 않음 (AI 기능 자체가 꺼진 배포)
// 프레젠테이션 전용 — 상태는 부모(ProblemRunner)가 들고 있다.

import type { SubmissionAiPayload } from "@/lib/skill/submission-actions";

const AXIS_LABEL: Record<string, string> = {
  concept: "개념 이해도",
  efficiency: "코드 효율성",
  interpretation: "문제 해석력",
};

export function AiFeedbackCard({ ai }: { ai: SubmissionAiPayload | "loading" }) {
  if (ai === "loading") {
    return (
      <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-zinc-200/80 sm:p-6">
        <p className="text-xs font-semibold tracking-wide text-violet-600">AI 진단</p>
        <p className="mt-2 text-[13px] text-zinc-500">AI 피드백 생성 중…</p>
      </section>
    );
  }

  if (ai.status === "skipped_no_key") return null;

  if (ai.status === "skipped_limit") {
    return (
      <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-zinc-200/80 sm:p-6">
        <p className="text-xs font-semibold tracking-wide text-violet-600">AI 진단</p>
        <p className="mt-2 text-[13px] leading-relaxed text-zinc-600">
          오늘의 무료 AI 분석 횟수를 다 썼어요. 내일 다시 받을 수 있어요. 채점 결과와 제출 기록은
          정상으로 저장됐습니다.
        </p>
      </section>
    );
  }

  if (ai.status === "failed") {
    return (
      <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-zinc-200/80 sm:p-6">
        <p className="text-xs font-semibold tracking-wide text-violet-600">AI 진단</p>
        <p className="mt-2 text-[13px] leading-relaxed text-zinc-600">
          AI 분석을 불러오지 못했어요. 채점 결과와 제출 기록은 정상으로 저장됐습니다.
        </p>
      </section>
    );
  }

  const scores = [
    { key: "concept", value: ai.conceptScore },
    { key: "efficiency", value: ai.efficiencyScore },
    { key: "interpretation", value: ai.interpretationScore },
  ] as const;

  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-zinc-200/80 sm:p-6">
      <p className="text-xs font-semibold tracking-wide text-violet-600">AI 진단</p>

      {/* 3축 점수 */}
      <div className="mt-3 grid grid-cols-3 gap-2">
        {scores.map(
          (s) =>
            s.value !== null && (
              <div key={s.key} className="rounded-xl bg-violet-50 px-3 py-2.5 text-center">
                <p className="text-[11px] font-medium text-violet-600">{AXIS_LABEL[s.key]}</p>
                <p className="mt-0.5 text-lg font-bold text-violet-700">{s.value}</p>
              </div>
            ),
        )}
      </div>

      {/* 감점 근거 */}
      {ai.deductions.length > 0 && (
        <div className="mt-3">
          <p className="text-[11px] font-semibold text-zinc-500">감점 근거</p>
          <ul className="mt-1 flex flex-col gap-1">
            {ai.deductions.map((d, i) => (
              <li key={i} className="flex items-baseline gap-2 text-[13px] text-zinc-700">
                <span className="shrink-0 rounded bg-zinc-100 px-1.5 py-0.5 text-[11px] font-medium text-zinc-500">
                  {AXIS_LABEL[d.axis]} -{d.points}
                </span>
                <span className="leading-relaxed">{d.reason}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 힌트형 피드백 */}
      {ai.feedback && (
        <p className="mt-3 rounded-xl bg-zinc-50 px-4 py-3 text-[13px] leading-relaxed whitespace-pre-wrap text-zinc-700 ring-1 ring-zinc-200">
          {ai.feedback}
        </p>
      )}
    </section>
  );
}
