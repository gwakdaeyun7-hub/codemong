import { mypageIcons } from "./icon-map";

type Stat = {
  label: string;
  value: string;
  hint: string;
  icon: keyof typeof mypageIcons;
  tone: "violet" | "amber" | "emerald" | "sky";
};

const TONE_BG: Record<Stat["tone"], string> = {
  violet: "bg-violet-50 text-violet-600",
  amber: "bg-amber-50 text-amber-600",
  emerald: "bg-emerald-50 text-emerald-600",
  sky: "bg-sky-50 text-sky-600",
};

// MVP: 학습 통계 데이터 모델이 아직 없어 mock 데이터로 자리만 잡아둠.
// 실제 mastery 계산 / streak / 배지는 backend 라운드에서 lib/learning-stats.ts 같은 모듈로 분리해 연결.
const MOCK_STATS: Stat[] = [
  { label: "학습한 강의", value: "0개", hint: "수강 시작 후 자동 집계", icon: "book", tone: "violet" },
  { label: "평균 이해도", value: "—", hint: "퀴즈 풀이 후 집계", icon: "target", tone: "emerald" },
  { label: "연속 학습", value: "0일", hint: "오늘부터 시작", icon: "flame", tone: "amber" },
  { label: "획득 배지", value: "0개", hint: "이해도 마일스톤 달성 시", icon: "award", tone: "sky" },
];

export function MasteryStatsCard() {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-zinc-900">학습 현황</h2>
          <p className="mt-0.5 text-xs text-zinc-500">
            아직 학습 기록이 없습니다. 첫 강의를 시작해보세요.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {MOCK_STATS.map((stat) => {
          const Icon = mypageIcons[stat.icon];
          return (
            <div
              key={stat.label}
              className="rounded-xl border border-zinc-100 bg-zinc-50/60 p-4"
            >
              <div
                className={`inline-flex size-9 items-center justify-center rounded-xl ${TONE_BG[stat.tone]}`}
              >
                <Icon className="size-4" />
              </div>
              <p className="mt-3 text-xs font-medium text-zinc-500">
                {stat.label}
              </p>
              <p className="mt-0.5 text-lg font-bold text-zinc-900">
                {stat.value}
              </p>
              <p className="mt-0.5 truncate text-[11px] text-zinc-400">
                {stat.hint}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
