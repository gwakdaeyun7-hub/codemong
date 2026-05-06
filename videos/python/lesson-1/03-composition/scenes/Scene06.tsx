/**
 * Scene 6 — 파이썬 설치 (python.org) (22s)
 *
 * - 단순화된 mock 브라우저 프레임 (실제 캡처 X)
 * - 주소창에 "python.org"
 * - 페이지 중앙에 "Download Python 3" 큰 버튼 mock
 * - 버튼 아래 운영체제 라벨: "Windows" / "macOS" 0.5초 간격 fade-in
 * - 버튼은 부드럽게 한 번 깜박 (강조)
 */

import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { BrowserMock, FadeIn, PageBackground } from "../primitives";
import { colors, fonts, radii, shadows } from "../theme";

const PULSE_AT = 4.5; // sec

const DownloadButton: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pulse = interpolate(
    frame,
    [PULSE_AT * fps, (PULSE_AT + 0.4) * fps, (PULSE_AT + 0.8) * fps],
    [1, 1.06, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const glow = interpolate(
    frame,
    [PULSE_AT * fps, (PULSE_AT + 0.4) * fps, (PULSE_AT + 0.9) * fps],
    [0, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <div
      style={{
        padding: "26px 56px",
        borderRadius: radii.card,
        background: `linear-gradient(180deg, ${colors.accent}, ${colors.accentDeep})`,
        color: "#ffffff",
        fontFamily: fonts.sans,
        fontSize: 44,
        fontWeight: 800,
        letterSpacing: "-0.02em",
        boxShadow: `${shadows.card}, 0 0 0 ${8 * glow}px rgba(139, 92, 246, ${0.25 * glow})`,
        transform: `scale(${pulse})`,
      }}
    >
      Download Python 3
    </div>
  );
};

export const Scene06: React.FC = () => {
  return (
    <PageBackground>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: 200,
        }}
      >
        <FadeIn delaySec={0.1} translateY={6}>
          <div
            style={{
              fontFamily: fonts.sans,
              fontSize: 30,
              fontWeight: 700,
              color: colors.ink,
              letterSpacing: "-0.01em",
              marginBottom: 24,
            }}
          >
            공식 사이트 — python.org
          </div>
        </FadeIn>
        <FadeIn delaySec={0.4} translateY={20}>
          <BrowserMock url="python.org" width={1280} height={680}>
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 28,
              }}
            >
              <FadeIn delaySec={1.4} translateY={10}>
                <div
                  style={{
                    fontFamily: fonts.sans,
                    fontSize: 36,
                    fontWeight: 600,
                    color: colors.ink,
                    letterSpacing: "-0.01em",
                  }}
                >
                  Python 3 다운로드
                </div>
              </FadeIn>
              <FadeIn delaySec={1.8} translateY={14}>
                <DownloadButton />
              </FadeIn>
              <div
                style={{
                  display: "flex",
                  gap: 24,
                  marginTop: 24,
                  alignItems: "center",
                }}
              >
                <FadeIn delaySec={3.0} translateY={8}>
                  <OsPill label="Windows" />
                </FadeIn>
                <FadeIn delaySec={3.5} translateY={8}>
                  <OsPill label="macOS" />
                </FadeIn>
              </div>
            </div>
          </BrowserMock>
        </FadeIn>
      </div>
    </PageBackground>
  );
};

const OsPill: React.FC<{ label: string }> = ({ label }) => (
  <div
    style={{
      padding: "12px 28px",
      borderRadius: radii.pill,
      background: colors.bgWhite,
      border: `2px solid ${colors.border}`,
      color: colors.ink,
      fontFamily: fonts.sans,
      fontSize: 28,
      fontWeight: 600,
      letterSpacing: "-0.01em",
    }}
  >
    {label}
  </div>
);
