import { redirect } from "next/navigation";

import { mypageIcons } from "@/components/mypage/icon-map";
import { LearningCalendar } from "@/components/mypage/learning-calendar";
import { getCurrentUser } from "@/lib/auth/get-user";
import { getLearningCalendar, kstDateKey } from "@/lib/learning/calendar-queries";

export const metadata = { title: "학습 캘린더 · CodeMong" };

// 학습 캘린더 — 실데이터 연결 완료 (mock 제거).
// 집계는 서버(getLearningCalendar)에서 끝내고, 캘린더 컴포넌트는 렌더·인터랙션만 담당한다.
// 오늘 날짜(KST)도 서버가 계산해 넘긴다 — 브라우저 타임존 의존 제거.
// 배지 컬렉션은 아직 획득 조건/저장 모델이 없어 mock 자리로 남겨둔다.
export default async function CalendarPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/mypage/calendar");

  const calendar = await getLearningCalendar(user.id);
  const todayKey = kstDateKey(new Date());

  const Award = mypageIcons.award;
  const Flame = mypageIcons.flame;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">학습 캘린더</h1>
        <p className="mt-1 text-sm text-zinc-500">
          어떤 문법을 얼마나 깊이 공부했는지 날짜별로 확인할 수 있어요.
        </p>
      </header>

      <LearningCalendar calendar={calendar} todayKey={todayKey} />

      {/* 배지 컬렉션 (mock — 획득 조건/저장 모델 미구현) */}
      <section className="rounded-2xl border border-zinc-200 bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-base font-bold text-zinc-900">
            <Award className="size-4 text-amber-500" />
            배지
          </h2>
          <span className="text-xs text-zinc-500">준비 중</span>
        </div>

        <ul className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {[
            { name: "첫 강의 완료", icon: Award },
            { name: "3일 연속 학습", icon: Flame },
            { name: "첫 댓글 작성", icon: mypageIcons.messageSquare },
            { name: "이해도 50%", icon: mypageIcons.target },
            { name: "이해도 80%", icon: mypageIcons.target },
            { name: "코스 1개 수료", icon: Award },
          ].map((b, i) => {
            const Icon = b.icon;
            return (
              <li
                key={i}
                className="flex flex-col items-center gap-2 rounded-xl border border-zinc-100 bg-zinc-50/60 p-3 text-center opacity-60"
                title="아직 획득 전"
              >
                <div className="inline-flex size-10 items-center justify-center rounded-full bg-white ring-1 ring-zinc-200">
                  <Icon className="size-4 text-zinc-400" />
                </div>
                <span className="text-[11px] font-medium text-zinc-600">{b.name}</span>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
