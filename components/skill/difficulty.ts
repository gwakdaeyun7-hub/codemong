// 난이도 표기/톤 — 문제 목록·문제 페이지 공용.

import type { ProblemDifficulty } from "@/lib/problems";

export const DIFFICULTY_LABEL: Record<ProblemDifficulty, string> = {
  easy: "하",
  medium: "중",
  hard: "상",
};

export const DIFFICULTY_CHIP_CLASS: Record<ProblemDifficulty, string> = {
  easy: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  medium: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  hard: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
};
