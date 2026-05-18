/**
 * Scene 6 — `list[i] = x` 자리 값만 바꿔치기 (14s)
 *
 * 학습 목표 3 두 번째 동작 / 오개념 2-b (덮어쓰기 = 새 자리 추가 X) 처치.
 *
 * - 0~3s: scene-05 끝 상태 ListVisual — 박스 4개 [88, 92, 76, 100] +
 *         인덱스 띠 [0] [1] [2] [3] + 라벨 "길이 = 4" 유지.
 * - 3~7s: 중앙 코드 패널 한 줄 `scores[0] = 95` type-on. `0` 과 `95`
 *         violet-500 강조.
 * - 7~14s: [0] 박스 안의 `88` 이 `95` 로 swap (state="swapped"). 박스 위치/
 *         개수 변화 _없음_. 인덱스 띠 그대로. "길이 = 4" 그대로 (펄스 X —
 *         변화 없음을 시각으로). 우측 라벨 "그 자리 값만 바뀜 — 길이 그대로".
 */

import React from "react";
import {
  CodeLine,
  CodePanel,
  FadeIn,
  ListItem,
  ListVisual,
  PageBackground,
  PyToken,
} from "../primitives";
import { colors, fonts, radii, shadows } from "../theme";

// R-016 — narration (18.22s) 키워드 발화 시점 동기 (Stage 3 wire 조정).
//   "다음, 이미 있는 자리의 값을 ... 새 값을 줍니다" (~0~7s) — 도입 + codePanel
//   "스코어즈 대괄호 0 등호 95" (~7~10s) — codeLine
//   "이 한 줄을 실행하면 ... 95로 바뀝니다" (~10~14s) — valueSwap
//   "묶음 길이는 그대로 넷입니다" (~14~18s) — sideLabel
const REVEAL = {
  initialList: 0.2,
  initialStrip: 0.4,
  initialLengthLabel: 0.8,
  codePanel: 5.0, // narration "대괄호 안에 자리 번호를 넣고"
  codeLine: 7.5, // narration "스코어즈 대괄호 0 등호 95"
  valueSwap: 11.5, // narration "88에서 95로 바뀝니다"
  sideLabel: 15.0, // narration "묶음 길이는 그대로 넷"
} as const;

const items: ListItem[] = [
  // [0] 박스: 88 → 95 swap (swapped state, prevValue=88, value=95)
  {
    value: "95",
    prevValue: "88",
    state: "swapped",
    atSec: REVEAL.valueSwap,
  },
  { value: "92", state: "normal" },
  { value: "76", state: "normal" },
  { value: "100", state: "normal" },
];

export const Scene06: React.FC = () => {
  return (
    <PageBackground>
      <div style={{ position: "absolute", top: 50, left: 0, right: 0, textAlign: "center" }}>
        <FadeIn delaySec={0.1} translateY={6}>
          <div
            style={{
              fontFamily: fonts.sans,
              fontSize: 28,
              fontWeight: 600,
              color: colors.accentDeep,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            그 자리 값만 — 대괄호 자리 지정
          </div>
        </FadeIn>
      </div>

      {/* 상단 — 박스 4개 + 인덱스 띠 + 길이 라벨 (길이 라벨 swap X — 4 유지) */}
      <div
        style={{
          position: "absolute",
          top: 140,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <ListVisual
          items={items}
          boxSize={130}
          gap={24}
          showIndexStrip
          indexStripDelaySec={REVEAL.initialStrip}
          indexStripStaggerSec={0.2}
          defaultItemDelaySec={REVEAL.initialList}
          lengthLabel="길이 = 4"
          lengthLabelDelaySec={REVEAL.initialLengthLabel}
        />
      </div>

      {/* 중앙 — 코드 패널 */}
      <div
        style={{
          position: "absolute",
          top: 540,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <FadeIn delaySec={REVEAL.codePanel} translateY={18}>
          <CodePanel fileName="overwrite.py" width={680} height={130}>
            <CodeLine lineNumber={1} revealAtSec={REVEAL.codeLine}>
              <PyToken text="scores" kind="name" />
              <PyToken text="[" kind="op" />
              <PyToken
                text="0"
                kind="number"
                style={{ fontWeight: 800, color: colors.accent }}
              />
              <PyToken text="]" kind="op" />
              <PyToken text=" = " kind="op" />
              <PyToken
                text="95"
                kind="number"
                style={{ fontWeight: 800, color: colors.accent }}
              />
            </CodeLine>
          </CodePanel>
        </FadeIn>
      </div>

      {/* 우측 보조 라벨 */}
      <div
        style={{
          position: "absolute",
          top: 720,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <FadeIn delaySec={REVEAL.sideLabel} translateY={6} durationSec={0.4}>
          <div
            style={{
              padding: "10px 22px",
              borderRadius: radii.pill,
              background: colors.bgWhite,
              border: `1.5px solid ${colors.accent}`,
              color: colors.accentDeep,
              fontFamily: fonts.sans,
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: "-0.01em",
              boxShadow: shadows.cardSoft,
            }}
          >
            그 자리 값만 바뀜 — 길이 그대로
          </div>
        </FadeIn>
      </div>
    </PageBackground>
  );
};
