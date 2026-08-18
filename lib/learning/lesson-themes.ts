// 학습 캘린더 문법 테마 — 강 번호를 색 그룹으로 묶는다.
// 캘린더 칸은 "색상 = 무엇을 공부했는가(테마) / 진하기 = 얼마나 깊이 했는가(영상만 vs 문제 통과)" 규칙
// (사용자 확정 2026-07-28). Tailwind 클래스는 동적 생성이 불가하므로 전부 정적 문자열로 적는다.
//
// prisma 를 import 하지 않는 순수 상수 모듈 — 서버(집계)와 클라(캘린더 렌더) 양쪽에서 쓴다.

export type LessonThemeKey = "basics" | "control" | "data" | "advanced";

export type LessonTheme = {
  key: LessonThemeKey;
  label: string;
  /** 이 테마에 속한 강 번호 */
  lessons: number[];
  /** 연한 칸 — 영상만 시청한 날 */
  lightClass: string;
  /** 짙은 칸 — 문제까지 통과한 날 */
  deepClass: string;
  /** 범례·상세의 점 */
  dotClass: string;
};

export const LESSON_THEMES: LessonTheme[] = [
  {
    key: "basics",
    label: "파이썬 기초",
    lessons: [1, 2, 3, 4],
    lightClass: "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200",
    deepClass: "bg-emerald-500 text-white",
    dotClass: "bg-emerald-500",
  },
  {
    key: "control",
    label: "조건문·반복문",
    lessons: [5, 6],
    lightClass: "bg-violet-100 text-violet-800 ring-1 ring-violet-200",
    deepClass: "bg-violet-500 text-white",
    dotClass: "bg-violet-500",
  },
  {
    key: "data",
    label: "리스트·자료구조",
    lessons: [7, 8],
    lightClass: "bg-sky-100 text-sky-800 ring-1 ring-sky-200",
    deepClass: "bg-sky-500 text-white",
    dotClass: "bg-sky-500",
  },
  {
    key: "advanced",
    label: "함수·응용",
    lessons: [9, 10, 11, 12, 13],
    lightClass: "bg-amber-100 text-amber-800 ring-1 ring-amber-200",
    deepClass: "bg-amber-500 text-white",
    dotClass: "bg-amber-500",
  },
];

/** 강 번호 → 테마 (범위 밖이면 null) */
export function themeOfLesson(lessonNumber: number): LessonTheme | null {
  return LESSON_THEMES.find((t) => t.lessons.includes(lessonNumber)) ?? null;
}

export function getTheme(key: string | null | undefined): LessonTheme | null {
  if (!key) return null;
  return LESSON_THEMES.find((t) => t.key === key) ?? null;
}
