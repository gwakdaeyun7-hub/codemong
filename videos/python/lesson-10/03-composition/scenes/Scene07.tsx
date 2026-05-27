/**
 * Scene 7 — 결과를 변수에 받는 패턴 (22s)
 *
 * 오개념 2번 (결과를 변수에 안 받음) 정면 처치 — 좌·우 분할 시그니처 컷.
 *
 * - 0~4s: 좌·우 분할. 양쪽 모두 카드 (width 640, height 380 — R-008 동일).
 *   - 좌측 (라벨 "결과를 _안 받으면_"): `random.randint(1, 6)` 한 줄.
 *     호출 자리 옆에 `4` 잠깐 fade-in 후 fade-out (값이 사라짐 메타포).
 *     옆에 회색 "→ 사라짐" 라벨.
 *   - 우측 (라벨 "결과를 _변수에 받으면_"): 첫 줄 type-on
 *     `눈 = random.randint(1, 6)`. 두 번째 줄 `print(눈)`.
 * - 4~12s: 우측에서 결과가 되돌아오는 FlowArrow (호출 자리 → 변수 위치).
 *   둘째 줄 print(눈) type-on. 콘솔에 결과 `4` (fontSize 30, R-001).
 * - 12~18s: 좌측 톤 다운 (opacity 0.4), 우측 강조. `눈` 토큰 펄스 — 둘째 줄의
 *   `눈` 과 변수 위치 둘 다 violet (R-016 narration "방금 받은 그 숫자" 16s 동기).
 * - 18~22s: LowerThird: "결과는 _변수에 담아_ 다음 줄에서 쓴다". 좌·우 헤더 펄스.
 *
 * R-008: 좌·우 카드 width 640 / height 380 동일 명시.
 * R-014 / R-020: 좌·우 카드 안 element 정렬 — code panel + console panel y 일치.
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
  header: 0.1,
  leftPanel: 0.4,
  rightPanel: 0.6,
  leftImportLine: 1.4, // import random (context, 회색 강조 X)
  leftLine1: 1.6,
  // 좌측 값이 잠깐 보였다 사라짐
  leftValueShow: 2.4,
  leftValueHide: 3.4,
  // 우측
  rightImportLine: 1.6, // import random (context)
  rightLine1: 1.8,
  rightFlowArrowReturn: 4.2,
  rightLine2: 5.6,
  rightConsole: 7.2,
  leftDim: 12.0,
  // R-016: narration "방금 받은 그 숫자" 약 16s
  eyeTokenPulse: 16.0,
  lowerThird: 18.0,
  headerPulseLeft: 18.6,
  headerPulseRight: 19.4,
} as const;

const CARD_WIDTH = 640;
// 우측 카드가 3줄(import / 눈= / print)로 늘어 CodePanel 240 + gap 18 + console 90
// + padding 64 = 412 → 430 으로 상향 (R-008: 좌·우 동일 height 유지).
const CARD_HEIGHT = 430;

export const Scene07: React.FC = () => {
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
            결과는 변수에 담아야 다음 줄에서 쓴다
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
          justifyContent: "center",
          padding: "150px 80px 160px",
          gap: 60,
        }}
      >
        {/* 좌측 — 안 받으면 */}
        <LeftCard />

        {/* 우측 — 변수에 받으면 */}
        <RightCard />
      </div>

      <LowerThird
        text={
          <>
            결과는 <span style={{ color: colors.accentLight, fontWeight: 800 }}>변수에 담아</span>{" "}
            다음 줄에서 쓴다
          </>
        }
        delaySec={REVEAL.lowerThird}
      />
    </PageBackground>
  );
};

/* ---- 좌측 카드 ---- */
const LeftCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dimStart = REVEAL.leftDim * fps;
  const dim = interpolate(frame, [dimStart, dimStart + 0.5 * fps], [1, 0.4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const headerPulseStart = REVEAL.headerPulseLeft * fps;
  const headerPulse = interpolate(
    frame,
    [headerPulseStart, headerPulseStart + 0.3 * fps, headerPulseStart + 0.7 * fps, headerPulseStart + 1.1 * fps],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <FadeIn
      delaySec={REVEAL.leftPanel}
      translateY={20}
      style={{
        flex: "0 0 auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 18,
        opacity: dim,
      }}
    >
      {/* 헤더 */}
      <div
        style={{
          padding: "8px 20px",
          borderRadius: radii.pill,
          background: headerPulse > 0.1 ? colors.inkSubtle : colors.bgWhite,
          border: `2px solid ${colors.inkSubtle}`,
          color: headerPulse > 0.1 ? "#ffffff" : colors.inkSoft,
          fontFamily: fonts.sans,
          fontSize: 22,
          fontWeight: 700,
          letterSpacing: "-0.01em",
          boxShadow: headerPulse > 0.1 ? "0 0 0 4px rgba(161, 161, 170, 0.2)" : "none",
        }}
      >
        결과를 안 받으면
      </div>

      {/* 카드 본체 */}
      <div
        style={{
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
          background: colors.bgWhite,
          border: `2px solid ${colors.border}`,
          borderRadius: radii.card,
          boxShadow: shadows.cardSoft,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 24,
          padding: "32px 40px",
        }}
      >
        <CodePanel fileName="dice.py" width={520} height={180}>
          <CodeLine lineNumber={1} revealAtSec={REVEAL.leftImportLine}>
            <PyToken text="import" kind="keyword" />
            <PyToken text=" " />
            <PyToken text="random" kind="name" />
          </CodeLine>
          <CodeLine lineNumber={2} revealAtSec={REVEAL.leftLine1}>
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

        {/* 값이 잠깐 보이고 사라짐 */}
        <DisappearingValue />
      </div>
    </FadeIn>
  );
};

const DisappearingValue: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const showStart = REVEAL.leftValueShow * fps;
  const showEnd = showStart + 0.4 * fps;
  const hideStart = REVEAL.leftValueHide * fps;
  const hideEnd = hideStart + 0.5 * fps;
  const opacity = interpolate(
    frame,
    [showStart, showEnd, hideStart, hideEnd],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 18,
        opacity,
      }}
    >
      <span
        style={{
          fontFamily: fonts.mono,
          fontSize: 36,
          fontWeight: 800,
          color: colors.accentDeep,
          letterSpacing: "-0.01em",
        }}
      >
        4
      </span>
      <span
        style={{
          fontFamily: fonts.sans,
          fontSize: 22,
          fontWeight: 500,
          color: colors.inkMuted,
          fontStyle: "italic",
        }}
      >
        → 사라짐
      </span>
    </div>
  );
};

/* ---- 우측 카드 ---- */
const RightCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headerPulseStart = REVEAL.headerPulseRight * fps;
  const headerPulse = interpolate(
    frame,
    [headerPulseStart, headerPulseStart + 0.3 * fps, headerPulseStart + 0.7 * fps, headerPulseStart + 1.1 * fps],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // `눈` 토큰 펄스 (R-016)
  const eyePulseStart = REVEAL.eyeTokenPulse * fps;
  const eyePulse = interpolate(
    frame,
    [eyePulseStart, eyePulseStart + 0.3 * fps, eyePulseStart + 0.7 * fps, eyePulseStart + 1.1 * fps],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <FadeIn
      delaySec={REVEAL.rightPanel}
      translateY={20}
      style={{
        flex: "0 0 auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 18,
      }}
    >
      {/* 헤더 */}
      <div
        style={{
          padding: "8px 20px",
          borderRadius: radii.pill,
          background: headerPulse > 0.1 ? colors.accent : colors.accentSoft,
          border: `2px solid ${colors.accent}`,
          color: headerPulse > 0.1 ? "#ffffff" : colors.accentInk,
          fontFamily: fonts.sans,
          fontSize: 22,
          fontWeight: 700,
          letterSpacing: "-0.01em",
          boxShadow: headerPulse > 0.1 ? "0 0 0 4px rgba(139, 92, 246, 0.18)" : "none",
        }}
      >
        결과를 변수에 받으면
      </div>

      {/* 카드 본체 */}
      <div
        style={{
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
          background: colors.bgWhite,
          border: `2px solid ${colors.accent}`,
          borderRadius: radii.card,
          boxShadow: shadows.cardSoft,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 18,
          padding: "32px 40px",
          position: "relative",
        }}
      >
        <CodePanel fileName="dice.py" width={520} height={240}>
          <CodeLine lineNumber={1} revealAtSec={REVEAL.rightImportLine}>
            <PyToken text="import" kind="keyword" />
            <PyToken text=" " />
            <PyToken text="random" kind="name" />
          </CodeLine>
          <CodeLine lineNumber={2} revealAtSec={REVEAL.rightLine1}>
            <PyToken
              text="눈"
              kind="name"
              highlight={eyePulse > 0.1}
            />
            <PyToken text=" " />
            <PyToken text="=" kind="op" />
            <PyToken text=" " />
            <PyToken text="random" kind="name" />
            <PyToken text="." kind="op" />
            <PyToken text="randint" kind="func" />
            <PyToken text="(" kind="op" />
            <PyToken text="1" kind="number" />
            <PyToken text=", " kind="op" />
            <PyToken text="6" kind="number" />
            <PyToken text=")" kind="op" />
          </CodeLine>
          <CodeLine lineNumber={3} revealAtSec={REVEAL.rightLine2}>
            <PyToken text="print" kind="func" />
            <PyToken text="(" kind="op" />
            <PyToken
              text="눈"
              kind="name"
              highlight={eyePulse > 0.1}
            />
            <PyToken text=")" kind="op" />
          </CodeLine>
        </CodePanel>

        <ConsolePanel title="출력 결과" width={300} height={90}>
          <ConsoleLine revealAtSec={REVEAL.rightConsole}>
            <span
              style={{
                fontFamily: fonts.mono,
                fontSize: 30,
                fontWeight: 800,
                color: colors.darkAccent,
              }}
            >
              4
            </span>
          </ConsoleLine>
        </ConsolePanel>
      </div>
    </FadeIn>
  );
};
