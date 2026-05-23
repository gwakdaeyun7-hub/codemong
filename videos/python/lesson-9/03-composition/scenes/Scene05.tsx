/**
 * Scene 5 — 매개변수: 값이 자리에 차례차례 (18s)
 *
 * - 0~4s: 상단 pill 라벨 "두 번째 — 매개변수" + 부제 "_부를 때 받을 값의 자리_".
 *         (R-025: Scene 03/07/10 과 동일 정형.)
 * - 4~9s: 좌측 코드 패널 — 두 줄 type-on.
 *         def add(a, b):
 *             return a + b
 *         `a`, `b` 매개변수 자리는 violet-300 dictKey 색으로.
 * - 9~13s: 코드 아래 한 줄 더 type-on: `add(3, 5)`.
 *          `3`, `5` violet-300 강조.
 * - 13~18s: 우측에 ParameterArrow SVG fade-in.
 *          호출 줄의 `3` → 정의 줄의 `a` 로 곡선 화살표 (delaySec 13.5, draw 0.7s)
 *          호출 줄의 `5` → 정의 줄의 `b` 로 곡선 화살표 (delaySec 14.2, draw 0.7s)
 *          R-012 준수: strokeWidth 7, 곡선 길이 ≥ 200.
 *          lower-third "괄호 안 자리 ← 값 차례차례 짝짓기".
 *
 * 학습 목표 3번 진입. 입력 사항 §4 권고 — 매개변수·인자 _용어 없이도_ 의미 박힘.
 */

import React from "react";
import {
  CodeLine,
  CodePanel,
  FadeIn,
  LowerThird,
  PageBackground,
  ParameterArrow,
  PyToken,
} from "../primitives";
import { colors, fonts, radii } from "../theme";

const REVEAL = {
  headerLabel: 0.2,
  codePanel: 4.0,
  line1: 4.5, // def add(a, b):
  line2: 6.0, //     return a + b
  line3: 9.5, // add(3, 5)
  arrowSvg: 13.0,
  arrow1: 13.5, // 3 → a
  arrow2: 14.2, // 5 → b
  lowerThird: 14.8,
} as const;

export const Scene05: React.FC = () => {
  return (
    <PageBackground>
      {/* 상단 pill 라벨 + 부제 — Scene 03/07/10 과 동일 정형 (R-025) */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
        }}
      >
        <FadeIn delaySec={REVEAL.headerLabel} translateY={6}>
          <div
            style={{
              padding: "8px 24px",
              borderRadius: radii.pill,
              background: colors.accentSoft,
              color: colors.accentInk,
              border: `1.5px solid ${colors.accent}`,
              fontFamily: fonts.sans,
              fontSize: 26,
              fontWeight: 700,
              letterSpacing: "-0.01em",
            }}
          >
            두 번째 — 매개변수
          </div>
        </FadeIn>
        <FadeIn delaySec={REVEAL.headerLabel + 0.4} translateY={6}>
          <div
            style={{
              fontFamily: fonts.sans,
              fontSize: 22,
              fontWeight: 500,
              color: colors.inkMuted,
              letterSpacing: "-0.01em",
            }}
          >
            <span style={{ color: colors.accentInk, fontWeight: 700 }}>부를 때 받을 값의 자리</span>
          </div>
        </FadeIn>
      </div>

      {/* 좌측 코드 + 우측 화살표 다이어그램 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          padding: "160px 80px 140px",
          gap: 60,
        }}
      >
        {/* 좌측 — 코드 패널 */}
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <FadeIn delaySec={REVEAL.codePanel} translateY={20}>
            <CodePanel fileName="add.py" width={680} height={260}>
              <CodeLine lineNumber={1} revealAtSec={REVEAL.line1}>
                <PyToken text="def" kind="keyword" />
                <PyToken text=" " />
                <PyToken text="add" kind="name" />
                <PyToken text="(" kind="op" />
                <PyToken text="a" kind="dictKey" />
                <PyToken text=", " kind="op" />
                <PyToken text="b" kind="dictKey" />
                <PyToken text=")" kind="op" />
                <PyToken text=":" kind="op" />
              </CodeLine>
              <CodeLine lineNumber={2} revealAtSec={REVEAL.line2}>
                <PyToken text="    " />
                <PyToken text="return" kind="keyword" />
                <PyToken text=" " />
                <PyToken text="a" kind="dictKey" />
                <PyToken text=" + " kind="op" />
                <PyToken text="b" kind="dictKey" />
              </CodeLine>
              <CodeLine lineNumber={3} revealAtSec={REVEAL.line3}>
                <PyToken text="add" kind="name" />
                <PyToken text="(" kind="op" />
                <PyToken text="3" kind="number" highlight />
                <PyToken text=", " kind="op" />
                <PyToken text="5" kind="number" highlight />
                <PyToken text=")" kind="op" />
              </CodeLine>
            </CodePanel>
          </FadeIn>
        </div>

        {/* 우측 — 두 화살표 다이어그램 */}
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FadeIn delaySec={REVEAL.arrowSvg} translateY={14}>
            <div
              style={{
                width: 480,
                background: colors.bgWhite,
                borderRadius: radii.card,
                border: `1px solid ${colors.border}`,
                boxShadow: "0 2px 12px -4px rgba(24, 24, 27, 0.06)",
                padding: "28px 32px",
                fontFamily: fonts.sans,
              }}
            >
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: colors.accentDeep,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  marginBottom: 18,
                }}
              >
                값이 자리로 →
              </div>

              {/* SVG 다이어그램:
                  상단 row: "add(3, 5)" — 호출 측 (값)
                  하단 row: "def add(a, b):" — 정의 측 (자리)
                  곡선 화살표: 3 → a, 5 → b */}
              <div style={{ position: "relative", width: 416, height: 200 }}>
                {/* 호출 측 박스 (상단) */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    display: "flex",
                    justifyContent: "center",
                    gap: 50,
                  }}
                >
                  <ValueBox value="3" pulseColor={colors.accent} />
                  <ValueBox value="5" pulseColor={colors.accent} />
                </div>

                {/* 정의 측 박스 (하단) */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    display: "flex",
                    justifyContent: "center",
                    gap: 50,
                  }}
                >
                  <SlotBox label="a" />
                  <SlotBox label="b" />
                </div>

                {/* 화살표 — SVG overlay */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    pointerEvents: "none",
                  }}
                >
                  <ParameterArrow
                    width={416}
                    height={200}
                    strokeWidth={7}
                    arrows={[
                      {
                        // "3" 박스 중심 (좌측) → "a" 박스 중심 (좌측)
                        // 좌측 박스: gap 50 / 2 = 25 만큼 왼쪽으로 + 박스 width 80 의 절반 = 40 → 416/2 - 25 - 40 = 143
                        // 즉 박스 중심 left ≈ 143, right box ≈ 273
                        startX: 143,
                        startY: 70,
                        endX: 143,
                        endY: 130,
                        controlX: 115,
                        controlY: 100,
                        delaySec: REVEAL.arrow1 - REVEAL.arrowSvg,
                        drawDurationSec: 0.7,
                      },
                      {
                        startX: 273,
                        startY: 70,
                        endX: 273,
                        endY: 130,
                        controlX: 301,
                        controlY: 100,
                        delaySec: REVEAL.arrow2 - REVEAL.arrowSvg,
                        drawDurationSec: 0.7,
                      },
                    ]}
                  />
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>

      <LowerThird
        text={
          <>
            괄호 안 <span style={{ color: colors.accentLight, fontWeight: 700 }}>자리</span> ←{" "}
            <span style={{ color: colors.accentLight, fontWeight: 700 }}>값</span> 차례차례 짝짓기
          </>
        }
        delaySec={REVEAL.lowerThird}
      />
    </PageBackground>
  );
};

/** 값 박스 (호출 측 — 3 / 5). 외곽 violet, 글자 violet-deep. */
const ValueBox: React.FC<{ value: string; pulseColor: string }> = ({ value, pulseColor }) => {
  return (
    <div
      style={{
        width: 80,
        height: 60,
        borderRadius: 12,
        background: colors.accentSoft,
        border: `2.5px solid ${pulseColor}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: fonts.mono,
        fontSize: 32,
        fontWeight: 800,
        color: colors.accentDeep,
        letterSpacing: "-0.01em",
        boxShadow: "0 2px 8px rgba(139, 92, 246, 0.15)",
      }}
    >
      {value}
    </div>
  );
};

/** 매개변수 자리 박스 (정의 측 — a / b). 점선 외곽 (자리 = 빈 슬롯 느낌). */
const SlotBox: React.FC<{ label: string }> = ({ label }) => {
  return (
    <div
      style={{
        width: 80,
        height: 60,
        borderRadius: 12,
        background: colors.bgWhite,
        border: `2.5px dashed ${colors.accent}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: fonts.mono,
        fontSize: 32,
        fontWeight: 800,
        color: colors.accentInk,
        letterSpacing: "-0.01em",
      }}
    >
      {label}
    </div>
  );
};
