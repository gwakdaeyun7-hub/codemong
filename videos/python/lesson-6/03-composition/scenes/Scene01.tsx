/**
 * Scene 1 — 도입: 오늘 다룰 것 + 2강 고리 회상 (12s)
 *
 * - 좌상단 코스 라벨: "파이썬 기초 · 6강"
 * - 중앙 큰 제목: "반복문" (zinc-50 배경)
 * - violet-500 underline
 * - 부제: "`for` · `while` · `break` · `continue`"
 * - 우측 하단 회상 카드 (2강 mock, opacity 0.65):
 *     사각형 두 개 + 위로 되돌아오는 굽은 화살표 (LoopIcon)
 *     라벨 "2강 — 순서도의 고리 ✓"
 * - 9~12s 구간: 회상 카드의 굽은 화살표가 violet-500 으로 한 번 펄스
 *     화살표 옆 "= 반복문" 라벨 fade-in
 *
 * 5강의 마름모 회상 + morph hook 패턴을 6강의 *고리* 회상으로 변주.
 * 차분한 학원 인강 톤 — 트렌디한 모션 X.
 */

import React from "react";
import {
  AccentUnderline,
  CourseLabel,
  FadeIn,
  LoopIcon,
  PageBackground,
} from "../primitives";
import { colors, fonts, radii, shadows } from "../theme";

export const Scene01: React.FC = () => {
  return (
    <PageBackground>
      {/* 좌상단 코스 라벨 */}
      <div style={{ position: "absolute", top: 96, left: 96 }}>
        <FadeIn delaySec={0.2} translateY={6}>
          <CourseLabel>파이썬 기초 · 6강</CourseLabel>
        </FadeIn>
      </div>

      {/* 중앙 큰 제목 */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          paddingTop: 240,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <FadeIn delaySec={0.6} translateY={16}>
          <h1
            style={{
              margin: 0,
              fontFamily: fonts.sans,
              fontSize: 130,
              fontWeight: 800,
              color: colors.ink,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
            }}
          >
            반복문
          </h1>
        </FadeIn>
        <div style={{ height: 28 }} />
        <AccentUnderline width={200} delaySec={1.4} durationSec={0.7} />
        <div style={{ height: 32 }} />
        <FadeIn delaySec={1.8} translateY={10}>
          <p
            style={{
              margin: 0,
              fontFamily: fonts.sans,
              fontSize: 36,
              fontWeight: 500,
              color: colors.inkMuted,
              letterSpacing: "-0.01em",
            }}
          >
            <span style={{ fontFamily: fonts.mono, color: colors.accentDeep }}>for</span> ·{" "}
            <span style={{ fontFamily: fonts.mono, color: colors.accentDeep }}>while</span> ·{" "}
            <span style={{ fontFamily: fonts.mono, color: colors.accentDeep }}>break</span> ·{" "}
            <span style={{ fontFamily: fonts.mono, color: colors.accentDeep }}>continue</span>
          </p>
        </FadeIn>
      </div>

      {/* 우측 하단 회상 카드 (2강 고리) */}
      <div
        style={{
          position: "absolute",
          bottom: 96,
          right: 96,
          opacity: 0.7,
        }}
      >
        <FadeIn delaySec={3.0} translateY={10}>
          <div
            style={{
              padding: "18px 26px",
              borderRadius: radii.card,
              background: colors.bgWhite,
              border: `1px solid ${colors.border}`,
              boxShadow: shadows.cardSoft,
              display: "flex",
              alignItems: "center",
              gap: 18,
              fontFamily: fonts.sans,
            }}
          >
            {/* 작은 LoopIcon — 9s 부터 펄스 */}
            <div style={{ flexShrink: 0 }}>
              <LoopIcon
                width={88}
                height={84}
                color={colors.accent}
                pulse
                pulseDelaySec={6.0}
              />
            </div>
            <div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: colors.accentDeep,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}
              >
                2강 완료
              </div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 600,
                  color: colors.ink,
                  letterSpacing: "-0.01em",
                  marginTop: 2,
                }}
              >
                순서도의 고리 ✓
              </div>
            </div>
          </div>
        </FadeIn>

        {/* "= 반복문" 라벨 — 9s 부터 fade-in (펄스와 동시 진입) */}
        <div
          style={{
            position: "absolute",
            top: -8,
            right: -180,
            display: "flex",
            justifyContent: "flex-start",
          }}
        >
          <FadeIn delaySec={6.5} translateY={-6}>
            <div
              style={{
                padding: "8px 18px",
                borderRadius: radii.pill,
                background: colors.accentSoft,
                color: colors.accentInk,
                fontFamily: fonts.sans,
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: "-0.01em",
                border: `1.5px solid ${colors.accent}`,
                whiteSpace: "nowrap",
              }}
            >
              = 반복문
            </div>
          </FadeIn>
        </div>
      </div>
    </PageBackground>
  );
};
