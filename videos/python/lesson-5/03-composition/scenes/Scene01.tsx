/**
 * Scene 1 — 도입: 오늘 배우는 것 (13s)
 *
 * - 좌상단 코스 라벨: "파이썬 기초 · 5강"
 * - 중앙 큰 제목: "조건문"
 * - violet underline
 * - 부제목: "`if` · `elif` · `else` · 중첩"
 * - 우측 하단 회상 카드 (2강 mock): 마름모 도형 + "2강 — 순서도의 마름모 ✓" (opacity 0.6)
 *
 * 5강 특수 시각화: 후반부에 마름모가 살짝 morph 되어 "if" 코드 토큰으로 변화하는
 * 짧은 모션 (1.5초). 1·2·3강과 동일한 차분한 학원 인강 톤 + 5강만의 hook.
 */

import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import {
  AccentUnderline,
  CourseLabel,
  DecisionDiamond,
  FadeIn,
  PageBackground,
} from "../primitives";
import { colors, fonts, radii, shadows } from "../theme";

const easeOutCubic = Easing.bezier(0.16, 1, 0.3, 1);

/**
 * Morph block: 좌측에 큰 마름모 → 우측에 큰 "if" 코드 표기.
 * morphStartSec ~ morphEndSec 동안 마름모 opacity 1→0, if 토큰 opacity 0→1.
 * 시각 hook 1.5초 — 강의 중간에 다시 등장하지 않는 도입 전용.
 */
const MorphHook: React.FC<{ delaySec: number }> = ({ delaySec }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = delaySec * fps;
  const half = start + 0.7 * fps;
  const end = start + 1.4 * fps;

  const diamondOpacity = interpolate(frame, [start, half], [1, 0], {
    easing: easeOutCubic,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ifOpacity = interpolate(frame, [half, end], [0, 1], {
    easing: easeOutCubic,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ifScale = interpolate(frame, [half, end], [0.85, 1.0], {
    easing: easeOutCubic,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "62%",
        transform: "translate(-50%, -50%)",
        width: 260,
        height: 130,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: diamondOpacity,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <DecisionDiamond
          width={260}
          height={130}
          label="조건"
          outline={colors.accent}
          fill={colors.accentSoft}
          textColor={colors.accentInk}
          fontSize={26}
          strokeWidth={3.5}
        />
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: ifOpacity,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${ifScale})`,
        }}
      >
        <div
          style={{
            padding: "20px 36px",
            borderRadius: 14,
            background: colors.darkBg,
            border: `2px solid ${colors.accent}`,
            boxShadow: shadows.card,
            fontFamily: fonts.mono,
            fontSize: 48,
            fontWeight: 700,
            color: colors.syntaxKeyword,
          }}
        >
          if 조건:
        </div>
      </div>
    </div>
  );
};

export const Scene01: React.FC = () => {
  return (
    <PageBackground>
      {/* 좌상단 코스 라벨 */}
      <div style={{ position: "absolute", top: 96, left: 96 }}>
        <FadeIn delaySec={0.2} translateY={6}>
          <CourseLabel>파이썬 기초 · 5강</CourseLabel>
        </FadeIn>
      </div>

      {/* 중앙 큰 제목 */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          paddingTop: 200,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <FadeIn delaySec={0.6} translateY={16}>
          <h1
            style={{
              margin: 0,
              fontFamily: fonts.sans,
              fontSize: 120,
              fontWeight: 800,
              color: colors.ink,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
            }}
          >
            조건문
          </h1>
        </FadeIn>
        <div style={{ height: 28 }} />
        <AccentUnderline width={200} delaySec={1.4} durationSec={0.7} />
        <div style={{ height: 28 }} />
        <FadeIn delaySec={1.8} translateY={10}>
          <p
            style={{
              margin: 0,
              fontFamily: fonts.sans,
              fontSize: 36,
              fontWeight: 500,
              color: colors.inkMuted,
              letterSpacing: "-0.01em",
            }}
          >
            <span style={{ fontFamily: fonts.mono, color: colors.accentDeep }}>if</span> ·{" "}
            <span style={{ fontFamily: fonts.mono, color: colors.accentDeep }}>elif</span> ·{" "}
            <span style={{ fontFamily: fonts.mono, color: colors.accentDeep }}>else</span> · 중첩
          </p>
        </FadeIn>
      </div>

      {/* 중앙 — 마름모 → if 코드 morph hook (5강 도입 전용) */}
      <FadeIn delaySec={4.6} translateY={0} durationSec={0.5}>
        <MorphHook delaySec={4.8} />
      </FadeIn>

      {/* 우측 하단 회상 카드 */}
      <div
        style={{
          position: "absolute",
          bottom: 96,
          right: 96,
          opacity: 0.65,
        }}
      >
        <FadeIn delaySec={2.6} translateY={10}>
          <div
            style={{
              padding: "16px 22px",
              borderRadius: radii.card,
              background: colors.bgWhite,
              border: `1px solid ${colors.border}`,
              boxShadow: shadows.cardSoft,
              display: "flex",
              alignItems: "center",
              gap: 14,
              fontFamily: fonts.sans,
            }}
          >
            {/* 작은 마름모 */}
            <div style={{ flexShrink: 0 }}>
              <DecisionDiamond
                width={56}
                height={36}
                outline={colors.accent}
                fill={colors.accentSoft}
                strokeWidth={2.5}
              />
            </div>
            <div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: colors.accentDeep,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}
              >
                2강 완료
              </div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 600,
                  color: colors.ink,
                  letterSpacing: "-0.01em",
                  marginTop: 2,
                }}
              >
                순서도의 마름모 ✓
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </PageBackground>
  );
};
