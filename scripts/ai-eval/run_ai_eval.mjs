// AI 채점 품질 평가 — 프로덕션 rubric.ts 를 그대로 import 해 조립한 프롬프트로 Gemini 호출.
// 실행: node --experimental-strip-types run_ai_eval.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { setTimeout as sleep } from "node:timers/promises";

const REPO = "C:/Users/82105/Think AI/codemong";
const rubric = await import(`file://${REPO}/lib/ai/rubric.ts`);

const env = readFileSync(`${REPO}/.env.local`, "utf-8");
const KEY = env.match(/^GEMINI_API_KEY=(.*)$/m)?.[1]?.trim();
const MODEL = env.match(/^GEMINI_MODEL=(.*)$/m)?.[1]?.trim() || "gemini-3.1-flash-lite";

const samples = JSON.parse(readFileSync(new URL("./samples-graded.json", import.meta.url), "utf-8"));

function loadProblem(lessonFile, problemId) {
  const d = JSON.parse(readFileSync(new URL(`../problems-draft/${lessonFile}`, import.meta.url), "utf-8"));
  return d.problems.find((p) => p.id === problemId);
}

async function callGemini(system, user) {
  const t0 = Date.now();
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": KEY },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
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
  const ms = Date.now() - t0;
  const data = await res.json();
  if (!res.ok) return { error: `HTTP ${res.status}: ${JSON.stringify(data).slice(0, 200)}`, ms };
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  return { raw: text, usage: data.usageMetadata, ms };
}

const results = [];
for (const s of samples) {
  const problem = loadProblem(s.lesson, s.problem);
  const user = `${rubric.buildProblemBlock(problem)}\n\n${rubric.buildSubmissionBlock(s.code, s.summary)}`;
  const r = await callGemini(rubric.RUBRIC_SYSTEM_PROMPT, user);
  let verdict = null;
  if (r.raw) {
    try { verdict = rubric.validateAiVerdict(JSON.parse(r.raw)); } catch { verdict = null; }
  }
  results.push({
    id: s.id, desc: s.desc, expect: s.expect,
    grading: `${s.summary.casesPassed}/${s.summary.casesTotal}${s.summary.errorType ? " " + s.summary.errorType : ""}`,
    ms: r.ms, error: r.error ?? null,
    cachedTokens: r.usage?.cachedContentTokenCount ?? 0,
    promptTokens: r.usage?.promptTokenCount, outputTokens: r.usage?.candidatesTokenCount,
    verdict,
  });
  console.log(`${s.id} done (${r.ms}ms)${r.error ? " ERROR" : ""}`);
  await sleep(1200); // 무료 티어 RPM 여유
}

writeFileSync(new URL("./ai-eval-results.json", import.meta.url), JSON.stringify(results, null, 2), "utf-8");
console.log("saved ai-eval-results.json");
