// 성장 레이더(스파이더) 차트용 축·데이터 어댑터.
//
// 축 = "코드 작성 문제"에서 측정 가능한 코드 품질 5축 (팀 확정).
// 차트 컴포넌트(skill-radar-chart)는 N축 동적이라 축 수가 바뀌어도 그대로 그린다.
//
// 단계적 데이터 소스 (MVP):
//  · 결정적 2축 (구문 정확도 / 로직 구현도) — ExerciseAttempt 실집계.
//    실행 엔진(Pyodide) 결과만으로 잴 수 있어 AI 없이 측정한다.
//  · AI 3축 (개념 이해도 / 코드 효율성 / 문제 해석력) — 아직 고정 데모값.
//    Gemini 분류 도입 시 각 axis.measure 공식대로 실집계로 승급한다.
//  · 코호트 평균(averageValue) — 데이터가 적어 노이즈가 크므로 MVP 는 데모 평균 유지.
//  · 사용자의 ExerciseAttempt 가 0건이면 5축 모두 데모값으로 폴백(빈 차트 방지).
//
// ⚠️ AI 3축·전체 평균은 아직 예시값이다 — 카드(growth-report-card)가 이를 명시한다.

import { prisma } from "@/lib/prisma";

export type SkillAxis = {
  key: string;
  label: string;
  /** 이 축을 계산할 proxy(조작적 정의). 측정 주체(결정적/AI)도 함께 적는다. */
  measure: string;
};

// 코드 품질 5축. "나 vs 전체 평균" 으로 비교한다.
// (각 measure = 실데이터로 어떻게 잴지의 조작적 정의 + 측정 주체.)
export const PYTHON_SKILL_AXES: SkillAxis[] = [
  {
    key: "syntax",
    label: "구문 정확도",
    measure:
      "실행 성공(문법/런타임 예외 없이 돈) 제출 비율. " +
      "소스: ExerciseAttempt.hadError 의 false 비율 (결정적 — 지금 측정).",
  },
  {
    key: "logic",
    label: "로직 구현도",
    measure:
      "테스트케이스 통과율 (제출별 통과 케이스 / 전체 케이스 누적). " +
      "소스: ExerciseAttempt.casesPassed / casesTotal (결정적 — 지금 측정).",
  },
  {
    key: "concept",
    label: "개념 이해도",
    measure:
      "문제의 필요 개념(conceptTags)을 올바르게 사용한 비율. " +
      "소스: 제출 코드 AI 분석(Gemini) — 미구현(현재 데모값).",
  },
  {
    key: "efficiency",
    label: "코드 효율성",
    measure:
      "통과 코드의 효율 점수(중복·불필요 연산·복잡도). " +
      "소스: 제출 코드 AI 분석(Gemini) — 미구현(현재 데모값).",
  },
  {
    key: "interpretation",
    label: "문제 해석력",
    measure:
      "첫 시도에 요구사항을 올바른 방향으로 접근한 비율(요구 오해 아님). " +
      "소스: 첫 시도 결과 + 제출 코드 AI 분석(Gemini) — 미구현(현재 데모값).",
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

// 고정 데모 데이터.
//  · user    : ExerciseAttempt 가 없을 때의 폴백 + AI 3축의 현재 표시값.
//  · average : 전체 평균(MVP 전 구간 데모) — 일부 축은 평균 위(강점), 일부는 아래(약점)로 두어
//              "차트가 진단 도구로 동작한다" 를 보여준다.
// AI 3축 실데이터 전환 시 해당 키의 user 값 사용을 멈추고 measure 공식으로 계산한 값으로 대체한다.
const DEMO_VALUES: Record<string, { user: number; average: number }> = {
  syntax: { user: 80, average: 72 }, // 결정적 — attempts 있으면 user 는 실값으로 덮임
  logic: { user: 68, average: 66 }, // 결정적 — attempts 있으면 user 는 실값으로 덮임
  concept: { user: 70, average: 65 }, // AI(데모)
  efficiency: { user: 55, average: 63 }, // AI(데모) — 약점
  interpretation: { user: 73, average: 64 }, // AI(데모)
};

function clampPct(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(100, Math.round(n)));
}

// 성장 레이더 데이터.
//  · 결정적 2축(구문 정확도/로직 구현도)은 사용자의 ExerciseAttempt 로 실집계.
//  · AI 3축·전체 평균은 데모값. 사용자 시도가 0건이면 5축 모두 데모로 폴백.
// MVP 는 단일 코스(Python)라 courseId 로 좁히지 않고 사용자의 전체 시도를 집계한다
// (lessonRef 의 courseId 가 "python"/"be-python" 으로 갈릴 수 있어 prefix 필터는 누락 위험).
// courseId 인자는 코스 분리 시 prefix 필터를 넣을 seam 으로 시그니처에 남겨 둔다.
export async function getSkillRadar(
  courseId: string,
  userId: string | null,
): Promise<RadarPoint[]> {
  void courseId;

  // 사용자의 결정적 2축 실값 (시도가 있을 때만).
  const live: Partial<Record<string, number>> = {};
  if (userId) {
    const attempts = await prisma.exerciseAttempt.findMany({
      where: { userId },
      select: { hadError: true, casesPassed: true, casesTotal: true },
    });
    if (attempts.length > 0) {
      const cleanRuns = attempts.filter((a) => !a.hadError).length;
      live.syntax = clampPct((cleanRuns / attempts.length) * 100);

      let sumPassed = 0;
      let sumTotal = 0;
      for (const a of attempts) {
        sumPassed += a.casesPassed;
        sumTotal += a.casesTotal;
      }
      live.logic = sumTotal > 0 ? clampPct((sumPassed / sumTotal) * 100) : 0;
    }
  }

  return PYTHON_SKILL_AXES.map((axis) => {
    const demo = DEMO_VALUES[axis.key] ?? { user: 0, average: 0 };
    return {
      axisKey: axis.key,
      label: axis.label,
      // 결정적 축은 실값으로 덮고, 없으면(또는 AI 축이면) 데모값.
      userValue: live[axis.key] ?? demo.user,
      averageValue: demo.average,
    };
  });
}
