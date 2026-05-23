/**
 * Scene 10 — 두 도구 쓰임 차이 + `from random import randint` 존재만 (20s)
 *
 * **lesson-10 학습 목표 5번의 도착점.**
 *
 * - 0~6s: 화면 좌·우 분할 (R-008 동일 크기). 양쪽 카드 width 640 / height 280.
 *   - 좌측: 헤더 `random.randint(a, b)` violet-700, 본문 "_범위 안의 정수_ 한 개",
 *     mock `random.randint(1, 6)` + 주사위 아이콘.
 *   - 우측: 헤더 `random.choice(목록)` violet-700, 본문 "_이미 있는 목록에서 하나_",
 *     mock `random.choice([...])` + 카드 도형.
 *   - sequential fade-in (좌 0.4 / 우 0.8).
 * - 6~13s: 두 헤더 차례로 펄스 (R-016 동기 — narration "랜드인트" 7s / "초이스" 8.5s).
 *   좌측 아래 "주사위" 라벨, 우측 아래 "가위바위보" 라벨 fade-in.
 *   양쪽 카드 사이 `·` 구분 표기 (정적, 큰 글자).
 * - 13~17s: 두 카드 톤다운 (opacity 0.65). 화면 하단 작은 사이드 카드 fade-in
 *   (점선 border, opacity 0.7) — "참고: 다른 표기도 있어요" + `from random import randint`.
 * - 17~20s: 사이드 카드 안 "오늘은 import random 한 가지로" fade-in.
 *   LowerThird: "_범위 정수_ → `randint` · _목록에서 하나_ → `choice`".
 *
 * R-008 / R-009 / R-010 / R-016 모두 준수.
 */

import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import {
  FadeIn,
  LowerThird,
  PageBackground,
  PyToken,
  SideNoteCard,
} from "../primitives";
import { colors, fonts, radii, shadows } from "../theme";

const REVEAL = {
  leftCard: 0.4,
  rightCard: 0.8,
  // R-016: narration "랜드인트" 약 7s, "초이스" 약 8.5s
  leftPulse: 7.0,
  rightPulse: 8.5,
  scenarioLabelLeft: 2.6,
  scenarioLabelRight: 3.4,
  toneDown: 13.0,
  sideCard: 13.6,
  sideCardNote: 17.2,
  lowerThird: 16.0,
} as const;

const CARD_WIDTH = 640;
const CARD_HEIGHT = 280;

export const Scene10: React.FC = () => {
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
        <FadeIn delaySec={0.1} translateY={6}>
          <div
            style={{
              fontFamily: fonts.sans,
              fontSize: 28,
              fontWeight: 700,
              color: colors.accentDeep,
              letterSpacing: "-0.01em",
            }}
          >
            두 도구 — 쓰임이 다릅니다
          </div>
        </FadeIn>
      </div>

      {/* 좌·우 비교 카드 */}
      <ToolCompareSection />

      {/* 사이드 카드 — from random import randint 존재만 */}
      <SideNoteSection />

      <LowerThird
        text={
          <>
            범위 정수 →{" "}
            <span style={{ fontFamily: fonts.mono, color: colors.accentLight }}>
              randint
            </span>{" "}
            · 목록에서 하나 →{" "}
            <span style={{ fontFamily: fonts.mono, color: colors.accentLight }}>
              choice
            </span>
          </>
        }
        delaySec={REVEAL.lowerThird}
      />
    </PageBackground>
  );
};

/* ---- 좌·우 비교 카드 ---- */
const ToolCompareSection: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dimStart = REVEAL.toneDown * fps;
  const dim = interpolate(frame, [dimStart, dimStart + 0.5 * fps], [1, 0.65], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 200,
        left: 0,
        right: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 32,
        opacity: dim,
      }}
    >
      <ToolCompareCard
        title="random.randint(a, b)"
        body="범위 안의 정수 한 개"
        mockCode="random.randint(1, 6)"
        scenarioLabel="주사위"
        icon="die"
        delaySec={REVEAL.leftCard}
        pulseAtSec={REVEAL.leftPulse}
        scenarioDelaySec={REVEAL.scenarioLabelLeft}
      />
      {/* 구분 표기 */}
      <span
        style={{
          fontFamily: fonts.sans,
          fontSize: 64,
          fontWeight: 700,
          color: colors.inkSubtle,
          letterSpacing: "-0.04em",
          lineHeight: 1,
        }}
      >
        ·
      </span>
      <ToolCompareCard
        title="random.choice(목록)"
        body="이미 있는 목록에서 하나"
        mockCode="random.choice([...])"
        scenarioLabel="가위바위보"
        icon="card"
        delaySec={REVEAL.rightCard}
        pulseAtSec={REVEAL.rightPulse}
        scenarioDelaySec={REVEAL.scenarioLabelRight}
      />
    </div>
  );
};

const ToolCompareCard: React.FC<{
  title: string;
  body: string;
  mockCode: string;
  scenarioLabel: string;
  icon: "die" | "card";
  delaySec: number;
  pulseAtSec: number;
  scenarioDelaySec: number;
}> = ({ title, body, mockCode, scenarioLabel, icon, delaySec, pulseAtSec, scenarioDelaySec }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pStart = pulseAtSec * fps;
  const pulse = interpolate(
    frame,
    [pStart, pStart + 0.3 * fps, pStart + 0.7 * fps, pStart + 1.1 * fps],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <FadeIn
      delaySec={delaySec}
      translateY={20}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 14,
      }}
    >
      <div
        style={{
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
          background: colors.bgWhite,
          border: `2px solid ${colors.accent}`,
          borderRadius: radii.card,
          boxShadow: shadows.cardSoft,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 18,
          padding: "32px 40px",
        }}
      >
        {/* 헤더 — pulse 시 violet bg */}
        <div
          style={{
            padding: "8px 22px",
            borderRadius: radii.pill,
            background: pulse > 0.1 ? colors.accent : colors.accentSoft,
            border: `1.5px solid ${colors.accent}`,
            color: pulse > 0.1 ? "#ffffff" : colors.accentInk,
            fontFamily: fonts.mono,
            fontSize: 26,
            fontWeight: 800,
            letterSpacing: "-0.01em",
            whiteSpace: "nowrap",
            boxShadow: pulse > 0.1 ? "0 0 0 4px rgba(139, 92, 246, 0.18)" : "none",
          }}
        >
          {title}
        </div>
        {/* 본문 */}
        <div
          style={{
            fontFamily: fonts.sans,
            fontSize: 26,
            fontWeight: 600,
            color: colors.ink,
            letterSpacing: "-0.01em",
            textAlign: "center",
          }}
        >
          {body}
        </div>
        {/* mock 코드 + icon */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            background: colors.darkBg,
            borderRadius: 10,
            padding: "10px 18px",
            fontFamily: fonts.mono,
            fontSize: 22,
            fontWeight: 700,
            color: colors.darkInk,
          }}
        >
          <PyToken
            text={mockCode}
            style={{ color: colors.darkInk, fontSize: 22, fontWeight: 700 }}
          />
          <span
            style={{
              fontSize: 28,
              color: colors.accentLight,
              lineHeight: 1,
            }}
          >
            {icon === "die" ? "⚂" : "🂠"}
          </span>
        </div>
      </div>
      {/* 시나리오 라벨 */}
      <FadeIn delaySec={scenarioDelaySec} translateY={6}>
        <div
          style={{
            fontFamily: fonts.sans,
            fontSize: 22,
            fontWeight: 600,
            color: colors.inkMuted,
            letterSpacing: "-0.01em",
          }}
        >
          {scenarioLabel}
        </div>
      </FadeIn>
    </FadeIn>
  );
};

/* ---- 사이드 카드 ---- */
const SideNoteSection: React.FC = () => {
  return (
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
      <SideNoteCard delaySec={REVEAL.sideCard} width={880} height={140}>
        <div
          style={{
            fontFamily: fonts.sans,
            fontSize: 18,
            fontWeight: 700,
            color: colors.inkMuted,
            letterSpacing: "0.02em",
            textTransform: "uppercase",
          }}
        >
          참고 — 다른 표기도 있어요
        </div>
        <div
          style={{
            fontFamily: fonts.mono,
            fontSize: 26,
            fontWeight: 700,
            color: colors.ink,
            letterSpacing: "-0.01em",
            marginTop: 6,
          }}
        >
          <PyToken text="from random import randint" />
        </div>
        <SideNoteSubLabel />
      </SideNoteCard>
    </div>
  );
};

const SideNoteSubLabel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = REVEAL.sideCardNote * fps;
  const enter = interpolate(frame, [start, start + 0.5 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        opacity: enter,
        transform: `translateY(${(1 - enter) * 6}px)`,
        fontFamily: fonts.sans,
        fontSize: 18,
        fontWeight: 500,
        color: colors.inkMuted,
        letterSpacing: "-0.01em",
        marginTop: 4,
      }}
    >
      오늘은{" "}
      <span style={{ fontFamily: fonts.mono, fontWeight: 700 }}>import random</span>{" "}
      한 가지로
    </div>
  );
};
