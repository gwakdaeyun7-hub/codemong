// 성장 레이더(스파이더) 차트용 축·데이터 어댑터.
//
// 단계적 설계: 축(지표)과 차트 컴포넌트는 고정하고 "값 계산 소스"만 교체한다.
//  · 지금          — 고정 데모 데이터 (DEMO_VALUES). 코드 구현 문제·퀴즈가
//                    충분히 쌓이기 전까지 발표/미리보기용 정적값.
//  · 실데이터 전환 시 — getSkillRadar 내부만 각 SkillAxis.measure 공식대로
//                    실집계(사용자 값 + 코호트 평균)로 교체하면, 같은 6축·
//                    같은 차트가 그대로 "실측 역량 레이더" 로 승급한다.
//
// ⚠️ 현재 표시값은 실제 측정값이 아니라 예시(고정 데모)다.
//    카드(growth-report-card)가 "표시값은 예시" 임을 사용자에게 명시한다.

export type SkillAxis = {
  key: string;
  label: string;
  /** 실데이터 전환 시 이 축을 계산할 proxy(조작적 정의). 현재는 문서용. */
  measure: string;
};

// 코딩 역량 인지형 6축. "나 vs 전체 평균" 으로 비교한다.
// 데이터 소스가 고정값→실측으로 바뀌어도 이 축 정의는 그대로 유지한다.
// (각 measure = 나중에 실데이터로 어떻게 잴지의 조작적 정의 + 소스.)
export const PYTHON_SKILL_AXES: SkillAxis[] = [
  {
    key: "comprehension",
    label: "이해도",
    measure:
      "평가 퀴즈 정답률 — 특히 같은 학습목표를 다른 형태로 물은 isomorph 변형까지 맞힌 전이율(암기와 구분). " +
      "소스: LessonProgress.quizBestScore + quiz-content 의 isomorphGroup (문항·컬럼은 있고 화면/채점 미구현).",
  },
  {
    key: "logic",
    label: "논리성",
    measure:
      "제출 실패 중 논리오류(런타임은 정상인데 결과가 틀림: 잘못된 조건·연산자·off-by-one) 대비 표면오류(문법/오타) 비율의 역수. " +
      "소스: 시도별 에러 분류 로그 (미구현 — 추후 ExerciseAttempt).",
  },
  {
    key: "application",
    label: "응용력",
    measure:
      "quiz scope:'applied' 문항 + 여러 개념을 합쳐야 풀리는 복합개념 코드문제 통과율 (단원 내 드릴과 분리). " +
      "소스: quiz-content 의 scope + Exercise.conceptTags 다중.",
  },
  {
    key: "implementation",
    label: "구현력",
    measure:
      "코드 구현 문제 통과 비율 (전체 시도 가능 문제 대비 통과 수). " +
      "소스: ExerciseProgress.passed + ProjectProgress.completedAt (지금도 측정 가능).",
  },
  {
    key: "accuracy",
    label: "정확성",
    measure:
      "첫 시도 통과율 (제출 1회차에 정답이 된 문제 비율). " +
      "소스: 시도 로그 (미구현 — 추후 ExerciseAttempt.attemptNumber).",
  },
  {
    key: "consistency",
    label: "꾸준함",
    measure:
      "주간 학습 활동일 (최근 N주간 고유 학습일 수). " +
      "소스: LessonProgress/ProjectProgress/ExerciseProgress 의 updatedAt 집계 (지금도 측정 가능).",
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

// 발표용 고정 데모 데이터 (현실적 강약 프로파일).
// 일부 축은 평균 위(강점), 일부는 아래(약점)로 두어 "차트가 진단 도구로 동작한다" 를 보여준다.
// 서사: 성실하고(꾸준함) 이해·구현은 평균 이상이나, 새 맥락 응용·논리 설계는 아직 평균 미만.
// 발표 직전 미세조정은 이 맵 한 곳만 고치면 된다.
// 실데이터 전환 시 이 맵을 제거하고 각 SkillAxis.measure 공식으로 계산한 값으로 대체한다.
const DEMO_VALUES: Record<string, { user: number; average: number }> = {
  comprehension: { user: 82, average: 70 }, // 강점
  logic: { user: 64, average: 67 }, // 약점 (평균 약간 아래)
  application: { user: 58, average: 63 }, // 약점 (최저)
  implementation: { user: 76, average: 68 }, // 강점
  accuracy: { user: 71, average: 61 },
  consistency: { user: 88, average: 72 }, // 최강점
};

// 성장 레이더 데이터.
export async function getSkillRadar(
  courseId: string,
  userId: string | null,
): Promise<RadarPoint[]> {
  // 발표 단계: 고정 데모 데이터.
  // 실데이터 전환 시: DEMO_VALUES 대신 (courseId, userId) 로 사용자 값을,
  //   Prisma groupBy/_avg 로 코호트 평균을, 각 axis.measure 공식대로 계산한다.
  // (params 는 그 seam 을 위해 시그니처에 남겨 둔다 — 호출처 무변경.)
  void courseId;
  void userId;
  return PYTHON_SKILL_AXES.map((axis) => {
    const v = DEMO_VALUES[axis.key] ?? { user: 0, average: 0 };
    return {
      axisKey: axis.key,
      label: axis.label,
      userValue: v.user,
      averageValue: v.average,
    };
  });
}
