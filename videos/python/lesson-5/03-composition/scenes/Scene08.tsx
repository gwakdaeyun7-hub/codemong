/**
 * Scene 8 — `if` / `elif` / `else` 코드 (21s)
 *
 * - 화면 중앙에 코드 에디터 패널
 * - 코드 6줄이 한 줄씩 type-on (각 1.5초 간격):
 *     1줄: `if score >= 60:`
 *     2줄: `    print("합격")`
 *     3줄: `elif score >= 40:`
 *     4줄: `    print("재시험")`
 *     5줄: `else:`
 *     6줄: `    print("불합격")`
 * - 3줄째 `elif` 위쪽에 콜아웃 박스: "Python에선 한 단어 `elif`" / "`else if` 아님"
 * - 코드 좌측에 violet-300 세로 가이드 라인 (들여쓰기된 줄들)
 *
 * 학습 목표 3번 핵심. 오개념 3번 (`elif` 한 단어) 정면 처리.
 * 5강 특수 시각화: 들여쓰기 가이드 라인 (1단 깊이, 2·4·6줄).
 *
 * 타이밍 (scene local, 21s):
 *   0.0 ~ 0.8   : 패널 등장
 *   1.0         : 1줄 if
 *   2.5         : 2줄 print("합격")
 *   4.0         : 3줄 elif
 *   5.5         : 4줄 print("재시험")
 *   7.0         : 5줄 else
 *   8.5         : 6줄 print("불합격")
 *   10.0        : 들여쓰기 가이드 라인 등장
 *   11.0        : elif 콜아웃 등장
 *   13+         : settle
 */

import React from "react";
import {
  CenteredStage,
  CodeLine,
  CodePanel,
  FadeIn,
  IndentGuide,
  InlineCallout,
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
  line6: 8.5,
  guides: 10.0,
  callout: 11.0,
} as const;

export const Scene08: React.FC = () => {
  return (
    <PageBackground>
      <CenteredStage paddingY={100}>
        <FadeIn delaySec={0.1} translateY={6}>
          <div
            style={{
              fontFamily: fonts.sans,
              fontSize: 30,
              fontWeight: 600,
              color: colors.accentDeep,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              marginBottom: 36,
            }}
          >
            `if` · `elif` · `else`
          </div>
        </FadeIn>

        <div style={{ position: "relative" }}>
          <FadeIn delaySec={REVEAL.panel} translateY={20}>
            <CodePanel fileName="grade.py" width={820} height={480}>
              <CodeLine lineNumber={1} revealAtSec={REVEAL.line1}>
                <PyToken text="if" kind="keyword" />
                <PyToken text=" " />
                <PyToken text="score" kind="name" />
                <PyToken text=" " />
                <PyToken text=">=" kind="op" />
                <PyToken text=" " />
                <PyToken text="60" kind="number" />
                <PyToken text=":" kind="op" />
              </CodeLine>
              <CodeLine lineNumber={2} revealAtSec={REVEAL.line2}>
                <PyToken text="    " />
                <PyToken text="print" kind="func" />
                <PyToken text="(" kind="op" />
                <PyToken text={'"합격"'} kind="string" />
                <PyToken text=")" kind="op" />
              </CodeLine>
              <CodeLine lineNumber={3} revealAtSec={REVEAL.line3}>
                <PyToken text="elif" kind="keyword" />
                <PyToken text=" " />
                <PyToken text="score" kind="name" />
                <PyToken text=" " />
                <PyToken text=">=" kind="op" />
                <PyToken text=" " />
                <PyToken text="40" kind="number" />
                <PyToken text=":" kind="op" />
              </CodeLine>
              <CodeLine lineNumber={4} revealAtSec={REVEAL.line4}>
                <PyToken text="    " />
                <PyToken text="print" kind="func" />
                <PyToken text="(" kind="op" />
                <PyToken text={'"재시험"'} kind="string" />
                <PyToken text=")" kind="op" />
              </CodeLine>
              <CodeLine lineNumber={5} revealAtSec={REVEAL.line5}>
                <PyToken text="else" kind="keyword" />
                <PyToken text=":" kind="op" />
              </CodeLine>
              <CodeLine lineNumber={6} revealAtSec={REVEAL.line6}>
                <PyToken text="    " />
                <PyToken text="print" kind="func" />
                <PyToken text="(" kind="op" />
                <PyToken text={'"불합격"'} kind="string" />
                <PyToken text=")" kind="op" />
              </CodeLine>
            </CodePanel>

            {/*
              들여쓰기 가이드 — 2/4/6 줄의 좌측 들여쓰기 영역에 세로 띠.
              패널 본문 padding 20px (top) + 헤더 40px = 60px 부터 본문 시작.
              한 줄 line-height 약 48px → 2줄 시작 ≈ 108px, 4줄 ≈ 204px, 6줄 ≈ 300px.
              줄번호 minWidth 22 + gap 18 = 40px 후 + 들여쓰기 4칸(약 60px) 폭.
            */}
            <IndentGuide
              left={64}
              top={108}
              height={50}
              depth={1}
              delaySec={REVEAL.guides}
              durationSec={0.4}
            />
            <IndentGuide
              left={64}
              top={204}
              height={50}
              depth={1}
              delaySec={REVEAL.guides + 0.15}
              durationSec={0.4}
            />
            <IndentGuide
              left={64}
              top={300}
              height={50}
              depth={1}
              delaySec={REVEAL.guides + 0.3}
              durationSec={0.4}
            />
          </FadeIn>

          {/* elif 콜아웃 — 3줄 위쪽 */}
          <div
            style={{
              position: "absolute",
              top: -56,
              left: 60,
            }}
          >
            <InlineCallout
              title="Python에선 한 단어 `elif`"
              subtitle="`else if` 아님"
              delaySec={REVEAL.callout}
              width={340}
            />
          </div>
        </div>
      </CenteredStage>
    </PageBackground>
  );
};
