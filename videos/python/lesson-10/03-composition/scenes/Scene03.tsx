/**
 * Scene 3 — `import random` 1단계: 데려오기 (14s)
 *
 * **lesson-10 시그니처 시각 장치 — 두 단계 시각화의 1단계.**
 *
 * - 0~4s: 좌측 코드 패널 fade-in. 한 줄 `import random` type-on (1.5초).
 *   `import` / `random` 토큰 violet-300 강조.
 * - 4~9s: 우측 도구 상자 fade-in (delaySec 1.4) — **회색 톤 (state="ready")**.
 *   상자 안 도구 그림자 회색. 코드 옆 빈 콘솔 패널 fade-in — 안에 "(아직 결과 없음)" 회색 라벨.
 * - 9~12s: 빈 콘솔 영역이 0.5초 펄스 강조 (학습자 negative-space 인지).
 *   도구 상자 위에 `준비됨` 작은 회색 라벨 fade-in.
 * - 12~14s: LowerThird fade-in (delaySec 12.4): "`import` — _상자만_ 데려오기".
 *
 * R-014 / R-020: 좌측 CodePanel + 우측 ConsolePanel 의 세로 y 일치
 *   — 두 panel 모두 height: 200 (column 안 alignItems center 자동 정렬).
 */

import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import {
  CodeLine,
  CodePanel,
  ConsolePanel,
  FadeIn,
  LowerThird,
  PageBackground,
  PyToken,
  ToolBox,
} from "../primitives";
import { colors, fonts, radii } from "../theme";

const REVEAL = {
  codePanel: 0.2,
  line1: 0.8, // import random type-on 시작
  toolBox: 1.4,
  emptyConsole: 1.4,
  emptyPulse: 9.0,
  readyLabel: 10.0,
  lowerThird: 12.4,
} as const;

export const Scene03: React.FC = () => {
  return (
    <PageBackground>
      {/* 상단 헤더 라벨 */}
      <div
        style={{
          position: "absolute",
          top: 60,
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
            1단계 — 상자를 데려오기
          </div>
        </FadeIn>
      </div>

      {/* 좌·우 분할 — 코드 + 콘솔 / 도구 상자 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          padding: "150px 96px 140px",
          gap: 60,
        }}
      >
        {/* 좌측 — 코드 + 빈 콘솔 (column 안 세로 정렬) */}
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
          <CodePanel fileName="dice.py" width={720} height={130}>
            <CodeLine lineNumber={1} revealAtSec={REVEAL.line1}>
              <PyToken text="import" kind="keyword" highlight />
              <PyToken text=" " />
              <PyToken text="random" kind="name" highlight />
            </CodeLine>
          </CodePanel>

          {/* 빈 콘솔 (회색 톤) */}
          <EmptyConsoleWithPulse />
        </FadeIn>

        {/* 우측 — 회색 도구 상자 + `준비됨` 라벨 */}
        <FadeIn
          delaySec={REVEAL.toolBox}
          translateY={16}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
          }}
        >
          <ToolBox
            state="ready"
            width={360}
            height={220}
            delaySec={0}
          />
          {/* `준비됨` 라벨 */}
          <FadeIn delaySec={REVEAL.readyLabel - REVEAL.toolBox} translateY={6}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                height: 36,
                lineHeight: 1,
                padding: "0 18px",
                borderRadius: radii.pill,
                background: colors.bgWhite,
                border: `1.5px solid ${colors.inkSubtle}`,
                color: colors.inkMuted,
                fontFamily: fonts.sans,
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: "-0.01em",
                whiteSpace: "nowrap",
              }}
            >
              준비됨
            </div>
          </FadeIn>
        </FadeIn>
      </div>

      <LowerThird
        text={
          <>
            <span style={{ fontFamily: fonts.mono, color: colors.accentLight }}>
              import
            </span>{" "}
            — 상자만 데려오기
          </>
        }
        delaySec={REVEAL.lowerThird}
      />
    </PageBackground>
  );
};

/** 빈 콘솔 패널 — REVEAL.emptyPulse 시점에 한 번 펄스. */
const EmptyConsoleWithPulse: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pStart = REVEAL.emptyPulse * fps;
  const pulse = interpolate(
    frame,
    [pStart, pStart + 0.25 * fps, pStart + 0.6 * fps, pStart + 1.0 * fps],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <div style={{ position: "relative" }}>
      <ConsolePanel title="출력 결과" width={300} height={130}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            color: colors.darkMuted,
            fontFamily: fonts.sans,
            fontSize: 22,
            fontWeight: 500,
            fontStyle: "italic",
            opacity: 0.65,
          }}
        >
          (아직 결과 없음)
        </div>
      </ConsolePanel>
      {/* pulse ring */}
      <div
        style={{
          position: "absolute",
          inset: -8,
          borderRadius: 18,
          border: `3px solid ${colors.accent}`,
          opacity: pulse,
          pointerEvents: "none",
        }}
      />
    </div>
  );
};
