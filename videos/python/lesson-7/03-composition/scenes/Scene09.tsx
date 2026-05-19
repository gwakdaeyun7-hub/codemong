/**
 * Scene 9 — `for x in 리스트:` 값 자체로 순회 (16s)
 *
 * 학습 목표 4. lesson-6 Scene04 의 변수 박스 덮어쓰기 패턴 답습.
 * R-011 (3박스 row 정렬) + R-014 (좌·우 패널 y 일치) 준수.
 *
 * - 0~5s: 좌측 50% 코드 패널 2줄 type-on (각 1.5s):
 *         for s in scores:
 *             print(s)
 *         `for`/`in`/`print` 키워드 violet-300. 들여쓰기 가이드 violet-300 세로 띠.
 * - 5~10s: 코드 _위_ 에 변수 박스 `s` 등장. 매 바퀴 박스 안 값 swap:
 *           1바퀴 (1.5s): `88` type-on. 콘솔 `88` fade-in. 라벨 "1바퀴".
 *           2바퀴 (1.5s): 박스 `88` → `92` swap (R-002 buffer). 콘솔 `92`.
 * - 10~14s: 3바퀴 (1.5s) 같은 방식 → `76`. 콘솔 `76`.
 * - 14~16s: 콘솔 세 줄 violet-500 한 번 펄스.
 *           lower-third "변수 `s` 에 리스트의 _값 자체_ 가 하나씩".
 *
 * note: R-011 — 변수 박스는 main row 위쪽 절대 좌표로 분리.
 * R-014 — 좌·우 패널의 paddingTop 으로 y 정렬.
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

// R-016 — narration (26.38s) 키워드 발화 시점 동기 (Stage 3 wire 조정).
//   "이번엔 묶음 안의 값들을 ... 다루는 방법입니다" (~0~5s) — 도입
//   "포 다음에 변수 이름, 인 키워드, 그리고 리스트를 적습니다" (~5~10s) — line1/line2
//   "이 코드를 실행하면 ... 들어갑니다" (~10~16s) — varLabel/varBox
//   "1바퀴엔 88" (~16~18s) — iter1
//   "2바퀴엔 92" (~18~20s) — iter2
//   "3바퀴엔 76" (~20~22s) — iter3
//   "그래서 화면에 88, 92, 76이 한 줄씩 나옵니다" (~22~26s) — consolePulse + lowerThird
const REVEAL = {
  panel: 0.2,
  line1: 5.5, // narration "포 다음에 변수 이름"
  line2: 8.5, // narration "그리고 리스트를 적습니다"
  varLabel: 11.5, // narration "변수 에스에 ... 들어갑니다"
  varBox: 11.8,
  iter1Value: 16.0, // narration "1바퀴엔 88"
  iter1Round: 16.0,
  iter1Console: 16.5,
  iter2Swap: 18.0, // narration "2바퀴엔 92"
  iter2Round: 18.0,
  iter2Console: 18.5,
  iter3Swap: 20.0, // narration "3바퀴엔 76"
  iter3Round: 20.0,
  iter3Console: 20.5,
  consolePulse: 23.0, // narration "한 줄씩 나옵니다"
  lowerThird: 24.0,
} as const;

/** 박스 안 값 swap (lesson-6 Scene04 SwappingValue 패턴 — R-002 적용). */
const SwappingValue: React.FC<{
  swaps: { atSec: number; value: React.ReactNode }[];
}> = ({ swaps }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <>
      {swaps.map((swap, idx) => {
        const start = swap.atSec * fps;
        const fadeIn = interpolate(frame, [start, start + 0.4 * fps], [0, 1], {
          easing: easeOutCubic,
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const nextSwap = swaps[idx + 1];
        let fadeOut = 1;
        if (nextSwap) {
          const fadeOutStart = nextSwap.atSec * fps - 0.4 * fps; // 0.2s buffer 확보
          fadeOut = interpolate(frame, [fadeOutStart, fadeOutStart + 0.3 * fps], [1, 0], {
            easing: easeOutCubic,
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
        }
        const scale = interpolate(frame, [start, start + 0.4 * fps], [1.25, 1.0], {
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

const RoundLabel: React.FC<{ text: string; fromSec: number; toSec: number }> = ({
  text,
  fromSec,
  toSec,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = interpolate(
    frame,
    [fromSec * fps, (fromSec + 0.4) * fps, (toSec - 0.3) * fps, toSec * fps],
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
        fontSize: 22,
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

const ConsolePulseRing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = REVEAL.consolePulse * fps;
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

export const Scene09: React.FC = () => {
  // R-014 + R-020 — 좌측 stack height 계산:
  //   VarBox label 36 + gap 10 + VarBox body 160 + gap 30 + RoundLabel 36 + gap 30 + CodePanel 200 = 502
  //   CodePanel top offset (from column top) = 36+10+160+30+36+30 = 302
  // 우측 paddingTop = 302, ConsolePanel height = 200 → 우측 total = 502 (좌측과 동일).
  // R-020 추가 강제 — label 의 inline-flex line-box 가 폰트 line-height 와 padding 합으로
  //   ~45px 까지 늘어나 좌측 sum 이 502 보다 커지면 alignItems: center 가 y 어긋남.
  //   label 에 `height: 36 + lineHeight: 1 + padding "0 18px"` 강제 + 좌·우 wrapper
  //   둘 다 명시 height 로 한 번 더 보강.
  const COL_HEIGHT = 502;
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
            }}
          >
            값 자체 — <span style={{ fontFamily: fonts.mono }}>for s in scores</span>
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
        {/* 좌측 — VarBox + RoundLabel + CodePanel (R-020 height 명시) */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 30,
            height: COL_HEIGHT,
          }}
        >
          {/* VarBox 수동 구성 */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <FadeIn delaySec={REVEAL.varLabel} translateY={-14}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "0 18px",
                  height: 36,
                  lineHeight: 1,
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
                s
              </div>
            </FadeIn>
            <FadeIn delaySec={REVEAL.varBox} translateY={10}>
              <div
                style={{
                  position: "relative",
                  width: 240,
                  height: 160,
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
                    { atSec: REVEAL.iter1Value, value: <span>88</span> },
                    { atSec: REVEAL.iter2Swap, value: <span>92</span> },
                    { atSec: REVEAL.iter3Swap, value: <span>76</span> },
                  ]}
                />
              </div>
            </FadeIn>
          </div>

          {/* RoundLabel */}
          <div style={{ height: 36, display: "flex", alignItems: "center", position: "relative" }}>
            <div style={{ position: "absolute", inset: 0, display: "flex", justifyContent: "center" }}>
              <RoundLabel text="1바퀴" fromSec={REVEAL.iter1Round} toSec={REVEAL.iter2Round} />
            </div>
            <div style={{ position: "absolute", inset: 0, display: "flex", justifyContent: "center" }}>
              <RoundLabel text="2바퀴" fromSec={REVEAL.iter2Round} toSec={REVEAL.iter3Round} />
            </div>
            <div style={{ position: "absolute", inset: 0, display: "flex", justifyContent: "center" }}>
              <RoundLabel text="3바퀴" fromSec={REVEAL.iter3Round} toSec={26.0} />
            </div>
          </div>

          {/* CodePanel */}
          <FadeIn delaySec={REVEAL.panel} translateY={20}>
            <div style={{ position: "relative" }}>
              <CodePanel fileName="iter.py" width={620} height={200}>
                <CodeLine lineNumber={1} revealAtSec={REVEAL.line1}>
                  <PyToken text="for" kind="keyword" />
                  <PyToken text=" " />
                  <PyToken text="s" kind="name" />
                  <PyToken text=" " />
                  <PyToken text="in" kind="keyword" />
                  <PyToken text=" " />
                  <PyToken text="scores" kind="name" />
                  <PyToken text=":" kind="op" />
                </CodeLine>
                <CodeLine lineNumber={2} revealAtSec={REVEAL.line2}>
                  <PyToken text="    " />
                  <PyToken text="print" kind="func" />
                  <PyToken text="(" kind="op" />
                  <PyToken text="s" kind="name" />
                  <PyToken text=")" kind="op" />
                </CodeLine>
              </CodePanel>
              {/* 들여쓰기 가이드 — 2번 줄 */}
              <IndentGuide
                left={64}
                top={108}
                height={50}
                depth={1}
                delaySec={REVEAL.line2 + 0.3}
                durationSec={0.4}
              />
            </div>
          </FadeIn>
        </div>

        {/* 우측 — 콘솔 (paddingTop 으로 코드 패널 y 와 정렬). R-014 + R-020 적용. */}
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            paddingTop: 302,
            height: COL_HEIGHT,
          }}
        >
          <div style={{ position: "relative" }}>
            <FadeIn delaySec={REVEAL.panel} translateY={20}>
              <ConsolePanel title="출력 결과" width={320} height={200}>
                <ConsoleLine revealAtSec={REVEAL.iter1Console}>
                  <span style={{ fontSize: 28, fontWeight: 700, color: colors.darkInk }}>88</span>
                </ConsoleLine>
                <ConsoleLine revealAtSec={REVEAL.iter2Console}>
                  <span style={{ fontSize: 28, fontWeight: 700, color: colors.darkInk }}>92</span>
                </ConsoleLine>
                <ConsoleLine revealAtSec={REVEAL.iter3Console}>
                  <span style={{ fontSize: 28, fontWeight: 700, color: colors.darkInk }}>76</span>
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
            변수{" "}
            <span style={{ fontFamily: fonts.mono, color: colors.accentLight }}>s</span> 에
            리스트의 값 자체가 하나씩
          </>
        }
        delaySec={REVEAL.lowerThird}
      />
    </PageBackground>
  );
};
