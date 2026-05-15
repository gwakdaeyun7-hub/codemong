/**
 * Scene 12 — 2단 중첩 코드 (22s)
 *
 * - 화면 좌측 절반: 코드 에디터 패널
 *     5줄 type-on (각 1.5초 간격):
 *       1줄: `if is_login:`
 *       2줄: `    if is_admin:`
 *       3줄: `        print("관리자 화면")`
 *       4줄: `    else:`
 *       5줄: `        print("일반 화면")`
 * - 코드 좌측에 들여쓰기 깊이별 가이드 라인 2개:
 *     1단 깊이 (violet-300, 옅게): 2·4줄 좌측에 세로 띠
 *     2단 깊이 (violet-500, 진하게): 3·5줄 좌측에 세로 띠
 * - 화면 우측 절반: containment mental model
 *
 * 학습 목표 5번 핵심. 오개념 5번 (중첩 깊이 추적) 정면 처리.
 * 5강 특수 시각화: 들여쓰기 깊이별 색상 분리 (1단/2단).
 */

import React from "react";
import {
  CodeLine,
  CodePanel,
  ContainmentBoxes,
  FadeIn,
  IndentGuide,
  PageBackground,
  PyToken,
} from "../primitives";
import { colors, fonts } from "../theme";

const REVEAL = {
  panel: 0.4,
  line1: 1.0,
  line2: 2.5,
  line3: 4.0,
  line4: 5.5,
  line5: 7.0,
  guides1: 9.0, // 1단 깊이 (2·4줄)
  guides2: 10.5, // 2단 깊이 (3·5줄)
  containment: 11.5,
} as const;

export const Scene12: React.FC = () => {
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
            2단 중첩 — 들여쓰기 깊이가 곧 블록
          </div>
        </FadeIn>
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          padding: "120px 60px 60px",
          gap: 40,
        }}
      >
        {/* 좌측 — 코드 패널 */}
        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <FadeIn delaySec={REVEAL.panel} translateY={18}>
            <div style={{ position: "relative" }}>
              <CodePanel fileName="login.py" width={720} height={420}>
                <CodeLine lineNumber={1} revealAtSec={REVEAL.line1}>
                  <PyToken text="if" kind="keyword" />
                  <PyToken text=" " />
                  <PyToken text="is_login" kind="name" />
                  <PyToken text=":" kind="op" />
                </CodeLine>
                <CodeLine lineNumber={2} revealAtSec={REVEAL.line2}>
                  <PyToken text="    " />
                  <PyToken text="if" kind="keyword" />
                  <PyToken text=" " />
                  <PyToken text="is_admin" kind="name" />
                  <PyToken text=":" kind="op" />
                </CodeLine>
                <CodeLine lineNumber={3} revealAtSec={REVEAL.line3}>
                  <PyToken text="        " />
                  <PyToken text="print" kind="func" />
                  <PyToken text="(" kind="op" />
                  <PyToken text={'"관리자 화면"'} kind="string" />
                  <PyToken text=")" kind="op" />
                </CodeLine>
                <CodeLine lineNumber={4} revealAtSec={REVEAL.line4}>
                  <PyToken text="    " />
                  <PyToken text="else" kind="keyword" />
                  <PyToken text=":" kind="op" />
                </CodeLine>
                <CodeLine lineNumber={5} revealAtSec={REVEAL.line5}>
                  <PyToken text="        " />
                  <PyToken text="print" kind="func" />
                  <PyToken text="(" kind="op" />
                  <PyToken text={'"일반 화면"'} kind="string" />
                  <PyToken text=")" kind="op" />
                </CodeLine>
              </CodePanel>

              {/*
                들여쓰기 가이드 라인.
                패널 본문 padding 20px (top) + 헤더 40px = 60px 부터 본문 시작.
                line-height 약 48px → 1줄 60px, 2줄 108px, 3줄 156px, 4줄 204px, 5줄 252px.
                줄번호 minWidth 22 + gap 18 = 40px 후 좌측 들여쓰기 영역.

                1단 깊이 (2·4줄, violet-300): left 64, top 108~156(2줄), 204~252(4줄)
                2단 깊이 (3·5줄, violet-500): left 100, top 156~204(3줄), 252~300(5줄)
              */}
              {/* 1단 가이드: 2·4줄을 묶지 말고 각각 — 한 블록 시각 분리 */}
              <IndentGuide
                left={64}
                top={108}
                height={48}
                depth={1}
                delaySec={REVEAL.guides1}
                durationSec={0.4}
              />
              <IndentGuide
                left={64}
                top={204}
                height={48}
                depth={1}
                delaySec={REVEAL.guides1 + 0.2}
                durationSec={0.4}
              />
              {/* 2단 가이드: 3·5줄 */}
              <IndentGuide
                left={100}
                top={156}
                height={48}
                depth={2}
                delaySec={REVEAL.guides2}
                durationSec={0.4}
              />
              <IndentGuide
                left={100}
                top={252}
                height={48}
                depth={2}
                delaySec={REVEAL.guides2 + 0.2}
                durationSec={0.4}
              />
            </div>
          </FadeIn>
        </div>

        {/* 우측 — containment mental model */}
        <div
          style={{
            flex: "0 0 500",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FadeIn delaySec={REVEAL.containment} translateY={14}>
            <ContainmentBoxes
              outerLabel={"바깥 블록\n(1단 깊이)"}
              innerLabel={"안쪽 블록\n(2단 깊이)"}
              outerDelaySec={0}
              innerDelaySec={0.8}
              outerWidth={460}
              outerHeight={320}
            />
          </FadeIn>
        </div>
      </div>
    </PageBackground>
  );
};
