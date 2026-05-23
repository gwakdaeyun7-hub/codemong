/**
 * Lesson 11 — 파일 입출력 (파일 저장 / 파일 불러오기)
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
 * Source data — timestamps.json (11 scenes, last endMs 184776):
 *
 *   i  | sceneId  | startMs | endMs  | from = round(startMs*30/1000)
 *   01 | scene-01 |       0 |  17583 |    0
 *   02 | scene-02 |   17583 |  34735 |  527
 *   03 | scene-03 |   34735 |  55165 | 1042
 *   04 | scene-04 |   55165 |  72915 | 1655
 *   05 | scene-05 |   72915 |  86671 | 2187
 *   06 | scene-06 |   86671 | 103919 | 2600
 *   07 | scene-07 |  103919 | 117291 | 3118
 *   08 | scene-08 |  117291 | 134109 | 3519
 *   09 | scene-09 |  134109 | 149945 | 4023
 *   10 | scene-10 |  149945 | 161093 | 4498
 *   11 | scene-11 |  161093 | 184776 | 4833
 *   TOTAL                              5543  (= round(184776*30/1000))
 *
 * Durations (adjacent-boundary):
 *   527, 515, 613, 532, 413, 518, 401, 504, 475, 335, 710
 *   Σ = 5543 == TOTAL_DURATION_FRAMES ✓
 *
 * Note: voiceover came in at 184.776s (vs Stage 2 placeholder 180s, +2.7%).
 * Each scene's frame budget shifted slightly but scene-internal beat timing
 * (delaySec values) was authored against the placeholder. Any resulting
 * dead-air at scene tails is left for video-director review per the agent
 * runbook — do not rescale beats here. 11강 영상엔 Active Recall scene 없음
 * (R-004 sub-clip probe 대상 아님).
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

// Derived from timestamps.json last endMs (184776).
export const TOTAL_DURATION_MS = 184_776;
export const TOTAL_DURATION_FRAMES = Math.round((TOTAL_DURATION_MS * FPS) / 1000); // 5543

/**
 * Wired from `02-audio/timestamps.json` (Stage 3).
 * Verified: Σ durationInFrames === TOTAL_DURATION_FRAMES (5543), drift = 0.
 */
export const SCENES: SceneTiming[] = [
  { id: "scene-01", from: 0, durationInFrames: 527 },
  { id: "scene-02", from: 527, durationInFrames: 515 },
  { id: "scene-03", from: 1042, durationInFrames: 613 },
  { id: "scene-04", from: 1655, durationInFrames: 532 },
  { id: "scene-05", from: 2187, durationInFrames: 413 },
  { id: "scene-06", from: 2600, durationInFrames: 518 },
  { id: "scene-07", from: 3118, durationInFrames: 401 },
  { id: "scene-08", from: 3519, durationInFrames: 504 },
  { id: "scene-09", from: 4023, durationInFrames: 475 },
  { id: "scene-10", from: 4498, durationInFrames: 335 },
  { id: "scene-11", from: 4833, durationInFrames: 710 },
];

export const sceneOf = (id: SceneId): SceneTiming => {
  const found = SCENES.find((s) => s.id === id);
  if (!found) throw new Error(`Unknown scene id: ${id}`);
  return found;
};
