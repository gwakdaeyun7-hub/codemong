// 프롬프트 수정 후 회귀 검증 — S1(모범)·S3(오답)·S6(문법오류)·S7(인젝션)만 재실행.
import { readFileSync, writeFileSync } from "node:fs";
import { setTimeout as sleep } from "node:timers/promises";

const REPO = "C:/Users/82105/Think AI/codemong";
const rubric = await import(`file://${REPO}/lib/ai/rubric.ts`);
const env = readFileSync(`${REPO}/.env.local`, "utf-8");
const KEY = env.match(/^GEMINI_API_KEY=(.*)$/m)?.[1]?.trim();
const MODEL = env.match(/^GEMINI_MODEL=(.*)$/m)?.[1]?.trim() || "gemini-3.1-flash-lite";

const samples = JSON.parse(readFileSync(new URL("./samples-graded.json", import.meta.url), "utf-8"))
  .filter((s) => ["S1", "S3", "S6", "S7"].includes(s.id));

function loadProblem(lessonFile, problemId) {
  const d = JSON.parse(readFileSync(new URL(`../problems-draft/${lessonFile}`, import.meta.url), "utf-8"));
  return d.problems.find((p) => p.id === problemId);
}

const results = [];
for (const s of samples) {
  const problem = loadProblem(s.lesson, s.problem);
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
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  results.push({ id: s.id, desc: s.desc, grading: `${s.summary.casesPassed}/${s.summary.casesTotal}`, verdict: text ? rubric.validateAiVerdict(JSON.parse(text)) : null });
  console.log(`${s.id} done`);
  await sleep(1200);
}
writeFileSync(new URL("./regression-results.json", import.meta.url), JSON.stringify(results, null, 2), "utf-8");
console.log("saved regression-results.json");
