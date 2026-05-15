/**
 * Scene 11 — 중첩 시나리오 도입 (12s)
 *
 * - 화면 중앙에 시나리오 카드
 *     상단 라벨: "로그인 → (그 안에서) 관리자?"
 *     도식 2단계:
 *       1단계: 큰 박스 "로그인했는가?" (옅은 violet 띠)
 *       2단계: 그 안에 작은 박스 "관리자인가?" (더 진한 violet 띠)
 *     containment 시각화 — 박스 안 박스
 *
 * 학습 목표 5번 진입. 5강 특수 시각화: containment 박스 (1단/2단 띠 색 분리).
 */

import React from "react";
import { CenteredStage, ContainmentBoxes, FadeIn, PageBackground } from "../primitives";
import { colors, fonts } from "../theme";

export const Scene11: React.FC = () => {
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
              marginBottom: 16,
            }}
          >
            중첩 — 갈래 안에 또 갈래
          </div>
        </FadeIn>

        <FadeIn delaySec={0.5} translateY={10}>
          <div
            style={{
              fontFamily: fonts.sans,
              fontSize: 28,
              fontWeight: 500,
              color: colors.inkMuted,
              letterSpacing: "-0.01em",
              marginBottom: 32,
            }}
          >
            로그인 → (그 안에서) 관리자?
          </div>
        </FadeIn>

        <ContainmentBoxes
          outerLabel="로그인했는가?"
          innerLabel="관리자인가?"
          outerDelaySec={1.0}
          innerDelaySec={2.5}
          outerWidth={620}
          outerHeight={380}
        />

        <FadeIn delaySec={4.5} translateY={6}>
          <div
            style={{
              marginTop: 32,
              fontFamily: fonts.sans,
              fontSize: 22,
              fontWeight: 500,
              color: colors.inkMuted,
              letterSpacing: "-0.01em",
              textAlign: "center",
              maxWidth: 800,
              lineHeight: 1.5,
            }}
          >
            바깥이 참일 때만, 그 안의 갈래를 따집니다
          </div>
        </FadeIn>
      </CenteredStage>
    </PageBackground>
  );
};
