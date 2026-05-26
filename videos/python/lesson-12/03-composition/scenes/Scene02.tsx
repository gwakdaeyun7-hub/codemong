/**
 * Scene 2 — 빨간 에러 재프레이밍: 혼내는 게 아니라 안내문 (문법오류 첫 노출, 22s)
 *
 * 00-objectives §4 오개념 1 (에러 = 비난, 얼어붙음) 의 정면 처치 — 12강 시그니처
 * 오개념 #1. 빨간 Traceback 을 _친절한 안내문_ 으로 재프레이밍.
 *
 * - 0~5s: 중앙 TracebackBox fade-in (delaySec 0.4) — 어두운 콘솔 + 좌측 빨간 막대.
 *         실제 에러 텍스트 4줄 (전부 안 읽음 — 화면 강조로 처리).
 * - 5~11s: ⚠ → 🔍 ReframeMark 교체 (warn 2.0 → swap 3.0, R-002 buffer 내장).
 *          박스 옅은 violet glow (glowAtSec 3.0). 옆 라벨 "겁먹지 말고 읽으세요"
 *          (delaySec 3.6).
 * - 11~18s: 하단 MisclassChips (delaySec 4.8) — `문법오류` 만 강조(나머지 톤다운),
 *           `문법오류` 펄스 (5.6 — narration "문법오류라고 부릅니다" ~15s 동기, R-016).
 *           LowerThird (delaySec 6.0).
 *
 * CodeMong 오답분류 세 단어를 _한국어 그대로_ 첫 노출 (00-objectives §8).
 * R-016 충족 (`문법오류` 펄스 = 발화 시점 동기, wire 단계 re-sync 대상).
 * R-024 충족 (⚠/🔍 마커 박스 안쪽 inset).
 */

import React from "react";
import {
  FadeIn,
  LowerThird,
  MisclassChips,
  PageBackground,
  ReframeMark,
  TraceLine,
  TracebackBox,
} from "../primitives";
import { colors, fonts } from "../theme";

const REVEAL = {
  boxEnter: 0.4,
  warnMark: 2.0,
  reframeSwap: 3.0,
  boxGlow: 3.0,
  readLabel: 3.6,
  chips: 4.8,
  chipPulse: 5.6, // narration "문법오류라고 부릅니다" ~15s 동기 (wire re-sync)
  lowerThird: 6.0,
} as const;

export const Scene02: React.FC = () => {
  return (
    <PageBackground>
      {/* 중앙 — 빨간 Traceback 박스 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: 150,
        }}
      >
        <FadeIn delaySec={REVEAL.boxEnter} translateY={20}>
          <div style={{ position: "relative" }}>
            <TracebackBox width={1040} glowAtSec={REVEAL.boxGlow}>
              <TraceLine revealAtSec={REVEAL.boxEnter}>
                {`Traceback (most recent call last):`}
              </TraceLine>
              <TraceLine revealAtSec={REVEAL.boxEnter + 0.2}>
                {`  File "main.py", line 3, in <module>`}
              </TraceLine>
              <TraceLine revealAtSec={REVEAL.boxEnter + 0.4} style={{ paddingLeft: 24 }}>
                <span style={{ color: colors.syntaxFunc }}>print</span>
                <span style={{ color: colors.traceMuted }}>(</span>
                <span style={{ color: colors.traceInk }}>scroe</span>
                <span style={{ color: colors.traceMuted }}>)</span>
              </TraceLine>
              <TraceLine revealAtSec={REVEAL.boxEnter + 0.6}>
                <span style={{ color: colors.traceErrName, fontWeight: 800 }}>NameError</span>
                <span>{`: name 'scroe' is not defined`}</span>
              </TraceLine>
            </TracebackBox>

            {/* ⚠ → 🔍 재프레이밍 마커 (박스 안쪽 좌측 상단 inset — R-024) */}
            <div style={{ position: "absolute", top: 18, right: 22 }}>
              <ReframeMark
                size={60}
                warnAtSec={REVEAL.warnMark}
                swapAtSec={REVEAL.reframeSwap}
              />
            </div>
          </div>
        </FadeIn>
      </div>

      {/* "겁먹지 말고 읽으세요" 라벨 (박스 아래) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          paddingBottom: 340,
        }}
      >
        <FadeIn delaySec={REVEAL.readLabel} translateY={8}>
          <div
            style={{
              fontFamily: fonts.sans,
              fontSize: 28,
              fontWeight: 600,
              color: colors.inkMuted,
              letterSpacing: "-0.01em",
            }}
          >
            겁먹지 말고{" "}
            <span style={{ color: colors.accentInk, fontWeight: 800 }}>읽으세요</span>
          </div>
        </FadeIn>
      </div>

      {/* 하단 오답분류 칩 (문법오류 강조) */}
      <div
        style={{
          position: "absolute",
          bottom: 168,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <MisclassChips
          delaySec={REVEAL.chips}
          activeIndex={0}
          pulseIndex={0}
          pulseAtSec={REVEAL.chipPulse}
        />
      </div>

      <LowerThird
        text={
          <span>
            <span style={{ color: colors.dangerRedBorder, fontWeight: 700 }}>빨간 에러</span>는{" "}
            혼내는 게 아니라{" "}
            <span style={{ color: colors.accentLight, fontWeight: 700 }}>알려주는</span> 안내문
          </span>
        }
        delaySec={REVEAL.lowerThird}
      />
    </PageBackground>
  );
};
