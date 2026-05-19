/**
 * Scene 2 — 문제 제기: 0번이 누구 점수인지 어떻게 알지 (12s)
 *
 * - 0~5s: 화면 중앙 코드 패널 — `scores = [80, 95, 70]` type-on. 콘솔 `scores[0]` → `80`.
 * - 5~9s: 각 숫자 위에 작은 회색 ⓘ 물음표 배지 (stagger 0.5s 간격). "누구 점수?" 라벨.
 * - 9~12s: 화면 하단 lower-third "이름표가 같이 있으면 좋을 텐데". 물음표 3개 동시 violet 펄스.
 *
 * 트렌디 hook 없음. 자연스러운 _결핍 제시_.
 */

import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import {
  CodeLine,
  CodePanel,
  ConsoleLine,
  ConsolePanel,
  FadeIn,
  LowerThird,
  PageBackground,
  PyToken,
} from "../primitives";
import { colors, fonts, radii } from "../theme";

const REVEAL = {
  codePanel: 0.3,
  line1: 0.7,
  console: 3.0,
  badge1: 5.0,
  badge2: 5.5,
  badge3: 6.0,
  whoLabel: 7.0,
  pulse: 9.5,
  lowerThird: 9.8,
} as const;

/** 물음표 ⓘ 배지 (위에 떠 있는 작은 회색 동그라미). pulse 비트에 violet 으로 변함. */
const QuestionBadge: React.FC<{
  enterAtSec: number;
  pulseAtSec: number;
}> = ({ enterAtSec, pulseAtSec }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = enterAtSec * fps;
  const reveal = interpolate(frame, [start, start + 0.4 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const pStart = pulseAtSec * fps;
  const pulse = interpolate(
    frame,
    [pStart, pStart + 0.3 * fps, pStart + 0.7 * fps, pStart + 1.1 * fps],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return (
    <div
      style={{
        width: 36,
        height: 36,
        borderRadius: "50%",
        background: pulse > 0.1 ? colors.accent : colors.inkSubtle,
        color: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: fonts.sans,
        fontSize: 22,
        fontWeight: 800,
        opacity: reveal,
        boxShadow: pulse > 0.1 ? "0 0 0 4px rgba(139, 92, 246, 0.20)" : "none",
        transform: `scale(${pulse > 0.1 ? 1.1 : 1})`,
      }}
    >
      ?
    </div>
  );
};

/**
 * 숫자 PyToken 위에 자동으로 배지를 올려주는 래퍼.
 * inline-block + position:relative 로 배지를 토큰 위에 절대 위치 — px 좌표 추측 X.
 * 배지가 CodePanel 위로 escape 하려면 CodePanel 의 overflow: visible 필요.
 */
const NumberWithBadge: React.FC<{
  number: string;
  badgeEnterAtSec: number;
  badgePulseAtSec: number;
}> = ({ number, badgeEnterAtSec, badgePulseAtSec }) => {
  return (
    <span style={{ position: "relative", display: "inline-block" }}>
      <PyToken text={number} kind="number" />
      <span
        style={{
          position: "absolute",
          left: "50%",
          // -88 = line top(20 padding) - 28 (target: 28px above panel top) - 40 (header)
          top: -88,
          transform: "translateX(-50%)",
          pointerEvents: "none",
        }}
      >
        <QuestionBadge enterAtSec={badgeEnterAtSec} pulseAtSec={badgePulseAtSec} />
      </span>
    </span>
  );
};

export const Scene02: React.FC = () => {
  return (
    <PageBackground>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: 200,
          gap: 40,
        }}
      >
        {/* 코드 패널 + 물음표 배지 */}
        <div style={{ position: "relative" }}>
          <FadeIn delaySec={REVEAL.codePanel} translateY={20}>
            {/* overflow: visible — NumberWithBadge 의 배지가 panel 위로 escape 해야 함 */}
            <CodePanel
              fileName="scores.py"
              width={720}
              height={140}
              style={{ overflow: "visible" }}
            >
              <CodeLine lineNumber={1} revealAtSec={REVEAL.line1}>
                <PyToken text="scores" kind="name" />
                <PyToken text=" " />
                <PyToken text="=" kind="op" />
                <PyToken text=" " />
                <PyToken text="[" kind="op" />
                <NumberWithBadge
                  number="80"
                  badgeEnterAtSec={REVEAL.badge1}
                  badgePulseAtSec={REVEAL.pulse}
                />
                <PyToken text=", " kind="op" />
                <NumberWithBadge
                  number="95"
                  badgeEnterAtSec={REVEAL.badge2}
                  badgePulseAtSec={REVEAL.pulse}
                />
                <PyToken text=", " kind="op" />
                <NumberWithBadge
                  number="70"
                  badgeEnterAtSec={REVEAL.badge3}
                  badgePulseAtSec={REVEAL.pulse}
                />
                <PyToken text="]" kind="op" />
              </CodeLine>
            </CodePanel>
          </FadeIn>

          {/* "누구 점수?" 라벨 — 3개 배지 그룹 위쪽 중앙 (가운데 "95" 토큰 기준)
              "95" panel-relative 중심 ≈ 62(코드 시작 offset) + 14.5(char) × 17.4(mono char width) ≈ 314
              라벨 width 340 → left = 314 - 170 = 144 */}
          <div
            style={{
              position: "absolute",
              left: 144,
              top: -90,
              width: 340,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <FadeIn delaySec={REVEAL.whoLabel} translateY={-6}>
              <div
                style={{
                  padding: "6px 14px",
                  borderRadius: radii.pill,
                  background: colors.bgWhite,
                  border: `1.5px solid ${colors.inkSubtle}`,
                  color: colors.inkSoft,
                  fontFamily: fonts.sans,
                  fontSize: 22,
                  fontWeight: 700,
                  letterSpacing: "-0.01em",
                  whiteSpace: "nowrap",
                }}
              >
                누구 점수?
              </div>
            </FadeIn>
          </div>
        </div>

        {/* 콘솔 — scores[0] → 80 */}
        <FadeIn delaySec={REVEAL.console} translateY={14}>
          <ConsolePanel title="출력 결과" width={520} height={130}>
            <ConsoleLine revealAtSec={REVEAL.console + 0.2}>
              <span style={{ fontSize: 28, fontWeight: 700, color: colors.darkInk }}>
                <PyToken text="scores[0]" kind="name" /> <PyToken text="→" kind="op" />{" "}
                <span style={{ color: colors.darkAccent, fontSize: 30, fontWeight: 800 }}>80</span>
              </span>
            </ConsoleLine>
          </ConsolePanel>
        </FadeIn>
      </div>

      <LowerThird
        text={
          <>
            <span style={{ color: colors.accentLight, fontWeight: 700 }}>이름표</span>가 같이 있으면 좋을 텐데
          </>
        }
        delaySec={REVEAL.lowerThird}
      />
    </PageBackground>
  );
};
