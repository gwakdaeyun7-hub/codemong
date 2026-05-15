/**
 * Scene 4 — 산술 연산자 7종 표 + 우선순위 한 문장 (15s)
 *
 * narration: "산술 연산자 일곱 가지. + - * / 는 학교 그대로. // 몫, % 나머지, ** 거듭제곱.
 *             곱셈·나눗셈이 덧셈·뺄셈보다 먼저. 헷갈리면 괄호로."
 *
 * 타이밍 (scene local):
 *   0.0 ~ 0.5  : scene 라벨
 *   0.5 ~ 6.0  : 7행 표 위에서 아래로 한 행씩 fade-in (0.55s 간격)
 *   6.0 ~ 9.5  : 표 하단 우선순위 한 줄 카드 fade-in
 *   9.5 ~ 15.0 : 우측 코드 카드 2개 — `2 + 3 * 4` → 14 / `(2 + 3) * 4` → 20
 */

import React from "react";
import { EmphasisPulse, FadeIn, OperatorTable, OpRow, PageBackground, PyToken } from "../primitives";
import { colors, fonts, radii, shadows } from "../theme";

const arithmeticRows: OpRow[] = [
  { op: "+", meaning: "더하기", example: "3 + 5", result: "8" },
  { op: "−", meaning: "빼기", example: "7 − 2", result: "5" },
  { op: "*", meaning: "곱하기", example: "4 * 3", result: "12" },
  { op: "/", meaning: "나누기", example: "7 / 2", result: "3.5" },
  { op: "//", meaning: "몫", example: "7 // 2", result: "3" },
  { op: "%", meaning: "나머지", example: "7 % 2", result: "1" },
  { op: "**", meaning: "거듭제곱", example: "2 ** 3", result: "8" },
];

const PriorityCard: React.FC<{ delaySec: number }> = ({ delaySec }) => {
  return (
    <FadeIn delaySec={delaySec} translateY={14}>
      <div
        style={{
          padding: "18px 30px",
          borderRadius: radii.pill,
          background: colors.accentSoft,
          border: `1px solid ${colors.accent}`,
          fontFamily: fonts.sans,
          fontSize: 26,
          fontWeight: 700,
          color: colors.accentInk,
          letterSpacing: "-0.01em",
          textAlign: "center",
        }}
      >
        곱셈·나눗셈이 덧셈·뺄셈보다 먼저. 헷갈리면 괄호.
      </div>
    </FadeIn>
  );
};

const PriorityExampleCard: React.FC<{
  expr: React.ReactNode;
  result: string;
  delaySec: number;
  /**
   * Optional pulse beat for the result number — used in Scene04 dead-air
   * (~17~19s) to compare 14 vs 20. Wraps the "→ result" span in EmphasisPulse.
   */
  pulseResultAtSec?: number;
}> = ({ expr, result, delaySec, pulseResultAtSec }) => {
  const resultNode = (
    <span
      style={{
        fontFamily: fonts.mono,
        fontSize: 32,
        fontWeight: 800,
        color: colors.darkAccent,
        letterSpacing: "-0.01em",
      }}
    >
      → {result}
    </span>
  );
  return (
    <FadeIn delaySec={delaySec} translateY={16}>
      <div
        style={{
          width: 380,
          padding: "22px 26px",
          borderRadius: radii.card,
          background: colors.darkBg,
          border: `1px solid ${colors.darkBg2}`,
          boxShadow: shadows.card,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <span style={{ fontFamily: fonts.mono, fontSize: 30, fontWeight: 700 }}>{expr}</span>
        {typeof pulseResultAtSec === "number" ? (
          <EmphasisPulse atSec={pulseResultAtSec} scaleAmp={0.18} durationSec={0.6}>
            {resultNode}
          </EmphasisPulse>
        ) : (
          resultNode
        )}
      </div>
    </FadeIn>
  );
};

export const Scene04: React.FC = () => {
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
              fontFamily: fonts.sans,
              fontSize: 28,
              fontWeight: 600,
              color: colors.accentDeep,
              letterSpacing: "0.04em",
            }}
          >
            산술 연산자 7종
          </div>
        </FadeIn>
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          padding: "120px 80px 60px",
          gap: 56,
        }}
      >
        {/* 좌 — 표 + 우선순위 카드 */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 28,
          }}
        >
          <FadeIn delaySec={0.4} translateY={20}>
            <OperatorTable
              rows={arithmeticRows}
              startDelaySec={0.7}
              rowGapSec={0.55}
              width={920}
              // dead-air pulse: 13s ~ 14s 구간에 * (index 2) / (index 3) 행을 0.3s 간격 sequential.
              // narration "곱셈과 나눗셈이 덧셈과 뺄셈보다 먼저" 시점 강조.
              pulseRowsAtSecs={{ 2: 13.0, 3: 13.3 }}
            />
          </FadeIn>
          <PriorityCard delaySec={6.0} />
        </div>

        {/* 우 — 우선순위 예시 카드 2개 */}
        <div
          style={{
            flex: 0,
            display: "flex",
            flexDirection: "column",
            gap: 24,
            alignItems: "center",
          }}
        >
          <PriorityExampleCard
            delaySec={10.0}
            expr={
              <>
                <PyToken text="2" kind="number" />
                <PyToken text=" + " kind="op" />
                <PyToken text="3" kind="number" />
                <PyToken text=" * " kind="op" />
                <PyToken text="4" kind="number" />
              </>
            }
            result="14"
            // dead-air 비교 pulse: 17s ~ 17.6s
            // narration "헷갈리면 괄호를 쓰면 되고요" 의 비교 강조
            pulseResultAtSec={17.0}
          />
          <PriorityExampleCard
            delaySec={11.6}
            expr={
              <>
                <PyToken text="(" kind="op" />
                <PyToken text="2" kind="number" />
                <PyToken text=" + " kind="op" />
                <PyToken text="3" kind="number" />
                <PyToken text=")" kind="op" />
                <PyToken text=" * " kind="op" />
                <PyToken text="4" kind="number" />
              </>
            }
            result="20"
            pulseResultAtSec={17.0}
          />
        </div>
      </div>
    </PageBackground>
  );
};
