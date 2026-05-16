/**
 * Scene 5 — `for` 본문: 1부터 10까지의 합 (22s)
 *
 * 입력 사항 §7 본문 시나리오 권고 그대로. `range(1, 11)` 시작값 포함형 등장.
 *
 * - 0~3s: 좌상단 작은 라벨 카드 "시나리오 — 1부터 10까지의 합" (violet-100 / violet-700)
 * - 3~15s: 화면 좌측 60% 코드 패널, 4줄 type-on (각 약 3초, narration 동기화)
 *     1줄: `total = 0`
 *     2줄: `for i in range(1, 11):`
 *     3줄: `    total = total + i`
 *     4줄: `print(total)`
 *   - 키워드/함수 violet 강조
 *   - 둘째 줄 `11` 위에 빨간 줄 표시 + 작은 콜아웃 "11은 포함 안 됨" (옅게, 2초 후 사라짐)
 *   - 셋째 줄 좌측에 violet-300 세로 가이드 라인
 * - 15~19s: 우측 누적 표 — i / total 헤더, 10행 (1·2·3·...·10) 한 행씩 fade-in
 *   - 마지막 행 `55` 가 violet-500 으로 한 번 펄스
 * - 19~22s: 우측 콘솔 — `55` type-on
 *   - 결과 옆 라벨 "1부터 10까지의 합 = 55"
 */

import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import {
  CodeLine,
  CodePanel,
  ConsoleLine,
  ConsolePanel,
  FadeIn,
  IndentGuide,
  PageBackground,
  PyToken,
  RedStrike,
} from "../primitives";
import { colors, fonts, radii, shadows } from "../theme";

const REVEAL = {
  scenarioCard: 0.2,
  panel: 0.6,
  line1: 1.0, // total = 0
  line2: 4.0, // for i in range(1, 11):
  line3: 9.0, // total = total + i
  line4: 13.0, // print(total)
  guide: 9.5,
  strike: 5.0, // 11 위 빨간 줄 + 콜아웃
  strikeFadeOut: 7.0,
  table: 15.5,
  tableRowStagger: 0.32,
  tableLastPulse: 18.5,
  consoleResult: 19.5,
  resultLabel: 20.5,
} as const;

const cumulative = [
  { i: 1, total: 1 },
  { i: 2, total: 3 },
  { i: 3, total: 6 },
  { i: 4, total: 10 },
  { i: 5, total: 15 },
  { i: 6, total: 21 },
  { i: 7, total: 28 },
  { i: 8, total: 36 },
  { i: 9, total: 45 },
  { i: 10, total: 55 },
];

const TableRow: React.FC<{
  i: number;
  total: number;
  delaySec: number;
  isLast?: boolean;
}> = ({ i, total, delaySec, isLast = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = delaySec * fps;
  const reveal = interpolate(frame, [start, start + 0.3 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const pulse = isLast
    ? interpolate(
        frame,
        [
          REVEAL.tableLastPulse * fps,
          (REVEAL.tableLastPulse + 0.3) * fps,
          (REVEAL.tableLastPulse + 0.8) * fps,
          (REVEAL.tableLastPulse + 1.2) * fps,
        ],
        [0, 1, 1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
      )
    : 0;
  const totalColor = isLast ? colors.accentDeep : colors.ink;
  const cellStyle: React.CSSProperties = {
    padding: "8px 18px",
    fontFamily: fonts.mono,
    fontSize: 24,
    fontWeight: 700,
    color: colors.ink,
    letterSpacing: "-0.01em",
    textAlign: "center",
    minWidth: 90,
  };
  return (
    <tr
      style={{
        opacity: reveal,
        transform: `translateY(${(1 - reveal) * 6}px)`,
        background: isLast && pulse > 0.05 ? colors.accentSoft : "transparent",
        transitionProperty: "none",
      }}
    >
      <td style={{ ...cellStyle, color: colors.accentDeep }}>{i}</td>
      <td
        style={{
          ...cellStyle,
          color: totalColor,
          fontSize: isLast ? 28 : 24,
          fontWeight: isLast ? 800 : 700,
        }}
      >
        {total}
      </td>
    </tr>
  );
};

export const Scene05: React.FC = () => {
  return (
    <PageBackground>
      {/* 좌상단 시나리오 라벨 카드 */}
      <div
        style={{
          position: "absolute",
          top: 80,
          left: 96,
        }}
      >
        <FadeIn delaySec={REVEAL.scenarioCard} translateY={6}>
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
            시나리오 — 1부터 10까지의 합
          </div>
        </FadeIn>
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          padding: "180px 80px 80px",
          gap: 50,
        }}
      >
        {/* 좌측 60% — 코드 + 빨간 줄 콜아웃 */}
        <div
          style={{
            flex: "0 0 60%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <FadeIn delaySec={REVEAL.panel} translateY={20}>
            <div style={{ position: "relative" }}>
              <CodePanel fileName="sum.py" width={760} height={360}>
                <CodeLine lineNumber={1} revealAtSec={REVEAL.line1}>
                  <PyToken text="total" kind="name" />
                  <PyToken text=" " />
                  <PyToken text="=" kind="op" />
                  <PyToken text=" " />
                  <PyToken text="0" kind="number" />
                </CodeLine>
                <CodeLine lineNumber={2} revealAtSec={REVEAL.line2}>
                  <PyToken text="for" kind="keyword" />
                  <PyToken text=" " />
                  <PyToken text="i" kind="name" />
                  <PyToken text=" " />
                  <PyToken text="in" kind="keyword" />
                  <PyToken text=" " />
                  <PyToken text="range" kind="func" />
                  <PyToken text="(" kind="op" />
                  <PyToken text="1" kind="number" />
                  <PyToken text=", " kind="op" />
                  <PyToken text="11" kind="number" />
                  <PyToken text=")" kind="op" />
                  <PyToken text=":" kind="op" />
                </CodeLine>
                <CodeLine lineNumber={3} revealAtSec={REVEAL.line3}>
                  <PyToken text="    " />
                  <PyToken text="total" kind="name" />
                  <PyToken text=" " />
                  <PyToken text="=" kind="op" />
                  <PyToken text=" " />
                  <PyToken text="total" kind="name" />
                  <PyToken text=" " />
                  <PyToken text="+" kind="op" />
                  <PyToken text=" " />
                  <PyToken text="i" kind="name" />
                </CodeLine>
                <CodeLine lineNumber={4} revealAtSec={REVEAL.line4}>
                  <PyToken text="print" kind="func" />
                  <PyToken text="(" kind="op" />
                  <PyToken text="total" kind="name" />
                  <PyToken text=")" kind="op" />
                </CodeLine>
              </CodePanel>
              {/*
                3줄 (들여쓰기) 가이드 라인.
                패널 본문 padding 20 + 헤더 40 = 60. line-height 약 48.
                3줄 시작 ≈ 60 + 48*2 = 156. 줄번호 minWidth 22 + gap 18 ≈ 40 좌측 offset.
              */}
              <IndentGuide
                left={64}
                top={156}
                height={50}
                depth={1}
                delaySec={REVEAL.guide}
                durationSec={0.5}
              />

              {/* 11 위 빨간 줄 — 2줄 위치, range(1, 11) 의 11 부분 */}
              <div
                style={{
                  position: "absolute",
                  left: 380,
                  top: 90, // 2줄 ≈ 60 + 48 = 108, 살짝 위 (글자 baseline 기준)
                  pointerEvents: "none",
                }}
              >
                <FadeIn delaySec={REVEAL.strike} translateY={-6}>
                  <div
                    style={{
                      fontFamily: fonts.mono,
                      fontSize: 28,
                      color: colors.syntaxNumber,
                      fontWeight: 600,
                    }}
                  >
                    <RedStrike
                      delaySec={REVEAL.strike + 0.2}
                      durationSec={0.5}
                      lifespanSec={REVEAL.strikeFadeOut - REVEAL.strike}
                      fadeOutSec={0.5}
                    >
                      11
                    </RedStrike>
                  </div>
                </FadeIn>
              </div>

              {/* "11은 포함 안 됨" 콜아웃 — 코드 패널 오른쪽, 2줄 높이 */}
              <div
                style={{
                  position: "absolute",
                  left: 780, // 코드 패널 width 760 + gap 20
                  top: 96, // 2줄 세로 중심에 맞춤
                  pointerEvents: "none",
                }}
              >
                <FadeIn delaySec={REVEAL.strike + 0.4} translateY={-4}>
                  <div
                    style={{
                      padding: "4px 10px",
                      borderRadius: 6,
                      background: "rgba(239, 68, 68, 0.12)",
                      border: `1px solid ${colors.danger}`,
                      fontFamily: fonts.sans,
                      fontSize: 16,
                      fontWeight: 700,
                      color: colors.danger,
                      whiteSpace: "nowrap",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    <FadeOutWrapper sinceSec={REVEAL.strikeFadeOut} durationSec={0.5}>
                      11은 포함 안 됨
                    </FadeOutWrapper>
                  </div>
                </FadeIn>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* 우측 — 누적 표 + 콘솔 (스택 layout) */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 28,
            alignItems: "flex-start",
          }}
        >
          {/* 누적 표 */}
          <FadeIn delaySec={REVEAL.table} translateY={14}>
            <div
              style={{
                background: colors.bgWhite,
                border: `1.5px solid ${colors.border}`,
                borderRadius: 16,
                padding: "16px 20px 20px",
                boxShadow: shadows.cardSoft,
              }}
            >
              <table
                style={{
                  borderCollapse: "separate",
                  borderSpacing: 0,
                  fontFamily: fonts.mono,
                }}
              >
                <thead>
                  <tr>
                    <th
                      style={{
                        padding: "6px 18px",
                        fontFamily: fonts.sans,
                        fontSize: 18,
                        fontWeight: 700,
                        color: colors.inkMuted,
                        letterSpacing: "0.04em",
                        textTransform: "uppercase",
                        borderBottom: `1.5px solid ${colors.border}`,
                        textAlign: "center",
                        minWidth: 90,
                      }}
                    >
                      i
                    </th>
                    <th
                      style={{
                        padding: "6px 18px",
                        fontFamily: fonts.sans,
                        fontSize: 18,
                        fontWeight: 700,
                        color: colors.inkMuted,
                        letterSpacing: "0.04em",
                        textTransform: "uppercase",
                        borderBottom: `1.5px solid ${colors.border}`,
                        textAlign: "center",
                        minWidth: 90,
                      }}
                    >
                      total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cumulative.map((row, idx) => (
                    <TableRow
                      key={idx}
                      i={row.i}
                      total={row.total}
                      delaySec={REVEAL.table + idx * REVEAL.tableRowStagger}
                      isLast={idx === cumulative.length - 1}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </FadeIn>

          {/* 콘솔 결과 */}
          <FadeIn delaySec={REVEAL.consoleResult - 0.4} translateY={14}>
            <ConsolePanel title="출력 결과" width={400} height={130}>
              <ConsoleLine revealAtSec={REVEAL.consoleResult}>
                <span style={{ fontSize: 56, fontWeight: 800, color: colors.accentLight }}>55</span>
              </ConsoleLine>
            </ConsolePanel>
          </FadeIn>

          <FadeIn delaySec={REVEAL.resultLabel} translateY={6}>
            <div
              style={{
                fontFamily: fonts.sans,
                fontSize: 20,
                fontWeight: 600,
                color: colors.inkSoft,
                letterSpacing: "-0.01em",
              }}
            >
              1부터 10까지의 합 ={" "}
              <span style={{ color: colors.accentDeep, fontWeight: 800 }}>55</span>
            </div>
          </FadeIn>
        </div>
      </div>
    </PageBackground>
  );
};

/** 별도 fade-out wrapper — 자식이 sinceSec 부터 durationSec 동안 사라진다. */
const FadeOutWrapper: React.FC<{
  children: React.ReactNode;
  sinceSec: number;
  durationSec: number;
}> = ({ children, sinceSec, durationSec }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = sinceSec * fps;
  const end = start + durationSec * fps;
  const opacity = interpolate(frame, [start, end], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return <span style={{ opacity }}>{children}</span>;
};
