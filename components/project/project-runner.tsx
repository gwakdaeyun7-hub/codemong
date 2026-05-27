"use client";

// 프로젝트형 강의(13강~) 실행 화면 — 영상 카드 대신 강의 상세에 렌더된다.
// 문제 설명을 읽고 코드를 작성 → 실행/제출 → 테스트 통과 시 다음 스텝 해금(이해도 게이팅).
// 채점은 클라이언트(Pyodide)에서 수행하고, 통과 결과만 passStepAction 으로 서버에 기록한다.
// (아이콘이 적어 icon-map 없이 직접 import — lesson-content/toast 와 동일한 예외.)

import { useEffect, useMemo, useState, useTransition } from "react";
import dynamic from "next/dynamic";
import { Check, ChevronRight, Lightbulb, Lock, Play, RotateCcw, Send } from "lucide-react";

import { useToast } from "@/components/toast";
import { passStepAction } from "@/lib/learning/project-actions";
import {
  gradeStep,
  preloadPyodide,
  runPythonInteractive,
  type CaseResult,
} from "@/lib/project/grader";
import { cn } from "@/lib/utils";
import type { Project } from "@/lib/project-content";

const CodeEditor = dynamic(() => import("./code-editor"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[200px] items-center justify-center rounded-xl bg-zinc-50 text-sm text-zinc-400 ring-1 ring-zinc-200">
      에디터 불러오는 중…
    </div>
  ),
});

export function ProjectRunner({
  project,
  lessonRef,
  initialStatuses,
  initialCode,
}: {
  project: Project;
  lessonRef: string;
  initialStatuses: Record<string, boolean>;
  initialCode: Record<string, string>;
}) {
  const { success, error: toastError } = useToast();

  const [statuses, setStatuses] = useState<Record<string, boolean>>(initialStatuses);
  const [codeByStep, setCodeByStep] = useState<Record<string, string>>(() => {
    const m: Record<string, string> = {};
    for (const s of project.steps) m[s.id] = initialCode[s.id] ?? s.starterCode;
    return m;
  });

  const gradedSteps = useMemo(
    () => project.steps.filter((s) => s.tests.length > 0),
    [project.steps],
  );

  // 첫 진입 스텝: 진도가 없으면 step 0(설계)부터, 있으면 첫 미통과 채점 스텝.
  const firstIncompleteIndex = useMemo(() => {
    for (let i = 0; i < project.steps.length; i++) {
      const s = project.steps[i];
      if (s.tests.length > 0 && !initialStatuses[s.id]) return i;
    }
    return project.steps.length - 1;
  }, [project.steps, initialStatuses]);
  const hasProgress = Object.keys(initialStatuses).length > 0;

  const [activeIndex, setActiveIndex] = useState(hasProgress ? firstIncompleteIndex : 0);
  const [running, setRunning] = useState(false);
  const [cases, setCases] = useState<CaseResult[] | null>(null);
  const [consoleOut, setConsoleOut] = useState<string | null>(null);
  const [hintCount, setHintCount] = useState(0);
  const [inputReq, setInputReq] = useState<{
    prompt: string;
    resolve: (v: string) => void;
    reject: (e: unknown) => void;
  } | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [, startTransition] = useTransition();

  // Pyodide 백그라운드 프리로드 (첫 실행 지연 완화).
  useEffect(() => {
    void preloadPyodide().catch(() => {});
  }, []);

  const step = project.steps[activeIndex];
  const code = codeByStep[step.id] ?? step.starterCode;
  const isGraded = step.tests.length > 0;
  const passed = Boolean(statuses[step.id]);
  const passedCount = gradedSteps.filter((s) => statuses[s.id]).length;
  const progressPercent = gradedSteps.length
    ? Math.round((passedCount / gradedSteps.length) * 100)
    : 0;
  const hasNext = activeIndex < project.steps.length - 1;

  function unlocked(index: number): boolean {
    for (let i = 0; i < index; i++) {
      const s = project.steps[i];
      if (s.tests.length > 0 && !statuses[s.id]) return false;
    }
    return true;
  }

  function goToStep(index: number) {
    if (index < 0 || index >= project.steps.length || !unlocked(index)) return;
    setActiveIndex(index);
    setCases(null);
    setConsoleOut(null);
    setHintCount(0);
  }

  function handleChange(value: string) {
    setCodeByStep((prev) => ({ ...prev, [step.id]: value }));
  }

  function handleReset() {
    setCodeByStep((prev) => ({ ...prev, [step.id]: step.starterCode }));
    setCases(null);
    setConsoleOut(null);
  }

  // 대화형 입력 — 실행 중 input() 이 호출하면 모달을 띄우고, 입력/중단까지 Promise 로 기다린다.
  function requestInput(prompt: string): Promise<string> {
    return new Promise((resolve, reject) => {
      setInputValue("");
      setInputReq({ prompt, resolve, reject });
    });
  }

  function submitInput() {
    if (!inputReq) return;
    inputReq.resolve(inputValue);
    setInputReq(null);
    setInputValue("");
  }

  function cancelInput() {
    if (!inputReq) return;
    inputReq.reject(new Error("입력을 중단했어요"));
    setInputReq(null);
    setInputValue("");
  }

  async function handleRun() {
    setRunning(true);
    setCases(null);
    setConsoleOut(null);
    try {
      // 대화형 실행 — input() 을 만나면 화면 내 입력 모달이 뜬다(터미널처럼).
      const r = await runPythonInteractive(code, requestInput);
      const out = r.stdout.trimEnd();
      setConsoleOut((out || "(출력 없음)") + (r.error ? `\n⚠ ${r.error}` : ""));
    } catch (err) {
      console.error("[CodeMong] Pyodide 실행 실패:", err);
      const detail = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
      setConsoleOut(
        `파이썬 실행 환경을 불러오지 못했어요.\n오류: ${detail}\n\n(사내·학교 네트워크나 광고 차단 확장프로그램이 cdn.jsdelivr.net 을 막으면 이 오류가 납니다.)`,
      );
    } finally {
      setRunning(false);
    }
  }

  async function handleSubmit() {
    setRunning(true);
    setConsoleOut(null);
    try {
      const result = await gradeStep(code, step.tests);
      setCases(result.cases);
      if (result.allPassed) {
        setStatuses((prev) => ({ ...prev, [step.id]: true }));
        startTransition(async () => {
          try {
            const res = await passStepAction(lessonRef, step.id, code);
            if (res.ok) {
              if (res.completed) success("프로젝트를 완료했어요. 축하합니다!");
            } else {
              toastError(res.error);
            }
          } catch {
            toastError("진행 상황 저장에 실패했어요. 잠시 후 다시 시도해 주세요.");
          }
        });
      }
    } catch (err) {
      console.error("[CodeMong] Pyodide 채점 실패:", err);
      setCases(null);
      const detail = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
      setConsoleOut(`파이썬 실행 환경을 불러오지 못했어요.\n오류: ${detail}`);
      toastError("파이썬 실행 환경을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.");
    } finally {
      setRunning(false);
    }
  }

  const passedCases = cases ? cases.filter((c) => c.passed).length : 0;

  return (
    <section className="flex flex-col gap-4">
      {/* 헤더 */}
      <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-zinc-200/80 sm:p-6">
        <p className="text-xs font-semibold tracking-wide text-violet-600">
          프로젝트 · {passedCount}/{gradedSteps.length}단계 완료
        </p>
        <h2 className="mt-1 text-lg font-bold text-zinc-900 sm:text-xl">{project.title}</h2>
        <p className="mt-1.5 text-[13px] leading-relaxed text-zinc-600 sm:text-sm">
          {project.overview}
        </p>
        {project.concepts.length > 0 && (
          <div className="mt-3">
            <p className="mb-1.5 text-[11px] font-medium text-zinc-400">
              이 프로젝트에 필요한 개념
            </p>
            <div className="flex flex-wrap gap-1.5">
              {project.concepts.map((c) => (
                <span
                  key={c}
                  className="rounded-full bg-violet-50 px-2 py-0.5 text-[11px] font-medium text-violet-700"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        )}
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-zinc-100">
          <div
            className="h-full rounded-full bg-violet-500 transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* 스텝 칩 (가로 스크롤) */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {project.steps.map((s, i) => {
          const locked = !unlocked(i);
          const done = Boolean(statuses[s.id]);
          const active = i === activeIndex;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => goToStep(i)}
              disabled={locked}
              aria-current={active ? "step" : undefined}
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold transition",
                active
                  ? "bg-violet-600 text-white"
                  : done
                    ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-100"
                    : locked
                      ? "cursor-not-allowed bg-zinc-100 text-zinc-400"
                      : "bg-white text-zinc-600 ring-1 ring-zinc-200 hover:bg-zinc-50",
              )}
            >
              {done ? (
                <Check className="size-3.5" strokeWidth={2.5} aria-hidden />
              ) : locked ? (
                <Lock className="size-3" strokeWidth={2.5} aria-hidden />
              ) : null}
              {s.number === 0 ? "설계" : `${s.number}단계`}
            </button>
          );
        })}
      </div>

      {/* 현재 스텝 카드 */}
      <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-zinc-200/80 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-base font-bold text-zinc-900 sm:text-lg">
            {step.number === 0 ? step.title : `${step.number}단계 — ${step.title}`}
          </h3>
          {passed && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-200">
              <Check className="size-3" strokeWidth={2.5} aria-hidden />
              완료
            </span>
          )}
        </div>

        {step.conceptTags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {step.conceptTags.map((t) => (
              <span
                key={t}
                className="rounded-full bg-violet-50 px-2 py-0.5 text-[11px] font-medium text-violet-700"
              >
                {t}
              </span>
            ))}
          </div>
        )}

        <p className="mt-3 text-[13px] leading-relaxed whitespace-pre-wrap text-zinc-700 sm:text-sm">
          {step.prompt}
        </p>

        {isGraded ? (
          <div className="mt-4 flex flex-col gap-3">
            {step.example && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="mb-1 text-[11px] font-semibold text-zinc-500">입력 예시</p>
                  <pre className="overflow-x-auto rounded-lg bg-zinc-50 px-3 py-2 font-mono text-[12px] whitespace-pre-wrap text-zinc-700 ring-1 ring-zinc-200">
                    {step.example.stdin.join("\n")}
                  </pre>
                </div>
                <div>
                  <p className="mb-1 text-[11px] font-semibold text-zinc-500">출력 예시</p>
                  <pre className="overflow-x-auto rounded-lg bg-zinc-50 px-3 py-2 font-mono text-[12px] whitespace-pre-wrap text-zinc-700 ring-1 ring-zinc-200">
                    {step.example.stdout}
                  </pre>
                </div>
              </div>
            )}
            <CodeEditor value={code} onChange={handleChange} />

            {/* 실행 안내 — input() 은 실행 중 입력창으로 받는다 */}
            <p className="text-[12px] leading-relaxed text-zinc-500">
              <span className="font-semibold text-zinc-600">실행</span> 하면 코드가 돌아가다 input()
              을 만날 때마다 입력 창이 떠요. 위 「입력 예시」의 값을 차례대로 넣어보세요. (제출하면
              정해진 입력들로 자동 채점)
            </p>

            {/* 버튼 행 */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleRun}
                disabled={running}
                className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-100 px-3.5 py-2 text-[13px] font-semibold text-zinc-700 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Play className="size-3.5 fill-current" strokeWidth={0} aria-hidden />
                실행
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={running}
                className="inline-flex items-center gap-1.5 rounded-lg bg-violet-600 px-3.5 py-2 text-[13px] font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send className="size-3.5" strokeWidth={2.25} aria-hidden />
                제출하고 채점
              </button>
              <button
                type="button"
                onClick={handleReset}
                disabled={running}
                className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-[13px] font-medium text-zinc-500 transition hover:text-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RotateCcw className="size-3.5" strokeWidth={2.25} aria-hidden />
                처음으로
              </button>
              {running && <span className="text-xs text-zinc-400">실행 중…</span>}
            </div>

            {/* 실행 콘솔 */}
            {consoleOut !== null && (
              <div>
                <p className="mb-1 text-[11px] font-semibold text-zinc-500">실행 결과</p>
                <pre className="overflow-x-auto rounded-lg bg-zinc-900 px-3 py-2.5 font-mono text-[12px] leading-relaxed whitespace-pre-wrap text-zinc-100">
                  {consoleOut}
                </pre>
              </div>
            )}

            {/* 채점 결과 */}
            {cases && (
              <div className="flex flex-col gap-1.5">
                <p className="text-[11px] font-semibold text-zinc-500">
                  채점 결과 — {passedCases}/{cases.length} 통과
                </p>
                <p className="text-[11px] text-zinc-400">
                  채점은 정해진 입력들을 자동으로 넣어 코드가 여러 경우에 맞게 도는지 확인해요.
                  (위에서 직접 입력한 값과는 별개)
                </p>
                {cases.map((c, i) => (
                  <div
                    key={i}
                    className={cn(
                      "rounded-lg px-3 py-2 text-[12px] ring-1",
                      c.passed ? "bg-emerald-50 ring-emerald-200" : "bg-rose-50 ring-rose-200",
                    )}
                  >
                    <div className="flex items-center gap-1.5 font-semibold">
                      <span aria-hidden>{c.passed ? "✓" : "✗"}</span>
                      <span className={c.passed ? "text-emerald-700" : "text-rose-700"}>
                        {c.label}
                      </span>
                    </div>
                    {!c.passed && (
                      <div className="mt-1 space-y-0.5 text-zinc-500">
                        <p>입력: {c.stdin.join(", ") || "(없음)"}</p>
                        <p>내 출력: {c.stdout.trim() || "(없음)"}</p>
                        {c.error && <p className="text-rose-600">오류: {c.error}</p>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* 통과 안내 + 다음 단계 */}
            {passed && (
              <div className="flex items-center justify-between gap-3 rounded-xl bg-emerald-50 px-4 py-3 ring-1 ring-emerald-200">
                <p className="text-[13px] font-medium text-emerald-800">
                  통과했어요! {hasNext ? "다음 단계로 넘어가세요." : "모든 단계를 완료했어요."}
                </p>
                {hasNext && (
                  <button
                    type="button"
                    onClick={() => goToStep(activeIndex + 1)}
                    className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-[13px] font-semibold text-white transition hover:bg-emerald-700"
                  >
                    다음 단계
                    <ChevronRight className="size-4" strokeWidth={2.5} aria-hidden />
                  </button>
                )}
              </div>
            )}

            {/* 힌트 사다리 */}
            {step.hints.length > 0 && (
              <div className="flex flex-col gap-2">
                {step.hints.slice(0, hintCount).map((h, i) => (
                  <div
                    key={i}
                    className={cn(
                      "rounded-lg px-3 py-2 text-[12px] leading-relaxed whitespace-pre-wrap ring-1",
                      i === step.hints.length - 1
                        ? "bg-amber-50 text-amber-900 ring-amber-200"
                        : "bg-zinc-50 text-zinc-700 ring-zinc-200",
                    )}
                  >
                    {h}
                  </div>
                ))}
                {hintCount < step.hints.length && (
                  <button
                    type="button"
                    onClick={() => setHintCount((c) => c + 1)}
                    className="inline-flex w-fit items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12px] font-medium text-amber-700 transition hover:bg-amber-50"
                  >
                    <Lightbulb className="size-3.5" strokeWidth={2.25} aria-hidden />
                    {hintCount === 0 ? "힌트 보기" : "힌트 더 보기"} ({hintCount}/
                    {step.hints.length})
                  </button>
                )}
              </div>
            )}
          </div>
        ) : (
          // step 0 — 설계 (읽기 후 시작)
          <div className="mt-4">
            <button
              type="button"
              onClick={() => goToStep(activeIndex + 1)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-violet-600 px-4 py-2.5 text-[13px] font-semibold text-white transition hover:bg-violet-700"
            >
              이해했어요, 시작하기
              <ChevronRight className="size-4" strokeWidth={2.5} aria-hidden />
            </button>
          </div>
        )}
      </div>

      {/* 대화형 입력 모달 — 실행 중 input() 이 호출하면 뜬다 */}
      {inputReq && (
        <div
          role="dialog"
          aria-modal
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
        >
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl">
            <p className="text-[13px] font-semibold text-zinc-800">
              {inputReq.prompt || "입력값을 넣어주세요"}
            </p>
            <input
              autoFocus
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submitInput();
              }}
              className="mt-2 w-full rounded-lg bg-zinc-50 px-3 py-2 font-mono text-[13px] text-zinc-800 ring-1 ring-zinc-300 focus:ring-2 focus:ring-violet-400 focus:outline-none"
            />
            <div className="mt-3 flex justify-end gap-2">
              <button
                type="button"
                onClick={cancelInput}
                className="rounded-lg px-3 py-1.5 text-[13px] font-medium text-zinc-500 transition hover:text-zinc-700"
              >
                중단
              </button>
              <button
                type="button"
                onClick={submitInput}
                className="rounded-lg bg-violet-600 px-3.5 py-1.5 text-[13px] font-semibold text-white transition hover:bg-violet-700"
              >
                입력
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
