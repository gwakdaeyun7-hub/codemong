/**
 * Scene 7 — `tuple` 도입: 변경 불가한 묶음 (18s)
 *
 * - 0~4s: 상단 라벨 카드 "두 번째 — 튜플" + 부제 "_변경할 수 없는_ 묶음".
 * - 4~10s: 좌측 CodePanel — `좌표 = (37.5, 127.0)`, `좌표[0]`, `좌표[1]` type-on.
 *          `(`, `)` violet-300 강조. 콜론 없는 점이 dict 와 자연 대비.
 * - 10~14s: 우측 TupleBox — 둥근 박스 안에 `37.5` · `127.0` 가로 배열. `[0]` `[1]` 인덱스 라벨.
 *           라벨 "좌표 (위도, 경도)".
 * - 14~18s: 우측 콘솔 결과 `37.5`, `127.0` 두 줄. lower-third "튜플 — 변경할 수 없는 묶음. 소괄호 사용".
 */

import React from "react";
import {
  CodeLine,
  CodePanel,
  ConsoleLine,
  ConsolePanel,
  FadeIn,
  LowerThird,
  PageBackground,
  PyToken,
  TupleBox,
} from "../primitives";
import { colors, fonts, radii } from "../theme";

const REVEAL = {
  headerLabel: 0.2,
  codePanel: 4.0,
  line1: 4.5,
  line2: 6.5,
  line3: 8.0,
  tupleBox: 10.0,
  console: 14.0,
  consoleLine1: 14.5,
  consoleLine2: 15.5,
  lowerThird: 16.0,
} as const;

export const Scene07: React.FC = () => {
  return (
    <PageBackground>
      {/* 상단 라벨 */}
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
            두 번째 — 튜플
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
            <span style={{ color: colors.accentInk, fontWeight: 700 }}>변경할 수 없는</span> 묶음
          </div>
        </FadeIn>
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          padding: "160px 80px 140px",
          gap: 60,
        }}
      >
        {/* 좌측 — 코드 + 콘솔 */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 28,
          }}
        >
          <FadeIn delaySec={REVEAL.codePanel} translateY={20}>
            <CodePanel fileName="location.py" width={680} height={260}>
              <CodeLine lineNumber={1} revealAtSec={REVEAL.line1}>
                <PyToken text="좌표" kind="name" />
                <PyToken text=" " />
                <PyToken text="=" kind="op" />
                <PyToken text=" " />
                <PyToken text="(" kind="op" highlight />
                <PyToken text="37.5" kind="number" />
                <PyToken text=", " kind="op" />
                <PyToken text="127.0" kind="number" />
                <PyToken text=")" kind="op" highlight />
              </CodeLine>
              <CodeLine lineNumber={2} revealAtSec={REVEAL.line2}>
                <PyToken text="좌표" kind="name" />
                <PyToken text="[" kind="op" />
                <PyToken text="0" kind="number" />
                <PyToken text="]" kind="op" />
              </CodeLine>
              <CodeLine lineNumber={3} revealAtSec={REVEAL.line3}>
                <PyToken text="좌표" kind="name" />
                <PyToken text="[" kind="op" />
                <PyToken text="1" kind="number" />
                <PyToken text="]" kind="op" />
              </CodeLine>
            </CodePanel>
          </FadeIn>

          <FadeIn delaySec={REVEAL.console} translateY={14}>
            <ConsolePanel title="출력 결과" width={420} height={180}>
              <ConsoleLine revealAtSec={REVEAL.consoleLine1}>
                <span style={{ fontSize: 32, fontWeight: 800, color: colors.darkAccent }}>
                  37.5
                </span>
              </ConsoleLine>
              <ConsoleLine revealAtSec={REVEAL.consoleLine2}>
                <span style={{ fontSize: 32, fontWeight: 800, color: colors.darkAccent }}>
                  127.0
                </span>
              </ConsoleLine>
            </ConsolePanel>
          </FadeIn>
        </div>

        {/* 우측 — TupleBox */}
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TupleBox
            label="좌표 (위도, 경도)"
            values={["37.5", "127.0"]}
            indexLabels
            delaySec={REVEAL.tupleBox}
            width={520}
            height={200}
          />
        </div>
      </div>

      <LowerThird
        text={
          <>
            튜플 —{" "}
            <span style={{ color: colors.accentLight, fontWeight: 700 }}>변경할 수 없는</span> 묶음.{" "}
            <span style={{ fontFamily: fonts.mono, fontWeight: 700 }}>소괄호</span> 사용
          </>
        }
        delaySec={REVEAL.lowerThird}
      />
    </PageBackground>
  );
};
