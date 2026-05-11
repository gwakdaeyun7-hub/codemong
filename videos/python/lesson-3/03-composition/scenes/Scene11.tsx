/**
 * Scene 11 — 변수에 새 값 넣기 (오개념 4) (18s)
 *
 * - 화면 좌측 절반: 코드 패널 (앞 scene 코드는 opacity 0.4 톤 다운)
 *     새 코드 3줄이 type-on:
 *       1줄: age = 5
 *       2줄: age = 6
 *       3줄: print(age)
 *
 * - 화면 우측 절반: 박스 시각화
 *     1단계: `age` 박스에 `5` 가 type-on (1줄과 동기)
 *     2단계: 박스 안의 `5` 가 fade-out 되며 `6` 으로 swap (2줄과 동기)
 *     사라지는 5 옆에 작은 휴지통 아이콘이 잠깐 비치고 사라짐
 *     3단계: 박스 아래 작은 콘솔에 `6` 출력 (3줄과 동기)
 *
 * - 화면 하단 lower-third: "박스에 새 값이 들어가면 이전 값은 버려집니다"
 *
 * 오개념 4번 정면 처리. 박스 비유로 시각화 — 휴지통 아이콘으로 "버려진다" 강조.
 *
 * 타이밍 (scene local, narration 18초):
 *   0.5 ~ 1.5  : 코드 패널 + 박스 컨테이너 등장
 *   2.5        : 1줄 (age = 5) + 박스 안 "5" 등장
 *   6.0        : 2줄 (age = 6) + 박스 안 "5" → "6" swap (휴지통 잠깐)
 *   10.0       : 3줄 (print(age)) + 콘솔에 "6" 출력
 *   12+        : settle
 */

import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import {
  CodeLine,
  CodePanel,
  ConsoleLine,
  ConsolePanel,
  FadeIn,
  LowerThird,
  PageBackground,
  PyToken,
  TrashIcon,
  easeOutCubic,
} from "../primitives";
import { colors, fonts, radii, shadows } from "../theme";

// 단일 source of truth — 코드↔박스 동기화 시점
const STEP_AT = {
  setFive: 3.0, // age = 5
  setSix: 6.5, // age = 6
  printSix: 10.0, // print(age) + console "6"
} as const;

/**
 * 박스 안 값 swap 시각화.
 *  - STEP_AT.setFive 부터 "5" fade-in
 *  - STEP_AT.setSix 부터 "5" fade-out 동시에 "6" fade-in
 *  - "5" 가 사라지는 지점에 휴지통 아이콘이 1초간 비침
 */
const SwappingValue: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // "5" opacity: setFive 부터 fade-in, setSix 부터 fade-out
  const fiveIn = interpolate(
    frame,
    [STEP_AT.setFive * fps, (STEP_AT.setFive + 0.5) * fps],
    [0, 1],
    {
      easing: easeOutCubic,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
  const fiveOut = interpolate(
    frame,
    [STEP_AT.setSix * fps, (STEP_AT.setSix + 0.4) * fps],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const fiveTranslateX = interpolate(
    frame,
    [STEP_AT.setSix * fps, (STEP_AT.setSix + 0.6) * fps],
    [0, 60],
    {
      easing: easeOutCubic,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  // "6" opacity: setSix 부터 fade-in
  const sixIn = interpolate(
    frame,
    [(STEP_AT.setSix + 0.2) * fps, (STEP_AT.setSix + 0.7) * fps],
    [0, 1],
    {
      easing: easeOutCubic,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  return (
    <div
      style={{
        position: "relative",
        width: 200,
        height: 80,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* "5" */}
      <div
        style={{
          position: "absolute",
          opacity: fiveIn * fiveOut,
          transform: `translateX(${fiveTranslateX}px)`,
          fontFamily: "monospace",
          fontSize: 56,
          fontWeight: 700,
        }}
      >
        <PyToken text="5" kind="number" />
      </div>
      {/* "6" */}
      <div
        style={{
          position: "absolute",
          opacity: sixIn,
          fontFamily: "monospace",
          fontSize: 56,
          fontWeight: 700,
        }}
      >
        <PyToken text="6" kind="number" />
      </div>
    </div>
  );
};

export const Scene11: React.FC = () => {
  return (
    <PageBackground>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          padding: "100px 80px",
          gap: 60,
        }}
      >
        {/* 좌측 — 코드 패널 (3줄) */}
        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <FadeIn delaySec={0.4} translateY={20}>
            <CodePanel fileName="intro.py" width={680} height={420}>
              <CodeLine
                lineNumber={1}
                revealAtSec={STEP_AT.setFive}
                highlighted
                highlightDurationSec={2.5}
              >
                <PyToken text="age" kind="name" />
                <PyToken text=" " />
                <PyToken text="=" kind="op" />
                <PyToken text=" " />
                <PyToken text="5" kind="number" />
              </CodeLine>
              <CodeLine
                lineNumber={2}
                revealAtSec={STEP_AT.setSix}
                highlighted
                highlightDurationSec={2.5}
              >
                <PyToken text="age" kind="name" />
                <PyToken text=" " />
                <PyToken text="=" kind="op" />
                <PyToken text=" " />
                <PyToken text="6" kind="number" />
              </CodeLine>
              <CodeLine
                lineNumber={3}
                revealAtSec={STEP_AT.printSix}
                highlighted
                highlightDurationSec={2.5}
              >
                <PyToken text="print" kind="func" />
                <PyToken text="(" kind="op" />
                <PyToken text="age" kind="name" />
                <PyToken text=")" kind="op" />
              </CodeLine>
            </CodePanel>
          </FadeIn>
        </div>

        {/* 우측 — 박스 + 휴지통 + 콘솔 */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 32,
          }}
        >
          <FadeIn delaySec={0.6} translateY={6}>
            <div
              style={{
                fontFamily: fonts.sans,
                fontSize: 22,
                fontWeight: 700,
                color: colors.accentDeep,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              age 박스 — 같은 이름, 새 값
            </div>
          </FadeIn>

          {/* 박스 + 휴지통 (좌우 배치) */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 24,
              position: "relative",
            }}
          >
            {/*
              VarBox 를 직접 쓰지 않고 박스 본체만 inline 으로 — 안의 값이
              swap 되는 시각화가 핵심이라, 박스 자체는 그대로 두고 children 만
              SwappingValue 로 동적 렌더.

              라벨 (이름표) 는 코드 1줄과 동시에 등장 (계속 유지).
            */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
              }}
            >
              {/* 라벨 — STEP_AT.setFive 직전부터 떨어지듯 등장 */}
              <FadeIn
                delaySec={STEP_AT.setFive - 0.5}
                durationSec={0.5}
                translateY={-14}
              >
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "6px 16px",
                    borderRadius: radii.pill,
                    background: colors.accentSoft,
                    color: colors.accentInk,
                    fontFamily: "monospace",
                    fontSize: 24,
                    fontWeight: 700,
                    border: `1px solid ${colors.accent}`,
                  }}
                >
                  age
                </div>
              </FadeIn>

              {/* 박스 본체 */}
              <FadeIn delaySec={STEP_AT.setFive - 0.3} translateY={10}>
                <div
                  style={{
                    width: 280,
                    height: 140,
                    borderRadius: 18,
                    background: colors.bgWhite,
                    border: `3px solid ${colors.accent}`,
                    boxShadow: shadows.card,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <SwappingValue />
                </div>
              </FadeIn>
            </div>

            {/* 휴지통 — STEP_AT.setSix 시점에 잠깐 비침 */}
            <div
              style={{
                position: "absolute",
                left: 280 + 12, // 박스 width 280 + gap
                top: "50%",
                transform: "translateY(-50%)",
              }}
            >
              <TrashIcon
                size={64}
                delaySec={STEP_AT.setSix + 0.2}
                lifespanSec={1.4}
              />
            </div>
          </div>

          {/* 작은 콘솔 — STEP_AT.printSix + 1.0sec 부터 "6" */}
          <FadeIn delaySec={STEP_AT.printSix - 0.3} translateY={20}>
            <ConsolePanel title="출력 결과" width={320} height={120}>
              <ConsoleLine revealAtSec={STEP_AT.printSix + 1.0}>6</ConsoleLine>
            </ConsolePanel>
          </FadeIn>
        </div>
      </div>

      <LowerThird
        text="박스에 새 값이 들어가면 이전 값은 버려집니다"
        delaySec={STEP_AT.setSix + 1.5}
      />
    </PageBackground>
  );
};
