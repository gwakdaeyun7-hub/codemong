/**
 * Scene 9 — 위에서부터 차례로 (18s)
 *
 * - 화면 좌측 절반: scene-08 의 코드 6줄 유지
 * - 코드 위쪽에 변수 박스: `score = 75`
 * - 코드 우측에 흐름 화살표 (위→아래) — FlowArrow
 * - 1줄째 조건 옆에 `True` 라벨 fade-in
 * - 2줄째 print("합격") 줄에 violet 하이라이트 박스
 * - 3~6줄은 opacity 0.4 로 톤다운 (건너뜀)
 * - 화면 우측 절반: 콘솔 패널 "합격" 출력
 * - 화면 하단 lower-third: "위에서부터 검사 · 처음 True에서 멈춤"
 *
 * 학습 목표 3번 핵심. 오개념 4번 (`if-if` ≠ `if-elif`) 자연스럽게 차단.
 *
 * 타이밍 (scene local, 18s):
 *   0.0 ~ 1.0    : 코드 + 변수 박스 즉시 표시 (회상)
 *   2.0          : 흐름 화살표 시작 (위→아래 grow)
 *   3.5          : True 라벨 (1줄 옆)
 *   4.5          : 2줄 (print "합격") 하이라이트 박스
 *   5.5          : 3~6줄 톤다운
 *   7.0          : 콘솔 결과 등장
 *   10+          : settle
 */

import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import {
  BranchLabel,
  CodeLine,
  CodePanel,
  ConsoleLine,
  ConsolePanel,
  FadeIn,
  FlowArrow,
  LowerThird,
  PageBackground,
  PyToken,
  VarBox,
} from "../primitives";
import { colors, fonts } from "../theme";

const REVEAL = {
  flowArrow: 2.0,
  trueLabel: 3.5,
  highlightLine2: 4.5,
  dimBelow: 5.5,
  consoleOut: 7.0,
} as const;

/**
 * 3~6줄 톤다운 컨테이너 — REVEAL.dimBelow 부터 opacity 1→0.4.
 */
const DimBelow: React.FC<{ children: React.ReactNode; sinceSec: number }> = ({
  children,
  sinceSec,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = sinceSec * fps;
  const opacity = interpolate(frame, [start, start + 0.5 * fps], [1, 0.4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return <div style={{ opacity }}>{children}</div>;
};

/**
 * 2줄 violet 하이라이트 박스 — REVEAL.highlightLine2 부터 fade-in.
 */
const HighlightLine2Box: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = REVEAL.highlightLine2 * fps;
  const opacity = interpolate(frame, [start, start + 0.4 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        left: 38,
        top: 152, // 2줄 y (헤더 40 + padding 20 + 1줄 ~48 + 약간)
        right: 18,
        height: 52,
        border: `2.5px solid ${colors.accent}`,
        borderRadius: 8,
        background: "rgba(139, 92, 246, 0.12)",
        opacity,
        pointerEvents: "none",
      }}
    />
  );
};

export const Scene09: React.FC = () => {
  return (
    <PageBackground>
      {/* scene 라벨 */}
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
            위에서부터 차례로
          </div>
        </FadeIn>
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          padding: "120px 60px 120px",
          gap: 0,
        }}
      >
        {/* 좌측 — 변수 박스 + 코드 + 흐름 화살표 */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 28,
          }}
        >
          <VarBox
            label="score"
            labelDelaySec={0.3}
            boxDelaySec={0.6}
            width={200}
            height={110}
            valueFontSize={42}
          >
            <PyToken text="75" kind="number" />
          </VarBox>

          <div style={{ position: "relative" }}>
            <FadeIn delaySec={0.8} translateY={14}>
              <CodePanel fileName="grade.py" width={680} height={460}>
                <CodeLine lineNumber={1} revealAtSec={1.0}>
                  <PyToken text="if" kind="keyword" />
                  <PyToken text=" " />
                  <PyToken text="score" kind="name" />
                  <PyToken text=" " />
                  <PyToken text=">=" kind="op" />
                  <PyToken text=" " />
                  <PyToken text="60" kind="number" />
                  <PyToken text=":" kind="op" />
                </CodeLine>
                <CodeLine lineNumber={2} revealAtSec={1.0}>
                  <PyToken text="    " />
                  <PyToken text="print" kind="func" />
                  <PyToken text="(" kind="op" />
                  <PyToken text={'"합격"'} kind="string" />
                  <PyToken text=")" kind="op" />
                </CodeLine>
                <DimBelow sinceSec={REVEAL.dimBelow}>
                  <CodeLine lineNumber={3} revealAtSec={1.0}>
                    <PyToken text="elif" kind="keyword" />
                    <PyToken text=" " />
                    <PyToken text="score" kind="name" />
                    <PyToken text=" " />
                    <PyToken text=">=" kind="op" />
                    <PyToken text=" " />
                    <PyToken text="40" kind="number" />
                    <PyToken text=":" kind="op" />
                  </CodeLine>
                  <CodeLine lineNumber={4} revealAtSec={1.0}>
                    <PyToken text="    " />
                    <PyToken text="print" kind="func" />
                    <PyToken text="(" kind="op" />
                    <PyToken text={'"재시험"'} kind="string" />
                    <PyToken text=")" kind="op" />
                  </CodeLine>
                  <CodeLine lineNumber={5} revealAtSec={1.0}>
                    <PyToken text="else" kind="keyword" />
                    <PyToken text=":" kind="op" />
                  </CodeLine>
                  <CodeLine lineNumber={6} revealAtSec={1.0}>
                    <PyToken text="    " />
                    <PyToken text="print" kind="func" />
                    <PyToken text="(" kind="op" />
                    <PyToken text={'"불합격"'} kind="string" />
                    <PyToken text=")" kind="op" />
                  </CodeLine>
                </DimBelow>
              </CodePanel>

              {/* 2줄 violet 하이라이트 박스 */}
              <HighlightLine2Box />
            </FadeIn>

            {/*
              흐름 화살표 — 패널 우측, 1줄~2줄까지만 진행 (조건이 True 라서
              거기서 멈춘다는 시각 신호).
            */}
            <FlowArrow
              startY={92}
              endY={200}
              x={700}
              delaySec={REVEAL.flowArrow}
              durationSec={0.8}
              color={colors.accent}
              strokeWidth={3}
            />

            {/* 1줄 우측 — True 라벨 */}
            <div
              style={{
                position: "absolute",
                top: 76,
                right: -150,
              }}
            >
              <BranchLabel value="True" delaySec={REVEAL.trueLabel} />
            </div>
          </div>
        </div>

        {/* 우측 — 콘솔 */}
        <div
          style={{
            flex: "0 0 480",
            display: "flex",
            justifyContent: "flex-start",
            paddingTop: 110,
          }}
        >
          <FadeIn delaySec={0.6} translateY={20}>
            <ConsolePanel title="출력 결과" width={460} height={200}>
              <div style={{ height: 24 }} />
              <ConsoleLine revealAtSec={REVEAL.consoleOut}>
                <span style={{ fontSize: 38, fontWeight: 700 }}>합격</span>
              </ConsoleLine>
            </ConsolePanel>
          </FadeIn>
        </div>
      </div>

      <LowerThird
        text={
          <>
            위에서부터 검사 · 처음{" "}
            <span style={{ fontFamily: fonts.mono, color: colors.accentLight }}>True</span>
            에서 멈춤
          </>
        }
        delaySec={9.0}
      />
    </PageBackground>
  );
};
