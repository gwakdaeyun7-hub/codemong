/**
 * Lesson 7 — 리스트 (생성 / 인덱싱 / 추가·삭제 / 2차원 기초)
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
 * Source data — timestamps.json (13 scenes, last endMs 270984):
 *
 *   i  | sceneId  | startMs | endMs   | from = round(startMs*30/1000) | dur
 *   01 | scene-01 |       0 |  13692  |    0 | 411
 *   02 | scene-02 |  13692 |  24894  |  411 | 336
 *   03 | scene-03 |  24894 |  47729  |  747 | 685
 *   04 | scene-04 |  47729 |  67764  | 1432 | 601
 *   05 | scene-05 |  67764 |  87799  | 2033 | 601
 *   06 | scene-06 |  87799 | 106014  | 2634 | 546
 *   07 | scene-07 | 106014 | 121836  | 3180 | 475
 *   08 | scene-08 | 121836 | 145485  | 3655 | 710
 *   09 | scene-09 | 145485 | 171863  | 4365 | 791
 *   10 | scene-10 | 171863 | 195680  | 5156 | 714
 *   11 | scene-11 | 195680 | 224882  | 5870 | 876
 *   12 | scene-12 | 224882 | 246401  | 6746 | 646
 *   13 | scene-13 | 246401 | 270984  | 7392 | 738
 *   TOTAL                              8130 (= round(270984*30/1000))
 *
 * Σ dur = 411+336+685+601+601+546+475+710+791+714+876+646+738 = 8130 == TOTAL ✓
 *
 * Note: voiceover came in at 270.98s (vs Stage 2 placeholder 180s, +50.5%).
 * Each scene's frame budget grew proportionally. Scene-internal beat timing
 * (REVEAL.line1 etc.) was authored against the placeholder, so this round
 * also adjusts per-scene REVEAL values to re-sync narration keyword pulses
 * (R-016 in quality-rules.md).
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

// Derived from timestamps.json last endMs (270984).
export const TOTAL_DURATION_MS = 270_984;
export const TOTAL_DURATION_FRAMES = Math.round((TOTAL_DURATION_MS * FPS) / 1000); // 8130

/**
 * Wired from `02-audio/timestamps.json` (Stage 3).
 * Verified: Σ durationInFrames === TOTAL_DURATION_FRAMES (8130), drift = 0.
 */
export const SCENES: SceneTiming[] = [
  { id: "scene-01", from: 0, durationInFrames: 411 },
  { id: "scene-02", from: 411, durationInFrames: 336 },
  { id: "scene-03", from: 747, durationInFrames: 685 },
  { id: "scene-04", from: 1432, durationInFrames: 601 },
  { id: "scene-05", from: 2033, durationInFrames: 601 },
  { id: "scene-06", from: 2634, durationInFrames: 546 },
  { id: "scene-07", from: 3180, durationInFrames: 475 },
  { id: "scene-08", from: 3655, durationInFrames: 710 },
  { id: "scene-09", from: 4365, durationInFrames: 791 },
  { id: "scene-10", from: 5156, durationInFrames: 714 },
  { id: "scene-11", from: 5870, durationInFrames: 876 },
  { id: "scene-12", from: 6746, durationInFrames: 646 },
  { id: "scene-13", from: 7392, durationInFrames: 738 },
];

export const sceneOf = (id: SceneId): SceneTiming => {
  const found = SCENES.find((s) => s.id === id);
  if (!found) throw new Error(`Unknown scene id: ${id}`);
  return found;
};
