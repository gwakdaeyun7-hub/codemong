import Link from "next/link";

import type { RecentLessonItem } from "@/lib/learning/stats-queries";

import { mypageIcons } from "./icon-map";

// 최근 학습 — 실데이터(listRecentLessons). 영상 진도/프로젝트 진도의 updatedAt 최신순.
// 기록이 없을 때만 1강 시작 안내를 보여준다.
export function RecentActivityCard({ items }: { items: RecentLessonItem[] }) {
  const ChevronRight = mypageIcons.chevronRight;
  const Sparkles = mypageIcons.sparkles;
  const Check = mypageIcons.check;

  if (items.length === 0) {
    return (
      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="mb-1 flex items-center gap-2">
          <Sparkles className="size-4 text-violet-500" />
          <h2 className="text-base font-bold text-zinc-900">최근 학습</h2>
        </div>
        <p className="mt-1 text-xs text-zinc-500">
          아직 학습한 강의가 없어요. Python 1강부터 시작해볼까요?
        </p>
        {/* courseId 는 정식 id(be-python) 로 — 진도는 lessonRef "<courseId>/<lessonId>" 로 저장되므로
            여기서 python 별칭으로 보내면 그 학습이 be-python 기준 집계(홈·학습 현황)에서 빠진다. */}
        <Link
          href="/courses/be-python/lessons/lesson-1"
          className="mt-4 inline-flex h-10 items-center gap-1.5 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:brightness-105"
        >
          Python 1강 시작하기
          <ChevronRight className="size-4" />
        </Link>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Sparkles className="size-4 text-violet-500" />
        <h2 className="text-base font-bold text-zinc-900">최근 학습</h2>
      </div>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.lessonId}>
            <Link
              href={item.href}
              className="flex items-center justify-between gap-3 rounded-xl border border-zinc-100 bg-white px-4 py-3 transition hover:border-violet-200 hover:bg-violet-50/30"
            >
              <span className="flex min-w-0 items-center gap-2">
                <span className="shrink-0 text-[11px] font-semibold text-violet-600">
                  {item.lessonNumber}강
                </span>
                <span className="truncate text-sm font-medium text-zinc-700">
                  {item.title}
                </span>
              </span>
              <span className="flex shrink-0 items-center gap-1.5">
                {item.completed && (
                  <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">
                    <Check className="size-3" strokeWidth={2.5} />
                    완료
                  </span>
                )}
                <ChevronRight className="size-4 text-zinc-400" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
