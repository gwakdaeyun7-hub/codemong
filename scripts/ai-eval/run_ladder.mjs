// 변별력 사다리 채점 — 6개 답안을 6초 간격으로 호출 (429 회피).
import { readFileSync, writeFileSync } from "node:fs";
import { setTimeout as sleep } from "node:timers/promises";

const REPO = "C:/Users/82105/Think AI/codemong";
const rubric = await import(`file://${REPO}/lib/ai/rubric.ts`);
const env = readFileSync(`${REPO}/.env.local`, "utf-8");
const KEY = env.match(/^GEMINI_API_KEY=(.*)$/m)?.[1]?.trim();
const MODEL = env.match(/^GEMINI_MODEL=(.*)$/m)?.[1]?.trim() || "gemini-3.1-flash-lite";

const ladder = JSON.parse(readFileSync(new URL("./ladder-graded.json", import.meta.url), "utf-8"));
const problem = JSON.parse(readFileSync(new URL("../problems-draft/lesson-5.json", import.meta.url), "utf-8"))
  .problems.find((p) => p.id === "prob-3");

const results = [];
for (const s of ladder) {
  const user = `${rubric.buildProblemBlock(problem)}\n\n${rubric.buildSubmissionBlock(s.code, s.summary)}`;
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
  const text = res.ok ? data.candidates?.[0]?.content?.parts?.[0]?.text : null;
  const v = text ? rubric.validateAiVerdict(JSON.parse(text)) : null;
  results.push({
    id: s.id, desc: s.desc, grading: `${s.summary.casesPassed}/${s.summary.casesTotal}`,
    scores: v ? `${v.concept}/${v.efficiency}/${v.interpretation}` : `ERROR HTTP ${res.status}`,
    deductions: v?.deductions ?? [], feedback: v?.feedback ?? null,
  });
  console.log(`${s.id} [${results.at(-1).grading}] ${results.at(-1).scores} — ${s.desc}`);
  await sleep(6000);
}
writeFileSync(new URL("./ladder-results.json", import.meta.url), JSON.stringify(results, null, 2), "utf-8");
