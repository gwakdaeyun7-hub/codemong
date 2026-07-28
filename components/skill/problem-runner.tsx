"use client";

// 실력향상(시험) 트랙 문제 러너 — 프로그래머스식 화면에서 백준식(stdin→stdout) 문제를 푼다.
// 레이아웃: lg+ 2-pane (좌 문제 지문 흰 카드 / 우 다크 에디터 존), 모바일은 세로 스택.
// 버튼은 2개만 (사용자 확정 — 대화형 자유 입력 없음, 실행·채점은 준비된 테스트 데이터로만):
//  · 「코드 실행」      — 공개 테스트케이스만 즉시 채점. 실패 시 입력/내 출력/기대 출력 노출. 기록 안 남음.
//  · 「제출 후 채점하기」 — 공개+히든 전체 채점 → submitProblemAction 으로 제출 기록 저장.
//    히든 케이스는 "히든 N" 라벨과 통과/실패만 보여준다 (서버로 보내는 요약도 같은 마스킹).
// 채점 엔진은 13강 프로젝트와 동일한 Pyodide(lib/project/grader.ts) 재사용.
// 통과(해결) 표시는 낙관적 — 저장 실패는 toast 로만 안내 (ExerciseRunner 규약).

import { useEffect, useMemo, useState, useTransition } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

import { Check, Play, RotateCcw, Send } from "@/components/skill/icon-map";
import { DIFFICULTY_CHIP_CLASS, DIFFICULTY_LABEL } from "@/components/skill/difficulty";
import { AiFeedbackCard } from "@/components/skill/ai-feedback-card";
import { useToast } from "@/components/toast";
import {
  submitProblemAction,
  type SubmissionAiPayload,
  type SubmissionCaseSummary,
} from "@/lib/skill/submission-actions";
import { gradeStep, preloadPyodide, type CaseResult } from "@/lib/project/grader";
import { cn } from "@/lib/utils";
import type { ClientProblem } from "@/lib/problems";

// CodeMirror 는 브라우저 전용 — SSR 단계에서 깨지므로 dynamic(ssr:false) 로 로드 (기존 규약).
const CodeEditor = dynamic(() => import("@/components/project/code-editor"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[280px] items-center justify-center bg-zinc-900 text-sm text-zinc-500">
      에디터 불러오는 중…
    </div>
  ),
});

/** 화면 표시용 케이스 결과 — 히든은 stdin/stdout 을 담지 않는다 */
type DisplayCase = {
  label: string;
  passed: boolean;
  hidden: boolean;
  stdin?: string[];
  stdout?: string;
  expected?: string;
  error?: string | null;
};

export function ProblemRunner({
  problem,
  lessonRef,
  initialSolved,
}: {
  problem: ClientProblem;
  /** 데이터 정식 lessonRef ("be-python/lesson-N") — submitProblemAction 에 그대로 넘긴다 */
  lessonRef: string;
  /** DB 조회 초기 해결 여부 (통과 제출이 한 번이라도 있으면 true) */
  initialSolved: boolean;
}) {
  const router = useRouter();
  const { success, error: toastError } = useToast();
  const [, startSave] = useTransition();

  const [code, setCode] = useState(problem.starterCode);
  const [running, setRunning] = useState<false | "run" | "submit">(false);
  const [mode, setMode] = useState<"run" | "submit" | null>(null);
  const [cases, setCases] = useState<DisplayCase[] | null>(null);
  const [engineError, setEngineError] = useState<string | null>(null);
  const [solved, setSolved] = useState(initialSolved);
  // AI 진단 — 제출 저장이 돌아오면 payload, 기다리는 동안 "loading".
  const [aiResult, setAiResult] = useState<SubmissionAiPayload | "loading" | null>(null);

  // Pyodide 백그라운드 프리로드 (첫 실행 지연 완화).
  useEffect(() => {
    void preloadPyodide().catch(() => {});
  }, []);

  const publicCount = problem.publicTests.length;
  const passedCount = useMemo(() => (cases ? cases.filter((c) => c.passed).length : 0), [cases]);
  const allPassed = cases !== null && cases.length > 0 && passedCount === cases.length;

  function toDisplayCases(results: CaseResult[], withHidden: boolean): DisplayCase[] {
    return results.map((c, i) => {
      const hidden = withHidden && i >= publicCount;
      if (hidden) {
        // 히든은 라벨·입출력 전부 마스킹 — 통과/실패만.
        return { label: `히든 ${i - publicCount + 1}`, passed: c.passed, hidden: true };
      }
      return {
        label: c.label,
        passed: c.passed,
        hidden: false,
        stdin: c.stdin,
        stdout: c.stdout,
        expected: problem.examples[i]?.stdout,
        error: c.error,
      };
    });
  }

  function handleEngineFailure(err: unknown) {
    console.error("[CodeMong] Pyodide 실행 실패:", err);
    const detail = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
    setCases(null);
    setEngineError(
      `파이썬 실행 환경을 불러오지 못했어요.\n오류: ${detail}\n\n(사내·학교 네트워크나 광고 차단 확장프로그램이 cdn.jsdelivr.net 을 막으면 이 오류가 납니다.)`,
    );
    toastError("파이썬 실행 환경을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.");
  }

  // 「코드 실행」 — 공개 테스트케이스만. 기록 안 남고 AI 도 안 부른다.
  async function handleRun() {
    setRunning("run");
    setEngineError(null);
    try {
      const result = await gradeStep(code, problem.publicTests, problem.seed);
      setMode("run");
      setCases(toDisplayCases(result.cases, false));
    } catch (err) {
      handleEngineFailure(err);
    } finally {
      setRunning(false);
    }
  }

  // 「제출 후 채점하기」 — 공개+히든 전체 채점 후 제출 기록 저장.
  async function handleSubmit() {
    setRunning("submit");
    setEngineError(null);
    try {
      const tests = [...problem.publicTests, ...problem.hiddenTests];
      const result = await gradeStep(code, tests, problem.seed);
      const display = toDisplayCases(result.cases, true);
      setMode("submit");
      setCases(display);

      if (result.allPassed) {
        setSolved(true); // 낙관적 — 저장 실패는 toast 로만
        success("정답입니다! 모든 테스트를 통과했어요.");
      }

      // 제출 기록 저장 (통과/오답 모두). 히든 라벨은 마스킹된 채로 보낸다.
      const firstError = result.cases.find((c) => c.error)?.error ?? null;
      const caseResults: SubmissionCaseSummary[] = display.map((c) => ({
        label: c.label,
        passed: c.passed,
        hidden: c.hidden,
      }));
      setAiResult("loading");
      startSave(async () => {
        try {
          const saved = await submitProblemAction(lessonRef, problem.id, code, {
            passed: result.allPassed,
            hadError: firstError !== null,
            errorType: firstError ? firstError.split(":")[0].trim() : null,
            casesPassed: result.cases.filter((c) => c.passed).length,
            casesTotal: result.cases.length,
            caseResults,
          });
          if (!saved.ok) {
            setAiResult(null);
            toastError("제출 기록 저장에 실패했어요. 잠시 후 다시 시도해 주세요.");
            return;
          }
          setAiResult(saved.ai);
          router.refresh(); // 서버 렌더 제출 히스토리 갱신
        } catch (err) {
          console.error("[CodeMong] submitProblemAction 실패:", err);
          setAiResult(null);
          toastError("제출 기록 저장에 실패했어요. 잠시 후 다시 시도해 주세요.");
        }
      });
    } catch (err) {
      handleEngineFailure(err);
    } finally {
      setRunning(false);
    }
  }

  function handleReset() {
    setCode(problem.starterCode);
    setCases(null);
    setMode(null);
    setEngineError(null);
    setAiResult(null);
  }

  return (
    <>
      <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
        {/* 좌: 문제 지문 (흰 카드 — 기존 CodeMong 톤) */}
        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-zinc-200/80 sm:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-lg font-bold tracking-tight text-zinc-900 sm:text-xl">
              {problem.number}. {problem.title}
            </h1>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[11px] font-semibold",
                DIFFICULTY_CHIP_CLASS[problem.difficulty],
              )}
            >
              {DIFFICULTY_LABEL[problem.difficulty]}
            </span>
            {solved && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-200">
                <Check className="size-3" strokeWidth={2.5} aria-hidden />
                해결
              </span>
            )}
          </div>

          {problem.conceptTags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {problem.conceptTags.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-violet-50 px-2 py-0.5 text-[11px] font-medium text-violet-700"
                >
                  {t}
                </span>
              ))}
            </div>
          )}

          <p className="mt-4 text-[13px] leading-relaxed whitespace-pre-wrap text-zinc-700 sm:text-sm">
            {problem.prompt}
          </p>

          {/* 입출력 예시 */}
          {problem.examples.length > 0 && (
            <div className="mt-5 flex flex-col gap-3">
              {problem.examples.map((ex, i) => (
                <div key={i}>
                  <p className="mb-1 text-[11px] font-semibold text-zinc-500">예시 {i + 1}</p>
                  <div className="grid grid-cols-2 gap-2">
                    <pre className="overflow-x-auto rounded-lg bg-zinc-50 px-3 py-2 font-mono text-[12px] whitespace-pre-wrap text-zinc-700 ring-1 ring-zinc-200">
                      {ex.stdin.join("\n") || "(입력 없음)"}
                    </pre>
                    <pre className="overflow-x-auto rounded-lg bg-zinc-50 px-3 py-2 font-mono text-[12px] whitespace-pre-wrap text-zinc-700 ring-1 ring-zinc-200">
                      {ex.stdout}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          )}

          <p className="mt-4 text-[12px] leading-relaxed text-zinc-500">
            입력은 채점기가 자동으로 넣어줘요. 코드에서 input() 으로 순서대로 받으면 됩니다. 코드
            실행은 위 예시로만 확인하고, 제출하면 숨겨진 테스트까지 함께 채점돼요.
          </p>
        </section>

        {/* 우: 에디터 존 (프로그래머스풍 다크) */}
        <section className="overflow-hidden rounded-2xl bg-zinc-900 shadow-sm ring-1 ring-zinc-800">
          {/* 탭 바 */}
          <div className="flex items-center border-b border-zinc-800 px-4 py-2.5">
            <span className="inline-flex items-center gap-2 rounded-md bg-zinc-800 px-3 py-1 font-mono text-[12px] text-zinc-300">
              <span aria-hidden className="size-1.5 rounded-full bg-violet-400" />
              solution.py
            </span>
          </div>

          {/* 에디터 */}
          <CodeEditor value={code} onChange={setCode} />

          {/* 실행 결과 콘솔 */}
          <div className="border-t border-zinc-800 px-4 py-3">
            <p className="mb-2 text-[11px] font-semibold tracking-wide text-zinc-500">실행 결과</p>
            <div className="max-h-72 overflow-y-auto">
              {engineError ? (
                <pre className="font-mono text-[12px] leading-relaxed whitespace-pre-wrap text-rose-300">
                  {engineError}
                </pre>
              ) : running ? (
                <p className="font-mono text-[12px] text-zinc-400">
                  {running === "run" ? "공개 테스트로 실행 중…" : "전체 테스트로 채점 중…"}
                </p>
              ) : cases === null ? (
                <p className="font-mono text-[12px] text-zinc-500">
                  코드 실행 또는 제출을 누르면 결과가 여기에 표시됩니다.
                </p>
              ) : (
                <div className="flex flex-col gap-1.5">
                  <p className="font-mono text-[12px] text-zinc-300">
                    {mode === "submit" ? "채점 결과" : "공개 테스트 결과"} {passedCount}/
                    {cases.length} 통과
                  </p>
                  {cases.map((c, i) => (
                    <div
                      key={i}
                      className={cn(
                        "rounded-md px-2.5 py-1.5 font-mono text-[12px]",
                        c.passed
                          ? "bg-emerald-950/60 text-emerald-300"
                          : "bg-rose-950/60 text-rose-300",
                      )}
                    >
                      <span aria-hidden>{c.passed ? "✓" : "✗"}</span> {c.label}
                      {!c.passed && !c.hidden && (
                        <div className="mt-1 space-y-0.5 text-[11px] text-zinc-400">
                          <p>
                            입력: {c.stdin && c.stdin.length > 0 ? c.stdin.join(", ") : "(없음)"}
                          </p>
                          <p>내 출력: {c.stdout?.trim() || "(없음)"}</p>
                          {c.expected !== undefined && <p>기대 출력: {c.expected}</p>}
                          {c.error && <p className="text-rose-400">오류: {c.error}</p>}
                        </div>
                      )}
                    </div>
                  ))}
                  {mode === "submit" && (
                    <p
                      className={cn(
                        "mt-1 rounded-md px-2.5 py-2 text-[12px] font-semibold",
                        allPassed
                          ? "bg-emerald-950/60 text-emerald-300"
                          : "bg-zinc-800 text-zinc-300",
                      )}
                    >
                      {allPassed
                        ? "정답입니다! 모든 테스트를 통과했어요."
                        : "아직 통과하지 못한 테스트가 있어요. 공개 테스트의 입력과 출력을 다시 살펴보세요."}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 버튼 바 */}
          <div className="flex items-center justify-between gap-2 border-t border-zinc-800 px-4 py-3">
            <button
              type="button"
              onClick={handleReset}
              disabled={running !== false}
              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-[13px] font-medium text-zinc-400 transition hover:text-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RotateCcw className="size-3.5" strokeWidth={2.25} aria-hidden />
              초기화
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRun}
                disabled={running !== false}
                className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-700 px-3.5 py-2 text-[13px] font-semibold text-zinc-100 transition hover:bg-zinc-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Play className="size-3.5 fill-current" strokeWidth={0} aria-hidden />
                코드 실행
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={running !== false}
                className="inline-flex items-center gap-1.5 rounded-lg bg-violet-600 px-3.5 py-2 text-[13px] font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send className="size-3.5" strokeWidth={2.25} aria-hidden />
                제출 후 채점하기
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* AI 진단 — 제출 후에만 (loading → payload). 히스토리에도 남지만 방금 제출 건은 즉시 보여준다. */}
      {aiResult !== null && (
        <div className="mt-4">
          <AiFeedbackCard ai={aiResult} />
        </div>
      )}
    </>
  );
}
