/**
 * Scene 10 — `break` vs `continue` 나란히 비교 (22s)
 *
 * 학습 목표 5번 + 오개념 4번 (break/continue 혼동) 정면 처치.
 *
 * - 0~3s: 좌상단 라벨 카드 "비교 — `break` vs `continue`"
 * - 3~12s: 화면 좌우 분할, 양쪽 코드 패널 4줄씩 type-on (각 1초)
 *     좌측 (break 버전):
 *       for i in range(5):
 *           if i == 3:
 *               break
 *           print(i)
 *     우측 (continue 버전):
 *       for i in range(5):
 *           if i == 3:
 *               continue
 *           print(i)
 *     `break`/`continue` 토큰만 violet-500 강조 (다른 모든 부분 동일)
 * - 12~18s: 양쪽 코드 아래 콘솔 패널 fade-in
 *     좌측: `0` `1` `2` 한 줄씩 (각 0.5초). 마지막 작은 라벨 "여기서 끝"
 *     우측: `0` `1` `2` `4` 한 줄씩. `3` 자리에 회색 점선 박스 (...) + 라벨 "3만 건너뜀"
 * - 18~22s: 콘솔 결과 차이가 한 번 펄스. lower-third "`break` = 아예 빠져나감 · `continue` = 이번 바퀴만 건너뜀"
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
} from "../primitives";
import { colors, fonts, radii, shadows } from "../theme";

const REVEAL = {
  topLabel: 0.2,
  panelFade: 1.2,
  line1: 1.8,
  line2: 2.8,
  line3: 3.8,
  line4: 4.8,
  consoleFade: 12.0,
  console0: 12.5,
  console1: 13.0,
  console2: 13.5,
  console3: 14.0, // continue 만 (4)
  endLabel: 14.8,
  pulse: 17.0,
  lowerThird: 18.0,
} as const;

/** 콘솔 결과가 한 번 펄스 (외곽선 violet 으로 깜빡). */
const PulseRing: React.FC<{ delaySec: number }> = ({ delaySec }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = delaySec * fps;
  const opacity = interpolate(
    frame,
    [start, start + 0.3 * fps, start + 0.9 * fps, start + 1.4 * fps],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return (
    <div
      style={{
        position: "absolute",
        inset: -6,
        borderRadius: 16,
        border: `3px solid ${colors.accent}`,
        opacity,
        pointerEvents: "none",
        boxShadow: "0 0 0 4px rgba(139, 92, 246, 0.18)",
      }}
    />
  );
};

const SidePanel: React.FC<{
  keyword: "break" | "continue";
  consoleLines: { text: string; sec: number }[];
  showSkipPlaceholder?: boolean;
  endLabel: { text: string; color: string };
}> = ({ keyword, consoleLines, showSkipPlaceholder = false, endLabel }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 24,
      }}
    >
      <FadeIn delaySec={REVEAL.panelFade} translateY={18}>
        <CodePanel fileName={`${keyword}.py`} width={600} height={300}>
          <CodeLine lineNumber={1} revealAtSec={REVEAL.line1}>
            <PyToken text="for" kind="keyword" />
            <PyToken text=" " />
            <PyToken text="i" kind="name" />
            <PyToken text=" " />
            <PyToken text="in" kind="keyword" />
            <PyToken text=" " />
            <PyToken text="range" kind="func" />
            <PyToken text="(" kind="op" />
            <PyToken text="5" kind="number" />
            <PyToken text=")" kind="op" />
            <PyToken text=":" kind="op" />
          </CodeLine>
          <CodeLine lineNumber={2} revealAtSec={REVEAL.line2}>
            <PyToken text="    " />
            <PyToken text="if" kind="keyword" />
            <PyToken text=" " />
            <PyToken text="i" kind="name" />
            <PyToken text=" " />
            <PyToken text="==" kind="op" />
            <PyToken text=" " />
            <PyToken text="3" kind="number" />
            <PyToken text=":" kind="op" />
          </CodeLine>
          <CodeLine lineNumber={3} revealAtSec={REVEAL.line3}>
            <PyToken text="        " />
            <PyToken text={keyword} kind="keyword" highlight />
          </CodeLine>
          <CodeLine lineNumber={4} revealAtSec={REVEAL.line4}>
            <PyToken text="    " />
            <PyToken text="print" kind="func" />
            <PyToken text="(" kind="op" />
            <PyToken text="i" kind="name" />
            <PyToken text=")" kind="op" />
          </CodeLine>
        </CodePanel>
      </FadeIn>

      {/* 콘솔 + 펄스 */}
      <div style={{ position: "relative" }}>
        <FadeIn delaySec={REVEAL.consoleFade} translateY={14}>
          <ConsolePanel title="출력 결과" width={420} height={240}>
            {consoleLines.map((line, idx) => (
              <ConsoleLine key={idx} revealAtSec={line.sec}>
                <span
                  style={{
                    fontSize: 36,
                    fontWeight: 800,
                    color: colors.darkInk,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {line.text}
                </span>
              </ConsoleLine>
            ))}
            {showSkipPlaceholder ? (
              // 3 자리에 회색 점선 박스
              <FadeIn delaySec={REVEAL.console2 + 0.3} translateY={4}>
                <div
                  style={{
                    display: "inline-block",
                    padding: "0 12px",
                    border: `1.5px dashed ${colors.darkMuted}`,
                    borderRadius: 6,
                    fontFamily: fonts.mono,
                    fontSize: 24,
                    fontWeight: 600,
                    color: colors.darkMuted,
                    letterSpacing: "0.1em",
                    marginTop: 2,
                  }}
                >
                  ···
                </div>
              </FadeIn>
            ) : null}
          </ConsolePanel>
        </FadeIn>
        <PulseRing delaySec={REVEAL.pulse} />
      </div>

      {/* 결과 라벨 */}
      <FadeIn delaySec={REVEAL.endLabel} translateY={6}>
        <div
          style={{
            padding: "8px 20px",
            borderRadius: radii.pill,
            background: colors.bgWhite,
            border: `1.5px solid ${endLabel.color}`,
            color: endLabel.color,
            fontFamily: fonts.sans,
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: "-0.01em",
            boxShadow: shadows.cardSoft,
          }}
        >
          {endLabel.text}
        </div>
      </FadeIn>
    </div>
  );
};

export const Scene10: React.FC = () => {
  return (
    <PageBackground>
      {/* 좌상단 라벨 카드 */}
      <div
        style={{
          position: "absolute",
          top: 50,
          left: 96,
        }}
      >
        <FadeIn delaySec={REVEAL.topLabel} translateY={6}>
          <div
            style={{
              padding: "10px 22px",
              borderRadius: radii.pill,
              background: colors.accentSoft,
              color: colors.accentInk,
              fontFamily: fonts.sans,
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: "-0.01em",
              border: `1.5px solid ${colors.accent}`,
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              boxShadow: shadows.cardSoft,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: colors.accent,
              }}
            />
            비교 —{" "}
            <span style={{ fontFamily: fonts.mono }}>break</span> vs{" "}
            <span style={{ fontFamily: fonts.mono }}>continue</span>
          </div>
        </FadeIn>
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "150px 60px 140px",
          gap: 60,
        }}
      >
        {/* 좌측 — break */}
        <SidePanel
          keyword="break"
          consoleLines={[
            { text: "0", sec: REVEAL.console0 },
            { text: "1", sec: REVEAL.console1 },
            { text: "2", sec: REVEAL.console2 },
          ]}
          endLabel={{ text: "여기서 끝", color: colors.accentDeep }}
        />

        {/* 우측 — continue */}
        <SidePanel
          keyword="continue"
          consoleLines={[
            { text: "0", sec: REVEAL.console0 },
            { text: "1", sec: REVEAL.console1 },
            { text: "2", sec: REVEAL.console2 },
            { text: "4", sec: REVEAL.console3 },
          ]}
          showSkipPlaceholder
          endLabel={{ text: "3만 건너뜀", color: colors.accentDeep }}
        />
      </div>

      <LowerThird
        text={
          <>
            <span style={{ fontFamily: fonts.mono, color: colors.accentLight }}>break</span>
            {" = 아예 빠져나감 · "}
            <span style={{ fontFamily: fonts.mono, color: colors.accentLight }}>continue</span>
            {" = 이번 바퀴만 건너뜀"}
          </>
        }
        delaySec={REVEAL.lowerThird}
      />
    </PageBackground>
  );
};
