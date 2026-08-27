// 성장 레이더(스파이더) 차트용 축·데이터 어댑터.
//
// 축 = "코드 작성 문제"에서 측정 가능한 코드 품질 5축 (팀 확정).
// 차트 컴포넌트(skill-radar-chart)는 N축 동적이라 축 수가 바뀌어도 그대로 그린다.
//
// 데이터 소스 (D단계 실측 승급 완료):
//  · 결정적 2축 (구문 정확도 / 로직 구현도) — ExerciseAttempt(연습) + ProblemSubmission(시험) 실집계.
//  · AI 3축 (개념 이해도 / 코드 효율성 / 문제 해석력) — ProblemSubmission 의 Gemini 3축 점수 실집계.
//  · 코호트 평균(averageValue) — 전 유저 실집계 + unstable_cache(5m). 표본 부족 시 데모 평균 유지.
//
// ⚠️ 집계 규칙 (사용자 확정 — 반복 제출로 평균을 부풀릴 수 없게):
//  · 같은 문제/연습에 여러 번 제출해도 **문제당 최신 1건만** 반영한다 (다시 풀면 최신 기준 갱신).
//  · AI 3축은 문제당 "최신 ok(채점 성공)" 제출 1건.
//  · 난이도 가중치는 MVP 미적용.
// 데이터가 없는 축은 데모값으로 폴백한다 (빈 차트 방지 — 어떤 축이 실측인지는 meta 로 내려
// growth-report-card 가 카피에 반영).

import { unstable_cache } from "next/cache";

import { prisma } from "@/lib/prisma";

export type SkillAxis = {
  key: string;
  label: string;
  /** 이 축을 계산할 proxy(조작적 정의). 측정 주체(결정적/AI)도 함께 적는다. */
  measure: string;
};

// 코드 품질 5축. "나 vs 전체 평균" 으로 비교한다.
export const PYTHON_SKILL_AXES: SkillAxis[] = [
  {
    key: "syntax",
    label: "구문 정확도",
    measure:
      "실행 성공(문법/런타임 예외 없이 돈) 비율 — 문제당 최신 제출 기준. " +
      "소스: ExerciseAttempt + ProblemSubmission 의 hadError=false 비율 (결정적).",
  },
  {
    key: "logic",
    label: "로직 구현도",
    measure:
      "테스트케이스 통과율 (문제당 최신 제출의 통과 케이스 합 / 전체 케이스 합). " +
      "소스: ExerciseAttempt + ProblemSubmission 의 casesPassed/casesTotal (결정적).",
  },
  {
    key: "concept",
    label: "개념 이해도",
    measure:
      "문제의 핵심 개념을 올바르게 활용했는지의 AI 루브릭 점수 평균 — 문제당 최신 채점 1건. " +
      "소스: ProblemSubmission.conceptScore (Gemini, aiStatus=ok).",
  },
  {
    key: "efficiency",
    label: "코드 효율성",
    measure:
      "중복·불필요 연산·과잉 분기에 대한 AI 루브릭 점수 평균 — 문제당 최신 채점 1건. " +
      "소스: ProblemSubmission.efficiencyScore (Gemini, aiStatus=ok).",
  },
  {
    key: "interpretation",
    label: "문제 해석력",
    measure:
      "요구사항(출력 형식·경계·예외)을 반영했는지의 AI 루브릭 점수 평균 — 문제당 최신 채점 1건. " +
      "소스: ProblemSubmission.interpretationScore (Gemini, aiStatus=ok).",
  },
];

export type RadarPoint = {
  axisKey: string;
  label: string;
  /** 0..100 — 사용자 값 */
  userValue: number;
  /** 0..100 — 전체(코호트) 평균 */
  averageValue: number;
};

export type SkillRadarMeta = {
  /** 결정적 2축(구문/로직)이 실측인지 (사용자 제출 표본 유무) */
  deterministicLive: boolean;
  /** AI 3축(개념/효율/해석)이 실측인지 */
  aiLive: boolean;
  /** 전체 평균이 실집계인지 (표본 충분) — false 면 데모 평균 */
  averageLive: boolean;
};

// 고정 데모 데이터 — 데이터가 없을 때의 폴백 (빈 차트 방지).
const DEMO_VALUES: Record<string, { user: number; average: number }> = {
  syntax: { user: 80, average: 72 },
  logic: { user: 68, average: 66 },
  concept: { user: 70, average: 65 },
  efficiency: { user: 55, average: 63 },
  interpretation: { user: 73, average: 64 },
};

// 코호트 평균을 실집계로 노출할 최소 표본 (미만이면 데모 평균 — 소수 인원 노이즈 방지).
// 유저 1명뿐이면 평균=본인 점수라 두 곡선이 겹치므로 최소 2명은 유지한다.
const MIN_COHORT_USERS = 2;
const MIN_COHORT_SAMPLES = 5;

function clampPct(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(100, Math.round(n)));
}

/** createdAt 내림차순 정렬 목록에서 key 별 첫 행(=최신)만 남긴다 */
function dedupeLatest<T>(rows: T[], keyOf: (row: T) => string): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const row of rows) {
    const key = keyOf(row);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(row);
  }
  return out;
}

type DetSample = { hadError: boolean; casesPassed: number; casesTotal: number };
type AiSample = { conceptScore: number; efficiencyScore: number; interpretationScore: number };

type RadarStats = {
  detSamples: number;
  syntax: number | null;
  logic: number | null;
  aiSamples: number;
  concept: number | null;
  efficiency: number | null;
  interpretation: number | null;
};

function summarize(det: DetSample[], ai: AiSample[]): RadarStats {
  const stats: RadarStats = {
    detSamples: det.length,
    syntax: null,
    logic: null,
    aiSamples: ai.length,
    concept: null,
    efficiency: null,
    interpretation: null,
  };
  if (det.length > 0) {
    const clean = det.filter((d) => !d.hadError).length;
    stats.syntax = clampPct((clean / det.length) * 100);
    let sumPassed = 0;
    let sumTotal = 0;
    for (const d of det) {
      sumPassed += d.casesPassed;
      sumTotal += d.casesTotal;
    }
    stats.logic = sumTotal > 0 ? clampPct((sumPassed / sumTotal) * 100) : 0;
  }
  if (ai.length > 0) {
    const avg = (pick: (s: AiSample) => number) =>
      clampPct(ai.reduce((acc, s) => acc + pick(s), 0) / ai.length);
    stats.concept = avg((s) => s.conceptScore);
    stats.efficiency = avg((s) => s.efficiencyScore);
    stats.interpretation = avg((s) => s.interpretationScore);
  }
  return stats;
}

// 한 사용자(또는 전 유저)의 표본 수집 — 문제/연습당 최신 1건 규칙.
// userId 를 안 주면 전 유저(코호트)를 모으고, 이때 dedupe 키에 userId 를 포함해
// "유저별 문제당 최신 1건" 이 된다.
async function collectSamples(
  userId: string | null,
  lessonRef: string | null,
): Promise<{ det: DetSample[]; ai: AiSample[]; users: Set<string> }> {
  const whereUser = userId ? { userId } : {};
  const whereRef = lessonRef ? { lessonRef } : {};

  const [attempts, submissions] = await Promise.all([
    prisma.exerciseAttempt.findMany({
      where: { ...whereUser, ...whereRef },
      orderBy: { createdAt: "desc" },
      select: {
        userId: true,
        lessonRef: true,
        exerciseId: true,
        hadError: true,
        casesPassed: true,
        casesTotal: true,
      },
    }),
    prisma.problemSubmission.findMany({
      where: { ...whereUser, ...whereRef },
      orderBy: { createdAt: "desc" },
      select: {
        userId: true,
        lessonRef: true,
        problemId: true,
        hadError: true,
        casesPassed: true,
        casesTotal: true,
        aiStatus: true,
        conceptScore: true,
        efficiencyScore: true,
        interpretationScore: true,
      },
    }),
  ]);

  // 빈 제출(skipped_empty)은 표본에서 제외 — "코드 없음 = 오류 없음/비효율 없음" 같은
  // 무의미한 만점 표본이 구문·효율 축을 오염시키는 것 방지.
  const meaningful = submissions.filter((s) => s.aiStatus !== "skipped_empty");

  const latestAttempts = dedupeLatest(
    attempts,
    (a) => `${a.userId}|${a.lessonRef}|${a.exerciseId}`,
  );
  const latestSubmissions = dedupeLatest(
    meaningful,
    (s) => `${s.userId}|${s.lessonRef}|${s.problemId}`,
  );
  // AI 축은 채점 성공(ok) 제출만 대상 — 문제당 "최신 ok" 1건.
  const latestOkSubmissions = dedupeLatest(
    meaningful.filter(
      (s) =>
        s.aiStatus === "ok" &&
        s.conceptScore !== null &&
        s.efficiencyScore !== null &&
        s.interpretationScore !== null,
    ),
    (s) => `${s.userId}|${s.lessonRef}|${s.problemId}`,
  );

  const users = new Set<string>();
  for (const a of latestAttempts) users.add(a.userId);
  for (const s of latestSubmissions) users.add(s.userId);

  return {
    det: [...latestAttempts, ...latestSubmissions],
    ai: latestOkSubmissions.map((s) => ({
      conceptScore: s.conceptScore as number,
      efficiencyScore: s.efficiencyScore as number,
      interpretationScore: s.interpretationScore as number,
    })),
    users,
  };
}

// 코호트(전 유저) 통계 — 5분 캐시. lessonRef=null 이면 전체.
const getCohortStats = unstable_cache(
  async (lessonRef: string | null) => {
    const { det, ai, users } = await collectSamples(null, lessonRef);
    const stats = summarize(det, ai);
    return { stats, userCount: users.size };
  },
  ["skill-radar-cohort-v1"],
  { revalidate: 300 },
);

function buildPoints(
  user: RadarStats | null,
  cohort: { stats: RadarStats; userCount: number },
): { points: RadarPoint[]; meta: SkillRadarMeta } {
  const cohortDetLive =
    cohort.userCount >= MIN_COHORT_USERS && cohort.stats.detSamples >= MIN_COHORT_SAMPLES;
  const cohortAiLive =
    cohort.userCount >= MIN_COHORT_USERS && cohort.stats.aiSamples >= MIN_COHORT_SAMPLES;

  const isAiAxis = (key: string) =>
    key === "concept" || key === "efficiency" || key === "interpretation";

  const points = PYTHON_SKILL_AXES.map((axis) => {
    const demo = DEMO_VALUES[axis.key] ?? { user: 0, average: 0 };
    const liveUser = user ? (user[axis.key as keyof RadarStats] as number | null) : null;
    const cohortValue = cohort.stats[axis.key as keyof RadarStats] as number | null;
    const cohortLive = isAiAxis(axis.key) ? cohortAiLive : cohortDetLive;
    return {
      axisKey: axis.key,
      label: axis.label,
      userValue: liveUser ?? demo.user,
      averageValue: cohortLive && cohortValue !== null ? cohortValue : demo.average,
    };
  });

  const meta: SkillRadarMeta = {
    deterministicLive: user !== null && user.detSamples > 0,
    aiLive: user !== null && user.aiSamples > 0,
    averageLive: cohortDetLive || cohortAiLive,
  };
  return { points, meta };
}

/**
 * 종합 성장 레이더 + 실측 여부 meta.
 * MVP 는 단일 코스(Python)라 courseId 로 좁히지 않는다 (lessonRef 의 courseId 가
 * "python"/"be-python" 으로 갈릴 수 있어 prefix 필터는 누락 위험 — 코스 분리 시 seam).
 */
export async function getSkillRadarDetail(
  courseId: string,
  userId: string | null,
): Promise<{ points: RadarPoint[]; meta: SkillRadarMeta }> {
  void courseId;
  const [userStats, cohort] = await Promise.all([
    userId
      ? collectSamples(userId, null).then(({ det, ai }) => summarize(det, ai))
      : Promise.resolve(null),
    getCohortStats(null),
  ]);
  return buildPoints(userStats, cohort);
}

/** 기존 시그니처 유지 wrapper — 차트만 필요할 때 */
export async function getSkillRadar(
  courseId: string,
  userId: string | null,
): Promise<RadarPoint[]> {
  return (await getSkillRadarDetail(courseId, userId)).points;
}

/**
 * 단원별 레이더 — 해당 단원(lessonRef = "be-python/<lessonId>") 표본만.
 * 사용자 표본이 하나도 없으면 null (페이지가 placeholder 를 보여준다).
 */
export async function getLessonSkillRadar(
  courseId: string,
  lessonId: string,
  userId: string | null,
): Promise<{ points: RadarPoint[]; meta: SkillRadarMeta } | null> {
  void courseId;
  if (!userId) return null;
  const lessonRef = `be-python/${lessonId}`;
  const [userStats, cohort] = await Promise.all([
    collectSamples(userId, lessonRef).then(({ det, ai }) => summarize(det, ai)),
    getCohortStats(lessonRef),
  ]);
  if (userStats.detSamples === 0 && userStats.aiSamples === 0) return null;
  return buildPoints(userStats, cohort);
}
