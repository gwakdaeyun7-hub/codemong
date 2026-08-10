// 변별력 매트릭스 2단계 — matrix-graded.json 전 항목(~136건)을 Gemini 로 채점.
// 프로덕션 rubric.ts 를 그대로 import. 6초 간격(무료 RPM 여유), 429 는 20초 대기 후 1회 재시도.
// 진행 상황을 matrix-ai-results.json 에 건마다 저장 — 중단돼도 이어서 실행 가능(이미 있는 id 스킵).
// 실행: node --experimental-strip-types run_matrix.mjs
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { setTimeout as sleep } from "node:timers/promises";

const REPO = "C:/Users/82105/Think AI/codemong";
const rubric = await import(`file://${REPO}/lib/ai/rubric.ts`);
const env = readFileSync(`${REPO}/.env.local`, "utf-8");
const KEY = env.match(/^GEMINI_API_KEY=(.*)$/m)?.[1]?.trim();
const MODEL = env.match(/^GEMINI_MODEL=(.*)$/m)?.[1]?.trim() || "gemini-3.1-flash-lite";

const entries = JSON.parse(readFileSync(new URL("./matrix-graded.json", import.meta.url), "utf-8"));
const problems = {};
for (const n of [4, 5, 6, 7, 8, 9]) {
  const d = JSON.parse(readFileSync(new URL(`../../problems-draft/lesson-${n}.json`, import.meta.url), "utf-8"));
  for (const p of d.problems) problems[`lesson-${n}/${p.id}`] = p;
}

const outUrl = new URL("./matrix-ai-results.json", import.meta.url);
const results = existsSync(outUrl) ? JSON.parse(readFileSync(outUrl, "utf-8")) : [];
const done = new Set(results.map((r) => `${r.ref}|${r.variant}`));

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
  if (res.status === 429) return { retry: true };
  const data = await res.json();
  if (!res.ok) return { error: `HTTP ${res.status}` };
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  try {
    return { verdict: text ? rubric.validateAiVerdict(JSON.parse(text)) : null };
  } catch {
    return { error: "parse" };
  }
}

let n = 0;
for (const e of entries) {
  const key = `${e.ref}|${e.variant}`;
  if (done.has(key)) continue;
  let r = await callOnce(problems[e.ref], e.code, e.summary);
  if (r.retry) {
    await sleep(20000);
    r = await callOnce(problems[e.ref], e.code, e.summary);
  }
  results.push({
    ref: e.ref, variant: e.variant, desc: e.desc,
    grading: `${e.summary.casesPassed}/${e.summary.casesTotal}`,
    ai: r.verdict ?? null, error: r.error ?? (r.retry ? "429x2" : null),
  });
  writeFileSync(outUrl, JSON.stringify(results, null, 2), "utf-8");
  n++;
  console.log(`[${results.length}/${entries.length}] ${e.ref} ${e.variant}: ${r.verdict ? `${r.verdict.concept}/${r.verdict.efficiency}/${r.verdict.interpretation}` : results.at(-1).error}`);
  await sleep(6000);
}
const failed = results.filter((r) => !r.ai).length;
console.log(`완료: ${results.length}건 (이번 실행 ${n}건), 실패 ${failed}건`);
