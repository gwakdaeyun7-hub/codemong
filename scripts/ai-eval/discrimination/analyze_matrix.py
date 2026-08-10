# -*- coding: utf-8 -*-
# 변별력 매트릭스 3단계 — 문제별 V1~V4 판정.
# 합격 기준:
#  V1 모범답안      : 3축 최솟값 >= 90
#  V2 결함 정답     : 개념 또는 효율에 감점(<100) + 평균이 V1 보다 낮음 + 3축 최솟값 >= 30(과감점 방지)
#  V3 오개념 오답   : 개념 또는 해석에 감점(<100) + "3축 모두 100" 금지 규칙 준수
#  V4 하드코딩      : 개념 <= 40 그리고 해석 <= 40 (캘리브레이션 규칙)
#  서열             : avg(V1) > avg(V2), avg(V1) > avg(V3), avg(V4) <= avg(V2)
#  유출             : 모든 피드백에 코드 흔적(``` / print( / def / input()) 없음
import json, io, os, re

BASE = os.path.dirname(os.path.abspath(__file__))
rows = json.load(open(os.path.join(BASE, "matrix-ai-results.json"), encoding="utf-8"))
# 유출 판정: 실제 코드 형태만 잡는다. "def 키워드를 사용하세요" 같은 키워드 언급(힌트형 허용 범위)은
# 유출이 아니므로 제외 — 코드 블록, 할당식, 인자가 채워진 호출식 패턴만.
LEAK_RE = re.compile(r"```|def \w+\s*\(|= ?int\(|= ?input\(|print\([^)\s][^)]*\)")

by_ref = {}
for r in rows:
    by_ref.setdefault(r["ref"], {})[r["variant"]] = r

def avg(v):
    a = v["ai"]
    return (a["concept"] + a["efficiency"] + a["interpretation"]) / 3

out = io.StringIO()
flags_total = 0
ok_problems = 0

for ref in sorted(by_ref.keys()):
    vs = by_ref[ref]
    flags = []
    missing = [k for k in ("V1", "V2", "V3", "V4") if k not in vs or not vs[k].get("ai")]
    if missing:
        flags.append(f"결과 누락: {missing}")
    else:
        v1, v2, v3, v4 = (vs[k]["ai"] for k in ("V1", "V2", "V3", "V4"))
        if min(v1["concept"], v1["efficiency"], v1["interpretation"]) < 90:
            flags.append(f'V1 낮음 {v1["concept"]}/{v1["efficiency"]}/{v1["interpretation"]}')
        if v2["concept"] == 100 and v2["efficiency"] == 100:
            flags.append("V2 결함 미감지 (개념·효율 둘 다 100)")
        if min(v2["concept"], v2["efficiency"], v2["interpretation"]) < 30:
            flags.append(f'V2 과감점 {v2["concept"]}/{v2["efficiency"]}/{v2["interpretation"]}')
        if v3["concept"] == 100 and v3["interpretation"] == 100:
            flags.append("V3 오개념 미감지 (개념·해석 둘 다 100)")
        if v3["concept"] == 100 and v3["efficiency"] == 100 and v3["interpretation"] == 100:
            flags.append("V3 규칙 위반 (케이스 실패인데 3축 100)")
        if v4["concept"] > 40 or v4["interpretation"] > 40:
            flags.append(f'V4 캘리브레이션 이탈 (개념 {v4["concept"]}, 해석 {v4["interpretation"]})')
        a1, a2, a3, a4 = avg(vs["V1"]), avg(vs["V2"]), avg(vs["V3"]), avg(vs["V4"])
        if not (a1 > a2): flags.append(f"서열 위반 V1({a1:.0f}) <= V2({a2:.0f})")
        if not (a1 > a3): flags.append(f"서열 위반 V1({a1:.0f}) <= V3({a3:.0f})")
        if a4 > a2: flags.append(f"서열 위반 V4({a4:.0f}) > V2({a2:.0f})")
        for k in ("V1", "V2", "V3", "V4"):
            fb = vs[k]["ai"].get("feedback") or ""
            if LEAK_RE.search(fb):
                flags.append(f"{k} 피드백 코드 유출 의심")
    line = " / ".join(
        f'{k}:{vs[k]["ai"]["concept"]}·{vs[k]["ai"]["efficiency"]}·{vs[k]["ai"]["interpretation"]}'
        for k in ("V1", "V2", "V3", "V4") if k in vs and vs[k].get("ai")
    )
    if flags:
        flags_total += len(flags)
        out.write(f"FLAG {ref}  {line}\n")
        for fl in flags: out.write(f"      - {fl}\n")
    else:
        ok_problems += 1
        out.write(f"ok   {ref}  {line}\n")

out.write(f"\n합계: {ok_problems}/{len(by_ref)}문제 전 기준 통과, 플래그 {flags_total}건\n")
print(out.getvalue())
with io.open(os.path.join(BASE, "matrix-report.txt"), "w", encoding="utf-8") as f:
    f.write(out.getvalue())
