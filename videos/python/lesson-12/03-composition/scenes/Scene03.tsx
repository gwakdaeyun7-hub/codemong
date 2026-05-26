/**
 * Scene 3 — NameError: 마지막 줄부터 아래에서 위로 읽기 (26s placeholder)
 *
 * 00-objectives §4 오개념 2 (위에서부터 읽다 길 잃음) + 학습목표 1·3 핵심 처치.
 * 읽는 _방향_ 을 아래→위 화살표로 박는 것이 이 컷의 핵심 시각 장치.
 *
 * - 0~5s: scene-02 Traceback 박스가 좌측으로 (width 920). 윗줄 두 줄 흐림(0.4).
 * - 5~13s: 박스 우측 UpArrow (delaySec 1.4, strokeWidth 6, length 240 — R-012).
 *          맨 아래 `NameError` 줄 노란 full 강조 (2.0) + "① 무슨 에러".
 *          `line 3` 토큰 partial 강조 (3.6) + "② 몇 번째 줄".
 * - 13~20s: 우측 코드 패널 (delaySec 5.0). `scroe` 빨간 강조 + 말풍선
 *           "score 인데 scroe?" (7.4 — wrapper-relative, R-022).
 * - 20~25s: `scroe` → `score` letter swap (8.0, R-002 buffer). 초록 ✓ (9.2,
 *           패널 안쪽 inset right 24 — R-024). LowerThird (9.6).
 *
 * R-012 / R-016 / R-022 / R-024 / R-002 충족.
 */

import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import {
  CheckMark,
  CodeLine,
  CodePanel,
  FadeIn,
  LowerThird,
  PageBackground,
  PyToken,
  SwapLabel,
  TokenWithBubble,
  TraceLine,
  TracebackBox,
  UpArrow,
} from "../primitives";
import { colors, fonts, radii } from "../theme";

const REVEAL = {
  boxMove: 0.2,
  upArrow: 1.4,
  errHighlight: 2.0, // narration "맨 마지막 줄부터" ~5.5s
  errLabel: 2.4,
  lineHighlight: 3.6, // narration "라인 쓰리" ~9s
  lineLabel: 4.0,
  codePanel: 5.0,
  scroeHighlight: 6.4,
  bubble: 7.4, // narration "스코어를 스크로라고 잘못 쳤네요" ~15s
  swapOldFadeOut: 8.0,
  swapNewFadeIn: 8.6, // 0.2s buffer (R-002)
  checkMark: 9.2,
  lowerThird: 9.6,
} as const;

export const Scene03: React.FC = () => {
  return (
    <PageBackground>
      {/* 상단 라벨 */}
      <div
        style={{
          position: "absolute",
          top: 64,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <FadeIn delaySec={0.1} translateY={6}>
          <div
            style={{
              padding: "8px 24px",
              borderRadius: radii.pill,
              background: colors.accentSoft,
              color: colors.accentInk,
              border: `1.5px solid ${colors.accent}`,
              fontFamily: fonts.sans,
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: "-0.01em",
            }}
          >
            에러는 아래에서 위로
          </div>
        </FadeIn>
      </div>

      {/* 메인 row — [Traceback] [중간 컬럼: ② / UpArrow / ①] [코드 패널] */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 380,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 44,
        }}
      >
        {/* 좌측 — Traceback 박스 */}
        <FadeIn delaySec={REVEAL.boxMove} translateY={0}>
          <TracebackBox width={820}>
            <TraceLine revealAtSec={REVEAL.boxMove} dimmed>
              {`Traceback (most recent call last):`}
            </TraceLine>
            <TraceLine revealAtSec={REVEAL.boxMove} dimmed>
              {`  File "main.py", line 3, in <module>`}
            </TraceLine>
            <TraceLine revealAtSec={REVEAL.boxMove} style={{ paddingLeft: 24 }}>
              <span style={{ color: colors.syntaxFunc }}>print</span>
              <span style={{ color: colors.traceMuted }}>(</span>
              <span style={{ color: colors.traceInk }}>scroe</span>
              <span style={{ color: colors.traceMuted }}>)</span>
            </TraceLine>
            <TraceLine
              revealAtSec={REVEAL.boxMove}
              highlightAtSec={REVEAL.errHighlight}
              highlightStrength="full"
            >
              <span style={{ color: colors.traceErrName, fontWeight: 800 }}>NameError</span>
              <span>{`: name 'scroe' is not defined`}</span>
            </TraceLine>
          </TracebackBox>
        </FadeIn>

        {/* 중간 컬럼 — ② 라벨 (위) / UpArrow / ① 라벨 (아래) */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 14,
            width: 150,
            flexShrink: 0,
          }}
        >
          <OrderLabel num="②" text="몇 번째 줄" delaySec={REVEAL.lineLabel} />
          <UpArrow length={200} strokeWidth={6} delaySec={REVEAL.upArrow} uid="s03-read" />
          <OrderLabel num="①" text="무슨 에러" delaySec={REVEAL.errLabel} />
        </div>

        {/* 우측 — 원인 코드 패널 */}
        <div style={{ position: "relative" }}>
          <FadeIn delaySec={REVEAL.codePanel} translateY={16}>
            <CodePanel fileName="main.py" width={560} height={220} style={{ overflow: "visible" }}>
              <CodeLine lineNumber={1} revealAtSec={REVEAL.codePanel}>
                <PyToken text="score" kind="name" /> <PyToken text="=" kind="op" />{" "}
                <PyToken text="90" kind="number" />
              </CodeLine>
              <CodeLine lineNumber={2} revealAtSec={REVEAL.codePanel + 0.2}>
                <PyToken text="print" kind="func" />
                <PyToken text="(" kind="op" />
                <PyToken text={`"내 점수:"`} kind="string" />
                <PyToken text=")" kind="op" />
              </CodeLine>
              <CodeLine lineNumber={3} revealAtSec={REVEAL.codePanel + 0.4}>
                <PyToken text="print" kind="func" />
                <PyToken text="(" kind="op" />
                <ScroeToScoreSwap />
                <PyToken text=")" kind="op" />
              </CodeLine>
            </CodePanel>
          </FadeIn>

          {/* 교정 후 초록 ✓ (패널 안쪽 inset right 24 — R-024) */}
          <div style={{ position: "absolute", bottom: 22, right: 24 }}>
            <CheckMark size={40} delaySec={REVEAL.checkMark} variant="green" />
          </div>
        </div>
      </div>

      <LowerThird
        text={
          <span>
            에러는{" "}
            <span style={{ color: colors.accentLight, fontWeight: 700 }}>아래에서 위로</span> —{" "}
            <span style={{ color: colors.highlightYellow, fontWeight: 700 }}>마지막 줄</span> →{" "}
            줄 번호
          </span>
        }
        delaySec={REVEAL.lowerThird}
      />
    </PageBackground>
  );
};

/** ①/② 순서 라벨 (작은 accent 칩) */
const OrderLabel: React.FC<{ num: string; text: string; delaySec: number }> = ({
  num,
  text,
  delaySec,
}) => {
  return (
    <FadeIn delaySec={delaySec} translateY={6}>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "6px 14px",
          borderRadius: radii.pill,
          background: colors.bgWhite,
          border: `1.5px solid ${colors.accent}`,
          fontFamily: fonts.sans,
          fontSize: 22,
          fontWeight: 700,
          color: colors.accentInk,
          whiteSpace: "nowrap",
          boxShadow: "0 2px 10px -4px rgba(124, 58, 237, 0.35)",
        }}
      >
        <span style={{ fontSize: 24 }}>{num}</span>
        {text}
      </div>
    </FadeIn>
  );
};

/** `scroe` (빨간 강조 + 말풍선) → `score` letter swap */
const ScroeToScoreSwap: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // scroe 빨간 강조 등장
  const hiStart = REVEAL.scroeHighlight * fps;
  const hi = interpolate(frame, [hiStart, hiStart + 0.3 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <SwapLabel
      oldFadeOutAtSec={REVEAL.swapOldFadeOut}
      newFadeInAtSec={REVEAL.swapNewFadeIn}
      fadeDurationSec={0.4}
      initial={
        <TokenWithBubble
          bubble={
            <span>
              <span style={{ fontFamily: fonts.mono, color: colors.accentInk }}>score</span> 인데{" "}
              <span style={{ fontFamily: fonts.mono, color: colors.dangerRedDeep }}>scroe</span>?
            </span>
          }
          bubbleDelaySec={REVEAL.bubble}
          offsetY={16}
        >
          <span
            style={{
              display: "inline-block",
              color: colors.traceInk,
              borderBottom: hi > 0.05 ? `3px solid ${colors.dangerRed}` : "3px solid transparent",
              background: hi > 0.05 ? "rgba(220, 38, 38, 0.18)" : "transparent",
              borderRadius: 3,
              padding: "0 2px",
              whiteSpace: "nowrap",
            }}
          >
            scroe
          </span>
        </TokenWithBubble>
      }
      newLabel={
        <span
          style={{
            display: "inline-block",
            color: colors.syntaxNumber,
            background: "rgba(52, 211, 153, 0.18)",
            borderRadius: 3,
            padding: "0 2px",
            whiteSpace: "nowrap",
          }}
        >
          score
        </span>
      }
    />
  );
};
