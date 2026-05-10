/**
 * Scene 7 — 시나리오 도입: 편의점 음료 사기 (13s)
 *
 * 화면 중앙에 시나리오 카드 (큰 박스, 살짝 둥근 모서리)
 *   좌측: 음료수 페트병 일러스트 mock
 *   우측: 텍스트
 *     "편의점 — 음료 결제"
 *     "가격이 5천 원 초과 → 카드"
 *     "그 외 → 현금"
 *   5천 원 부분만 violet-500 강조
 *
 * 한 시나리오만 끝까지 (00-objectives §5 권고). 여기서 도입하고
 * scene 8~12 까지 같은 시나리오로 자연어→의사코드→순서도 변환.
 */

import React from "react";
import {
  BeverageGlyph,
  CenteredStage,
  Card,
  FadeIn,
  PageBackground,
} from "../primitives";
import { colors, fonts } from "../theme";

export const Scene07: React.FC = () => {
  return (
    <PageBackground>
      <CenteredStage paddingY={140}>
        <FadeIn delaySec={0.1} translateY={6}>
          <div
            style={{
              fontFamily: fonts.sans,
              fontSize: 30,
              fontWeight: 600,
              color: colors.accentDeep,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            오늘의 시나리오
          </div>
        </FadeIn>
        <FadeIn delaySec={0.4} translateY={10}>
          <h2
            style={{
              margin: 0,
              fontFamily: fonts.sans,
              fontSize: 56,
              fontWeight: 800,
              color: colors.ink,
              letterSpacing: "-0.02em",
              marginBottom: 48,
            }}
          >
            편의점에서 음료 사기
          </h2>
        </FadeIn>

        <FadeIn delaySec={1.0} translateY={20}>
          <Card style={{ width: 1100, padding: "48px 56px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 56,
              }}
            >
              {/* 좌측 — 음료 일러스트 */}
              <div style={{ flexShrink: 0 }}>
                <BeverageGlyph size={120} />
              </div>
              {/* 우측 — 시나리오 텍스트 */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 20,
                  textAlign: "left",
                }}
              >
                <FadeIn delaySec={1.5} translateY={8}>
                  <div
                    style={{
                      fontFamily: fonts.sans,
                      fontSize: 30,
                      fontWeight: 700,
                      color: colors.accentDeep,
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                    }}
                  >
                    편의점 — 음료 결제
                  </div>
                </FadeIn>
                <FadeIn delaySec={2.0} translateY={8}>
                  <div
                    style={{
                      fontFamily: fonts.sans,
                      fontSize: 38,
                      fontWeight: 600,
                      color: colors.ink,
                      letterSpacing: "-0.01em",
                      lineHeight: 1.4,
                    }}
                  >
                    가격이{" "}
                    <span
                      style={{
                        color: colors.accentDeep,
                        fontWeight: 800,
                        background: colors.accentSoft,
                        padding: "2px 12px",
                        borderRadius: 8,
                      }}
                    >
                      5천 원 초과
                    </span>{" "}
                    →{" "}
                    <span style={{ color: colors.accentDeep, fontWeight: 800 }}>
                      카드
                    </span>
                  </div>
                </FadeIn>
                <FadeIn delaySec={2.6} translateY={8}>
                  <div
                    style={{
                      fontFamily: fonts.sans,
                      fontSize: 38,
                      fontWeight: 600,
                      color: colors.ink,
                      letterSpacing: "-0.01em",
                      lineHeight: 1.4,
                    }}
                  >
                    그 외 →{" "}
                    <span style={{ color: colors.accentDeep, fontWeight: 800 }}>
                      현금
                    </span>
                  </div>
                </FadeIn>
              </div>
            </div>
          </Card>
        </FadeIn>
      </CenteredStage>
    </PageBackground>
  );
};
