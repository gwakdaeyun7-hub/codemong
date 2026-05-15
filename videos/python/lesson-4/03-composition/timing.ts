/**
 * Lesson 4 — 입력과 연산자 (`input()` / 산술·비교·논리 연산자)
 *
 * v3 — wired from 02-audio/timestamps.json (audio 길이 265,752ms).
 *
 * Adjacent-boundary rule (per project_timing_contract memory):
 *
 *   from_i = round(startMs_i * FPS / 1000)
 *   dur_i  = (i+1 < n ? from_{i+1} : TOTAL_DURATION_FRAMES) - from_i
 *   TOTAL_DURATION_MS = lastEndMs (265_752)
 *   TOTAL_DURATION_FRAMES = round(lastEndMs * FPS / 1000) = 7973
 *
 * Verification — Σ durationInFrames === TOTAL_DURATION_FRAMES:
 *   428 + 482 + 1391 + 794 + 581 + 816 + 369 + 493 + 1272 + 641 + 706 = 7973 ✓
 *
 * Source data — 02-audio/timestamps.json (11 scenes, totalMs 265_752):
 *
 *   i  | sceneId  | startMs  | endMs    | from = round(startMs*30/1000) | dur = next.from - from
 *   01 | scene-01 |       0  |    14272 |     0 |    428
 *   02 | scene-02 |   14272  |    30340 |   428 |    482
 *   03 | scene-03 |   30340  |    76699 |   910 |   1391
 *   04 | scene-04 |   76699  |   103183 |  2301 |    794
 *   05 | scene-05 |  103183  |   122531 |  3095 |    581
 *   06 | scene-06 |  122531  |   149734 |  3676 |    816
 *   07 | scene-07 |  149734  |   162018 |  4492 |    369
 *   08 | scene-08 |  162018  |   178469 |  4861 |    493
 *   09 | scene-09 |  178469  |   220877 |  5354 |   1272
 *   10 | scene-10 |  220877  |   242237 |  6626 |    641
 *   11 | scene-11 |  242237  |   265752 |  7267 |    706
 *   TOTAL                                       |   7973 (= TOTAL_DURATION_FRAMES)
 *
 * v3 changelog vs v2:
 *   - 새 audio 길이 265.752s (v2 의 273.864s 대비 -8.1s 단축 — narration v3 압축)
 *   - 모든 scene from/dur 갱신
 *   - Scene01 / Scene11 패턴은 lesson-3 시즌 통일 (도입은 큰 제목 + 회상 카드,
 *     마무리는 좌 체크리스트 + 우 다음 강의 카드, 정적 마무리)
 *   - Scene03/05/07/10 시각 이슈 6건 수정 (출력 35/8, reveal 타이밍, 좌우 박스 정렬)
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

// v3: real ms-based values from timestamps.json (265_752ms).
export const TOTAL_DURATION_MS = 265_752;
export const TOTAL_DURATION_FRAMES = Math.round((TOTAL_DURATION_MS * FPS) / 1000); // 7973
export const LESSON4_TOTAL_FRAMES = TOTAL_DURATION_FRAMES;

/**
 * v3 — frame-precise boundaries from `02-audio/timestamps.json`.
 * adjacent-boundary rule: Σ durations == TOTAL_DURATION_FRAMES (7973), drift 0.
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
  { id: "scene-11", from: 7267, durationInFrames: 706 },
];

export const sceneOf = (id: SceneId): SceneTiming => {
  const found = SCENES.find((s) => s.id === id);
  if (!found) throw new Error(`Unknown scene id: ${id}`);
  return found;
};
