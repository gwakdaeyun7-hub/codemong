// 점수 재현성 실측 — 같은 입력(S2, S3)을 각 5회 호출해 점수 분산 확인.
import { readFileSync, writeFileSync } from "node:fs";
import { setTimeout as sleep } from "node:timers/promises";

const REPO = "C:/Users/82105/Think AI/codemong";
const rubric = await import(`file://${REPO}/lib/ai/rubric.ts`);
const env = readFileSync(`${REPO}/.env.local`, "utf-8");
const KEY = env.match(/^GEMINI_API_KEY=(.*)$/m)?.[1]?.trim();
const MODEL = env.match(/^GEMINI_MODEL=(.*)$/m)?.[1]?.trim() || "gemini-3.1-flash-lite";

const samples = JSON.parse(readFileSync(new URL("./samples-graded.json", import.meta.url), "utf-8"))
  .filter((s) => ["S2", "S3"].includes(s.id));

function loadProblem(lessonFile, problemId) {
  const d = JSON.parse(readFileSync(new URL(`../problems-draft/${lessonFile}`, import.meta.url), "utf-8"));
  return d.problems.find((p) => p.id === problemId);
}

const out = [];
for (const s of samples) {
  const problem = loadProblem(s.lesson, s.problem);
  const user = `${rubric.buildProblemBlock(problem)}\n\n${rubric.buildSubmissionBlock(s.code, s.summary)}`;
  for (let i = 1; i <= 5; i++) {
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
    const v = text ? rubric.validateAiVerdict(JSON.parse(text)) : null;
    out.push({ id: s.id, run: i, c: v?.concept, e: v?.efficiency, itp: v?.interpretation, ded: v?.deductions.length });
    console.log(`${s.id} run${i}: ${v?.concept}/${v?.efficiency}/${v?.interpretation} (감점 ${v?.deductions.length}건)`);
    await sleep(1100);
  }
}
writeFileSync(new URL("./stability-results.json", import.meta.url), JSON.stringify(out, null, 2), "utf-8");
