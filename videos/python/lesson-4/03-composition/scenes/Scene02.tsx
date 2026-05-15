/**
 * Scene 2 — `input()` 한 줄 도입 (12s)
 *
 * narration: "먼저 인풋 함수의 기본 형태입니다. 변수 이름을 적고, 등호를 쓰고,
 *             인풋 괄호 안에 안내문을 넣습니다. 코드를 실행하면 안내문이 화면에 뜨고,
 *             사용자가 답을 입력하면 그 값이 좌변 변수에 담깁니다."
 *
 * 좌 60% 코드 패널 + 우 40% 콘솔 패널 + 코드 아래 변수 박스 다이어그램.
 *
 * 타이밍 (scene local):
 *   0.3 ~ 3.0 : 코드 한 줄 type-on (`name = input("이름이 무엇인가요? ")`)
 *   3.0 ~ 6.0 : 콘솔에 안내문 "이름이 무엇인가요? " fade-in + caret 깜빡임
 *   6.0 ~ 9.0 : 사용자 입력 "지윤" 한 글자씩 type-on
 *   9.0 ~ 12.0: 코드 아래 변수 박스 다이어그램 fade-in (`name` → "지윤")
 */

import React from "react";
import {
  CodeLine,
  CodePanel,
  ConsolePanel,
  ConsoleLine,
  FadeIn,
  PageBackground,
  PyToken,
  TypeOn,
  TypeOnTokens,
  VarBox,
} from "../primitives";
import { colors, fonts } from "../theme";

export const Scene02: React.FC = () => {
  return (
    <PageBackground>
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
            input() — 사용자에게 값 받기
          </div>
        </FadeIn>
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          padding: "120px 80px 60px",
          gap: 48,
        }}
      >
        {/* 좌 — 코드 패널 + 변수 박스 */}
        <div
          style={{
            flex: 0.6,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 36,
          }}
        >
          <FadeIn delaySec={0.2} translateY={20}>
            <CodePanel fileName="intro.py" width={820} height={180}>
              <CodeLine lineNumber={1} revealAtSec={0.3}>
                {/*
                  `name = input("이름이 무엇인가요? ")` 한 줄 type-on.
                  좌변 변수명은 즉시 표시되도록 별도 PyToken 으로 두고,
                  우변 `input("...")` 만 char-by-char 으로 펼침.
                */}
                <PyToken text="name" kind="name" />
                <PyToken text=" " />
                <PyToken text="=" kind="op" />
                <PyToken text=" " />
                <TypeOnTokens
                  delaySec={0.6}
                  msPerChar={70}
                  segments={[
                    { text: "input", kind: "func" },
                    { text: "(", kind: "op" },
                    { text: '"이름이 무엇인가요? "', kind: "string" },
                    { text: ")", kind: "op" },
                  ]}
                />
              </CodeLine>
            </CodePanel>
          </FadeIn>

          {/* 변수 박스 다이어그램 — 9s 부터 */}
          <FadeIn delaySec={9.0} translateY={14}>
            <VarBox
              label="name"
              labelDelaySec={9.0}
              boxDelaySec={9.4}
              highlighted
              width={280}
              height={140}
            >
              <PyToken text={'"지윤"'} kind="string" />
            </VarBox>
          </FadeIn>
        </div>

        {/* 우 — 콘솔 패널 */}
        <div style={{ flex: 0.4, display: "flex", justifyContent: "flex-start" }}>
          <FadeIn delaySec={3.0} translateY={20}>
            <ConsolePanel title="콘솔" width={620} height={320}>
              <ConsoleLine revealAtSec={3.0}>
                <span style={{ color: colors.darkInk }}>이름이 무엇인가요? </span>
                <span style={{ color: colors.darkAccent, fontWeight: 800 }}>
                  <TypeOn text="지윤" delaySec={6.0} msPerChar={400} caret />
                </span>
              </ConsoleLine>
              <div style={{ height: 18 }} />
              <ConsoleLine revealAtSec={9.5}>
                <span style={{ color: colors.darkMuted, fontSize: 24 }}>
                  # name 에 "지윤" 이 담깁니다
                </span>
              </ConsoleLine>
            </ConsolePanel>
          </FadeIn>
        </div>
      </div>
    </PageBackground>
  );
};
