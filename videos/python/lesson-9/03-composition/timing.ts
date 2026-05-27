/**
 * Lesson 9 — 함수 (`def` / 매개변수 / `return` / 지역·전역 변수)
 *
 * Stage 3 — REAL timing wired from `02-audio/timestamps.json`.
 *
 * SCENE ORDER NOTE (re-edit): 지역변수(scene-10)를 return 블록(scene-07~09) 앞으로
 * 옮긴 재편집을 반영한다. 재생 순서는 [01,02,03,04,05,06,10,07,08,09,11].
 * sceneId 는 논리 식별자로 유지 (scene-10 = 지역변수, scene-07 = return) — 배열의
 * "순서"만 교육 순서(매개변수 → 지역변수 → return)에 맞게 재배치했다.
 * voiceover.mp3 / timestamps.json 도 동일 순서로 재합성됨.
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
 * Source data — timestamps.json (11 scenes, last endMs 204936):
 *
 *   pos | sceneId  | startMs | endMs   | from = round(startMs*30/1000)
 *   01  | scene-01 |       0 |  14119 |    0
 *   02  | scene-02 |  14119 |  26179 |  424
 *   03  | scene-03 |  26179 |  47142 |  785
 *   04  | scene-04 |  47142 |  60280 | 1414
 *   05  | scene-05 |  60280 |  80285 | 1808
 *   06  | scene-06 |  80285 |  97323 | 2409
 *   07  | scene-10 |  97323 | 113093 | 2920   ← 지역변수 (재배치)
 *   08  | scene-07 | 113093 | 128073 | 3393   ← return
 *   09  | scene-08 | 128073 | 160020 | 3842   ← return vs print
 *   10  | scene-09 | 160020 | 178182 | 4801   ← active recall
 *   11  | scene-11 | 178182 | 204936 | 5345   ← 정리
 *   TOTAL                              6148  (= round(204936*30/1000))
 *
 * Durations (adjacent-boundary):
 *   424, 361, 629, 394, 601, 511, 473, 449, 959, 544, 803
 *   Σ = 6148 == TOTAL_DURATION_FRAMES ✓
 *
 * Note: voiceover came in at 204.936s. Each scene's frame budget is wired from
 * the real audio boundaries; scene-internal beat timing (REVEAL.* etc.) is left
 * as authored — any tail dead-air is deliberate per the agent runbook.
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

// Derived from timestamps.json last endMs (204936).
export const TOTAL_DURATION_MS = 204_936;
export const TOTAL_DURATION_FRAMES = Math.round((TOTAL_DURATION_MS * FPS) / 1000); // 6148

/**
 * Wired from `02-audio/timestamps.json` (Stage 3, re-edit).
 * Array order = playback order = [01,02,03,04,05,06,10,07,08,09,11].
 * Verified: Σ durationInFrames === TOTAL_DURATION_FRAMES (6148), drift = 0.
 */
export const SCENES: SceneTiming[] = [
  { id: "scene-01", from: 0, durationInFrames: 424 },
  { id: "scene-02", from: 424, durationInFrames: 361 },
  { id: "scene-03", from: 785, durationInFrames: 629 },
  { id: "scene-04", from: 1414, durationInFrames: 394 },
  { id: "scene-05", from: 1808, durationInFrames: 601 },
  { id: "scene-06", from: 2409, durationInFrames: 511 },
  { id: "scene-10", from: 2920, durationInFrames: 473 },
  { id: "scene-07", from: 3393, durationInFrames: 449 },
  { id: "scene-08", from: 3842, durationInFrames: 959 },
  { id: "scene-09", from: 4801, durationInFrames: 544 },
  { id: "scene-11", from: 5345, durationInFrames: 803 },
];

export const sceneOf = (id: SceneId): SceneTiming => {
  const found = SCENES.find((s) => s.id === id);
  if (!found) throw new Error(`Unknown scene id: ${id}`);
  return found;
};
