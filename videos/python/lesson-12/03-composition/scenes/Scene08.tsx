/**
 * Scene 8 — AI 는 답 기계가 아니라 조수: 나쁜 질문 vs 좋은 질문 (25s placeholder)
 *
 * 00-objectives §4 오개념 4 (AI 에게 통째로 시키면 된다) + §6 처치 — 마지막 핵심 컷.
 * 특정 AI 제품 화면·프롬프트 기법 절대 X — _태도_ 만.
 *
 * - 0~4s: 중앙 라벨 "좋은 질문 vs 나쁜 질문" (0.4).
 * - 4~12s: 좌우 두 패널 (0.8 / 1.6 — R-008 동일 width 620/height 360).
 *          왼쪽(나쁨): ✕ 마커(inset, R-024) + "코드가 안 돼요. 고쳐 주세요" → AI 큰 `?` (3.0).
 *          오른쪽(좋음): ✓ 마커(inset) + 코드 `print(scroe)` + 빨간 에러 `NameError`
 *          + "이 에러가 왜 나는지 같이 봐 주세요" → AI "scroe → score 오타예요" 카드 (4.0).
 *          (scroe 오타 = scene-03 재활용 — mental model 연결. 큰 FlowArrow 는 제거 —
 *          사용자 피드백: AI→ 위 큰 화살표 삭제.)
 * - 12~22s: 강조 라벨 (5.6). 오른쪽 패널 펄스 (6.0 — narration "조수" 동기, R-016).
 *           LowerThird (6.4).
 *
 * R-008 / R-016 / R-024 충족.
 */

import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { CheckMark, FadeIn, LowerThird, PageBackground, XMark } from "../primitives";
import { colors, fonts, radii, shadows } from "../theme";

const REVEAL = {
  topLabel: 0.4,
  badPanel: 0.8,
  goodPanel: 1.6,
  badAi: 3.0,
  goodAi: 4.0,
  emphasisLabel: 5.6,
  goodPulse: 6.0, // narration "옆에서 같이 들여다보는 조수" ~19s 동기 (R-016)
  lowerThird: 6.4,
} as const;

const PANEL_W = 620;
const PANEL_H = 360;

export const Scene08: React.FC = () => {
  return (
    <PageBackground>
      {/* 상단 라벨 */}
      <div
        style={{
          position: "absolute",
          top: 110,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <FadeIn delaySec={REVEAL.topLabel} translateY={6}>
          <div
            style={{
              fontFamily: fonts.sans,
              fontSize: 30,
              fontWeight: 600,
              color: colors.inkMuted,
              letterSpacing: "-0.01em",
            }}
          >
            <span style={{ color: colors.safeGreenDeep, fontWeight: 700 }}>좋은 질문</span> vs{" "}
            <span style={{ color: colors.dangerRedDeep, fontWeight: 700 }}>나쁜 질문</span>
          </div>
        </FadeIn>
      </div>

      {/* 좌우 두 패널 */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 250,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: 56,
        }}
      >
        {/* 왼쪽 — 나쁜 질문 */}
        <BadPanel />
        {/* 오른쪽 — 좋은 질문 */}
        <GoodPanel />
      </div>

      {/* 강조 라벨 */}
      <div
        style={{
          position: "absolute",
          bottom: 180,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <FadeIn delaySec={REVEAL.emphasisLabel} translateY={6}>
          <div
            style={{
              fontFamily: fonts.sans,
              fontSize: 30,
              fontWeight: 700,
              color: colors.accentInk,
              letterSpacing: "-0.01em",
            }}
          >
            <span style={{ color: colors.inkSoft }}>안 된 코드</span> +{" "}
            <span style={{ color: colors.dangerRedDeep }}>빨간 에러</span>를{" "}
            <span style={{ color: colors.accentDeep, fontWeight: 800 }}>같이</span> 붙여라
          </div>
        </FadeIn>
      </div>

      <LowerThird
        text={
          <span>
            <span style={{ color: colors.accentLight, fontWeight: 700 }}>AI</span>는{" "}
            <span style={{ color: colors.dangerRedBorder, fontWeight: 700 }}>답 기계</span>가 아니라{" "}
            <span style={{ color: colors.accentLight, fontWeight: 700 }}>같이 보는 조수</span>
          </span>
        }
        delaySec={REVEAL.lowerThird}
      />
    </PageBackground>
  );
};

/* 공용 말풍선 박스 */
const Bubble: React.FC<{ children: React.ReactNode; tone?: "neutral" | "good" }> = ({
  children,
  tone = "neutral",
}) => (
  <div
    style={{
      padding: "16px 20px",
      borderRadius: 16,
      background: colors.aiBubbleBg,
      border: `1.5px solid ${tone === "good" ? colors.aiGoodBorder : colors.border}`,
      boxShadow: shadows.cardSoft,
      fontFamily: fonts.sans,
      fontSize: 24,
      fontWeight: 600,
      color: colors.ink,
      letterSpacing: "-0.01em",
      lineHeight: 1.4,
    }}
  >
    {children}
  </div>
);

/** 왼쪽 — 나쁜 질문 (✕, 톤 다운, AI 응답 = 큰 ?) */
const BadPanel: React.FC = () => {
  return (
    <FadeIn delaySec={REVEAL.badPanel} translateY={16}>
      <div
        style={{
          position: "relative",
          width: PANEL_W,
          height: PANEL_H,
          borderRadius: radii.card,
          background: colors.aiBadTint,
          border: `2px solid ${colors.aiBadBorder}`,
          boxShadow: shadows.card,
          padding: "28px 32px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 24,
        }}
      >
        {/* ✕ 마커 (panel 안쪽 좌상단 inset — R-024) */}
        <div style={{ position: "absolute", top: 22, left: 22 }}>
          <XMark size={44} delaySec={REVEAL.badPanel + 0.3} />
        </div>

        <div style={{ paddingLeft: 56 }}>
          <Bubble>코드가 안 돼요. 고쳐 주세요</Bubble>
        </div>

        {/* AI 응답 자리 — 큰 ? (뭐가 문제인지 모름) */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
          <span
            style={{
              fontFamily: fonts.sans,
              fontSize: 22,
              fontWeight: 700,
              color: colors.inkMuted,
            }}
          >
            AI →
          </span>
          <FadeIn delaySec={REVEAL.badAi} translateY={10}>
            <div
              style={{
                fontFamily: fonts.sans,
                fontSize: 96,
                fontWeight: 800,
                color: colors.inkSubtle,
                lineHeight: 1,
              }}
            >
              ?
            </div>
          </FadeIn>
        </div>
      </div>
    </FadeIn>
  );
};

/** 오른쪽 — 좋은 질문 (✓, violet 강조, AI 응답 = 정확히 짚음) */
const GoodPanel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 패널 펄스 (narration "조수" 동기)
  const pulseStart = REVEAL.goodPulse * fps;
  const pulse = interpolate(
    frame,
    [
      pulseStart,
      pulseStart + 0.3 * fps,
      (REVEAL.goodPulse + 0.7) * fps,
      (REVEAL.goodPulse + 1.1) * fps,
    ],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <FadeIn delaySec={REVEAL.goodPanel} translateY={16}>
      <div
        style={{
          position: "relative",
          width: PANEL_W,
          height: PANEL_H,
          borderRadius: radii.card,
          background: colors.aiGoodTint,
          border: `2px solid ${pulse > 0.05 ? colors.accent : colors.aiGoodBorder}`,
          boxShadow:
            pulse > 0.05 ? `${shadows.card}, 0 0 0 4px rgba(139, 92, 246, 0.18)` : shadows.card,
          padding: "28px 32px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 18,
          transform: `scale(${1 + pulse * 0.02})`,
        }}
      >
        {/* ✓ 마커 (panel 안쪽 좌상단 inset — R-024) */}
        <div style={{ position: "absolute", top: 22, left: 22 }}>
          <CheckMark size={44} delaySec={REVEAL.goodPanel + 0.3} variant="green" />
        </div>

        {/* 말풍선 — 코드 + 빨간 에러 + 질문 (scroe = scene-03 재활용) */}
        <div style={{ paddingLeft: 56 }}>
          <Bubble tone="good">
            <div
              style={{
                fontFamily: fonts.mono,
                fontSize: 22,
                fontWeight: 700,
                color: colors.inkSoft,
              }}
            >
              print(scroe)
            </div>
            <div
              style={{
                fontFamily: fonts.mono,
                fontSize: 20,
                fontWeight: 700,
                color: colors.dangerRedDeep,
                marginTop: 4,
              }}
            >
              NameError: ...
            </div>
            <div style={{ fontSize: 22, marginTop: 8 }}>이 에러가 왜 나는지 같이 봐 주세요</div>
          </Bubble>
        </div>

        {/* AI 응답 — 정확히 그 줄을 짚음 */}
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            gap: 16,
            paddingLeft: 56,
          }}
        >
          <span
            style={{
              fontFamily: fonts.sans,
              fontSize: 22,
              fontWeight: 700,
              color: colors.accentDeep,
            }}
          >
            AI →
          </span>
          <FadeIn delaySec={REVEAL.goodAi} translateY={8}>
            <div
              style={{
                padding: "8px 16px",
                borderRadius: 12,
                background: colors.accentSoft,
                border: `1.5px solid ${colors.accent}`,
                fontFamily: fonts.sans,
                fontSize: 22,
                fontWeight: 700,
                color: colors.accentInk,
                whiteSpace: "nowrap",
              }}
            >
              <span style={{ fontFamily: fonts.mono }}>scroe</span> →{" "}
              <span style={{ fontFamily: fonts.mono }}>score</span> 오타예요
            </div>
          </FadeIn>
        </div>
      </div>
    </FadeIn>
  );
};
