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

      {/*
        Layout: VarBox 를 코드 패널 위쪽 가운데에 absolute 배치하고,
        CodePanel / FlowArrow / ConsolePanel 을 horizontal flex row 로 정렬.
        세 박스 모두 같은 세로 위치 + 가로 간격 동일.
      */}
      {/* 변수 박스 — 코드 패널 위쪽 가운데 */}
      <div
        style={{
          position: "absolute",
          top: 130,
          left: "50%",
          transform: "translateX(-50%)",
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
      </div>

      {/* 메인 row — CodePanel / FlowArrow / ConsolePanel 같은 세로 위치 */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 330,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 60,
        }}
      >
        {/* 좌측 — 코드 패널 */}
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

          {/* 1줄 우측 — True 라벨 (라벨 height ~36, line 1 center y ≈ 84) */}
          <div
            style={{
              position: "absolute",
              top: 68,
              right: -110,
            }}
          >
            <BranchLabel value="True" delaySec={REVEAL.trueLabel} />
          </div>
        </div>

        {/* 가운데 — 큰 흐름 화살표 (위에서 아래로 흐름이 진행됨을 시각화) */}
        <div
          style={{
            position: "relative",
            width: 100,
            height: 460,
            flexShrink: 0,
          }}
        >
          <FlowArrow
            startY={120}
            endY={300}
            x={40}
            delaySec={REVEAL.flowArrow}
            durationSec={0.8}
            color={colors.accent}
            strokeWidth={6}
          />
        </div>

        {/* 우측 — 콘솔 */}
        <FadeIn delaySec={0.6} translateY={20}>
          <ConsolePanel title="출력 결과" width={460} height={200}>
            <div style={{ height: 24 }} />
            <ConsoleLine revealAtSec={REVEAL.consoleOut}>
              <span style={{ fontSize: 38, fontWeight: 700 }}>합격</span>
            </ConsoleLine>
          </ConsolePanel>
        </FadeIn>
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
