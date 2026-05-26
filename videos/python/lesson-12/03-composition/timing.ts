/**
 * Lesson 12 — 디버깅 & AI 활용 (오류 분석 / print 추적 / 코드 개선 / AI 조수)
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
 * Source data — timestamps.json (9 scenes, last endMs 211488):
 *
 *   i  | sceneId  | startMs | endMs  | from = round(startMs*30/1000)
 *   01 | scene-01 |       0 |  15972 |    0
 *   02 | scene-02 |   15972 |  38002 |  479
 *   03 | scene-03 |   38002 |  64031 | 1140
 *   04 | scene-04 |   64031 |  88288 | 1921
 *   05 | scene-05 |   88288 | 112473 | 2649
 *   06 | scene-06 |  112473 | 139890 | 3374
 *   07 | scene-07 |  139890 | 161944 | 4197
 *   08 | scene-08 |  161944 | 184980 | 4858
 *   09 | scene-09 |  184980 | 211488 | 5549
 *   TOTAL                              6345  (= round(211488*30/1000))
 *
 * Durations (adjacent-boundary):
 *   479, 661, 781, 728, 725, 823, 661, 691, 796
 *   Σ = 6345 == TOTAL_DURATION_FRAMES (drift 0)
 *
 * Note: voiceover came in at 211.488s (vs Stage 2 placeholder 213s, -0.7%).
 * Scene-internal beat timing (delaySec) was authored against the placeholder;
 * Active Recall (scene-05 question / scene-06 answer reveal) is re-synced to
 * measured audio per R-004/R-027 — see those scenes. Other scenes' tail
 * dead-air, if any, is left for video-director review (do not rescale beats).
 *
 * Active Recall re-sync source (probed from _scenes/, stdlib MP3 parser):
 *   scene-05.a0 (question narration) = 21.336s -> local frame 640
 *   scene-05.s1 (silent thinking pause) = 2.560s -> a0+s1 = 23.896s -> local frame 717
 *   scene-05 total = 725 frames; "합계엔 얼마가" uttered ~ 16.2s (local frame 487)
 *   scene-06 "정답은 육이어야 하는데 삼이" -> "삼이" uttered ~ 2.2s (local frame 65)
 *
 * No CSS transitions / Tailwind animate-* — all animation lives inside scenes
 * via useCurrentFrame() + interpolate() (per remotion-best-practices).
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
  | "scene-09";

export type SceneTiming = {
  id: SceneId;
  from: number;
  durationInFrames: number;
};

// Derived from timestamps.json last endMs (211488).
export const TOTAL_DURATION_MS = 211_488;
export const TOTAL_DURATION_FRAMES = Math.round((TOTAL_DURATION_MS * FPS) / 1000); // 6345

/**
 * Wired from `02-audio/timestamps.json` (Stage 3).
 * Verified: Σ durationInFrames === TOTAL_DURATION_FRAMES (6345), drift = 0.
 */
export const SCENES: SceneTiming[] = [
  { id: "scene-01", from: 0, durationInFrames: 479 },
  { id: "scene-02", from: 479, durationInFrames: 661 },
  { id: "scene-03", from: 1140, durationInFrames: 781 },
  { id: "scene-04", from: 1921, durationInFrames: 728 },
  { id: "scene-05", from: 2649, durationInFrames: 725 },
  { id: "scene-06", from: 3374, durationInFrames: 823 },
  { id: "scene-07", from: 4197, durationInFrames: 661 },
  { id: "scene-08", from: 4858, durationInFrames: 691 },
  { id: "scene-09", from: 5549, durationInFrames: 796 },
];

export const sceneOf = (id: SceneId): SceneTiming => {
  const found = SCENES.find((s) => s.id === id);
  if (!found) throw new Error(`Unknown scene id: ${id}`);
  return found;
};
