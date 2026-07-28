// AI 토큰 사용량·예상 비용 리포트 — problem_submissions 의 promptTokens/outputTokens 집계.
// 실행: pnpm ai:usage  (DB 는 .env.local 의 DATABASE_URL — Supabase 프로젝트가 pause 면 실패)
//
// 무료 티어에서도 usageMetadata 는 응답에 포함되므로 로깅은 항상 동작한다.
// "예상 비용"은 유료 전환 시 나갔을 금액의 추정치 — 무료 티어에서는 실제 청구 0원.

import { fileURLToPath } from "node:url";
import { config } from "dotenv";
import pg from "pg";

config({ path: fileURLToPath(new URL("../.env.local", import.meta.url)) });

// 단가 (1M 토큰당 USD) — 모델 바꾸면 여기 갱신. 환율은 대략치.
const INPUT_USD_PER_M = 0.25; // gemini-3.1-flash-lite
const OUTPUT_USD_PER_M = 1.5;
const KRW_PER_USD = 1380;

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

function cost(promptTokens, outputTokens) {
  const usd = (promptTokens / 1e6) * INPUT_USD_PER_M + (outputTokens / 1e6) * OUTPUT_USD_PER_M;
  return usd * KRW_PER_USD;
}

// 일별 (KST, 최근 30일)
const daily = await client.query(`
  select to_char(("createdAt" + interval '9 hours')::date, 'YYYY-MM-DD') as kst_day,
         count(*) as submissions,
         count(*) filter (where "aiStatus" = 'ok') as ai_ok,
         count(*) filter (where "aiStatus" = 'failed') as ai_failed,
         count(*) filter (where "aiStatus"::text like 'skipped%') as ai_skipped,
         coalesce(sum("promptTokens"), 0) as prompt_tokens,
         coalesce(sum("outputTokens"), 0) as output_tokens
  from problem_submissions
  where "createdAt" >= now() - interval '30 days'
  group by 1 order by 1 desc
`);

console.log("── 일별 (KST, 최근 30일) ──");
console.log("날짜        제출  AI성공 실패 스킵   입력토큰   출력토큰   예상비용");
for (const r of daily.rows) {
  const won = cost(Number(r.prompt_tokens), Number(r.output_tokens));
  console.log(
    `${r.kst_day}  ${String(r.submissions).padStart(4)}  ${String(r.ai_ok).padStart(5)} ${String(r.ai_failed).padStart(4)} ${String(r.ai_skipped).padStart(4)}  ${String(r.prompt_tokens).padStart(9)}  ${String(r.output_tokens).padStart(9)}   ${won.toFixed(1)}원`,
  );
}

// 이번 달 (KST) 합계
const month = await client.query(`
  select count(*) filter (where "aiStatus" in ('ok','failed')) as ai_calls,
         coalesce(sum("promptTokens"), 0) as prompt_tokens,
         coalesce(sum("outputTokens"), 0) as output_tokens
  from problem_submissions
  where date_trunc('month', "createdAt" + interval '9 hours')
        = date_trunc('month', now() + interval '9 hours')
`);
const m = month.rows[0];
const monthWon = cost(Number(m.prompt_tokens), Number(m.output_tokens));
console.log("\n── 이번 달 (KST) 합계 ──");
console.log(`AI 호출 ${m.ai_calls}회, 입력 ${m.prompt_tokens} + 출력 ${m.output_tokens} 토큰`);
console.log(
  `예상 비용 약 ${monthWon.toFixed(0)}원 (${INPUT_USD_PER_M}/${OUTPUT_USD_PER_M} USD per 1M, 1 USD=${KRW_PER_USD}원 가정 — 무료 티어는 실청구 0원)`,
);

await client.end();
