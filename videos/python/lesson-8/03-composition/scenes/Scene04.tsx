/**
 * Scene 4 — 리스트 vs 딕셔너리 시각 대비 (시그니처) (18s)
 *
 * **8강 시그니처 컷.** 오개념 1번 (리스트 vs 딕셔너리 선택) 정면 처치.
 *
 * - 0~3s: 상단 라벨 카드 "비교 — 같은 데이터, 두 가지 표현".
 * - 3~10s: 좌우 분할 — 양쪽 모두 CodePanel + ConsolePanel.
 *   - 좌측 (리스트): `students = ["철수", 90, "영희", 85]`, `students[0]` → `"철수"` + ⓘ 회색 물음표 (모호함).
 *   - 우측 (딕셔너리): `students = {"철수": 90, "영희": 85}`, `students["철수"]` → `90` + violet ✓ (명료함).
 * - 10~14s: 콘솔 결과가 차례로 펄스 — 좌측 회색 펄스, 우측 violet 펄스.
 * - 14~18s: lower-third "번호로 꺼낼 땐 리스트, 이름표로 꺼낼 땐 딕셔너리".
 *
 * R-008 준수: 좌/우 박스 width 720 / height 동일 (CodePanel 280, ConsolePanel 140).
 * 시각 차별화는 결과 색상(회색 vs violet) + 옆 마커(ⓘ vs ✓) 만.
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
import { colors, fonts, radii } from "../theme";

const REVEAL = {
  headerLabel: 0.2,
  leftPanel: 1.5,
  rightPanel: 1.5,
  leftLine1: 2.0,
  leftLine2: 3.0,
  leftConsole: 4.5,
  leftBadge: 5.5,
  rightLine1: 2.0,
  rightLine2: 3.0,
  rightConsole: 4.5,
  rightBadge: 5.5,
  leftPulse: 10.0,
  rightPulse: 11.5,
  lowerThird: 14.0,
} as const;

/** 결과 옆에 떠 있는 마커 (ⓘ 회색 또는 ✓ violet) */
const ResultMarker: React.FC<{
  type: "ambiguous" | "clear";
  enterAtSec: number;
}> = ({ type, enterAtSec }) => {
  const isClear = type === "clear";
  return (
    <FadeIn delaySec={enterAtSec} translateY={-6}>
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          background: isClear ? colors.accent : colors.inkSubtle,
          color: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: fonts.sans,
          fontSize: 20,
          fontWeight: 800,
          flexShrink: 0,
        }}
      >
        {isClear ? "✓" : "?"}
      </div>
    </FadeIn>
  );
};

const PanelPulse: React.FC<{
  atSec: number;
  color: string;
}> = ({ atSec, color }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = atSec * fps;
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
        inset: -8,
        borderRadius: 18,
        border: `3px solid ${color}`,
        opacity,
        pointerEvents: "none",
      }}
    />
  );
};

export const Scene04: React.FC = () => {
  return (
    <PageBackground>
      {/* 상단 라벨 */}
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
        <FadeIn delaySec={REVEAL.headerLabel} translateY={6}>
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
            비교 — 같은 데이터, 두 가지 표현
          </div>
        </FadeIn>
      </div>

      {/* 좌우 분할 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          padding: "150px 80px 140px",
          gap: 60,
        }}
      >
        {/* 좌측 — 리스트로 짜면 */}
        <FadeIn
          delaySec={REVEAL.leftPanel}
          translateY={20}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 22,
          }}
        >
          {/* 헤더 */}
          <div
            style={{
              padding: "8px 20px",
              borderRadius: radii.pill,
              background: colors.bgWhite,
              border: `2px solid ${colors.inkSubtle}`,
              color: colors.inkSoft,
              fontFamily: fonts.sans,
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: "-0.01em",
            }}
          >
            리스트로 짜면
          </div>
          <div style={{ position: "relative" }}>
            <CodePanel fileName="students.py" width={680} height={200}>
              <CodeLine lineNumber={1} revealAtSec={REVEAL.leftLine1}>
                <PyToken text="students" kind="name" />
                <PyToken text=" " />
                <PyToken text="=" kind="op" />
                <PyToken text=" " />
                <PyToken text="[" kind="op" />
                <PyToken text={'"철수"'} kind="string" />
                <PyToken text=", " kind="op" />
                <PyToken text="90" kind="number" />
                <PyToken text=", " kind="op" />
                <PyToken text={'"영희"'} kind="string" />
                <PyToken text=", " kind="op" />
                <PyToken text="85" kind="number" />
                <PyToken text="]" kind="op" />
              </CodeLine>
              <CodeLine lineNumber={2} revealAtSec={REVEAL.leftLine2}>
                <PyToken text="students" kind="name" />
                <PyToken text="[" kind="op" />
                <PyToken text="0" kind="number" />
                <PyToken text="]" kind="op" />
              </CodeLine>
            </CodePanel>
          </div>
          <div style={{ position: "relative" }}>
            <ConsolePanel title="출력 결과" width={680} height={150}>
              <ConsoleLine revealAtSec={REVEAL.leftConsole}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 14,
                    fontSize: 30,
                    fontWeight: 700,
                    color: colors.darkInk,
                  }}
                >
                  <span style={{ color: colors.syntaxString }}>"철수"</span>
                  <ResultMarker type="ambiguous" enterAtSec={REVEAL.leftBadge} />
                </span>
              </ConsoleLine>
            </ConsolePanel>
            <PanelPulse atSec={REVEAL.leftPulse} color={colors.inkSubtle} />
          </div>
        </FadeIn>

        {/* 우측 — 딕셔너리로 짜면 */}
        <FadeIn
          delaySec={REVEAL.rightPanel}
          translateY={20}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 22,
          }}
        >
          <div
            style={{
              padding: "8px 20px",
              borderRadius: radii.pill,
              background: colors.accentSoft,
              border: `2px solid ${colors.accent}`,
              color: colors.accentInk,
              fontFamily: fonts.sans,
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: "-0.01em",
            }}
          >
            딕셔너리로 짜면
          </div>
          <div style={{ position: "relative" }}>
            <CodePanel fileName="students.py" width={680} height={200}>
              <CodeLine lineNumber={1} revealAtSec={REVEAL.rightLine1}>
                <PyToken text="students" kind="name" />
                <PyToken text=" " />
                <PyToken text="=" kind="op" />
                <PyToken text=" " />
                <PyToken text="{" kind="op" />
                <PyToken text={'"철수"'} kind="dictKey" />
                <PyToken text=": " kind="op" />
                <PyToken text="90" kind="number" />
                <PyToken text=", " kind="op" />
                <PyToken text={'"영희"'} kind="dictKey" />
                <PyToken text=": " kind="op" />
                <PyToken text="85" kind="number" />
                <PyToken text="}" kind="op" />
              </CodeLine>
              <CodeLine lineNumber={2} revealAtSec={REVEAL.rightLine2}>
                <PyToken text="students" kind="name" />
                <PyToken text="[" kind="op" />
                <PyToken text={'"철수"'} kind="dictKey" />
                <PyToken text="]" kind="op" />
              </CodeLine>
            </CodePanel>
          </div>
          <div style={{ position: "relative" }}>
            <ConsolePanel title="출력 결과" width={680} height={150}>
              <ConsoleLine revealAtSec={REVEAL.rightConsole}>
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
                  90
                  <ResultMarker type="clear" enterAtSec={REVEAL.rightBadge} />
                </span>
              </ConsoleLine>
            </ConsolePanel>
            <PanelPulse atSec={REVEAL.rightPulse} color={colors.accent} />
          </div>
        </FadeIn>
      </div>

      <LowerThird
        text={
          <>
            번호로 꺼낼 땐 <span style={{ fontWeight: 800 }}>리스트</span> · 이름표로 꺼낼 땐{" "}
            <span style={{ color: colors.accentLight, fontWeight: 800 }}>딕셔너리</span>
          </>
        }
        delaySec={REVEAL.lowerThird}
      />
    </PageBackground>
  );
};
