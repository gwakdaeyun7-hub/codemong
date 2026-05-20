import { redirect } from "next/navigation";

import { mypageIcons } from "@/components/mypage/icon-map";
import { getCurrentUser } from "@/lib/auth/get-user";

export const metadata = { title: "학습 캘린더 · CodeMong" };

// MVP: 실제 학습 진도 데이터 모델이 아직 없어 캘린더는 mock 자리로만 둠.
// backend 라운드에서 LearningEvent(또는 유사) 테이블 추가 시
// 그 데이터를 props 로 받아 calendarData 자리에 채워넣는 형태로 교체.
export default async function CalendarPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/mypage/calendar");

  const Calendar = mypageIcons.calendar;
  const Award = mypageIcons.award;
  const Flame = mypageIcons.flame;

  // 이번 달 캘린더 그리드 (1일 ~ 말일). mock 으로 모든 칸이 비어있음.
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const firstDay = new Date(year, month, 1).getDay(); // 일=0
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = now.getDate();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
          학습 캘린더
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          매일 조금씩이라도 이해를 쌓아가는 모습을 보여드릴 예정이에요.
        </p>
      </header>

      {/* 캘린더 */}
      <section className="rounded-2xl border border-zinc-200 bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-base font-bold text-zinc-900">
            <Calendar className="size-4 text-violet-600" />
            {year}년 {month + 1}월
          </h2>
          <span className="text-xs text-zinc-500">
            (현재 학습 추적 미연동 — 자리만 표시)
          </span>
        </div>

        <div className="grid grid-cols-7 gap-1.5 text-center text-[11px] text-zinc-500">
          {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
            <div key={d} className="py-1 font-medium">
              {d}
            </div>
          ))}
          {Array.from({ length: firstDay }, (_, i) => (
            <div key={`pad-${i}`} aria-hidden />
          ))}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const isToday = day === today;
            return (
              <div
                key={day}
                className={
                  isToday
                    ? "flex aspect-square items-center justify-center rounded-lg bg-violet-100 text-sm font-semibold text-violet-700 ring-1 ring-violet-300"
                    : "flex aspect-square items-center justify-center rounded-lg bg-zinc-50 text-sm text-zinc-400"
                }
              >
                {day}
              </div>
            );
          })}
        </div>
      </section>

      {/* 배지 컬렉션 (mock) */}
      <section className="rounded-2xl border border-zinc-200 bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-base font-bold text-zinc-900">
            <Award className="size-4 text-amber-500" />
            배지
          </h2>
          <span className="text-xs text-zinc-500">획득 0 / 전체 6</span>
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
                <span className="text-[11px] font-medium text-zinc-600">
                  {b.name}
                </span>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
