/**
 * Scene 2 — 오늘의 목표 (12s)
 *
 * 화면 중앙 체크리스트 카드 3줄, 위에서 아래로 fade-in.
 * 각 줄 좌측에 작은 violet-500 점.
 *
 * 1·2강과 동일 패턴 — 시즌 통일성.
 */

import React from "react";
import { Card, CenteredStage, FadeIn, PageBackground } from "../primitives";
import { colors, fonts } from "../theme";

const items = [
  "변수가 무엇이고 왜 쓰는지 설명한다",
  "숫자, 문자열, 불린 세 자료형을 구분한다",
  "print() 로 변수 값을 화면에 보여준다",
];

export const Scene02: React.FC = () => {
  return (
    <PageBackground>
      <CenteredStage>
        <FadeIn delaySec={0.2} translateY={10}>
          <div
            style={{
              fontFamily: fonts.sans,
              fontSize: 30,
              fontWeight: 600,
              color: colors.accentDeep,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              marginBottom: 24,
            }}
          >
            오늘의 목표
          </div>
        </FadeIn>
        <FadeIn delaySec={0.5} translateY={14}>
          <Card style={{ width: 1200, padding: "44px 56px" }}>
            <ul
              style={{
                listStyle: "none",
                margin: 0,
                padding: 0,
                display: "flex",
                flexDirection: "column",
                gap: 28,
                textAlign: "left",
              }}
            >
              {items.map((text, i) => (
                <li key={i}>
                  <FadeIn delaySec={0.9 + i * 0.45} translateY={10}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 24,
                        fontFamily: fonts.sans,
                        fontSize: 40,
                        fontWeight: 600,
                        color: colors.ink,
                        letterSpacing: "-0.01em",
                      }}
                    >
                      <span
                        style={{
                          width: 14,
                          height: 14,
                          borderRadius: "50%",
                          background: colors.accent,
                          flexShrink: 0,
                        }}
                      />
                      {text}
                    </div>
                  </FadeIn>
                </li>
              ))}
            </ul>
          </Card>
        </FadeIn>
      </CenteredStage>
    </PageBackground>
  );
};
