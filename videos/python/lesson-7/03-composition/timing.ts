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
 * Source data — timestamps.json (13 scenes, last endMs 270840):
 * (Re-wired 2026-05-27 after the 길이값 발음 수정 재합성 — scene-05/06/07
 *  narration "셋/넷" → "삼/사". Total 270984 → 270840 ms, −144ms. Only the
 *  scenes around 05~09 shift by a few frames; 10~13 shift ≤4 frames.)
 *
 *   i  | sceneId  | startMs | endMs   | from = round(startMs*30/1000) | dur
 *   01 | scene-01 |       0 |  13692  |    0 | 411
 *   02 | scene-02 |  13692 |  24894  |  411 | 336
 *   03 | scene-03 |  24894 |  47729  |  747 | 685
 *   04 | scene-04 |  47729 |  67764  | 1432 | 601
 *   05 | scene-05 |  67764 |  87703  | 2033 | 598
 *   06 | scene-06 |  87703 | 105847  | 2631 | 544
 *   07 | scene-07 | 105847 | 121692  | 3175 | 476
 *   08 | scene-08 | 121692 | 145342  | 3651 | 709
 *   09 | scene-09 | 145342 | 171720  | 4360 | 792
 *   10 | scene-10 | 171720 | 195536  | 5152 | 714
 *   11 | scene-11 | 195536 | 224739  | 5866 | 876
 *   12 | scene-12 | 224739 | 246257  | 6742 | 646
 *   13 | scene-13 | 246257 | 270840  | 7388 | 737
 *   TOTAL                              8125 (= round(270840*30/1000))
 *
 * Σ dur = 411+336+685+601+598+544+476+709+792+714+876+646+737 = 8125 == TOTAL ✓
 *
 * Note: voiceover is 270.84s (vs Stage 2 placeholder 180s, +50.5%).
 * Each scene's frame budget grew proportionally. Scene-internal beat timing
 * (REVEAL.line1 etc.) is authored relative to each scene's own start, so the
 * sub-second total shift does not require per-scene REVEAL re-tuning this round
 * (narration within each scene is unchanged except 05/06/07's tail length word).
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

// Derived from timestamps.json last endMs (270840).
export const TOTAL_DURATION_MS = 270_840;
export const TOTAL_DURATION_FRAMES = Math.round((TOTAL_DURATION_MS * FPS) / 1000); // 8125

/**
 * Wired from `02-audio/timestamps.json` (Stage 3; re-wired 2026-05-27).
 * Verified: Σ durationInFrames === TOTAL_DURATION_FRAMES (8125), drift = 0.
 */
export const SCENES: SceneTiming[] = [
  { id: "scene-01", from: 0, durationInFrames: 411 },
  { id: "scene-02", from: 411, durationInFrames: 336 },
  { id: "scene-03", from: 747, durationInFrames: 685 },
  { id: "scene-04", from: 1432, durationInFrames: 601 },
  { id: "scene-05", from: 2033, durationInFrames: 598 },
  { id: "scene-06", from: 2631, durationInFrames: 544 },
  { id: "scene-07", from: 3175, durationInFrames: 476 },
  { id: "scene-08", from: 3651, durationInFrames: 709 },
  { id: "scene-09", from: 4360, durationInFrames: 792 },
  { id: "scene-10", from: 5152, durationInFrames: 714 },
  { id: "scene-11", from: 5866, durationInFrames: 876 },
  { id: "scene-12", from: 6742, durationInFrames: 646 },
  { id: "scene-13", from: 7388, durationInFrames: 737 },
];

export const sceneOf = (id: SceneId): SceneTiming => {
  const found = SCENES.find((s) => s.id === id);
  if (!found) throw new Error(`Unknown scene id: ${id}`);
  return found;
};
