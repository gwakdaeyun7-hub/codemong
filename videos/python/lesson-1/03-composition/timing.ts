/**
 * Lesson 1 — 파이썬 개요 & 개발환경
 *
 * Static SCENES array. Frame boundaries are derived from
 * `videos/python/lesson-1/02-audio/timestamps.json` (audio pipeline ground
 * truth) via an adjacent-boundary computation:
 *
 *   from_i = round(startMs_i * FPS / 1000)
 *   dur_i  = (i+1 < n ? from_{i+1} : TOTAL) - from_i
 *
 * This guarantees Σ dur_i == TOTAL_DURATION_FRAMES with 0 frame drift, even
 * after rounding (one of the boundaries acts as the rounding sink).
 *
 * Memory: project_timing_contract — static SCENES literal preferred over
 * calculateMetadata when timestamps.json is co-produced with the voiceover.
 *
 * Source values (timestamps.json endMs of last scene): 156144 ms.
 *   ceil(156144 / 1000 * 30) = 4685 frames ≈ 156.1 s.
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

export const TOTAL_DURATION_MS = 156144;
export const TOTAL_DURATION_FRAMES = Math.ceil((TOTAL_DURATION_MS * FPS) / 1000); // 4685

/**
 * Hard-coded from timestamps.json + adjacent-boundary computation
 * (verified: Σ durationInFrames === TOTAL_DURATION_FRAMES, drift = 0).
 */
export const SCENES: SceneTiming[] = [
  { id: "scene-01", from: 0, durationInFrames: 399 },
  { id: "scene-02", from: 399, durationInFrames: 219 },
  { id: "scene-03", from: 618, durationInFrames: 419 },
  { id: "scene-04", from: 1037, durationInFrames: 360 },
  { id: "scene-05", from: 1397, durationInFrames: 367 },
  { id: "scene-06", from: 1764, durationInFrames: 514 },
  { id: "scene-07", from: 2278, durationInFrames: 480 },
  { id: "scene-08", from: 2758, durationInFrames: 347 },
  { id: "scene-09", from: 3105, durationInFrames: 366 },
  { id: "scene-10", from: 3471, durationInFrames: 400 },
  { id: "scene-11", from: 3871, durationInFrames: 303 },
  { id: "scene-12", from: 4174, durationInFrames: 511 },
];

export const sceneOf = (id: SceneId): SceneTiming => {
  const found = SCENES.find((s) => s.id === id);
  if (!found) throw new Error(`Unknown scene id: ${id}`);
  return found;
};
