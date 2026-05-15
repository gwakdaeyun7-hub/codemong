/**
 * Scene 3 — 비교 연산자 짧은 복습 (13s)
 *
 * - 화면 중앙에 비교 표현 박스 3개, 위에서 아래로 fade-in (각 0.4초 간격)
 *     박스 1: `60 >= 60` → True
 *     박스 2: `75 >= 60` → True
 *     박스 3: `40 >= 60` → False
 * - 화면 하단 lower-third: "비교의 결과는 항상 True / False"
 *
 * 4강 미제작 보정 1줄 복습. 짧게.
 */

import React from "react";
import {
  CenteredStage,
  ComparisonBox,
  FadeIn,
  LowerThird,
  PageBackground,
  PyToken,
} from "../primitives";
import { colors, fonts } from "../theme";

export const Scene03: React.FC = () => {
  return (
    <PageBackground>
      <CenteredStage paddingY={100}>
        <FadeIn delaySec={0.1} translateY={6}>
          <div
            style={{
              fontFamily: fonts.sans,
              fontSize: 30,
              fontWeight: 600,
              color: colors.accentDeep,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              marginBottom: 36,
            }}
          >
            잠깐 — 비교의 결과
          </div>
        </FadeIn>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          <ComparisonBox expression="60 >= 60" result="True" delaySec={1.5} />
          <ComparisonBox expression="75 >= 60" result="True" delaySec={2.5} />
          <ComparisonBox expression="40 >= 60" result="False" delaySec={3.5} />
        </div>
      </CenteredStage>

      <LowerThird
        text={
          <>
            비교의 결과는 항상{" "}
            <span style={{ fontFamily: fonts.mono, color: colors.accentLight }}>
              <PyToken text="True" kind="keyword" />
            </span>{" "}
            / <span style={{ fontFamily: fonts.mono, color: "#a1a1aa" }}>False</span>
          </>
        }
        delaySec={5.0}
      />
    </PageBackground>
  );
};
