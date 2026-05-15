/**
 * Lesson 4 — 입력과 연산자 (`input()` / 산술·비교·논리 연산자)
 *
 * v4 — re-wired after lesson-4 fixes round (audio 길이 265,728ms; -24ms loudnorm/s11 narration).
 *
 * Adjacent-boundary rule (per project_timing_contract memory):
 *
 *   from_i = round(startMs_i * FPS / 1000)
 *   dur_i  = (i+1 < n ? from_{i+1} : TOTAL_DURATION_FRAMES) - from_i
 *   TOTAL_DURATION_MS = lastEndMs (265_728)
 *   TOTAL_DURATION_FRAMES = round(lastEndMs * FPS / 1000) = 7972
 *
 * Verification — Σ durationInFrames === TOTAL_DURATION_FRAMES:
 *   428 + 482 + 1391 + 794 + 581 + 816 + 369 + 493 + 1272 + 641 + 705 = 7972 ✓
 *
 * Source data — 02-audio/timestamps.json (11 scenes, totalMs 265_728):
 *
 *   i  | sceneId  | startMs  | endMs    | from = round(startMs*30/1000) | dur = next.from - from
 *   01 | scene-01 |       0  |    14272 |     0 |    428
 *   02 | scene-02 |   14272  |    30339 |   428 |    482
 *   03 | scene-03 |   30339  |    76699 |   910 |   1391
 *   04 | scene-04 |   76699  |   103183 |  2301 |    794
 *   05 | scene-05 |  103183  |   122531 |  3095 |    581
 *   06 | scene-06 |  122531  |   149734 |  3676 |    816
 *   07 | scene-07 |  149734  |   162018 |  4492 |    369
 *   08 | scene-08 |  162018  |   178469 |  4861 |    493
 *   09 | scene-09 |  178469  |   220877 |  5354 |   1272
 *   10 | scene-10 |  220877  |   242237 |  6626 |    641
 *   11 | scene-11 |  242237  |   265728 |  7267 |    705
 *   TOTAL                                       |   7972 (= TOTAL_DURATION_FRAMES)
 *
 * v4 changelog vs v3:
 *   - s11 narration 표기 "묶입니다" → "무낍니다" 발음 강제 (TTS 가 [무깁니다]로 잘못 발음 → 표기로 우회)
 *   - 합성 후 loudnorm 으로 -24ms (~1 frame) 단축, s11 706→705 프레임
 *   - Scene03 결과 fontSize 44→32, 라벨 top 52→60, 35→8 swap timing buffer 추가
 *   - Scene04 우측 padding 80→200 (예시 카드 안쪽으로 당김)
 *   - Scene05 정답 reveal 9.0→11.5s (a2 audio "14" 발화 동기), 풀이 라벨 9.6→13.0s
 *   - Scene06 "값" EmphasisPulse 제거 (정적 강조 유지)
 *   - Scene07 SplitColumn FadeIn flex:1 적용 (가로 등간격), ResultBox spacer 43 (세로 박스 본체 일치)
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

// v4: real ms-based values from timestamps.json (265_728ms).
export const TOTAL_DURATION_MS = 265_728;
export const TOTAL_DURATION_FRAMES = Math.round((TOTAL_DURATION_MS * FPS) / 1000); // 7972
export const LESSON4_TOTAL_FRAMES = TOTAL_DURATION_FRAMES;

/**
 * v4 — frame-precise boundaries from `02-audio/timestamps.json`.
 * adjacent-boundary rule: Σ durations == TOTAL_DURATION_FRAMES (7972), drift 0.
 */
export const SCENES: SceneTiming[] = [
  { id: "scene-01", from: 0, durationInFrames: 428 },
  { id: "scene-02", from: 428, durationInFrames: 482 },
  { id: "scene-03", from: 910, durationInFrames: 1391 },
  { id: "scene-04", from: 2301, durationInFrames: 794 },
  { id: "scene-05", from: 3095, durationInFrames: 581 },
  { id: "scene-06", from: 3676, durationInFrames: 816 },
  { id: "scene-07", from: 4492, durationInFrames: 369 },
  { id: "scene-08", from: 4861, durationInFrames: 493 },
  { id: "scene-09", from: 5354, durationInFrames: 1272 },
  { id: "scene-10", from: 6626, durationInFrames: 641 },
  { id: "scene-11", from: 7267, durationInFrames: 705 },
];

export const sceneOf = (id: SceneId): SceneTiming => {
  const found = SCENES.find((s) => s.id === id);
  if (!found) throw new Error(`Unknown scene id: ${id}`);
  return found;
};
