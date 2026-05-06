/**
 * Scene 1 — 도입: 오늘 배우는 것 (12s)
 *
 * - 좌상단 코스 라벨: "파이썬 기초 · 1강"
 * - 중앙 큰 제목: "파이썬 개요 & 개발환경"
 * - 부제목: "환경을 갖추는 시간"
 * - violet underline
 */

import React from "react";
import {
  AccentUnderline,
  CourseLabel,
  FadeIn,
  PageBackground,
} from "../primitives";
import { colors, fonts } from "../theme";

export const Scene01: React.FC = () => {
  return (
    <PageBackground>
      <div style={{ position: "absolute", top: 96, left: 96 }}>
        <FadeIn delaySec={0.2} translateY={6}>
          <CourseLabel>파이썬 기초 · 1강</CourseLabel>
        </FadeIn>
      </div>
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
            파이썬 개요 & 개발환경
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
            환경을 갖추는 시간
          </p>
        </FadeIn>
      </div>
    </PageBackground>
  );
};
