// 전수 점검에서 429(레이트리밋) 난 문제만 6초 간격으로 재시도.
import { readFileSync, writeFileSync } from "node:fs";
import { setTimeout as sleep } from "node:timers/promises";

const REPO = "C:/Users/82105/Think AI/codemong";
const rubric = await import(`file://${REPO}/lib/ai/rubric.ts`);
const env = readFileSync(`${REPO}/.env.local`, "utf-8");
const KEY = env.match(/^GEMINI_API_KEY=(.*)$/m)?.[1]?.trim();
const MODEL = env.match(/^GEMINI_MODEL=(.*)$/m)?.[1]?.trim() || "gemini-3.1-flash-lite";

const prev = JSON.parse(readFileSync(new URL("./full-sweep-results.json", import.meta.url), "utf-8"));
const cache = {};
for (const lesson of ["lesson-4", "lesson-5", "lesson-6", "lesson-7", "lesson-8", "lesson-9"]) {
  cache[lesson] = JSON.parse(readFileSync(new URL(`../problems-draft/${lesson}.json`, import.meta.url), "utf-8"));
}

for (const r of prev) {
  if (r.flag !== "ERROR") continue;
  const [lesson, probId] = r.ref.split("/");
  const p = cache[lesson].problems.find((x) => x.id === probId);
  const tests = [...p.publicTests, ...p.hiddenTests];
  const nPublic = p.publicTests.length;
  const summary = {
    passed: true, hadError: false, errorType: null,
    casesPassed: tests.length, casesTotal: tests.length,
    caseResults: tests.map((t, i) => ({
      label: i >= nPublic ? `히든 ${i - nPublic + 1}` : t.label,
      passed: true, hidden: i >= nPublic,
    })),
  };
  const user = `${rubric.buildProblemBlock(p)}\n\n${rubric.buildSubmissionBlock(p.solutionCode, summary)}`;
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": KEY },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: rubric.RUBRIC_SYSTEM_PROMPT }] },
      contents: [{ role: "user", parts: [{ text: user }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: rubric.RUBRIC_RESPONSE_SCHEMA,
        maxOutputTokens: 1024,
        temperature: 0.2,
        thinkingConfig: { thinkingBudget: 0 },
      },
    }),
  });
  const data = await res.json();
  if (res.ok) {
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    const v = text ? rubric.validateAiVerdict(JSON.parse(text)) : null;
    if (v) {
      r.scores = `${v.concept}/${v.efficiency}/${v.interpretation}`;
      r.deductions = v.deductions;
      r.error = null;
      r.flag = Math.min(v.concept, v.efficiency, v.interpretation) < 90 ? "FLAG" : "ok";
    }
  } else {
    r.error = `HTTP ${res.status}`;
  }
  console.log(`${r.flag === "ok" ? " " : r.flag} ${r.ref} ${r.title}: ${r.scores ?? r.error}`);
  await sleep(6000);
}

writeFileSync(new URL("./full-sweep-results.json", import.meta.url), JSON.stringify(prev, null, 2), "utf-8");
const flagged = prev.filter((x) => x.flag !== "ok");
console.log(`\n총 ${prev.length}문제, 이상 ${flagged.length}건`);
for (const f of flagged) console.log("남은 이상:", f.ref, f.title, f.scores ?? f.error, JSON.stringify(f.deductions));
