/**
 * Lesson 6 — 반복문 (`for` / `while` / `break` / `continue`)
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
 * Source data — timestamps.json (12 scenes, last endMs 229200):
 *
 *   i  | sceneId  | startMs | endMs   | from = round(startMs*30/1000)
 *   01 | scene-01 |       0 |  14717  |    0
 *   02 | scene-02 |  14717 |  26873  |  442
 *   03 | scene-03 |  26873 |  47405  |  806
 *   04 | scene-04 |  47405 |  65879  | 1422
 *   05 | scene-05 |  65879 |  93901  | 1976
 *   06 | scene-06 |  93901 | 112614  | 2817
 *   07 | scene-07 | 112614 | 127067  | 3378
 *   08 | scene-08 | 127067 | 152074  | 3812
 *   09 | scene-09 | 152074 | 165810  | 4562
 *   10 | scene-10 | 165810 | 190266  | 4974
 *   11 | scene-11 | 190266 | 206706  | 5708
 *   12 | scene-12 | 206706 | 229200  | 6201
 *   TOTAL                              6876  (= round(229200*30/1000))
 *
 * Durations (adjacent-boundary):
 *   442, 364, 616, 554, 841, 561, 434, 750, 412, 734, 493, 675
 *   Σ = 6876 == TOTAL_DURATION_FRAMES ✓
 *
 * Note: voiceover came in at 229.20s (vs Stage 2 placeholder 180s, +27%).
 * Each scene's frame budget grew proportionally, but scene-internal beat
 * timing (REVEAL.line1 etc.) was authored against the placeholder. The
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
  | "scene-11"
  | "scene-12";

export type SceneTiming = {
  id: SceneId;
  from: number;
  durationInFrames: number;
};

// Derived from timestamps.json last endMs (229200).
export const TOTAL_DURATION_MS = 229_200;
export const TOTAL_DURATION_FRAMES = Math.round((TOTAL_DURATION_MS * FPS) / 1000); // 6876

/**
 * Wired from `02-audio/timestamps.json` (Stage 3).
 * Verified: Σ durationInFrames === TOTAL_DURATION_FRAMES (6876), drift = 0.
 */
export const SCENES: SceneTiming[] = [
  { id: "scene-01", from: 0, durationInFrames: 442 },
  { id: "scene-02", from: 442, durationInFrames: 364 },
  { id: "scene-03", from: 806, durationInFrames: 616 },
  { id: "scene-04", from: 1422, durationInFrames: 554 },
  { id: "scene-05", from: 1976, durationInFrames: 841 },
  { id: "scene-06", from: 2817, durationInFrames: 561 },
  { id: "scene-07", from: 3378, durationInFrames: 434 },
  { id: "scene-08", from: 3812, durationInFrames: 750 },
  { id: "scene-09", from: 4562, durationInFrames: 412 },
  { id: "scene-10", from: 4974, durationInFrames: 734 },
  { id: "scene-11", from: 5708, durationInFrames: 493 },
  { id: "scene-12", from: 6201, durationInFrames: 675 },
];

export const sceneOf = (id: SceneId): SceneTiming => {
  const found = SCENES.find((s) => s.id === id);
  if (!found) throw new Error(`Unknown scene id: ${id}`);
  return found;
};
