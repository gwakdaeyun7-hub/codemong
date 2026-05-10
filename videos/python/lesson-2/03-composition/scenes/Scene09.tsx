/**
 * Scene 9 — 빠진 단계 짚기 (오개념 3 정면 처리) (17s)
 *
 * - 앞 scene 의 자연어 박스가 그대로 유지
 * - 박스 안 3번 줄 ("5천 원이 넘으면 카드를 낸다") 위에 빨간 동그라미 강조
 * - 그 아래에 노란 형광펜 느낌으로 "(사인하기 빠짐)" 텍스트 fade-in
 * - 박스 옆에 작은 컴퓨터 아이콘 + 말풍선 "?" — 컴퓨터는 모른다는 시각 신호
 * - 잠시 후 3번 줄이 두 줄로 분리:
 *     "5천 원이 넘으면 카드를 낸다"
 *     "사인을 한다"
 *
 * Beats (sec):
 *   0.3:  자연어 박스 (그대로) 등장
 *   2.0:  3번 줄 위에 빨간 동그라미 강조
 *   3.0:  형광펜 "(사인하기 빠짐)" 등장
 *   3.5:  컴퓨터 아이콘 + ? 등장
 *   8.0:  3번 줄이 두 줄로 분리 (정정)
 */

import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import {
  ComputerGlyph,
  FadeIn,
  NoteBox,
  PageBackground,
  PersonGlyph,
  easeOutCubic,
} from "../primitives";
import { colors, fonts } from "../theme";

const HIGHLIGHT_AT = 2.0;
const HIGHLIGHTER_AT = 3.0;
const COMPUTER_AT = 3.5;
const FIX_AT = 8.0;

const baseLines = [
  "1) 음료를 고른다",
  "2) 가격을 본다",
  "3) 5천 원이 넘으면 카드를 낸다",
  "4) 아니면 현금을 낸다",
];

/** 3번 줄 강조 빨간 동그라미. */
const RedCircleEmphasis: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const draw = interpolate(
    frame,
    [HIGHLIGHT_AT * fps, (HIGHLIGHT_AT + 0.6) * fps],
    [0, 1],
    {
      easing: easeOutCubic,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
  if (draw <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        inset: -8,
        border: `3px solid ${colors.danger}`,
        borderRadius: 999,
        opacity: draw,
        transform: `scale(${0.9 + 0.1 * draw})`,
        pointerEvents: "none",
      }}
    />
  );
};

/** 형광펜 (사인하기 빠짐). */
const Highlighter: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inProg = interpolate(
    frame,
    [HIGHLIGHTER_AT * fps, (HIGHLIGHTER_AT + 0.5) * fps],
    [0, 1],
    {
      easing: easeOutCubic,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
  // FIX_AT 이후 정정되면 형광펜은 살짝 페이드 (이미 짚었으니까 옅게)
  const fade = interpolate(frame, [FIX_AT * fps, (FIX_AT + 0.6) * fps], [1, 0.4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (inProg <= 0) return null;
  return (
    <div
      style={{
        display: "inline-block",
        marginTop: 8,
        padding: "4px 14px",
        borderRadius: 6,
        background: colors.warnSoft,
        color: colors.ink,
        fontFamily: fonts.sans,
        fontSize: 22,
        fontWeight: 600,
        letterSpacing: "-0.01em",
        opacity: inProg * fade,
        transform: `translateY(${(1 - inProg) * 6}px)`,
        boxShadow: `inset 0 -8px 0 ${colors.warn}40`,
      }}
    >
      (사인하기 빠짐)
    </div>
  );
};

/** 3번 줄을 정정하여 두 줄로 분리. FIX_AT 이후 등장. */
const FixedLine: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inProg = interpolate(
    frame,
    [FIX_AT * fps, (FIX_AT + 0.6) * fps],
    [0, 1],
    {
      easing: easeOutCubic,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
  if (inProg <= 0) return null;
  return (
    <div
      style={{
        opacity: inProg,
        transform: `translateY(${(1 - inProg) * 6}px)`,
        marginTop: 6,
        fontFamily: fonts.sans,
        fontSize: 30,
        fontWeight: 600,
        color: colors.accentDeep,
        letterSpacing: "-0.01em",
        background: colors.accentSoft,
        padding: "6px 14px",
        borderRadius: 8,
        display: "inline-block",
      }}
    >
      └ 사인을 한다
    </div>
  );
};

export const Scene09: React.FC = () => {
  return (
    <PageBackground>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          padding: "120px 96px",
          gap: 32,
        }}
      >
        {/* 좌측 절반 — 자연어 노트 박스 (이전 scene 에서 이어짐) */}
        <div style={{ flex: 1, display: "flex", alignItems: "flex-start", gap: 24 }}>
          <FadeIn delaySec={0.3} translateY={10}>
            <NoteBox title="자연어 — 사람 말로 풀어 쓰기" width={780}>
              <ul
                style={{
                  listStyle: "none",
                  margin: 0,
                  padding: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: 22,
                }}
              >
                {baseLines.map((line, i) => {
                  const isLine3 = i === 2;
                  return (
                    <li key={i}>
                      <div style={{ position: "relative", display: "inline-block" }}>
                        <div
                          style={{
                            fontFamily: fonts.sans,
                            fontSize: 32,
                            fontWeight: 500,
                            color: colors.ink,
                            letterSpacing: "-0.01em",
                            lineHeight: 1.5,
                            padding: isLine3 ? "4px 12px" : 0,
                          }}
                        >
                          {line}
                        </div>
                        {isLine3 ? <RedCircleEmphasis /> : null}
                      </div>
                      {isLine3 ? (
                        <>
                          <div>
                            <Highlighter />
                          </div>
                          <FixedLine />
                        </>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </NoteBox>
          </FadeIn>
          <FadeIn delaySec={0.6} translateY={10}>
            <div
              style={{
                marginTop: 60,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
                // scene 8 PersonGlyph 와 시즌 통일성. dim 처리는 scene 9 가 이전
                // scene 의 narration 을 회상하면서 결함을 짚는 맥락이라 자연스럽다.
                opacity: 0.55,
              }}
            >
              {/* 사람 아이콘 (이전 scene 에서 이어짐, 흐릿하게) */}
              <PersonGlyph size={56} />
              <div
                style={{
                  fontFamily: fonts.sans,
                  fontSize: 16,
                  fontWeight: 600,
                  color: colors.inkMuted,
                  letterSpacing: "-0.01em",
                }}
              >
                사람
              </div>
            </div>
          </FadeIn>
        </div>

        {/* 우측 절반 — 컴퓨터 아이콘 + 말풍선 ? */}
        <div
          style={{
            flex: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
            paddingRight: 60,
          }}
        >
          <FadeIn delaySec={COMPUTER_AT} translateY={10}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 14,
              }}
            >
              <ComputerGlyph size={120} withQuestion />
              <div
                style={{
                  fontFamily: fonts.sans,
                  fontSize: 22,
                  fontWeight: 700,
                  color: colors.ink,
                  letterSpacing: "-0.01em",
                }}
              >
                컴퓨터
              </div>
              <div
                style={{
                  maxWidth: 220,
                  textAlign: "center",
                  fontFamily: fonts.sans,
                  fontSize: 18,
                  fontWeight: 500,
                  color: colors.inkMuted,
                  lineHeight: 1.4,
                }}
              >
                빠진 단계는 채워 읽지 않아요
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </PageBackground>
  );
};
