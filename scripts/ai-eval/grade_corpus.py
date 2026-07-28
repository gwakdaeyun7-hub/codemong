# -*- coding: utf-8 -*-
# 코퍼스 64건을 결정적 채점기로 채점해 corpus-graded.json 생성.
import json, re, io, os
from corpus import CORPUS

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
    except SyntaxError as ex: return buf.getvalue(), f"SyntaxError: {ex}"
    except Exception as ex: return buf.getvalue(), f"{type(ex).__name__}: {ex}"
    return buf.getvalue(), None

problems = {}
for fn in os.listdir(DRAFT):
    if fn.endswith(".json"):
        with open(os.path.join(DRAFT, fn), encoding="utf-8") as f:
            d = json.load(f)
        for p in d["problems"]:
            problems[f'{d["lessonId"]}/{p["id"]}'] = p

out = []
for idx, s in enumerate(CORPUS, 1):
    p = problems[s["ref"]]
    tests = p["publicTests"] + p["hiddenTests"]
    n_public = len(p["publicTests"])
    case_results, first_error, passed = [], None, 0
    for i, t in enumerate(tests):
        stdout, err = run_solution(s["code"], t["stdin"])
        ok = err is None and matches_expected(stdout, t["expect"])
        if err and first_error is None: first_error = err
        if ok: passed += 1
        hidden = i >= n_public
        case_results.append({"label": f"히든 {i - n_public + 1}" if hidden else t["label"], "passed": ok, "hidden": hidden})
    out.append({
        "id": f"C{idx:02d}", "ref": s["ref"], "persona": s["persona"], "note": s["note"],
        "expert": s["expert"], "code": s["code"],
        "summary": {
            "passed": passed == len(tests), "hadError": first_error is not None,
            "errorType": first_error.split(":")[0].strip() if first_error else None,
            "casesPassed": passed, "casesTotal": len(tests), "caseResults": case_results,
        },
    })
    print(f'C{idx:02d} {s["ref"]} {s["persona"]}: {passed}/{len(tests)}{" " + out[-1]["summary"]["errorType"] if out[-1]["summary"]["errorType"] else ""}')

with io.open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "corpus-graded.json"), "w", encoding="utf-8") as f:
    json.dump(out, f, ensure_ascii=False, indent=2)
print(f"saved corpus-graded.json ({len(out)}건)")
