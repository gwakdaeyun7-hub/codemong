/**
 * Scene 10 — Active recall: score=45 어느 줄? (16s)
 *
 * - 화면 좌측 절반: scene-08 의 코드 6줄 유지
 * - 코드 위쪽에 변수 박스: `score = 45`
 * - 1.8초 정적 동안 코드 우측에 큰 물음표
 * - 정적 후:
 *     1줄째 조건 옆에 `False` 라벨 (회색)
 *     3줄째 조건 옆에 `True` 라벨 (violet)
 *     4줄째 `print("재시험")` 줄에 violet 하이라이트 박스
 *     5~6줄은 opacity 0.4 로 톤다운
 * - 화면 우측 절반: 콘솔 패널 "재시험" 출력
 *
 * Active recall 비트 — scene-06 보다 한 단계 깊은 회상.
 *
 * 타이밍 (scene local, 16s):
 *   0.0 ~ 1.0    : 코드 + 변수 박스 표시
 *   3.0 ~ 4.8    : 정적 — 물음표
 *   5.5          : 1줄 False 라벨
 *   6.2          : 3줄 True 라벨
 *   7.0          : 4줄 하이라이트 박스
 *   7.5          : 5~6줄 톤다운
 *   8.5          : 콘솔 "재시험"
 *   11+          : settle
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
  PageBackground,
  PyToken,
  QuestionMark,
  VarBox,
} from "../primitives";
import { colors, fonts } from "../theme";

const REVEAL = {
  panel: 0.4,
  questionMark: 3.0,
  falseLabel: 5.5,
  trueLabel: 6.2,
  highlightLine4: 7.0,
  dimBelow: 7.5,
  consoleOut: 8.5,
} as const;

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
 * 4줄 (재시험) violet 하이라이트 박스.
 * 6줄 코드 패널에서 4줄 위치 = 헤더 40 + padding 20 + line-height 48*3 = 약 204px.
 */
const HighlightLine4Box: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = REVEAL.highlightLine4 * fps;
  const opacity = interpolate(frame, [start, start + 0.4 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        left: 38,
        top: 248,
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
              fontFamily: fonts.sans,
              fontSize: 28,
              fontWeight: 600,
              color: colors.accentDeep,
              letterSpacing: "0.04em",
            }}
          >
            한 번 더 — 점수가 45라면?
          </div>
        </FadeIn>
      </div>

      {/*
        Layout: VarBox 를 코드 패널 위쪽 가운데에 absolute 배치하고,
        CodePanel / QuestionMark / ConsolePanel 을 horizontal flex row 로 정렬.
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
          <PyToken text="45" kind="number" />
        </VarBox>
      </div>

      {/* 메인 row — CodePanel / QuestionMark / ConsolePanel 같은 세로 위치 */}
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
          <FadeIn delaySec={REVEAL.panel} translateY={14}>
            <CodePanel fileName="grade.py" width={680} height={460}>
              <CodeLine lineNumber={1} revealAtSec={0.8}>
                <PyToken text="if" kind="keyword" />
                <PyToken text=" " />
                <PyToken text="score" kind="name" />
                <PyToken text=" " />
                <PyToken text=">=" kind="op" />
                <PyToken text=" " />
                <PyToken text="60" kind="number" />
                <PyToken text=":" kind="op" />
              </CodeLine>
              <CodeLine lineNumber={2} revealAtSec={0.8}>
                <PyToken text="    " />
                <PyToken text="print" kind="func" />
                <PyToken text="(" kind="op" />
                <PyToken text={'"합격"'} kind="string" />
                <PyToken text=")" kind="op" />
              </CodeLine>
              <CodeLine lineNumber={3} revealAtSec={0.8}>
                <PyToken text="elif" kind="keyword" />
                <PyToken text=" " />
                <PyToken text="score" kind="name" />
                <PyToken text=" " />
                <PyToken text=">=" kind="op" />
                <PyToken text=" " />
                <PyToken text="40" kind="number" />
                <PyToken text=":" kind="op" />
              </CodeLine>
              <CodeLine lineNumber={4} revealAtSec={0.8}>
                <PyToken text="    " />
                <PyToken text="print" kind="func" />
                <PyToken text="(" kind="op" />
                <PyToken text={'"재시험"'} kind="string" />
                <PyToken text=")" kind="op" />
              </CodeLine>
              <DimBelow sinceSec={REVEAL.dimBelow}>
                <CodeLine lineNumber={5} revealAtSec={0.8}>
                  <PyToken text="else" kind="keyword" />
                  <PyToken text=":" kind="op" />
                </CodeLine>
                <CodeLine lineNumber={6} revealAtSec={0.8}>
                  <PyToken text="    " />
                  <PyToken text="print" kind="func" />
                  <PyToken text="(" kind="op" />
                  <PyToken text={'"불합격"'} kind="string" />
                  <PyToken text=")" kind="op" />
                </CodeLine>
              </DimBelow>
            </CodePanel>

            {/* 4줄 하이라이트 박스 */}
            <HighlightLine4Box />
          </FadeIn>

          {/* 1줄 우측 — False 라벨 */}
          <div
            style={{
              position: "absolute",
              top: 68,
              right: -110,
            }}
          >
            <BranchLabel value="False" delaySec={REVEAL.falseLabel} />
          </div>

          {/* 3줄 우측 — True 라벨 */}
          <div
            style={{
              position: "absolute",
              top: 212,
              right: -110,
            }}
          >
            <BranchLabel value="True" delaySec={REVEAL.trueLabel} />
          </div>
        </div>

        {/* 가운데 — 물음표 (정적 동안) — 더 큰 사이즈 */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: 160,
            height: 460,
            flexShrink: 0,
          }}
        >
          <QuestionMark
            delaySec={REVEAL.questionMark}
            lifespanSec={2.0}
            size={180}
            color={colors.accent}
          />
        </div>

        {/* 우측 — 콘솔 */}
        <FadeIn delaySec={0.6} translateY={20}>
          <ConsolePanel title="출력 결과" width={460} height={200}>
            <div style={{ height: 24 }} />
            <ConsoleLine revealAtSec={REVEAL.consoleOut}>
              <span style={{ fontSize: 38, fontWeight: 700 }}>재시험</span>
            </ConsoleLine>
          </ConsolePanel>
        </FadeIn>
      </div>
    </PageBackground>
  );
};
