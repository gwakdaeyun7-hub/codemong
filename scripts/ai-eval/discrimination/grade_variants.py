# -*- coding: utf-8 -*-
# 변별력 매트릭스 1단계 — 에이전트가 만든 변형(V2/V3/V4)을 결정적 채점기로 재검증하고,
# V1(모범답안) 포함 전 항목의 채점 요약(matrix-graded.json)을 만든다.
# 에이전트의 measuredCasesPassed 는 신뢰하지 않고 여기서 전부 재실행한다.
import json, re, io, os, sys

BASE = os.path.dirname(os.path.abspath(__file__))
DRAFT = os.path.join(BASE, "..", "..", "problems-draft")
NUM_RE = re.compile(r"-?\d+(?:\.\d+)?")

def matches_expected(stdout, expects):
    pos = 0
    for e in expects:
        if e["kind"] == "text":
            idx = stdout.find(e["contains"], pos)
            if idx < 0: return False
            pos = idx + len(e["contains"])
        else:
            m = NUM_RE.search(stdout, pos)
            if not m or abs(float(m.group(0)) - e["value"]) > 1e-9: return False
            pos = m.end()
    return True

def run_solution(code, stdin_lines):
    it = iter(stdin_lines)
    buf = io.StringIO()
    def fake_input(prompt=""):
        try: return next(it)
        except StopIteration: raise EOFError
    g = {"input": fake_input, "print": lambda *a, **k: print(*a, **{**k, "file": buf})}
    try: exec(code, g)
    except EOFError: pass
    except SyntaxError as ex: return buf.getvalue(), f"SyntaxError: {ex}"
    except Exception as ex: return buf.getvalue(), f"{type(ex).__name__}: {ex}"
    return buf.getvalue(), None

def grade(problem, code):
    tests = problem["publicTests"] + problem["hiddenTests"]
    n_public = len(problem["publicTests"])
    case_results, first_error, passed = [], None, 0
    for i, t in enumerate(tests):
        stdout, err = run_solution(code, t["stdin"])
        ok = err is None and matches_expected(stdout, t["expect"])
        if err and first_error is None: first_error = err
        if ok: passed += 1
        hidden = i >= n_public
        case_results.append({"label": f"히든 {i - n_public + 1}" if hidden else t["label"], "passed": ok, "hidden": hidden})
    return {
        "passed": passed == len(tests), "hadError": first_error is not None,
        "errorType": first_error.split(":")[0].strip() if first_error else None,
        "casesPassed": passed, "casesTotal": len(tests), "caseResults": case_results,
    }

problems = {}
for n in [4, 5, 6, 7, 8, 9]:
    with open(os.path.join(DRAFT, f"lesson-{n}.json"), encoding="utf-8") as f:
        d = json.load(f)
    for p in d["problems"]:
        problems[f'lesson-{n}/{p["id"]}'] = p

entries, issues = [], []
# V1 = 모범답안
for ref, p in problems.items():
    s = grade(p, p["solutionCode"])
    if not s["passed"]:
        issues.append(f"V1 미통과?! {ref}")
    entries.append({"ref": ref, "variant": "V1", "desc": "모범답안", "code": p["solutionCode"], "summary": s})

# V2/V3/V4 = 에이전트 변형
for n in [4, 5, 6, 7, 8, 9]:
    path = os.path.join(BASE, f"variants-lesson-{n}.json")
    if not os.path.exists(path):
        issues.append(f"파일 없음: variants-lesson-{n}.json")
        continue
    with open(path, encoding="utf-8") as f:
        d = json.load(f)
    for v in d["variants"]:
        ref = f'lesson-{n}/{v["problemId"]}'
        p = problems.get(ref)
        if not p:
            issues.append(f"미지의 문제: {ref}")
            continue
        s = grade(p, v["code"])
        # 변형별 전제조건 검사
        if v["variant"] == "V2" and not s["passed"]:
            issues.append(f'V2 인데 미통과: {ref} ({s["casesPassed"]}/{s["casesTotal"]})')
        if v["variant"] == "V3" and (s["passed"] or s["hadError"]):
            issues.append(f'V3 조건 위반: {ref} (passed={s["passed"]}, hadError={s["hadError"]})')
        if v["variant"] == "V4":
            hidden_fail = sum(1 for c in s["caseResults"] if c["hidden"] and not c["passed"])
            hidden_total = sum(1 for c in s["caseResults"] if c["hidden"])
            if hidden_total > 0 and hidden_fail * 2 < hidden_total:
                issues.append(f"V4 히든 과반 통과: {ref} (히든 실패 {hidden_fail}/{hidden_total})")
        entries.append({"ref": ref, "variant": v["variant"], "desc": v["desc"], "code": v["code"], "summary": s})

with io.open(os.path.join(BASE, "matrix-graded.json"), "w", encoding="utf-8") as f:
    json.dump(entries, f, ensure_ascii=False, indent=2)

print(f"항목 {len(entries)}개 (V1 {len(problems)} + 변형 {len(entries) - len(problems)})")
print("전제조건 이슈:", len(issues))
for i in issues: print(" -", i)
sys.exit(1 if issues else 0)
