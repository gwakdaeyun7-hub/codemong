import type { LearningStats } from "@/lib/learning/stats-queries";

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

// 학습 현황 — 전부 실데이터(getLearningStats). 네 지표 모두 다른 화면과 같은 집계를 쓴다:
//   완료 강의 = 홈/강의 목록 이수율과 동일(getCourseCompletion), 연속 학습일 = 학습 캘린더와 동일,
//   해결 문제 = 실력향상 트랙, 연습 통과 = 강의 목록 "N/M 통과" 합.
// "평균 이해도"는 퀴즈(이해도 2층)가 미구현이라 지표에서 제외했다 — 없는 숫자를 만들지 않는다.
export function MasteryStatsCard({ stats }: { stats: LearningStats }) {
  const items: Stat[] = [
    {
      label: "완료한 강의",
      value: `${stats.completedLessons}/${stats.totalLessons}`,
      hint: "영상 학습 + 그 강 연습 통과",
      icon: "book",
      tone: "violet",
    },
    {
      label: "해결한 문제",
      value: `${stats.solvedProblems}/${stats.totalProblems}`,
      hint: "실력향상 문제 은행",
      icon: "target",
      tone: "emerald",
    },
    {
      label: "연속 학습",
      value: `${stats.streak}일`,
      hint: `학습한 날 ${stats.activeDays}일`,
      icon: "flame",
      tone: "amber",
    },
    {
      label: "연습 통과",
      value: `${stats.passedExercises}/${stats.totalExercises}`,
      hint: "강별 연습 문제",
      icon: "award",
      tone: "sky",
    },
  ];

  const hasActivity =
    stats.completedLessons > 0 ||
    stats.solvedProblems > 0 ||
    stats.passedExercises > 0 ||
    stats.activeDays > 0;

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-zinc-900">학습 현황</h2>
          <p className="mt-0.5 text-xs text-zinc-500">
            {hasActivity
              ? "내 학습 기록으로 집계한 값이에요."
              : "아직 학습 기록이 없습니다. 첫 강의를 시작해보세요."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {items.map((stat) => {
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
              <p className="mt-0.5 text-lg font-bold tabular-nums text-zinc-900">
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
