import { redirect } from "next/navigation";

import { resolveLessonIcon } from "@/components/lessons/icon-map";
import { mypageIcons } from "@/components/mypage/icon-map";
import { LearningCalendar } from "@/components/mypage/learning-calendar";
import { getCurrentUser } from "@/lib/auth/get-user";
import { ExamDdayCard } from "@/components/mypage/exam-dday-card";
import { getLearningCalendar, kstDateKey } from "@/lib/learning/calendar-queries";
import { getWeakestLesson, listUpcomingExams } from "@/lib/learning/exam-queries";
import { deriveBadges, getLearningStats } from "@/lib/learning/stats-queries";
import { cn } from "@/lib/utils";

export const metadata = { title: "학습 캘린더 · CodeMong" };

// 학습 캘린더 — 실데이터 연결 완료 (mock 제거).
// 집계는 서버(getLearningCalendar)에서 끝내고, 캘린더 컴포넌트는 렌더·인터랙션만 담당한다.
// 오늘 날짜(KST)도 서버가 계산해 넘긴다 — 브라우저 타임존 의존 제거.
// 뱃지도 실데이터 파생 — 별도 저장 모델 없이 deriveBadges 가 기존 진도/제출에서 획득 여부를 계산한다.
export default async function CalendarPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/mypage/calendar");

  const [calendar, exams, weakest, stats] = await Promise.all([
    getLearningCalendar(user.id),
    listUpcomingExams(user.id),
    getWeakestLesson(user.id),
    getLearningStats("be-python", user.id),
  ]);
  const todayKey = kstDateKey(new Date());
  const badges = deriveBadges(stats);
  const acquiredCount = badges.filter((b) => b.acquired).length;

  const Award = mypageIcons.award;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">학습 캘린더</h1>
        <p className="mt-1 text-sm text-zinc-500">
          어떤 문법을 얼마나 깊이 공부했는지 날짜별로 확인할 수 있어요.
        </p>
      </header>

      <LearningCalendar calendar={calendar} todayKey={todayKey} exams={exams} />

      <ExamDdayCard exams={exams} weakest={weakest} todayKey={todayKey} />

      {/* 배지 — 실데이터 파생(획득 조건은 각 배지 hint 에 명시) */}
      <section className="rounded-2xl border border-zinc-200 bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-base font-bold text-zinc-900">
            <Award className="size-4 text-amber-500" />
            배지
          </h2>
          <span className="text-xs tabular-nums text-zinc-500">
            {acquiredCount}/{badges.length} 획득
          </span>
        </div>

        <ul className="grid grid-cols-3 gap-3 sm:grid-cols-5">
          {badges.map((badge) => {
            const Icon = resolveLessonIcon(badge.iconHint);
            return (
              <li
                key={badge.id}
                title={badge.hint}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-xl border p-3 text-center",
                  badge.acquired
                    ? "border-amber-200 bg-amber-50/50"
                    : "border-zinc-100 bg-zinc-50/60 opacity-60",
                )}
              >
                <div
                  className={cn(
                    "inline-flex size-10 items-center justify-center rounded-full ring-1",
                    badge.acquired
                      ? "bg-white text-amber-600 ring-amber-200"
                      : "bg-white text-zinc-400 ring-zinc-200",
                  )}
                >
                  <Icon className="size-4" />
                </div>
                <span
                  className={cn(
                    "text-[11px] font-medium",
                    badge.acquired ? "text-zinc-800" : "text-zinc-600",
                  )}
                >
                  {badge.label}
                </span>
                <span className="text-[10px] leading-tight text-zinc-400">{badge.hint}</span>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
