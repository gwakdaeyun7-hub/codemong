/**
 * Scene 4 — 매 바퀴 `i` 가 덮어쓰기 되는 흐름 (15s)
 *
 * **6강 시그니처 #2.** 오개념 2번 (반복 변수 매 바퀴 덮어쓰기) 정면 처치.
 *
 * - 0~3s: scene-03 의 코드 2줄이 좌측에 유지 (톤 그대로). 코드 위에 변수 박스 등장 (라벨 "i" + 빈 박스)
 * - 3~6s: **1바퀴 컷** — 변수 박스 안에 `0` 이 type-on. 라벨 "1바퀴". 콘솔에 `0` fade-in.
 * - 6~9s: **2바퀴 컷** — 변수 박스 `0` → `1` 덮어쓰기 (옅게 사라지며 swap, scale up 0.3s). 라벨 "2바퀴". 콘솔에 `1` fade-in.
 * - 9~12s: **3바퀴 컷** — 같은 방식 `1` → `2`. 라벨 "3바퀴". 콘솔에 `2` fade-in.
 * - 12~15s: 콘솔 결과 세 줄이 violet-500 으로 한 번 펄스. 화면 하단 lower-third "매 바퀴 — `i` 가 새 값으로 덮어쓰기".
 *
 * 핵심: `i` 박스가 *덮어쓰기* 된다는 시간 축 시각화. 콘솔은 *누적*.
 */

import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import {
  CodeLine,
  CodePanel,
  ConsoleLine,
  ConsolePanel,
  FadeIn,
  IndentGuide,
  LowerThird,
  PageBackground,
  PyToken,
} from "../primitives";
import { colors, fonts, radii, shadows } from "../theme";

const easeOutCubic = Easing.bezier(0.16, 1, 0.3, 1);

const REVEAL = {
  panel: 0.2,
  varBoxLabel: 1.0,
  varBoxBody: 1.3,
  iter1Value: 3.0, // 박스 안에 0 type-on
  iter1RoundLabel: 3.0, // "1바퀴" 라벨
  iter1Console: 4.0, // 콘솔에 0
  iter2Swap: 6.0, // 0 → 1 swap
  iter2RoundLabel: 6.0,
  iter2Console: 7.0,
  iter3Swap: 9.0,
  iter3RoundLabel: 9.0,
  iter3Console: 10.0,
  pulse: 12.0,
  lowerThird: 13.0,
} as const;

/**
 * 변수 박스 안의 값이 swap 되는 컴포넌트.
 *
 * `swaps`: [{ atSec, value }] 배열. atSec 시점에 value 로 swap.
 * 각 swap 은 0.3초 동안 이전 값 fade-out + 새 값 scale-up + fade-in.
 */
const SwappingValue: React.FC<{
  swaps: { atSec: number; value: React.ReactNode }[];
}> = ({ swaps }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // Determine current swap index based on frame.
  // 각 swap 이 0.3초의 transition window 를 가진다. window 가운데를 기준으로 active.
  let activeIdx = -1;
  for (let i = 0; i < swaps.length; i++) {
    if (frame >= swaps[i].atSec * fps) activeIdx = i;
  }
  if (activeIdx < 0) return null;

  return (
    <>
      {swaps.map((swap, idx) => {
        const start = swap.atSec * fps;
        const fadeIn = interpolate(frame, [start, start + 0.25 * fps], [0, 1], {
          easing: easeOutCubic,
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const nextSwap = swaps[idx + 1];
        let fadeOut = 1;
        if (nextSwap) {
          const fadeOutStart = nextSwap.atSec * fps;
          fadeOut = interpolate(frame, [fadeOutStart, fadeOutStart + 0.25 * fps], [1, 0], {
            easing: easeOutCubic,
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
        }
        const scale = interpolate(frame, [start, start + 0.3 * fps], [1.3, 1.0], {
          easing: easeOutCubic,
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const opacity = fadeIn * fadeOut;

        return (
          <div
            key={idx}
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity,
              transform: `scale(${scale})`,
            }}
          >
            {swap.value}
          </div>
        );
      })}
    </>
  );
};

/** 라운드 라벨이 atSec 에 fade-in → 다음 atSec 에 fade-out. */
const RoundLabel: React.FC<{
  text: string;
  fromSec: number;
  toSec: number;
}> = ({ text, fromSec, toSec }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = interpolate(
    frame,
    [
      fromSec * fps,
      (fromSec + 0.4) * fps,
      (toSec - 0.3) * fps,
      toSec * fps,
    ],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return (
    <div
      style={{
        opacity,
        padding: "6px 16px",
        borderRadius: radii.pill,
        background: colors.accentSoft,
        color: colors.accentInk,
        fontFamily: fonts.sans,
        fontSize: 24,
        fontWeight: 700,
        letterSpacing: "-0.01em",
        border: `1.5px solid ${colors.accent}`,
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  );
};

/** 콘솔 마지막 펄스 — 세 줄 모두에 violet-500 외곽선이 한 번 깜빡. */
const ConsolePulseRing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = REVEAL.pulse * fps;
  const opacity = interpolate(
    frame,
    [start, start + 0.3 * fps, start + 1.0 * fps, start + 1.4 * fps],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return (
    <div
      style={{
        position: "absolute",
        inset: -6,
        borderRadius: 16,
        border: `3px solid ${colors.accent}`,
        opacity,
        pointerEvents: "none",
        boxShadow: "0 0 0 4px rgba(139, 92, 246, 0.18)",
      }}
    />
  );
};

export const Scene04: React.FC = () => {
  return (
    <PageBackground>
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 0,
          right: 0,
          textAlign: "center",
        }}
      >
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
            매 바퀴 — i 가 새 값으로
          </div>
        </FadeIn>
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          padding: "120px 80px 140px",
          gap: 60,
        }}
      >
        {/* 좌측 — 코드 + 변수 박스 + 라운드 라벨 */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 30,
          }}
        >
          {/* 변수 박스 (수동 구성 — SwappingValue 를 박스 안에 absolute 로 배치하기 위함) */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
            }}
          >
            <FadeIn delaySec={REVEAL.varBoxLabel} translateY={-14}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "6px 18px",
                  borderRadius: radii.pill,
                  background: colors.accentSoft,
                  color: colors.accentInk,
                  fontFamily: fonts.mono,
                  fontSize: 26,
                  fontWeight: 700,
                  letterSpacing: "-0.01em",
                  border: `1px solid ${colors.accent}`,
                }}
              >
                i
              </div>
            </FadeIn>
            <FadeIn delaySec={REVEAL.varBoxBody} translateY={10}>
              <div
                style={{
                  position: "relative",
                  width: 200,
                  height: 130,
                  borderRadius: 18,
                  background: colors.bgWhite,
                  border: `3px solid ${colors.accent}`,
                  boxShadow: shadows.card,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: fonts.mono,
                  fontSize: 64,
                  fontWeight: 800,
                  color: colors.accentDeep,
                  letterSpacing: "-0.02em",
                  overflow: "hidden",
                }}
              >
                <SwappingValue
                  swaps={[
                    { atSec: REVEAL.iter1Value, value: <span>0</span> },
                    { atSec: REVEAL.iter2Swap, value: <span>1</span> },
                    { atSec: REVEAL.iter3Swap, value: <span>2</span> },
                  ]}
                />
              </div>
            </FadeIn>
          </div>

          {/* 라운드 라벨 (1/2/3 바퀴 — 각 시간대에만 표시) */}
          <div
            style={{
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <div style={{ position: "absolute", inset: 0, display: "flex", justifyContent: "center" }}>
              <RoundLabel text="1바퀴" fromSec={REVEAL.iter1RoundLabel} toSec={REVEAL.iter2RoundLabel} />
            </div>
            <div style={{ position: "absolute", inset: 0, display: "flex", justifyContent: "center" }}>
              <RoundLabel text="2바퀴" fromSec={REVEAL.iter2RoundLabel} toSec={REVEAL.iter3RoundLabel} />
            </div>
            <div style={{ position: "absolute", inset: 0, display: "flex", justifyContent: "center" }}>
              <RoundLabel text="3바퀴" fromSec={REVEAL.iter3RoundLabel} toSec={15.0} />
            </div>
          </div>

          {/* 코드 패널 (scene-03 의 코드 2줄 유지) */}
          <FadeIn delaySec={REVEAL.panel} translateY={20}>
            <div style={{ position: "relative" }}>
              <CodePanel fileName="loop.py" width={620} height={200}>
                <CodeLine lineNumber={1} revealAtSec={REVEAL.panel}>
                  <PyToken text="for" kind="keyword" />
                  <PyToken text=" " />
                  <PyToken text="i" kind="name" />
                  <PyToken text=" " />
                  <PyToken text="in" kind="keyword" />
                  <PyToken text=" " />
                  <PyToken text="range" kind="func" />
                  <PyToken text="(" kind="op" />
                  <PyToken text="3" kind="number" />
                  <PyToken text=")" kind="op" />
                  <PyToken text=":" kind="op" />
                </CodeLine>
                <CodeLine lineNumber={2} revealAtSec={REVEAL.panel + 0.2}>
                  <PyToken text="    " />
                  <PyToken text="print" kind="func" />
                  <PyToken text="(" kind="op" />
                  <PyToken text="i" kind="name" />
                  <PyToken text=")" kind="op" />
                </CodeLine>
              </CodePanel>
              <IndentGuide
                left={64}
                top={108}
                height={50}
                depth={1}
                delaySec={REVEAL.panel + 0.5}
                durationSec={0.4}
              />
            </div>
          </FadeIn>
        </div>

        {/* 우측 — 콘솔 (누적) */}
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            paddingTop: 60,
          }}
        >
          <div style={{ position: "relative" }}>
            <FadeIn delaySec={REVEAL.panel} translateY={20}>
              <ConsolePanel title="출력 결과" width={420} height={320}>
                <ConsoleLine revealAtSec={REVEAL.iter1Console}>
                  <span style={{ fontSize: 44, fontWeight: 700, color: colors.darkInk }}>0</span>
                </ConsoleLine>
                <ConsoleLine revealAtSec={REVEAL.iter2Console}>
                  <span style={{ fontSize: 44, fontWeight: 700, color: colors.darkInk }}>1</span>
                </ConsoleLine>
                <ConsoleLine revealAtSec={REVEAL.iter3Console}>
                  <span style={{ fontSize: 44, fontWeight: 700, color: colors.darkInk }}>2</span>
                </ConsoleLine>
              </ConsolePanel>
            </FadeIn>
            <ConsolePulseRing />
          </div>
        </div>
      </div>

      <LowerThird
        text={
          <>
            매 바퀴 —{" "}
            <span style={{ fontFamily: fonts.mono, color: colors.accentLight }}>i</span> 가 새 값으로
            덮어쓰기
          </>
        }
        delaySec={REVEAL.lowerThird}
      />
    </PageBackground>
  );
};
