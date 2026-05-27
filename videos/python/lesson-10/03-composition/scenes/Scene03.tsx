/**
 * Scene 3 — `import random` 1단계: 데려오기 (re-synth 2026-05-27, ~20.3s)
 *
 * **lesson-10 시그니처 시각 장치 — 두 단계 시각화의 1단계.**
 *
 * - 0~4s: 좌측 코드 패널 fade-in. 한 줄 `import random` type-on.
 *   `import` / `random` 토큰 violet-300 강조.
 * - 4~9s: 우측 도구 상자 fade-in (delaySec 1.4) — **회색 톤 (state="ready")**.
 *   상자 안 도구 그림자 회색. 코드 옆 빈 콘솔 패널 — 안에 "(아직 결과 없음)" 회색 라벨.
 * - ~11.8~15s (narration "오류가 납니다" 동기, R-016): `import random` 코드 패널
 *   둘레에 **danger(red) 펄스 링** 1회 (EmptyConsoleWithPulse 와 동일 ring 패턴,
 *   opacity 기반 — R-005 무관). 동시에 하단 LowerThird 가 **오류 경고** 문구로 먼저
 *   등장: "이 줄이 없으면 — 오류" (다크 pill, "오류" danger span). → import 가
 *   선택이 아니라 _필수_ 임을 시각으로 박음 (사용자 피드백 2026-05-27).
 * - ~15.6~20s (narration "이 한 줄은 도구를 실행한 게 아니라..." 구간): 오류
 *   LowerThird fade-out → 0.2s buffer (R-002) → 원래 요약 LowerThird
 *   "import — 상자만 데려오기" 로 swap (R-019 nowrap). 빈 콘솔 0.5초 펄스 강조
 *   (도구 미실행 negative space). 상자 위 `준비됨` 라벨 fade-in.
 *
 * R-014 / R-020: 좌측 CodePanel(130) + 우측 ConsolePanel(130) 세로 y 일치
 *   (column 안 alignItems center 자동 정렬).
 */

import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import {
  CodeLine,
  CodePanel,
  ConsolePanel,
  FadeIn,
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
  // 오류 비트 — narration 재배치(2026-05-27)로 "임포트 랜덤" 직후로 당김.
  // 측정값: "오류가 납니다" ≈ 8.2~9.1s, "적어 주세요" 끝 ≈ 11.4s, s6 시작 ≈ 14.8s.
  errorLowerThird: 6.0, // 오류 문장(4.9~9.3s) 시작 즈음 등장
  dangerRing: 7.7, // ring 솔리드 hold = [+0.3, +1.6] = 8.0~9.3s → "오류가 납니다" bracket (R-016)
  errorLowerThirdFadeOut: 11.4, // "꼭 먼저 적어 주세요" 끝나는 시점
  // s6 "이 한 줄은 도구를 실행한 게 아니라..." 구간
  readyLabel: 13.0, // "곁에 옵니다"(상자 도착) 즈음
  summaryLowerThird: 14.8, // errorLT fade(11.8) 후 충분한 buffer (R-002)
  emptyPulse: 15.8, // "도구를 실행한 게 아니라" 발화 즈음
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
          {/* import random 코드 + danger 펄스 링 */}
          <CodePanelWithDangerRing />

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

      {/* LowerThird: 오류 경고 → 요약 swap */}
      <LowerThirdSwapBlock />
    </PageBackground>
  );
};

/**
 * `import random` 코드 패널 + danger(red) 펄스 링.
 * REVEAL.dangerRing 시점에 한 번 펄스 — narration "오류가 납니다" 와 동기(R-016).
 * EmptyConsoleWithPulse 와 동일한 inset -8 ring 패턴 (opacity 기반).
 */
const CodePanelWithDangerRing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pStart = REVEAL.dangerRing * fps;
  const pulse = interpolate(
    frame,
    [pStart, pStart + 0.3 * fps, pStart + 1.6 * fps, pStart + 2.4 * fps],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <div style={{ position: "relative" }}>
      <CodePanel fileName="dice.py" width={720} height={130}>
        <CodeLine lineNumber={1} revealAtSec={REVEAL.line1}>
          <PyToken text="import" kind="keyword" highlight />
          <PyToken text=" " />
          <PyToken text="random" kind="name" highlight />
        </CodeLine>
      </CodePanel>
      {/* danger pulse ring — "이 줄이 없으면 오류" 시각 신호 */}
      <div
        style={{
          position: "absolute",
          inset: -8,
          borderRadius: 18,
          border: `3px solid ${colors.danger}`,
          opacity: pulse,
          pointerEvents: "none",
        }}
      />
    </div>
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

/**
 * LowerThird swap — 오류 경고 ("이 줄이 없으면 — 오류") → 요약 ("import — 상자만 데려오기").
 * R-002: fade-out(15.0~15.4) 완료 후 0.2s buffer 두고 fade-in(15.6). R-019: 두 layer nowrap.
 */
const LowerThirdSwapBlock: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const errStart = REVEAL.errorLowerThird * fps;
  const errEnter = interpolate(frame, [errStart, errStart + 0.5 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const errFadeStart = REVEAL.errorLowerThirdFadeOut * fps;
  const errFadeEnd = errFadeStart + 0.4 * fps;
  const errFade = interpolate(frame, [errFadeStart, errFadeEnd], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const errOpacity = errEnter * errFade;

  const sumStart = REVEAL.summaryLowerThird * fps;
  const sumOpacity = interpolate(frame, [sumStart, sumStart + 0.5 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        bottom: 80,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      <div style={{ position: "relative", height: 56, minWidth: 540 }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            justifyContent: "center",
            opacity: errOpacity,
          }}
        >
          <LowerThirdPill>
            <span>이 줄이 없으면 —</span>
            <span style={{ color: colors.danger, fontWeight: 700 }}>오류</span>
          </LowerThirdPill>
        </div>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            justifyContent: "center",
            opacity: sumOpacity,
          }}
        >
          <LowerThirdPill>
            <span style={{ fontFamily: fonts.mono, color: colors.accentLight }}>
              import
            </span>
            <span>— 상자만 데려오기</span>
          </LowerThirdPill>
        </div>
      </div>
    </div>
  );
};

/** LowerThird pill skeleton (swap layer 공용, R-019 nowrap). */
const LowerThirdPill: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      padding: "14px 28px",
      borderRadius: radii.pill,
      background: "rgba(24, 24, 27, 0.92)",
      color: "#ffffff",
      fontFamily: fonts.sans,
      fontSize: 26,
      fontWeight: 500,
      letterSpacing: "-0.01em",
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      whiteSpace: "nowrap",
      boxShadow:
        "0 4px 24px -8px rgba(24, 24, 27, 0.10), 0 1px 2px rgba(24, 24, 27, 0.04)",
    }}
  >
    {children}
  </div>
);
