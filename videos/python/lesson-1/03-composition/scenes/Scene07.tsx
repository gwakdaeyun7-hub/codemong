/**
 * Scene 7 — Add Python to PATH (가장 흔한 좌초 지점) (17s)
 *
 * - 단순화된 설치 마법사 mock 창 (Windows 스타일)
 * - 창 하단 체크박스 두 개:
 *     "Install launcher for all users"
 *     "Add Python to PATH"
 * - 두 번째 체크박스 위에 violet-500 화살표 + 펄스
 * - 체크박스가 자동으로 체크됨 (fade-in ✓)
 * - 우측 작은 라벨: "꼭 체크"
 *
 * 오개념 2번 정면 처리. 비중 있게.
 */

import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { FadeIn, PageBackground } from "../primitives";
import { colors, fonts, radii, shadows } from "../theme";

const CHECK_AT = 4.0; // sec, when ✓ fades in for "Add Python to PATH"
const ARROW_PULSE_FROM = 2.4;

const Checkbox: React.FC<{
  label: string;
  checked?: boolean;
  checkAtSec?: number;
  highlight?: boolean;
}> = ({ label, checked = false, checkAtSec = 0, highlight = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const checkOpacity = checked
    ? interpolate(
        frame,
        [checkAtSec * fps, (checkAtSec + 0.4) * fps],
        [0, 1],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
      )
    : 0;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 18,
        padding: "10px 14px",
        borderRadius: 8,
        background: highlight ? "rgba(139, 92, 246, 0.08)" : "transparent",
        border: highlight ? `2px solid ${colors.accent}` : "2px solid transparent",
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 6,
          border: `2px solid ${highlight ? colors.accent : colors.inkSubtle}`,
          background: colors.bgWhite,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            color: colors.accent,
            fontSize: 26,
            fontWeight: 800,
            lineHeight: 1,
            opacity: checkOpacity,
          }}
        >
          ✓
        </span>
      </div>
      <div
        style={{
          fontFamily: fonts.sans,
          fontSize: 26,
          fontWeight: highlight ? 700 : 500,
          color: colors.ink,
          letterSpacing: "-0.01em",
        }}
      >
        {label}
      </div>
    </div>
  );
};

const PulsingArrow: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const intro = interpolate(
    frame,
    [ARROW_PULSE_FROM * fps, (ARROW_PULSE_FROM + 0.4) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const pulse =
    0.5 +
    0.5 *
      Math.abs(
        Math.sin(((frame - ARROW_PULSE_FROM * fps) / fps) * Math.PI * 1.4),
      );

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        color: colors.accent,
        fontFamily: fonts.sans,
        fontSize: 30,
        fontWeight: 800,
        opacity: intro * (0.6 + 0.4 * pulse),
      }}
    >
      <span style={{ fontSize: 36 }}>→</span>
      <span>꼭 체크</span>
    </div>
  );
};

export const Scene07: React.FC = () => {
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
              fontSize: 28,
              fontWeight: 600,
              color: colors.accentDeep,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              marginBottom: 20,
            }}
          >
            윈도우 설치 — 한 번만 짚을 것
          </div>
        </FadeIn>
        <FadeIn delaySec={0.3} translateY={8}>
          <h2
            style={{
              margin: 0,
              fontFamily: fonts.sans,
              fontSize: 52,
              fontWeight: 800,
              color: colors.ink,
              letterSpacing: "-0.02em",
              marginBottom: 40,
            }}
          >
            Add Python to PATH 체크
          </h2>
        </FadeIn>
        <FadeIn delaySec={0.6} translateY={20}>
          <InstallerWindow />
        </FadeIn>
      </div>
    </PageBackground>
  );
};

const InstallerWindow: React.FC = () => {
  return (
    <div
      style={{
        width: 1100,
        background: colors.bgWhite,
        borderRadius: 12,
        border: `1px solid ${colors.border}`,
        boxShadow: shadows.card,
        overflow: "hidden",
      }}
    >
      {/* title bar */}
      <div
        style={{
          height: 44,
          background: "#f4f4f5",
          borderBottom: `1px solid ${colors.border}`,
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          gap: 10,
          fontFamily: fonts.sans,
          fontSize: 18,
          color: colors.inkMuted,
        }}
      >
        Python 3.12.5 (64-bit) Setup
      </div>
      {/* body */}
      <div
        style={{
          display: "flex",
          alignItems: "stretch",
        }}
      >
        <div
          style={{
            width: 320,
            background: `linear-gradient(180deg, ${colors.accentSoft}, ${colors.bgWhite})`,
            padding: "32px 24px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: fonts.sans,
                fontSize: 22,
                fontWeight: 600,
                color: colors.accentInk,
                marginBottom: 12,
              }}
            >
              Python
            </div>
            <div
              style={{
                fontFamily: fonts.sans,
                fontSize: 16,
                color: colors.inkMuted,
                lineHeight: 1.5,
              }}
            >
              Install Python 3.12 on your computer.
            </div>
          </div>
          <div
            style={{
              fontFamily: fonts.sans,
              fontSize: 14,
              color: colors.inkSubtle,
            }}
          >
            python.org
          </div>
        </div>
        <div
          style={{
            flex: 1,
            padding: "32px 36px",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <div
            style={{
              fontFamily: fonts.sans,
              fontSize: 28,
              fontWeight: 700,
              color: colors.ink,
              letterSpacing: "-0.01em",
              marginBottom: 8,
            }}
          >
            Install Python 3.12.5 (64-bit)
          </div>
          <div
            style={{
              fontFamily: fonts.sans,
              fontSize: 18,
              color: colors.inkMuted,
              marginBottom: 16,
            }}
          >
            Select Install Now to install with default settings.
          </div>
          <Checkbox label="Install launcher for all users (recommended)" checked={false} />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 24,
            }}
          >
            <Checkbox
              label="Add Python to PATH"
              checked
              checkAtSec={CHECK_AT}
              highlight
            />
            <PulsingArrow />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: 28,
              gap: 12,
            }}
          >
            <button
              style={{
                padding: "12px 26px",
                borderRadius: radii.sm,
                border: `1px solid ${colors.border}`,
                background: colors.bgWhite,
                color: colors.inkMuted,
                fontFamily: fonts.sans,
                fontSize: 18,
                fontWeight: 600,
              }}
            >
              Cancel
            </button>
            <button
              style={{
                padding: "12px 26px",
                borderRadius: radii.sm,
                border: "none",
                background: colors.accentDeep,
                color: "#ffffff",
                fontFamily: fonts.sans,
                fontSize: 18,
                fontWeight: 700,
              }}
            >
              Install Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
