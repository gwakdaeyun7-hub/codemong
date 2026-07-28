# -*- coding: utf-8 -*-
# 블라인드 전문가 채점(expert) vs Gemini(ai) 일치율 분석.
# P7(문법/실행 오류)은 규칙 검증 항목이라 별도 집계.
import json, io, os

BASE = os.path.dirname(os.path.abspath(__file__))
graded = {s["id"]: s for s in json.load(open(os.path.join(BASE, "corpus-graded.json"), encoding="utf-8"))}
ai = {r["id"]: r for r in json.load(open(os.path.join(BASE, "corpus-ai-results.json"), encoding="utf-8"))}

AXES = [("c", "concept", "개념"), ("e", "efficiency", "효율"), ("i", "interpretation", "해석")]

rows, missing = [], []
for cid, s in graded.items():
    r = ai.get(cid)
    if not r or not r.get("ai"):
        missing.append(cid)
        continue
    diffs = {}
    for ek, ak, _ in AXES:
        diffs[ek] = r["ai"][ak] - s["expert"][ek]
    rows.append({"id": cid, "ref": s["ref"], "persona": s["persona"], "note": s["note"],
                 "expert": s["expert"], "ai": {k: r["ai"][a] for k, a, _ in AXES}, "diff": diffs})

main = [r for r in rows if r["persona"] != "P7"]
p7 = [r for r in rows if r["persona"] == "P7"]

out = io.StringIO()
out.write(f"분석 대상 {len(rows)}건 (본집계 {len(main)} + 규칙검증 P7 {len(p7)}), 누락 {missing}\n\n")

out.write("=== 본집계 (P7 제외) — 축별 일치 지표 ===\n")
for ek, ak, name in AXES:
    ds = [r["diff"][ek] for r in main]
    mae = sum(abs(d) for d in ds) / len(ds)
    within10 = sum(1 for d in ds if abs(d) <= 10) / len(ds) * 100
    within20 = sum(1 for d in ds if abs(d) <= 20) / len(ds) * 100
    bias = sum(ds) / len(ds)
    out.write(f"{name}: 평균절대오차 {mae:.1f}점, ±10 이내 {within10:.0f}%, ±20 이내 {within20:.0f}%, 방향 편향 {bias:+.1f}\n")

out.write("\n=== 큰 불일치 (어느 축이든 |차이| > 20) ===\n")
for r in main:
    big = {k: v for k, v in r["diff"].items() if abs(v) > 20}
    if big:
        out.write(f'{r["id"]} {r["ref"]} {r["persona"]} [{r["note"]}]\n')
        out.write(f'  전문가 {r["expert"]["c"]}/{r["expert"]["e"]}/{r["expert"]["i"]} vs AI {r["ai"]["c"]}/{r["ai"]["e"]}/{r["ai"]["i"]} (차이 {big})\n')

out.write("\n=== P7 규칙 검증 (문법/실행 오류 → 의도 기준 평가, 감점 금지) ===\n")
for r in p7:
    ok = all(r["ai"][k] >= 90 for k in ("c", "e", "i"))
    out.write(f'{r["id"]} {r["ref"]}: AI {r["ai"]["c"]}/{r["ai"]["e"]}/{r["ai"]["i"]} {"OK" if ok else "위반?"}\n')

print(out.getvalue())
with io.open(os.path.join(BASE, "agreement-report.txt"), "w", encoding="utf-8") as f:
    f.write(out.getvalue())
