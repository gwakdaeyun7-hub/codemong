/**
 * Scene 4 — 세 단계의 다리 (17s)
 *
 * - 좌측 끝: "문제" 박스 (앞 scene 에서 이어짐)
 * - 우측 끝: "코드" 박스
 * - 두 박스 사이 가로로 3개 박스가 0.4초 간격 fade-in:
 *     박스 1: "자연어"
 *     박스 2: "의사코드"
 *     박스 3: "순서도"
 * - 박스들 위로 violet-500 화살표가 좌→우로 한 번 흐르는 애니메이션
 *
 * 영상 전체의 mental model 박스 — 이후 scene 들에서 반복 등장.
 */

import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import {
  Card,
  CenteredStage,
  FadeIn,
  PageBackground,
  StaticArrow,
  easeInOut,
} from "../primitives";
import { colors, fonts } from "../theme";

const FLOW_AT = 3.4; // sec — violet 화살표가 좌→우로 흐르기 시작
const FLOW_DURATION = 1.4;

const EndCapBox: React.FC<{ label: string; delaySec: number }> = ({
  label,
  delaySec,
}) => (
  <FadeIn delaySec={delaySec} translateY={16}>
    <Card style={{ width: 200, padding: "44px 28px", textAlign: "center" }}>
      <div
        style={{
          fontFamily: fonts.sans,
          fontSize: 44,
          fontWeight: 800,
          color: colors.ink,
          letterSpacing: "-0.02em",
        }}
      >
        {label}
      </div>
    </Card>
  </FadeIn>
);

const StageBox: React.FC<{ label: string; delaySec: number }> = ({
  label,
  delaySec,
}) => (
  <FadeIn delaySec={delaySec} translateY={16}>
    <div
      style={{
        width: 220,
        padding: "32px 20px",
        borderRadius: 18,
        background: colors.accentSoft,
        border: `2px solid ${colors.accent}`,
        color: colors.accentInk,
        textAlign: "center",
        fontFamily: fonts.sans,
        fontSize: 30,
        fontWeight: 700,
        letterSpacing: "-0.01em",
      }}
    >
      {label}
    </div>
  </FadeIn>
);

/**
 * 화살표 위로 흐르는 violet 점 (학습 흐름 시각화).
 * scene local frame 기준 FLOW_AT 부터 좌→우 한 번.
 */
const FlowingDot: React.FC<{ x0: number; x1: number; y: number }> = ({
  x0,
  x1,
  y,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = FLOW_AT * fps;
  const end = start + FLOW_DURATION * fps;
  const t = interpolate(frame, [start, end], [0, 1], {
    easing: easeInOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeIn = interpolate(frame, [start, start + 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(frame, [end - 8, end], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = fadeIn * fadeOut;
  return (
    <div
      style={{
        position: "absolute",
        top: y - 10,
        left: x0 + (x1 - x0) * t - 10,
        width: 20,
        height: 20,
        borderRadius: "50%",
        background: colors.accent,
        boxShadow: `0 0 16px ${colors.accent}`,
        opacity,
      }}
    />
  );
};

export const Scene04: React.FC = () => {
  return (
    <PageBackground>
      <CenteredStage paddingY={120}>
        <FadeIn delaySec={0.1} translateY={6}>
          <div
            style={{
              fontFamily: fonts.sans,
              fontSize: 30,
              fontWeight: 600,
              color: colors.accentDeep,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              marginBottom: 56,
            }}
          >
            세 단계의 다리
          </div>
        </FadeIn>
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            gap: 24,
          }}
        >
          {/* 좌측 끝 — 문제 */}
          <EndCapBox label="문제" delaySec={0.3} />

          <FadeIn delaySec={0.6}>
            <StaticArrow width={48} color={colors.inkSubtle} thickness={3} />
          </FadeIn>

          {/* 세 단계 박스 */}
          <StageBox label="자연어" delaySec={1.0} />
          <FadeIn delaySec={1.3}>
            <StaticArrow width={40} color={colors.accent} thickness={3} />
          </FadeIn>
          <StageBox label="의사코드" delaySec={1.4} />
          <FadeIn delaySec={1.7}>
            <StaticArrow width={40} color={colors.accent} thickness={3} />
          </FadeIn>
          <StageBox label="순서도" delaySec={1.8} />

          <FadeIn delaySec={2.2}>
            <StaticArrow width={48} color={colors.inkSubtle} thickness={3} />
          </FadeIn>

          {/* 우측 끝 — 코드 */}
          <EndCapBox label="코드" delaySec={2.5} />

          {/*
            Flowing dot — 화살표 라인 위쪽으로 좌→우 한 번 흐르기.
            x 좌표는 박스/화살표 폭 기준 대략값. (1920 width 기준)
          */}
          <FlowingDot x0={20} x1={1700} y={-40} />
        </div>
      </CenteredStage>
    </PageBackground>
  );
};
