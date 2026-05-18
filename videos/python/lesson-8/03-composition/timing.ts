/**
 * Lesson 8 — 딕셔너리 & 자료구조 (`dict` / `tuple` / `set` 기초)
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
 * Source data — timestamps.json (11 scenes, last endMs 226920):
 *
 *   i  | sceneId  | startMs | endMs   | from = round(startMs*30/1000)
 *   01 | scene-01 |       0 |  15463 |    0
 *   02 | scene-02 |  15463 |  30735 |  464
 *   03 | scene-03 |  30735 |  49262 |  922
 *   04 | scene-04 |  49262 |  71499 | 1478
 *   05 | scene-05 |  71499 |  95843 | 2145
 *   06 | scene-06 |  95843 | 122484 | 2875
 *   07 | scene-07 | 122484 | 145631 | 3675
 *   08 | scene-08 | 145631 | 165091 | 4369
 *   09 | scene-09 | 165091 | 187041 | 4953
 *   10 | scene-10 | 187041 | 203342 | 5611
 *   11 | scene-11 | 203342 | 226920 | 6100
 *   TOTAL                              6808  (= round(226920*30/1000))
 *
 * Durations (adjacent-boundary):
 *   464, 458, 556, 667, 730, 800, 694, 584, 658, 489, 708
 *   Σ = 6808 == TOTAL_DURATION_FRAMES ✓
 *
 * Note: voiceover came in at 226.92s (vs Stage 2 placeholder 180s, +26%).
 * Each scene's frame budget grew proportionally, but scene-internal beat
 * timing (REVEAL.line1 etc.) was authored against the placeholder. The
 * resulting dead-air at scene tails is deliberately left for video-director
 * review per the agent runbook — do not rescale beats here. Scene 05's
 * Active Recall reveal (answerSwap) IS retimed in Scene05.tsx via R-004
 * sub-clip probe.
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

// Derived from timestamps.json last endMs (226920).
export const TOTAL_DURATION_MS = 226_920;
export const TOTAL_DURATION_FRAMES = Math.round((TOTAL_DURATION_MS * FPS) / 1000); // 6808

/**
 * Wired from `02-audio/timestamps.json` (Stage 3).
 * Verified: Σ durationInFrames === TOTAL_DURATION_FRAMES (6808), drift = 0.
 */
export const SCENES: SceneTiming[] = [
  { id: "scene-01", from: 0, durationInFrames: 464 },
  { id: "scene-02", from: 464, durationInFrames: 458 },
  { id: "scene-03", from: 922, durationInFrames: 556 },
  { id: "scene-04", from: 1478, durationInFrames: 667 },
  { id: "scene-05", from: 2145, durationInFrames: 730 },
  { id: "scene-06", from: 2875, durationInFrames: 800 },
  { id: "scene-07", from: 3675, durationInFrames: 694 },
  { id: "scene-08", from: 4369, durationInFrames: 584 },
  { id: "scene-09", from: 4953, durationInFrames: 658 },
  { id: "scene-10", from: 5611, durationInFrames: 489 },
  { id: "scene-11", from: 6100, durationInFrames: 708 },
];

export const sceneOf = (id: SceneId): SceneTiming => {
  const found = SCENES.find((s) => s.id === id);
  if (!found) throw new Error(`Unknown scene id: ${id}`);
  return found;
};
