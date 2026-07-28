import { getSkillRadarDetail } from "@/lib/learning/skill-radar";

import { mypageIcons } from "./icon-map";
import { SkillRadarChart } from "./skill-radar-chart";

// 성장 리포트 카드 — 코드 품질 5축을 레이더(스파이더) 차트로.
// 나(사용자) vs 전체 평균을 겹쳐, 강점·약점을 한눈에 인식.
// 어떤 축이 실측인지는 meta 로 받아 하단 카피에 정직하게 표기한다.
export async function GrowthReportCard({ userId }: { userId: string }) {
  const { points, meta } = await getSkillRadarDetail("be-python", userId);
  const Icon = mypageIcons.target;

  // 실측 상태별 안내 카피 (정직 톤 — 예시값이 섞여 있으면 반드시 밝힌다).
  const notes: string[] = [];
  if (meta.deterministicLive) {
    notes.push("구문 정확도·로직 구현도는 내 제출로 측정한 값이에요 (문제당 최신 제출 기준).");
  } else {
    notes.push(
      "구문 정확도·로직 구현도는 아직 예시예요. 연습/실력향상 문제를 제출하면 실측으로 바뀝니다.",
    );
  }
  if (meta.aiLive) {
    notes.push("개념·효율·해석은 AI 진단 점수의 평균이에요.");
  } else {
    notes.push("개념·효율·해석은 아직 예시예요. 실력향상 문제를 제출하면 AI 진단으로 측정됩니다.");
  }
  notes.push(
    meta.averageLive
      ? "전체 평균은 이용자 데이터로 집계한 값이에요."
      : "전체 평균은 아직 예시예요 (이용 데이터가 쌓이면 실제 평균으로 바뀝니다).",
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

      <p className="mt-3 text-center text-[11px] leading-relaxed text-zinc-400">
        {notes.join(" ")}
      </p>
    </section>
  );
}
