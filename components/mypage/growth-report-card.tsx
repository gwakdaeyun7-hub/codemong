import { getSkillRadar } from "@/lib/learning/skill-radar";

import { mypageIcons } from "./icon-map";
import { SkillRadarChart } from "./skill-radar-chart";

// 성장 리포트 카드 — 코드 품질 5축을 레이더(스파이더) 차트로.
// 나(사용자) vs 전체 평균을 겹쳐, 강점·약점을 한눈에 인식.
export async function GrowthReportCard({ userId }: { userId: string }) {
  // 단일 MVP 코스(be-python). 구문 정확도·로직 구현도는 실측(ExerciseAttempt),
  // 개념/효율/해석 3축과 전체 평균은 아직 데모값이다.
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
        코드 작성 실력을 5개 축으로 나눠 전체 평균과 비교해요.
      </p>

      <SkillRadarChart points={points} />

      {/* 범례 */}
      <div className="mt-2 flex items-center justify-center gap-5 text-xs">
        <span className="inline-flex items-center gap-1.5 text-zinc-600">
          <span className="inline-block size-2.5 rounded-sm bg-violet-500" />나
        </span>
        <span className="inline-flex items-center gap-1.5 text-zinc-600">
          <span className="inline-block size-2.5 rounded-sm bg-amber-500" />
          전체 평균
        </span>
      </div>

      <p className="mt-3 text-center text-[11px] text-zinc-400">
        구문 정확도·로직 구현도는 푼 문제로 측정한 값이고, 개념·효율·해석 축과 전체 평균은 아직
        예시예요. AI 분석이 붙으면 실제 측정값으로 전환됩니다.
      </p>
    </section>
  );
}
