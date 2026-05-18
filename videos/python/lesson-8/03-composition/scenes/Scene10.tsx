/**
 * Scene 10 — `set` 인덱스 접근 X + 진짜 가치 (14s)
 *
 * - 0~5s: 좌측 코드 `수강과목[0]` type-on. 우측 RedConsole — `TypeError: 'set' object is not subscriptable`.
 * - 5~9s: 빨간 콘솔 톤다운. 좌측 코드 아래 새 줄 `"수학" in 수강과목` type-on. 우측 콘솔에 `True` fade-in.
 *         `True` 글씨 violet 펄스.
 * - 9~14s: 하단 좌우 2단 카드 — ✓ "중복 자동 제거" / ✓ "안에 있는지 빠르게 묻기".
 *
 * 오개념 3번 (셋 = 중복 없는 리스트로만 생각) 정면 처치. 순서 보장 X 한 줄.
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
import { colors, fonts, radii } from "../theme";

const REVEAL = {
  codePanel: 0.3,
  line1: 0.7, // 수강과목[0]
  redConsole: 2.5,
  redDim: 5.0,
  line2: 5.5, // "수학" in 수강과목
  console2: 7.5, // True
  truePulse: 8.5,
  valueCard1: 9.5,
  valueCard2: 10.1,
  lowerThird: 10.5,
} as const;

/** True 박스 펄스 */
const TruePulse: React.FC<{ atSec: number }> = ({ atSec }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = atSec * fps;
  const opacity = interpolate(
    frame,
    [start, start + 0.3 * fps, start + 0.8 * fps, start + 1.3 * fps],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return (
    <div
      style={{
        position: "absolute",
        inset: -6,
        borderRadius: 14,
        border: `3px solid ${colors.accent}`,
        opacity,
        pointerEvents: "none",
      }}
    />
  );
};

/** 가치 카드 (✓ + 라벨) */
const ValueCard: React.FC<{
  text: React.ReactNode;
  delaySec: number;
}> = ({ text, delaySec }) => {
  return (
    <FadeIn delaySec={delaySec} translateY={10}>
      <div
        style={{
          width: 440,
          padding: "18px 28px",
          background: colors.accentSoft,
          border: `1.5px solid ${colors.accent}`,
          borderRadius: radii.card,
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <span
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: colors.accent,
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            fontWeight: 800,
            flexShrink: 0,
          }}
        >
          ✓
        </span>
        <span
          style={{
            fontFamily: fonts.sans,
            fontSize: 24,
            fontWeight: 700,
            color: colors.accentInk,
            letterSpacing: "-0.01em",
          }}
        >
          {text}
        </span>
      </div>
    </FadeIn>
  );
};

export const Scene10: React.FC = () => {
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
              textTransform: "uppercase",
            }}
          >
            셋의 진짜 가치
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
        {/* 좌측 — 코드 패널 */}
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <FadeIn delaySec={REVEAL.codePanel} translateY={20}>
            <CodePanel fileName="subjects.py" width={680} height={220}>
              <CodeLine lineNumber={1} revealAtSec={REVEAL.line1}>
                <PyToken text="수강과목" kind="name" />
                <PyToken text="[" kind="op" />
                <PyToken text="0" kind="number" />
                <PyToken text="]" kind="op" />
              </CodeLine>
              <CodeLine lineNumber={2} revealAtSec={REVEAL.line2}>
                <PyToken text={'"수학"'} kind="string" />
                <PyToken text=" " />
                <PyToken text="in" kind="keyword" highlight />
                <PyToken text=" " />
                <PyToken text="수강과목" kind="name" />
              </CodeLine>
            </CodePanel>
          </FadeIn>
        </div>

        {/* 우측 — RedConsole + True 콘솔 */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 24,
            alignItems: "center",
          }}
        >
          <RedConsole
            delaySec={REVEAL.redConsole}
            width={540}
            height={110}
            dimmedAfterSec={REVEAL.redDim}
            message={
              <span
                style={{
                  color: "#fca5a5",
                  fontFamily: fonts.mono,
                  fontSize: 20,
                  fontWeight: 600,
                  lineHeight: 1.4,
                }}
              >
                TypeError: <span style={{ color: colors.darkInk }}>{`'set' object is not subscriptable`}</span>
              </span>
            }
          />

          <div style={{ position: "relative" }}>
            <FadeIn delaySec={REVEAL.console2 - 0.3} translateY={14}>
              <ConsolePanel title="출력 결과" width={540} height={110}>
                <ConsoleLine revealAtSec={REVEAL.console2}>
                  <span
                    style={{
                      fontSize: 36,
                      fontWeight: 800,
                      color: colors.darkAccent,
                    }}
                  >
                    True
                  </span>
                </ConsoleLine>
              </ConsolePanel>
            </FadeIn>
            <TruePulse atSec={REVEAL.truePulse} />
          </div>
        </div>
      </div>

      {/* 하단 가치 카드 2단 */}
      <div
        style={{
          position: "absolute",
          bottom: 200,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: 24,
        }}
      >
        <ValueCard text="중복 자동 제거" delaySec={REVEAL.valueCard1} />
        <ValueCard text="안에 있는지 빠르게 묻기" delaySec={REVEAL.valueCard2} />
      </div>

      <LowerThird
        text={
          <>
            셋은 <span style={{ color: colors.accentLight, fontWeight: 700 }}>순서가 없음</span> —
            번호로 못 꺼냄
          </>
        }
        delaySec={REVEAL.lowerThird}
      />
    </PageBackground>
  );
};
