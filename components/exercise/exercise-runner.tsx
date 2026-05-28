"use client";

// 강별 코드 연습 문제 실행 화면 — 13강 ProjectRunner 의 단순화 버전.
// 차이: 스텝 해금/진행바/힌트 사다리/설계(Step0) 없음. 문제는 자유롭게 전환할 수 있고,
//   통과 여부는 로컬 state 로만 표시한다 (이번 라운드는 진행 저장·이수율 연동 제외).
// 채점·실행 엔진은 프로젝트 강의와 동일한 Pyodide(lib/project/grader.ts)를 재사용한다.
// (아이콘이 적어 icon-map 없이 직접 import — components/project · lesson-content 와 동일한 예외.)

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Check, Play, RotateCcw, Send } from "lucide-react";

import { useToast } from "@/components/toast";
import {
  gradeStep,
  preloadPyodide,
  runPythonInteractive,
  type CaseResult,
} from "@/lib/project/grader";
import { cn } from "@/lib/utils";
import type { ExerciseSet } from "@/lib/exercise-content";

// CodeMirror 는 브라우저 전용 — SSR 단계에서 깨지므로 dynamic(ssr:false) 로 로드한다.
const CodeEditor = dynamic(() => import("@/components/project/code-editor"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[200px] items-center justify-center rounded-xl bg-zinc-50 text-sm text-zinc-400 ring-1 ring-zinc-200">
      에디터 불러오는 중…
    </div>
  ),
});

export function ExerciseRunner({ set }: { set: ExerciseSet }) {
  const { success, error: toastError } = useToast();

  // 문제별 작성 코드 (전환해도 보존). 초기값은 각 문제의 starterCode.
  const [codeById, setCodeById] = useState<Record<string, string>>(() => {
    const m: Record<string, string> = {};
    for (const ex of set.exercises) m[ex.id] = ex.starterCode;
    return m;
  });
  // 통과 표시 (로컬 전용 — 저장 아님).
  const [passedById, setPassedById] = useState<Record<string, boolean>>({});

  const [activeIndex, setActiveIndex] = useState(0);
  const [running, setRunning] = useState(false);
  const [cases, setCases] = useState<CaseResult[] | null>(null);
  const [consoleOut, setConsoleOut] = useState<string | null>(null);

  // 대화형 입력 모달 — 실행 중 input() 이 호출하면 뜬다 (ProjectRunner 패턴 재사용).
  const [inputReq, setInputReq] = useState<{
    prompt: string;
    resolve: (v: string) => void;
    reject: (e: unknown) => void;
  } | null>(null);
  const [inputValue, setInputValue] = useState("");

  // Pyodide 백그라운드 프리로드 (첫 실행 지연 완화).
  useEffect(() => {
    void preloadPyodide().catch(() => {});
  }, []);

  const exercise = set.exercises[activeIndex];
  const code = codeById[exercise.id] ?? exercise.starterCode;
  const passedCount = useMemo(
    () => set.exercises.filter((ex) => passedById[ex.id]).length,
    [set.exercises, passedById],
  );

  function goTo(index: number) {
    if (index < 0 || index >= set.exercises.length) return;
    setActiveIndex(index);
    setCases(null);
    setConsoleOut(null);
  }

  function handleChange(value: string) {
    setCodeById((prev) => ({ ...prev, [exercise.id]: value }));
  }

  function handleReset() {
    setCodeById((prev) => ({ ...prev, [exercise.id]: exercise.starterCode }));
    setCases(null);
    setConsoleOut(null);
  }

  // 실행 중 input() 이 부르면 모달을 띄우고, 입력/중단까지 Promise 로 기다린다.
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

  // 실행 = 직접 돌려보기. input() 을 만나면 화면 내 입력 모달이 뜬다.
  async function handleRun() {
    setRunning(true);
    setCases(null);
    setConsoleOut(null);
    try {
      const r = await runPythonInteractive(code, requestInput);
      const out = r.stdout.trimEnd();
      setConsoleOut((out || "(출력 없음)") + (r.error ? `\n⚠ ${r.error}` : ""));
    } catch (err) {
      console.error("[CodeMong] Pyodide 실행 실패:", err);
      const detail = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
      setConsoleOut(
        `파이썬 실행 환경을 불러오지 못했어요.\n오류: ${detail}\n\n(사내·학교 네트워크나 광고 차단 확장프로그램이 cdn.jsdelivr.net 을 막으면 이 오류가 납니다.)`,
      );
      toastError("파이썬 실행 환경을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.");
    } finally {
      setRunning(false);
    }
  }

  // 제출 = 정해진 테스트들로 자동 채점.
  async function handleSubmit() {
    setRunning(true);
    setConsoleOut(null);
    try {
      const result = await gradeStep(code, exercise.tests);
      setCases(result.cases);
      if (result.allPassed) {
        setPassedById((prev) => ({ ...prev, [exercise.id]: true }));
        success("정답이에요! 모든 테스트를 통과했어요.");
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

  const passed = Boolean(passedById[exercise.id]);
  const passedCases = cases ? cases.filter((c) => c.passed).length : 0;

  return (
    <section className="flex flex-col gap-4">
      {/* 진행 안내 (저장 아님 — 이번 세션 동안만) */}
      <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-zinc-200/80 sm:p-6">
        <p className="text-xs font-semibold tracking-wide text-violet-600">
          코드 연습 · {passedCount}/{set.exercises.length}문제 통과
        </p>
        <h2 className="mt-1 text-lg font-bold text-zinc-900 sm:text-xl">{set.title}</h2>
        <p className="mt-1.5 text-[13px] leading-relaxed text-zinc-600 sm:text-sm">
          영상에서 배운 문법으로 직접 코드를 작성해 풀어보세요. 정해진 입력으로 자동 채점됩니다.
          <span className="text-zinc-400"> (이번에는 통과 기록이 저장되지 않아요.)</span>
        </p>
      </div>

      {/* 문제 칩 (가로 스크롤) */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {set.exercises.map((ex, i) => {
          const done = Boolean(passedById[ex.id]);
          const active = i === activeIndex;
          return (
            <button
              key={ex.id}
              type="button"
              onClick={() => goTo(i)}
              aria-current={active ? "step" : undefined}
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500",
                active
                  ? "bg-violet-600 text-white"
                  : done
                    ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-100"
                    : "bg-white text-zinc-600 ring-1 ring-zinc-200 hover:bg-zinc-50",
              )}
            >
              {done && <Check className="size-3.5" strokeWidth={2.5} aria-hidden />}
              {ex.number}번
            </button>
          );
        })}
      </div>

      {/* 현재 문제 카드 */}
      <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-zinc-200/80 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-base font-bold text-zinc-900 sm:text-lg">
            {exercise.number}번 — {exercise.title}
          </h3>
          {passed && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-200">
              <Check className="size-3" strokeWidth={2.5} aria-hidden />
              통과
            </span>
          )}
        </div>

        {exercise.conceptTags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {exercise.conceptTags.map((t) => (
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
          {exercise.prompt}
        </p>

        {/* 참고 박스 — 항상 노출 (펼치는 힌트 아님) */}
        {exercise.note && (
          <div className="mt-3 rounded-xl bg-amber-50 px-4 py-3 ring-1 ring-amber-200">
            <p className="mb-0.5 text-[11px] font-semibold text-amber-700">참고</p>
            <p className="text-[12px] leading-relaxed whitespace-pre-wrap text-amber-900 sm:text-[13px]">
              {exercise.note}
            </p>
          </div>
        )}

        {/* 입출력 예시 */}
        {exercise.example && (
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div>
              <p className="mb-1 text-[11px] font-semibold text-zinc-500">입력 예시</p>
              <pre className="overflow-x-auto rounded-lg bg-zinc-50 px-3 py-2 font-mono text-[12px] whitespace-pre-wrap text-zinc-700 ring-1 ring-zinc-200">
                {exercise.example.stdin.join("\n")}
              </pre>
            </div>
            <div>
              <p className="mb-1 text-[11px] font-semibold text-zinc-500">출력 예시</p>
              <pre className="overflow-x-auto rounded-lg bg-zinc-50 px-3 py-2 font-mono text-[12px] whitespace-pre-wrap text-zinc-700 ring-1 ring-zinc-200">
                {exercise.example.stdout}
              </pre>
            </div>
          </div>
        )}

        {/* 에디터 */}
        <div className="mt-4">
          <CodeEditor value={code} onChange={handleChange} />
        </div>

        {/* 실행 안내 — input() 은 실행 중 입력창으로 받는다 */}
        <p className="mt-3 text-[12px] leading-relaxed text-zinc-500">
          <span className="font-semibold text-zinc-600">실행</span> 하면 코드가 돌아가다 input() 을
          만날 때마다 입력 창이 떠요. 위 「입력 예시」의 값을 차례대로 넣어보세요. (제출하면 정해진
          입력들로 자동 채점)
        </p>

        {/* 버튼 행 */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
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
          <div className="mt-4">
            <p className="mb-1 text-[11px] font-semibold text-zinc-500">실행 결과</p>
            <pre className="overflow-x-auto rounded-lg bg-zinc-900 px-3 py-2.5 font-mono text-[12px] leading-relaxed whitespace-pre-wrap text-zinc-100">
              {consoleOut}
            </pre>
          </div>
        )}

        {/* 채점 결과 */}
        {cases && (
          <div className="mt-4 flex flex-col gap-1.5">
            <p className="text-[11px] font-semibold text-zinc-500">
              채점 결과 — {passedCases}/{cases.length} 통과
            </p>
            <p className="text-[11px] text-zinc-400">
              채점은 정해진 입력들을 자동으로 넣어 코드가 여러 경우에 맞게 도는지 확인해요. (위에서
              직접 입력한 값과는 별개)
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
                  <span className={c.passed ? "text-emerald-700" : "text-rose-700"}>{c.label}</span>
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

        {/* 통과 안내 + 다음 문제 */}
        {passed && (
          <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-emerald-50 px-4 py-3 ring-1 ring-emerald-200">
            <p className="text-[13px] font-medium text-emerald-800">
              통과했어요!{" "}
              {activeIndex < set.exercises.length - 1
                ? "다음 문제도 풀어보세요."
                : "모든 문제를 풀었어요."}
            </p>
            {activeIndex < set.exercises.length - 1 && (
              <button
                type="button"
                onClick={() => goTo(activeIndex + 1)}
                className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-[13px] font-semibold text-white transition hover:bg-emerald-700"
              >
                다음 문제
              </button>
            )}
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
