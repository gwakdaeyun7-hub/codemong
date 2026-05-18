/**
 * Scene 5 — `append` 끝에 새 자리 추가 (14s)
 *
 * 학습 목표 3 첫 동작 / 오개념 2-a 정면 처치 (덮어쓰기 X — 새 자리 추가).
 *
 * - 0~3s: 상단 출발 상태 ListVisual — 박스 3개 [88, 92, 76] + 인덱스 띠
 *         [0] [1] [2] + 라벨 "길이 = 3".
 * - 3~7s: 화면 중앙 코드 패널 한 줄 `scores.append(100)` type-on (2s).
 *         `append` 토큰 violet-500 + fontWeight 800 정적 강조 (R-005).
 * - 7~14s: 상단 박스 우측에 새 둥근 박스 `100` 가 fade-in + 살짝 위에서
 *         떨어지는 모션 (state="incoming"). 위 인덱스 라벨 [3] 함께 등장.
 *         "길이 = 3" → "길이 = 4" swap (R-002 fade-out + 0.2s buffer +
 *         fade-in). 우측 라벨 "끝에 새 자리 — 길이 +1".
 */

import React from "react";
import {
  CodeLine,
  CodePanel,
  FadeIn,
  IndexStrip,
  PageBackground,
  PyToken,
  SwapLabel,
} from "../primitives";
import { colors, fonts, radii, shadows } from "../theme";
import { ListItem, ListVisual } from "../primitives";

// R-016 — narration (20.04s) 키워드 발화 시점 동기 (Stage 3 wire 조정).
//   "이번엔 리스트에 값을 ... 봅니다" (~0~4s) — 도입
//   "먼저 끝에 새 값을 더할 때는 어펜드" (~4~8s) — codePanel fade-in
//   "스코어즈 점 어펜드 괄호 100" (~8~11s) — codeLine type-on
//   "이 한 줄을 실행하면 ... 100이 들어갑니다" (~11~16s) — newBox + 인덱스
//   "묶음 길이는 셋에서 넷으로 늘어납니다" (~16~20s) — lengthSwap + sideLabel
const REVEAL = {
  initialList: 0.2,
  initialStrip: 0.5,
  initialLengthLabel: 1.0,
  codePanel: 6.0, // narration "어펜드를 씁니다"
  codeLine: 8.0, // narration "스코어즈 점 어펜드 괄호 100"
  newBox: 12.5, // 새 박스 fade-in — narration "100이 들어갑니다"
  newIndexLabel: 12.8,
  lengthSwap: 17.0, // narration "셋에서 넷으로 늘어납니다"
  sideLabel: 18.0,
} as const;

// 4개 박스 (마지막 100 은 incoming).
const itemsAfterAppend: ListItem[] = [
  { value: "88", state: "normal" },
  { value: "92", state: "normal" },
  { value: "76", state: "normal" },
  { value: "100", state: "incoming", atSec: REVEAL.newBox },
];

export const Scene05: React.FC = () => {
  return (
    <PageBackground>
      {/* 상단 라벨 */}
      <div style={{ position: "absolute", top: 50, left: 0, right: 0, textAlign: "center" }}>
        <FadeIn delaySec={0.1} translateY={6}>
          <div
            style={{
              fontFamily: fonts.sans,
              fontSize: 28,
              fontWeight: 600,
              color: colors.accentDeep,
              letterSpacing: "0.04em",
            }}
          >
            끝에 더하기 — <span style={{ fontFamily: fonts.mono }}>append</span>
          </div>
        </FadeIn>
      </div>

      {/* 상단 ListVisual — 동적으로 박스 4개 (마지막은 incoming). */}
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
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          {/* IndexStrip — 처음에는 3개, 7.8s에 [3] 추가. */}
          <div style={{ display: "flex", gap: 24 }}>
            {/* 기존 3개 인덱스 */}
            <IndexStrip
              count={3}
              boxSize={130}
              gap={24}
              delaySec={REVEAL.initialStrip}
              staggerSec={0.25}
            />
            {/* 새 [3] 라벨 — incoming */}
            <FadeIn delaySec={REVEAL.newIndexLabel} translateY={-6} durationSec={0.4}>
              <div
                style={{
                  width: 130,
                  display: "flex",
                  justifyContent: "center",
                  fontFamily: fonts.mono,
                  fontSize: 26,
                  fontWeight: 800,
                  color: colors.accentInk,
                  letterSpacing: "-0.01em",
                  padding: "2px 10px",
                  borderRadius: radii.sm,
                  background: colors.accentSoft,
                  border: `1.5px solid ${colors.accent}`,
                }}
              >
                [3]
              </div>
            </FadeIn>
          </div>
          {/* 박스 4개 */}
          <ListVisual
            items={itemsAfterAppend}
            boxSize={130}
            gap={24}
            showIndexStrip={false}
            defaultItemDelaySec={REVEAL.initialList}
          />
          {/* 길이 라벨 swap */}
          <div style={{ marginTop: 12 }}>
            <FadeIn delaySec={REVEAL.initialLengthLabel} translateY={6} durationSec={0.4}>
              <SwapLabel
                initial={
                  <span
                    style={{
                      padding: "6px 18px",
                      borderRadius: radii.pill,
                      background: colors.borderSoft,
                      border: `1.5px solid ${colors.border}`,
                      fontFamily: fonts.sans,
                      fontSize: 22,
                      fontWeight: 700,
                      color: colors.inkSoft,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    길이 = 3
                  </span>
                }
                newLabel={
                  <span
                    style={{
                      padding: "6px 18px",
                      borderRadius: radii.pill,
                      background: colors.accentSoft,
                      border: `1.5px solid ${colors.accent}`,
                      fontFamily: fonts.sans,
                      fontSize: 22,
                      fontWeight: 800,
                      color: colors.accentDeep,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    길이 = 4
                  </span>
                }
                swapAtSec={REVEAL.lengthSwap}
              />
            </FadeIn>
          </div>
        </div>
      </div>

      {/* 중앙 — 코드 패널 */}
      <div
        style={{
          position: "absolute",
          top: 580,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <FadeIn delaySec={REVEAL.codePanel} translateY={18}>
          <CodePanel fileName="add.py" width={680} height={130}>
            <CodeLine lineNumber={1} revealAtSec={REVEAL.codeLine}>
              <PyToken text="scores" kind="name" />
              <PyToken text="." kind="op" />
              <PyToken
                text="append"
                kind="func"
                style={{ fontWeight: 800, color: colors.accent }}
              />
              <PyToken text="(" kind="op" />
              <PyToken text="100" kind="number" />
              <PyToken text=")" kind="op" />
            </CodeLine>
          </CodePanel>
        </FadeIn>
      </div>

      {/* 우측 보조 라벨 — "끝에 새 자리 — 길이 +1" */}
      <div
        style={{
          position: "absolute",
          top: 750,
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
            끝에 새 자리 — 길이 +1
          </div>
        </FadeIn>
      </div>
    </PageBackground>
  );
};
