/**
 * Scene 7 — `while` 도입: 횟수가 정해지지 않은 반복 (10s)
 *
 * 학습 목표 3번 진입. 입력 사항 §7 본문 시나리오 (`while` = 암호 맞을 때까지) 그대로.
 *
 * - 0~5s: 화면 좌측 시나리오 카드 — "암호 입력 → 틀리면 다시 → 맞으면 끝"
 * - 5~10s: 화면 우측 비교 도식
 *     위 박스: "`for` — 횟수가 정해진 반복" (옅은 회색)
 *     아래 박스: "`while` — 조건이 참인 동안 반복" (violet 강조)
 *     아래 박스 한 번 펄스
 */

import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { FadeIn, PageBackground } from "../primitives";
import { colors, fonts, radii, shadows } from "../theme";

const REVEAL = {
  scenarioCard: 0.3,
  scenarioStep1: 0.9,
  scenarioStep2: 1.4,
  scenarioStep3: 1.9,
  forBox: 5.0,
  whileBox: 5.6,
  whilePulse: 7.0,
} as const;

const ScenarioStep: React.FC<{ delaySec: number; text: string; isLast?: boolean }> = ({
  delaySec,
  text,
  isLast = false,
}) => {
  return (
    <FadeIn delaySec={delaySec} translateY={6}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <span
          style={{
            width: 14,
            height: 14,
            borderRadius: "50%",
            background: isLast ? colors.accent : colors.accentLight,
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontFamily: fonts.sans,
            fontSize: 28,
            fontWeight: 600,
            color: colors.ink,
            letterSpacing: "-0.01em",
          }}
        >
          {text}
        </span>
      </div>
    </FadeIn>
  );
};

/** while 박스 한 번 펄스 — 외곽선 두께가 잠깐 두꺼워졌다가 돌아옴. */
const PulseRing: React.FC<{ delaySec: number }> = ({ delaySec }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = delaySec * fps;
  const opacity = interpolate(
    frame,
    [start, start + 0.3 * fps, start + 0.9 * fps, start + 1.3 * fps],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return (
    <div
      style={{
        position: "absolute",
        inset: -8,
        borderRadius: 28,
        border: `4px solid ${colors.accent}`,
        opacity,
        pointerEvents: "none",
      }}
    />
  );
};

export const Scene07: React.FC = () => {
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
            횟수가 정해지지 않은 반복
          </div>
        </FadeIn>
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          padding: "120px 100px 100px",
          gap: 50,
        }}
      >
        {/* 좌측 — 시나리오 카드 */}
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <FadeIn delaySec={REVEAL.scenarioCard} translateY={18}>
            <div
              style={{
                width: 600,
                background: colors.bgWhite,
                borderRadius: radii.card,
                border: `1.5px solid ${colors.border}`,
                boxShadow: shadows.card,
                padding: "40px 44px",
                display: "flex",
                flexDirection: "column",
                gap: 28,
              }}
            >
              <div
                style={{
                  fontFamily: fonts.sans,
                  fontSize: 22,
                  fontWeight: 700,
                  color: colors.accentDeep,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}
              >
                시나리오 — 암호 맞을 때까지
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 18,
                }}
              >
                <ScenarioStep delaySec={REVEAL.scenarioStep1} text="암호 입력" />
                <ScenarioStep delaySec={REVEAL.scenarioStep2} text="틀리면 다시" />
                <ScenarioStep delaySec={REVEAL.scenarioStep3} text="맞으면 끝" isLast />
              </div>
            </div>
          </FadeIn>
        </div>

        {/* 우측 — for vs while 비교 박스 */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 24,
          }}
        >
          {/* for 박스 (옅게) */}
          <FadeIn delaySec={REVEAL.forBox} translateY={10}>
            <div
              style={{
                width: 540,
                background: colors.borderSoft,
                border: `1.5px solid ${colors.border}`,
                borderRadius: 22,
                padding: "22px 28px",
                opacity: 0.75,
              }}
            >
              <div
                style={{
                  fontFamily: fonts.mono,
                  fontSize: 38,
                  fontWeight: 800,
                  color: colors.inkMuted,
                  letterSpacing: "-0.02em",
                  marginBottom: 6,
                }}
              >
                for
              </div>
              <div
                style={{
                  fontFamily: fonts.sans,
                  fontSize: 22,
                  fontWeight: 600,
                  color: colors.inkMuted,
                  letterSpacing: "-0.01em",
                }}
              >
                횟수가 <span style={{ fontWeight: 800 }}>정해진</span> 반복
              </div>
            </div>
          </FadeIn>

          {/* 분리선 */}
          <div
            style={{
              width: 480,
              height: 1.5,
              background: colors.border,
              opacity: 0.6,
            }}
          />

          {/* while 박스 (강조) */}
          <FadeIn delaySec={REVEAL.whileBox} translateY={10}>
            <div style={{ position: "relative" }}>
              <div
                style={{
                  width: 540,
                  background: colors.bgWhite,
                  border: `2.5px solid ${colors.accent}`,
                  borderRadius: 22,
                  padding: "22px 28px",
                  boxShadow: shadows.card,
                }}
              >
                <div
                  style={{
                    fontFamily: fonts.mono,
                    fontSize: 38,
                    fontWeight: 800,
                    color: colors.accentDeep,
                    letterSpacing: "-0.02em",
                    marginBottom: 6,
                  }}
                >
                  while
                </div>
                <div
                  style={{
                    fontFamily: fonts.sans,
                    fontSize: 22,
                    fontWeight: 600,
                    color: colors.ink,
                    letterSpacing: "-0.01em",
                  }}
                >
                  <span style={{ fontWeight: 800, color: colors.accentDeep }}>조건</span>이 참인 동안 반복
                </div>
              </div>
              <PulseRing delaySec={REVEAL.whilePulse} />
            </div>
          </FadeIn>
        </div>
      </div>
    </PageBackground>
  );
};
