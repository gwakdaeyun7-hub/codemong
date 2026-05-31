import { getCourseLessonStatuses } from "@/lib/learning/progress-queries";
import type { LessonStatus } from "@/lib/lesson-plan";

// 성장 레이더(스파이더) 차트용 축·데이터 어댑터.
//
// 단계적 설계: 축(영역)과 차트 컴포넌트는 고정하고 "값 계산 소스"만 교체한다.
//  · 지금          — getCourseLessonStatuses (이수율: 강의 완료 여부) 를 영역별로 평균.
//  · 이해도 구축 시 — 같은 시그니처의 getMasteryByLesson(quizBestScore 기반) 으로
//                     소스만 교체하면 같은 축·같은 차트가 "이해도 레이더" 로 승급한다.
//
// ⚠️ 이 차트는 현재 "이해" 가 아니라 "영역별 학습 진행(이수율)" 을 보여준다.
//    (이해도 2층 = 퀴즈 채점은 아직 미구현 — quizPassedAt/quizBestScore 미기록.)

export type SkillAxis = {
  key: string;
  label: string;
  /** 이 영역에 속하는 lessonId 들 (lesson-plan 기준) */
  lessonIds: string[];
};

// 파이썬 12·13강을 커리큘럼 순서대로 5개 영역으로 묶음.
// 데이터 소스가 이수율→이해도로 바뀌어도 이 축 정의는 그대로 유지한다.
export const PYTHON_SKILL_AXES: SkillAxis[] = [
  { key: "foundations", label: "환경·기초", lessonIds: ["lesson-1", "lesson-2", "lesson-3"] },
  { key: "control", label: "제어 흐름", lessonIds: ["lesson-4", "lesson-5", "lesson-6"] },
  { key: "data", label: "자료구조", lessonIds: ["lesson-7", "lesson-8"] },
  { key: "abstraction", label: "함수·추상화", lessonIds: ["lesson-9", "lesson-10"] },
  { key: "integration", label: "실전·종합", lessonIds: ["lesson-11", "lesson-12", "lesson-13"] },
];

export type RadarPoint = {
  axisKey: string;
  label: string;
  /** 0..100 — 사용자 값 (현재: 영역 이수율) */
  userValue: number;
  /** 0..100 — 기준 곡선 (현재: 설계된 임시값, 데이터 쌓이면 실제 평균으로 교체) */
  baselineValue: number;
};

// 기준 곡선(임시) — "평균 사용자" 자리를 채우는 설계값.
// 코스를 따라가는 학습자의 전형적 frontier(앞 영역 높고 뒤 영역 낮음) 를 illustrative 로 깔아둠.
// 사용자 표본이 충분해지면 getAverageSkillRadar()(Prisma groupBy/_avg) 로 교체한다.
const BASELINE_CURVE: Record<string, number> = {
  foundations: 80,
  control: 65,
  data: 50,
  abstraction: 35,
  integration: 20,
};

// LessonStatus → 0..100 점수. (completed=100, in-progress=50, not-started=0)
function statusScore(status: LessonStatus | undefined): number {
  if (status === "completed") return 100;
  if (status === "in-progress") return 50;
  return 0;
}

// 영역(축)에 속한 강의들의 평균 점수.
function avgGroupScore(
  lessonIds: string[],
  statuses: Record<string, LessonStatus>,
): number {
  if (lessonIds.length === 0) return 0;
  const sum = lessonIds.reduce((acc, id) => acc + statusScore(statuses[id]), 0);
  return Math.round(sum / lessonIds.length);
}

// 성장 레이더 데이터. 비로그인이면 userValue 전부 0(중심으로 수렴).
export async function getSkillRadar(
  courseId: string,
  userId: string | null,
): Promise<RadarPoint[]> {
  // 현재 소스 = 이수율. (훗날 getMasteryByLesson 으로 교체할 seam.)
  const statuses = await getCourseLessonStatuses(courseId, userId);
  return PYTHON_SKILL_AXES.map((axis) => ({
    axisKey: axis.key,
    label: axis.label,
    userValue: avgGroupScore(axis.lessonIds, statuses),
    baselineValue: BASELINE_CURVE[axis.key] ?? 0,
  }));
}
