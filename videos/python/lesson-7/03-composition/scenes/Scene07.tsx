/**
 * Scene 7 — `del list[i]` 자리째 빼고 뒤 값 당기기 (12s)
 *
 * 학습 목표 3 세 번째 동작 / 오개념 2-c (`del` 후 자리 번호 변화 못 따라감)
 * 정면 처치.
 *
 * - 0~3s: scene-06 끝 상태 ListVisual — 박스 4개 [95, 92, 76, 100] +
 *         인덱스 띠 [0] [1] [2] [3] + 라벨 "길이 = 4" 유지.
 * - 3~6s: 중앙 코드 패널 한 줄 `del scores[1]` type-on (1.5s).
 *         `del` 토큰 violet-500 + fontWeight 800. `[1]` violet-300.
 * - 6~12s: 2단계 애니메이션 — 본 scene 은 직접 frame 기반으로 박스 전환을
 *         하드코딩 (ListVisual 의 outgoing state + sliding 박스 위치 직접
 *         interpolate).
 *           1단계 (1.5s): `[1]` (92) 위로 살짝 떠올랐다가 fade-out.
 *                         그 자리에 빈 공간.
 *           2단계 (1.5s): `[2]` (76) `[3]` (100) 가 왼쪽으로 한 칸씩 슬라이드.
 *                         도착 시 인덱스 띠가 `[0] [1] [2]` 로 재정렬.
 *                         라벨 swap fade-out → 0.2s buffer → fade-in (R-002).
 *         라벨 "길이 = 4" → "길이 = 3" swap. lower-third
 *         "1번 자리 빠짐 — 뒤 값들 한 칸씩 앞으로".
 */

import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import {
  CodeLine,
  CodePanel,
  FadeIn,
  LowerThird,
  PageBackground,
  PyToken,
  SwapLabel,
} from "../primitives";
import { colors, fonts, radii, shadows } from "../theme";

const easeOutCubic = Easing.bezier(0.16, 1, 0.3, 1);

// R-016 — narration (15.82s) 키워드 발화 시점 동기 (Stage 3 wire 조정).
//   "마지막 동작 ... 델을 씁니다" (~0~4.5s) — 도입 + codePanel
//   "델 스코어즈 대괄호 1" (~4.5~7s) — codeLine
//   "이 한 줄을 실행하면 ... 한 칸씩 앞으로 당겨집니다" (~7~13s) — remove + shift
//   "길이는 넷에서 셋으로 줄어듭니다" (~13~16s) — lengthSwap + lowerThird
const REVEAL = {
  initialFadeIn: 0.2,
  initialStripStart: 0.4,
  initialLengthLabel: 0.8,
  codePanel: 3.5,
  codeLine: 5.0, // narration "델 스코어즈 대괄호 1"
  // 1단계: [1] 박스 fade-out (위로 살짝 떠오름)
  removeStart: 8.0, // narration "1번 자리가 빠지고"
  removeEnd: 9.2,
  // 2단계: [2], [3] 왼쪽 슬라이드
  shiftStart: 10.0, // narration "한 칸씩 앞으로 당겨집니다"
  shiftEnd: 11.2,
  indexSwap: 11.5,
  lengthSwap: 13.5, // narration "넷에서 셋으로"
  lowerThird: 14.5,
} as const;

const BOX_SIZE = 130;
const GAP = 24;
const STEP = BOX_SIZE + GAP; // 한 칸 폭

/** 인덱스 띠 라벨 한 개. */
const IndexLabel: React.FC<{
  text: string;
  delaySec?: number;
  fadeOutAtSec?: number;
  translateXAtSec?: number;
  translateXFrom?: number;
  translateXTo?: number;
  highlighted?: boolean;
}> = ({ text, delaySec = 0, fadeOutAtSec, translateXAtSec, translateXFrom = 0, translateXTo = 0, highlighted = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = delaySec * fps;
  let opacity = interpolate(frame, [start, start + 0.4 * fps], [0, 1], {
    easing: easeOutCubic,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (typeof fadeOutAtSec === "number") {
    const fadeOutStart = fadeOutAtSec * fps;
    const fadeOutFactor = interpolate(frame, [fadeOutStart, fadeOutStart + 0.4 * fps], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    opacity = Math.min(opacity, fadeOutFactor);
  }
  let translateX = 0;
  if (typeof translateXAtSec === "number") {
    const ts = translateXAtSec * fps;
    const te = ts + 1.2 * fps;
    translateX = interpolate(frame, [ts, te], [translateXFrom, translateXTo], {
      easing: easeOutCubic,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  }
  return (
    <div
      style={{
        width: BOX_SIZE,
        display: "flex",
        justifyContent: "center",
        position: "absolute",
        opacity,
        transform: `translateX(${translateX}px)`,
      }}
    >
      <div
        style={{
          fontFamily: fonts.mono,
          fontSize: 26,
          fontWeight: 700,
          color: colors.accentInk,
          letterSpacing: "-0.01em",
          padding: "2px 10px",
          borderRadius: radii.sm,
          background: highlighted ? colors.accentSoft : "transparent",
          border: highlighted ? `1.5px solid ${colors.accent}` : "1.5px solid transparent",
          opacity: 0.85,
        }}
      >
        {text}
      </div>
    </div>
  );
};

/** 박스 한 개. position 은 absolute 로 직접 제어. */
const ValueBox: React.FC<{
  value: React.ReactNode;
  delaySec?: number;
  fadeOutAtSec?: number;
  liftAtSec?: number;
  liftAmount?: number;
  translateXAtSec?: number;
  translateXFrom?: number;
  translateXTo?: number;
}> = ({
  value,
  delaySec = 0,
  fadeOutAtSec,
  liftAtSec,
  liftAmount = -30,
  translateXAtSec,
  translateXFrom = 0,
  translateXTo = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = delaySec * fps;
  let opacity = interpolate(frame, [start, start + 0.5 * fps], [0, 1], {
    easing: easeOutCubic,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  let liftY = 0;
  if (typeof liftAtSec === "number") {
    const ls = liftAtSec * fps;
    const le = ls + 1.2 * fps;
    liftY = interpolate(frame, [ls, le], [0, liftAmount], {
      easing: easeOutCubic,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  }
  if (typeof fadeOutAtSec === "number") {
    const fo = fadeOutAtSec * fps;
    const fadeOutFactor = interpolate(frame, [fo, fo + 0.8 * fps], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    opacity = Math.min(opacity, fadeOutFactor);
  }
  let translateX = 0;
  if (typeof translateXAtSec === "number") {
    const ts = translateXAtSec * fps;
    const te = ts + 1.2 * fps;
    translateX = interpolate(frame, [ts, te], [translateXFrom, translateXTo], {
      easing: easeOutCubic,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  }
  return (
    <div
      style={{
        width: BOX_SIZE,
        height: BOX_SIZE,
        borderRadius: 20,
        background: colors.bgWhite,
        border: `3px solid ${colors.accent}`,
        boxShadow: shadows.card,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: fonts.mono,
        fontSize: 52,
        fontWeight: 800,
        color: colors.accentDeep,
        letterSpacing: "-0.02em",
        opacity,
        transform: `translate(${translateX}px, ${liftY}px)`,
        position: "absolute",
      }}
    >
      {value}
    </div>
  );
};

export const Scene07: React.FC = () => {
  return (
    <PageBackground>
      <div style={{ position: "absolute", top: 50, left: 0, right: 0, textAlign: "center" }}>
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
            자리째 빼기 — <span style={{ fontFamily: fonts.mono }}>del</span>
          </div>
        </FadeIn>
      </div>

      {/* 박스 4개 + 인덱스 띠 — absolute 로 직접 배치 */}
      {/* 컨테이너 전체 폭 = 4*BOX + 3*GAP = 4*130 + 3*24 = 592 */}
      <div
        style={{
          position: "absolute",
          top: 170,
          left: "50%",
          transform: "translateX(-50%)",
          width: 4 * BOX_SIZE + 3 * GAP,
          height: BOX_SIZE + 80,
        }}
      >
        {/* 인덱스 띠 (위쪽) */}
        <div style={{ position: "absolute", left: 0, top: 0, width: "100%", height: 36 }}>
          {[0, 1, 2, 3].map((i) => {
            // i=1: del 후 fade-out (인덱스 [1] 사라짐)
            // i=2, 3: 슬라이드 후 라벨 swap → [1], [2]
            if (i === 0) {
              return (
                <div key={i} style={{ position: "absolute", left: 0 + i * STEP, top: 0 }}>
                  <IndexLabel text="[0]" delaySec={REVEAL.initialStripStart} />
                </div>
              );
            }
            if (i === 1) {
              return (
                <div key={i} style={{ position: "absolute", left: 0 + i * STEP, top: 0 }}>
                  <IndexLabel
                    text="[1]"
                    delaySec={REVEAL.initialStripStart + 0.2}
                    fadeOutAtSec={REVEAL.removeStart}
                  />
                </div>
              );
            }
            if (i === 2) {
              // [2] 라벨 fade-out, 그리고 슬라이드 후 [1] 새 라벨 fade-in
              return (
                <React.Fragment key={i}>
                  <div style={{ position: "absolute", left: 0 + i * STEP, top: 0 }}>
                    <IndexLabel
                      text="[2]"
                      delaySec={REVEAL.initialStripStart + 0.4}
                      fadeOutAtSec={REVEAL.indexSwap}
                      translateXAtSec={REVEAL.shiftStart}
                      translateXFrom={0}
                      translateXTo={-STEP}
                    />
                  </div>
                  <div style={{ position: "absolute", left: 0 + 1 * STEP, top: 0 }}>
                    <IndexLabel
                      text="[1]"
                      delaySec={REVEAL.indexSwap + 0.6}
                      highlighted={false}
                    />
                  </div>
                </React.Fragment>
              );
            }
            if (i === 3) {
              return (
                <React.Fragment key={i}>
                  <div style={{ position: "absolute", left: 0 + i * STEP, top: 0 }}>
                    <IndexLabel
                      text="[3]"
                      delaySec={REVEAL.initialStripStart + 0.6}
                      fadeOutAtSec={REVEAL.indexSwap}
                      translateXAtSec={REVEAL.shiftStart}
                      translateXFrom={0}
                      translateXTo={-STEP}
                    />
                  </div>
                  <div style={{ position: "absolute", left: 0 + 2 * STEP, top: 0 }}>
                    <IndexLabel
                      text="[2]"
                      delaySec={REVEAL.indexSwap + 0.6}
                    />
                  </div>
                </React.Fragment>
              );
            }
            return null;
          })}
        </div>

        {/* 박스 4개 */}
        <div style={{ position: "absolute", left: 0, top: 50, width: "100%", height: BOX_SIZE }}>
          {/* [0] 95 — 그대로 */}
          <div style={{ position: "absolute", left: 0 * STEP, top: 0 }}>
            <ValueBox value="95" delaySec={REVEAL.initialFadeIn} />
          </div>
          {/* [1] 92 — del 후 위로 떠올라 fade-out */}
          <div style={{ position: "absolute", left: 1 * STEP, top: 0 }}>
            <ValueBox
              value="92"
              delaySec={REVEAL.initialFadeIn + 0.1}
              liftAtSec={REVEAL.removeStart}
              liftAmount={-50}
              fadeOutAtSec={REVEAL.removeStart + 0.4}
            />
          </div>
          {/* [2] 76 — 슬라이드 한 칸 왼쪽 */}
          <div style={{ position: "absolute", left: 2 * STEP, top: 0 }}>
            <ValueBox
              value="76"
              delaySec={REVEAL.initialFadeIn + 0.2}
              translateXAtSec={REVEAL.shiftStart}
              translateXFrom={0}
              translateXTo={-STEP}
            />
          </div>
          {/* [3] 100 — 슬라이드 한 칸 왼쪽 */}
          <div style={{ position: "absolute", left: 3 * STEP, top: 0 }}>
            <ValueBox
              value="100"
              delaySec={REVEAL.initialFadeIn + 0.3}
              translateXAtSec={REVEAL.shiftStart}
              translateXFrom={0}
              translateXTo={-STEP}
            />
          </div>
        </div>
      </div>

      {/* 길이 라벨 swap (4 → 3) */}
      <div
        style={{
          position: "absolute",
          top: 410,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <FadeIn delaySec={REVEAL.initialLengthLabel} translateY={6} durationSec={0.4}>
          <SwapLabel
            initial={
              <span
                style={{
                  padding: "6px 18px",
                  borderRadius: radii.pill,
                  background: colors.borderSoft,
                  border: `1.5px solid ${colors.border}`,
                  fontFamily: fonts.sans,
                  fontSize: 22,
                  fontWeight: 700,
                  color: colors.inkSoft,
                  letterSpacing: "-0.01em",
                }}
              >
                길이 = 4
              </span>
            }
            newLabel={
              <span
                style={{
                  padding: "6px 18px",
                  borderRadius: radii.pill,
                  background: colors.accentSoft,
                  border: `1.5px solid ${colors.accent}`,
                  fontFamily: fonts.sans,
                  fontSize: 22,
                  fontWeight: 800,
                  color: colors.accentDeep,
                  letterSpacing: "-0.01em",
                }}
              >
                길이 = 3
              </span>
            }
            swapAtSec={REVEAL.lengthSwap}
          />
        </FadeIn>
      </div>

      {/* 코드 패널 */}
      <div
        style={{
          position: "absolute",
          top: 510,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <FadeIn delaySec={REVEAL.codePanel} translateY={18}>
          <CodePanel fileName="remove.py" width={680} height={130}>
            <CodeLine lineNumber={1} revealAtSec={REVEAL.codeLine}>
              <PyToken
                text="del"
                kind="keyword"
                style={{ fontWeight: 800, color: colors.accent }}
              />
              <PyToken text=" " />
              <PyToken text="scores" kind="name" />
              <PyToken text="[" kind="op" />
              <PyToken text="1" kind="number" highlight />
              <PyToken text="]" kind="op" />
            </CodeLine>
          </CodePanel>
        </FadeIn>
      </div>

      <LowerThird
        text={<>1번 자리 빠짐 — 뒤 값들 한 칸씩 앞으로</>}
        delaySec={REVEAL.lowerThird}
      />
    </PageBackground>
  );
};
