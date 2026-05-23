/**
 * Lesson 9 — 함수 (`def` / 매개변수 / `return` / 지역·전역 변수)
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
 * Source data — timestamps.json (11 scenes, last endMs 203616):
 *
 *   i  | sceneId  | startMs | endMs   | from = round(startMs*30/1000)
 *   01 | scene-01 |       0 |  14118 |    0
 *   02 | scene-02 |  14118 |  26179 |  424
 *   03 | scene-03 |  26179 |  47141 |  785
 *   04 | scene-04 |  47141 |  60278 | 1414
 *   05 | scene-05 |  60278 |  80283 | 1808
 *   06 | scene-06 |  80283 |  97321 | 2408
 *   07 | scene-07 |  97321 | 112301 | 2920
 *   08 | scene-08 | 112301 | 144247 | 3369
 *   09 | scene-09 | 144247 | 162409 | 4327
 *   10 | scene-10 | 162409 | 176863 | 4872
 *   11 | scene-11 | 176863 | 203616 | 5306
 *   TOTAL                              6108  (= round(203616*30/1000))
 *
 * Durations (adjacent-boundary):
 *   424, 361, 629, 394, 600, 512, 449, 958, 545, 434, 802
 *   Σ = 6108 == TOTAL_DURATION_FRAMES ✓
 *
 * Note: voiceover came in at 203.616s (vs Stage 2 placeholder 180s, +13%).
 * Each scene's frame budget grew/shrank vs the placeholder, but scene-internal
 * beat timing (REVEAL.line1 etc.) was authored against the placeholder. The
 * resulting dead-air at scene tails is deliberately left for video-director
 * review per the agent runbook — do not rescale beats here.
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

// Derived from timestamps.json last endMs (203616).
export const TOTAL_DURATION_MS = 203_616;
export const TOTAL_DURATION_FRAMES = Math.round((TOTAL_DURATION_MS * FPS) / 1000); // 6108

/**
 * Wired from `02-audio/timestamps.json` (Stage 3).
 * Verified: Σ durationInFrames === TOTAL_DURATION_FRAMES (6108), drift = 0.
 */
export const SCENES: SceneTiming[] = [
  { id: "scene-01", from: 0, durationInFrames: 424 },
  { id: "scene-02", from: 424, durationInFrames: 361 },
  { id: "scene-03", from: 785, durationInFrames: 629 },
  { id: "scene-04", from: 1414, durationInFrames: 394 },
  { id: "scene-05", from: 1808, durationInFrames: 600 },
  { id: "scene-06", from: 2408, durationInFrames: 512 },
  { id: "scene-07", from: 2920, durationInFrames: 449 },
  { id: "scene-08", from: 3369, durationInFrames: 958 },
  { id: "scene-09", from: 4327, durationInFrames: 545 },
  { id: "scene-10", from: 4872, durationInFrames: 434 },
  { id: "scene-11", from: 5306, durationInFrames: 802 },
];

export const sceneOf = (id: SceneId): SceneTiming => {
  const found = SCENES.find((s) => s.id === id);
  if (!found) throw new Error(`Unknown scene id: ${id}`);
  return found;
};
