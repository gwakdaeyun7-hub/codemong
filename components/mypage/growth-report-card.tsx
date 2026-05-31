import { getSkillRadar } from "@/lib/learning/skill-radar";

import { mypageIcons } from "./icon-map";
import { SkillRadarChart } from "./skill-radar-chart";

// 성장 리포트 카드 — 영역별 학습 진행을 레이더(스파이더) 차트로.
// 사용자 폴리곤 vs 기준 곡선을 겹쳐, "어느 영역까지 자랐는지" 한눈에 인식.
export async function GrowthReportCard({ userId }: { userId: string }) {
  // 단일 MVP 코스(be-python) — 홈 카드 이수율 집계와 동일한 courseId 사용.
  const points = await getSkillRadar("be-python", userId);
  const Icon = mypageIcons.target;
  const hasProgress = points.some((p) => p.userValue > 0);

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="mb-1 flex items-center gap-2">
        <span className="inline-flex size-7 items-center justify-center rounded-full bg-violet-50 text-violet-600">
          <Icon className="size-4" />
        </span>
        <h2 className="text-base font-bold text-zinc-900">성장 리포트</h2>
      </div>
      <p className="mb-4 text-xs text-zinc-500">
        지금은 영역별 학습 진행을 보여줘요. 퀴즈가 연결되면 이해도 기반으로 바뀝니다.
      </p>

      <SkillRadarChart points={points} />

      {/* 범례 */}
      <div className="mt-2 flex items-center justify-center gap-5 text-xs">
        <span className="inline-flex items-center gap-1.5 text-zinc-600">
          <span className="inline-block size-2.5 rounded-sm bg-violet-500" />나
        </span>
        <span className="inline-flex items-center gap-1.5 text-zinc-600">
          <span className="inline-block h-0 w-3.5 border-t-2 border-dashed border-zinc-400" />
          기준 곡선
        </span>
      </div>

      <p className="mt-3 text-center text-[11px] text-zinc-400">
        {hasProgress
          ? "기준 곡선은 임시값이며, 학습 데이터가 쌓이면 실제 평균으로 전환됩니다."
          : "첫 강의를 완료하면 해당 영역이 자라납니다."}
      </p>
    </section>
  );
}
