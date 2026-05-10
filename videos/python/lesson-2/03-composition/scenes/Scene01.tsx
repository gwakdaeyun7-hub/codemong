/**
 * Scene 1 — 도입: 오늘 배우는 것 (13s)
 *
 * - 좌상단 코스 라벨: "파이썬 기초 · 2강"
 * - 중앙 큰 제목: "코딩의 표현 방법"
 * - 부제목: "자연어 / 의사코드 / 순서도"
 * - violet underline
 * - 우측 하단 회상 카드 (1강 mock): "1강 — 파이썬 환경 갖추기 ✓" (opacity 0.6)
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
          <CourseLabel>파이썬 기초 · 2강</CourseLabel>
        </FadeIn>
      </div>

      {/* 중앙 큰 제목 */}
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
            코딩의 표현 방법
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
            자연어 / 의사코드 / 순서도
          </p>
        </FadeIn>
      </div>

      {/* 우측 하단 회상 카드 (1강 끝났음을 환기) */}
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
                1강 완료
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
                파이썬 환경 갖추기
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </PageBackground>
  );
};
