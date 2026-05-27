/**
 * Scene 9 — `random.choice` 도입: 가위바위보 (18s)
 *
 * - 0~3s: 좌측 코드 패널 fade-in. `random.choice(["가위", "바위", "보"])` type-on.
 *   `choice` 토큰 violet-300 강조.
 * - 3~9s: 우측 세 카드 (가위 / 바위 / 보) sequential fade-in (0.4초 간격).
 * - 9~14s: 한 카드(`"바위"`) 가 떠올라 강조 (delaySec 3.4s = 6.4s, translateY -30,
 *   scale 1.1). 그 카드에서 호출 자리 옆으로 FlowArrow (strokeWidth 6).
 *   코드 옆 콘솔에 결과 `"바위"` (fontSize 30, R-001).
 * - 14~18s: LowerThird: "`random.choice(목록)` — _목록에서 하나_".
 */

import React from "react";
import {
  CodeLine,
  CodePanel,
  ConsoleLine,
  ConsolePanel,
  FadeIn,
  FlowArrow,
  LowerThird,
  PageBackground,
  PyToken,
  RPSCard,
} from "../primitives";
import { colors, fonts } from "../theme";

const REVEAL = {
  header: 0.1,
  codePanel: 0.3,
  importLine: 0.7, // import random (context, 회색 강조 X)
  line1: 0.9,
  card1: 3.2, // 가위
  card2: 3.6, // 바위
  card3: 4.0, // 보
  cardLift: 6.4, // 바위 떠오름
  flowArrowReturn: 8.0,
  console: 9.2,
  lowerThird: 14.0,
} as const;

export const Scene09: React.FC = () => {
  return (
    <PageBackground>
      {/* 상단 헤더 */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 0,
          right: 0,
          textAlign: "center",
        }}
      >
        <FadeIn delaySec={REVEAL.header} translateY={6}>
          <div
            style={{
              fontFamily: fonts.sans,
              fontSize: 28,
              fontWeight: 700,
              color: colors.accentDeep,
              letterSpacing: "-0.01em",
            }}
          >
            <span style={{ fontFamily: fonts.mono, fontWeight: 800 }}>
              random.choice
            </span>{" "}
            — 목록에서 하나
          </div>
        </FadeIn>
      </div>

      {/* 좌·우 분할 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          padding: "150px 96px 160px",
          gap: 50,
        }}
      >
        {/* 좌측 — 코드 + 콘솔 */}
        <FadeIn
          delaySec={REVEAL.codePanel}
          translateY={20}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 30,
          }}
        >
          <CodePanel fileName="rps.py" width={720} height={180}>
            <CodeLine lineNumber={1} revealAtSec={REVEAL.importLine}>
              <PyToken text="import" kind="keyword" />
              <PyToken text=" " />
              <PyToken text="random" kind="name" />
            </CodeLine>
            <CodeLine lineNumber={2} revealAtSec={REVEAL.line1}>
              <PyToken text="random" kind="name" />
              <PyToken text="." kind="op" />
              <PyToken text="choice" kind="func" highlight />
              <PyToken text="([" kind="op" />
              <PyToken text={'"가위"'} kind="string" />
              <PyToken text=", " kind="op" />
              <PyToken text={'"바위"'} kind="string" />
              <PyToken text=", " kind="op" />
              <PyToken text={'"보"'} kind="string" />
              <PyToken text="])" kind="op" />
            </CodeLine>
          </CodePanel>

          <ConsolePanel title="출력 결과" width={400} height={100}>
            <ConsoleLine revealAtSec={REVEAL.console}>
              <span
                style={{
                  fontFamily: fonts.mono,
                  fontSize: 30,
                  fontWeight: 800,
                  color: colors.syntaxString,
                }}
              >
                "바위"
              </span>
            </ConsoleLine>
          </ConsolePanel>
        </FadeIn>

        {/* 우측 — 세 카드 + 떠오르는 강조 */}
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 28,
          }}
        >
          <RPSCard choice="가위" delaySec={REVEAL.card1} size={170} />
          <RPSCard
            choice="바위"
            delaySec={REVEAL.card2}
            liftAtSec={REVEAL.cardLift}
            size={170}
          />
          <RPSCard choice="보" delaySec={REVEAL.card3} size={170} />
        </div>
      </div>

      {/* FlowArrow overlay — 바위 카드 → 콘솔 */}
      <div
        style={{
          position: "absolute",
          left: 96,
          right: 96,
          top: 360,
          height: 320,
          pointerEvents: "none",
        }}
      >
        <FlowArrow
          startX={1080}
          startY={120}
          endX={300}
          endY={255}
          curve={70}
          delaySec={REVEAL.flowArrowReturn}
          durationSec={0.7}
          strokeWidth={6}
          color={colors.accent}
          width={1300}
          height={320}
        />
      </div>

      <LowerThird
        text={
          <>
            <span style={{ fontFamily: fonts.mono, color: colors.accentLight }}>
              random.choice(목록)
            </span>{" "}
            — 목록에서 하나
          </>
        }
        delaySec={REVEAL.lowerThird}
      />
    </PageBackground>
  );
};
