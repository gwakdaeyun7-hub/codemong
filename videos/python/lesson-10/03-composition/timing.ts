/**
 * Lesson 10 — 모듈 & 랜덤 (`import` / `random` 활용)
 *
 * Stage 3 — REAL timing wired from `02-audio/timestamps.json`.
 *
 * Per the project_timing_contract memory: voiceover.mp3 + timestamps.json are
 * co-produced by the audio agent, so we use a static SCENES literal with
 * frame-precise boundaries computed via the adjacent-boundary rule:
 *
 *   from_i = round(startMs_i * FPS / 1000)
 *   dur_i  = (i+1 < n ? from_{i+1} : TOTAL) - from_i
 *
 * That yields Σ dur_i == TOTAL_DURATION_FRAMES with 0 frame drift even after
 * rounding (the last boundary acts as the rounding sink).
 *
 * Source data — timestamps.json (11 scenes, last endMs 201936):
 *
 *   i  | sceneId  | startMs | endMs  | from = round(startMs*30/1000)
 *   01 | scene-01 |       0 |  13710 |    0
 *   02 | scene-02 |   13710 |  28663 |  411
 *   03 | scene-03 |   28663 |  43569 |  860
 *   04 | scene-04 |   43569 |  61490 | 1307
 *   05 | scene-05 |   61490 |  77520 | 1845
 *   06 | scene-06 |   77520 |  97570 | 2326
 *   07 | scene-07 |   97570 | 119870 | 2927
 *   08 | scene-08 |  119870 | 137982 | 3596
 *   09 | scene-09 |  137982 | 155184 | 4139
 *   10 | scene-10 |  155184 | 178823 | 4656
 *   11 | scene-11 |  178823 | 201936 | 5365
 *   TOTAL                              6058  (= round(201936*30/1000))
 *
 * Durations (adjacent-boundary):
 *   411, 449, 447, 538, 481, 601, 669, 543, 517, 709, 693
 *   Σ = 6058 == TOTAL_DURATION_FRAMES ✓
 *
 * Note: voiceover came in at 201.936s (vs Stage 2 placeholder 182s, +11%).
 * Each scene's frame budget shifted but scene-internal beat timing
 * (REVEAL.line1 etc.) was authored against the placeholder. Any resulting
 * dead-air at scene tails is left for video-director review per the agent
 * runbook — do not rescale beats here. Scene 08's Active Recall reveal
 * (revealAt) IS retimed in Scene08.tsx via R-004 sub-clip probe.
 *
 * Scene-08 subClip probes (ffprobe):
 *   - a0 (질문 발화) = 10.200s
 *   - s1 (정적)      =  1.829s
 *   - a2 (정답+풀이) =  5.760s
 *   → a2 시작 (scene-08 내부 시각) = 10.200 + 1.829 ≈ 12.03s
 *   → revealAt 12.3s ∈ [12.03, 12.03 + 5.760×0.25] = [12.03, 13.47]  ✓ R-004
 */

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

export type SceneId =
  | "scene-01"
  | "scene-02"
  | "scene-03"
  | "scene-04"
  | "scene-05"
  | "scene-06"
  | "scene-07"
  | "scene-08"
  | "scene-09"
  | "scene-10"
  | "scene-11";

export type SceneTiming = {
  id: SceneId;
  from: number;
  durationInFrames: number;
};

// Derived from timestamps.json last endMs (201936).
export const TOTAL_DURATION_MS = 201_936;
export const TOTAL_DURATION_FRAMES = Math.round((TOTAL_DURATION_MS * FPS) / 1000); // 6058

/**
 * Wired from `02-audio/timestamps.json` (Stage 3).
 * Verified: Σ durationInFrames === TOTAL_DURATION_FRAMES (6058), drift = 0.
 */
export const SCENES: SceneTiming[] = [
  { id: "scene-01", from: 0, durationInFrames: 411 },
  { id: "scene-02", from: 411, durationInFrames: 449 },
  { id: "scene-03", from: 860, durationInFrames: 447 },
  { id: "scene-04", from: 1307, durationInFrames: 538 },
  { id: "scene-05", from: 1845, durationInFrames: 481 },
  { id: "scene-06", from: 2326, durationInFrames: 601 },
  { id: "scene-07", from: 2927, durationInFrames: 669 },
  { id: "scene-08", from: 3596, durationInFrames: 543 },
  { id: "scene-09", from: 4139, durationInFrames: 517 },
  { id: "scene-10", from: 4656, durationInFrames: 709 },
  { id: "scene-11", from: 5365, durationInFrames: 693 },
];

export const sceneOf = (id: SceneId): SceneTiming => {
  const found = SCENES.find((s) => s.id === id);
  if (!found) throw new Error(`Unknown scene id: ${id}`);
  return found;
};
