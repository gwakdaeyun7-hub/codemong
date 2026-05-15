/**
 * Scene 9 — `for` vs `while` 선택 기준 한 줄 (12s)
 *
 * 학습 목표 4번. lesson-5 scene-05 의 좌우 분할 패턴 재활용 — 시리즈 통일성.
 *
 * - 0~6s: 화면 중앙 좌우 분할 카드
 *     좌측 카드: 큰 글씨 `for` + "횟수가 정해짐" + 예시 "1부터 10까지의 합" (작게)
 *     우측 카드: 큰 글씨 `while` + "조건 만족 동안" + 예시 "암호 맞을 때까지" (작게)
 *     두 카드 사이 회색 구분선
 * - 6~12s: lower-third "정해진 횟수 = `for` · 조건 동안 = `while`"
 *     양쪽 카드 헤더 차례로 한 번 펄스
 */

import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { CenteredStage, FadeIn, LowerThird, PageBackground } from "../primitives";
import { colors, fonts, radii, shadows } from "../theme";

const REVEAL = {
  forCard: 0.4,
  whileCard: 1.0,
  forPulse: 6.0,
  whilePulse: 7.0,
  lowerThird: 7.5,
} as const;

/** 헤더 텍스트가 한 번 violet 으로 펄스. */
const PulseText: React.FC<{
  text: string;
  delaySec: number;
  baseColor: string;
  pulseColor: string;
}> = ({ text, delaySec, baseColor, pulseColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = delaySec * fps;
  const blend = interpolate(
    frame,
    [start, start + 0.3 * fps, start + 0.8 * fps, start + 1.2 * fps],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  // 색은 단순 toggle (blend > 0.5 면 pulseColor)
  const color = blend > 0.5 ? pulseColor : baseColor;
  return (
    <span
      style={{
        color,
        textShadow: blend > 0.05 ? `0 0 24px rgba(139, 92, 246, ${blend * 0.4})` : "none",
      }}
    >
      {text}
    </span>
  );
};

const ChoicePanel: React.FC<{
  keyword: string;
  rule: React.ReactNode;
  example: string;
  pulseDelaySec: number;
  delaySec: number;
  emphasize?: boolean;
}> = ({ keyword, rule, example, pulseDelaySec, delaySec, emphasize = false }) => {
  return (
    <FadeIn delaySec={delaySec} translateY={18}>
      <div
        style={{
          width: 540,
          background: colors.bgWhite,
          borderRadius: radii.card,
          border: `2.5px solid ${emphasize ? colors.accent : colors.border}`,
          boxShadow: shadows.card,
          padding: "44px 40px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
        }}
      >
        <div
          style={{
            fontFamily: fonts.mono,
            fontSize: 84,
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1,
          }}
        >
          <PulseText
            text={keyword}
            delaySec={pulseDelaySec}
            baseColor={colors.ink}
            pulseColor={colors.accentDeep}
          />
        </div>
        <div
          style={{
            fontFamily: fonts.sans,
            fontSize: 28,
            fontWeight: 600,
            color: colors.inkSoft,
            letterSpacing: "-0.01em",
            textAlign: "center",
          }}
        >
          {rule}
        </div>
        <div
          style={{
            marginTop: 12,
            padding: "8px 18px",
            borderRadius: radii.pill,
            background: colors.borderSoft,
            border: `1px solid ${colors.border}`,
            fontFamily: fonts.sans,
            fontSize: 16,
            fontWeight: 600,
            color: colors.inkMuted,
            letterSpacing: "-0.01em",
          }}
        >
          예: {example}
        </div>
      </div>
    </FadeIn>
  );
};

export const Scene09: React.FC = () => {
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
              marginBottom: 44,
            }}
          >
            어느 쪽을 쓸까?
          </div>
        </FadeIn>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 28,
          }}
        >
          <ChoicePanel
            keyword="for"
            rule={
              <>
                횟수가 <span style={{ fontWeight: 800 }}>정해짐</span>
              </>
            }
            example="1부터 10까지의 합"
            pulseDelaySec={REVEAL.forPulse}
            delaySec={REVEAL.forCard}
            emphasize
          />

          <FadeIn delaySec={REVEAL.forCard + 0.4} translateY={0}>
            <div
              style={{
                width: 2,
                height: 320,
                background: colors.border,
                borderRadius: 1,
                opacity: 0.7,
              }}
            />
          </FadeIn>

          <ChoicePanel
            keyword="while"
            rule={
              <>
                조건 만족 <span style={{ fontWeight: 800 }}>동안</span>
              </>
            }
            example="암호 맞을 때까지"
            pulseDelaySec={REVEAL.whilePulse}
            delaySec={REVEAL.whileCard}
            emphasize
          />
        </div>
      </CenteredStage>

      <LowerThird
        text={
          <>
            정해진 횟수 ={" "}
            <span style={{ fontFamily: fonts.mono, color: colors.accentLight }}>for</span>
            {" · "}
            조건 동안 ={" "}
            <span style={{ fontFamily: fonts.mono, color: colors.accentLight }}>while</span>
          </>
        }
        delaySec={REVEAL.lowerThird}
      />
    </PageBackground>
  );
};
