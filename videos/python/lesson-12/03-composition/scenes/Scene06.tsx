/**
 * Scene 6 — print 중간값 추적: 매 바퀴를 눈으로 (논리오류, 12강 시그니처, 28s)
 *
 * **12강 시그니처 = 가장 무게 큰 컷.** 00-objectives §6 + §2 학습목표 2.
 * scene-05 의 합계 버그 시나리오를 이어가 print 로 중간값을 추적한다.
 *
 * 코드는 scene-05 와 동일한 5줄(유효 Python — for 블록 본문 = print(합계)). 버그는
 * 네 번째 줄 `합계 = 합계 + n` 들여쓰기 0칸(블록 밖) → 합계가 안 자라 최종 3.
 *
 * - 0~5s: QuestionBox 정답 reveal (0.6 — narration "정답은 삼" 발화 동기, R-004).
 *         기대 `6` 회색 + 실제 `3` + ≠ 빨강. 라벨 "기대 6, 실제 3" (2.0).
 * - 5~13s: for 블록 안 `print(합계)` 줄(scene-05 부터 이어짐)을 violet-300 으로 강조
 *          (2.4 — narration "프린트를 한 줄 넣어" 동기, R-016). 버그 줄 `합계 = 합계 + n`
 *          들여쓰기 0칸을 빨간 RedIndentGuide 로 강조 (5.0, panel.height fit — R-021).
 * - 13~20s: 콘솔 매 바퀴 print(합계) — 합계가 0 에 멈춰 `0`/`0`/`0` → 최종 `3` (빨강)
 *           type-on (4.0~, fontSize 30 — R-001/R-017). 기대(0→1→3→6 회색) vs 실제 대비.
 * - 20~25s: 버그 줄 들여쓰기 4칸으로 교정 (8.0, 우측 슬라이드 + buffer). 동시에 콘솔이
 *           정상 출력 `0`/`1`/`3` + 최종 `6` 초록으로 크로스페이드. LowerThird (9.6).
 *
 * R-001/R-004/R-016/R-017/R-021 충족.
 * ⚠️ 내부 비트(printLineAdd/bugGuide/traceStart/fixSlide) 는 placeholder 타이밍 —
 *    narration 실측 재동기는 별도 라운드(R-004/R-027). answerReveal 만 실측 동기.
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
  QuestionBox,
  RedIndentGuide,
} from "../primitives";
import { colors, fonts } from "../theme";

const REVEAL = {
  answerReveal: 0.6, // narration "정답은 삼" 발화 동기 (R-004, wire re-sync)
  expectActualLabel: 2.0,
  printLineAdd: 2.4, // for 블록 안 print 줄 violet 강조 (narration "프린트를 넣어" 동기)
  bugGuide: 5.0, // 버그 줄 빨간 IndentGuide (narration "블록 밖" 동기)
  traceStart: 4.0, // 콘솔 매 바퀴 추적 시작
  traceStep: 1.0,
  fixSlide: 8.0, // 버그 줄 들여쓰기 교정 (우측 슬라이드) + 콘솔 0,0,0,3 → 0,1,3,6 크로스페이드
  lowerThird: 9.6,
} as const;

export const Scene06: React.FC = () => {
  return (
    <PageBackground>
      {/* Active Recall 정답 reveal (상단, scene-05 위치 이어받음) */}
      <div
        style={{
          position: "absolute",
          top: 96,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <QuestionBox
          question={
            <span>
              합계엔 <span style={{ color: colors.accentInk, fontWeight: 800 }}>얼마</span>가
              나올까요?
            </span>
          }
          answer="3"
          revealAtSec={REVEAL.answerReveal}
          delaySec={0}
          width={620}
        />
      </div>

      {/* 기대 vs 실제 라벨 */}
      <div
        style={{
          position: "absolute",
          top: 220,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <FadeIn delaySec={REVEAL.expectActualLabel} translateY={6}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 16,
              fontFamily: fonts.sans,
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: "-0.01em",
            }}
          >
            <span style={{ color: colors.inkMuted }}>
              기대 <span style={{ fontFamily: fonts.mono, fontWeight: 800 }}>6</span>
            </span>
            <span style={{ color: colors.dangerRed, fontSize: 32, fontWeight: 900 }}>≠</span>
            <span style={{ color: colors.dangerRedDeep }}>
              실제 <span style={{ fontFamily: fonts.mono, fontWeight: 800 }}>3</span>
            </span>
          </div>
        </FadeIn>
      </div>

      {/* 메인 row — 코드 패널 (print 추적 추가 + 버그 강조) | 콘솔 (매 바퀴) */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 330,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: 64,
        }}
      >
        <TracedCodePanel />
        <TraceConsole />
      </div>

      <LowerThird
        text={
          <span>
            에러 없어도 틀릴 수 있다 —{" "}
            <span style={{ fontFamily: fonts.mono, color: colors.accentLight, fontWeight: 700 }}>
              print
            </span>
            로 <span style={{ color: colors.accentLight, fontWeight: 700 }}>중간값</span>을 찍어라
          </span>
        }
        delaySec={REVEAL.lowerThird}
      />
    </PageBackground>
  );
};

/* ------------------------------------------------------------------ */
/* TracedCodePanel — print 줄 추가 + 버그 줄 빨간 IndentGuide + 교정 슬라이드 */
/* ------------------------------------------------------------------ */

// CodePanel: header 40 + content padding-top 20. line-box = 28*1.7 = 47.6, gap 6.
// 5 lines: 5*47.6 + 4*6 = 262 → +header 40 +padding 40 = 342 → height 360.
const CODE_H = 360;
// 버그 줄(line index 3 = 4번째 줄) y in content: top-pad 20 + 3*(47.6+6) = 180.8 → guide top ≈ header(40)+184 ≈ 224.
const BUG_GUIDE_TOP = 224;
const BUG_GUIDE_H = 44;
// 들여쓰기 4칸 슬라이드 폭 (mono 28 advance ≈ 16.8 → 4칸 ≈ 67)
const INDENT_SHIFT = 60;

const TracedCodePanel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // print 줄 violet-300 강조 (등장 직후 ~0.5s)
  const printHiStart = REVEAL.printLineAdd * fps;
  const printHi = interpolate(
    frame,
    [
      printHiStart,
      printHiStart + 0.3 * fps,
      (REVEAL.printLineAdd + 1.2) * fps,
      (REVEAL.printLineAdd + 1.6) * fps,
    ],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // 버그 줄 교정 슬라이드 (fixSlide 에 0칸 → 4칸. R-002 정신: 슬라이드 0.5s)
  const slideX = interpolate(
    frame,
    [REVEAL.fixSlide * fps, (REVEAL.fixSlide + 0.5) * fps],
    [0, INDENT_SHIFT],
    { easing: undefined, extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  // 교정 후 버그 강조(빨간 guide) 사라짐
  const guideFade = interpolate(
    frame,
    [REVEAL.fixSlide * fps, (REVEAL.fixSlide + 0.4) * fps],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <div style={{ position: "relative" }}>
      <CodePanel fileName="sum.py" width={720} height={CODE_H}>
        <CodeLine lineNumber={1} revealAtSec={0}>
          <PyToken text="합계" kind="name" /> <PyToken text="=" kind="op" />{" "}
          <PyToken text="0" kind="number" />
        </CodeLine>
        <CodeLine lineNumber={2} revealAtSec={0}>
          <PyToken text="for" kind="keyword" /> <PyToken text="n" kind="name" />{" "}
          <PyToken text="in" kind="keyword" /> <PyToken text="[1, 2, 3]" kind="number" />
          <PyToken text=":" kind="op" />
        </CodeLine>
        {/* for 블록 안 print 줄 (들여쓰기 4칸) — scene-05 부터 이어진 줄. "프린트를 넣어"
            발화 시점에 violet-300 으로 강조 (continuity 위해 처음부터 표시, type-on X) */}
        <CodeLine lineNumber={3} revealAtSec={0}>
          <span style={{ whiteSpace: "pre" }}>{"    "}</span>
          <span
            style={{
              background: printHi > 0.05 ? "rgba(196, 181, 253, 0.22)" : "transparent",
              borderRadius: 4,
              padding: "0 3px",
              outline: printHi > 0.05 ? `1.5px solid ${colors.accentLight}` : "none",
            }}
          >
            <PyToken text="print" kind="func" />
            <PyToken text="(" kind="op" />
            <PyToken text="합계" kind="name" />
            <PyToken text=")" kind="op" />
          </span>
        </CodeLine>
        {/* 버그 줄 — 들여쓰기 0칸 → 교정 슬라이드로 4칸 */}
        <CodeLine lineNumber={4} revealAtSec={0}>
          <span
            style={{
              display: "inline-block",
              transform: `translateX(${slideX}px)`,
            }}
          >
            <PyToken text="합계" kind="name" /> <PyToken text="=" kind="op" />{" "}
            <PyToken text="합계" kind="name" /> <PyToken text="+" kind="op" />{" "}
            <PyToken text="n" kind="name" />
          </span>
        </CodeLine>
        <CodeLine lineNumber={5} revealAtSec={0}>
          <PyToken text="print" kind="func" />
          <PyToken text="(" kind="op" />
          <PyToken text="합계" kind="name" />
          <PyToken text=")" kind="op" />
        </CodeLine>
      </CodePanel>

      {/* 버그 줄 빨간 IndentGuide (panel.height fit — R-021) */}
      <div style={{ opacity: guideFade }}>
        <RedIndentGuide
          left={60}
          top={BUG_GUIDE_TOP}
          height={BUG_GUIDE_H}
          delaySec={REVEAL.bugGuide}
        />
      </div>
      {/* 버그 줄 라벨 "블록 밖 — 버그" (패널 좌측 바깥, 버그 줄 y 에 맞춤) */}
      <div
        style={{
          position: "absolute",
          right: "100%",
          marginRight: 18,
          top: BUG_GUIDE_TOP + BUG_GUIDE_H / 2 - 18,
          opacity: guideFade,
        }}
      >
        <FadeIn delaySec={REVEAL.bugGuide} translateY={4}>
          <div
            style={{
              display: "inline-block",
              padding: "5px 14px",
              borderRadius: 999,
              background: colors.dangerRedSoft,
              color: colors.dangerRedDeep,
              border: `1.5px solid ${colors.dangerRedBorder}`,
              fontFamily: fonts.sans,
              fontSize: 20,
              fontWeight: 700,
              whiteSpace: "nowrap",
            }}
          >
            블록 밖 — 버그
          </div>
        </FadeIn>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* TraceConsole — 매 바퀴 추적: 기대(회색) vs 실제(갈라짐 빨강) + 교정 후 6  */
/* ------------------------------------------------------------------ */

const TraceConsole: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 교정(fixSlide)에 버그 출력(0,0,0,3) → 정상 출력(0,1,3,6) 크로스페이드
  const buggyOp = interpolate(
    frame,
    [REVEAL.fixSlide * fps, (REVEAL.fixSlide + 0.4) * fps],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
  const fixedOp = interpolate(
    frame,
    [(REVEAL.fixSlide + 0.3) * fps, (REVEAL.fixSlide + 0.7) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    // position: relative + 콘솔이 직접 자식 → flex-start row 에서 코드 패널 상단과 정렬.
    // 기대 라벨은 콘솔 위로 absolute (콘솔을 아래로 밀지 않음 — 코드박스와 높이 맞춤).
    <div style={{ position: "relative" }}>
      {/* 기대 흐름 (회색) — 콘솔 바로 위 (코드 패널 상단보다 위) */}
      <div
        style={{
          position: "absolute",
          left: 4,
          bottom: "calc(100% + 10px)",
          whiteSpace: "nowrap",
        }}
      >
        <FadeIn delaySec={REVEAL.traceStart - 0.4} translateY={6}>
          <div
            style={{
              fontFamily: fonts.sans,
              fontSize: 22,
              fontWeight: 600,
              color: colors.inkMuted,
              letterSpacing: "-0.01em",
            }}
          >
            기대: <span style={{ fontFamily: fonts.mono, fontWeight: 700 }}>0 → 1 → 3 → 6</span>
          </div>
        </FadeIn>
      </div>

      {/* 실제 콘솔 — 매 바퀴 print(합계). 버그: 합계가 안 자라 0,0,0 → 최종 3 (교정 시 0,1,3,6) */}
      <ConsolePanel title="실제 출력" width={360} height={360}>
        <div style={{ position: "relative", width: "100%" }}>
          {/* 버그 출력 layer — 합계가 0 에 멈춰 0,0,0 → 최종 3 (블록 밖 누적) */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6, opacity: buggyOp }}>
            <ConsoleLine revealAtSec={REVEAL.traceStart}>0</ConsoleLine>
            <ConsoleLine revealAtSec={REVEAL.traceStart + REVEAL.traceStep}>0</ConsoleLine>
            <ConsoleLine revealAtSec={REVEAL.traceStart + REVEAL.traceStep * 2}>0</ConsoleLine>
            <ResultRow
              revealAtSec={REVEAL.traceStart + REVEAL.traceStep * 3}
              value="3"
              color={colors.traceErrName}
            />
          </div>
          {/* 교정 출력 layer (absolute overlay) — 0,1,3 누적 → 최종 6 (초록) */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              gap: 6,
              opacity: fixedOp,
            }}
          >
            <ConsoleLine revealAtSec={0}>0</ConsoleLine>
            <ConsoleLine revealAtSec={0}>1</ConsoleLine>
            <ConsoleLine revealAtSec={0}>3</ConsoleLine>
            <ResultRow revealAtSec={0} value="6" color={colors.safeGreen} />
          </div>
        </div>
      </ConsolePanel>
    </div>
  );
};

/* 콘솔 최종 결과 줄 (구분선 + 큰 값) — 버그 3(빨강) / 교정 6(초록) */
const ResultRow: React.FC<{ revealAtSec: number; value: string; color: string }> = ({
  revealAtSec,
  value,
  color,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const r = interpolate(frame, [revealAtSec * fps, (revealAtSec + 0.4) * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        opacity: r,
        transform: `translateY(${(1 - r) * 6}px)`,
        marginTop: 8,
        paddingTop: 10,
        borderTop: `1px dashed ${colors.darkMuted}`,
        fontFamily: fonts.mono,
        fontSize: 32,
        fontWeight: 800,
        color,
        whiteSpace: "pre",
      }}
    >
      {value}
    </div>
  );
};
