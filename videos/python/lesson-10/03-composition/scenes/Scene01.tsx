/**
 * Scene 1 — 도입: 오늘 다룰 것 + 9강 함수 일반 회상 (12s)
 *
 * 시즌 정형 통일 (lesson-3/6/8 Scene01 baseline) — inset:0 center,
 * h1 110/800/ink, underline width 180, 36px gap, 부제 36/500/inkMuted.
 *
 * Scene01 정형 5요소 (lesson-8 답습):
 *   - 좌상단 CourseLabel (delaySec 0.2)
 *   - 중앙 110px h1 (delaySec 0.6)
 *   - AccentUnderline width 180 (delaySec 1.4)
 *   - 36px 부제목 (delaySec 1.8)
 *   - 우하단 회상 ✓ 카드 (delaySec 2.6, opacity 0.6)
 *
 * 9강 narration 의존 0회 — 회상 카드 본문은 일반 개념 한 줄
 * "내가 만든 도구를 부르다". 구체 함수 이름 (add/double/greet) 인용 X.
 */

import React from "react";
import {
  AccentUnderline,
  CourseLabel,
  FadeIn,
  PageBackground,
} from "../primitives";
import { colors, fonts, radii, shadows } from "../theme";

export const Scene01: React.FC = () => {
  return (
    <PageBackground>
      {/* 좌상단 코스 라벨 */}
      <div style={{ position: "absolute", top: 96, left: 96 }}>
        <FadeIn delaySec={0.2} translateY={6}>
          <CourseLabel>파이썬 기초 · 10강</CourseLabel>
        </FadeIn>
      </div>

      {/* 중앙 큰 제목 + underline + 부제목 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: 80,
        }}
      >
        <FadeIn delaySec={0.6} translateY={16}>
          <h1
            style={{
              margin: 0,
              fontFamily: fonts.sans,
              fontSize: 110,
              fontWeight: 800,
              color: colors.ink,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
            }}
          >
            모듈 &amp; 랜덤
          </h1>
        </FadeIn>
        <div style={{ height: 28 }} />
        <AccentUnderline width={180} delaySec={1.4} durationSec={0.7} />
        <div style={{ height: 36 }} />
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
            <span style={{ fontFamily: fonts.mono, color: colors.accentDeep }}>
              import
            </span>{" "}
            ·{" "}
            <span style={{ fontFamily: fonts.mono, color: colors.accentDeep }}>
              random
            </span>
          </p>
        </FadeIn>
      </div>

      {/* 우측 하단 회상 카드 (9강 함수 일반 회상 — 9강 narration 의존 X) */}
      <div style={{ position: "absolute", bottom: 96, right: 96, opacity: 0.6 }}>
        <FadeIn delaySec={2.6} translateY={10}>
          <div
            style={{
              padding: "16px 22px",
              borderRadius: radii.card,
              background: colors.bgWhite,
              border: `1px solid ${colors.border}`,
              boxShadow: shadows.cardSoft,
              display: "flex",
              alignItems: "center",
              gap: 14,
              fontFamily: fonts.sans,
            }}
          >
            <span
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: colors.success,
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                fontWeight: 800,
              }}
            >
              ✓
            </span>
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
                9강 회상
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
                내가 만든 도구를 부르다
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </PageBackground>
  );
};
