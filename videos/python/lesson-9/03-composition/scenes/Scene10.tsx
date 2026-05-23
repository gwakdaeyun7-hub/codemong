/**
 * Scene 10 — 지역변수: 함수 안 이름은 함수 안에서만 (14s)
 *
 * - 0~4s: 상단 pill 라벨 "네 번째 — 함수 안의 이름" + 부제 "_함수 안에서만 살아있다_".
 *         (R-025: Scene 03/05/07 과 동일 정형.)
 * - 4~8s: 화면을 _두 칸 메모리_ 로 분할 — 좌측 큰 박스 "함수 바깥", 우측 큰 박스 "함수 안".
 *         좌측 코드 패널 작게: def f(): / x = 10 / f() / print(x)
 *         def 줄과 x = 10 가리킬 때, 우측 박스 안에 `x = 10` 라벨 fade-in.
 *         동시에 우측 박스 외곽 노란 펄스 ("실행 중").
 *         함수 끝나면 우측 박스 회색으로 swap + `x = 10` 라벨 회색 → 사라짐 (~1초).
 * - 8~12s: 마지막 `print(x)` 줄 violet 강조.
 *          좌측 박스 (함수 바깥) 안에 빨간 X 마크 fade-in — _그런 이름 없음_.
 *          R-024 준수: 빨간 ✕ 원은 panel 안쪽 inset (right: 24).
 * - 12~14s: lower-third "함수 안에서 만든 이름은 함수 안에서만 살아 있다".
 *
 * 학습 목표 5번 진입. 입력 사항 §4 오개념 3 정면 처치.
 * scope 제한: global / NameError 텍스트 등장 X.
 */

import React from "react";
import {
  CodeLine,
  CodePanel,
  FadeIn,
  LowerThird,
  PageBackground,
  PyToken,
  ScopeMemoryPair,
} from "../primitives";
import { colors, fonts, radii } from "../theme";

const REVEAL = {
  headerLabel: 0.2,
  codePanel: 1.5,
  line1: 2.0, // def f():
  line2: 2.8, //     x = 10
  line3: 4.0, // (empty)  f()
  line4: 5.5, // print(x)
  scopePair: 1.8,
  innerVarEnter: 3.5, // x = 10 라벨이 우측 박스에 등장 (line2 강조 시점에 맞춰)
  innerVarFadeOut: 6.5, // f() 끝나면 사라짐 (line3 직후)
  outerNotFound: 8.5, // print(x) 등장 후 좌측 박스에 빨간 X
  lowerThird: 11.0,
} as const;

export const Scene10: React.FC = () => {
  return (
    <PageBackground>
      {/* 상단 pill 라벨 + 부제 */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
        }}
      >
        <FadeIn delaySec={REVEAL.headerLabel} translateY={6}>
          <div
            style={{
              padding: "8px 24px",
              borderRadius: radii.pill,
              background: colors.accentSoft,
              color: colors.accentInk,
              border: `1.5px solid ${colors.accent}`,
              fontFamily: fonts.sans,
              fontSize: 26,
              fontWeight: 700,
              letterSpacing: "-0.01em",
            }}
          >
            네 번째 — 함수 안의 이름
          </div>
        </FadeIn>
        <FadeIn delaySec={REVEAL.headerLabel + 0.4} translateY={6}>
          <div
            style={{
              fontFamily: fonts.sans,
              fontSize: 22,
              fontWeight: 500,
              color: colors.inkMuted,
              letterSpacing: "-0.01em",
            }}
          >
            <span style={{ color: colors.accentInk, fontWeight: 700 }}>함수 안에서만</span> 살아있다
          </div>
        </FadeIn>
      </div>

      {/* 좌측 코드 + 우측 두 칸 메모리 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          padding: "160px 80px 200px",
          gap: 40,
        }}
      >
        {/* 좌측 — 코드 패널 */}
        <div
          style={{
            flex: "0 0 580",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <FadeIn delaySec={REVEAL.codePanel} translateY={20}>
            <CodePanel fileName="scope.py" width={520} height={320}>
              <CodeLine lineNumber={1} revealAtSec={REVEAL.line1}>
                <PyToken text="def" kind="keyword" />
                <PyToken text=" " />
                <PyToken text="f" kind="name" />
                <PyToken text="(" kind="op" />
                <PyToken text=")" kind="op" />
                <PyToken text=":" kind="op" />
              </CodeLine>
              <CodeLine lineNumber={2} revealAtSec={REVEAL.line2}>
                <PyToken text="    " />
                <PyToken text="x" kind="dictKey" highlight />
                <PyToken text=" = " kind="op" />
                <PyToken text="10" kind="number" />
              </CodeLine>
              <CodeLine lineNumber={3} revealAtSec={REVEAL.line3}>
                <PyToken text="f" kind="name" />
                <PyToken text="()" kind="op" />
              </CodeLine>
              <CodeLine lineNumber={4} revealAtSec={REVEAL.line4} highlighted>
                <PyToken text="print" kind="func" />
                <PyToken text="(" kind="op" />
                <PyToken text="x" kind="dictKey" highlight />
                <PyToken text=")" kind="op" />
              </CodeLine>
            </CodePanel>
          </FadeIn>
        </div>

        {/* 우측 — 두 칸 메모리 다이어그램 */}
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ScopeMemoryPair
            delaySec={REVEAL.scopePair}
            innerVarLabel="x = 10"
            innerVarEnterAtSec={REVEAL.innerVarEnter}
            innerVarFadeOutAtSec={REVEAL.innerVarFadeOut}
            outerNotFoundAtSec={REVEAL.outerNotFound}
            width={300}
            height={280}
            gap={28}
          />
        </div>
      </div>

      <LowerThird
        text={
          <>
            함수 안에서 만든 이름은{" "}
            <span style={{ color: colors.accentLight, fontWeight: 700 }}>함수 안에서만</span> 살아
            있다
          </>
        }
        delaySec={REVEAL.lowerThird}
      />
    </PageBackground>
  );
};
