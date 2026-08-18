"use client";

// 학습 캘린더 — 서버(calendar-queries)가 집계한 날짜별 요약을 렌더한다.
// 칸 규칙: 색상 = 그날 대표 문법 테마 / 진하기 = 학습 깊이(영상만 vs 문제 통과)
//          우상단 체크 배지 = 이전에 틀린 문제를 그날 해결(오답 복습 완료)
// 인터랙션(월 이동·날짜 선택)만 클라이언트에서 처리하고 계산은 전부 서버에서 끝낸 상태로 받는다.
// 오늘 날짜(KST)는 서버가 넘겨준 값을 쓴다 — 브라우저 타임존에 의존하지 않기 위해.

import { useState } from "react";

import { mypageIcons } from "./icon-map";
import { LESSON_THEMES, getTheme } from "@/lib/learning/lesson-themes";
import type {
  CalendarDay,
  LearningCalendar as CalendarData,
} from "@/lib/learning/calendar-queries";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

function dateKeyOf(year: number, month: number, day: number): string {
  const mm = String(month + 1).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}

function formatKoreanDate(key: string): string {
  const [y, m, d] = key.split("-").map(Number);
  return `${y}년 ${m}월 ${d}일`;
}

export function LearningCalendar({
  calendar,
  todayKey,
}: {
  calendar: CalendarData;
  /** 서버가 계산한 KST 오늘 날짜 "YYYY-MM-DD" */
  todayKey: string;
}) {
  // 계산은 전부 렌더 중 직접 수행한다 (React Compiler 자동 메모이제이션 — 수동 useMemo 불필요).
  const [todayYearNum, todayMonthNum] = todayKey.split("-").map(Number);
  const todayYear = todayYearNum;
  const todayMonth = todayMonthNum - 1;

  // 0 = 이번 달, -1 = 지난달 …
  const [monthOffset, setMonthOffset] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);

  const viewDate = new Date(Date.UTC(todayYear, todayMonth + monthOffset, 1));
  const year = viewDate.getUTCFullYear();
  const month = viewDate.getUTCMonth();
  const firstWeekday = viewDate.getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();

  const Flame = mypageIcons.flame;
  const Check = mypageIcons.check;
  const ChevronLeft = mypageIcons.chevronLeft;
  const ChevronRight = mypageIcons.chevronRight;

  const selectedDay: CalendarDay | null = selected ? (calendar.days[selected] ?? null) : null;

  // 이번 달 학습 일수 (헤더 보조 정보)
  const monthPrefix = `${year}-${String(month + 1).padStart(2, "0")}-`;
  const monthActiveDays = Object.keys(calendar.days).filter((k) =>
    k.startsWith(monthPrefix),
  ).length;

  return (
    <div className="space-y-4">
      {/* 연속 학습일 배너 */}
      <section
        className={cn(
          "rounded-2xl p-5 shadow-sm ring-1",
          calendar.streak > 0
            ? "bg-gradient-to-r from-violet-500 to-purple-600 ring-violet-300"
            : "bg-white ring-zinc-200/80",
        )}
      >
        {calendar.streak > 0 ? (
          <div className="flex items-center gap-3">
            <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-white/20">
              <Flame className="size-6 text-white" strokeWidth={2.25} aria-hidden />
            </span>
            <div>
              <p className="text-xl font-bold text-white sm:text-2xl">
                {calendar.streak}일 연속 열공 중!
              </p>
              <p className="mt-0.5 text-[13px] text-violet-100">
                최근 6개월 동안 {calendar.activeDays}일 학습했어요. 오늘도 이어가 볼까요?
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-zinc-100">
              <Flame className="size-6 text-zinc-400" strokeWidth={2.25} aria-hidden />
            </span>
            <div>
              <p className="text-base font-bold text-zinc-900">아직 연속 기록이 없어요</p>
              <p className="mt-0.5 text-[13px] text-zinc-500">
                오늘 강의를 듣거나 문제를 풀면 연속 학습일이 쌓이기 시작해요.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* 캘린더 */}
      <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-zinc-200/80 sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-zinc-900">
              {year}년 {month + 1}월
            </h2>
            <p className="mt-0.5 text-[12px] text-zinc-500">이 달에 {monthActiveDays}일 학습</p>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => {
                setMonthOffset((v) => v - 1);
                setSelected(null);
              }}
              aria-label="이전 달"
              className="inline-flex size-8 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
            >
              <ChevronLeft className="size-4" strokeWidth={2.25} aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => {
                setMonthOffset((v) => Math.min(0, v + 1));
                setSelected(null);
              }}
              disabled={monthOffset >= 0}
              aria-label="다음 달"
              className="inline-flex size-8 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronRight className="size-4" strokeWidth={2.25} aria-hidden />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1.5 text-center">
          {WEEKDAYS.map((d) => (
            <div key={d} className="py-1 text-[11px] font-medium text-zinc-400">
              {d}
            </div>
          ))}
          {Array.from({ length: firstWeekday }, (_, i) => (
            <div key={`pad-${i}`} aria-hidden />
          ))}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const key = dateKeyOf(year, month, day);
            const entry = calendar.days[key];
            const theme = getTheme(entry?.themeKey);
            const isToday = key === todayKey;
            const isSelected = key === selected;

            // 색상 = 테마, 진하기 = 깊이. 테마를 못 정한 날은 회색 톤으로 폴백.
            const filled = entry
              ? theme
                ? entry.depth === "deep"
                  ? theme.deepClass
                  : theme.lightClass
                : entry.depth === "deep"
                  ? "bg-zinc-500 text-white"
                  : "bg-zinc-100 text-zinc-700 ring-1 ring-zinc-200"
              : "bg-zinc-50 text-zinc-300";

            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelected(isSelected ? null : key)}
                aria-label={`${formatKoreanDate(key)}${entry ? " 학습 기록 있음" : " 학습 기록 없음"}`}
                aria-pressed={isSelected}
                className={cn(
                  "relative flex aspect-square items-center justify-center rounded-lg text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500",
                  filled,
                  entry && "hover:opacity-80",
                  isToday && "ring-2 ring-violet-500 ring-offset-1",
                  isSelected && "ring-2 ring-zinc-900 ring-offset-1",
                )}
              >
                {day}
                {entry && entry.revisitSolved > 0 && (
                  <span
                    className="absolute -top-1 -right-1 inline-flex size-4 items-center justify-center rounded-full bg-emerald-600 ring-2 ring-white"
                    title={`오답 복습 ${entry.revisitSolved}문제 해결`}
                  >
                    <Check className="size-2.5 text-white" strokeWidth={3} aria-hidden />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* 범례 */}
        <div className="mt-4 space-y-2 border-t border-zinc-100 pt-3">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            {LESSON_THEMES.map((t) => (
              <span
                key={t.key}
                className="inline-flex items-center gap-1.5 text-[11px] text-zinc-600"
              >
                <span className={cn("inline-block size-2.5 rounded-sm", t.dotClass)} />
                {t.label}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] text-zinc-500">
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block size-2.5 rounded-sm bg-violet-100 ring-1 ring-violet-200" />
              연한 칸 = 영상 학습
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block size-2.5 rounded-sm bg-violet-500" />
              짙은 칸 = 문제까지 통과
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-flex size-3 items-center justify-center rounded-full bg-emerald-600">
                <Check className="size-2 text-white" strokeWidth={3} aria-hidden />
              </span>
              오답 복습 해결
            </span>
          </div>
        </div>
      </section>

      {/* 날짜 상세 */}
      <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-zinc-200/80 sm:p-6">
        {!selected && (
          <>
            <h2 className="text-sm font-bold text-zinc-900">날짜별 학습 리포트</h2>
            <p className="mt-2 text-[13px] leading-relaxed text-zinc-500">
              캘린더에서 날짜를 누르면 그날 들은 강의, 푼 문제와 정답률, 자주 나온 오답 태그를 볼 수
              있어요.
            </p>
          </>
        )}

        {selected && !selectedDay && (
          <>
            <h2 className="text-sm font-bold text-zinc-900">{formatKoreanDate(selected)}</h2>
            <p className="mt-2 text-[13px] text-zinc-500">이 날은 학습 기록이 없어요.</p>
          </>
        )}

        {selectedDay && (
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-sm font-bold text-zinc-900">
                {formatKoreanDate(selectedDay.date)}
              </h2>
              {selectedDay.themes.map((k) => {
                const t = getTheme(k);
                if (!t) return null;
                return (
                  <span
                    key={k}
                    className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-600"
                  >
                    <span className={cn("inline-block size-2 rounded-sm", t.dotClass)} />
                    {t.label}
                  </span>
                );
              })}
              {selectedDay.revisitSolved > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-200">
                  <Check className="size-3" strokeWidth={3} aria-hidden />
                  오답 복습 {selectedDay.revisitSolved}문제 해결
                </span>
              )}
            </div>

            <dl className="mt-3 space-y-3">
              {selectedDay.videos.length > 0 && (
                <div>
                  <dt className="text-[11px] font-semibold text-zinc-500">수강한 강의</dt>
                  <dd className="mt-1 flex flex-col gap-1">
                    {selectedDay.videos.map((v) => (
                      <span key={v.label} className="text-[13px] text-zinc-700">
                        {v.label}
                        <span
                          className={cn(
                            "ml-1.5 text-[11px] font-medium",
                            v.completed ? "text-emerald-600" : "text-zinc-400",
                          )}
                        >
                          {v.completed ? "완료" : "시청"}
                        </span>
                      </span>
                    ))}
                  </dd>
                </div>
              )}

              {(selectedDay.problemsTried > 0 || selectedDay.exercisesTried > 0) && (
                <div>
                  <dt className="text-[11px] font-semibold text-zinc-500">푼 문제</dt>
                  <dd className="mt-1 flex flex-col gap-0.5 text-[13px] text-zinc-700">
                    {selectedDay.problemsTried > 0 && (
                      <span>
                        실력향상 문제 {selectedDay.problemsTried}회 제출 중{" "}
                        <span className="font-semibold text-zinc-900">
                          {selectedDay.problemsPassed}회 통과
                        </span>
                        <span className="ml-1 text-[11px] text-zinc-400">
                          (정답률{" "}
                          {Math.round(
                            (selectedDay.problemsPassed / selectedDay.problemsTried) * 100,
                          )}
                          %)
                        </span>
                      </span>
                    )}
                    {selectedDay.exercisesTried > 0 && (
                      <span>
                        연습 문제 {selectedDay.exercisesTried}회 제출 중{" "}
                        <span className="font-semibold text-zinc-900">
                          {selectedDay.exercisesPassed}회 통과
                        </span>
                        <span className="ml-1 text-[11px] text-zinc-400">
                          (정답률{" "}
                          {Math.round(
                            (selectedDay.exercisesPassed / selectedDay.exercisesTried) * 100,
                          )}
                          %)
                        </span>
                      </span>
                    )}
                  </dd>
                </div>
              )}

              {selectedDay.tags.length > 0 && (
                <div>
                  <dt className="text-[11px] font-semibold text-zinc-500">
                    이날 자주 나온 오답 태그
                  </dt>
                  <dd className="mt-1 flex flex-wrap gap-1.5">
                    {selectedDay.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-medium text-rose-700 ring-1 ring-rose-200"
                      >
                        {t}
                      </span>
                    ))}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        )}
      </section>
    </div>
  );
}
