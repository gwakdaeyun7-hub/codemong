/**
 * Scene 10 — print() 로 출력하기 (22s)
 *
 * - 화면 좌측 절반: 앞 scene 의 코드 패널이 유지되고, 아래에 3줄 추가 type-on
 *     1줄: name = "코드몽"           (앞 scene 에서 이어짐 — opacity 1)
 *     2줄: age = 5
 *     3줄: is_student = True
 *     4줄: print(name)                (이 scene 에서 새로 등장)
 *     5줄: print(age)
 *     6줄: print(is_student)
 *
 * - 화면 우측 절반: 콘솔 패널 (앞 scene 의 박스 영역이 콘솔로 swap)
 *     콘솔 라벨: "출력 결과"
 *     결과 3줄이 코드 4·5·6줄과 동기화되어 fade-in
 *       결과 1: 코드몽
 *       결과 2: 5
 *       결과 3: True
 *
 * - 각 코드 줄(4·5·6)과 결과 줄을 잇는 회색 점선 화살표 (각 0.3초씩 fade-in)
 *
 * 학습 목표 4·5번 핵심. 코드와 결과를 좌우 분리해서 학습자가 한눈에 매칭.
 *
 * 타이밍 (scene local, narration 22초):
 *   0.0 ~ 1.0  : 패널 등장 (코드 1·2·3줄은 즉시 표시 — 회상)
 *   2.5 ~ 3.5  : 4줄 print(name) + 결과 "코드몽" + 화살표 1
 *   5.5 ~ 6.5  : 5줄 print(age) + 결과 "5" + 화살표 2
 *   8.5 ~ 9.5  : 6줄 print(is_student) + 결과 "True" + 화살표 3
 *   12+        : settle ("코드 한 줄이 결과 한 줄로 매칭" narration 동안)
 */

import React from "react";
import {
  CodeLine,
  CodePanel,
  ConsoleLine,
  ConsolePanel,
  DashedHArrow,
  FadeIn,
  PageBackground,
  PyToken,
} from "../primitives";
import { colors, fonts } from "../theme";

// 코드↔콘솔 동기화 timing (단일 source of truth)
const PRINT_REVEAL_AT = [3.0, 6.0, 9.0] as const;
const CONSOLE_REVEAL_AT = [
  PRINT_REVEAL_AT[0] + 1.0,
  PRINT_REVEAL_AT[1] + 1.0,
  PRINT_REVEAL_AT[2] + 1.0,
] as const;
const ARROW_DELAY_AT = [
  PRINT_REVEAL_AT[0] + 0.5,
  PRINT_REVEAL_AT[1] + 0.5,
  PRINT_REVEAL_AT[2] + 0.5,
] as const;

export const Scene10: React.FC = () => {
  return (
    <PageBackground>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          padding: "70px 60px",
          gap: 0,
        }}
      >
        {/* 좌측 — 코드 패널 (6줄) */}
        <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
          <FadeIn delaySec={0.2} translateY={20}>
            <CodePanel fileName="intro.py" width={680} height={560}>
              {/* 1·2·3줄 — 회상 (즉시 표시, dimmed=false 로 또렷이) */}
              <CodeLine lineNumber={1} revealAtSec={0.3}>
                <PyToken text="name" kind="name" />
                <PyToken text=" " />
                <PyToken text="=" kind="op" />
                <PyToken text=" " />
                <PyToken text={'"코드몽"'} kind="string" />
              </CodeLine>
              <CodeLine lineNumber={2} revealAtSec={0.5}>
                <PyToken text="age" kind="name" />
                <PyToken text=" " />
                <PyToken text="=" kind="op" />
                <PyToken text=" " />
                <PyToken text="5" kind="number" />
              </CodeLine>
              <CodeLine lineNumber={3} revealAtSec={0.7}>
                <PyToken text="is_student" kind="name" />
                <PyToken text=" " />
                <PyToken text="=" kind="op" />
                <PyToken text=" " />
                <PyToken text="True" kind="keyword" />
              </CodeLine>

              {/* 빈 줄 (시각적 분리) */}
              <div style={{ height: 14 }} />

              {/* 4·5·6줄 — print() 호출 (이 scene 에서 새로 등장) */}
              <CodeLine
                lineNumber={4}
                revealAtSec={PRINT_REVEAL_AT[0]}
                highlighted
                highlightDurationSec={2.0}
              >
                <PyToken text="print" kind="func" />
                <PyToken text="(" kind="op" />
                <PyToken text="name" kind="name" />
                <PyToken text=")" kind="op" />
              </CodeLine>
              <CodeLine
                lineNumber={5}
                revealAtSec={PRINT_REVEAL_AT[1]}
                highlighted
                highlightDurationSec={2.0}
              >
                <PyToken text="print" kind="func" />
                <PyToken text="(" kind="op" />
                <PyToken text="age" kind="name" />
                <PyToken text=")" kind="op" />
              </CodeLine>
              <CodeLine
                lineNumber={6}
                revealAtSec={PRINT_REVEAL_AT[2]}
                highlighted
                highlightDurationSec={2.0}
              >
                <PyToken text="print" kind="func" />
                <PyToken text="(" kind="op" />
                <PyToken text="is_student" kind="name" />
                <PyToken text=")" kind="op" />
              </CodeLine>
            </CodePanel>
          </FadeIn>
        </div>

        {/*
          중앙 — 코드↔콘솔 매칭 점선 화살표 3개.
          flex 콘텐츠라서 크기 100px 짜리 좁은 컬럼에 absolute 로 배치.
          y 좌표는 코드 4·5·6줄 (라인 높이 약 50px) 의 중심에 맞춤 — 패널 높이 560,
          헤더 40, padding 40, 빈 줄 14, 1·2·3줄 50*3 = 150 → 4줄 시작 ≈ 244px.
          시각 정확도는 Studio preview 에서 미세 조정 (이번 라운드는 골격).
        */}
        <div
          style={{
            position: "relative",
            width: 100,
            height: 560,
            flexShrink: 0,
          }}
        >
          {/* 4줄 → 결과 1 */}
          <div
            style={{
              position: "absolute",
              top: 290,
              left: 0,
            }}
          >
            <DashedHArrow
              width={100}
              delaySec={ARROW_DELAY_AT[0]}
              durationSec={0.6}
              color={colors.inkSubtle}
              thickness={3}
            />
          </div>
          {/* 5줄 → 결과 2 */}
          <div
            style={{
              position: "absolute",
              top: 350,
              left: 0,
            }}
          >
            <DashedHArrow
              width={100}
              delaySec={ARROW_DELAY_AT[1]}
              durationSec={0.6}
              color={colors.inkSubtle}
              thickness={3}
            />
          </div>
          {/* 6줄 → 결과 3 */}
          <div
            style={{
              position: "absolute",
              top: 410,
              left: 0,
            }}
          >
            <DashedHArrow
              width={100}
              delaySec={ARROW_DELAY_AT[2]}
              durationSec={0.6}
              color={colors.inkSubtle}
              thickness={3}
            />
          </div>
        </div>

        {/* 우측 — 콘솔 패널 (3줄 결과) */}
        <div style={{ flex: 1, display: "flex", justifyContent: "flex-start" }}>
          <FadeIn delaySec={0.4} translateY={20}>
            <ConsolePanel title="출력 결과" width={680} height={560}>
              {/*
                결과는 코드 4·5·6 줄과 동기화되어 fade-in.
                콘솔 위쪽에 빈 공간을 두어 결과 라인 y 위치가 코드 라인 y 위치와
                대략 정렬되도록 (점선 화살표가 의미 있게 보이도록).
                상단 패딩은 ConsolePanel 본문 padding 20px + 자체 spacer 로 조절.
              */}
              <div style={{ height: 130 }} />
              <ConsoleLine revealAtSec={CONSOLE_REVEAL_AT[0]}>
                코드몽
              </ConsoleLine>
              <ConsoleLine revealAtSec={CONSOLE_REVEAL_AT[1]}>
                5
              </ConsoleLine>
              <ConsoleLine revealAtSec={CONSOLE_REVEAL_AT[2]}>
                True
              </ConsoleLine>
            </ConsolePanel>
          </FadeIn>
        </div>
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
            }}
          >
            print() 으로 출력하기
          </div>
        </FadeIn>
      </div>
    </PageBackground>
  );
};
