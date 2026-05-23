/**
 * Scene 5 — 점 표기 분해 (4분해 시그니처 시각 장치, 18s)
 *
 * **lesson-10 시그니처 시각 장치.**
 *
 * - 0~3s: 화면 중앙 `random.randint(1, 6)` 큰 글자 (fontSize 64, mono) fade-in.
 * - 3~13s: 4부분이 sequential 색깔 박스로 분해되며 펼쳐짐 (delaySec 차이 1.0초):
 *   - `random` (delaySec 1.0, accent) — "상자 이름"
 *   - `.`      (delaySec 2.0, yellow) — "안으로 들어간다"
 *   - `randint` (delaySec 3.0, pink) — "도구 이름"
 *   - `(1, 6)` (delaySec 4.0, blue) — "넘기는 값"
 * - 13~18s: 4 박스 정상 위치 유지. `.` 박스 한 번 펄스 (R-016 동기 — narration
 *   "점은 상자 안의 도구를 꺼낸다" 14s 발화 시점). LowerThird fade-in:
 *   "_점_ — _상자 안의 도구를 꺼낸다_".
 *
 * R-009: 코드 토큰 (random / randint) 모두 소문자 그대로. textTransform 미사용.
 * R-016: `.` 박스 펄스가 narration 발화 시점 (≈14s) 와 동기.
 * R-025: 4분해는 sequential 시리즈이지만 "첫 번째 / 두 번째" 라벨이 아니라
 *   의미 라벨 ("상자 이름" 등) — 시리즈 정형이 아니라 의미 분해이므로 면제.
 */

import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import {
  FadeIn,
  FourPartBox,
  FourPartBoxPart,
  LowerThird,
  PageBackground,
} from "../primitives";
import { colors, fonts } from "../theme";

const REVEAL = {
  bigCode: 0.2,
  bigCodeFadeOut: 3.0,
  part1: 4.0, // random
  part2: 5.0, // .
  part3: 6.0, // randint
  part4: 7.0, // (1, 6)
  dotPulse: 14.0, // narration "점은 상자 안의 도구를 꺼낸다" 발화 시점
  lowerThird: 13.6,
} as const;

const parts: FourPartBoxPart[] = [
  {
    token: "random",
    meaningLabel: "상자 이름",
    color: "accent",
    enterAtSec: REVEAL.part1,
  },
  {
    token: ".",
    meaningLabel: "안으로 들어간다",
    color: "yellow",
    enterAtSec: REVEAL.part2,
    pulseAtSec: REVEAL.dotPulse,
  },
  {
    token: "randint",
    meaningLabel: "도구 이름",
    color: "pink",
    enterAtSec: REVEAL.part3,
  },
  {
    token: "(1, 6)",
    meaningLabel: "넘기는 값",
    color: "blue",
    enterAtSec: REVEAL.part4,
  },
];

export const Scene05: React.FC = () => {
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
        <FadeIn delaySec={0.1} translateY={6}>
          <div
            style={{
              fontFamily: fonts.sans,
              fontSize: 28,
              fontWeight: 700,
              color: colors.accentDeep,
              letterSpacing: "-0.01em",
            }}
          >
            점 표기 — 네 부분으로 뜯어보기
          </div>
        </FadeIn>
      </div>

      {/* 중앙 — 큰 코드 (0~3s) → 4분해 박스 (3~) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 0,
          paddingBottom: 60,
        }}
      >
        {/* 큰 코드 */}
        <BigCode />

        {/* 간격 */}
        <div style={{ height: 56 }} />

        {/* 4분해 박스 */}
        <FourPartBox parts={parts} tokenFontSize={56} labelFontSize={22} gap={18} />
      </div>

      <LowerThird
        text={
          <>
            <span style={{ fontFamily: fonts.mono, color: colors.accentLight }}>
              .
            </span>{" "}
            — 상자 안의 도구를 꺼낸다
          </>
        }
        delaySec={REVEAL.lowerThird}
      />
    </PageBackground>
  );
};

/** 중앙 큰 코드 `random.randint(1, 6)` — 0.2s 등장, 3s 부터 fade-out */
const BigCode: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enterStart = REVEAL.bigCode * fps;
  const enter = interpolate(frame, [enterStart, enterStart + 0.6 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const fadeStart = REVEAL.bigCodeFadeOut * fps;
  const fade = interpolate(frame, [fadeStart, fadeStart + 0.5 * fps], [1, 0.25], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        opacity: enter * fade,
        transform: `translateY(${(1 - enter) * 8}px)`,
        fontFamily: fonts.mono,
        fontSize: 64,
        fontWeight: 800,
        color: colors.ink,
        letterSpacing: "-0.02em",
        lineHeight: 1,
      }}
    >
      random.randint(1, 6)
    </div>
  );
};
