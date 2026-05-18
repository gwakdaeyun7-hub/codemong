/**
 * Scene 6 — KeyError → `.get()` 안전 표기 (20s)
 *
 * - 0~5s: 좌측 코드 한 줄 `scores["국어"]` type-on. 우측 RedConsole 에 `KeyError: '국어'` fade-in.
 * - 5~10s: 빨간 콘솔 opacity 0.4 로 톤다운. 그 아래 새 코드 `scores.get("국어")` type-on. `.get` violet 강조.
 * - 10~14s: 새 코드 옆 콘솔에 `None` fade-in (회색 글씨). 콘솔 박스는 평범한 회색 외곽.
 * - 14~20s: 화면 하단 좌우 2단 미니카드 — `dict[키]` "키가 _반드시_ 있을 때" / `dict.get(키)` "키가 _없을 수도_ 있을 때". 양쪽 헤더 violet 펄스.
 *
 * 오개념 4번 (KeyError 회피) 정면 처치. `.get()` 두 번째 인자 OUT.
 */

import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import {
  CodeLine,
  CodePanel,
  ConsoleLine,
  ConsolePanel,
  FadeIn,
  LowerThird,
  PageBackground,
  PyToken,
  RedConsole,
} from "../primitives";
import { colors, fonts, radii, shadows } from "../theme";

const REVEAL = {
  panel: 0.3,
  line1: 0.7, // scores["국어"]
  redConsole: 2.5, // KeyError 등장
  redDim: 6.0, // 빨간 콘솔 톤다운 시작
  line2: 6.5, // scores.get("국어")
  console2: 9.0, // None
  miniCardsLabel: 13.5,
  miniCardLeft: 14.0,
  miniCardRight: 14.6,
  headerPulse1: 17.0,
  headerPulse2: 17.7,
  lowerThird: 16.0,
} as const;

/** 좌우 2단 미니 카드 한 개. 헤더가 atSec 에 펄스. */
const MiniCard: React.FC<{
  header: React.ReactNode;
  body: React.ReactNode;
  delaySec: number;
  pulseAtSec: number;
}> = ({ header, body, delaySec, pulseAtSec }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pStart = pulseAtSec * fps;
  const pulse = interpolate(
    frame,
    [pStart, pStart + 0.3 * fps, pStart + 0.8 * fps, pStart + 1.2 * fps],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return (
    <FadeIn delaySec={delaySec} translateY={10}>
      <div
        style={{
          width: 480,
          padding: "20px 28px",
          background: colors.bgWhite,
          border: `1px solid ${colors.border}`,
          borderRadius: radii.card,
          boxShadow: shadows.cardSoft,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <div
          style={{
            display: "inline-block",
            padding: "4px 14px",
            borderRadius: radii.pill,
            background: pulse > 0.1 ? colors.accent : colors.accentSoft,
            color: pulse > 0.1 ? "#ffffff" : colors.accentInk,
            fontFamily: fonts.mono,
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: "-0.01em",
            border: `1.5px solid ${colors.accent}`,
            alignSelf: "flex-start",
            boxShadow: pulse > 0.1 ? "0 0 0 4px rgba(139, 92, 246, 0.18)" : "none",
          }}
        >
          {header}
        </div>
        <div
          style={{
            fontFamily: fonts.sans,
            fontSize: 22,
            fontWeight: 500,
            color: colors.inkSoft,
            letterSpacing: "-0.01em",
          }}
        >
          {body}
        </div>
      </div>
    </FadeIn>
  );
};

export const Scene06: React.FC = () => {
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
              fontWeight: 700,
              color: colors.accentDeep,
              letterSpacing: "0.04em",
            }}
          >
            없는 키 —{" "}
            <span style={{ fontFamily: fonts.mono, fontWeight: 800 }}>KeyError</span> vs{" "}
            <span style={{ fontFamily: fonts.mono, fontWeight: 800 }}>.get()</span>
          </div>
        </FadeIn>
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          padding: "110px 80px 280px",
          gap: 50,
        }}
      >
        {/* 좌측 — 코드 패널 (두 줄: scores["국어"] 와 scores.get("국어")) */}
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <FadeIn delaySec={REVEAL.panel} translateY={20}>
            <CodePanel fileName="scores.py" width={680} height={260}>
              <CodeLine lineNumber={1} revealAtSec={REVEAL.line1}>
                <PyToken text="scores" kind="name" />
                <PyToken text="[" kind="op" />
                <PyToken text={'"국어"'} kind="dictKey" />
                <PyToken text="]" kind="op" />
              </CodeLine>
              <CodeLine lineNumber={2} revealAtSec={REVEAL.line2}>
                <PyToken text="scores" kind="name" />
                <PyToken text="." kind="op" />
                <PyToken text="get" kind="func" highlight />
                <PyToken text="(" kind="op" />
                <PyToken text={'"국어"'} kind="dictKey" />
                <PyToken text=")" kind="op" />
              </CodeLine>
            </CodePanel>
          </FadeIn>
        </div>

        {/* 우측 — RedConsole (KeyError) + None 콘솔 */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 28,
          }}
        >
          <RedConsole
            delaySec={REVEAL.redConsole}
            width={520}
            height={110}
            dimmedAfterSec={REVEAL.redDim}
            message={
              <span style={{ color: "#fca5a5", fontFamily: fonts.mono, fontSize: 26, fontWeight: 700 }}>
                KeyError: <span style={{ color: colors.darkInk }}>{`'국어'`}</span>
              </span>
            }
          />

          <FadeIn delaySec={REVEAL.console2 - 0.3} translateY={14}>
            <ConsolePanel title="출력 결과" width={520} height={110}>
              <ConsoleLine revealAtSec={REVEAL.console2}>
                <span
                  style={{
                    fontSize: 32,
                    fontWeight: 700,
                    color: colors.darkMuted,
                    fontStyle: "italic",
                  }}
                >
                  None
                </span>
              </ConsoleLine>
            </ConsolePanel>
          </FadeIn>
        </div>
      </div>

      {/* 하단 좌우 2단 미니카드 */}
      <div
        style={{
          position: "absolute",
          bottom: 200,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: 40,
        }}
      >
        <MiniCard
          delaySec={REVEAL.miniCardLeft}
          pulseAtSec={REVEAL.headerPulse1}
          header={<span>dict[키]</span>}
          body={
            <>
              키가 <span style={{ color: colors.accentInk, fontWeight: 700 }}>반드시</span> 있을 때
            </>
          }
        />
        <MiniCard
          delaySec={REVEAL.miniCardRight}
          pulseAtSec={REVEAL.headerPulse2}
          header={<span>dict.get(키)</span>}
          body={
            <>
              키가 <span style={{ color: colors.accentInk, fontWeight: 700 }}>없을 수도</span> 있을
              때
            </>
          }
        />
      </div>

      <LowerThird
        text={
          <>
            <span style={{ fontFamily: fonts.mono, color: colors.accentLight }}>.get()</span> — 키
            없을 때 안전한 표기
          </>
        }
        delaySec={REVEAL.lowerThird}
      />
    </PageBackground>
  );
};
