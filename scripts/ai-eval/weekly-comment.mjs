// 주간 성장 리포트 LLM 코멘트 — 시나리오 눈검사 스크립트.
// 프로덕션 프롬프트(lib/skill/weekly-comment-prompt.ts)를 그대로 import 해 대표 숫자 시나리오로
// Gemini 를 호출하고 코멘트를 출력한다. 점수화하지 않는다 — 채점 루브릭과 달리 점수를 결정하는
// 프롬프트가 아니라서, 프롬프트를 고칠 때 전후 코멘트를 사람이 읽어 보는 용도.
//
// 실행 (프로젝트 루트): pnpm ai:weekly
//   = node --experimental-strip-types --env-file=.env.local scripts/ai-eval/weekly-comment.mjs
// 옵션: --save  → scripts/ai-eval/weekly-comment-results.json 에 결과 저장(전후 비교용)
//       --only=A,C → 시나리오 일부만
// 읽기 전용 — DB 에 아무것도 쓰지 않는다. 무료 티어 RPM 을 생각해 호출 사이 1.5초 쉼.

import { writeFileSync } from "node:fs";
import { setTimeout as sleep } from "node:timers/promises";

const REPO = new URL("../../", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const prompt = await import(`file://${REPO}/lib/skill/weekly-comment-prompt.ts`);

const MODEL = process.env.GEMINI_MODEL || "gemini-3.1-flash-lite";
const KEY = process.env.GEMINI_API_KEY;
if (!KEY) {
  console.error("GEMINI_API_KEY 가 없습니다 — --env-file=.env.local 로 실행했는지 확인.");
  process.exit(1);
}

const full = { syntax: 100, logic: 100, concept: 100, efficiency: 100, interpretation: 100 };

/** 대표 시나리오 — 실제로 문제가 됐던 케이스(A)와 톤·정직성·delta 활용을 볼 수 있는 조합 */
export const SCENARIOS = [
  {
    id: "A",
    name: "전축 100 · 제출 1회 · 약한 축 없음 (동점 — 실데이터 케이스)",
    data: {
      submissionCount: 1,
      passRate: 100,
      axisScores: full,
      axisDeltas: {},
      weakestAxis: null,
    },
  },
  {
    id: "B",
    name: "보통 · 첫 리포트(delta 없음) · 로직 최저",
    data: {
      submissionCount: 4,
      passRate: 50,
      axisScores: { syntax: 90, logic: 55, concept: 60, efficiency: 100, interpretation: 100 },
      axisDeltas: {},
      weakestAxis: "logic",
    },
  },
  {
    id: "C",
    name: "보통 · 전주 대비 로직 +15 (가장 많이 오른 축이자 최저 축)",
    data: {
      submissionCount: 6,
      passRate: 67,
      axisScores: { syntax: 92, logic: 70, concept: 75, efficiency: 95, interpretation: 88 },
      axisDeltas: { syntax: 2, logic: 15, concept: -5, efficiency: 0, interpretation: 8 },
      weakestAxis: "logic",
    },
  },
  {
    id: "D",
    name: "저조 · 통과율 0% (정직하게 말하는지)",
    data: {
      submissionCount: 2,
      passRate: 0,
      axisScores: { syntax: 40, logic: 20, concept: 30, efficiency: 60, interpretation: 35 },
      axisDeltas: {},
      weakestAxis: "logic",
    },
  },
  {
    id: "E",
    name: "AI 축 미측정 · 결정적 2축만 (구문 100 과대해석 여부)",
    data: {
      submissionCount: 3,
      passRate: 33,
      axisScores: { syntax: 100, logic: 45 },
      axisDeltas: {},
      weakestAxis: "logic",
    },
  },
  {
    id: "F",
    name: "하락 주 · 대부분 축이 내려감",
    data: {
      submissionCount: 5,
      passRate: 40,
      axisScores: { syntax: 80, logic: 50, concept: 65, efficiency: 70, interpretation: 60 },
      axisDeltas: { syntax: -10, logic: -20, concept: 0, efficiency: -5, interpretation: 5 },
      weakestAxis: "logic",
    },
  },
  {
    id: "G",
    name: "약한 축 = 문제 해석력 (로직 외 축 행동 지침 확인)",
    data: {
      submissionCount: 3,
      passRate: 67,
      axisScores: { syntax: 100, logic: 90, concept: 85, efficiency: 95, interpretation: 55 },
      axisDeltas: {},
      weakestAxis: "interpretation",
    },
  },
  {
    id: "H",
    name: "약한 축 = 구문 정확도 (실행 오류가 잦은 학습자)",
    data: {
      submissionCount: 4,
      passRate: 25,
      axisScores: { syntax: 50, logic: 60, concept: 80, efficiency: 90, interpretation: 85 },
      axisDeltas: {},
      weakestAxis: "syntax",
    },
  },
];

async function generate(user) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": KEY },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: prompt.WEEKLY_COMMENT_SYSTEM }] },
        contents: [{ role: "user", parts: [{ text: user }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: prompt.WEEKLY_COMMENT_SCHEMA,
          maxOutputTokens: 400,
          temperature: 0.2,
          thinkingConfig: { thinkingBudget: 0 },
        },
      }),
    },
  );
  if (!res.ok) return { error: `HTTP ${res.status} ${(await res.text()).slice(0, 200)}` };
  const j = await res.json();
  const text = j.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  try {
    return { comment: JSON.parse(text).comment, usage: j.usageMetadata };
  } catch {
    return { error: "PARSE FAIL: " + text.slice(0, 200) };
  }
}

const args = process.argv.slice(2);
const save = args.includes("--save");
const only = args
  .find((a) => a.startsWith("--only="))
  ?.slice(7)
  .split(",");
const picked = only ? SCENARIOS.filter((s) => only.includes(s.id)) : SCENARIOS;

const results = [];
for (const s of picked) {
  const user = prompt.buildWeeklyCommentInput(s.data);
  const out = await generate(user);
  const comment = out.comment ?? out.error;
  console.log(
    `\n=== ${s.id}. ${s.name}\n[입력]\n${user}\n[코멘트] (${comment.length}자)\n${comment}`,
  );
  results.push({ id: s.id, name: s.name, input: user, comment, usage: out.usage ?? null });
  await sleep(1500);
}

if (save) {
  const file = new URL("./weekly-comment-results.json", import.meta.url);
  writeFileSync(
    file,
    JSON.stringify({ model: MODEL, generatedAt: new Date().toISOString(), results }, null, 2),
    "utf-8",
  );
  console.log(`\n저장: ${file.pathname}`);
}
