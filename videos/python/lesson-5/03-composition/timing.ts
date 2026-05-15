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
 * Source data — timestamps.json (14 scenes, last endMs 209832):
 *
 *   i  | sceneId  | startMs | endMs   | from = round(startMs*30/1000)
 *   01 | scene-01 |       0 |  14513  |    0
 *   02 | scene-02 |  14513 |  22045  |  435
 *   03 | scene-03 |  22045 |  36941  |  661
 *   04 | scene-04 |  36941 |  51406  | 1108
 *   05 | scene-05 |  51406 |  65465  | 1542
 *   06 | scene-06 |  65465 |  81604  | 1964
 *   07 | scene-07 |  81604 |  95065  | 2448
 *   08 | scene-08 |  95065 | 111037  | 2852
 *   09 | scene-09 | 111037 | 128682  | 3331
 *   10 | scene-10 | 128682 | 143650  | 3860
 *   11 | scene-11 | 143650 | 154098  | 4310
 *   12 | scene-12 | 154098 | 170405  | 4623
 *   13 | scene-13 | 170405 | 186998  | 5112
 *   14 | scene-14 | 186998 | 209832  | 5610
 *   TOTAL                              6295  (= round(209832*30/1000))
 *
 * Durations (adjacent-boundary):
 *   435, 226, 447, 434, 422, 484, 404, 479, 529, 450, 313, 489, 498, 685
 *   Σ = 6295 == TOTAL_DURATION_FRAMES ✓
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

// Derived from timestamps.json last endMs (209832).
export const TOTAL_DURATION_MS = 209_832;
export const TOTAL_DURATION_FRAMES = Math.round((TOTAL_DURATION_MS * FPS) / 1000); // 6295

/**
 * Wired from `02-audio/timestamps.json` (Stage 3).
 * Verified: Σ durationInFrames === TOTAL_DURATION_FRAMES (6295), drift = 0.
 */
export const SCENES: SceneTiming[] = [
  { id: "scene-01", from: 0, durationInFrames: 435 },
  { id: "scene-02", from: 435, durationInFrames: 226 },
  { id: "scene-03", from: 661, durationInFrames: 447 },
  { id: "scene-04", from: 1108, durationInFrames: 434 },
  { id: "scene-05", from: 1542, durationInFrames: 422 },
  { id: "scene-06", from: 1964, durationInFrames: 484 },
  { id: "scene-07", from: 2448, durationInFrames: 404 },
  { id: "scene-08", from: 2852, durationInFrames: 479 },
  { id: "scene-09", from: 3331, durationInFrames: 529 },
  { id: "scene-10", from: 3860, durationInFrames: 450 },
  { id: "scene-11", from: 4310, durationInFrames: 313 },
  { id: "scene-12", from: 4623, durationInFrames: 489 },
  { id: "scene-13", from: 5112, durationInFrames: 498 },
  { id: "scene-14", from: 5610, durationInFrames: 685 },
];

export const sceneOf = (id: SceneId): SceneTiming => {
  const found = SCENES.find((s) => s.id === id);
  if (!found) throw new Error(`Unknown scene id: ${id}`);
  return found;
};
