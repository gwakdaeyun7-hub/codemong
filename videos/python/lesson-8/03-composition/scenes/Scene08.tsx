/**
 * Scene 8 — `tuple` 변경 시도 빨간 X + 직관 (16s)
 *
 * - 0~5s: 좌측 코드 — scene-07 코드가 톤다운 된 채로 새 줄 `좌표[0] = 38.0` type-on.
 *         `=` 부분에 큰 빨간 X 표시.
 * - 5~9s: 우측 RedConsole — `TypeError: 'tuple' object does not support item assignment`.
 * - 9~13s: 빨간 박스 톤다운. 하단 좌우 대비 카드:
 *          좌측: "리스트 = 바꿀 수 있다", 우측: "튜플 = 바꿀 수 없다".
 *          중앙에 ≠ 기호로 연결. 헤더 차례로 violet 펄스.
 * - 13~16s: lower-third "좌표·해상도 — 바뀌면 안 되는 묶음 = 튜플". 카드 우측에 `(1920, 1080)` 회색 mock.
 *
 * 오개념 2번 (튜플 = 괄호 모양만 외움) 정면 처치. 메시지 narration 에서 안 읽음.
 */

import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import {
  CodeLine,
  CodePanel,
  FadeIn,
  LowerThird,
  PageBackground,
  PyToken,
  RedConsole,
  RedStrike,
} from "../primitives";
import { colors, fonts, radii, shadows } from "../theme";

const REVEAL = {
  codePanel: 0.3,
  line1Dim: 0.5,
  line2Dim: 1.0,
  line3Dim: 1.4,
  newLine: 2.0, // 좌표[0] = 38.0
  redX: 3.5,
  redConsole: 5.0,
  redDim: 9.0,
  comparisonCardLeft: 9.5,
  comparisonCardRight: 10.2,
  headerPulse1: 11.5,
  headerPulse2: 12.2,
  resolutionMock: 13.0,
  lowerThird: 12.8,
} as const;

/** 좌우 대비 카드 한 개. 헤더에 atSec 펄스. */
const ComparisonCard: React.FC<{
  header: React.ReactNode;
  delaySec: number;
  pulseAtSec: number;
  variant?: "muted" | "accent";
}> = ({ header, delaySec, pulseAtSec, variant = "muted" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pStart = pulseAtSec * fps;
  const pulse = interpolate(
    frame,
    [pStart, pStart + 0.3 * fps, pStart + 0.8 * fps, pStart + 1.2 * fps],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const baseColor = variant === "accent" ? colors.accent : colors.inkSubtle;
  const baseBg = variant === "accent" ? colors.accentSoft : colors.borderSoft;
  const baseText = variant === "accent" ? colors.accentInk : colors.inkSoft;
  return (
    <FadeIn delaySec={delaySec} translateY={10}>
      <div
        style={{
          width: 380,
          height: 110,
          padding: "20px 28px",
          background: colors.bgWhite,
          border: `2px solid ${pulse > 0.1 ? colors.accent : colors.border}`,
          borderRadius: radii.card,
          boxShadow: shadows.cardSoft,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "8px 18px",
            borderRadius: radii.pill,
            background: pulse > 0.1 ? colors.accent : baseBg,
            color: pulse > 0.1 ? "#ffffff" : baseText,
            border: `1.5px solid ${pulse > 0.1 ? colors.accent : baseColor}`,
            fontFamily: fonts.sans,
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: "-0.01em",
            boxShadow: pulse > 0.1 ? "0 0 0 4px rgba(139, 92, 246, 0.18)" : "none",
          }}
        >
          {header}
        </div>
      </div>
    </FadeIn>
  );
};

export const Scene08: React.FC = () => {
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
            튜플은 만든 뒤엔 못 바꿈
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
          gap: 60,
        }}
      >
        {/* 좌측 — 코드 패널 (scene-07 코드 dim + 새 줄 변경 시도) */}
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <FadeIn delaySec={REVEAL.codePanel} translateY={20}>
            <div style={{ position: "relative" }}>
              <CodePanel fileName="location.py" width={680} height={300}>
                <CodeLine lineNumber={1} revealAtSec={REVEAL.line1Dim} dimmed>
                  <PyToken text="좌표" kind="name" />
                  <PyToken text=" " />
                  <PyToken text="=" kind="op" />
                  <PyToken text=" " />
                  <PyToken text="(" kind="op" />
                  <PyToken text="37.5" kind="number" />
                  <PyToken text=", " kind="op" />
                  <PyToken text="127.0" kind="number" />
                  <PyToken text=")" kind="op" />
                </CodeLine>
                <CodeLine lineNumber={2} revealAtSec={REVEAL.line2Dim} dimmed>
                  <PyToken text="좌표" kind="name" />
                  <PyToken text="[" kind="op" />
                  <PyToken text="0" kind="number" />
                  <PyToken text="]" kind="op" />
                </CodeLine>
                <CodeLine lineNumber={3} revealAtSec={REVEAL.line3Dim} dimmed>
                  <PyToken text="좌표" kind="name" />
                  <PyToken text="[" kind="op" />
                  <PyToken text="1" kind="number" />
                  <PyToken text="]" kind="op" />
                </CodeLine>
                <CodeLine lineNumber={4} revealAtSec={REVEAL.newLine}>
                  <PyToken text="좌표" kind="name" />
                  <PyToken text="[" kind="op" />
                  <PyToken text="0" kind="number" />
                  <PyToken text="]" kind="op" />
                  <PyToken text=" " />
                  <RedStrike delaySec={REVEAL.redX} durationSec={0.5}>
                    <PyToken text="= 38.0" kind="op" />
                  </RedStrike>
                </CodeLine>
              </CodePanel>
              {/* 빨간 X 마커 (라인 4 우측, 패널 안쪽) — right:24 로 panel 우측 padding(22) 안쪽 inset */}
              <FadeIn
                delaySec={REVEAL.redX + 0.4}
                translateY={-4}
                style={{
                  position: "absolute",
                  top: 230,
                  right: 24,
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: colors.danger,
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 26,
                  fontWeight: 900,
                  boxShadow: shadows.card,
                }}
              >
                ✕
              </FadeIn>
            </div>
          </FadeIn>
        </div>

        {/* 우측 — RedConsole (TypeError) */}
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <RedConsole
            delaySec={REVEAL.redConsole}
            width={580}
            height={180}
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
                TypeError: <br />
                <span style={{ color: colors.darkInk }}>
                  {`'tuple' object does not`}
                  <br />
                  {`support item assignment`}
                </span>
              </span>
            }
          />
        </div>
      </div>

      {/* 하단 대비 카드 */}
      <div
        style={{
          position: "absolute",
          bottom: 200,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 24,
        }}
      >
        <ComparisonCard
          delaySec={REVEAL.comparisonCardLeft}
          pulseAtSec={REVEAL.headerPulse1}
          header={
            <>
              리스트 ={" "}
              <span style={{ fontWeight: 800 }}>바꿀 수 있다</span>
            </>
          }
        />
        <FadeIn delaySec={REVEAL.comparisonCardLeft + 0.2} translateY={0}>
          <div
            style={{
              fontFamily: fonts.sans,
              fontSize: 48,
              fontWeight: 800,
              color: colors.danger,
              lineHeight: 1,
            }}
          >
            ≠
          </div>
        </FadeIn>
        <ComparisonCard
          delaySec={REVEAL.comparisonCardRight}
          pulseAtSec={REVEAL.headerPulse2}
          variant="accent"
          header={
            <>
              튜플 ={" "}
              <span style={{ fontWeight: 800 }}>바꿀 수 없다</span>
            </>
          }
        />
      </div>

      {/* 해상도 mock (우하단) */}
      <div
        style={{
          position: "absolute",
          bottom: 320,
          right: 80,
        }}
      >
        <FadeIn delaySec={REVEAL.resolutionMock} translateY={6}>
          <div
            style={{
              fontFamily: fonts.mono,
              fontSize: 18,
              fontWeight: 500,
              color: colors.inkMuted,
              letterSpacing: "-0.01em",
            }}
          >
            (1920, 1080) — 해상도
          </div>
        </FadeIn>
      </div>

      <LowerThird
        text={
          <>
            좌표·해상도 —{" "}
            <span style={{ color: colors.accentLight, fontWeight: 700 }}>바뀌면 안 되는</span> 묶음
            = 튜플
          </>
        }
        delaySec={REVEAL.lowerThird}
      />
    </PageBackground>
  );
};
