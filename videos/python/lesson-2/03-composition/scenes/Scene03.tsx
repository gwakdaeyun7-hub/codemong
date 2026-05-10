/**
 * Scene 3 — 왜 표현 단계가 필요한가 (18s)
 *
 * - 좌측: "문제" 라벨 박스
 * - 우측: "코드" 라벨 박스
 * - 두 박스 사이 회색 점선 화살표 (얇게, 흐릿하게)
 * - 점선 위 빨간 X 표시 fade-in
 * - 화면 하단 lower-third: "문제와 코드 사이엔 표현 단계가 들어갑니다"
 *
 * 오개념 3 (컴퓨터가 빠진 단계 추론) 의 토대. 다음 scene 4 에서 세 박스가
 * 점선 위에 채워지는 흐름.
 */

import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import {
  Card,
  CenteredStage,
  FadeIn,
  LowerThird,
  PageBackground,
  easeOutCubic,
} from "../primitives";
import { colors, fonts } from "../theme";

const X_AT = 4.5; // sec — 빨간 X 등장 시점

const ConceptBoxLabeled: React.FC<{
  label: string;
  delaySec: number;
}> = ({ label, delaySec }) => {
  return (
    <FadeIn delaySec={delaySec} translateY={20}>
      <Card style={{ width: 320, padding: "60px 40px", textAlign: "center" }}>
        <div
          style={{
            fontFamily: fonts.sans,
            fontSize: 64,
            fontWeight: 800,
            color: colors.ink,
            letterSpacing: "-0.02em",
          }}
        >
          {label}
        </div>
      </Card>
    </FadeIn>
  );
};

const RedX: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inProg = interpolate(frame, [X_AT * fps, (X_AT + 0.4) * fps], [0, 1], {
    easing: easeOutCubic,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        width: 96,
        height: 96,
        borderRadius: "50%",
        background: colors.bgWhite,
        border: `4px solid ${colors.danger}`,
        color: colors.danger,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: fonts.sans,
        fontSize: 56,
        fontWeight: 800,
        opacity: inProg,
        transform: `scale(${0.6 + 0.4 * inProg})`,
      }}
    >
      ×
    </div>
  );
};

const DashedArrow: React.FC<{ width: number; delaySec: number }> = ({
  width,
  delaySec,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = delaySec * fps;
  const end = start + 0.7 * fps;
  const grow = interpolate(frame, [start, end], [0, 1], {
    easing: easeOutCubic,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "relative",
        width,
        height: 6,
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: width * grow,
          height: 4,
          background: `repeating-linear-gradient(to right, ${colors.inkSubtle} 0 12px, transparent 12px 24px)`,
          opacity: 0.7,
          borderRadius: 2,
        }}
      />
    </div>
  );
};

export const Scene03: React.FC = () => {
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
              marginBottom: 60,
            }}
          >
            왜 표현 단계가 필요한가
          </div>
        </FadeIn>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 0,
            position: "relative",
          }}
        >
          <ConceptBoxLabeled label="문제" delaySec={0.4} />
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 480,
              height: 200,
            }}
          >
            <DashedArrow width={420} delaySec={1.2} />
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <RedX />
            </div>
          </div>
          <ConceptBoxLabeled label="코드" delaySec={0.7} />
        </div>
      </CenteredStage>
      <LowerThird
        text="문제와 코드 사이엔 표현 단계가 들어갑니다"
        delaySec={6.0}
      />
    </PageBackground>
  );
};
