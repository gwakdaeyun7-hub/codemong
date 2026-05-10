/**
 * Scene 11 — 순서도로 그려 보기 (22s)
 *
 * - 화면 좌측 절반: 도형 4기호 범례 카드
 *     둥근 사각형 = 시작/끝
 *     사각형     = 처리
 *     마름모     = 판단
 *     평행사변형 = 입출력
 *   각 도형 violet-500 외곽선
 * - 화면 우측 절반: 순서도 캔버스 (위에서 아래로 도형이 쌓이며 그려짐)
 *     1) 둥근 사각형: "시작"
 *     2) 평행사변형: "음료 가격 확인"
 *     3) 마름모: "5천 원 초과?"
 *     4-1) 마름모 우측 → 사각형: "카드로 결제"
 *     4-2) 마름모 아래 → 사각형: "현금으로 결제"
 *     5) 둘 다 아래에서 합쳐져 둥근 사각형: "끝"
 *   마름모에서 나가는 두 화살표에 라벨 "예" / "아니오"
 *
 * 학습 목표 3 (4기호 보고 구분) + 학습 목표 5 (순서도 진입).
 */

import React from "react";
import {
  CenteredStage,
  FadeIn,
  FlowchartArrow,
  FlowchartShape,
  PageBackground,
} from "../primitives";
import { colors, fonts, radii, shadows } from "../theme";

// 우측 캔버스 좌표 — 도형 위치 (캔버스는 width 880 height 720 기준)
const CANVAS_W = 880;
const CANVAS_H = 720;

// 각 도형의 중심 좌표
const start = { x: 360, y: 50 };
const input = { x: 360, y: 170 };
const decision = { x: 360, y: 310 };
const cardProc = { x: 660, y: 310 };
const cashProc = { x: 360, y: 480 };
const end = { x: 510, y: 620 };

const SHAPE_W = 200;
const SHAPE_H = 70;
const DECISION_W = 220;
const DECISION_H = 110;

const Legend: React.FC = () => {
  const items = [
    { variant: "terminal" as const, label: "시작/끝", desc: "둥근 사각형" },
    { variant: "process" as const, label: "처리", desc: "사각형" },
    { variant: "decision" as const, label: "판단", desc: "마름모" },
    { variant: "io" as const, label: "입출력", desc: "평행사변형" },
  ];
  return (
    <div
      style={{
        width: 480,
        padding: "44px 40px",
        borderRadius: radii.card,
        background: colors.bgWhite,
        border: `1px solid ${colors.border}`,
        boxShadow: shadows.card,
        display: "flex",
        flexDirection: "column",
        gap: 22,
      }}
    >
      <div
        style={{
          fontFamily: fonts.sans,
          fontSize: 22,
          fontWeight: 700,
          color: colors.accentDeep,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          marginBottom: 4,
        }}
      >
        순서도 도형 4가지
      </div>
      {items.map((it, i) => (
        <FadeIn key={it.variant} delaySec={0.3 + i * 0.3} translateY={6}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 24,
            }}
          >
            <FlowchartShape
              variant={it.variant}
              label=""
              width={120}
              height={56}
            />
            <div>
              <div
                style={{
                  fontFamily: fonts.sans,
                  fontSize: 28,
                  fontWeight: 700,
                  color: colors.ink,
                  letterSpacing: "-0.01em",
                }}
              >
                {it.label}
              </div>
              <div
                style={{
                  fontFamily: fonts.sans,
                  fontSize: 18,
                  fontWeight: 500,
                  color: colors.inkMuted,
                  letterSpacing: "-0.01em",
                  marginTop: 2,
                }}
              >
                {it.desc}
              </div>
            </div>
          </div>
        </FadeIn>
      ))}
    </div>
  );
};

const Canvas: React.FC = () => {
  return (
    <div
      style={{
        position: "relative",
        width: CANVAS_W,
        height: CANVAS_H,
        background: colors.bgWhite,
        borderRadius: radii.card,
        border: `1px solid ${colors.border}`,
        boxShadow: shadows.card,
        overflow: "hidden",
      }}
    >
      {/* 캔버스 라벨 */}
      <div
        style={{
          position: "absolute",
          top: 16,
          left: 24,
          fontFamily: fonts.sans,
          fontSize: 18,
          fontWeight: 700,
          color: colors.accentDeep,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
        }}
      >
        편의점 결제 순서도
      </div>

      {/* 도형들 — 각 도형은 절대 좌표, 중심 정렬 */}
      <FadeIn delaySec={1.2} translateY={6}>
        <Positioned center={start}>
          <FlowchartShape
            variant="terminal"
            label="시작"
            width={SHAPE_W}
            height={SHAPE_H}
          />
        </Positioned>
      </FadeIn>

      <FadeIn delaySec={2.0} translateY={6}>
        <Positioned center={input}>
          <FlowchartShape
            variant="io"
            label="음료 가격 확인"
            width={SHAPE_W + 20}
            height={SHAPE_H + 4}
          />
        </Positioned>
      </FadeIn>

      <FadeIn delaySec={2.8} translateY={6}>
        <Positioned center={decision}>
          <FlowchartShape
            variant="decision"
            label="5천 원 초과?"
            width={DECISION_W}
            height={DECISION_H}
            fontSize={20}
          />
        </Positioned>
      </FadeIn>

      <FadeIn delaySec={3.6} translateY={6}>
        <Positioned center={cardProc}>
          <FlowchartShape
            variant="process"
            label="카드로 결제"
            width={SHAPE_W}
            height={SHAPE_H}
          />
        </Positioned>
      </FadeIn>

      <FadeIn delaySec={4.4} translateY={6}>
        <Positioned center={cashProc}>
          <FlowchartShape
            variant="process"
            label="현금으로 결제"
            width={SHAPE_W}
            height={SHAPE_H}
          />
        </Positioned>
      </FadeIn>

      <FadeIn delaySec={5.4} translateY={6}>
        <Positioned center={end}>
          <FlowchartShape
            variant="terminal"
            label="끝"
            width={SHAPE_W - 40}
            height={SHAPE_H}
          />
        </Positioned>
      </FadeIn>

      {/* 화살표들 — 각 화살표를 별도 svg 로 절대 위치 */}
      <ArrowFrom delaySec={1.6} from={addY(start, SHAPE_H / 2)} to={addY(input, -SHAPE_H / 2 - 2)} />
      <ArrowFrom delaySec={2.4} from={addY(input, SHAPE_H / 2 + 2)} to={addY(decision, -DECISION_H / 2 - 2)} />
      {/* decision → cardProc (오른쪽, 라벨 "예") */}
      <ArrowFrom
        delaySec={3.2}
        from={{ x: decision.x + DECISION_W / 2, y: decision.y }}
        to={{ x: cardProc.x - SHAPE_W / 2 - 2, y: cardProc.y }}
        label="예"
        labelPos={{ x: (decision.x + DECISION_W / 2 + cardProc.x - SHAPE_W / 2) / 2, y: cardProc.y - 18 }}
        color={colors.accent}
      />
      {/* decision → cashProc (아래, 라벨 "아니오") */}
      <ArrowFrom
        delaySec={4.0}
        from={{ x: decision.x, y: decision.y + DECISION_H / 2 }}
        to={{ x: cashProc.x, y: cashProc.y - SHAPE_H / 2 - 2 }}
        label="아니오"
        labelPos={{ x: decision.x + 50, y: (decision.y + DECISION_H / 2 + cashProc.y - SHAPE_H / 2) / 2 }}
        color={colors.accent}
      />
      {/* cardProc → end (꺾임: cardProc 아래로 → 좌측으로)
          end 도형 외곽선 바깥에서 화살표 머리가 끝나도록 +8 마진. */}
      <ArrowFrom
        delaySec={5.0}
        from={{ x: cardProc.x, y: cardProc.y + SHAPE_H / 2 }}
        bend={{ x: cardProc.x, y: end.y }}
        to={{ x: end.x + (SHAPE_W - 40) / 2 + 8, y: end.y }}
      />
      {/* cashProc → end (꺾임: cashProc 아래로 → 우측으로) — 동일하게 -8 마진. */}
      <ArrowFrom
        delaySec={5.6}
        from={{ x: cashProc.x, y: cashProc.y + SHAPE_H / 2 }}
        bend={{ x: cashProc.x, y: end.y }}
        to={{ x: end.x - (SHAPE_W - 40) / 2 - 8, y: end.y }}
      />
    </div>
  );
};

/** 자식을 center 좌표에 중앙 정렬해 절대 배치. */
const Positioned: React.FC<{
  center: { x: number; y: number };
  children: React.ReactNode;
}> = ({ center, children }) => {
  return (
    <div
      style={{
        position: "absolute",
        left: center.x,
        top: center.y,
        transform: "translate(-50%, -50%)",
      }}
    >
      {children}
    </div>
  );
};

const addY = (
  p: { x: number; y: number },
  dy: number,
): { x: number; y: number } => ({ x: p.x, y: p.y + dy });

/** 화살표 fade-in 래퍼 — 시간 경과에 따라 path stroke 가 점진적으로 그려지는 효과. */
const ArrowFrom: React.FC<{
  delaySec: number;
  from: { x: number; y: number };
  to: { x: number; y: number };
  bend?: { x: number; y: number };
  label?: string;
  labelPos?: { x: number; y: number };
  color?: string;
}> = ({ delaySec, from, to, bend, label, labelPos, color }) => {
  return (
    <FadeIn delaySec={delaySec} durationSec={0.4} translateY={0}>
      <FlowchartArrow
        from={from}
        to={to}
        bend={bend}
        label={label}
        labelPos={labelPos}
        color={color}
      />
    </FadeIn>
  );
};

export const Scene11: React.FC = () => {
  return (
    <PageBackground>
      <CenteredStage paddingY={60}>
        <FadeIn delaySec={0.1} translateY={6}>
          <div
            style={{
              fontFamily: fonts.sans,
              fontSize: 30,
              fontWeight: 600,
              color: colors.accentDeep,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              marginBottom: 20,
            }}
          >
            순서도로 그려 보기
          </div>
        </FadeIn>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 56,
          }}
        >
          <Legend />
          <Canvas />
        </div>
      </CenteredStage>
    </PageBackground>
  );
};
