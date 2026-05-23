/**
 * Scene 4 — `random.randint(1, 6)` 2단계: 실제로 쓰기 (시그니처 컷, 18s)
 *
 * **lesson-10 시그니처 시각 장치 — 두 단계 시각화의 2단계.**
 *
 * - 0~4s: scene-03 의 코드 패널 유지 (import random). 한 줄 더 type-on:
 *   `random.randint(1, 6)` (2초). 줄 전체 violet 잠깐 강조 → 평소 색 복귀.
 * - 4~9s: 우측 도구 상자 **회색 → 정상색 변환** (ToolBox state="active",
 *   activeAtSec ≈ 4.6, 색 보간 0.6s). 동시에 상자에서 호출 자리로
 *   곡선 화살표 (FlowArrow, strokeWidth 6).
 * - 9~14s: 콘솔에 결과 `4` type-on (fontSize 30 = ConsoleLine 본문 비율 1.0×,
 *   R-001 준수). 옆에 "(매번 다른 값)" 회색 라벨.
 * - 14~18s: LowerThird swap (oldFadeOut → 0.2s buffer → newFadeIn, R-002):
 *   scene-03 의 "import — 상자만" → "도구를 실제로 쓰려면 — 점 찍고 이름을 불러야".
 *   상자 위 `준비됨` 라벨 → `실행됨` swap (SwapLabel, R-019 nowrap 강제).
 *
 * R-014: 좌측 column = code 130 + gap 30 + console 130 = 290.
 *   우측 column = toolbox 220 + gap 20 + label 36 = 276. y center 정렬로 충분.
 * R-016: 도구 상자 색 변환 시점이 narration "도구를 실제로 쓰려면" 발화와 동기.
 */

import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import {
  CodeLine,
  CodePanel,
  ConsoleLine,
  ConsolePanel,
  FadeIn,
  FlowArrow,
  PageBackground,
  PyToken,
  SwapLabel,
  ToolBox,
} from "../primitives";
import { colors, fonts, radii } from "../theme";

const REVEAL = {
  codePanel: 0.2,
  line1: 0.4, // import random (scene-03 carry-over, 빠르게)
  line2: 1.8, // random.randint(1, 6) type-on
  line2HighlightEnd: 4.0,
  toolBoxActiveStart: 4.6, // 회색 → 정상색 변환 시작
  flowArrowCall: 5.0, // 도구 꺼냄 화살표 (상자 → 호출)
  flowArrowReturn: 8.4, // 결과 되돌아옴 화살표 (호출 → 콘솔)
  consoleResult: 9.4, // 콘솔에 `4` type-on
  variabilityLabel: 11.0,
  // SwapLabel (`준비됨` → `실행됨`)
  readyToActiveOldFadeOut: 4.6,
  readyToActiveNewFadeIn: 5.0, // 0.2s buffer (R-002)
  // LowerThird swap
  lowerThirdOld: 0.6, // scene-03 carry-over 라벨
  lowerThirdOldFadeOut: 13.8,
  lowerThirdNew: 14.2, // 0.2s buffer
} as const;

export const Scene04: React.FC = () => {
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
            2단계 — 도구를 실제로 쓰기
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
          padding: "150px 96px 200px",
          gap: 60,
        }}
      >
        {/* 좌측 — 코드 (두 줄) + 콘솔 */}
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
          <CodePanel fileName="dice.py" width={720} height={180}>
            <CodeLine lineNumber={1} revealAtSec={REVEAL.line1}>
              <PyToken text="import" kind="keyword" />
              <PyToken text=" " />
              <PyToken text="random" kind="name" />
            </CodeLine>
            <CodeLine
              lineNumber={2}
              revealAtSec={REVEAL.line2}
              highlighted
              highlightDurationSec={REVEAL.line2HighlightEnd - REVEAL.line2}
            >
              <PyToken text="random" kind="name" />
              <PyToken text="." kind="op" />
              <PyToken text="randint" kind="func" />
              <PyToken text="(" kind="op" />
              <PyToken text="1" kind="number" />
              <PyToken text=", " kind="op" />
              <PyToken text="6" kind="number" />
              <PyToken text=")" kind="op" />
            </CodeLine>
          </CodePanel>

          {/* 결과 콘솔 */}
          <FadeIn delaySec={REVEAL.consoleResult - 0.3} translateY={10}>
            <ConsolePanel title="출력 결과" width={400} height={110}>
              <ConsoleLine revealAtSec={REVEAL.consoleResult}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 18,
                  }}
                >
                  <span
                    style={{
                      color: colors.darkAccent,
                      fontSize: 30,
                      fontWeight: 800,
                      fontFamily: fonts.mono,
                    }}
                  >
                    4
                  </span>
                  <VariabilityLabel />
                </span>
              </ConsoleLine>
            </ConsolePanel>
          </FadeIn>
        </FadeIn>

        {/* 우측 — 도구 상자 + 상태 라벨 swap + 화살표 */}
        <FadeIn
          delaySec={REVEAL.codePanel}
          translateY={16}
          style={{
            flex: 1,
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
          }}
        >
          <ToolBox
            state="active"
            activeAtSec={REVEAL.toolBoxActiveStart}
            activeDurationSec={0.6}
            width={360}
            height={220}
            delaySec={0}
          />
          {/* 상태 라벨 swap: 준비됨 → 실행됨 */}
          <SwapLabel
            oldFadeOutAtSec={REVEAL.readyToActiveOldFadeOut}
            newFadeInAtSec={REVEAL.readyToActiveNewFadeIn}
            initial={<StatusPill kind="ready">준비됨</StatusPill>}
            newLabel={<StatusPill kind="active">실행됨</StatusPill>}
          />
        </FadeIn>
      </div>

      {/*
        FlowArrow overlay — 두 화살표 모두 패널 텍스트 영역을 피해 빈 공간으로만 흐름.
        overlay 원점(screen) = (left 96, top 420). SVG 내부좌표 (x, y) → screen (96 + x, 420 + y).

        패널 텍스트 영역 (flex center 가정, ±수십px 오차 — Studio 재확인 권장):
          - CodePanel  screen x 153~873, y 355~535 (header 40, line2 y≈445)
          - ConsolePanel screen x 313~713, y 565~675
          - ToolBox    screen x 1227~1587, y 377~597
        빈 공간:
          - 두 패널 사이 corridor: screen x 873~1227 (call 화살표가 여기로만 흐름)
          - 우측 하단 corridor: screen x >873 & >713, y >535 (return 화살표가 여기로)
      */}
      <div
        style={{
          position: "absolute",
          left: 96,
          right: 96,
          top: 420,
          height: 240,
          pointerEvents: "none",
        }}
      >
        {/*
          call 화살표: ToolBox 좌측 가장자리 → CodePanel 우측 모서리 바로 바깥(line2).
          start screen (1224, 468) = ToolBox 좌측 edge / end screen (892, 446) = CodePanel
          우측 edge(873) 바로 바깥 19px, line2 y≈446. curve +55 로 corridor(x 873~1227)
          안에서만 위로 부풀음. x 경로 892~1224 전부 corridor 안 — 텍스트 침범 0.
        */}
        <FlowArrow
          startX={1128}
          startY={48}
          endX={796}
          endY={26}
          curve={55}
          delaySec={REVEAL.flowArrowCall}
          durationSec={0.7}
          strokeWidth={6}
          color={colors.accent}
          width={1300}
          height={240}
        />
        {/*
          return 화살표: CodePanel 우측하단 모서리 바깥 → ConsolePanel 우측 모서리 바깥.
          start screen (890, 545) = CodePanel bottom(535) 아래 + 우측 edge 바깥 /
          end screen (722, 628) = ConsolePanel 우측 edge(713) 바로 바깥, console y중앙.
          전 구간 y ≥ 545 (CodePanel bottom 535 아래) & x ≥ 722 (Console 우측 edge 713 밖)
          → 두 패널 텍스트 영역 모두 침범 0. curve -45 로 하단 빈 공간으로 부풀음.
        */}
        <FlowArrow
          startX={794}
          startY={125}
          endX={626}
          endY={208}
          curve={-45}
          delaySec={REVEAL.flowArrowReturn}
          durationSec={0.7}
          strokeWidth={6}
          color={colors.accentLight}
          width={1300}
          height={240}
        />
      </div>

      <LowerThirdSwapBlock />
    </PageBackground>
  );
};

/** "(매번 다른 값)" 회색 라벨 */
const VariabilityLabel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enterStart = REVEAL.variabilityLabel * fps;
  const reveal = interpolate(frame, [enterStart, enterStart + 0.5 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <span
      style={{
        opacity: reveal * 0.7,
        fontFamily: fonts.sans,
        fontSize: 18,
        fontWeight: 500,
        color: colors.darkMuted,
        fontStyle: "italic",
      }}
    >
      (매번 다른 값)
    </span>
  );
};

/** 상태 pill — ready (회색) / active (violet) */
const StatusPill: React.FC<{ kind: "ready" | "active"; children: React.ReactNode }> = ({
  kind,
  children,
}) => {
  const isActive = kind === "active";
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        height: 36,
        lineHeight: 1,
        padding: "0 18px",
        borderRadius: radii.pill,
        background: isActive ? colors.accent : colors.bgWhite,
        border: `1.5px solid ${isActive ? colors.accent : colors.inkSubtle}`,
        color: isActive ? "#ffffff" : colors.inkMuted,
        fontFamily: fonts.sans,
        fontSize: 22,
        fontWeight: 700,
        letterSpacing: "-0.01em",
        whiteSpace: "nowrap",
        boxShadow: isActive ? "0 0 0 4px rgba(139, 92, 246, 0.18)" : "none",
      }}
    >
      {children}
    </div>
  );
};

/** LowerThird swap — old ("import — 상자만") → new ("도구를 실제로 쓰려면...") */
const LowerThirdSwapBlock: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const oldStart = REVEAL.lowerThirdOld * fps;
  const oldEnter = interpolate(frame, [oldStart, oldStart + 0.5 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const oldFadeStart = REVEAL.lowerThirdOldFadeOut * fps;
  const oldFadeEnd = oldFadeStart + 0.4 * fps;
  const oldFade = interpolate(frame, [oldFadeStart, oldFadeEnd], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const oldOpacity = oldEnter * oldFade;

  const newStart = REVEAL.lowerThirdNew * fps;
  const newOpacity = interpolate(frame, [newStart, newStart + 0.5 * fps], [0, 1], {
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
            opacity: oldOpacity,
          }}
        >
          <LowerThirdPill>
            <span style={{ fontFamily: fonts.mono, color: colors.accentLight }}>
              import
            </span>
            <span>— 상자만 데려오기</span>
          </LowerThirdPill>
        </div>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            justifyContent: "center",
            opacity: newOpacity,
          }}
        >
          <LowerThirdPill>
            <span>도구를 실제로 쓰려면 — 점 찍고 이름을 불러야</span>
          </LowerThirdPill>
        </div>
      </div>
    </div>
  );
};

/** LowerThird pill skeleton (SwapLabel 적용을 위해 별도) */
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
      boxShadow: "0 4px 24px -8px rgba(24, 24, 27, 0.10), 0 1px 2px rgba(24, 24, 27, 0.04)",
    }}
  >
    {children}
  </div>
);
