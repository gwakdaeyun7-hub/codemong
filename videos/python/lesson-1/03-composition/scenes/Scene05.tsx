/**
 * Scene 5 — 언어와 에디터는 다르다 (17s)
 *
 * - 좌측 박스: "Python" + 부제 "언어"
 * - 우측 박스: "VS Code" + 부제 "에디터 (도구)"
 * - 두 박스 사이 회색 구분선
 * - 1.5초 정적 동안 박스 위에 작은 물음표 → 정적 후 사라지고 violet-500 강조
 *
 * Active recall beat: 학습자가 답을 생각할 시간 확보. 화면에는 영문 원어,
 * narration 은 음역.
 */

import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import {
  Card,
  CenteredStage,
  FadeIn,
  PageBackground,
  easeOutCubic,
} from "../primitives";
import { colors, fonts, radii, shadows } from "../theme";

// Beats (relative to scene local frame, in seconds):
//   0.4s: 박스 fade-in
//   1.5s: 물음표 등장
//   3.0s ~ 4.5s: 정적 (사용자 회상 시간)
//   4.8s: 물음표 사라지고 violet 외곽선 강조
const QMARK_IN = 1.5;
const QMARK_OUT = 4.8;
const HIGHLIGHT_AT = 4.8;

const ConceptBox: React.FC<{
  title: string;
  subtitle: string;
  delaySec: number;
  highlightAt: number;
  questionMark: boolean;
}> = ({ title, subtitle, delaySec, highlightAt, questionMark }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const ringProgress = interpolate(
    frame,
    [highlightAt * fps, (highlightAt + 0.6) * fps],
    [0, 1],
    {
      easing: easeOutCubic,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  const ringOpacity = interpolate(
    frame,
    [
      highlightAt * fps,
      (highlightAt + 0.6) * fps,
      (highlightAt + 1.6) * fps,
      (highlightAt + 2.4) * fps,
    ],
    [0, 1, 1, 0.4],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const qIn = interpolate(
    frame,
    [QMARK_IN * fps, (QMARK_IN + 0.4) * fps],
    [0, 1],
    { easing: easeOutCubic, extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const qOut = interpolate(
    frame,
    [QMARK_OUT * fps, (QMARK_OUT + 0.3) * fps],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const qOpacity = qIn * qOut;

  return (
    <div style={{ position: "relative" }}>
      {/* highlight ring */}
      <div
        style={{
          position: "absolute",
          inset: -10,
          borderRadius: radii.card + 10,
          border: `4px solid ${colors.accent}`,
          opacity: ringOpacity,
          transform: `scale(${0.96 + 0.04 * ringProgress})`,
          pointerEvents: "none",
        }}
      />
      <FadeIn delaySec={delaySec} translateY={20}>
        <Card style={{ width: 420, padding: "56px 40px", textAlign: "center" }}>
          <div
            style={{
              fontFamily: fonts.mono,
              fontSize: 72,
              fontWeight: 800,
              color: colors.ink,
              letterSpacing: "-0.02em",
              marginBottom: 12,
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontFamily: fonts.sans,
              fontSize: 28,
              fontWeight: 500,
              color: colors.inkMuted,
              letterSpacing: "-0.01em",
            }}
          >
            {subtitle}
          </div>
        </Card>
      </FadeIn>
      {questionMark ? (
        <div
          style={{
            position: "absolute",
            top: -40,
            right: -28,
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: colors.bgWhite,
            border: `3px solid ${colors.accent}`,
            color: colors.accent,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: fonts.sans,
            fontSize: 44,
            fontWeight: 800,
            boxShadow: shadows.card,
            opacity: qOpacity,
          }}
        >
          ?
        </div>
      ) : null}
    </div>
  );
};

export const Scene05: React.FC = () => {
  return (
    <PageBackground>
      <CenteredStage>
        <FadeIn delaySec={0.1} translateY={6}>
          <div
            style={{
              fontFamily: fonts.sans,
              fontSize: 30,
              fontWeight: 600,
              color: colors.accentDeep,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              marginBottom: 14,
            }}
          >
            잠깐 — 같은 걸까요?
          </div>
        </FadeIn>
        <FadeIn delaySec={0.3} translateY={8}>
          <h2
            style={{
              margin: 0,
              fontFamily: fonts.sans,
              fontSize: 56,
              fontWeight: 800,
              color: colors.ink,
              letterSpacing: "-0.02em",
              marginBottom: 64,
            }}
          >
            파이썬과 브이에스 코드는 다릅니다
          </h2>
        </FadeIn>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 48,
          }}
        >
          <ConceptBox
            title="Python"
            subtitle="언어"
            delaySec={0.6}
            highlightAt={HIGHLIGHT_AT}
            questionMark
          />
          <div
            style={{
              width: 80,
              height: 2,
              background: colors.border,
            }}
          />
          <ConceptBox
            title="VS Code"
            subtitle="에디터 (도구)"
            delaySec={0.85}
            highlightAt={HIGHLIGHT_AT}
            questionMark
          />
        </div>
      </CenteredStage>
    </PageBackground>
  );
};
