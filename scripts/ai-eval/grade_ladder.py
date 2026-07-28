# -*- coding: utf-8 -*-
# 변별력 사다리 — 학점 계산기(lesson-5 prob-3)에 품질이 단계적으로 다른 6개 답안.
import json, re, io, os

DRAFT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "problems-draft")
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
    except Exception as ex: return buf.getvalue(), f"{type(ex).__name__}: {ex}"
    return buf.getvalue(), None

LADDER = [
    {"id": "L1", "desc": "모범 elif 사다리 (기준점)",
     "code": 'score = int(input())\nif score >= 90:\n    print("A")\nelif score >= 80:\n    print("B")\nelif score >= 70:\n    print("C")\nelif score >= 60:\n    print("D")\nelse:\n    print("F")\n'},
    {"id": "L2", "desc": "동급의 다른 스타일 (오름차순 elif — 공정성 확인)",
     "code": 'score = int(input())\nif score < 60:\n    print("F")\nelif score < 70:\n    print("D")\nelif score < 80:\n    print("C")\nelif score < 90:\n    print("B")\nelse:\n    print("A")\n'},
    {"id": "L3", "desc": "과잉 중첩 if (통과하지만 비효율)",
     "code": 'score = int(input())\nif score >= 60:\n    if score >= 70:\n        if score >= 80:\n            if score >= 90:\n                print("A")\n            else:\n                print("B")\n        else:\n            print("C")\n    else:\n        print("D")\nelse:\n    print("F")\n'},
    {"id": "L4", "desc": "if 연속 나열 (통과하지만 개념 부족)",
     "code": 'score = int(input())\nif score >= 90:\n    print("A")\nif score >= 80 and score < 90:\n    print("B")\nif score >= 70 and score < 80:\n    print("C")\nif score >= 60 and score < 70:\n    print("D")\nif score < 60:\n    print("F")\n'},
    {"id": "L5", "desc": "경계 실수 (>= 대신 > — 90점 케이스만 실패)",
     "code": 'score = int(input())\nif score > 90:\n    print("A")\nelif score >= 80:\n    print("B")\nelif score >= 70:\n    print("C")\nelif score >= 60:\n    print("D")\nelse:\n    print("F")\n'},
    {"id": "L6", "desc": "공개 케이스 하드코딩 (일반화 실패)",
     "code": 'score = int(input())\nif score == 85:\n    print("B")\nelse:\n    print("F")\n'},
]

with open(os.path.join(DRAFT, "lesson-5.json"), encoding="utf-8") as f:
    problem = next(p for p in json.load(f)["problems"] if p["id"] == "prob-3")
tests = problem["publicTests"] + problem["hiddenTests"]
n_public = len(problem["publicTests"])

out = []
for s in LADDER:
    case_results, first_error, passed = [], None, 0
    for i, t in enumerate(tests):
        stdout, err = run_solution(s["code"], t["stdin"])
        ok = err is None and matches_expected(stdout, t["expect"])
        if err and first_error is None: first_error = err
        if ok: passed += 1
        hidden = i >= n_public
        case_results.append({"label": f"히든 {i - n_public + 1}" if hidden else t["label"], "passed": ok, "hidden": hidden})
    out.append({**s, "summary": {
        "passed": passed == len(tests), "hadError": first_error is not None,
        "errorType": first_error.split(":")[0].strip() if first_error else None,
        "casesPassed": passed, "casesTotal": len(tests), "caseResults": case_results,
    }})
    print(f'{s["id"]}: {passed}/{len(tests)}')

with io.open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "ladder-graded.json"), "w", encoding="utf-8") as f:
    json.dump(out, f, ensure_ascii=False, indent=2)
print("saved ladder-graded.json")
