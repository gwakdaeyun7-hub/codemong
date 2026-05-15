/**
 * Lesson 5 — 조건문 (`if` / `elif` / `else` / 중첩 조건문)
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
 * Source data — timestamps.json (14 scenes, last endMs 208896):
 *
 *   i  | sceneId  | startMs | endMs   | from = round(startMs*30/1000)
 *   01 | scene-01 |       0 |  14513  |    0
 *   02 | scene-02 |  14513 |  21112  |  435
 *   03 | scene-03 |  21112 |  36007  |  633
 *   04 | scene-04 |  36007 |  50473  | 1080
 *   05 | scene-05 |  50473 |  64531  | 1514
 *   06 | scene-06 |  64531 |  80670  | 1936
 *   07 | scene-07 |  80670 |  94131  | 2420
 *   08 | scene-08 |  94131 | 110103  | 2824
 *   09 | scene-09 | 110103 | 127748  | 3303
 *   10 | scene-10 | 127748 | 142715  | 3832
 *   11 | scene-11 | 142715 | 153163  | 4281
 *   12 | scene-12 | 153163 | 169469  | 4595
 *   13 | scene-13 | 169469 | 186063  | 5084
 *   14 | scene-14 | 186063 | 208896  | 5582
 *   TOTAL                              6267  (= round(208896*30/1000))
 *
 * Durations (adjacent-boundary):
 *   435, 198, 447, 434, 422, 484, 404, 479, 529, 449, 314, 489, 498, 685
 *   Σ = 6267 == TOTAL_DURATION_FRAMES ✓
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
  | "scene-12"
  | "scene-13"
  | "scene-14";

export type SceneTiming = {
  id: SceneId;
  from: number;
  durationInFrames: number;
};

// Derived from timestamps.json last endMs (208896).
export const TOTAL_DURATION_MS = 208_896;
export const TOTAL_DURATION_FRAMES = Math.round((TOTAL_DURATION_MS * FPS) / 1000); // 6267

/**
 * Wired from `02-audio/timestamps.json` (Stage 3).
 * Verified: Σ durationInFrames === TOTAL_DURATION_FRAMES (6267), drift = 0.
 */
export const SCENES: SceneTiming[] = [
  { id: "scene-01", from: 0, durationInFrames: 435 },
  { id: "scene-02", from: 435, durationInFrames: 198 },
  { id: "scene-03", from: 633, durationInFrames: 447 },
  { id: "scene-04", from: 1080, durationInFrames: 434 },
  { id: "scene-05", from: 1514, durationInFrames: 422 },
  { id: "scene-06", from: 1936, durationInFrames: 484 },
  { id: "scene-07", from: 2420, durationInFrames: 404 },
  { id: "scene-08", from: 2824, durationInFrames: 479 },
  { id: "scene-09", from: 3303, durationInFrames: 529 },
  { id: "scene-10", from: 3832, durationInFrames: 449 },
  { id: "scene-11", from: 4281, durationInFrames: 314 },
  { id: "scene-12", from: 4595, durationInFrames: 489 },
  { id: "scene-13", from: 5084, durationInFrames: 498 },
  { id: "scene-14", from: 5582, durationInFrames: 685 },
];

export const sceneOf = (id: SceneId): SceneTiming => {
  const found = SCENES.find((s) => s.id === id);
  if (!found) throw new Error(`Unknown scene id: ${id}`);
  return found;
};
