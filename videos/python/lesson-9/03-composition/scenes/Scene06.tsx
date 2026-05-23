/**
 * Scene 6 — Active recall: a, b 자리에 무엇이 (14s)
 *
 * - 0~4s: scene-05 의 `def add(a, b): / return a + b` 두 줄 좌측 유지 (dimmed 0.7).
 *         그 아래 새 호출 줄 type-on: `add(10, 20)`. `10`, `20` violet 강조.
 * - 4~7s: 우측에 큰 물음표 박스 두 개 (a / b 라벨). 1.5초 정적 동안 학습자 예측 비트.
 *         R-012 준수: QuestionMark size 130 (단, 양옆 박스 작아 OK — 단독 신호 컷).
 * - 7~10s: 물음표 박스가 차례로 `10`, `20` 으로 swap (각 0.4s 간격).
 *         R-002 준수: ? 의 fade-out 후 0.2s buffer 후 fade-in.
 *         R-004/R-016: narration "정답은 a 가 10" 발화 시점에 reveal 동기 (Stage 3 에서 정밀 wire).
 *         박스 외곽 violet pulse 한 번.
 * - 10~14s: 박스 아래 풀이 라벨 "자리에 차례대로 — 첫째 값 → 첫째 자리".
 *          lower-third "값은 괄호 안 차례 대로 매개변수 자리에 들어간다".
 *
 * Active recall 1회차. 학습 목표 3번 강화.
 */

import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import {
  CodeLine,
  CodePanel,
  FadeIn,
  LowerThird,
  PageBackground,
  PyToken,
} from "../primitives";
import { colors, fonts, radii, shadows } from "../theme";

const REVEAL = {
  codePanel: 0.3,
  line1: 0.5, // def add(a, b): (dimmed)
  line2: 1.0, //     return a + b (dimmed)
  line3: 2.5, // add(10, 20)
  questionA: 4.0, // a 자리 ? 박스
  questionB: 4.5, // b 자리 ? 박스 (stagger)
  // R-004 / R-016 — 정답 reveal 을 실측 audio 발화 시점에 동기 (re-sync):
  //   _scenes/scene-06.a0.mp3 = 8.712s (질문 발화)
  //   _scenes/scene-06.s1.mp3 = 1.567s (정적, 생각 비트)
  //   _scenes/scene-06.a2.mp3 = 6.480s (정답+풀이 발화)
  //   정답 발화 시작 = a0 + s1 = 10.28s, R-004 유효창 ≈ [10.58, 11.90]
  // 질문→정적 구간 [8.71, 10.28] 동안엔 물음표만 보여야 하므로 swap 은 정적 종료(10.28s) 이후.
  // swapA 10.7 → ? fade-out [10.7,11.0], answer fade-in [11.2,11.6]: 정적 구간 보존 + 유효창 안.
  swapA: 10.7, // ? → 10 (a 박스), 실측 발화시점(10.28s) 직후
  swapB: 11.5, // ? → 20 (b 박스, R-002 buffer — a 답 settle 후 stagger 0.8s)
  workoutLabel: 12.8, // 두 답(swapB answer settle 12.4) 직후
  lowerThird: 13.4,
} as const;

export const Scene06: React.FC = () => {
  return (
    <PageBackground>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          padding: "120px 80px 200px",
          gap: 60,
        }}
      >
        {/* 좌측 — 코드 */}
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <FadeIn delaySec={REVEAL.codePanel} translateY={20}>
            <CodePanel fileName="add.py" width={680} height={260}>
              <CodeLine lineNumber={1} revealAtSec={REVEAL.line1} dimmed>
                <PyToken text="def" kind="keyword" />
                <PyToken text=" " />
                <PyToken text="add" kind="name" />
                <PyToken text="(" kind="op" />
                <PyToken text="a" kind="dictKey" />
                <PyToken text=", " kind="op" />
                <PyToken text="b" kind="dictKey" />
                <PyToken text=")" kind="op" />
                <PyToken text=":" kind="op" />
              </CodeLine>
              <CodeLine lineNumber={2} revealAtSec={REVEAL.line2} dimmed>
                <PyToken text="    " />
                <PyToken text="return" kind="keyword" />
                <PyToken text=" " />
                <PyToken text="a" kind="dictKey" />
                <PyToken text=" + " kind="op" />
                <PyToken text="b" kind="dictKey" />
              </CodeLine>
              <CodeLine lineNumber={3} revealAtSec={REVEAL.line3}>
                <PyToken text="add" kind="name" />
                <PyToken text="(" kind="op" />
                <PyToken text="10" kind="number" highlight />
                <PyToken text=", " kind="op" />
                <PyToken text="20" kind="number" highlight />
                <PyToken text=")" kind="op" />
              </CodeLine>
            </CodePanel>
          </FadeIn>
        </div>

        {/* 우측 — a/b 박스 (? → 10/20 swap) */}
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 36,
          }}
        >
          <SwapBox label="a" enterAt={REVEAL.questionA} swapAt={REVEAL.swapA} answer="10" />
          <SwapBox label="b" enterAt={REVEAL.questionB} swapAt={REVEAL.swapB} answer="20" />
        </div>
      </div>

      {/* 풀이 라벨 — 답 직후 fade-in */}
      <div
        style={{
          position: "absolute",
          bottom: 200,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <FadeIn delaySec={REVEAL.workoutLabel} translateY={8}>
          <div
            style={{
              padding: "8px 22px",
              borderRadius: radii.pill,
              background: colors.bgWhite,
              border: `1.5px solid ${colors.accent}`,
              color: colors.accentInk,
              fontFamily: fonts.sans,
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: "-0.01em",
            }}
          >
            자리에 차례대로 — 첫째 값 → 첫째 자리
          </div>
        </FadeIn>
      </div>

      <LowerThird
        text={
          <>
            값은{" "}
            <span style={{ color: colors.accentLight, fontWeight: 700 }}>괄호 안 차례</span> 대로
            매개변수 자리에 들어간다
          </>
        }
        delaySec={REVEAL.lowerThird}
      />
    </PageBackground>
  );
};

/** 큰 박스 — 라벨 위 + ? → answer swap. */
const SwapBox: React.FC<{
  label: string;
  enterAt: number;
  swapAt: number;
  answer: string;
}> = ({ label, enterAt, swapAt, answer }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 등장
  const enter = enterAt * fps;
  const reveal = interpolate(frame, [enter, enter + 0.4 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // R-002: ? fade-out [swapAt, swapAt + 0.3], answer fade-in [swapAt + 0.5, swapAt + 0.9]
  const qFadeOpacity = interpolate(
    frame,
    [swapAt * fps, (swapAt + 0.3) * fps],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const aOpacity = interpolate(
    frame,
    [(swapAt + 0.5) * fps, (swapAt + 0.9) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const aScale = interpolate(
    frame,
    [(swapAt + 0.5) * fps, (swapAt + 1.0) * fps],
    [1.3, 1.0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  // 답 등장 후 외곽 violet pulse
  const pulseStart = (swapAt + 0.9) * fps;
  const pulse = interpolate(
    frame,
    [pulseStart, pulseStart + 0.3 * fps, pulseStart + 0.7 * fps, pulseStart + 1.2 * fps],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        opacity: reveal,
        transform: `translateY(${(1 - reveal) * 10}px)`,
      }}
    >
      {/* 라벨 (a 또는 b) */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          padding: "6px 18px",
          borderRadius: radii.pill,
          background: colors.accentSoft,
          color: colors.accentInk,
          fontFamily: fonts.mono,
          fontSize: 28,
          fontWeight: 800,
          border: `1.5px solid ${colors.accent}`,
          letterSpacing: "-0.01em",
        }}
      >
        {label}
      </div>

      {/* 박스 본체 — ? / answer 겹쳐 swap */}
      <div
        style={{
          position: "relative",
          width: 160,
          height: 130,
          borderRadius: 16,
          background: colors.bgWhite,
          border: `3px solid ${colors.accent}`,
          boxShadow: shadows.card,
          overflow: "hidden",
        }}
      >
        {/* ? layer */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: qFadeOpacity,
            fontFamily: fonts.sans,
            fontSize: 90,
            fontWeight: 900,
            color: colors.accent,
            letterSpacing: "-0.04em",
            lineHeight: 1,
          }}
        >
          ?
        </div>
        {/* answer layer */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: aOpacity,
            transform: `scale(${aScale})`,
            fontFamily: fonts.mono,
            fontSize: 64,
            fontWeight: 900,
            color: colors.accentDeep,
            letterSpacing: "-0.02em",
            lineHeight: 1,
          }}
        >
          {answer}
        </div>
        {/* 외곽 pulse ring */}
        <div
          style={{
            position: "absolute",
            inset: -6,
            borderRadius: 22,
            border: `3px solid ${colors.accent}`,
            opacity: pulse,
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
};
