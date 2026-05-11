/**
 * Lesson 3 — 변수와 자료형 (변수 / 숫자·문자열·불린 / `print()`)
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
 * Source data — timestamps.json (13 scenes, last endMs 215904):
 *
 *   i  | sceneId  | startMs | endMs   | from = round(startMs*30/1000)
 *   01 | scene-01 |       0 |  15524  |    0
 *   02 | scene-02 |  15524 |  25308  |  466
 *   03 | scene-03 |  25308 |  41310  |  759
 *   04 | scene-04 |  41310 |  59681  | 1239
 *   05 | scene-05 |  59681 |  77789  | 1790
 *   06 | scene-06 |  77789 |  96207  | 2334
 *   07 | scene-07 |  96207 | 110679  | 2886
 *   08 | scene-08 | 110679 | 125103  | 3320
 *   09 | scene-09 | 125103 | 148473  | 3753
 *   10 | scene-10 | 148473 | 167944  | 4454
 *   11 | scene-11 | 167944 | 183540  | 5038
 *   12 | scene-12 | 183540 | 199662  | 5506
 *   13 | scene-13 | 199662 | 215904  | 5990
 *   TOTAL                              6477  (= round(215904*30/1000))
 *
 * Durations (adjacent-boundary):
 *   466, 293, 480, 551, 544, 552, 434, 433, 701, 584, 468, 484, 487
 *   Σ = 6477 == TOTAL_DURATION_FRAMES ✓
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
  | "scene-13";

export type SceneTiming = {
  id: SceneId;
  from: number;
  durationInFrames: number;
};

// Derived from timestamps.json last endMs (215904).
export const TOTAL_DURATION_MS = 215_904;
export const TOTAL_DURATION_FRAMES = Math.round((TOTAL_DURATION_MS * FPS) / 1000); // 6477

/**
 * Wired from `02-audio/timestamps.json` (Stage 3).
 * Verified: Σ durationInFrames === TOTAL_DURATION_FRAMES (6477), drift = 0.
 */
export const SCENES: SceneTiming[] = [
  { id: "scene-01", from: 0, durationInFrames: 466 },
  { id: "scene-02", from: 466, durationInFrames: 293 },
  { id: "scene-03", from: 759, durationInFrames: 480 },
  { id: "scene-04", from: 1239, durationInFrames: 551 },
  { id: "scene-05", from: 1790, durationInFrames: 544 },
  { id: "scene-06", from: 2334, durationInFrames: 552 },
  { id: "scene-07", from: 2886, durationInFrames: 434 },
  { id: "scene-08", from: 3320, durationInFrames: 433 },
  { id: "scene-09", from: 3753, durationInFrames: 701 },
  { id: "scene-10", from: 4454, durationInFrames: 584 },
  { id: "scene-11", from: 5038, durationInFrames: 468 },
  { id: "scene-12", from: 5506, durationInFrames: 484 },
  { id: "scene-13", from: 5990, durationInFrames: 487 },
];

export const sceneOf = (id: SceneId): SceneTiming => {
  const found = SCENES.find((s) => s.id === id);
  if (!found) throw new Error(`Unknown scene id: ${id}`);
  return found;
};
