/**
 * Scene 8 — Active Recall: 주사위 한 번 던지면? (scene length 18.112s)
 *
 * - 0.0 ~ 0.4s: 상단 "직접 해보기" 헤더 fade-in (delaySec 0.1).
 * - 0.4 ~ 4.0s: 질문 박스 fade-in (delaySec 0.4) — `눈 = ?` (`?` 큰 violet-300).
 *   위에 hint "1부터 6 사이 정수 한 개" (delaySec 1.0).
 * - 4.0 ~ 12.0s: 중앙 큰 QuestionMark size 200 (R-012) — narration "어떻게 쓸까요"
 *   (a0 발화 10.20s) + s1 정적 1.83s 구간 동안 유지.
 * - 11.5 ~ 12.2s: QuestionMark fade-out — 끝 = 12.2s (lifespan = 12.4-4.0-0.9 = 7.5s).
 * - 12.4s: 정답 QuestionBox reveal — `눈 = random.randint(1, 6)` (mono).
 *   narration a2 "정답입니다" 발화 시점 동기 (R-004 / R-016).
 * - 13.5s: LowerThird — "1~6 사이 정수 — `random.randint(1, 6)`".
 *
 * R-004 / R-016: 정답 reveal (revealAt = 12.4s) narration "정답입니다" 발화 시점 동기.
 *   Sub-clip probe (stdlib MPEG parser, ffprobe 없음): a0=10.200s, s1=1.855s, a2=5.760s.
 *   final voiceover (no rescale — concat 합계 = voiceover 길이).
 *   - a2 시작 (scene 내부) = 10.200 + 1.855 = 12.055s
 *   - R-004 strict 하한 = 12.055 + 0.3 = 12.355s
 *   - R-004 상한 = 12.055 + 5.760 × 0.25 = 13.495s
 *   - revealAt = 12.4 ∈ [12.355, 13.495] ✓ (이전 12.3 은 하한보다 ~1.5프레임 빨라 경계 밖이었음)
 *
 * R-002 (swap timing buffer): QuestionMark fade-out 끝 = 4.0 + (12.4 - 4.0 - 0.9) + 0.4
 *   = 12.2s, revealAt = 12.4s → gap 0.2s ✓. 질문 QuestionBox fade-out (revealAt-0.6 ~
 *   revealAt-0.2 = 11.8 ~ 12.2s) vs 정답 fade-in (12.4s~) → gap 0.2s ✓ (QuestionBox 가
 *   revealAt 상대 계산이라 자동 유지).
 *
 * R-012: QuestionMark size 200 (양옆 박스 사이 충분히 큼, scene 단독 중앙).
 */

import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import {
  FadeIn,
  LowerThird,
  PageBackground,
  QuestionBox,
  QuestionMark,
} from "../primitives";
import { colors, fonts, radii, shadows } from "../theme";

const REVEAL = {
  header: 0.1,
  questionEnter: 0.4,
  hintEnter: 1.0,
  questionMarkStart: 4.0,
  // R-002: questionMark fade-out 끝 (revealAt - 0.2 = 12.2s) + buffer 0.2s → reveal 12.4s.
  // R-004 / R-016: narration a2 "정답입니다" 발화 시점 (scene 내부 a0+s1 = 12.055s) + 0.345s 동기.
  //   probe (stdlib parser): a0=10.200, s1=1.855, a2=5.760.
  //   R-004 strict 범위 = [a0+s1+0.3, a0+s1 + a2×0.25] = [12.355, 13.495].
  //   revealAt = 12.4 ∈ [12.355, 13.495] ✓ (이전 12.3 은 하한 12.355 보다 ~1.5프레임 빨라 경계 밖).
  revealAt: 12.4,
  lowerThird: 13.5, // revealAt + 1.1 (오프셋 유지)
} as const;

export const Scene08: React.FC = () => {
  return (
    <PageBackground>
      {/* 상단 헤더 */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 0,
          right: 0,
          textAlign: "center",
        }}
      >
        <FadeIn delaySec={REVEAL.header} translateY={6}>
          <div
            style={{
              fontFamily: fonts.sans,
              fontSize: 28,
              fontWeight: 700,
              color: colors.accentDeep,
              letterSpacing: "-0.01em",
            }}
          >
            직접 해보기
          </div>
        </FadeIn>
      </div>

      {/* 중앙 — QuestionBox + hint + QuestionMark */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 28,
          paddingBottom: 60,
        }}
      >
        {/* hint */}
        <HintLabel />

        {/* QuestionBox */}
        <QuestionBox
          questionEnterAtSec={REVEAL.questionEnter}
          revealAtSec={REVEAL.revealAt}
          width={900}
          height={200}
          question={
            <span
              style={{
                fontFamily: fonts.mono,
                fontSize: 64,
                fontWeight: 800,
                color: colors.ink,
                letterSpacing: "-0.02em",
                display: "inline-flex",
                alignItems: "center",
                gap: 18,
              }}
            >
              <span>눈 =</span>
              <span style={{ color: colors.accentLight, fontSize: 80 }}>?</span>
            </span>
          }
          answer="눈 = random.randint(1, 6)"
        />

        {/* 중앙 큰 QuestionMark (R-012 — size 200) */}
        <div style={{ marginTop: 20 }}>
          <QuestionMark
            size={200}
            delaySec={REVEAL.questionMarkStart}
            lifespanSec={REVEAL.revealAt - REVEAL.questionMarkStart - 0.9}
            color={colors.accent}
          />
        </div>
      </div>

      <LowerThird
        text={
          <>
            1~6 사이 정수 —{" "}
            <span style={{ fontFamily: fonts.mono, color: colors.accentLight }}>
              random.randint(1, 6)
            </span>
          </>
        }
        delaySec={REVEAL.lowerThird}
      />
    </PageBackground>
  );
};

/** hint 라벨 — "1부터 6 사이 정수 한 개" */
const HintLabel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enterStart = REVEAL.hintEnter * fps;
  const enter = interpolate(frame, [enterStart, enterStart + 0.5 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeStart = (REVEAL.revealAt - 0.6) * fps;
  const fadeEnd = (REVEAL.revealAt - 0.2) * fps;
  const fade = interpolate(frame, [fadeStart, fadeEnd], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        opacity: enter * fade,
        transform: `translateY(${(1 - enter) * 8}px)`,
        padding: "10px 22px",
        background: colors.bgWhite,
        border: `1.5px solid ${colors.accent}`,
        borderRadius: radii.pill,
        boxShadow: shadows.cardSoft,
        fontFamily: fonts.sans,
        fontSize: 24,
        fontWeight: 600,
        color: colors.accentDeep,
        letterSpacing: "-0.01em",
      }}
    >
      1부터 6 사이 정수 한 개
    </div>
  );
};
