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
 * Source data — timestamps.json (9 scenes, last endMs 210216):
 *
 *   i  | sceneId  | startMs | endMs  | from = round(startMs*30/1000)
 *   01 | scene-01 |       0 |  15972 |    0
 *   02 | scene-02 |   15972 |  38001 |  479
 *   03 | scene-03 |   38001 |  63096 | 1140
 *   04 | scene-04 |   63096 |  87353 | 1893
 *   05 | scene-05 |   87353 | 111537 | 2621
 *   06 | scene-06 |  111537 | 138955 | 3346
 *   07 | scene-07 |  138955 | 161008 | 4169
 *   08 | scene-08 |  161008 | 184044 | 4830
 *   09 | scene-09 |  184044 | 210216 | 5521
 *   TOTAL                              6306  (= round(210216*30/1000))
 *
 * Durations (adjacent-boundary):
 *   479, 661, 753, 728, 725, 823, 661, 691, 785
 *   Σ = 6306 == TOTAL_DURATION_FRAMES (drift 0)
 *
 * Note: voiceover re-synthesized twice. (1) scene-03 narration fix ("바로 그 위,
 * 라인 쓰리 —" → "바로 그 위를 보면," — TTS 가 "그 위" 를 "그이" 로 뭉개고 영어
 * "라인 쓰리" 읽기 제거). (2) scene-09 13강 hook "단어 암기장" → "계산기" (13강이
 * 계산기 만들기로 확정). 211.488s → 210.552s → 210.216s. scene-09 만 796→785
 * frames(-11), 그 외 scene 은 길이·from 불변 (scene-09 가 마지막이라 from 변동 없음).
 * scene-05 sub-clip(a0 21336 / s1 2500)도 동일 — Active Recall 동기 보존.
 * Scene-internal beat timing(delaySec)은 placeholder; scene-03 은 측정 재동기,
 * scene-05/06 Active Recall 은 R-004/R-027 로 측정 동기됨 (do not rescale beats).
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

// Derived from timestamps.json last endMs (210216).
export const TOTAL_DURATION_MS = 210_216;
export const TOTAL_DURATION_FRAMES = Math.round((TOTAL_DURATION_MS * FPS) / 1000); // 6306

/**
 * Wired from `02-audio/timestamps.json` (Stage 3).
 * Verified: Σ durationInFrames === TOTAL_DURATION_FRAMES (6345), drift = 0.
 */
export const SCENES: SceneTiming[] = [
  { id: "scene-01", from: 0, durationInFrames: 479 },
  { id: "scene-02", from: 479, durationInFrames: 661 },
  { id: "scene-03", from: 1140, durationInFrames: 753 },
  { id: "scene-04", from: 1893, durationInFrames: 728 },
  { id: "scene-05", from: 2621, durationInFrames: 725 },
  { id: "scene-06", from: 3346, durationInFrames: 823 },
  { id: "scene-07", from: 4169, durationInFrames: 661 },
  { id: "scene-08", from: 4830, durationInFrames: 691 },
  { id: "scene-09", from: 5521, durationInFrames: 785 },
];

export const sceneOf = (id: SceneId): SceneTiming => {
  const found = SCENES.find((s) => s.id === id);
  if (!found) throw new Error(`Unknown scene id: ${id}`);
  return found;
};
