/**
 * Scene 5 — 불러오기 코드: 모드만 `"w"` → `"r"` letter swap (16s)
 *
 * - 0~4s: 화면 중앙에 시그니처 한 줄 fade-in (delaySec 1.2):
 *         `with open("memo.txt", "w") as f:`
 * - 4~10s: `"w"` 토큰만 강조 (delaySec 2.4 한 번 펄스). 그 다음 `"w"` 가
 *         letter swap 으로 `"r"` 로 (R-002: fade-out [2.4, 2.8] → buffer 0.2s →
 *         fade-in [3.0, 3.4]). `"r"` swap 직후 펄스 (delaySec 4.6).
 *         narration "알" 발화 시점 ~9s 와 동기 (R-016).
 * - 10~16s: LowerThird fade-in (delaySec 6.0):
 *           `"w"` → `"r"` — _딱 한 글자_, _저장_ → _읽기_.
 *
 * R-002 충족: oldFadeOut [2.4, 2.8] → 0.2s buffer → newFadeIn [3.0, 3.4].
 * R-019 충족: SwapLabel parent + 두 layer 모두 whiteSpace: nowrap.
 */

import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import {
  FadeIn,
  LowerThird,
  PageBackground,
  SwapLabel,
} from "../primitives";
import { colors, fonts, radii } from "../theme";

const REVEAL = {
  lineEnter: 1.2,
  modeOldFadeOut: 2.4,
  modeNewFadeIn: 3.0, // 0.2s buffer (R-002)
  modePulseAt: 4.6, // "r" swap 직후 펄스
  rePulseAt: 9.0, // narration "알" 발화 시점 동기 (R-016)
  lowerThird: 6.0,
} as const;

export const Scene05: React.FC = () => {
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
            불러오기 — 모드만 한 글자 바꾸면
          </div>
        </FadeIn>
      </div>

      {/* 중앙 — 시그니처 한 줄 + 모드 자리 swap */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: 200,
        }}
      >
        <FadeIn delaySec={REVEAL.lineEnter} translateY={16}>
          <div
            style={{
              fontFamily: fonts.mono,
              fontSize: 64,
              fontWeight: 800,
              color: colors.ink,
              letterSpacing: "-0.02em",
              whiteSpace: "nowrap",
              display: "inline-flex",
              alignItems: "baseline",
            }}
          >
            <span>{`with open("memo.txt", `}</span>
            {/* 모드 자리 — swap */}
            <ModeSwapToken />
            <span>{`) as f:`}</span>
          </div>
        </FadeIn>
      </div>

      {/* 아래 보조 라벨 — "딱 한 글자" 강조 (swap 직후 fade-in) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          paddingBottom: 360,
        }}
      >
        <FadeIn delaySec={REVEAL.modeNewFadeIn + 0.5} translateY={10}>
          <div
            style={{
              fontFamily: fonts.sans,
              fontSize: 30,
              fontWeight: 700,
              color: colors.inkSoft,
              letterSpacing: "-0.01em",
            }}
          >
            <span
              style={{
                fontFamily: fonts.mono,
                color: colors.fourBoxPinkDeep,
                fontWeight: 800,
              }}
            >
              "w"
            </span>{" "}
            →{" "}
            <span
              style={{
                fontFamily: fonts.mono,
                color: colors.fourBoxPinkDeep,
                fontWeight: 800,
              }}
            >
              "r"
            </span>{" "}
            ·{" "}
            <span style={{ color: colors.accentInk, fontWeight: 800 }}>
              딱 한 글자
            </span>
          </div>
        </FadeIn>
      </div>

      <LowerThird
        text={
          <span>
            <span style={{ fontFamily: fonts.mono, color: colors.accentLight }}>
              "w"
            </span>{" "}
            →{" "}
            <span style={{ fontFamily: fonts.mono, color: colors.accentLight }}>
              "r"
            </span>{" "}
            —{" "}
            <span style={{ color: colors.accentLight, fontWeight: 700 }}>
              저장 → 읽기
            </span>
          </span>
        }
        delaySec={REVEAL.lowerThird}
      />
    </PageBackground>
  );
};

/** 모드 자리 — "w" → "r" letter swap + 펄스 */
const ModeSwapToken: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // "r" swap 직후 펄스
  const modePulseStart = REVEAL.modePulseAt * fps;
  const modePulse = interpolate(
    frame,
    [modePulseStart, modePulseStart + 0.25 * fps, modePulseStart + 0.6 * fps, modePulseStart + 1.0 * fps],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  // narration "알" 발화 시점 펄스
  const rePulseStart = REVEAL.rePulseAt * fps;
  const rePulse = interpolate(
    frame,
    [rePulseStart, rePulseStart + 0.25 * fps, rePulseStart + 0.6 * fps, rePulseStart + 1.0 * fps],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const totalPulse = Math.max(modePulse, rePulse);

  return (
    <SwapLabel
      oldFadeOutAtSec={REVEAL.modeOldFadeOut}
      newFadeInAtSec={REVEAL.modeNewFadeIn}
      fadeDurationSec={0.4}
      initial={
        <span
          style={{
            display: "inline-block",
            padding: "0 4px",
            background: colors.fourBoxPinkSoft,
            color: colors.fourBoxPinkDeep,
            borderRadius: 4,
            whiteSpace: "nowrap",
          }}
        >
          "w"
        </span>
      }
      newLabel={
        <span
          style={{
            display: "inline-block",
            padding: "0 4px",
            background: colors.fourBoxPinkSoft,
            color: colors.fourBoxPinkDeep,
            borderRadius: 4,
            outline:
              totalPulse > 0.05
                ? `3px solid ${colors.fourBoxPinkBorder}`
                : `0 solid transparent`,
            whiteSpace: "nowrap",
          }}
        >
          "r"
        </span>
      }
    />
  );
};
