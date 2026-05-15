/**
 * Scene 5 — Active Recall 1: 우선순위 예측 (10s)
 *
 * narration: "이 식의 결과는 무엇일까요. 2 더하기 3 곱하기 4. 잠깐 멈춰서 생각해 보세요.
 *             (2초 정적) 정답은 14입니다. 곱하기가 먼저 계산되어 3 곱하기 4는 12, 거기에
 *             2를 더해 14가 됩니다."
 *
 * 타이밍 (scene local):
 *   0.0 ~ 3.0  : 큰 코드 `print(2 + 3 * 4)` type-on
 *   3.0 ~ 5.0  : 큰 ? 박스 + 카운트다운 도트 3개 점등 (1s 간격)
 *   5.0 ~ 7.0  : 2초 정적 (narration 없음, 도트는 모두 켜진 상태로 유지)
 *   7.0 ~ 7.5  : ? → 14 swap (scale up)
 *   7.5 ~ 10.0 : 풀이 라벨 "3 * 4 = 12, 12 + 2 = 14" fade-in
 */

import React from "react";
import {
  CountdownDots,
  EmphasisPulse,
  FadeIn,
  PageBackground,
  PyToken,
  QuestionBox,
  TypeOnTokens,
} from "../primitives";
import { colors, fonts, radii } from "../theme";

export const Scene05: React.FC = () => {
  return (
    <PageBackground>
      {/* 좌상단 scene 라벨 */}
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
            잠깐 — 직접 예측해보세요
          </div>
        </FadeIn>
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 48,
          padding: "180px 96px 96px",
        }}
      >
        {/* 큰 코드 — print(2 + 3 * 4) */}
        <FadeIn delaySec={0.3} translateY={16}>
          <div
            style={{
              fontFamily: fonts.mono,
              fontSize: 96,
              fontWeight: 800,
              color: colors.ink,
              letterSpacing: "-0.02em",
              padding: "28px 48px",
              background: colors.bgWhite,
              borderRadius: radii.card,
              border: `1px solid ${colors.border}`,
            }}
          >
            <TypeOnTokens
              delaySec={0.6}
              msPerChar={120}
              segments={[
                { text: "print", kind: "func" },
                { text: "(", kind: "op" },
                { text: "2", kind: "number" },
                { text: " + ", kind: "op" },
                { text: "3", kind: "number" },
                { text: " * ", kind: "op" },
                { text: "4", kind: "number" },
                { text: ")", kind: "op" },
              ]}
            />
          </div>
        </FadeIn>

        {/* ? → 14 swap 박스 + 카운트다운 */}
        <FadeIn delaySec={3.0} translateY={16}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 18,
            }}
          >
            {/* v3 reveal 타이밍 정렬: narration "정답은 14입니다" 등장 ~9s */}
            <QuestionBox revealAtSec={9.0} answer="14" width={260} height={180} fontSize={88} />
            <div style={{ height: 6 }} />
            <CountdownDots startSec={3.6} count={3} stepSec={0.8} size={18} />
          </div>
        </FadeIn>

        {/* 풀이 라벨 — v3 reveal 정렬 후 9.6s 부터 등장 */}
        <FadeIn delaySec={9.6} translateY={10}>
          <div
            style={{
              fontFamily: fonts.sans,
              fontSize: 28,
              fontWeight: 600,
              color: colors.inkMuted,
              letterSpacing: "-0.01em",
              textAlign: "center",
            }}
          >
            {/* v3 dead-air pulse #1: 11.5s — narration "3 곱하기 4는 12" */}
            <EmphasisPulse atSec={11.5} scaleAmp={0.18} durationSec={0.6}>
              <span style={{ fontFamily: fonts.mono, color: colors.accentDeep, fontWeight: 800 }}>
                3 * 4 = 12
              </span>
            </EmphasisPulse>
            {", "}
            {/* v3 dead-air pulse #2: 14.5s — narration "거기에 2를 더해 14" */}
            <EmphasisPulse atSec={14.5} scaleAmp={0.18} durationSec={0.6}>
              <span style={{ fontFamily: fonts.mono, color: colors.accentDeep, fontWeight: 800 }}>
                12 + 2 = 14
              </span>
            </EmphasisPulse>
          </div>
        </FadeIn>
      </div>

      {/* 좌하단 작은 안내 - 침묵 구간에 학습자가 당황하지 않도록 */}
      <div
        style={{
          position: "absolute",
          bottom: 60,
          left: 0,
          right: 0,
          textAlign: "center",
        }}
      >
        <FadeIn delaySec={5.2} translateY={6}>
          <PyToken text="" />
        </FadeIn>
      </div>
    </PageBackground>
  );
};
