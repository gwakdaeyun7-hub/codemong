/**
 * Scene 7 — 3분기 시나리오 도입 (12s)
 *
 * - 화면 중앙에 시나리오 카드 (BranchScenarioCard)
 *     상단 라벨: "시험 점수 → 세 갈래"
 *     3줄 fade-in (각 0.4초 간격):
 *       "60 이상" → "합격"
 *       "40 이상 60 미만" → "재시험"
 *       "그 외" → "불합격"
 *
 * 학습 목표 3번 진입. 정수 비교만. 다음 scene 의 코드 도입 직전.
 */

import React from "react";
import { BranchScenarioCard, CenteredStage, FadeIn, PageBackground } from "../primitives";
import { colors, fonts } from "../theme";

export const Scene07: React.FC = () => {
  return (
    <PageBackground>
      <CenteredStage paddingY={120}>
        <FadeIn delaySec={0.1} translateY={6}>
          <div
            style={{
              fontFamily: fonts.sans,
              fontSize: 30,
              fontWeight: 600,
              color: colors.accentDeep,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              marginBottom: 40,
            }}
          >
            세 갈래 시나리오
          </div>
        </FadeIn>

        <BranchScenarioCard
          title="시험 점수 → 세 갈래"
          width={1000}
          cardDelaySec={0.4}
          branchDelayStartSec={1.0}
          branchStaggerSec={0.55}
          branches={[
            { condition: "60 이상", outcome: "합격" },
            { condition: "40 이상 60 미만", outcome: "재시험" },
            { condition: "그 외", outcome: "불합격" },
          ]}
        />
      </CenteredStage>
    </PageBackground>
  );
};
