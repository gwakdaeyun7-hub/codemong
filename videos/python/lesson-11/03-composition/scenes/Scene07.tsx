/**
 * Scene 7 — 세 메서드 비교 카드 (read / readline / readlines) — 이름만 (13s)
 *
 * - 0~3s: 화면 중앙에 작은 라벨 "_읽는 도구_" fade-in (delaySec 0.4).
 * - 3~10s: 세 카드 가로 배열 sequential fade-in (delaySec 0.8 / 1.2 / 1.6):
 *   - 카드 1: `f.read()` (accent 강조 — _오늘 다루는 도구_)
 *   - 카드 2: `f.readline()` (톤 다운 opacity 0.65)
 *   - 카드 3: `f.readlines()` (톤 다운 opacity 0.65)
 *   각 카드 width 380, height 220, gap 24 (R-008 동일 크기).
 * - 10~13s: 카드 1 한 번 더 펄스 (delaySec 6.0) — narration "오늘은 리드
 *   한 가지만" 발화 시점 ~11.5s 와 동기 (R-016). LowerThird (delaySec 4.0).
 *
 * R-008 충족: 세 카드 동일 width/height. 차별화는 색상 + opacity 만.
 * R-009 충족: 코드 토큰 모두 소문자.
 */

import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import {
  FadeIn,
  LowerThird,
  PageBackground,
} from "../primitives";
import { colors, fonts, radii, shadows } from "../theme";

const REVEAL = {
  headerLabel: 0.4,
  card1: 0.8,
  card2: 1.2,
  card3: 1.6,
  card1PulseAt: 11.5, // narration "오늘은 리드 한 가지만" 발화 시점
  lowerThird: 4.0,
} as const;

const CARD_WIDTH = 380;
const CARD_HEIGHT = 220;

export const Scene07: React.FC = () => {
  return (
    <PageBackground>
      {/* 상단 라벨 */}
      <div
        style={{
          position: "absolute",
          top: 100,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <FadeIn delaySec={REVEAL.headerLabel} translateY={6}>
          <div
            style={{
              fontFamily: fonts.sans,
              fontSize: 32,
              fontWeight: 700,
              color: colors.inkMuted,
              letterSpacing: "-0.01em",
            }}
          >
            읽는 도구 — 세 가지가 있어요
          </div>
        </FadeIn>
      </div>

      {/* 세 카드 가로 배열 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 32,
          paddingBottom: 200,
        }}
      >
        <Card1WithPulse />
        <CompareCard
          delaySec={REVEAL.card2}
          accent={false}
          methodName="f.readline()"
          desc={
            <>
              <span style={{ color: colors.accentInk, fontWeight: 800 }}>한 줄씩</span>{" "}
              차례로
            </>
          }
        />
        <CompareCard
          delaySec={REVEAL.card3}
          accent={false}
          methodName="f.readlines()"
          desc={
            <>
              <span style={{ color: colors.accentInk, fontWeight: 800 }}>각 줄</span>{" "}
              을{" "}
              <span style={{ color: colors.accentInk, fontWeight: 800 }}>리스트</span>{" "}
              로
            </>
          }
        />
      </div>

      <LowerThird
        text={
          <span>
            오늘은{" "}
            <span style={{ fontFamily: fonts.mono, color: colors.accentLight }}>
              read()
            </span>{" "}
            — 줄 단위 도구는{" "}
            <span style={{ color: colors.accentLight, fontWeight: 700 }}>
              이름만
            </span>
          </span>
        }
        delaySec={REVEAL.lowerThird}
      />
    </PageBackground>
  );
};

/** 카드 1 — accent 강조 + narration "오늘은 리드 한 가지만" 펄스 */
const Card1WithPulse: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pulseStart = REVEAL.card1PulseAt * fps;
  const pulse = interpolate(
    frame,
    [pulseStart, pulseStart + 0.25 * fps, pulseStart + 0.6 * fps, pulseStart + 1.0 * fps],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return (
    <FadeIn delaySec={REVEAL.card1} translateY={12}>
      <div
        style={{
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
          borderRadius: radii.card,
          background: pulse > 0.05 ? colors.accentSoft : colors.bgWhite,
          border: `3px solid ${colors.accent}`,
          boxShadow: shadows.card,
          padding: "32px 28px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 18,
          fontFamily: fonts.sans,
          transform: `scale(${1 + pulse * 0.06})`,
        }}
      >
        <div
          style={{
            fontFamily: fonts.mono,
            fontSize: 38,
            fontWeight: 800,
            color: colors.accentDeep,
            letterSpacing: "-0.02em",
          }}
        >
          f.read()
        </div>
        <div
          style={{
            fontSize: 22,
            fontWeight: 600,
            color: colors.inkSoft,
            letterSpacing: "-0.01em",
            lineHeight: 1.5,
          }}
        >
          파일{" "}
          <span style={{ color: colors.accentInk, fontWeight: 800 }}>
            전체를 문자열 하나
          </span>
        </div>
        {/* "오늘 다루는 도구" 작은 라벨 */}
        <div
          style={{
            marginTop: 4,
            padding: "4px 12px",
            borderRadius: 999,
            background: colors.accent,
            color: "#ffffff",
            fontSize: 16,
            fontWeight: 800,
            letterSpacing: "0.02em",
            alignSelf: "flex-start",
          }}
        >
          오늘 다루는 도구
        </div>
      </div>
    </FadeIn>
  );
};

/** 비교 카드 (톤 다운) */
const CompareCard: React.FC<{
  delaySec: number;
  accent: boolean;
  methodName: string;
  desc: React.ReactNode;
}> = ({ delaySec, accent, methodName, desc }) => {
  return (
    <FadeIn delaySec={delaySec} translateY={12}>
      <div
        style={{
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
          borderRadius: radii.card,
          background: colors.bgWhite,
          border: `2px solid ${colors.border}`,
          boxShadow: shadows.cardSoft,
          padding: "32px 28px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 18,
          fontFamily: fonts.sans,
          opacity: accent ? 1 : 0.65,
        }}
      >
        <div
          style={{
            fontFamily: fonts.mono,
            fontSize: 36,
            fontWeight: 700,
            color: colors.inkMuted,
            letterSpacing: "-0.02em",
          }}
        >
          {methodName}
        </div>
        <div
          style={{
            fontSize: 22,
            fontWeight: 600,
            color: colors.inkSoft,
            letterSpacing: "-0.01em",
            lineHeight: 1.5,
          }}
        >
          {desc}
        </div>
      </div>
    </FadeIn>
  );
};
