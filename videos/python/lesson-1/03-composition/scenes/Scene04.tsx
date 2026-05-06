/**
 * Scene 4 — 어디에 쓰이나 (18s)
 *
 * 화면 중앙 가로로 3개 박스 배열, 0.4초 간격 fade-in.
 * 박스 1: "데이터", 박스 2: "자동화", 박스 3: "AI"
 * 각 박스 아래 한 줄짜리 부연 텍스트 (작은 글씨).
 */

import React from "react";
import { Card, CenteredStage, FadeIn, PageBackground } from "../primitives";
import { colors, fonts } from "../theme";

const usages = [
  {
    title: "데이터",
    sub: "표·분석·시각화",
    glyph: "▦",
  },
  {
    title: "자동화",
    sub: "반복 작업 처리",
    glyph: "↻",
  },
  {
    title: "AI",
    sub: "에이아이 모델 개발",
    glyph: "✦",
  },
];

export const Scene04: React.FC = () => {
  return (
    <PageBackground>
      <CenteredStage>
        <FadeIn delaySec={0.2} translateY={8}>
          <div
            style={{
              fontFamily: fonts.sans,
              fontSize: 28,
              fontWeight: 600,
              color: colors.accentDeep,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              marginBottom: 20,
            }}
          >
            파이썬은 어디에 쓰이나
          </div>
        </FadeIn>
        <FadeIn delaySec={0.5} translateY={10}>
          <h2
            style={{
              margin: 0,
              fontFamily: fonts.sans,
              fontSize: 64,
              fontWeight: 800,
              color: colors.ink,
              letterSpacing: "-0.02em",
              marginBottom: 60,
            }}
          >
            한 분야에 묶이지 않는 언어
          </h2>
        </FadeIn>
        <div style={{ display: "flex", gap: 36 }}>
          {usages.map((u, i) => (
            <FadeIn key={u.title} delaySec={1.0 + i * 0.4} translateY={20}>
              <Card style={{ width: 320, padding: "44px 36px", textAlign: "center" }}>
                <div
                  style={{
                    width: 88,
                    height: 88,
                    margin: "0 auto 24px",
                    borderRadius: 20,
                    background: colors.accentSoft,
                    color: colors.accentDeep,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 50,
                    fontWeight: 700,
                  }}
                >
                  {u.glyph}
                </div>
                <div
                  style={{
                    fontFamily: fonts.sans,
                    fontSize: 48,
                    fontWeight: 800,
                    color: colors.ink,
                    letterSpacing: "-0.02em",
                    marginBottom: 12,
                  }}
                >
                  {u.title}
                </div>
                <div
                  style={{
                    fontFamily: fonts.sans,
                    fontSize: 24,
                    fontWeight: 500,
                    color: colors.inkMuted,
                  }}
                >
                  {u.sub}
                </div>
              </Card>
            </FadeIn>
          ))}
        </div>
      </CenteredStage>
    </PageBackground>
  );
};
