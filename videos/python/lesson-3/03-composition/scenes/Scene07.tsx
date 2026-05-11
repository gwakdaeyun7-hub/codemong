/**
 * Scene 7 — Active recall: 어느 자료형일까 (14.52s)
 *
 * - 화면 가로로 4개 박스, 위에서 아래로 fade-in
 *     박스 1: `5`
 *     박스 2: `3.14`
 *     박스 3: `"안녕"`
 *     박스 4: `True`
 * - 1.5초 정적 동안 박스 위에 큰 물음표 아이콘
 * - 정적 후: 각 박스 아래에 라벨이 차례로 fade-in (좌→우, 0.8초 간격)
 *     라벨: "숫자" / "숫자" / "문자열" / "불린" (정답 라벨은 violet-500)
 *
 * Active recall 비트. 1·2강과 동일한 1.5초 정적 패턴 — 학습자가 답을 떠올릴 시간.
 *
 * 실제 narration 타이밍 (mutagen 으로 측정, 2025-05-11):
 *   a0 (전반부 narration): 0.0 ~ 5.4   "여기서 잠깐. 화면에 뜬 네 가지 값..."
 *   s1 (정적):              5.4 ~ 6.94  학습자가 답을 떠올릴 시간 (1.541s)
 *   a2 (후반부 narration):  6.94 ~ 14.16 "왼쪽부터 숫자, 숫자, 문자열, 그리고 불린이에요"
 *
 * 따라서 시각 타이밍은:
 *   0.4 ~ 1.6 : 박스 4개 fade-in (각 0.2초 간격)
 *   1.6 ~ 4.5 : 박스만 보임 (학습자 사고 시작)
 *   4.5 ~ 5.0 : 큰 물음표 fade-in (정적 진입 직전)
 *   5.0 ~ 6.4 : 물음표 표시 (정적 윈도우 중심에 정렬)
 *   6.4 ~ 6.8 : 물음표 fade-out (정적 끝나갈 무렵)
 *   6.9 ~ 9.3 : 정답 라벨 차례로 fade-in (4개, 각 0.8초 간격 — a2 narration 호흡 맞춤)
 */

import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import {
  CenteredStage,
  FadeIn,
  PageBackground,
  PyToken,
  easeOutCubic,
} from "../primitives";
import { colors, fonts, radii, shadows } from "../theme";

const QMARK_IN = 4.5;
const QMARK_OUT = 6.4;
const REVEAL_AT = 6.9; // 정답 라벨 시작 — a2 narration 시작 직후
const LABEL_GAP = 0.8; // 라벨 간격 — a2 단어별 호흡에 맞춤

type Q = {
  value: React.ReactNode;
  answer: string;
};

const items: Q[] = [
  { value: <PyToken text="5" kind="number" />, answer: "숫자" },
  { value: <PyToken text="3.14" kind="number" />, answer: "숫자" },
  { value: <PyToken text={'"안녕"'} kind="string" />, answer: "문자열" },
  { value: <PyToken text="True" kind="keyword" />, answer: "불린" },
];

const QBox: React.FC<{
  value: React.ReactNode;
  answer: string;
  index: number;
}> = ({ value, answer, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const labelStart = REVEAL_AT + index * LABEL_GAP;
  const reveal = interpolate(
    frame,
    [labelStart * fps, (labelStart + 0.45) * fps],
    [0, 1],
    {
      easing: easeOutCubic,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
  return (
    <FadeIn delaySec={0.4 + index * 0.2} translateY={20}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 14,
        }}
      >
        {/* 값 박스 (어두운 배경 + monospace) */}
        <div
          style={{
            width: 280,
            height: 140,
            background: colors.darkBg,
            borderRadius: 16,
            border: `2px solid ${colors.darkBg2}`,
            boxShadow: shadows.card,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: fonts.mono,
            fontSize: 46,
            fontWeight: 700,
          }}
        >
          {value}
        </div>
        {/* 정답 라벨 — REVEAL_AT 이후 차례로 */}
        <div
          style={{
            opacity: reveal,
            transform: `translateY(${(1 - reveal) * 8}px)`,
            padding: "10px 20px",
            borderRadius: radii.pill,
            background: colors.accentSoft,
            border: `2px solid ${colors.accent}`,
            color: colors.accentDeep,
            fontFamily: fonts.sans,
            fontSize: 26,
            fontWeight: 800,
            letterSpacing: "-0.01em",
          }}
        >
          {answer}
        </div>
      </div>
    </FadeIn>
  );
};

const BigQuestionMark: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opIn = interpolate(
    frame,
    [QMARK_IN * fps, (QMARK_IN + 0.5) * fps],
    [0, 1],
    {
      easing: easeOutCubic,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
  const opOut = interpolate(
    frame,
    [QMARK_OUT * fps, (QMARK_OUT + 0.4) * fps],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const opacity = opIn * opOut;
  const breath = 1 + Math.sin((frame / fps) * 2.4) * 0.03;
  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: `translate(-50%, -50%) scale(${breath})`,
        opacity,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: "50%",
          background: colors.accentSoft,
          border: `5px solid ${colors.accent}`,
          color: colors.accentDeep,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: fonts.sans,
          fontSize: 110,
          fontWeight: 800,
          boxShadow: shadows.card,
        }}
      >
        ?
      </div>
    </div>
  );
};

export const Scene07: React.FC = () => {
  return (
    <PageBackground>
      <CenteredStage paddingY={100}>
        <FadeIn delaySec={0.1} translateY={6}>
          <div
            style={{
              fontFamily: fonts.sans,
              fontSize: 30,
              fontWeight: 600,
              color: colors.accentDeep,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              marginBottom: 36,
            }}
          >
            잠깐 — 어느 자료형일까요?
          </div>
        </FadeIn>
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "flex-start",
            gap: 36,
          }}
        >
          {items.map((item, i) => (
            <QBox key={i} value={item.value} answer={item.answer} index={i} />
          ))}
          {/* 정적 동안 큰 물음표 — 박스들 위로 absolute 중앙 */}
          <BigQuestionMark />
        </div>
      </CenteredStage>
    </PageBackground>
  );
};
