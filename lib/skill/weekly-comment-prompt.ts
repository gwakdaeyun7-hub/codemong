// 주간 성장 리포트 LLM 코멘트 프롬프트 SSOT — 순수 모듈(prisma·서버 전용 import 없음).
// weekly-report-actions.ts(프로덕션)와 scripts/ai-eval/weekly-comment.mjs(시나리오 점검)가
// 같은 파일을 import 하므로 프롬프트 드리프트가 없다. 수정 후엔 `pnpm ai:weekly` 로 전후 비교.
//
// 채점 루브릭(lib/ai/rubric.ts)과 달리 점수를 결정하지 않는다 — 이미 계산된 숫자를
// 학습자에게 읽히는 2~3문장으로 옮기는 저위험 작업이라 회귀 스위트 대신 시나리오 눈검사로 충분.

/** 축 라벨 + 학습자용 뜻 + 약점일 때 권할 행동. 순서는 레이더(PYTHON_SKILL_AXES)와 같다. */
export const WEEKLY_COMMENT_AXES: ReadonlyArray<{
  key: string;
  label: string;
  meaning: string;
  action: string;
}> = [
  {
    key: "syntax",
    label: "구문 정확도",
    meaning: "코드가 문법·실행 오류 없이 돌아간 비율. 100이어도 문제를 다 맞혔다는 뜻은 아님",
    action: "제출 전에 실행 버튼으로 먼저 돌려 보고 오류 메시지를 읽기",
  },
  {
    key: "logic",
    label: "로직 구현도",
    meaning: "테스트 케이스를 통과한 비율",
    action: "예시 입력을 손으로 따라가며 출력을 맞춰 본 뒤 코드로 옮기기",
  },
  {
    key: "concept",
    label: "개념 이해도",
    meaning: "그 단원의 핵심 문법을 제대로 썼는지(AI 진단)",
    action: "그 단원 강의 영상을 다시 보고 연습 문제부터 풀기",
  },
  {
    key: "efficiency",
    label: "코드 효율성",
    meaning: "불필요한 반복·중복·과한 분기가 없는지(AI 진단)",
    action: "같은 계산이 두 번 나오는 곳을 찾아 변수나 반복문으로 합치기",
  },
  {
    key: "interpretation",
    label: "문제 해석력",
    meaning: "출력 형식·경계값·예외 같은 요구사항을 빠뜨리지 않았는지(AI 진단)",
    action: "제출 전에 문제의 출력 형식과 경계값 조건을 하나씩 체크하기",
  },
];

const axisLines = WEEKLY_COMMENT_AXES.map((a) => `  · ${a.label}: ${a.meaning}`).join("\n");
const actionLines = WEEKLY_COMMENT_AXES.map((a) => `  · ${a.label} → ${a.action}`).join("\n");

export const WEEKLY_COMMENT_SYSTEM = `당신은 파이썬 입문 학습 서비스 '코드몽'의 주간 학습 리포트 코멘트를 씁니다. 학습자가 마이페이지에서 지난주 숫자 요약(제출 수·통과율·축별 점수) 아래에 함께 읽는 짧은 글이에요.

[입력 읽는 법]
- "제출"은 실력향상 코드 작성 문제를 제출한 횟수, "통과율"은 그중 테스트를 전부 통과한 비율이에요.
- 축별 점수(0~100)는 누적 점수예요. 입력에 없는 축은 아직 측정되지 않은 것이니 언급하지 않아요. 각 축의 뜻:
${axisLines}
- "전주 대비 변화"는 그 주에 오르내린 폭이에요. "없음"이면 첫 리포트라 비교 대상이 없는 거예요.
- "가장 약한 축"은 서비스가 규칙으로 고른 값이에요. "없음"이면 모든 축 점수가 같아서 약점을 고를 수 없다는 뜻이에요.

[쓰는 법]
- 한국어 2~3문장, 전체 150자 안팎. "~해요/~했어요"체로 학습자에게 직접 말해요. "~하셨습니다/권장합니다/바랍니다" 같은 격식체는 쓰지 않아요.
- 첫 문장: 지난주 사실. 제출 수와 통과율을 있는 그대로 말해요. 통과율이 낮거나 0%여도 감추거나 돌려 말하지 않아요.
- 둘째 문장: 잘한 점 하나. "전주 대비 변화"에서 가장 많이 오른 축이 있으면 그걸, 없으면 점수가 가장 높은 축을 골라요. 점수의 뜻을 넘어서 해석하지 않아요(구문 정확도 100 → "문법 오류 없이 돌았어요"까지만).
- 셋째 문장: 다음 주 할 일 하나. "가장 약한 축"이 있으면 그 축에 맞는 행동을 한 가지만 권해요:
${actionLines}
  "없음"이면 약점을 지어내지 말고, 다음 단원 문제로 넘어가 보라고만 해요.
- 금지: 입력에 없는 사실·숫자·축, 이모지, 과장하는 말(완벽·인상적·우수·탁월·훌륭), "과제·부문·성과·역량" 같은 평가서 어휘, 학습자를 낮잡거나 재촉하는 말.`;

export const WEEKLY_COMMENT_SCHEMA = {
  type: "OBJECT",
  properties: { comment: { type: "STRING" } },
  required: ["comment"],
} as const;

export type WeeklyCommentInput = {
  submissionCount: number;
  passRate: number;
  axisScores: Record<string, number>;
  axisDeltas: Record<string, number>;
  weakestAxis: string | null;
};

const labelOf = (key: string) => WEEKLY_COMMENT_AXES.find((a) => a.key === key)?.label ?? key;

/** 숫자 요약 → user 메시지. 측정된 축만 넣고, 비교 대상·약점이 없으면 "없음"을 명시해 지어내기를 막는다. */
export function buildWeeklyCommentInput(data: WeeklyCommentInput): string {
  const lines = [
    `지난주 실력향상 문제 제출 ${data.submissionCount}회, 통과율 ${data.passRate}%`,
    `축별 점수: ${Object.entries(data.axisScores)
      .map(([k, v]) => `${labelOf(k)} ${v}`)
      .join(", ")}`,
  ];
  const deltas = Object.entries(data.axisDeltas);
  lines.push(
    deltas.length > 0
      ? `전주 대비 변화: ${deltas.map(([k, v]) => `${labelOf(k)} ${v >= 0 ? "+" : ""}${v}`).join(", ")}`
      : "전주 대비 변화: 없음 (첫 리포트)",
  );
  lines.push(
    data.weakestAxis
      ? `가장 약한 축: ${labelOf(data.weakestAxis)}`
      : "가장 약한 축: 없음 (모든 축 동점)",
  );
  return lines.join("\n");
}
