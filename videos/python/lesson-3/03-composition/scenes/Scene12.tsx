/**
 * Scene 12 — 전체 코드 한 번 더 읽기 (16s)
 *
 * - 화면 중앙에 전체 6줄 코드가 한 번에 fade-in (어두운 배경, monospace)
 *     1줄: name = "코드몽"
 *     2줄: age = 5
 *     3줄: is_student = True
 *     4줄: print(name)
 *     5줄: print(age)
 *     6줄: print(is_student)
 * - 코드 좌측에 violet-500 세로 막대로 두 그룹 구분 + 라벨
 *     1~3줄 옆: "값에 이름 붙이기"
 *     4~6줄 옆: "이름으로 화면에 출력"
 * - 우측에 콘솔 패널 (작게): 결과 3줄 — 코드몽 / 5 / True
 *
 * 학습 목표 5번 마무리 + active recall.
 */

import React from "react";
import {
  CodeLine,
  CodePanel,
  ConsoleLine,
  ConsolePanel,
  FadeIn,
  PageBackground,
  PyToken,
} from "../primitives";
import { colors, fonts } from "../theme";

const GroupLabel: React.FC<{
  text: string;
  delaySec: number;
}> = ({ text, delaySec }) => {
  return (
    <FadeIn delaySec={delaySec} translateY={6}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          fontFamily: fonts.sans,
          fontSize: 22,
          fontWeight: 700,
          color: colors.accentDeep,
          letterSpacing: "-0.01em",
        }}
      >
        <div
          style={{
            width: 4,
            height: 80,
            borderRadius: 2,
            background: colors.accent,
          }}
        />
        <span style={{ writingMode: "horizontal-tb" }}>{text}</span>
      </div>
    </FadeIn>
  );
};

export const Scene12: React.FC = () => {
  return (
    <PageBackground>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "100px 80px",
          gap: 40,
        }}
      >
        {/* 좌측 그룹 라벨 — 1~3줄 / 4~6줄 두 그룹 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
            alignItems: "flex-start",
            paddingTop: 40,
          }}
        >
          <GroupLabel text="값에 이름 붙이기" delaySec={1.4} />
          <div style={{ height: 24 }} />
          <GroupLabel text="이름으로 화면에 출력" delaySec={1.8} />
        </div>

        {/* 중앙 — 전체 6줄 코드 (한 번에 fade-in) */}
        <FadeIn delaySec={0.4} translateY={20}>
          <CodePanel fileName="intro.py" width={680} height={520}>
            <CodeLine lineNumber={1} revealAtSec={0.7}>
              <PyToken text="name" kind="name" />
              <PyToken text=" " />
              <PyToken text="=" kind="op" />
              <PyToken text=" " />
              <PyToken text={'"코드몽"'} kind="string" />
            </CodeLine>
            <CodeLine lineNumber={2} revealAtSec={0.8}>
              <PyToken text="age" kind="name" />
              <PyToken text=" " />
              <PyToken text="=" kind="op" />
              <PyToken text=" " />
              <PyToken text="5" kind="number" />
            </CodeLine>
            <CodeLine lineNumber={3} revealAtSec={0.9}>
              <PyToken text="is_student" kind="name" />
              <PyToken text=" " />
              <PyToken text="=" kind="op" />
              <PyToken text=" " />
              <PyToken text="True" kind="keyword" />
            </CodeLine>

            <div style={{ height: 14 }} />

            <CodeLine lineNumber={4} revealAtSec={1.1}>
              <PyToken text="print" kind="func" />
              <PyToken text="(" kind="op" />
              <PyToken text="name" kind="name" />
              <PyToken text=")" kind="op" />
            </CodeLine>
            <CodeLine lineNumber={5} revealAtSec={1.2}>
              <PyToken text="print" kind="func" />
              <PyToken text="(" kind="op" />
              <PyToken text="age" kind="name" />
              <PyToken text=")" kind="op" />
            </CodeLine>
            <CodeLine lineNumber={6} revealAtSec={1.3}>
              <PyToken text="print" kind="func" />
              <PyToken text="(" kind="op" />
              <PyToken text="is_student" kind="name" />
              <PyToken text=")" kind="op" />
            </CodeLine>
          </CodePanel>
        </FadeIn>

        {/* 우측 — 작은 콘솔 */}
        <FadeIn delaySec={2.5} translateY={20}>
          <ConsolePanel title="출력 결과" width={300} height={300}>
            <ConsoleLine revealAtSec={3.0}>코드몽</ConsoleLine>
            <ConsoleLine revealAtSec={3.4}>5</ConsoleLine>
            <ConsoleLine revealAtSec={3.8}>True</ConsoleLine>
          </ConsolePanel>
        </FadeIn>
      </div>

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
              textTransform: "uppercase",
            }}
          >
            오늘 만든 코드 — 한 번 더 읽기
          </div>
        </FadeIn>
      </div>
    </PageBackground>
  );
};
