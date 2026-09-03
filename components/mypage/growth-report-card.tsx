import Link from "next/link";

import { getSkillRadarDetail } from "@/lib/learning/skill-radar";

import { mypageIcons } from "./icon-map";
import { SkillRadarChart } from "./skill-radar-chart";

// 성장 리포트 카드 — 코드 품질 5축을 레이더(스파이더) 차트로.
// 나(사용자) vs 전체 평균을 겹쳐, 강점·약점을 한눈에 인식.
// 어떤 축이 실측인지는 meta 로 받아 하단 카피에 정직하게 표기한다.
export async function GrowthReportCard({ userId }: { userId: string }) {
  const { points, meta } = await getSkillRadarDetail("be-python", userId);
  const Icon = mypageIcons.target;

  // 안내 카피 — 표시되는 값은 전부 실측이고, 아직 측정 안 된 축만 그 사실을 밝힌다.
  const notes: string[] = [];
  if (meta.deterministicLive) {
    notes.push("구문 정확도·로직 구현도는 내 제출로 측정한 값이에요 (문제당 최신 제출 기준).");
  } else {
    notes.push("구문 정확도·로직 구현도는 아직 측정 전이에요 — 연습/실력향상 문제를 제출하면 채워집니다.");
  }
  if (meta.aiLive) {
    notes.push("개념·효율·해석은 AI 진단 점수의 평균이에요.");
  } else {
    notes.push("개념·효율·해석은 아직 측정 전이에요 — 실력향상 문제를 제출하면 AI 진단으로 채워집니다.");
  }
  notes.push(
    meta.averageLive
      ? "전체 평균은 이용자 데이터로 집계한 값이에요."
      : "전체 평균은 표본이 모이면 표시돼요.",
  );

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="mb-1 flex items-center gap-2">
        <span className="inline-flex size-7 items-center justify-center rounded-full bg-violet-50 text-violet-600">
          <Icon className="size-4" />
        </span>
        <h2 className="text-base font-bold text-zinc-900">성장 리포트</h2>
      </div>
      <p className="mb-4 text-xs text-zinc-500">
        코드 작성 실력을 5개 축으로 나눠 전체 평균과 비교해요.
      </p>

      {!meta.hasUserData ? (
        // 표본이 없으면 차트를 그리지 않는다 — 빈 레이더보다 "무엇을 하면 채워지는지" 안내가 정직하다.
        <div className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50/60 px-4 py-8 text-center">
          <p className="text-[13px] font-medium text-zinc-600">아직 측정할 제출이 없어요.</p>
          <p className="mt-1 text-[12px] text-zinc-500">
            연습 문제나 실력향상 문제를 한 번 제출하면 5개 축이 실제 점수로 채워집니다.
          </p>
          <Link
            href="/skill"
            className="mt-4 inline-flex h-9 items-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 px-4 text-[13px] font-semibold text-white shadow-sm transition hover:brightness-105"
          >
            실력향상 문제 풀어보기
          </Link>
        </div>
      ) : (
        <>
          <SkillRadarChart points={points} />

          {/* 범례 — 평균은 실집계일 때만 노출 */}
          <div className="mt-2 flex items-center justify-center gap-5 text-xs">
            <span className="inline-flex items-center gap-1.5 text-zinc-600">
              <span className="inline-block size-2.5 rounded-sm bg-violet-500" />나
            </span>
            {meta.averageLive && (
              <span className="inline-flex items-center gap-1.5 text-zinc-600">
                <span className="inline-block size-2.5 rounded-sm bg-amber-500" />
                전체 평균
              </span>
            )}
          </div>
        </>
      )}

      <p className="mt-3 text-center text-[11px] leading-relaxed text-zinc-400">
        {notes.join(" ")}
      </p>
    </section>
  );
}
