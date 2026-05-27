// 프로젝트형 강의 코드 실행 + 채점 엔진. **클라이언트 전용** (window/document/Pyodide 사용).
// 모듈 top-level 에서는 브라우저 API 를 건드리지 않으므로 server 에서 import 되어도 로드는 안전하다.
//
// 실행: Pyodide(브라우저 내 Python, CDN 동적 로드) 로 학습자 코드를 exec 한다.
//   · input() 은 미리 정한 stdin 시퀀스를 순서대로 반환하도록 monkeypatch
//   · print 출력은 StringIO 로 캡처
//   · stdin 소진 시 EOFError → while 루프 자연 종료로 간주 (계산기는 "n" 입력으로 끝남)
//   · 출력 100KB 초과 시 RuntimeError (출력 폭주형 무한 반복 방어)
// 채점: ExpectedOutput 을 "순차 소비" 한다. 텍스트는 부분일치, 숫자는 허용오차 비교.
//   텍스트 매칭 위치 "이후" 부터 다음 항목을 찾아 "0으로 나눌 수 없습니다" 의 0 이
//   뒤따르는 number 매칭을 오염시키지 않도록 한다.

import type { ExpectedOutput, TestCase } from "@/lib/project-content";

// ─── Pyodide 로더 (CDN, 싱글톤) ────────────────────────────────────

const PYODIDE_VERSION = "0.28.3";
const INDEX_URL = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

type PyodideInterface = {
  runPythonAsync: (code: string) => Promise<unknown>;
  globals: { get: (key: string) => unknown };
};

type PyodideWindow = Window & {
  loadPyodide?: (opts: { indexURL: string }) => Promise<PyodideInterface>;
};

let pyodidePromise: Promise<PyodideInterface> | null = null;

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Pyodide 스크립트 로드 실패")));
      return;
    }
    const el = document.createElement("script");
    el.src = src;
    el.onload = () => resolve();
    el.onerror = () => reject(new Error("Pyodide 스크립트 로드 실패"));
    document.head.appendChild(el);
  });
}

/** Pyodide 인스턴스를 한 번만 로드해 재사용한다. 강의 진입 시 미리 호출해 두면 첫 실행이 빨라진다. */
export function preloadPyodide(): Promise<PyodideInterface> {
  if (pyodidePromise) return pyodidePromise;
  pyodidePromise = (async () => {
    const w = window as PyodideWindow;
    if (!w.loadPyodide) {
      await loadScript(`${INDEX_URL}pyodide.js`);
    }
    if (!w.loadPyodide) throw new Error("Pyodide 를 불러오지 못했습니다.");
    return w.loadPyodide({ indexURL: INDEX_URL });
  })().catch((err) => {
    // 실패한 promise 를 캐시에 남기면 "다시 시도" 해도 같은 실패만 반복된다 → 리셋해 재로드 허용.
    pyodidePromise = null;
    throw err;
  });
  return pyodidePromise;
}

// ─── 실행 ──────────────────────────────────────────────────────────

export type RunResult = {
  /** print 로 캡처된 표준 출력 */
  stdout: string;
  /** 실행 중 발생한 예외 (SyntaxError/ValueError 등). 없으면 null */
  error: string | null;
};

function buildWrapper(userCode: string, stdin: string[]): string {
  const stdinLiteral = JSON.stringify(JSON.stringify(stdin));
  const codeLiteral = JSON.stringify(userCode);
  // 학습자 코드는 exec 로 실행 → 래퍼와의 들여쓰기 충돌이 없다.
  return [
    "import sys, io, json, builtins",
    "",
    "class __CMOut(io.StringIO):",
    "    def write(self, s):",
    "        if self.tell() > 100000:",
    "            raise RuntimeError('출력이 너무 많습니다 (무한 반복일 수 있어요)')",
    "        return super().write(s)",
    "",
    `__cm_inputs = iter(json.loads(${stdinLiteral}))`,
    "def __cm_input(prompt=''):",
    "    try:",
    "        return next(__cm_inputs)",
    "    except StopIteration:",
    "        raise EOFError('입력이 더 이상 없습니다')",
    "builtins.input = __cm_input",
    "",
    "__cm_buf = __CMOut()",
    "__cm_old = sys.stdout",
    "sys.stdout = __cm_buf",
    "__cm_err = ''",
    `__cm_code = json.loads(${codeLiteral})`,
    "try:",
    "    exec(__cm_code, {'__name__': '__main__'})",
    "except EOFError:",
    "    pass",
    "except Exception as __cm_e:",
    "    __cm_err = type(__cm_e).__name__ + ': ' + str(__cm_e)",
    "finally:",
    "    sys.stdout = __cm_old",
    "__cm_out = __cm_buf.getvalue()",
  ].join("\n");
}

/** 학습자 코드를 주어진 stdin 으로 실행하고 (stdout, error) 를 돌려준다. */
export async function runPythonProgram(userCode: string, stdin: string[]): Promise<RunResult> {
  const py = await preloadPyodide();
  await py.runPythonAsync(buildWrapper(userCode, stdin));
  const stdout = String(py.globals.get("__cm_out") ?? "");
  const errRaw = py.globals.get("__cm_err");
  const error = errRaw ? String(errRaw) : "";
  return { stdout, error: error || null };
}

// ─── 채점 ──────────────────────────────────────────────────────────

const NUMBER_RE = /-?\d+(?:\.\d+)?/g;
const EPSILON = 1e-9;

function findNextNumber(s: string, from: number): { value: number; end: number } | null {
  NUMBER_RE.lastIndex = from;
  const m = NUMBER_RE.exec(s);
  if (!m) return null;
  return { value: parseFloat(m[0]), end: m.index + m[0].length };
}

/** stdout 이 expect 항목들을 순서대로 만족하는지 채점한다. */
export function matchesExpected(stdout: string, expect: ExpectedOutput[]): boolean {
  let pos = 0;
  for (const item of expect) {
    if (item.kind === "text") {
      const idx = stdout.indexOf(item.contains, pos);
      if (idx === -1) return false;
      pos = idx + item.contains.length;
    } else {
      const found = findNextNumber(stdout, pos);
      if (!found) return false;
      if (Math.abs(found.value - item.value) > EPSILON) return false;
      pos = found.end;
    }
  }
  return true;
}

export type CaseResult = {
  label: string;
  passed: boolean;
  stdin: string[];
  stdout: string;
  error: string | null;
};

/** 한 스텝의 모든 테스트케이스를 실행/채점한다. */
export async function gradeStep(
  userCode: string,
  tests: TestCase[],
): Promise<{ allPassed: boolean; cases: CaseResult[] }> {
  const cases: CaseResult[] = [];
  for (const t of tests) {
    const { stdout, error } = await runPythonProgram(userCode, t.stdin);
    const passed = !error && matchesExpected(stdout, t.expect);
    cases.push({ label: t.label, passed, stdin: t.stdin, stdout, error });
  }
  return { allPassed: cases.length > 0 && cases.every((c) => c.passed), cases };
}
