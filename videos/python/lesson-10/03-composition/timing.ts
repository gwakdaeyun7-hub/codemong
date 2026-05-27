/**
 * Lesson 10 — 모듈 & 랜덤 (`import` / `random` 활용)
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
 * Source data — timestamps.json (11 scenes, last endMs 206544):
 *
 *   i  | sceneId  | startMs | endMs  | from = round(startMs*30/1000)
 *   01 | scene-01 |       0 |  13711 |    0
 *   02 | scene-02 |   13711 |  28665 |  411
 *   03 | scene-03 |   28665 |  48166 |  860
 *   04 | scene-04 |   48166 |  66088 | 1445
 *   05 | scene-05 |   66088 |  82120 | 1983
 *   06 | scene-06 |   82120 | 102171 | 2464
 *   07 | scene-07 |  102171 | 124472 | 3065
 *   08 | scene-08 |  124472 | 142585 | 3734
 *   09 | scene-09 |  142585 | 159789 | 4278
 *   10 | scene-10 |  159789 | 183430 | 4794
 *   11 | scene-11 |  183430 | 206544 | 5503
 *   TOTAL                              6196  (= round(206544*30/1000))
 *
 * Durations (adjacent-boundary):
 *   411, 449, 585, 538, 481, 601, 669, 544, 516, 709, 693
 *   Σ = 6196 == TOTAL_DURATION_FRAMES ✓
 *
 * Note: voiceover re-synthed 2026-05-27 (2nd round) → 206.544s. scene-03 is
 * 585 frames (~19.5s): narration carries the "import 를 빼먹으면 오류가 난다"
 * explanation, now pulled to right after "임포트 랜덤" + the "한 줄" filler
 * dropped (user feedback). Its beats were re-authored in Scene03.tsx against
 * measured phrase timings ("오류가 납니다" ≈ 8.2~9.1s, s6 시작 ≈ 14.8s).
 * Other scenes' audio/internal beats are unchanged (only scene-03 text moved);
 * their startMs merely shifts as scene-03 shrank. Scene 08's Active Recall
 * reveal (revealAt) IS retimed in Scene08.tsx via R-004 sub-clip probe
 * (a0/s1/a2 = 10200/1800/5760 unchanged).
 *
 * Scene-08 subClip probes (ffprobe):
 *   - a0 (질문 발화) = 10.200s
 *   - s1 (정적)      =  1.829s
 *   - a2 (정답+풀이) =  5.760s
 *   → a2 시작 (scene-08 내부 시각) = 10.200 + 1.829 ≈ 12.03s
 *   → revealAt 12.3s ∈ [12.03, 12.03 + 5.760×0.25] = [12.03, 13.47]  ✓ R-004
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

// Derived from timestamps.json last endMs (201936).
export const TOTAL_DURATION_MS = 206_544;
export const TOTAL_DURATION_FRAMES = Math.round((TOTAL_DURATION_MS * FPS) / 1000); // 6196

/**
 * Wired from `02-audio/timestamps.json` (re-synthed 2026-05-27, 2nd round).
 * Verified: Σ durationInFrames === TOTAL_DURATION_FRAMES (6196), drift = 0.
 */
export const SCENES: SceneTiming[] = [
  { id: "scene-01", from: 0, durationInFrames: 411 },
  { id: "scene-02", from: 411, durationInFrames: 449 },
  { id: "scene-03", from: 860, durationInFrames: 585 },
  { id: "scene-04", from: 1445, durationInFrames: 538 },
  { id: "scene-05", from: 1983, durationInFrames: 481 },
  { id: "scene-06", from: 2464, durationInFrames: 601 },
  { id: "scene-07", from: 3065, durationInFrames: 669 },
  { id: "scene-08", from: 3734, durationInFrames: 544 },
  { id: "scene-09", from: 4278, durationInFrames: 516 },
  { id: "scene-10", from: 4794, durationInFrames: 709 },
  { id: "scene-11", from: 5503, durationInFrames: 693 },
];

export const sceneOf = (id: SceneId): SceneTiming => {
  const found = SCENES.find((s) => s.id === id);
  if (!found) throw new Error(`Unknown scene id: ${id}`);
  return found;
};
