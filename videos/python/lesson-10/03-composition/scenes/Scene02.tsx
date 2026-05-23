/**
 * Scene 2 — 문제 제기 + 도구 상자 비유 (14s)
 *
 * - 0~4s: 좌측에 9강 회상 카드 (톤 다운 opacity 0.4). 중앙에 큰 물음표 박스
 *   fade-in (delaySec 0.2) — "이미 있는 함수는?" 한 줄.
 * - 4~9s: 물음표 박스 톤다운 → 중앙 closed 도구 상자 fade-in (delaySec 1.4 →
 *   여기선 4.0s, 물음표 페이드아웃 이후). 상자 윗면 라벨 `random`, 안에 회색
 *   도구 그림자 `randint` / `choice` 두 개.
 * - 9~14s: 상자 우측에 화살표 + 라벨 "무작위 값이 필요할 때" fade-in
 *   (delaySec 2.4 → 9.0s). 하단 LowerThird fade-in (delaySec 2.8 → 10.6s):
 *   "_미리 만들어진 도구들의 묶음_ — 모듈".
 */

import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { FadeIn, LowerThird, PageBackground, ToolBox } from "../primitives";
import { colors, fonts, radii, shadows } from "../theme";

const REVEAL = {
  questionBox: 0.2,
  questionDim: 4.0,
  toolBox: 4.0,
  arrowLabel: 9.0,
  lowerThird: 10.6,
} as const;

export const Scene02: React.FC = () => {
  return (
    <PageBackground>
      {/* 좌상단 회상 카드 (톤 다운, 정적) */}
      <FadeIn delaySec={0} translateY={6}>
        <div
          style={{
            position: "absolute",
            top: 120,
            left: 120,
            opacity: 0.4,
            padding: "16px 22px",
            borderRadius: radii.card,
            background: colors.bgWhite,
            border: `1px solid ${colors.border}`,
            boxShadow: shadows.cardSoft,
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontFamily: fonts.sans,
          }}
        >
          <span
            style={{
              width: 24,
              height: 24,
              borderRadius: 6,
              background: colors.success,
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              fontWeight: 800,
            }}
          >
            ✓
          </span>
          <div
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: colors.ink,
              letterSpacing: "-0.01em",
            }}
          >
            내가 만든 도구를 부르다
          </div>
        </div>
      </FadeIn>

      {/* 중앙 위쪽 — 물음표 박스 (0~4s, 이후 톤 다운) */}
      <QuestionPanel />

      {/* 중앙 — 도구 상자 (4s~) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 80,
          }}
        >
          <ToolBox
            state="closed"
            delaySec={REVEAL.toolBox}
            width={360}
            height={220}
          />

          {/* 우측 — 화살표 + 라벨 */}
          <FadeIn delaySec={REVEAL.arrowLabel} translateY={6}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 18,
              }}
            >
              <span
                style={{
                  fontFamily: fonts.sans,
                  fontSize: 56,
                  color: colors.accentDeep,
                  fontWeight: 800,
                  lineHeight: 1,
                }}
              >
                →
              </span>
              <span
                style={{
                  fontFamily: fonts.sans,
                  fontSize: 28,
                  fontWeight: 600,
                  color: colors.inkSoft,
                  letterSpacing: "-0.01em",
                }}
              >
                무작위 값이 필요할 때
              </span>
            </div>
          </FadeIn>
        </div>
      </div>

      <LowerThird
        text={
          <>
            미리 만들어진 도구들의 묶음 —{" "}
            <span style={{ color: colors.accentLight, fontWeight: 800 }}>모듈</span>
          </>
        }
        delaySec={REVEAL.lowerThird}
      />
    </PageBackground>
  );
};

/** 중앙 위쪽 물음표 박스 — 0.2s 등장, 4s 부터 톤 다운. */
const QuestionPanel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // 등장 (delaySec 0.2, duration 0.6)
  const enterStart = REVEAL.questionBox * fps;
  const enter = interpolate(frame, [enterStart, enterStart + 0.6 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // 톤 다운 (REVEAL.questionDim 부터 0.6s 동안 opacity 1→0.35)
  const dimStart = REVEAL.questionDim * fps;
  const dim = interpolate(frame, [dimStart, dimStart + 0.6 * fps], [1, 0.35], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = enter * dim;
  const translateY = (1 - enter) * 10;

  return (
    <div
      style={{
        position: "absolute",
        top: 220,
        left: "50%",
        transform: `translateX(-50%) translateY(${translateY}px)`,
        padding: "20px 32px",
        background: colors.bgWhite,
        border: `2px solid ${colors.accent}`,
        borderRadius: radii.card,
        boxShadow: shadows.cardSoft,
        display: "flex",
        alignItems: "center",
        gap: 14,
        opacity,
      }}
    >
      <span
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: colors.accent,
          color: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: fonts.sans,
          fontSize: 22,
          fontWeight: 800,
        }}
      >
        ?
      </span>
      <span
        style={{
          fontFamily: fonts.sans,
          fontSize: 30,
          fontWeight: 700,
          color: colors.ink,
          letterSpacing: "-0.01em",
        }}
      >
        이미 있는 함수는?
      </span>
    </div>
  );
};
