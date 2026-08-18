"use client";

// 시험 D-Day 카드 — 학습 캘린더 하단.
//  · 다가오는 시험을 가까운 순으로 보여주고 (가장 가까운 시험은 크게)
//  · D-14 이내면 "가장 점수가 낮았던 단원" 보강 문제를 추천하는 스마트 알림을 띄운다 (사용자 확정)
//  · 시험 등록/삭제 폼 (여러 개 등록 가능)
// 계산(D-Day·약점 단원)은 서버에서 끝내고, 여기서는 렌더와 mutation 만 담당한다.

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { mypageIcons } from "./icon-map";
import { useToast } from "@/components/toast";
import { createExamAction, deleteExamAction } from "@/lib/learning/exam-actions";
import type { ExamItem, WeakestLesson } from "@/lib/learning/exam-queries";
import { cn } from "@/lib/utils";

/** 스마트 알림을 띄우기 시작하는 시점 (사용자 확정: 2주 전부터) */
const ALERT_WITHIN_DAYS = 14;

function ddayLabel(dday: number): string {
  if (dday === 0) return "D-DAY";
  return `D-${dday}`;
}

export function ExamDdayCard({
  exams,
  weakest,
  todayKey,
}: {
  exams: ExamItem[];
  weakest: WeakestLesson | null;
  /** 서버가 계산한 KST 오늘 날짜 — date input 의 최소값 */
  todayKey: string;
}) {
  const router = useRouter();
  const { success, error: toastError } = useToast();
  const [pending, startTransition] = useTransition();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  const Calendar = mypageIcons.calendar;
  const Target = mypageIcons.target;
  const ChevronRight = mypageIcons.chevronRight;

  const next = exams[0] ?? null;
  const rest = exams.slice(1);
  const showAlert = next !== null && next.dday <= ALERT_WITHIN_DAYS && weakest !== null;

  function handleAdd() {
    setFormError(null);
    startTransition(async () => {
      try {
        const result = await createExamAction(title, date);
        if (!result.ok) {
          setFormError(result.error);
          return;
        }
        setTitle("");
        setDate("");
        setAdding(false);
        success("시험 일정을 등록했어요.");
        router.refresh();
      } catch (err) {
        console.error("[CodeMong] createExamAction 실패:", err);
        setFormError("잠시 후 다시 시도해 주세요.");
      }
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      try {
        const result = await deleteExamAction(id);
        if (!result.ok) {
          toastError(result.error);
          return;
        }
        success("시험 일정을 지웠어요.");
        router.refresh();
      } catch (err) {
        console.error("[CodeMong] deleteExamAction 실패:", err);
        toastError("잠시 후 다시 시도해 주세요.");
      }
    });
  }

  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-zinc-200/80 sm:p-6">
      <div className="flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-base font-bold text-zinc-900">
          <Calendar className="size-4 text-violet-600" aria-hidden />
          시험 D-Day
        </h2>
        {!adding && (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="rounded-lg px-2.5 py-1.5 text-[13px] font-medium text-violet-600 transition hover:bg-violet-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
          >
            일정 추가
          </button>
        )}
      </div>

      {/* 가장 가까운 시험 */}
      {next ? (
        <div className="mt-3 flex items-center gap-4 rounded-xl bg-violet-50 px-4 py-3 ring-1 ring-violet-200">
          <span className="text-2xl font-bold text-violet-700 tabular-nums sm:text-3xl">
            {ddayLabel(next.dday)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-zinc-900">{next.title}</p>
            <p className="text-[12px] text-zinc-500">{next.date}</p>
          </div>
          <button
            type="button"
            onClick={() => handleDelete(next.id)}
            disabled={pending}
            className="shrink-0 rounded-lg px-2 py-1 text-[12px] font-medium text-zinc-400 transition hover:text-rose-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 disabled:opacity-50"
          >
            삭제
          </button>
        </div>
      ) : (
        !adding && (
          <p className="mt-3 text-[13px] leading-relaxed text-zinc-500">
            등록된 시험이 없어요. 중간·기말고사 날짜를 등록하면 남은 일수와 함께 보강할 단원을
            안내해 드려요.
          </p>
        )
      )}

      {/* 스마트 알림 — D-14 이내 + 약점 단원이 있을 때만 */}
      {showAlert && weakest && (
        <div className="mt-3 rounded-xl bg-amber-50 px-4 py-3 ring-1 ring-amber-200">
          <p className="flex items-start gap-2 text-[13px] leading-relaxed text-amber-900">
            <Target className="mt-0.5 size-4 shrink-0 text-amber-600" aria-hidden />
            <span>
              {next.dday === 0 ? "오늘이 시험날이에요!" : `시험까지 ${next.dday}일 남았어요!`}{" "}
              {weakest.reason === "score" ? (
                <>
                  그동안 가장 점수가 낮았던 <span className="font-semibold">{weakest.title}</span>{" "}
                  단원
                  {weakest.basis === "ai" ? " (AI 진단 평균 " : " (해결률 "}
                  {weakest.score}점) 보강 문제를 풀어볼까요?
                </>
              ) : (
                <>
                  아직 풀지 않은 <span className="font-semibold">{weakest.title}</span> 단원부터
                  시작해 볼까요?
                </>
              )}
            </span>
          </p>
          <Link
            href={weakest.href}
            className="mt-2 inline-flex items-center gap-1 rounded-lg bg-amber-600 px-3 py-1.5 text-[13px] font-semibold text-white transition hover:bg-amber-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
          >
            {weakest.lessonNumber}강 문제 풀러 가기
            <span className="text-[11px] font-normal opacity-90">
              ({weakest.solved}/{weakest.total} 해결)
            </span>
            <ChevronRight className="size-3.5" strokeWidth={2.5} aria-hidden />
          </Link>
        </div>
      )}

      {/* 나머지 시험 목록 */}
      {rest.length > 0 && (
        <ul className="mt-3 flex flex-col gap-1">
          {rest.map((e) => (
            <li
              key={e.id}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] ring-1 ring-zinc-200"
            >
              <span className="w-12 shrink-0 font-semibold text-zinc-600 tabular-nums">
                {ddayLabel(e.dday)}
              </span>
              <span className="min-w-0 flex-1 truncate text-zinc-800">{e.title}</span>
              <span className="shrink-0 text-[12px] text-zinc-400">{e.date}</span>
              <button
                type="button"
                onClick={() => handleDelete(e.id)}
                disabled={pending}
                className="shrink-0 rounded px-1.5 py-0.5 text-[12px] text-zinc-400 transition hover:text-rose-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 disabled:opacity-50"
              >
                삭제
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* 등록 폼 */}
      {adding && (
        <div className="mt-3 rounded-xl bg-zinc-50 p-4 ring-1 ring-zinc-200">
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="시험 이름 (예: 중간고사)"
              maxLength={40}
              className="min-w-0 flex-1 rounded-lg bg-white px-3 py-2 text-[13px] text-zinc-800 ring-1 ring-zinc-300 focus:ring-2 focus:ring-violet-400 focus:outline-none"
            />
            <input
              type="date"
              value={date}
              min={todayKey}
              onChange={(e) => setDate(e.target.value)}
              className="shrink-0 rounded-lg bg-white px-3 py-2 text-[13px] text-zinc-800 ring-1 ring-zinc-300 focus:ring-2 focus:ring-violet-400 focus:outline-none"
            />
          </div>
          {formError && <p className="mt-2 text-[12px] text-rose-600">{formError}</p>}
          <div className="mt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={handleAdd}
              disabled={pending}
              className={cn(
                "rounded-lg bg-violet-600 px-3.5 py-2 text-[13px] font-semibold text-white transition hover:bg-violet-700",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 disabled:cursor-not-allowed disabled:opacity-50",
              )}
            >
              등록
            </button>
            <button
              type="button"
              onClick={() => {
                setAdding(false);
                setFormError(null);
              }}
              disabled={pending}
              className="rounded-lg px-2.5 py-2 text-[13px] font-medium text-zinc-500 transition hover:text-zinc-700 disabled:opacity-50"
            >
              취소
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
