# -*- coding: utf-8 -*-
"""lesson-7/8/9 변별력 변형 답안(V2/V3/V4) 실측 검증기.

variants-lesson-{7,8,9}.json 의 각 코드를 문제 은행(scripts/problems-draft)의
공개+히든 테스트로 실제 실행해 casesPassed/casesTotal 을 측정하고,
측정치를 JSON 에 다시 써 넣은 뒤 변형별 조건 충족 여부를 보고한다.

조건
  V2  전 케이스 통과 (구조 결함은 있지만 정답)
  V3  1개 이상 실패 + 실행 오류 없음 (돌지만 값이 틀림)
  V4  히든 과반 실패

채점 규약(matches_expected / run_solution)은 ../grade_corpus.py 와 동일.
    py scripts/ai-eval/discrimination/verify_variants_789.py
"""
import io, json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
DRAFT = os.path.join(HERE, "..", "..", "problems-draft")
LESSONS = ["lesson-7", "lesson-8", "lesson-9"]
NUM_RE = re.compile(r"-?\d+(?:\.\d+)?")


def matches_expected(stdout, expects):
    pos = 0
    for e in expects:
        if e["kind"] == "text":
            idx = stdout.find(e["contains"], pos)
            if idx < 0:
                return False
            pos = idx + len(e["contains"])
        else:
            m = NUM_RE.search(stdout, pos)
            if not m or abs(float(m.group(0)) - e["value"]) > 1e-9:
                return False
            pos = m.end()
    return True


def run_solution(code, stdin_lines):
    it = iter(stdin_lines)
    buf = io.StringIO()

    def fake_input(prompt=""):
        try:
            return next(it)
        except StopIteration:
            raise EOFError

    g = {"input": fake_input, "print": lambda *a, **k: print(*a, **{**k, "file": buf})}
    try:
        exec(code, g)
    except EOFError:
        pass
    except SyntaxError as ex:
        return buf.getvalue(), "SyntaxError: %s" % ex
    except Exception as ex:
        return buf.getvalue(), "%s: %s" % (type(ex).__name__, ex)
    return buf.getvalue(), None


def load_problems():
    out = {}
    for lesson in LESSONS:
        with io.open(os.path.join(DRAFT, "%s.json" % lesson), encoding="utf-8") as f:
            d = json.load(f)
        for p in d["problems"]:
            out[(lesson, p["id"])] = p
    return out


def grade(code, problem):
    tests = problem["publicTests"] + problem["hiddenTests"]
    n_public = len(problem["publicTests"])
    passed = hidden_passed = 0
    first_error = None
    for i, t in enumerate(tests):
        stdout, err = run_solution(code, t["stdin"])
        ok = err is None and matches_expected(stdout, t["expect"])
        if err and first_error is None:
            first_error = err
        if ok:
            passed += 1
            if i >= n_public:
                hidden_passed += 1
    return {
        "casesPassed": passed,
        "casesTotal": len(tests),
        "hiddenPassed": hidden_passed,
        "hiddenTotal": len(tests) - n_public,
        "errorType": first_error.split(":")[0].strip() if first_error else None,
    }


def verdict(variant, r):
    """(ok, reason) — 변형 종류별 조건 판정."""
    if variant == "V2":
        if r["casesPassed"] == r["casesTotal"]:
            return True, "전 케이스 통과"
        return False, "V2 인데 %d/%d 만 통과" % (r["casesPassed"], r["casesTotal"])
    if variant == "V3":
        if r["errorType"]:
            return False, "V3 인데 실행 오류(%s)" % r["errorType"]
        if r["casesPassed"] == r["casesTotal"]:
            return False, "V3 인데 전 케이스 통과"
        return True, "%d개 실패" % (r["casesTotal"] - r["casesPassed"])
    if variant == "V4":
        hidden_failed = r["hiddenTotal"] - r["hiddenPassed"]
        if hidden_failed * 2 > r["hiddenTotal"]:
            return True, "히든 %d/%d 실패" % (hidden_failed, r["hiddenTotal"])
        return False, "V4 인데 히든 %d/%d 만 실패" % (hidden_failed, r["hiddenTotal"])
    return False, "알 수 없는 변형 %s" % variant


def main():
    problems = load_problems()
    bad = []
    total = 0
    for lesson in LESSONS:
        path = os.path.join(HERE, "variants-%s.json" % lesson)
        with io.open(path, encoding="utf-8") as f:
            data = json.load(f)
        print("== %s ==" % lesson)
        for v in data["variants"]:
            problem = problems[(lesson, v["problemId"])]
            r = grade(v["code"], problem)
            v["measuredCasesPassed"] = r["casesPassed"]
            v["measuredCasesTotal"] = r["casesTotal"]
            ok, reason = verdict(v["variant"], r)
            total += 1
            if not ok:
                bad.append("%s/%s %s: %s" % (lesson, v["problemId"], v["variant"], reason))
            print(
                "  %-7s %-3s %d/%d (히든 %d/%d)%s  %s  %s"
                % (
                    v["problemId"],
                    v["variant"],
                    r["casesPassed"],
                    r["casesTotal"],
                    r["hiddenPassed"],
                    r["hiddenTotal"],
                    " [%s]" % r["errorType"] if r["errorType"] else "",
                    "OK " if ok else "FAIL",
                    reason,
                )
            )
        with io.open(path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
    print("\n%d개 변형 검증, 조건 미충족 %d개" % (total, len(bad)))
    for b in bad:
        print("  - %s" % b)
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
