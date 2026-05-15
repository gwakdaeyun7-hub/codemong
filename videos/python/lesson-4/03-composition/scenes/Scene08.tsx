/**
 * Scene 8 — 논리 연산자 3종 직관 (12s)
 *
 * narration: "마지막으로 논리 연산자 세 가지. 앤드는 둘 다 참이어야 참, 오어는 하나라도
 *             참이면 참, 낫은 뒤집기. 예시로 True and False 는 False, True or False 는 True,
 *             not True 는 False."
 *
 * 타이밍 (scene local):
 *   0.0 ~ 0.5  : scene 라벨
 *   0.5 ~ 4.0  : 3개 카드 좌→중→우 fade-in (0.5s 간격) — 헤더 + 직관까지
 *   4.0 ~ 12.0 : 각 카드의 예시 코드/결과가 0.8s 간격으로 차례 등장
 */

import React from "react";
import { FadeIn, LogicCard, PageBackground } from "../primitives";
import { colors, fonts } from "../theme";

export const Scene08: React.FC = () => {
  return (
    <PageBackground>
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 0,
          right: 0,
          textAlign: "center",
        }}
      >
        <FadeIn delaySec={0.1} translateY={6}>
          <div
            style={{
              fontFamily: fonts.sans,
              fontSize: 28,
              fontWeight: 600,
              color: colors.accentDeep,
              letterSpacing: "0.04em",
            }}
          >
            논리 연산자 3종 — and / or / not
          </div>
        </FadeIn>
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "140px 80px 60px",
          gap: 40,
        }}
      >
        <LogicCard
          operator="and"
          intuition="둘 다 참이어야 참"
          exampleExpr="True and False"
          exampleResult="False"
          delaySec={0.5}
          exampleDelaySec={4.0}
        />
        <LogicCard
          operator="or"
          intuition="하나라도 참이면 참"
          exampleExpr="True or False"
          exampleResult="True"
          delaySec={1.0}
          exampleDelaySec={5.4}
        />
        <LogicCard
          operator="not"
          intuition="뒤집기"
          exampleExpr="not True"
          exampleResult="False"
          delaySec={1.5}
          exampleDelaySec={6.8}
        />
      </div>
    </PageBackground>
  );
};
