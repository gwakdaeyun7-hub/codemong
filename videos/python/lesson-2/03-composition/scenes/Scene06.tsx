/**
 * Scene 6 — Active recall: 어디에 쓸까 (12s)
 *
 * - 앞 scene 의 카드 3개가 작은 크기로 화면 상단에 다시 등장
 * - 화면 중앙에 큰 물음표 아이콘 (s1 silence 1.54s 동안만 강조)
 * - REVEAL 시점 이후: "자연어" 카드만 violet-500 외곽선 + 살짝 확대,
 *   다른 두 카드는 opacity 0.5 로 톤 다운
 *
 * Active recall 비트 — TTS 가 a0/s1/a2 로 분할 (전반부 발화 / 1.5s silence /
 * 후반부 발화). BigQuestionMark 표시 구간을 그 silence 윈도우와 정렬해
 * 시각 정적이 음성 발화를 가리지 않도록 한다.
 *
 *   a0_end   = 4.512s   (a0 mp3 측정값)
 *   s1_end   = 6.053s   (a0_end + 1.5412s s1 silence)
 *   a2_start = 6.053s
 *
 * Beats (scene local frame, sec):
 *   0.4 :  카드 3개 다시 등장
 *   4.55:  a0 종료 직후 BigQuestionMark fade-in 시작 (0.4s)
 *   4.95 ~ 5.75 : 정적 강조 (silence 의 중심부, 약 0.8s)
 *   5.75:  fade-out 시작 (0.3s) — 6.05s 시점 a2 발화 시작 직전 완전 종료
 *          REVEAL 동시 진행 → "자연어" 카드만 highlight, 나머지 dim
 */

import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import {
  CenteredStage,
  FadeIn,
  PageBackground,
  easeOutCubic,
} from "../primitives";
import { colors, fonts, radii, shadows } from "../theme";

// Audio-aligned: a0(4.512s narration) → s1(1.541s silence) → a2(6.240s narration).
// BigQuestionMark 강조는 silence 윈도우 (4.512s ~ 6.053s) 안쪽에만 머문다.
// Fade-in 0.4s, fade-out 0.3s 가 발화 영역을 침범하지 않도록 보수적으로 정렬:
//   - 4.55s 부터 fade-in 시작 → 4.95s 완전 표시
//   - 5.75s 부터 fade-out 시작 → 6.05s 완전 사라짐 (= a2 시작 직전)
const QMARK_IN = 4.55;
const QMARK_OUT = 5.75;
const REVEAL_AT = 5.75;

const concepts = [
  { label: "자연어", glyph: "💬" },
  { label: "의사코드", glyph: "📝" },
  { label: "순서도", glyph: "◇" },
];

/**
 * Frame-aware mini concept card.
 * REVEAL_AT 이후 highlighted=true 인 카드는 강조, false 인 카드는 dim.
 */
const RecallCard: React.FC<{
  label: string;
  glyph: string;
  highlighted: boolean;
  delaySec: number;
}> = ({ label, glyph, highlighted, delaySec }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 등장 (delaySec 부터 fade-in)
  const inProg = interpolate(
    frame,
    [delaySec * fps, (delaySec + 0.6) * fps],
    [0, 1],
    {
      easing: easeOutCubic,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  // REVEAL 진행도 — REVEAL_AT 부터 0→1
  const reveal = interpolate(
    frame,
    [REVEAL_AT * fps, (REVEAL_AT + 0.5) * fps],
    [0, 1],
    {
      easing: easeOutCubic,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  // 카드 opacity: 등장 후 1, REVEAL 시점부터 highlighted ? 1 : 0.45
  const opacity = inProg * (highlighted ? 1 : 1 - reveal * 0.55);

  // scale: REVEAL 시점부터 highlighted 면 1.04 로 살짝 확대
  const scale = highlighted ? 1 + reveal * 0.04 : 1;

  // border: REVEAL 시점부터 highlighted 면 violet 외곽선
  const borderWidth = highlighted ? 1 + reveal * 2 : 1;
  const borderColor = highlighted
    ? interpolateColor(reveal, colors.border, colors.accent)
    : colors.border;

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${(1 - inProg) * 12}px) scale(${scale})`,
        width: 280,
        padding: "32px 28px",
        borderRadius: radii.card,
        background: colors.bgWhite,
        border: `${borderWidth}px solid ${borderColor}`,
        boxShadow: highlighted && reveal > 0.5 ? shadows.card : shadows.cardSoft,
        textAlign: "center",
        fontFamily: fonts.sans,
      }}
    >
      <div
        style={{
          width: 52,
          height: 52,
          margin: "0 auto 14px",
          borderRadius: 14,
          background: colors.accentSoft,
          color: colors.accentDeep,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 30,
          fontWeight: 700,
        }}
      >
        {glyph}
      </div>
      <div
        style={{
          fontSize: 30,
          fontWeight: 800,
          color: colors.ink,
          letterSpacing: "-0.02em",
        }}
      >
        {label}
      </div>
    </div>
  );
};

/**
 * 두 hex 색상 사이를 t (0~1) 로 보간. 단순 RGB 선형.
 */
const interpolateColor = (t: number, fromHex: string, toHex: string): string => {
  const parse = (hex: string) => {
    const h = hex.replace("#", "");
    return [
      parseInt(h.slice(0, 2), 16),
      parseInt(h.slice(2, 4), 16),
      parseInt(h.slice(4, 6), 16),
    ];
  };
  const [r1, g1, b1] = parse(fromHex);
  const [r2, g2, b2] = parse(toHex);
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);
  return `rgb(${r}, ${g}, ${b})`;
};

const BigQuestionMark: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opIn = interpolate(
    frame,
    [QMARK_IN * fps, (QMARK_IN + 0.4) * fps],
    [0, 1],
    {
      easing: easeOutCubic,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
  const opOut = interpolate(
    frame,
    [QMARK_OUT * fps, (QMARK_OUT + 0.3) * fps],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const opacity = opIn * opOut;
  const breath = 1 + Math.sin((frame / fps) * 2.4) * 0.03;
  return (
    <div
      style={{
        width: 220,
        height: 220,
        borderRadius: "50%",
        background: colors.accentSoft,
        border: `5px solid ${colors.accent}`,
        color: colors.accentDeep,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: fonts.sans,
        fontSize: 140,
        fontWeight: 800,
        boxShadow: shadows.card,
        opacity,
        transform: `scale(${breath})`,
      }}
    >
      ?
    </div>
  );
};

export const Scene06: React.FC = () => {
  return (
    <PageBackground>
      <CenteredStage paddingY={120}>
        <FadeIn delaySec={0.2} translateY={8}>
          <div
            style={{
              fontFamily: fonts.sans,
              fontSize: 30,
              fontWeight: 600,
              color: colors.accentDeep,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              marginBottom: 32,
            }}
          >
            잠깐 — 어느 걸 가장 먼저 쓸까요?
          </div>
        </FadeIn>

        {/* 카드 3개 — 작은 크기로 상단 */}
        <div style={{ display: "flex", gap: 36, marginBottom: 80 }}>
          {concepts.map((c, i) => (
            <RecallCard
              key={c.label}
              label={c.label}
              glyph={c.glyph}
              highlighted={c.label === "자연어"}
              delaySec={0.4 + i * 0.18}
            />
          ))}
        </div>

        {/* 큰 물음표 — 정적 동안 */}
        <BigQuestionMark />
      </CenteredStage>
    </PageBackground>
  );
};
