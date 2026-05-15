/**
 * Scene 10 — Active Recall 2: `/` vs `//` 차이 (12s)
 *
 * narration: "7 나누기 2와, 7 슬래시 슬래시 2의 결과를 비교해 봅시다. 한쪽은 3.5, 다른
 *             한쪽은 3. 어느 쪽이 어느 결과일까요. (2초 정적) 슬래시 하나는 실수 나누기로
 *             3.5, 슬래시 두 개는 몫만 가져와서 3."
 *
 * 타이밍 (scene local):
 *   0.0 ~ 0.4  : scene 라벨
 *   0.4 ~ 4.0  : 좌우 split — 좌측 `print(7 / 2)` + 우측 `print(7 // 2)` 큰 코드
 *   4.0 ~ 6.0  : 좌우 각각 ? 박스 fade-in + 카운트다운 도트
 *   6.0 ~ 8.0  : 2초 정적 (도트 모두 점등 상태 유지)
 *   8.0 ~ 8.5  : 좌측 ? → 3.5 swap, 우측 ? → 3 swap
 *   8.5 ~ 12.0 : 좌우 각각 작은 설명 라벨 fade-in
 */

import React from "react";
import {
  CountdownDots,
  EmphasisPulse,
  FadeIn,
  PageBackground,
  QuestionBox,
  TypeOnTokens,
} from "../primitives";
import { colors, fonts, radii } from "../theme";

const SplitSide: React.FC<{
  side: "left" | "right";
  expr: { text: string; kind: "func" | "op" | "number" }[];
  answer: string;
  description: string;
  delayBase: number;
  /**
   * Optional dead-air pulse beat: pulses both the answer in the QuestionBox
   * and the description label at the given scene-local sec.
   */
  pulseAtSec?: number;
}> = ({ side, expr, answer, description, delayBase, pulseAtSec }) => {
  const labelNode = (
    <div
      style={{
        fontFamily: fonts.sans,
        fontSize: 26,
        fontWeight: 700,
        color: colors.inkSoft,
        letterSpacing: "-0.01em",
        textAlign: "center",
      }}
    >
      {description}
    </div>
  );
  // v3 reveal 타이밍 정렬: narration "슬래시 하나는 ... 3.5" ~15s
  const answerWrapped =
    typeof pulseAtSec === "number" ? (
      <EmphasisPulse atSec={pulseAtSec} scaleAmp={0.18} durationSec={0.6}>
        <QuestionBox revealAtSec={15.0} answer={answer} width={260} height={180} fontSize={88} />
      </EmphasisPulse>
    ) : (
      <QuestionBox revealAtSec={15.0} answer={answer} width={260} height={180} fontSize={88} />
    );

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 36,
      }}
    >
      {/* 큰 코드 */}
      <FadeIn delaySec={delayBase} translateY={16}>
        <div
          style={{
            fontFamily: fonts.mono,
            fontSize: 64,
            fontWeight: 800,
            padding: "22px 36px",
            background: colors.bgWhite,
            borderRadius: radii.card,
            border: `1px solid ${colors.border}`,
            letterSpacing: "-0.02em",
          }}
        >
          <TypeOnTokens delaySec={delayBase + 0.3} msPerChar={90} segments={expr} />
        </div>
      </FadeIn>
      {/* ? 박스 */}
      <FadeIn delaySec={delayBase + 3.6} translateY={12}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 14,
          }}
        >
          {answerWrapped}
          {/* v3 reveal 정렬: dots 11.4s 부터 점등, reveal 직전(15s)까지 카운트 유지 */}
          <CountdownDots startSec={11.4} count={3} stepSec={0.8} size={16} />
        </div>
      </FadeIn>
      {/* 설명 라벨 — v3: reveal 후 15.5s 부터 fade-in */}
      <FadeIn delaySec={15.5} translateY={8}>
        {typeof pulseAtSec === "number" ? (
          <EmphasisPulse atSec={pulseAtSec} scaleAmp={0.12} durationSec={0.6}>
            {labelNode}
          </EmphasisPulse>
        ) : (
          labelNode
        )}
      </FadeIn>
      {/* eslint to consume side */}
      <span style={{ display: "none" }}>{side}</span>
    </div>
  );
};

export const Scene10: React.FC = () => {
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
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 22px",
              borderRadius: radii.pill,
              background: colors.accentSoft,
              border: `1px solid ${colors.accent}`,
              fontFamily: fonts.sans,
              fontSize: 22,
              fontWeight: 700,
              color: colors.accentInk,
              letterSpacing: "0.02em",
            }}
          >
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: colors.accent,
              }}
            />
            잠깐 — / 와 // 의 결과는?
          </div>
        </FadeIn>
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "stretch",
          padding: "150px 60px 60px",
          gap: 60,
        }}
      >
        <SplitSide
          side="left"
          expr={[
            { text: "print", kind: "func" },
            { text: "(", kind: "op" },
            { text: "7", kind: "number" },
            { text: " / ", kind: "op" },
            { text: "2", kind: "number" },
            { text: ")", kind: "op" },
          ]}
          answer="3.5"
          description="/ — 실수 나누기"
          delayBase={0.4}
          // v3 pulse: 15s — narration "슬래시 하나는 실수 나누기로 3.5"
          pulseAtSec={15.0}
        />

        {/* 가운데 세로 분리선 */}
        <div
          style={{
            width: 1,
            background: colors.border,
            margin: "20px 0",
          }}
        />

        <SplitSide
          side="right"
          expr={[
            { text: "print", kind: "func" },
            { text: "(", kind: "op" },
            { text: "7", kind: "number" },
            { text: " // ", kind: "op" },
            { text: "2", kind: "number" },
            { text: ")", kind: "op" },
          ]}
          answer="3"
          description="// — 몫만"
          delayBase={0.4}
          // v3 pulse: 18s — narration "슬래시 두 개는 몫만 가져와서 3"
          pulseAtSec={18.0}
        />
      </div>
    </PageBackground>
  );
};
