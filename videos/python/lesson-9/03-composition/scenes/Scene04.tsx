/**
 * Scene 4 — 정의만 vs 호출까지 (오개념 2 정면 대응, 14s)
 *
 * - 0~5s: scene-03 의 def greet(name): / print("안녕,", name) 두 줄이 좌측 유지.
 *         우측 콘솔 패널 fade-in — _텅 빈_ 상태. 옆 라벨 "화면 출력 없음".
 *         def 블록 아래 StateBoxSwap (잠자는 상태, 회색 점선) fade-in.
 * - 5~10s: 코드 패널 아래에 호출 한 줄 type-on: `greet("철수")`.
 *          호출 줄 violet 강조 + 동시에 StateBoxSwap 이 노란색 ("실행 중") 으로 swap.
 *          (R-002 준수: fade-out 0.2s buffer 후 fade-in)
 * - 10~14s: 우측 콘솔에 결과 type-on: `안녕, 철수`.
 *          lower-third "적어두기 ≠ 부르기. 부른 그 순간 실행".
 *
 * 오개념 2번 (정의만으로 실행된다고 오해) 정면 처치.
 * 학습 목표 2번 강화.
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
  StateBoxSwap,
} from "../primitives";
import { colors, fonts, radii, shadows } from "../theme";

const REVEAL = {
  codePanel: 0.3,
  line1: 0.5, // def greet(name): (이전 scene 에서 이어짐 — 빠르게)
  line2: 1.4, //     print("안녕,", name)
  consolePanelEmpty: 2.5,
  emptyLabel: 3.0,
  stateBox: 2.8, // 잠자는 박스 등장
  line3: 5.5, // greet("철수")
  stateSwap: 6.5, // 잠자는 → 실행 중 (R-002 swap timing buffer)
  flowInput: 7.2, // 실행 과정: "철수" 입력 박스 등장
  flowFunc: 8.3, // → greet 함수 박스
  flowResult: 9.6, // → "안녕, 철수" 결과 박스 (콘솔 결과보다 살짝 먼저 = 과정 → 출력 확정)
  consoleResult: 10.5,
  lowerThird: 11.0,
} as const;

export const Scene04: React.FC = () => {
  return (
    <PageBackground>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          padding: "120px 80px 200px",
          gap: 60,
        }}
      >
        {/* 좌측 — 코드 패널 + StateBoxSwap */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 32,
          }}
        >
          <FadeIn delaySec={REVEAL.codePanel} translateY={20}>
            <CodePanel fileName="greet.py" width={680} height={260}>
              <CodeLine lineNumber={1} revealAtSec={REVEAL.line1}>
                <PyToken text="def" kind="keyword" />
                <PyToken text=" " />
                <PyToken text="greet" kind="name" />
                <PyToken text="(" kind="op" />
                <PyToken text="name" kind="dictKey" />
                <PyToken text=")" kind="op" />
                <PyToken text=":" kind="op" />
              </CodeLine>
              <CodeLine lineNumber={2} revealAtSec={REVEAL.line2}>
                <PyToken text="    " />
                <PyToken text="print" kind="func" />
                <PyToken text="(" kind="op" />
                <PyToken text={'"안녕,"'} kind="string" />
                <PyToken text=", " kind="op" />
                <PyToken text="name" kind="dictKey" />
                <PyToken text=")" kind="op" />
              </CodeLine>
              <CodeLine lineNumber={3} revealAtSec={REVEAL.line3} highlighted>
                <PyToken text="greet" kind="name" highlight />
                <PyToken text="(" kind="op" />
                <PyToken text={'"철수"'} kind="string" highlight />
                <PyToken text=")" kind="op" />
              </CodeLine>
            </CodePanel>
          </FadeIn>

          {/* StateBoxSwap — 잠자는 → 실행 중 */}
          <StateBoxSwap
            delaySec={REVEAL.stateBox}
            swapAtSec={REVEAL.stateSwap}
            width={320}
            height={140}
          />

          {/* 실행 과정 흐름 — "철수"(넣은 값) → greet(함수) → "안녕, 철수"(나온 결과) */}
          <ExecutionFlow
            inputAt={REVEAL.flowInput}
            funcAt={REVEAL.flowFunc}
            resultAt={REVEAL.flowResult}
          />
        </div>

        {/* 우측 — 콘솔 + 라벨 */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 22,
            paddingTop: 30,
          }}
        >
          <div style={{ position: "relative" }}>
            <FadeIn delaySec={REVEAL.consolePanelEmpty} translateY={14}>
              <ConsolePanel title="출력 결과" width={520} height={200}>
                <ConsoleLine revealAtSec={REVEAL.consoleResult}>
                  <span
                    style={{
                      fontSize: 32,
                      fontWeight: 800,
                      color: colors.darkAccent,
                    }}
                  >
                    안녕, 철수
                  </span>
                </ConsoleLine>
              </ConsolePanel>
            </FadeIn>
          </div>

          {/* "화면 출력 없음" 라벨 — 호출 등장 전까지 (호출 전 fade-in, 호출 후 fade-out) */}
          <EmptyLabel
            inAt={REVEAL.emptyLabel}
            outAt={REVEAL.consoleResult - 0.3}
          />
        </div>
      </div>

      <LowerThird
        text={
          <>
            <span style={{ color: colors.accentLight, fontWeight: 700 }}>적어두기</span> ≠{" "}
            <span style={{ color: colors.accentLight, fontWeight: 700 }}>부르기</span>. 부른 그 순간
            실행
          </>
        }
        delaySec={REVEAL.lowerThird}
      />
    </PageBackground>
  );
};

/**
 * 실행 과정 흐름 — StateBoxSwap("실행 중") 아래.
 * "철수"(넣은 값) → greet(함수) → "안녕, 철수"(나온 결과) 를 가로 흐름으로 시각화.
 * 부른 값이 함수에 _들어가서_ 결과가 _나오는_ 과정을 직접 보여줌.
 */
const ExecutionFlow: React.FC<{
  inputAt: number;
  funcAt: number;
  resultAt: number;
}> = ({ inputAt, funcAt, resultAt }) => {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 12 }}>
      <FadeIn delaySec={inputAt} translateY={8}>
        <FlowBox label="넣은 값" value={'"철수"'} tone="input" />
      </FadeIn>
      <FlowArrow delaySec={funcAt - 0.3} />
      <FadeIn delaySec={funcAt} translateY={8}>
        <FlowBox label="함수" value="greet" tone="func" />
      </FadeIn>
      <FlowArrow delaySec={resultAt - 0.3} />
      <FadeIn delaySec={resultAt} translateY={8}>
        <FlowBox label="나온 결과" value="안녕, 철수" tone="output" />
      </FadeIn>
    </div>
  );
};

const FlowBox: React.FC<{
  label: string;
  value: string;
  tone: "input" | "func" | "output";
}> = ({ label, value, tone }) => {
  const palette =
    tone === "input"
      ? { bg: colors.accentSoft, border: colors.accent, valueColor: colors.accentInk, mono: true }
      : tone === "func"
        ? { bg: colors.darkBg, border: colors.darkBg2, valueColor: colors.darkAccent, mono: true }
        : { bg: colors.bgWhite, border: colors.accentDeep, valueColor: colors.accentDeep, mono: false };
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <span
        style={{
          fontFamily: fonts.sans,
          fontSize: 15,
          fontWeight: 700,
          color: colors.inkMuted,
          letterSpacing: "-0.01em",
        }}
      >
        {label}
      </span>
      <div
        style={{
          padding: "12px 22px",
          borderRadius: 12,
          background: palette.bg,
          border: `2.5px solid ${palette.border}`,
          boxShadow: shadows.cardSoft,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontFamily: palette.mono ? fonts.mono : fonts.sans,
            fontSize: 26,
            fontWeight: 800,
            color: palette.valueColor,
            letterSpacing: "-0.01em",
            whiteSpace: "nowrap",
          }}
        >
          {value}
        </span>
      </div>
    </div>
  );
};

/** 흐름 화살표 — 박스 하단 근처에 정렬되도록 paddingBottom 보정. */
const FlowArrow: React.FC<{ delaySec: number }> = ({ delaySec }) => {
  return (
    <FadeIn delaySec={delaySec} durationSec={0.4} translateY={0} style={{ paddingBottom: 10 }}>
      <span
        style={{
          fontFamily: fonts.sans,
          fontSize: 34,
          fontWeight: 800,
          color: colors.accent,
          lineHeight: 1,
        }}
      >
        →
      </span>
    </FadeIn>
  );
};

/** "화면 출력 없음" 라벨 — inAt 에 등장, outAt 에 사라짐 (R-002 자연 swap). */
const EmptyLabel: React.FC<{ inAt: number; outAt: number }> = ({ inAt, outAt }) => {
  return (
    <FadeIn delaySec={inAt} translateY={6}>
      <FadeOutWrap outAt={outAt}>
        <div
          style={{
            padding: "8px 18px",
            borderRadius: radii.pill,
            background: colors.bgWhite,
            border: `1.5px solid ${colors.inkSubtle}`,
            color: colors.inkSoft,
            fontFamily: fonts.sans,
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: "-0.01em",
            whiteSpace: "nowrap",
          }}
        >
          화면 출력 없음
        </div>
      </FadeOutWrap>
    </FadeIn>
  );
};

const FadeOutWrap: React.FC<{ outAt: number; children: React.ReactNode }> = ({ outAt, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = interpolate(frame, [outAt * fps, (outAt + 0.4) * fps], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return <div style={{ opacity }}>{children}</div>;
};
