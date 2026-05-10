/**
 * Lesson 2 — 코딩의 표현 방법 (자연어 / 의사코드 / 순서도)
 *
 * Stage 3 — REAL timing from 02-audio/timestamps.json (audio pipeline ground
 * truth). Frame boundaries computed via the adjacent-boundary rule:
 *
 *   from_i = round(startMs_i * FPS / 1000)
 *   dur_i  = (i+1 < n ? from_{i+1} : TOTAL) - from_i
 *
 * This guarantees Σ dur_i == TOTAL_DURATION_FRAMES with 0 frame drift, even
 * after rounding (the last boundary acts as the rounding sink).
 *
 * Memory: project_timing_contract — static SCENES literal preferred over
 * calculateMetadata when timestamps.json is co-produced with the voiceover.
 *
 * Source values (timestamps.json):
 *   • scene-01..scene-13 startMs: 0, 14109, 23028, 38261, 51103, 66838,
 *     79440, 93190, 112632, 127840, 147593, 166054, 179421
 *   • last scene endMs: 198528 ms (≈ 198.53 s)
 *   • TOTAL_DURATION_FRAMES = round(198528 * 30 / 1000) = 5956 frames
 *
 * Verified: Σ durationInFrames = 423+268+457+385+472+378+413+583+456+593
 *           +554+401+573 = 5956 ✓ (drift = 0).
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

export const TOTAL_DURATION_MS = 198_528;
export const TOTAL_DURATION_FRAMES = Math.round((TOTAL_DURATION_MS * FPS) / 1000); // 5956

/**
 * Hard-coded from timestamps.json + adjacent-boundary computation.
 *
 * | Scene | startMs | from  | dur |
 * |-------|---------|-------|-----|
 * | 01    | 0       | 0     | 423 |
 * | 02    | 14109   | 423   | 268 |
 * | 03    | 23028   | 691   | 457 |
 * | 04    | 38261   | 1148  | 385 |
 * | 05    | 51103   | 1533  | 472 |
 * | 06    | 66838   | 2005  | 378 |
 * | 07    | 79440   | 2383  | 413 |
 * | 08    | 93190   | 2796  | 583 |
 * | 09    | 112632  | 3379  | 456 |
 * | 10    | 127840  | 3835  | 593 |
 * | 11    | 147593  | 4428  | 554 |
 * | 12    | 166054  | 4982  | 401 |
 * | 13    | 179421  | 5383  | 573 |
 * | TOTAL | 198528  |       | 5956|
 *
 * Note on scene-06: narration in timestamps.json is one merged paragraph
 * ("여기서 잠깐. 셋 중 어느 걸 가장 먼저 쓸까요? 자연어입니다. ...").
 * The TTS pipeline already inserted any internal pauses; the visual reveal
 * inside Scene06 is driven by useCurrentFrame() within the 378-frame window
 * and stays in sync with the rendered MP3 by construction (we do not split
 * the scene further at the timing layer).
 */
export const SCENES: SceneTiming[] = [
  { id: "scene-01", from: 0, durationInFrames: 423 },
  { id: "scene-02", from: 423, durationInFrames: 268 },
  { id: "scene-03", from: 691, durationInFrames: 457 },
  { id: "scene-04", from: 1148, durationInFrames: 385 },
  { id: "scene-05", from: 1533, durationInFrames: 472 },
  { id: "scene-06", from: 2005, durationInFrames: 378 },
  { id: "scene-07", from: 2383, durationInFrames: 413 },
  { id: "scene-08", from: 2796, durationInFrames: 583 },
  { id: "scene-09", from: 3379, durationInFrames: 456 },
  { id: "scene-10", from: 3835, durationInFrames: 593 },
  { id: "scene-11", from: 4428, durationInFrames: 554 },
  { id: "scene-12", from: 4982, durationInFrames: 401 },
  { id: "scene-13", from: 5383, durationInFrames: 573 },
];

export const sceneOf = (id: SceneId): SceneTiming => {
  const found = SCENES.find((s) => s.id === id);
  if (!found) throw new Error(`Unknown scene id: ${id}`);
  return found;
};
