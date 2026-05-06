/**
 * Scene 3 — 파이썬이란 (18s)
 *
 * - 좌측: Python 로고 mock (두 마리 뱀 추상화, violet/blue)
 * - 우측: "프로그래밍 언어" 라벨이 박스 안에
 * - 하단 lower-third: "Python = 사람이 읽기 쉽게 만들어진 언어"
 */

import React from "react";
import { Card, FadeIn, LowerThird, PageBackground, PythonLogoMock } from "../primitives";
import { colors, fonts } from "../theme";

export const Scene03: React.FC = () => {
  return (
    <PageBackground>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: 220,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 96,
          }}
        >
          {/* Left: logo */}
          <FadeIn delaySec={0.3} translateY={20}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 24,
              }}
            >
              <PythonLogoMock size={280} />
              <div
                style={{
                  fontFamily: fonts.sans,
                  fontSize: 44,
                  fontWeight: 800,
                  color: colors.ink,
                  letterSpacing: "-0.02em",
                }}
              >
                Python
              </div>
            </div>
          </FadeIn>

          {/* Connector */}
          <FadeIn delaySec={1.0}>
            <div
              style={{
                width: 80,
                height: 6,
                borderRadius: 3,
                background: colors.accent,
              }}
            />
          </FadeIn>

          {/* Right: language box */}
          <FadeIn delaySec={1.2} translateY={20}>
            <Card variant="accent" style={{ padding: "40px 56px" }}>
              <div
                style={{
                  fontFamily: fonts.sans,
                  fontSize: 30,
                  color: colors.accentInk,
                  fontWeight: 600,
                  marginBottom: 12,
                  letterSpacing: "-0.01em",
                }}
              >
                카테고리
              </div>
              <div
                style={{
                  fontFamily: fonts.sans,
                  fontSize: 56,
                  color: colors.accentInk,
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                }}
              >
                프로그래밍 언어
              </div>
            </Card>
          </FadeIn>
        </div>
      </div>
      <LowerThird
        text="Python = 사람이 읽기 쉽게 만들어진 언어"
        delaySec={3.0}
      />
    </PageBackground>
  );
};
