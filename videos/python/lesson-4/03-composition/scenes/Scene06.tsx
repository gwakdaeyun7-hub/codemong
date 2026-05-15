/**
 * Scene 6 — 비교 연산자 6종 + 결과가 값 (15s)
 *
 * narration: "비교 연산자. 6가지. 같다/다르다/크다/작다/크거나 같다/작거나 같다.
 *             비교의 결과는 그 자체로 *값* 입니다. True 또는 False. 예를 들어,
 *             3이 5보다 크냐고 묻고 print 로 출력해 보면 False 가 찍힙니다."
 *
 * 타이밍 (scene local):
 *   0.0 ~ 0.5  : scene 라벨
 *   0.5 ~ 6.0  : 좌측 6행 표 staggered fade-in
 *   6.0 ~ 10.0 : 우측 코드 카드 `print(3 > 5)` + 콘솔 False
 *   10.0 ~ 15.0: "비교 결과는 True/False 라는 값" 라벨 카드 + "값" 강조
 */

import React from "react";
import {
  CodeLine,
  CodePanel,
  ConsoleLine,
  ConsolePanel,
  FadeIn,
  OperatorTable,
  OpRow,
  PageBackground,
  PyToken,
} from "../primitives";
import { colors, fonts, radii, shadows } from "../theme";

const compareRows: OpRow[] = [
  { op: "==", meaning: "같다", example: "3 == 3", result: "True" },
  { op: "!=", meaning: "다르다", example: "3 != 5", result: "True" },
  { op: ">", meaning: "크다", example: "3 > 5", result: "False" },
  { op: "<", meaning: "작다", example: "3 < 5", result: "True" },
  { op: ">=", meaning: "크거나 같다", example: "3 >= 3", result: "True" },
  { op: "<=", meaning: "작거나 같다", example: "5 <= 3", result: "False" },
];

export const Scene06: React.FC = () => {
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
            }}
          >
            비교 연산자 6종
          </div>
        </FadeIn>
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          padding: "120px 80px 60px",
          gap: 56,
        }}
      >
        {/* 좌 — 표 */}
        <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
          <FadeIn delaySec={0.4} translateY={20}>
            <OperatorTable
              rows={compareRows}
              startDelaySec={0.7}
              rowGapSec={0.55}
              width={880}
              resultEmphasize
              // dead-air pulse: 13s — 결과 컬럼 전체 동시 pulse.
              // narration "결과가 True 또는 False 값으로 나옵니다" 의 "값" 감각 강조.
              pulseResultColumnAtSec={13.0}
            />
          </FadeIn>
        </div>

        {/* 우 — 결과가 값 예시 */}
        <div
          style={{
            flex: 0,
            display: "flex",
            flexDirection: "column",
            gap: 22,
            alignItems: "center",
          }}
        >
          {/* 작은 코드 */}
          <FadeIn delaySec={6.5} translateY={16}>
            <CodePanel fileName="check.py" width={460} height={120}>
              <CodeLine lineNumber={1} revealAtSec={6.8}>
                <PyToken text="print" kind="func" />
                <PyToken text="(" kind="op" />
                <PyToken text="3" kind="number" />
                <PyToken text=" " />
                <PyToken text=">" kind="op" />
                <PyToken text=" " />
                <PyToken text="5" kind="number" />
                <PyToken text=")" kind="op" />
              </CodeLine>
            </CodePanel>
          </FadeIn>

          {/* 콘솔 출력 */}
          <FadeIn delaySec={8.0} translateY={14}>
            <ConsolePanel title="출력 결과" width={460} height={110}>
              <ConsoleLine revealAtSec={8.3} emphasis>
                False
              </ConsoleLine>
            </ConsolePanel>
          </FadeIn>

          {/* "결과는 True/False 라는 *값*" 라벨 카드 */}
          <FadeIn delaySec={10.5} translateY={14}>
            <div
              style={{
                width: 460,
                padding: "20px 28px",
                borderRadius: radii.card,
                background: colors.accentSoft,
                border: `1px solid ${colors.accent}`,
                boxShadow: shadows.card,
                fontFamily: fonts.sans,
                fontSize: 22,
                fontWeight: 700,
                color: colors.accentInk,
                lineHeight: 1.5,
                letterSpacing: "-0.01em",
                textAlign: "center",
              }}
            >
              비교의 결과는{" "}
              <span style={{ fontFamily: fonts.mono, color: colors.accent }}>True</span> /{" "}
              <span style={{ fontFamily: fonts.mono, color: colors.accent }}>False</span> 라는{" "}
              {/* v4 fix: scale pulse 모션 제거 — 의미 없는 커졌다 작아짐 움직임 빼고 정적으로 강조만 유지 */}
              <span style={{ color: colors.accent, fontWeight: 800, fontSize: 26 }}>값</span>
            </div>
          </FadeIn>
        </div>
      </div>
    </PageBackground>
  );
};
