// AI 채점 감사 — 실사용 제출에서 "이상 채점 후보"를 규칙 기반으로 탐지한다.
// 실행: pnpm ai:audit  (기본 최근 14일)
//
// 여기서 걸린 건 "오채점 확정"이 아니라 "사람이 봐야 할 후보"다.
// 후보의 제출 id 를 Claude 에게 주면: 해당 코드로 scripts/ai-eval 하네스 재현 →
// 프롬프트/rubricNote 수정 → 회귀 검증 순서로 처리한다 (자동 수정은 하지 않는다 —
// 규칙 하나가 다른 시나리오를 회귀시킨 전례가 있음).

import { fileURLToPath } from "node:url";
import { config } from "dotenv";
import pg from "pg";

config({ path: fileURLToPath(new URL("../.env.local", import.meta.url)) });

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL 이 .env.local 에 없습니다.");
  process.exit(1);
}
const client = new pg.Client({
  connectionString: url,
  ssl: url.includes("supabase") ? { rejectUnauthorized: false } : undefined,
});
await client.connect();

const DAYS = 14;
const base = `from problem_submissions where "createdAt" >= now() - interval '${DAYS} days'`;

// 1) 프롬프트 규칙 위반: 실행 오류 없이 케이스 실패인데 3축 전부 100 (금지 규칙)
const ruleViolation = await client.query(`
  select id, "lessonRef", "problemId", "casesPassed", "casesTotal",
         "conceptScore", "efficiencyScore", "interpretationScore", "createdAt"
  ${base}
    and "aiStatus" = 'ok' and "hadError" = false and "casesPassed" < "casesTotal"
    and "conceptScore" = 100 and "efficiencyScore" = 100 and "interpretationScore" = 100
  order by "createdAt" desc limit 20
`);

// 2) 정답 유출 의심: 힌트형 피드백에 코드 조각 흔적
const leakSuspect = await client.query(`
  select id, "lessonRef", "problemId", left("aiFeedback", 120) as feedback_head, "createdAt"
  ${base}
    and "aiStatus" = 'ok'
    and ("aiFeedback" like '%\`\`\`%' or "aiFeedback" like '%print(%'
         or "aiFeedback" like '%def %' or "aiFeedback" like '%input()%')
  order by "createdAt" desc limit 20
`);

// 3) 과한 감점 의심: 전 케이스 통과인데 어느 축이 50 미만 (정보성 — 하드코딩 정당 감점일 수도)
const harshSuspect = await client.query(`
  select id, "lessonRef", "problemId",
         "conceptScore", "efficiencyScore", "interpretationScore", "createdAt"
  ${base}
    and "aiStatus" = 'ok' and "passed" = true
    and least("conceptScore", "efficiencyScore", "interpretationScore") < 50
  order by "createdAt" desc limit 20
`);

// 4) AI 실패율 (호출했는데 failed 로 끝난 비율 — 급증 시 모델/스키마/한도 점검)
const failRate = await client.query(`
  select count(*) filter (where "aiStatus" = 'failed') as failed,
         count(*) filter (where "aiStatus" in ('ok','failed')) as called
  ${base}
`);

function section(title, rows, render) {
  console.log(`\n── ${title} (${rows.length}건) ──`);
  if (rows.length === 0) return console.log("없음");
  for (const r of rows) console.log(render(r));
}

console.log(`AI 채점 감사 — 최근 ${DAYS}일`);

section(
  "1. 프롬프트 규칙 위반 후보 (케이스 실패 + 3축 100)",
  ruleViolation.rows,
  (r) =>
    `${r.id}  ${r.lessonRef}/${r.problemId}  ${r.casesPassed}/${r.casesTotal} 통과인데 100/100/100`,
);

section(
  "2. 정답 코드 유출 의심 (피드백에 코드 흔적)",
  leakSuspect.rows,
  (r) => `${r.id}  ${r.lessonRef}/${r.problemId}  "${r.feedback_head}..."`,
);

section(
  "3. 과한 감점 의심 (전부 통과 + 축<50 — 하드코딩 정당 감점일 수 있음)",
  harshSuspect.rows,
  (r) =>
    `${r.id}  ${r.lessonRef}/${r.problemId}  ${r.conceptScore}/${r.efficiencyScore}/${r.interpretationScore}`,
);

const f = failRate.rows[0];
const pct = Number(f.called) > 0 ? ((Number(f.failed) / Number(f.called)) * 100).toFixed(1) : "0.0";
console.log(
  `\n── 4. AI 호출 실패율 ──\n${f.failed}/${f.called} (${pct}%)${Number(pct) > 10 ? "  ⚠ 10% 초과 — 모델/스키마/키 점검 필요" : ""}`,
);

console.log(
  "\n후보가 있으면: 제출 id 를 Claude 에게 전달 → ai-eval 하네스로 재현·분석 → 수정 → 회귀 검증.",
);

await client.end();
