/**
 * Scene 6 — Active recall: 토탈은 얼마일까 (12s)
 *
 * `range(1, 11)` → `range(1, 4)` 로 바꾼 코드. 1.8초 정적 후 정답 6.
 *
 * - 0~4s: 화면 좌측에 scene-05 의 코드 4줄 다시 등장하되 둘째 줄이
 *         `for i in range(1, 4):` 로 바뀜. `(1, 4)` 부분 violet 강조.
 * - 4~6s: 코드 우측에 큰 물음표 박스 (정적 1.8초)
 * - 6~9s: 물음표 → `6` 으로 swap (scale up 0.3s, violet)
 * - 9~12s: 박스 아래 풀이 라벨 "1 + 2 + 3 = 6" + 회색 작은 글씨 "끝값 4는 포함 안 됨"
 *
 * lesson-5/4 와 동일한 1.8초 정적 패턴 (active recall 비트).
 */

import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import {
  CodeLine,
  CodePanel,
  FadeIn,
  PageBackground,
  PyToken,
  QuestionMark,
} from "../primitives";
import { colors, fonts, radii, shadows } from "../theme";

const easeOutCubic = Easing.bezier(0.16, 1, 0.3, 1);

const REVEAL = {
  panel: 0.3,
  line1: 0.7,
  line2: 1.3,
  line3: 2.0,
  line4: 2.7,
  questionMark: 4.0,
  answerSwap: 10.5, // narration "정답은 6입니다" 와 동기 (1:44~1:45 real)
  workout: 13.5, // narration "1 더하기 2 더하기 3은 6입니다" 부근
} as const;

/** 정답 박스: 물음표 → `6` 으로 swap. */
const AnswerBox: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const swapStart = REVEAL.answerSwap * fps;
  const opacity = interpolate(frame, [swapStart, swapStart + 0.3 * fps], [0, 1], {
    easing: easeOutCubic,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scale = interpolate(frame, [swapStart, swapStart + 0.4 * fps], [1.4, 1.0], {
    easing: easeOutCubic,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale})`,
        fontFamily: fonts.mono,
        fontSize: 180,
        fontWeight: 900,
        color: colors.accentDeep,
        letterSpacing: "-0.04em",
        lineHeight: 1,
        textShadow: "0 6px 24px rgba(139, 92, 246, 0.30)",
      }}
    >
      6
    </div>
  );
};

export const Scene06: React.FC = () => {
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
            잠깐 — total 은 얼마일까?
          </div>
        </FadeIn>
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          padding: "120px 80px 80px",
          gap: 50,
        }}
      >
        {/* 좌측 — 변형 코드 */}
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <FadeIn delaySec={REVEAL.panel} translateY={20}>
            <CodePanel fileName="sum.py" width={680} height={300}>
              <CodeLine lineNumber={1} revealAtSec={REVEAL.line1}>
                <PyToken text="total" kind="name" />
                <PyToken text=" " />
                <PyToken text="=" kind="op" />
                <PyToken text=" " />
                <PyToken text="0" kind="number" />
              </CodeLine>
              <CodeLine lineNumber={2} revealAtSec={REVEAL.line2}>
                <PyToken text="for" kind="keyword" />
                <PyToken text=" " />
                <PyToken text="i" kind="name" />
                <PyToken text=" " />
                <PyToken text="in" kind="keyword" />
                <PyToken text=" " />
                <PyToken text="range" kind="func" />
                <PyToken text="(" kind="op" highlight />
                <PyToken text="1" kind="number" highlight />
                <PyToken text=", " kind="op" highlight />
                <PyToken text="4" kind="number" highlight />
                <PyToken text=")" kind="op" highlight />
                <PyToken text=":" kind="op" />
              </CodeLine>
              <CodeLine lineNumber={3} revealAtSec={REVEAL.line3}>
                <PyToken text="    " />
                <PyToken text="total" kind="name" />
                <PyToken text=" " />
                <PyToken text="=" kind="op" />
                <PyToken text=" " />
                <PyToken text="total" kind="name" />
                <PyToken text=" " />
                <PyToken text="+" kind="op" />
                <PyToken text=" " />
                <PyToken text="i" kind="name" />
              </CodeLine>
              <CodeLine lineNumber={4} revealAtSec={REVEAL.line4}>
                <PyToken text="print" kind="func" />
                <PyToken text="(" kind="op" />
                <PyToken text="total" kind="name" />
                <PyToken text=")" kind="op" />
              </CodeLine>
            </CodePanel>
          </FadeIn>
        </div>

        {/* 우측 — 물음표 박스 / 정답 */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 24,
          }}
        >
          <FadeIn delaySec={REVEAL.panel + 0.2} translateY={14}>
            <div
              style={{
                width: 320,
                height: 240,
                background: colors.bgWhite,
                border: `3px solid ${colors.accent}`,
                borderRadius: radii.card,
                boxShadow: shadows.card,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* 물음표 (정적 동안만 표시) */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <QuestionMark
                  delaySec={REVEAL.questionMark}
                  lifespanSec={6.5}
                  size={140}
                  color={colors.accent}
                />
              </div>
              {/* 정답 6 */}
              <AnswerBox />
            </div>
          </FadeIn>

          {/* 풀이 라벨 */}
          <FadeIn delaySec={REVEAL.workout} translateY={8}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 6,
                paddingLeft: 8,
              }}
            >
              <div
                style={{
                  fontFamily: fonts.mono,
                  fontSize: 32,
                  fontWeight: 700,
                  color: colors.ink,
                  letterSpacing: "-0.01em",
                }}
              >
                1 + 2 + 3 ={" "}
                <span style={{ color: colors.accentDeep, fontWeight: 800 }}>6</span>
              </div>
              <div
                style={{
                  fontFamily: fonts.sans,
                  fontSize: 18,
                  fontWeight: 500,
                  color: colors.inkMuted,
                  letterSpacing: "-0.01em",
                }}
              >
                끝값 4는 포함 안 됨
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </PageBackground>
  );
};
