/**
 * Scene 7 — 변수명 다듬기 한 스푼: a → score (23s placeholder)
 *
 * 00-objectives §6 "변수명 다듬기 한 스푼" + §2 학습목표 4 처치 — 리팩토링 한 스푼.
 * 본격 리팩토링 OUT, 변수명 다듬기까지만 (00-objectives §5).
 *
 * - 0~4s: 코드 패널 (score.py, width 660, height 140). `a = 0` / `a = a + 1`.
 *         `a` 토큰 회색 톤 + 물음표 말풍선 "이게 뭐지?" (1.4 — wrapper-relative, R-022).
 * - 4~10s: 모든 `a` → `score` letter swap (2.4, R-002 buffer). `score` violet 강조
 *          (3.4 — narration "스코어 등호 스코어" 동기, R-016). 라벨 "점수를 하나 올린다" (4.2).
 * - 10~15s: 비교 라벨 "동작은 그대로 · 읽기만 좋아짐" (4.8). LowerThird (5.4).
 *
 * R-002 / R-016 / R-022 / R-023 (사선 strike 미사용, letter swap 대체) 충족.
 */

import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import {
  CodeLine,
  CodePanel,
  FadeIn,
  LowerThird,
  PageBackground,
  PyToken,
  SwapLabel,
  TokenWithBubble,
} from "../primitives";
import { colors, fonts, radii } from "../theme";

const REVEAL = {
  codePanel: 0.6,
  bubble: 1.4,
  swapOldFadeOut: 2.4,
  swapNewFadeIn: 3.0, // 0.2s buffer (R-002)
  scoreEmphasis: 3.4, // narration "스코어 등호 스코어" 동기
  meaningLabel: 4.2,
  compareLabel: 4.8,
  lowerThird: 5.4,
} as const;

export const Scene07: React.FC = () => {
  return (
    <PageBackground>
      {/* 상단 라벨 */}
      <div
        style={{
          position: "absolute",
          top: 130,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <FadeIn delaySec={0.1} translateY={6}>
          <div
            style={{
              padding: "8px 24px",
              borderRadius: radii.pill,
              background: colors.accentSoft,
              color: colors.accentInk,
              border: `1.5px solid ${colors.accent}`,
              fontFamily: fonts.sans,
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: "-0.01em",
            }}
          >
            한 가지만 가볍게 더 — 변수명 다듬기
          </div>
        </FadeIn>
      </div>

      {/* 중앙 코드 패널 — a → score swap */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: 120,
        }}
      >
        <div style={{ position: "relative" }}>
          <FadeIn delaySec={REVEAL.codePanel} translateY={16}>
            <CodePanel fileName="score.py" width={660} height={150} style={{ overflow: "visible" }}>
              <CodeLine lineNumber={1} revealAtSec={REVEAL.codePanel}>
                <AToScoreSwap withBubble />
                {" "}
                <PyToken text="=" kind="op" /> <PyToken text="0" kind="number" />
              </CodeLine>
              <CodeLine lineNumber={2} revealAtSec={REVEAL.codePanel + 0.2}>
                <AToScoreSwap /> <PyToken text="=" kind="op" /> <AToScoreSwap />{" "}
                <PyToken text="+" kind="op" /> <PyToken text="1" kind="number" />
              </CodeLine>
            </CodePanel>
          </FadeIn>

          {/* "점수를 하나 올린다" 라벨 (코드 우측) */}
          <div style={{ position: "absolute", left: "100%", top: 56, marginLeft: 36 }}>
            <FadeIn delaySec={REVEAL.meaningLabel} translateY={6}>
              <div
                style={{
                  display: "inline-block",
                  padding: "8px 18px",
                  borderRadius: radii.md,
                  background: colors.safeGreenSoft,
                  color: colors.safeGreenDeep,
                  border: `1.5px solid ${colors.safeGreenBorder}`,
                  fontFamily: fonts.sans,
                  fontSize: 24,
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                }}
              >
                점수를 하나 올린다
              </div>
            </FadeIn>
          </div>
        </div>
      </div>

      {/* 비교 라벨 — 동작은 그대로 · 읽기만 좋아짐 */}
      <div
        style={{
          position: "absolute",
          bottom: 220,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <FadeIn delaySec={REVEAL.compareLabel} translateY={6}>
          <div
            style={{
              fontFamily: fonts.sans,
              fontSize: 28,
              fontWeight: 600,
              color: colors.inkMuted,
              letterSpacing: "-0.01em",
            }}
          >
            <span style={{ fontWeight: 700, color: colors.inkSoft }}>동작은 그대로</span> ·{" "}
            <span style={{ fontWeight: 700, color: colors.accentInk }}>읽기만</span> 좋아짐
          </div>
        </FadeIn>
      </div>

      <LowerThird
        text={
          <span>
            <span style={{ color: colors.accentLight, fontWeight: 700 }}>읽기 쉬운 코드</span>가{" "}
            <span style={{ color: colors.accentLight, fontWeight: 700 }}>덜 막히는 코드</span>
          </span>
        }
        delaySec={REVEAL.lowerThird}
      />
    </PageBackground>
  );
};

/** `a` (회색 + 선택적 말풍선) → `score` letter swap + violet 강조 */
const AToScoreSwap: React.FC<{ withBubble?: boolean }> = ({ withBubble = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // score 강조 펄스
  const emphStart = REVEAL.scoreEmphasis * fps;
  const emph = interpolate(
    frame,
    [emphStart, emphStart + 0.3 * fps, (REVEAL.scoreEmphasis + 1.0) * fps, (REVEAL.scoreEmphasis + 1.4) * fps],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const aToken = (
    <span style={{ display: "inline-block", color: colors.darkMuted, whiteSpace: "nowrap" }}>a</span>
  );

  return (
    <SwapLabel
      oldFadeOutAtSec={REVEAL.swapOldFadeOut}
      newFadeInAtSec={REVEAL.swapNewFadeIn}
      fadeDurationSec={0.4}
      style={{ display: "inline-block" }}
      initial={
        withBubble ? (
          <TokenWithBubble bubble="이게 뭐지?" bubbleDelaySec={REVEAL.bubble} offsetY={16}>
            {aToken}
          </TokenWithBubble>
        ) : (
          aToken
        )
      }
      newLabel={
        <span
          style={{
            display: "inline-block",
            color: colors.syntaxName,
            background: emph > 0.05 ? "rgba(196, 181, 253, 0.22)" : "transparent",
            outline: emph > 0.05 ? `1.5px solid ${colors.accentLight}` : "none",
            borderRadius: 3,
            padding: "0 3px",
            whiteSpace: "nowrap",
          }}
        >
          score
        </span>
      }
    />
  );
};
