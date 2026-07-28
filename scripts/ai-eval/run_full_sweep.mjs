// 34문제 전수 점검 — 각 문제의 모범답안(solutionCode, 전 케이스 통과)을 제출.
// 기대: 3축 모두 높은 점수(>=90). 낮게 나오면 그 문제의 rubricNote/지문이 채점을 오도하는 것.
import { readFileSync, writeFileSync } from "node:fs";
import { setTimeout as sleep } from "node:timers/promises";

const REPO = "C:/Users/82105/Think AI/codemong";
const rubric = await import(`file://${REPO}/lib/ai/rubric.ts`);
const env = readFileSync(`${REPO}/.env.local`, "utf-8");
const KEY = env.match(/^GEMINI_API_KEY=(.*)$/m)?.[1]?.trim();
const MODEL = env.match(/^GEMINI_MODEL=(.*)$/m)?.[1]?.trim() || "gemini-3.1-flash-lite";

const LESSONS = ["lesson-4", "lesson-5", "lesson-6", "lesson-7", "lesson-8", "lesson-9"];
const results = [];

for (const lesson of LESSONS) {
  const d = JSON.parse(readFileSync(new URL(`../problems-draft/${lesson}.json`, import.meta.url), "utf-8"));
  for (const p of d.problems) {
    const tests = [...p.publicTests, ...p.hiddenTests];
    const nPublic = p.publicTests.length;
    // 모범답안은 이미 전 케이스 통과 검증됨 — 통과 요약을 그대로 구성 (히든 라벨 마스킹).
    const summary = {
      passed: true, hadError: false, errorType: null,
      casesPassed: tests.length, casesTotal: tests.length,
      caseResults: tests.map((t, i) => ({
        label: i >= nPublic ? `히든 ${i - nPublic + 1}` : t.label,
        passed: true, hidden: i >= nPublic,
      })),
    };
    const user = `${rubric.buildProblemBlock(p)}\n\n${rubric.buildSubmissionBlock(p.solutionCode, summary)}`;
    let verdict = null, error = null;
    try {
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
      if (!res.ok) error = `HTTP ${res.status}`;
      else {
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        verdict = text ? rubric.validateAiVerdict(JSON.parse(text)) : null;
      }
    } catch (e) {
      error = String(e).slice(0, 100);
    }
    const flag = error || !verdict
      ? "ERROR"
      : Math.min(verdict.concept, verdict.efficiency, verdict.interpretation) < 90
        ? "FLAG"
        : "ok";
    results.push({
      ref: `${lesson}/${p.id}`, title: p.title, flag,
      scores: verdict ? `${verdict.concept}/${verdict.efficiency}/${verdict.interpretation}` : null,
      deductions: verdict?.deductions ?? [], error,
    });
    console.log(`${flag === "ok" ? " " : flag} ${lesson}/${p.id} ${p.title}: ${results.at(-1).scores ?? error}`);
    await sleep(1100);
  }
}

writeFileSync(new URL("./full-sweep-results.json", import.meta.url), JSON.stringify(results, null, 2), "utf-8");
const flagged = results.filter((r) => r.flag !== "ok");
console.log(`\n총 ${results.length}문제, 이상 ${flagged.length}건`);
