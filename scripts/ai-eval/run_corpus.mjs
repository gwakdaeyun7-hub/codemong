// 코퍼스 64건 Gemini 전량 채점 — 5.5초 간격 (약 7분). 결과는 corpus-ai-results.json.
import { readFileSync, writeFileSync } from "node:fs";
import { setTimeout as sleep } from "node:timers/promises";

const REPO = "C:/Users/82105/Think AI/codemong";
const rubric = await import(`file://${REPO}/lib/ai/rubric.ts`);
const env = readFileSync(`${REPO}/.env.local`, "utf-8");
const KEY = env.match(/^GEMINI_API_KEY=(.*)$/m)?.[1]?.trim();
const MODEL = env.match(/^GEMINI_MODEL=(.*)$/m)?.[1]?.trim() || "gemini-3.1-flash-lite";

const corpus = JSON.parse(readFileSync(new URL("./corpus-graded.json", import.meta.url), "utf-8"));
const problems = {};
for (const lesson of ["lesson-4", "lesson-5", "lesson-6", "lesson-7", "lesson-8", "lesson-9"]) {
  const d = JSON.parse(readFileSync(new URL(`../problems-draft/${lesson}.json`, import.meta.url), "utf-8"));
  for (const p of d.problems) problems[`${lesson}/${p.id}`] = p;
}

async function callOnce(problem, code, summary) {
  const user = `${rubric.buildProblemBlock(problem)}\n\n${rubric.buildSubmissionBlock(code, summary)}`;
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
  if (!res.ok) return { error: `HTTP ${res.status}` };
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  try {
    return { verdict: text ? rubric.validateAiVerdict(JSON.parse(text)) : null };
  } catch {
    return { error: "parse" };
  }
}

const results = [];
for (const s of corpus) {
  let r = await callOnce(problems[s.ref], s.code, s.summary);
  if (r.error === "HTTP 429") {
    await sleep(20000);
    r = await callOnce(problems[s.ref], s.code, s.summary); // 1회 재시도
  }
  results.push({ id: s.id, ref: s.ref, persona: s.persona, ai: r.verdict ?? null, error: r.error ?? null });
  console.log(`${s.id} ${s.persona}: ${r.verdict ? `${r.verdict.concept}/${r.verdict.efficiency}/${r.verdict.interpretation}` : r.error}`);
  await sleep(5500);
}
writeFileSync(new URL("./corpus-ai-results.json", import.meta.url), JSON.stringify(results, null, 2), "utf-8");
const failed = results.filter((r) => !r.ai).length;
console.log(`완료: ${results.length}건, 실패 ${failed}건`);
