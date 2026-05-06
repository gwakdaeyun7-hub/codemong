/**
 * Scene 12 — 정리 + 다음 강의 예고 (12s)
 *
 * - 좌측 절반: 오늘 한 일 체크리스트 3줄, 각 줄 좌측에 ✓
 *     "파이썬 설치" / "버전 확인" / "파일 실행"
 * - 우측 절반: 다음 강의 예고 카드
 *     "다음 강의 — 2강"
 *     "코딩의 표현 방법: 자연어 / 의사코드 / 순서도"
 *     카드 우측에 작은 화살표 →
 * - lower-third: "Python 3 사용 권장"
 */

import React from "react";
import {
  Card,
  FadeIn,
  LowerThird,
  PageBackground,
} from "../primitives";
import { colors, fonts, radii } from "../theme";

const checklist = ["파이썬 설치", "버전 확인", "파일 실행"];

export const Scene12: React.FC = () => {
  return (
    <PageBackground>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 56,
          paddingLeft: 96,
          paddingRight: 96,
          paddingBottom: 200,
        }}
      >
        {/* Left: checklist */}
        <FadeIn delaySec={0.2} translateY={16}>
          <Card style={{ width: 600, padding: "48px 48px" }}>
            <div
              style={{
                fontFamily: fonts.sans,
                fontSize: 26,
                fontWeight: 600,
                color: colors.accentDeep,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                marginBottom: 24,
              }}
            >
              오늘 한 일
            </div>
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
              {checklist.map((text, i) => (
                <li key={i}>
                  <FadeIn delaySec={0.6 + i * 0.35} translateY={8}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 20,
                        fontFamily: fonts.sans,
                        fontSize: 38,
                        fontWeight: 600,
                        color: colors.ink,
                        letterSpacing: "-0.01em",
                      }}
                    >
                      <span
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 10,
                          background: colors.accent,
                          color: "#ffffff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 22,
                          fontWeight: 800,
                          flexShrink: 0,
                        }}
                      >
                        ✓
                      </span>
                      {text}
                    </div>
                  </FadeIn>
                </li>
              ))}
            </ul>
          </Card>
        </FadeIn>
        {/* Right: next lesson */}
        <FadeIn delaySec={1.4} translateY={20}>
          <Card
            variant="accent"
            style={{
              width: 600,
              padding: "48px 48px",
              borderRadius: radii.card,
            }}
          >
            <div
              style={{
                fontFamily: fonts.sans,
                fontSize: 24,
                fontWeight: 700,
                color: colors.accentInk,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                marginBottom: 16,
                opacity: 0.8,
              }}
            >
              다음 강의 — 2강
            </div>
            <div
              style={{
                fontFamily: fonts.sans,
                fontSize: 40,
                fontWeight: 800,
                color: colors.accentInk,
                letterSpacing: "-0.02em",
                lineHeight: 1.3,
                marginBottom: 24,
              }}
            >
              코딩의 표현 방법
            </div>
            <div
              style={{
                fontFamily: fonts.sans,
                fontSize: 26,
                fontWeight: 500,
                color: colors.accentInk,
                letterSpacing: "-0.01em",
                opacity: 0.85,
              }}
            >
              자연어 / 의사코드 / 순서도
            </div>
            <div
              style={{
                marginTop: 32,
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
      <LowerThird text="Python 3 사용 권장" delaySec={3.0} />
    </PageBackground>
  );
};
