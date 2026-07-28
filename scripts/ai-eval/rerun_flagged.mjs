// 보정 후 재검증 — ① 7시나리오 회귀(S1,S3,S6,S7) ② 큰 불일치 10건 재채점 ③ 공정성 재확인(C42).
import { readFileSync, writeFileSync } from "node:fs";
import { setTimeout as sleep } from "node:timers/promises";

const REPO = "C:/Users/82105/Think AI/codemong";
const rubric = await import(`file://${REPO}/lib/ai/rubric.ts`);
const env = readFileSync(`${REPO}/.env.local`, "utf-8");
const KEY = env.match(/^GEMINI_API_KEY=(.*)$/m)?.[1]?.trim();
const MODEL = env.match(/^GEMINI_MODEL=(.*)$/m)?.[1]?.trim() || "gemini-3.1-flash-lite";

const problems = {};
for (const lesson of ["lesson-4", "lesson-5", "lesson-6", "lesson-7", "lesson-9"]) {
  const d = JSON.parse(readFileSync(new URL(`../problems-draft/${lesson}.json`, import.meta.url), "utf-8"));
  for (const p of d.problems) problems[`${lesson}/${p.id}`] = p;
}

const corpus = JSON.parse(readFileSync(new URL("./corpus-graded.json", import.meta.url), "utf-8"));
const scenarios = JSON.parse(readFileSync(new URL("./samples-graded.json", import.meta.url), "utf-8"));
const FLAGGED = ["C04", "C06", "C08", "C16", "C20", "C38", "C40", "C42", "C45", "C48", "C62"];
const REG = ["S1", "S3", "S6", "S7"];

const jobs = [
  ...scenarios.filter((s) => REG.includes(s.id)).map((s) => ({ id: s.id, ref: s.lesson.replace(".json", "") + "/" + s.problem, code: s.code, summary: s.summary, expert: null })),
  ...corpus.filter((c) => FLAGGED.includes(c.id)).map((c) => ({ id: c.id, ref: c.ref, code: c.code, summary: c.summary, expert: c.expert })),
];

const results = [];
for (const j of jobs) {
  const problem = problems[j.ref];
  const user = `${rubric.buildProblemBlock(problem)}\n\n${rubric.buildSubmissionBlock(j.code, j.summary)}`;
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
  const exp = j.expert ? ` (전문가 ${j.expert.c}/${j.expert.e}/${j.expert.i})` : "";
  results.push({ id: j.id, ref: j.ref, expert: j.expert, ai: v, feedback: v?.feedback });
  console.log(`${j.id}: ${v ? `${v.concept}/${v.efficiency}/${v.interpretation}` : "ERROR"}${exp}`);
  await sleep(5500);
}
writeFileSync(new URL("./rerun-results.json", import.meta.url), JSON.stringify(results, null, 2), "utf-8");
