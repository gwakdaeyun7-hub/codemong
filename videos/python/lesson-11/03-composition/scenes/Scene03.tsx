/**
 * Scene 3 — 저장 시그니처 한 줄 + 4분해 (22s)
 *
 * 11강의 시그니처 시각 장치 — `with open("memo.txt", "w") as f:` 한 줄을
 * 네 부분으로 색깔 다른 박스로 분해 (lesson-10 Scene05 4분해 정형 답습).
 *
 * - 0~4s: 중앙에 큰 글씨 한 줄 fade-in (delaySec 0.2, fontSize 56 mono).
 *         줄 전체가 한 번 짧게 violet-300 펄스.
 * - 4~16s: 한 줄이 네 부분으로 sequential 박스 분해 (delaySec 차이 1.2초씩):
 *   - `open`        (delaySec 2.4) — accent (도구)
 *   - `"memo.txt"`  (delaySec 3.6) — yellow (파일 이름)
 *   - `"w"`         (delaySec 4.8) — pink (어떤 방식)
 *   - `as f`        (delaySec 6.0) — blue (이름표)
 * - 16~22s: LowerThird fade-in (delaySec 7.6).
 *           `"w"` 박스 한 번 더 펄스 (narration "쓰기 모드" 발화 시점 ~14s).
 */

import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import {
  FadeIn,
  FourPartBox,
  LowerThird,
  PageBackground,
} from "../primitives";
import { colors, fonts, radii } from "../theme";

const REVEAL = {
  signature: 0.2,
  signaturePulseAt: 0.6,
  signatureFadeStart: 2.0,
  signatureFadeEnd: 2.6,
  // 4분해 시작 시점 (signature fade-out 후 0.2s buffer = R-002)
  partOpen: 2.8,
  partFile: 4.0,
  partMode: 5.2,
  partAs: 6.4,
  modePulseAt: 14.0, // narration "쓰기 모드" 발화 시점
  lowerThird: 7.6,
} as const;

export const Scene03: React.FC = () => {
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
        <FadeIn delaySec={0.1} translateY={6}>
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
            저장하는 코드 — 네 부분으로 뜯어보기
          </div>
        </FadeIn>
      </div>

      {/* 중앙 — 시그니처 한 줄 (fade-out 후 4분해 등장) */}
      <SignatureLine />

      {/* 4분해 박스 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: 80,
          paddingBottom: 200,
        }}
      >
        <FourPartBox
          tokenFontSize={64}
          labelFontSize={24}
          gap={20}
          parts={[
            {
              token: "open",
              meaningLabel: "도구",
              color: "accent",
              enterAtSec: REVEAL.partOpen,
            },
            {
              token: '"memo.txt"',
              meaningLabel: "파일 이름",
              color: "yellow",
              enterAtSec: REVEAL.partFile,
            },
            {
              token: '"w"',
              meaningLabel: "어떤 방식 (쓰기)",
              color: "pink",
              enterAtSec: REVEAL.partMode,
              pulseAtSec: REVEAL.modePulseAt,
            },
            {
              token: "as f",
              meaningLabel: "이름표",
              color: "blue",
              enterAtSec: REVEAL.partAs,
            },
          ]}
        />
      </div>

      <LowerThird
        text={
          <span>
            <span style={{ color: colors.accentLight, fontWeight: 700 }}>
              파일 이름 · 모드 · 이름표
            </span>{" "}
            — 세 가지를 정해 연다
          </span>
        }
        delaySec={REVEAL.lowerThird}
      />
    </PageBackground>
  );
};

/** 시그니처 한 줄 — 등장 + 잠깐 펄스 + fade-out */
const SignatureLine: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enterStart = REVEAL.signature * fps;
  const enter = interpolate(frame, [enterStart, enterStart + 0.5 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeStart = REVEAL.signatureFadeStart * fps;
  const fadeEnd = REVEAL.signatureFadeEnd * fps;
  const fadeOut = interpolate(frame, [fadeStart, fadeEnd], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = enter * fadeOut;

  // 짧은 violet-300 펄스 (signaturePulseAt ~ +0.6s)
  const pulseStart = REVEAL.signaturePulseAt * fps;
  const pulse = interpolate(
    frame,
    [pulseStart, pulseStart + 0.25 * fps, pulseStart + 0.6 * fps, pulseStart + 1.0 * fps],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <div
      style={{
        position: "absolute",
        top: 280,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        opacity,
        transform: `translateY(${(1 - enter) * 16}px)`,
      }}
    >
      <span
        style={{
          fontFamily: fonts.mono,
          fontSize: 56,
          fontWeight: 800,
          color: pulse > 0.1 ? colors.accentDeep : colors.ink,
          letterSpacing: "-0.02em",
          whiteSpace: "pre",
          lineHeight: 1.2,
        }}
      >
        {`with open("memo.txt", "w") as f:`}
      </span>
    </div>
  );
};
