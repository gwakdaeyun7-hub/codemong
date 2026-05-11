/**
 * Scene 9 — 코드 작성: 세 줄 할당 (21s)
 *
 * - 화면 좌측 절반: 코드 패널 (어두운 배경, monospace)
 *     코드 3줄이 한 줄씩 fade-in (각 줄 1.5초 간격, narration 동기화):
 *       1줄: name = "코드몽"
 *       2줄: age = 5
 *       3줄: is_student = True
 *     새로 등장하는 줄은 좌측에 violet 강조 막대 (CodeLine highlighted)
 *
 * - 화면 우측 절반: 박스 3개가 코드와 동기화되어 채워짐
 *     박스 1: 이름표 `name` + 안에 `"코드몽"` (1줄과 동기)
 *     박스 2: 이름표 `age` + 안에 `5` (2줄과 동기)
 *     박스 3: 이름표 `is_student` + 안에 `True` (3줄과 동기)
 *
 * 학습 목표 5번 핵심 첫 단계. 코드와 박스 비주얼이 동기화되어 mental model 강화.
 *
 * 타이밍 (scene local, narration 21초):
 *   0.0 ~ 2.0 : 패널·박스 컨테이너 등장 (빈 상태)
 *   2.0 ~ 5.0 : 1줄 코드 + 박스 1 (name="코드몽")
 *   5.0 ~ 8.0 : 2줄 코드 + 박스 2 (age=5)
 *   8.0 ~ 12.0: 3줄 코드 + 박스 3 (is_student=True)
 *   12+       : settle (학습자가 전체를 보는 시간)
 */

import React from "react";
import {
  CodeLine,
  CodePanel,
  FadeIn,
  PageBackground,
  PyToken,
  VarBox,
} from "../primitives";
import { colors, fonts } from "../theme";

// 한 줄 등장 시점 (코드 패널·박스 동기화의 단일 source of truth)
const LINE_REVEAL_AT = [3.0, 6.5, 10.5] as const;

export const Scene09: React.FC = () => {
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
        {/* 좌측 — 코드 패널 */}
        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <FadeIn delaySec={0.4} translateY={20}>
            <CodePanel fileName="intro.py" width={780} height={420}>
              {/* 1줄: name = "코드몽" */}
              <CodeLine
                lineNumber={1}
                revealAtSec={LINE_REVEAL_AT[0]}
                highlighted
                highlightDurationSec={2.5}
                dimmed={false}
              >
                <PyToken text="name" kind="name" />
                <PyToken text=" " />
                <PyToken text="=" kind="op" />
                <PyToken text=" " />
                <PyToken text={'"코드몽"'} kind="string" />
              </CodeLine>

              {/* 2줄: age = 5 */}
              <CodeLine
                lineNumber={2}
                revealAtSec={LINE_REVEAL_AT[1]}
                highlighted
                highlightDurationSec={2.5}
              >
                <PyToken text="age" kind="name" />
                <PyToken text=" " />
                <PyToken text="=" kind="op" />
                <PyToken text=" " />
                <PyToken text="5" kind="number" />
              </CodeLine>

              {/* 3줄: is_student = True */}
              <CodeLine
                lineNumber={3}
                revealAtSec={LINE_REVEAL_AT[2]}
                highlighted
                highlightDurationSec={2.5}
              >
                <PyToken text="is_student" kind="name" />
                <PyToken text=" " />
                <PyToken text="=" kind="op" />
                <PyToken text=" " />
                <PyToken text="True" kind="keyword" />
              </CodeLine>
            </CodePanel>
          </FadeIn>
        </div>

        {/* 우측 — 박스 3개 (코드와 동기화) */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 36,
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
                opacity: 0.9,
              }}
            >
              값에 이름 붙이기
            </div>
          </FadeIn>

          {/*
            VarBox 들 — 라벨은 코드 줄과 동시에 떨어지고 (labelDelaySec),
            박스 본체는 0.4초 뒤 (boxDelaySec). highlighted=true 로 새로 등장
            할 때 강조.
          */}
          <VarBox
            label="name"
            labelDelaySec={LINE_REVEAL_AT[0]}
            boxDelaySec={LINE_REVEAL_AT[0] + 0.3}
            highlighted
            width={300}
            height={120}
            valueFontSize={36}
          >
            <PyToken text={'"코드몽"'} kind="string" />
          </VarBox>

          <VarBox
            label="age"
            labelDelaySec={LINE_REVEAL_AT[1]}
            boxDelaySec={LINE_REVEAL_AT[1] + 0.3}
            highlighted
            width={300}
            height={120}
            valueFontSize={42}
          >
            <PyToken text="5" kind="number" />
          </VarBox>

          <VarBox
            label="is_student"
            labelDelaySec={LINE_REVEAL_AT[2]}
            boxDelaySec={LINE_REVEAL_AT[2] + 0.3}
            highlighted
            width={300}
            height={120}
            valueFontSize={36}
          >
            <PyToken text="True" kind="keyword" />
          </VarBox>
        </div>
      </div>
    </PageBackground>
  );
};
