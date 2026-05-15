/**
 * Scene 12 — 정리 + 7강 예고 (16s)
 *
 * 5강·4강 마무리 패턴 — 시즌 통일성 (체크리스트 + 다음 강의 카드).
 *
 * - 0~10s: 화면 좌측 절반 4단 정리 카드 (위→아래 0.7초 간격, 좌측에 ✓)
 *     1: "정해진 횟수 → for"
 *     2: "조건 만족 동안 → while"
 *     3: "빠져나가기 → break · 건너뛰기 → continue"
 *     4: "들여쓰기 깊이 = 루프 안/밖"
 * - 10~14s: 4 카드 좌측으로 슬라이드 아웃 (opacity 1→0 + translateX -40), 우측에 7강 카드 fade-in
 *     "다음 강의 — 7강 / 리스트"
 *     "for 가 진짜 데이터 묶음 을 따라간다"
 *     우측 화살표 →
 * - 14~16s: 화면 하단 "Lesson 6 / 끝" 라벨 fade-in. 전체 화면 0.5초 페이드 아웃.
 */

import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Card, FadeIn, PageBackground } from "../primitives";
import { colors, fonts, radii } from "../theme";

const easeOutCubic = Easing.bezier(0.16, 1, 0.3, 1);

const REVEAL = {
  card1: 0.5,
  card2: 1.2,
  card3: 1.9,
  card4: 2.6,
  slideOut: 10.0,
  nextCard: 10.5,
  endLabel: 14.0,
  fadeOut: 15.4,
} as const;

const checklist: { label: React.ReactNode; desc?: string }[] = [
  {
    label: (
      <>
        정해진 횟수 → <span style={{ fontFamily: fonts.mono }}>for</span>
      </>
    ),
  },
  {
    label: (
      <>
        조건 만족 동안 → <span style={{ fontFamily: fonts.mono }}>while</span>
      </>
    ),
  },
  {
    label: (
      <>
        빠져나가기 → <span style={{ fontFamily: fonts.mono }}>break</span> · 건너뛰기 →{" "}
        <span style={{ fontFamily: fonts.mono }}>continue</span>
      </>
    ),
  },
  {
    label: <>들여쓰기 깊이 = 루프 안/밖</>,
  },
];

/** 좌측 카드들 — sinceSec 부터 좌측으로 슬라이드 아웃. */
const SlideOut: React.FC<{
  children: React.ReactNode;
  sinceSec: number;
  durationSec?: number;
}> = ({ children, sinceSec, durationSec = 0.7 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = sinceSec * fps;
  const end = start + durationSec * fps;
  const progress = interpolate(frame, [start, end], [0, 1], {
    easing: easeOutCubic,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        opacity: 1 - progress,
        transform: `translateX(${progress * -60}px)`,
      }}
    >
      {children}
    </div>
  );
};

/** 전체 화면 fade-out (마지막 0.6초). */
const PageFadeOut: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = REVEAL.fadeOut * fps;
  const end = start + 0.5 * fps;
  const opacity = interpolate(frame, [start, end], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return <div style={{ opacity, position: "absolute", inset: 0 }}>{children}</div>;
};

export const Scene12: React.FC = () => {
  return (
    <PageFadeOut>
      <PageBackground>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 48,
            paddingLeft: 96,
            paddingRight: 96,
            paddingBottom: 160,
          }}
        >
          {/* Left: checklist (10s 부터 슬라이드 아웃) */}
          <SlideOut sinceSec={REVEAL.slideOut}>
            <Card style={{ width: 760, padding: "44px 48px" }}>
              <div
                style={{
                  fontFamily: fonts.sans,
                  fontSize: 24,
                  fontWeight: 700,
                  color: colors.accentDeep,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  marginBottom: 24,
                }}
              >
                오늘 정리
              </div>
              <ul
                style={{
                  listStyle: "none",
                  margin: 0,
                  padding: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: 18,
                }}
              >
                {checklist.map((item, i) => (
                  <li key={i}>
                    <FadeIn
                      delaySec={REVEAL.card1 + i * (REVEAL.card2 - REVEAL.card1)}
                      translateY={8}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 18,
                          fontFamily: fonts.sans,
                        }}
                      >
                        <span
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 10,
                            background: colors.accent,
                            color: "#ffffff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 20,
                            fontWeight: 800,
                            flexShrink: 0,
                          }}
                        >
                          ✓
                        </span>
                        <div
                          style={{
                            fontSize: 26,
                            fontWeight: 700,
                            color: colors.ink,
                            letterSpacing: "-0.01em",
                            lineHeight: 1.4,
                          }}
                        >
                          {item.label}
                        </div>
                      </div>
                    </FadeIn>
                  </li>
                ))}
              </ul>
            </Card>
          </SlideOut>

          {/* Right: 7강 예고 — REVEAL.nextCard 부터 fade-in */}
          <FadeIn delaySec={REVEAL.nextCard} translateY={20}>
            <Card
              variant="accent"
              style={{
                width: 540,
                padding: "48px 48px",
                borderRadius: radii.card,
              }}
            >
              <div
                style={{
                  fontFamily: fonts.sans,
                  fontSize: 22,
                  fontWeight: 700,
                  color: colors.accentInk,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  marginBottom: 14,
                  opacity: 0.8,
                }}
              >
                다음 강의 — 7강
              </div>
              <div
                style={{
                  fontFamily: fonts.sans,
                  fontSize: 60,
                  fontWeight: 800,
                  color: colors.accentInk,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.2,
                  marginBottom: 18,
                }}
              >
                리스트
              </div>
              <div
                style={{
                  fontFamily: fonts.sans,
                  fontSize: 22,
                  fontWeight: 500,
                  color: colors.accentInk,
                  letterSpacing: "-0.01em",
                  opacity: 0.85,
                  lineHeight: 1.5,
                }}
              >
                <span style={{ fontFamily: fonts.mono, fontWeight: 700 }}>for</span> 가 숫자 묶음
                대신
                <br />
                진짜 데이터 묶음을 따라갑니다
              </div>
              <div
                style={{
                  marginTop: 28,
                  display: "flex",
                  justifyContent: "flex-end",
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
              </div>
            </Card>
          </FadeIn>
        </div>

        {/* 하단 "Lesson 6 / 끝" 라벨 */}
        <div
          style={{
            position: "absolute",
            bottom: 80,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <FadeIn delaySec={REVEAL.endLabel} translateY={6}>
            <div
              style={{
                padding: "10px 22px",
                borderRadius: 999,
                background: colors.bgWhite,
                border: `1.5px solid ${colors.border}`,
                fontFamily: fonts.sans,
                fontSize: 18,
                fontWeight: 700,
                color: colors.inkMuted,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              Lesson 6 / 끝
            </div>
          </FadeIn>
        </div>
      </PageBackground>
    </PageFadeOut>
  );
};
