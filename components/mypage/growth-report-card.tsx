import { getSkillRadar } from "@/lib/learning/skill-radar";

import { mypageIcons } from "./icon-map";
import { SkillRadarChart } from "./skill-radar-chart";

// 성장 리포트 카드 — 코딩 역량 6축을 레이더(스파이더) 차트로.
// 나(사용자) vs 전체 평균을 겹쳐, 강점·약점을 한눈에 인식.
export async function GrowthReportCard({ userId }: { userId: string }) {
  // 단일 MVP 코스(be-python). 현재 getSkillRadar 는 고정 데모 데이터를 반환한다.
  const points = await getSkillRadar("be-python", userId);
  const Icon = mypageIcons.target;

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="mb-1 flex items-center gap-2">
        <span className="inline-flex size-7 items-center justify-center rounded-full bg-violet-50 text-violet-600">
          <Icon className="size-4" />
        </span>
        <h2 className="text-base font-bold text-zinc-900">성장 리포트</h2>
      </div>
      <p className="mb-4 text-xs text-zinc-500">
        코딩 역량을 6개 축으로 나눠 전체 평균과 비교해요.
      </p>

      <SkillRadarChart points={points} />

      {/* 범례 */}
      <div className="mt-2 flex items-center justify-center gap-5 text-xs">
        <span className="inline-flex items-center gap-1.5 text-zinc-600">
          <span className="inline-block size-2.5 rounded-sm bg-violet-500" />나
        </span>
        <span className="inline-flex items-center gap-1.5 text-zinc-600">
          <span className="inline-block h-0 w-3.5 border-t-2 border-dashed border-zinc-400" />
          전체 평균
        </span>
      </div>

      <p className="mt-3 text-center text-[11px] text-zinc-400">
        표시값은 예시이며, 코드 구현 문제와 퀴즈가 쌓이면 실제 측정값으로 전환됩니다.
      </p>
    </section>
  );
}
