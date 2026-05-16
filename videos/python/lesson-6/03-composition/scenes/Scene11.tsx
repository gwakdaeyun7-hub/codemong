/**
 * Scene 11 — 들여쓰기 안/밖 비교 (오개념 5) (12s)
 *
 * 5강의 들여쓰기 가이드 라인 시각 자산 *재활용*. 문법은 다시 설명하지 않고
 * 시선만 잡아줌.
 *
 * - 0~6s: 화면 좌우 분할, 양쪽 코드 패널 3줄
 *     좌측: print("끝") 들여쓰기 *안* — 좌측 가이드 라인이 2·3줄 모두에 그어짐
 *     우측: print("끝") 들여쓰기 *밖* — 좌측 가이드 라인이 2줄에서만 그어짐 (끊어짐)
 * - 6~12s: 양쪽 코드 아래 콘솔 fade-in
 *     좌측 콘솔: `0` `끝` `1` `끝` `2` `끝` (3번씩 반복)
 *     우측 콘솔: `0` `1` `2` `끝` (마지막 한 번만)
 *     "끝" 단어 개수 차이 한 번 펄스
 *   - lower-third "들여쓰기 안 = 루프 안 · 밖 = 루프 밖"
 */

import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
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

const REVEAL = {
  panelLeft: 0.3,
  panelRight: 0.5,
  lineL1: 0.8,
  lineL2: 1.5,
  lineL3: 2.2,
  lineR1: 0.8,
  lineR2: 1.5,
  lineR3: 2.2,
  guideLeft: 3.0, // 좌측: 2·3줄 가이드
  guideRight: 3.0, // 우측: 2줄 가이드만
  consoleFade: 5.5,
  consolePulse: 9.0,
  lowerThird: 9.5,
} as const;

const REVEAL_LEFT_CONSOLE = [
  6.0, 6.4, 6.8, 7.2, 7.6, 8.0,
] as const; // 6 줄 (0, 끝, 1, 끝, 2, 끝)

const REVEAL_RIGHT_CONSOLE = [6.0, 6.4, 6.8, 7.4] as const; // 4 줄 (0, 1, 2, 끝)

const PulseRing: React.FC<{ delaySec: number }> = ({ delaySec }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = delaySec * fps;
  const opacity = interpolate(
    frame,
    [start, start + 0.3 * fps, start + 0.9 * fps, start + 1.4 * fps],
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

export const Scene11: React.FC = () => {
  return (
    <PageBackground>
      <div
        style={{
          position: "absolute",
          top: 50,
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
            들여쓰기 안 vs 밖
          </div>
        </FadeIn>
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "120px 60px 140px",
          gap: 60,
        }}
      >
        {/* 좌측 — print("끝") 들여쓰기 안 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 24,
          }}
        >
          <FadeIn delaySec={REVEAL.panelLeft} translateY={18}>
            <div style={{ position: "relative" }}>
              <CodePanel fileName="loop-in.py" width={580} height={250}>
                <CodeLine lineNumber={1} revealAtSec={REVEAL.lineL1}>
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
                <CodeLine lineNumber={2} revealAtSec={REVEAL.lineL2}>
                  <PyToken text="    " />
                  <PyToken text="print" kind="func" />
                  <PyToken text="(" kind="op" />
                  <PyToken text="i" kind="name" />
                  <PyToken text=")" kind="op" />
                </CodeLine>
                <CodeLine lineNumber={3} revealAtSec={REVEAL.lineL3}>
                  <PyToken text="    " />
                  <PyToken text="print" kind="func" />
                  <PyToken text="(" kind="op" />
                  <PyToken text={'"끝"'} kind="string" />
                  <PyToken text=")" kind="op" />
                </CodeLine>
              </CodePanel>
              {/*
                좌측 가이드: 2·3줄 모두 들여쓰기 안 (한 띠로 묶음).
                패널 헤더 40 + padding 20 = 60. line-height ≈ 48.
                2줄 시작 ≈ 108, 3줄 끝 ≈ 108 + 48*2 = 204. 높이 ≈ 96.
              */}
              <IndentGuide
                left={64}
                top={108}
                height={98}
                depth={1}
                delaySec={REVEAL.guideLeft}
                durationSec={0.5}
              />
            </div>
          </FadeIn>

          {/* 콘솔 (좌측) — 6줄. 6 lines × 51 (line-box) + 5 gaps = 336 → height 420 로 */}
          <div style={{ position: "relative" }}>
            <FadeIn delaySec={REVEAL.consoleFade} translateY={14}>
              <ConsolePanel title="출력 결과" width={400} height={420}>
                <ConsoleLine revealAtSec={REVEAL_LEFT_CONSOLE[0]}>
                  <span style={{ fontSize: 26, fontWeight: 700, color: colors.darkInk }}>0</span>
                </ConsoleLine>
                <ConsoleLine revealAtSec={REVEAL_LEFT_CONSOLE[1]}>
                  <span
                    style={{
                      fontSize: 26,
                      fontWeight: 700,
                      color: colors.syntaxString,
                    }}
                  >
                    끝
                  </span>
                </ConsoleLine>
                <ConsoleLine revealAtSec={REVEAL_LEFT_CONSOLE[2]}>
                  <span style={{ fontSize: 26, fontWeight: 700, color: colors.darkInk }}>1</span>
                </ConsoleLine>
                <ConsoleLine revealAtSec={REVEAL_LEFT_CONSOLE[3]}>
                  <span
                    style={{
                      fontSize: 26,
                      fontWeight: 700,
                      color: colors.syntaxString,
                    }}
                  >
                    끝
                  </span>
                </ConsoleLine>
                <ConsoleLine revealAtSec={REVEAL_LEFT_CONSOLE[4]}>
                  <span style={{ fontSize: 26, fontWeight: 700, color: colors.darkInk }}>2</span>
                </ConsoleLine>
                <ConsoleLine revealAtSec={REVEAL_LEFT_CONSOLE[5]}>
                  <span
                    style={{
                      fontSize: 26,
                      fontWeight: 700,
                      color: colors.syntaxString,
                    }}
                  >
                    끝
                  </span>
                </ConsoleLine>
              </ConsolePanel>
            </FadeIn>
            <PulseRing delaySec={REVEAL.consolePulse} />
          </div>

          {/* "끝 — 3번" 라벨 */}
          <FadeIn delaySec={REVEAL.consolePulse} translateY={4}>
            <div
              style={{
                padding: "6px 16px",
                borderRadius: radii.pill,
                background: colors.bgWhite,
                border: `1.5px solid ${colors.accent}`,
                color: colors.accentDeep,
                fontFamily: fonts.sans,
                fontSize: 18,
                fontWeight: 700,
                letterSpacing: "-0.01em",
                boxShadow: shadows.cardSoft,
              }}
            >
              끝 — 3번
            </div>
          </FadeIn>
        </div>

        {/* 우측 — print("끝") 들여쓰기 밖 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 24,
          }}
        >
          <FadeIn delaySec={REVEAL.panelRight} translateY={18}>
            <div style={{ position: "relative" }}>
              <CodePanel fileName="loop-out.py" width={580} height={250}>
                <CodeLine lineNumber={1} revealAtSec={REVEAL.lineR1}>
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
                <CodeLine lineNumber={2} revealAtSec={REVEAL.lineR2}>
                  <PyToken text="    " />
                  <PyToken text="print" kind="func" />
                  <PyToken text="(" kind="op" />
                  <PyToken text="i" kind="name" />
                  <PyToken text=")" kind="op" />
                </CodeLine>
                <CodeLine lineNumber={3} revealAtSec={REVEAL.lineR3}>
                  <PyToken text="print" kind="func" />
                  <PyToken text="(" kind="op" />
                  <PyToken text={'"끝"'} kind="string" />
                  <PyToken text=")" kind="op" />
                </CodeLine>
              </CodePanel>
              {/*
                우측 가이드: 2줄에서만 끊어짐 (3줄은 들여쓰기 밖).
                2줄 시작 ≈ 108, 높이 ≈ 48.
              */}
              <IndentGuide
                left={64}
                top={108}
                height={50}
                depth={1}
                delaySec={REVEAL.guideRight}
                durationSec={0.5}
              />
            </div>
          </FadeIn>

          {/* 콘솔 (우측) — 4줄. 좌측 콘솔과 같은 height 로 정렬 */}
          <div style={{ position: "relative" }}>
            <FadeIn delaySec={REVEAL.consoleFade} translateY={14}>
              <ConsolePanel title="출력 결과" width={400} height={420}>
                <ConsoleLine revealAtSec={REVEAL_RIGHT_CONSOLE[0]}>
                  <span style={{ fontSize: 26, fontWeight: 700, color: colors.darkInk }}>0</span>
                </ConsoleLine>
                <ConsoleLine revealAtSec={REVEAL_RIGHT_CONSOLE[1]}>
                  <span style={{ fontSize: 26, fontWeight: 700, color: colors.darkInk }}>1</span>
                </ConsoleLine>
                <ConsoleLine revealAtSec={REVEAL_RIGHT_CONSOLE[2]}>
                  <span style={{ fontSize: 26, fontWeight: 700, color: colors.darkInk }}>2</span>
                </ConsoleLine>
                <ConsoleLine revealAtSec={REVEAL_RIGHT_CONSOLE[3]}>
                  <span
                    style={{
                      fontSize: 26,
                      fontWeight: 700,
                      color: colors.syntaxString,
                    }}
                  >
                    끝
                  </span>
                </ConsoleLine>
              </ConsolePanel>
            </FadeIn>
            <PulseRing delaySec={REVEAL.consolePulse} />
          </div>

          {/* "끝 — 1번" 라벨 */}
          <FadeIn delaySec={REVEAL.consolePulse} translateY={4}>
            <div
              style={{
                padding: "6px 16px",
                borderRadius: radii.pill,
                background: colors.bgWhite,
                border: `1.5px solid ${colors.accent}`,
                color: colors.accentDeep,
                fontFamily: fonts.sans,
                fontSize: 18,
                fontWeight: 700,
                letterSpacing: "-0.01em",
                boxShadow: shadows.cardSoft,
              }}
            >
              끝 — 1번
            </div>
          </FadeIn>
        </div>
      </div>

      <LowerThird
        text={<>들여쓰기 안 = 루프 안 · 밖 = 루프 밖</>}
        delaySec={REVEAL.lowerThird}
      />
    </PageBackground>
  );
};
