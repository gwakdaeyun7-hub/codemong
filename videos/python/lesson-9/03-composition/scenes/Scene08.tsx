/**
 * Scene 8 — `return` vs `print` 시그니처 비교 (22s)
 *
 * **9강 시그니처 컷.** 오개념 1·4 정면 처치. 좌우 분할 비교.
 *
 * - 0~3s: 상단 라벨 카드 "비교 — 같은 함수, 두 가지 모습".
 * - 3~12s: 화면 좌우 분할 (R-008 동일 사이즈 강제, R-014/R-020 좌·우 컬럼 y 정렬).
 *   - 좌측 (라벨: "print 만 적은 경우"):
 *     def double(x):
 *         print(x * 2)
 *
 *     result = double(5)
 *     print(result)
 *     콘솔: 10, None
 *   - 우측 (라벨: "return 으로 돌려준 경우"):
 *     def double(x):
 *         return x * 2
 *
 *     result = double(5)
 *     print(result)
 *     콘솔: 10
 *     ✓ 마크 (violet)
 * - 12~18s: 우측 패널의 `return` 토큰 violet 펄스.
 *           우측에서 _되돌아오는 화살표_ — double(5) 결과 → result 자리 (1초, R-016 동기).
 *           좌측은 동일 시점에 _되돌아오는 화살표 없음_ — 회색 X 표시.
 * - 18~22s: 양쪽 콘솔 결과 차례 펄스 — 좌측 None 회색 펄스, 우측 10 violet 펄스.
 *           lower-third "print = 보여주기 · return = 돌려주기".
 *
 * R-008 강제: 좌·우 패널 모두 width 600, height 480 동일.
 * R-009: 라벨 안 print/return 모두 소문자.
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
  ReturnArrow,
} from "../primitives";
import { colors, fonts, radii } from "../theme";

// R-008: 좌·우 동일 사이즈 강제
const PANEL_WIDTH = 600;
const CODE_PANEL_HEIGHT = 280;
const CONSOLE_PANEL_HEIGHT = 160;

const REVEAL = {
  headerLabel: 0.2,
  leftPanel: 1.5,
  rightPanel: 1.5,
  // 좌측 코드 (print 만)
  leftLine1: 2.5, // def double(x):
  leftLine2: 3.5, //     print(x * 2)
  leftLine3: 5.0, // (empty line)  result = double(5)
  leftLine4: 6.5, // print(result)
  leftConsole: 8.5,
  leftConsole10: 8.7, // 10
  leftConsoleNone: 9.7, // None
  // 우측 코드 (return)
  rightLine1: 2.5, // def double(x):
  rightLine2: 3.5, //     return x * 2
  rightLine3: 5.0, // (empty)  result = double(5)
  rightLine4: 6.5, // print(result)
  rightConsole: 8.5,
  rightConsole10: 8.7,
  rightCheckMark: 10.0,
  // 시그니처 비트 — 12~18s
  rightReturnPulse: 13.0, // narration "돌려주기" 발화 시점 (Stage 3 wire)
  rightReturnArrow: 13.0,
  leftNoArrow: 14.5, // 좌측 회색 X
  // 콘솔 결과 펄스 (18~22s)
  leftNonePulse: 18.5,
  right10Pulse: 19.5,
  lowerThird: 18.0,
} as const;

export const Scene08: React.FC = () => {
  return (
    <PageBackground>
      {/* 상단 라벨 카드 */}
      <div
        style={{
          position: "absolute",
          top: 50,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <FadeIn delaySec={REVEAL.headerLabel} translateY={6}>
          <div
            style={{
              padding: "10px 28px",
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
            비교 — 같은 함수, 두 가지 모습
          </div>
        </FadeIn>
      </div>

      {/* 좌우 분할 — R-008 동일 사이즈 / R-014 동일 y 정렬 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "130px 60px 140px",
          gap: 40,
        }}
      >
        {/* 좌측 — print 만 */}
        <FadeIn
          delaySec={REVEAL.leftPanel}
          translateY={20}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
          }}
        >
          {/* 헤더 */}
          <div
            style={{
              padding: "8px 22px",
              borderRadius: radii.pill,
              background: colors.bgWhite,
              border: `2px solid ${colors.inkSubtle}`,
              color: colors.inkSoft,
              fontFamily: fonts.sans,
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: "-0.01em",
              whiteSpace: "nowrap",
            }}
          >
            <span style={{ fontFamily: fonts.mono, fontWeight: 800 }}>print</span> 만 적은 경우
          </div>

          <div style={{ position: "relative" }}>
            <CodePanel fileName="double.py" width={PANEL_WIDTH} height={CODE_PANEL_HEIGHT}>
              <CodeLine lineNumber={1} revealAtSec={REVEAL.leftLine1}>
                <PyToken text="def" kind="keyword" />
                <PyToken text=" " />
                <PyToken text="double" kind="name" />
                <PyToken text="(" kind="op" />
                <PyToken text="x" kind="dictKey" />
                <PyToken text=")" kind="op" />
                <PyToken text=":" kind="op" />
              </CodeLine>
              <CodeLine lineNumber={2} revealAtSec={REVEAL.leftLine2}>
                <PyToken text="    " />
                <PyToken text="print" kind="func" highlight />
                <PyToken text="(" kind="op" />
                <PyToken text="x" kind="dictKey" />
                <PyToken text=" * " kind="op" />
                <PyToken text="2" kind="number" />
                <PyToken text=")" kind="op" />
              </CodeLine>
              <CodeLine lineNumber={3} revealAtSec={REVEAL.leftLine3}>
                <PyToken text="result" kind="name" />
                <PyToken text=" = " kind="op" />
                <PyToken text="double" kind="name" />
                <PyToken text="(" kind="op" />
                <PyToken text="5" kind="number" />
                <PyToken text=")" kind="op" />
              </CodeLine>
              <CodeLine lineNumber={4} revealAtSec={REVEAL.leftLine4}>
                <PyToken text="print" kind="func" />
                <PyToken text="(" kind="op" />
                <PyToken text="result" kind="name" />
                <PyToken text=")" kind="op" />
              </CodeLine>
            </CodePanel>

            {/* 좌측: "돌려주는 게 없음" 회색 X — REVEAL.leftNoArrow 에 등장 */}
            <NoArrowMark enterAt={REVEAL.leftNoArrow} />
          </div>

          {/* 좌측 콘솔: 10, None */}
          <ConsolePanel title="출력 결과" width={PANEL_WIDTH} height={CONSOLE_PANEL_HEIGHT}>
            <ConsoleLine revealAtSec={REVEAL.leftConsole10}>
              {/* 좌·우 콘솔의 같은 값 `10` 폰트 통일: 우측(36)에 맞춤.
                  R-001: 패널 base text(ConsolePanel content fontSize 30) 대비 36/30 = 1.2× ≤ 1.5× ✓.
                  시그니처 비교 컷이라 좌·우 `10` 이 동일 크기여야 비교가 공정. */}
              <span style={{ fontSize: 36, fontWeight: 800, color: colors.darkAccent }}>10</span>
            </ConsoleLine>
            <ConsoleLine revealAtSec={REVEAL.leftConsoleNone}>
              <NonePulseSpan pulseAt={REVEAL.leftNonePulse}>
                <span
                  style={{
                    fontSize: 26,
                    fontWeight: 700,
                    color: colors.darkMuted,
                    fontStyle: "italic",
                  }}
                >
                  None
                </span>
              </NonePulseSpan>
            </ConsoleLine>
          </ConsolePanel>
        </FadeIn>

        {/* 우측 — return 으로 돌려준 경우 */}
        <FadeIn
          delaySec={REVEAL.rightPanel}
          translateY={20}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
          }}
        >
          {/* 헤더 — 우측은 violet 강조 */}
          <div
            style={{
              padding: "8px 22px",
              borderRadius: radii.pill,
              background: colors.accentSoft,
              border: `2px solid ${colors.accent}`,
              color: colors.accentInk,
              fontFamily: fonts.sans,
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: "-0.01em",
              whiteSpace: "nowrap",
            }}
          >
            <span style={{ fontFamily: fonts.mono, fontWeight: 800 }}>return</span> 으로 돌려준 경우
          </div>

          <div style={{ position: "relative" }}>
            <CodePanel fileName="double.py" width={PANEL_WIDTH} height={CODE_PANEL_HEIGHT}>
              <CodeLine lineNumber={1} revealAtSec={REVEAL.rightLine1}>
                <PyToken text="def" kind="keyword" />
                <PyToken text=" " />
                <PyToken text="double" kind="name" />
                <PyToken text="(" kind="op" />
                <PyToken text="x" kind="dictKey" />
                <PyToken text=")" kind="op" />
                <PyToken text=":" kind="op" />
              </CodeLine>
              <CodeLine lineNumber={2} revealAtSec={REVEAL.rightLine2}>
                <PyToken text="    " />
                <ReturnPulseToken pulseAt={REVEAL.rightReturnPulse}>
                  <PyToken text="return" kind="keyword" highlight />
                </ReturnPulseToken>
                <PyToken text=" " />
                <PyToken text="x" kind="dictKey" />
                <PyToken text=" * " kind="op" />
                <PyToken text="2" kind="number" />
              </CodeLine>
              <CodeLine lineNumber={3} revealAtSec={REVEAL.rightLine3}>
                <PyToken text="result" kind="name" />
                <PyToken text=" = " kind="op" />
                <PyToken text="double" kind="name" />
                <PyToken text="(" kind="op" />
                <PyToken text="5" kind="number" />
                <PyToken text=")" kind="op" />
              </CodeLine>
              <CodeLine lineNumber={4} revealAtSec={REVEAL.rightLine4}>
                <PyToken text="print" kind="func" />
                <PyToken text="(" kind="op" />
                <PyToken text="result" kind="name" />
                <PyToken text=")" kind="op" />
              </CodeLine>
            </CodePanel>

            {/* 우측: 되돌아오는 화살표 overlay
                line 2 (return x * 2) 우측 → line 3 (result = double(5)) 의 double(5) 자리 */}
            <ReturnArrowOverlay
              enterAt={REVEAL.rightReturnArrow}
              panelWidth={PANEL_WIDTH}
              panelHeight={CODE_PANEL_HEIGHT}
            />
          </div>

          {/* 우측 콘솔: 10 + ✓ */}
          <ConsolePanel title="출력 결과" width={PANEL_WIDTH} height={CONSOLE_PANEL_HEIGHT}>
            <ConsoleLine revealAtSec={REVEAL.rightConsole10}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 14,
                  fontSize: 36,
                  fontWeight: 800,
                  color: colors.darkAccent,
                }}
              >
                <Right10PulseSpan pulseAt={REVEAL.right10Pulse}>10</Right10PulseSpan>
                <FadeIn delaySec={REVEAL.rightCheckMark} translateY={-4}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
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
                  </div>
                </FadeIn>
              </span>
            </ConsoleLine>
          </ConsolePanel>
        </FadeIn>
      </div>

      <LowerThird
        text={
          <>
            <span style={{ fontFamily: fonts.mono, color: colors.accentLight, fontWeight: 700 }}>
              print
            </span>{" "}
            = <span style={{ fontWeight: 800 }}>보여주기</span> ·{" "}
            <span style={{ fontFamily: fonts.mono, color: colors.accentLight, fontWeight: 700 }}>
              return
            </span>{" "}
            = <span style={{ fontWeight: 800 }}>돌려주기</span>
          </>
        }
        delaySec={REVEAL.lowerThird}
      />
    </PageBackground>
  );
};

/** 우측 패널 안에 되돌아오는 화살표 — line 2 (return x * 2) 의 우측 끝 →
 *  line 3 (result = double(5)) 의 double(5) 자리.
 *  panel-relative 좌표.
 */
const ReturnArrowOverlay: React.FC<{
  enterAt: number;
  panelWidth: number;
  panelHeight: number;
}> = ({ enterAt, panelWidth, panelHeight }) => {
  // CodePanel content area: header 40, content padding 20 top, line height ~48
  // line 1 y ≈ 40 + 20 + 0  = 60 (line center ≈ 84)
  // line 2 y ≈ line1 + 48     (center ≈ 132) ← return 줄
  // line 3 y ≈ line2 + 48 + 6 (center ≈ 186) ← result = double(5)
  // 화살표: (return 줄 우측, y 132) → (double(5) 자리, y 186)
  // 곡선 형태: 우측 바깥으로 살짝 부풀고 다시 들어옴
  const startX = panelWidth - 90; // return 줄 우측 끝 근처
  const startY = 132;
  const endX = 360; // double(5) 의 d 자리
  const endY = 186;
  const controlX = panelWidth - 30; // 패널 우측 끝 가까이 (안쪽)
  const controlY = 160;

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: panelWidth,
        height: panelHeight,
        pointerEvents: "none",
      }}
    >
      <ReturnArrow
        width={panelWidth}
        height={panelHeight}
        strokeWidth={6}
        arrows={[
          {
            startX,
            startY,
            endX,
            endY,
            controlX,
            controlY,
            delaySec: enterAt,
            drawDurationSec: 1.0,
            color: "#a78bfa", // violet-400, dark panel 위에서 잘 보이는 색
          },
        ]}
      />
    </div>
  );
};

/** 좌측 패널 옆에 "돌려주는 게 없음" 라벨 + 회색 X. */
const NoArrowMark: React.FC<{ enterAt: number }> = ({ enterAt }) => {
  return (
    <FadeIn
      delaySec={enterAt}
      translateY={6}
      style={{
        position: "absolute",
        top: 130,
        right: 24,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: "rgba(161, 161, 170, 0.30)",
            border: `2.5px solid ${colors.inkSubtle}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: colors.inkSubtle,
            fontSize: 30,
            fontWeight: 900,
            lineHeight: 1,
          }}
        >
          ✕
        </div>
        <div
          style={{
            padding: "4px 10px",
            borderRadius: radii.pill,
            background: "rgba(24, 24, 27, 0.8)",
            color: "#e4e4e7",
            fontFamily: fonts.sans,
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: "-0.01em",
            whiteSpace: "nowrap",
          }}
        >
          돌려주는 게 없음
        </div>
      </div>
    </FadeIn>
  );
};

/** return 토큰 펄스 (narration "돌려주기" 발화 시점에 동기 — Stage 3 wire). */
const ReturnPulseToken: React.FC<{ pulseAt: number; children: React.ReactNode }> = ({
  pulseAt,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = pulseAt * fps;
  const pulse = interpolate(
    frame,
    [start, start + 0.3 * fps, start + 0.7 * fps, start + 1.2 * fps],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return (
    <span style={{ position: "relative", display: "inline-block" }}>
      {children}
      <span
        style={{
          position: "absolute",
          left: -3,
          right: -3,
          top: -3,
          bottom: -3,
          borderRadius: 6,
          border: `2.5px solid ${colors.accent}`,
          opacity: pulse,
          pointerEvents: "none",
        }}
      />
    </span>
  );
};

/** 좌측 콘솔 None 펄스 (회색). */
const NonePulseSpan: React.FC<{ pulseAt: number; children: React.ReactNode }> = ({
  pulseAt,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = pulseAt * fps;
  const pulse = interpolate(
    frame,
    [start, start + 0.3 * fps, start + 0.7 * fps, start + 1.2 * fps],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return (
    <span style={{ position: "relative", display: "inline-block", padding: "0 6px" }}>
      {children}
      <span
        style={{
          position: "absolute",
          inset: -4,
          borderRadius: 6,
          border: `2.5px solid ${colors.inkSubtle}`,
          opacity: pulse,
          pointerEvents: "none",
        }}
      />
    </span>
  );
};

/** 우측 콘솔 10 펄스 (violet). */
const Right10PulseSpan: React.FC<{ pulseAt: number; children: React.ReactNode }> = ({
  pulseAt,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = pulseAt * fps;
  const pulse = interpolate(
    frame,
    [start, start + 0.3 * fps, start + 0.7 * fps, start + 1.2 * fps],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return (
    <span style={{ position: "relative", display: "inline-block", padding: "0 6px" }}>
      {children}
      <span
        style={{
          position: "absolute",
          inset: -4,
          borderRadius: 6,
          border: `2.5px solid ${colors.accent}`,
          opacity: pulse,
          pointerEvents: "none",
        }}
      />
    </span>
  );
};
