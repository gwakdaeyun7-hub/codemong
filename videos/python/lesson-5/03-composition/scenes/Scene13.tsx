/**
 * Scene 13 — Active recall: is_login=True, is_admin=False 어느 줄? (16s)
 *
 * - 화면 좌측 절반: scene-12 의 코드 5줄 유지
 * - 코드 위쪽에 변수 박스 2개: `is_login = True`, `is_admin = False`
 * - 1.8초 정적 동안 코드 우측에 큰 물음표
 * - 정적 후:
 *     1줄째 조건 옆에 `True` 라벨 (violet) — 바깥 진입
 *     2줄째 조건 옆에 `False` 라벨 (회색)
 *     4줄째 `else:` 줄에 violet 하이라이트
 *     5줄째 `print("일반 화면")` 줄에 violet 하이라이트 박스
 *     3줄째는 opacity 0.4 로 톤다운
 * - 화면 우측 절반: 콘솔 패널 "일반 화면" 출력
 *
 * 마지막 active recall. 학습 목표 5번 마무리.
 *
 * 타이밍 (scene local, 16s):
 *   0.0 ~ 1.0    : 코드 + 변수 박스 표시
 *   3.0 ~ 4.8    : 정적 — 물음표
 *   5.5          : 1줄 True 라벨
 *   6.2          : 2줄 False 라벨
 *   7.0          : 3줄 톤다운
 *   7.5          : 5줄 하이라이트 박스
 *   8.5          : 콘솔 "일반 화면"
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
  trueLabel: 5.5,
  falseLabel: 6.2,
  dimLine3: 7.0,
  highlightLine5: 7.5,
  consoleOut: 8.5,
} as const;

/**
 * 3줄 (관리자 화면) 만 톤다운 — DimLine wrapper.
 */
const DimSingle: React.FC<{ children: React.ReactNode; sinceSec: number }> = ({
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
 * 5줄 violet 하이라이트 박스.
 * 패널 본문 padding 20 + 헤더 40 + line-height 약 48px*4 = 252px (5줄 시작).
 */
const HighlightLine5Box: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = REVEAL.highlightLine5 * fps;
  const opacity = interpolate(frame, [start, start + 0.4 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        left: 38,
        top: 252,
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

export const Scene13: React.FC = () => {
  return (
    <PageBackground>
      <div
        style={{
          position: "absolute",
          top: 50,
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
            마지막 회상 — 어느 줄이 실행될까?
          </div>
        </FadeIn>
      </div>

      {/*
        Layout: 변수 박스 2개를 코드 패널 위쪽 가운데에 absolute 배치하고,
        CodePanel / QuestionMark / ConsolePanel 을 horizontal flex row 로 정렬.
        세 박스 모두 같은 세로 위치 + 가로 간격 동일.
      */}
      {/* 변수 박스 2개 — 코드 패널 위쪽 가운데 */}
      <div
        style={{
          position: "absolute",
          top: 120,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 32,
        }}
      >
        <VarBox
          label="is_login"
          labelDelaySec={0.3}
          boxDelaySec={0.6}
          width={220}
          height={100}
          valueFontSize={36}
        >
          <PyToken text="True" kind="keyword" />
        </VarBox>
        <VarBox
          label="is_admin"
          labelDelaySec={0.6}
          boxDelaySec={0.9}
          width={220}
          height={100}
          valueFontSize={36}
        >
          <PyToken text="False" kind="keyword" />
        </VarBox>
      </div>

      {/* 메인 row — CodePanel / QuestionMark / ConsolePanel 같은 세로 위치 */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 320,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 60,
        }}
      >
        {/* 좌측 — 코드 패널 */}
        <div style={{ position: "relative" }}>
          <FadeIn delaySec={REVEAL.panel} translateY={14}>
            <CodePanel fileName="login.py" width={680} height={420}>
              <CodeLine lineNumber={1} revealAtSec={1.0}>
                <PyToken text="if" kind="keyword" />
                <PyToken text=" " />
                <PyToken text="is_login" kind="name" />
                <PyToken text=":" kind="op" />
              </CodeLine>
              <CodeLine lineNumber={2} revealAtSec={1.0}>
                <PyToken text="    " />
                <PyToken text="if" kind="keyword" />
                <PyToken text=" " />
                <PyToken text="is_admin" kind="name" />
                <PyToken text=":" kind="op" />
              </CodeLine>
              <DimSingle sinceSec={REVEAL.dimLine3}>
                <CodeLine lineNumber={3} revealAtSec={1.0}>
                  <PyToken text="        " />
                  <PyToken text="print" kind="func" />
                  <PyToken text="(" kind="op" />
                  <PyToken text={'"관리자 화면"'} kind="string" />
                  <PyToken text=")" kind="op" />
                </CodeLine>
              </DimSingle>
              <CodeLine lineNumber={4} revealAtSec={1.0}>
                <PyToken text="    " />
                <PyToken text="else" kind="keyword" />
                <PyToken text=":" kind="op" />
              </CodeLine>
              <CodeLine lineNumber={5} revealAtSec={1.0}>
                <PyToken text="        " />
                <PyToken text="print" kind="func" />
                <PyToken text="(" kind="op" />
                <PyToken text={'"일반 화면"'} kind="string" />
                <PyToken text=")" kind="op" />
              </CodeLine>
            </CodePanel>

            <HighlightLine5Box />
          </FadeIn>

          {/* 1줄 True */}
          <div
            style={{
              position: "absolute",
              top: 68,
              right: -110,
            }}
          >
            <BranchLabel value="True" delaySec={REVEAL.trueLabel} />
          </div>
          {/* 2줄 False */}
          <div
            style={{
              position: "absolute",
              top: 116,
              right: -110,
            }}
          >
            <BranchLabel value="False" delaySec={REVEAL.falseLabel} />
          </div>
        </div>

        {/* 가운데 — 물음표 (정적 동안) — 더 큰 사이즈 */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: 160,
            height: 420,
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
              <span style={{ fontSize: 38, fontWeight: 700 }}>일반 화면</span>
            </ConsoleLine>
          </ConsolePanel>
        </FadeIn>
      </div>
    </PageBackground>
  );
};
