/**
 * Scene 3 — `dict` 도입 + 이름표로 꺼내기 (18s)
 *
 * - 0~5s: 좌측 코드 패널 — `scores = {"수학": 95, "영어": 80}` type-on.
 *         `{`, `}`, `:` violet-300 강조 / `"수학"`, `"영어"` dictKey 색.
 * - 5~10s: 우측 PairDiagram fade-in — `"수학"` → `95`, `"영어"` → `80` 두 짝.
 * - 10~14s: 좌측 코드에 한 줄 더 `scores["수학"]` type-on. 콘솔 `95` fade-in.
 *           우측 다이어그램의 `"수학"` 키가 violet 펄스.
 * - 14~18s: 화면 하단 lower-third "딕셔너리 — 이름표(키) 로 값을 꺼낸다".
 *
 * 학습 목표 1·2번 진입. 시나리오: 학생 이름과 과목별 점수.
 * `dict` 키 시각 구분: dictKey 색 (violet-300).
 */

import React from "react";
import {
  CodeLine,
  CodePanel,
  ConsoleLine,
  ConsolePanel,
  FadeIn,
  LowerThird,
  PageBackground,
  PairDiagram,
  PyToken,
} from "../primitives";
import { colors, fonts, radii } from "../theme";

const REVEAL = {
  headerLabel: 0.2,
  codePanel: 0.3,
  line1: 0.7,
  diagram: 5.0,
  diagramRow1: 5.5,
  diagramRow2: 7.0,
  line2: 10.0,
  console: 11.5,
  keyPulse: 12.5,
  lowerThird: 14.5,
} as const;

export const Scene03: React.FC = () => {
  return (
    <PageBackground>
      {/* 상단 라벨 — Scene 07 "두 번째 — 튜플" / Scene 09 "세 번째 — 셋" 과 동일 정형 */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
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
              fontSize: 26,
              fontWeight: 700,
              letterSpacing: "-0.01em",
            }}
          >
            첫 번째 — dictionary
          </div>
        </FadeIn>
        <FadeIn delaySec={REVEAL.headerLabel + 0.4} translateY={6}>
          <div
            style={{
              fontFamily: fonts.sans,
              fontSize: 22,
              fontWeight: 500,
              color: colors.inkMuted,
              letterSpacing: "-0.01em",
            }}
          >
            <span style={{ color: colors.accentInk, fontWeight: 700 }}>이름표(키)</span>로 짝지은
            묶음
          </div>
        </FadeIn>
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          padding: "160px 80px 140px",
          gap: 60,
        }}
      >
        {/* 좌측 — 코드 패널 + 콘솔 */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 28,
          }}
        >
          <FadeIn delaySec={REVEAL.codePanel} translateY={20}>
            <CodePanel fileName="scores.py" width={720} height={220}>
              <CodeLine lineNumber={1} revealAtSec={REVEAL.line1}>
                <PyToken text="scores" kind="name" />
                <PyToken text=" " />
                <PyToken text="=" kind="op" />
                <PyToken text=" " />
                <PyToken text="{" kind="op" highlight />
                <PyToken text={'"수학"'} kind="dictKey" />
                <PyToken text=": " kind="op" highlight />
                <PyToken text="95" kind="number" />
                <PyToken text=", " kind="op" />
                <PyToken text={'"영어"'} kind="dictKey" />
                <PyToken text=": " kind="op" highlight />
                <PyToken text="80" kind="number" />
                <PyToken text="}" kind="op" highlight />
              </CodeLine>
              <CodeLine lineNumber={2} revealAtSec={REVEAL.line2}>
                <PyToken text="scores" kind="name" />
                <PyToken text="[" kind="op" />
                <PyToken text={'"수학"'} kind="dictKey" />
                <PyToken text="]" kind="op" />
              </CodeLine>
            </CodePanel>
          </FadeIn>

          <FadeIn delaySec={REVEAL.console} translateY={14}>
            <ConsolePanel title="출력 결과" width={360} height={130}>
              <ConsoleLine revealAtSec={REVEAL.console + 0.2}>
                <span
                  style={{
                    fontSize: 36,
                    fontWeight: 800,
                    color: colors.darkAccent,
                  }}
                >
                  95
                </span>
              </ConsoleLine>
            </ConsolePanel>
          </FadeIn>
        </div>

        {/* 우측 — PairDiagram */}
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <PairDiagram
            title="이름표 → 값"
            delaySec={REVEAL.diagram}
            width={560}
            rows={[
              {
                key: '"수학"',
                value: "95",
                enterAtSec: REVEAL.diagramRow1,
                pulseAtSec: REVEAL.keyPulse,
                pulseSide: "both",
              },
              {
                key: '"영어"',
                value: "80",
                enterAtSec: REVEAL.diagramRow2,
              },
            ]}
          />
        </div>
      </div>

      <LowerThird
        text={
          <>
            dictionary —{" "}
            <span style={{ color: colors.accentLight, fontWeight: 700 }}>이름표(키)</span>로 값을
            꺼낸다
          </>
        }
        delaySec={REVEAL.lowerThird}
      />
    </PageBackground>
  );
};
