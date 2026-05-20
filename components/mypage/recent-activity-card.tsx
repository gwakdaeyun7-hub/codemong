import Link from "next/link";

import { mypageIcons } from "./icon-map";

// MVP: 실제 시청 이력 모델이 없어 mock. 학습 진도 테이블 추가 시
// lib/learning-stats.ts 같은 모듈에서 fetch 해서 props 로 넘기는 형태로 교체.
const MOCK_RECENT: { lessonId: string; title: string; href: string }[] = [];

export function RecentActivityCard() {
  const ChevronRight = mypageIcons.chevronRight;
  const Sparkles = mypageIcons.sparkles;

  if (MOCK_RECENT.length === 0) {
    return (
      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="mb-1 flex items-center gap-2">
          <Sparkles className="size-4 text-violet-500" />
          <h2 className="text-base font-bold text-zinc-900">최근 학습</h2>
        </div>
        <p className="mt-1 text-xs text-zinc-500">
          아직 학습한 강의가 없어요. Python 1강부터 시작해볼까요?
        </p>
        <Link
          href="/courses/python/lessons/lesson-1"
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
      <h2 className="mb-4 text-base font-bold text-zinc-900">최근 학습</h2>
      <ul className="space-y-2">
        {MOCK_RECENT.map((item) => (
          <li key={item.lessonId}>
            <Link
              href={item.href}
              className="flex items-center justify-between rounded-xl border border-zinc-100 bg-white px-4 py-3 transition hover:border-violet-200 hover:bg-violet-50/30"
            >
              <span className="text-sm font-medium text-zinc-700">
                {item.title}
              </span>
              <ChevronRight className="size-4 text-zinc-400" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
