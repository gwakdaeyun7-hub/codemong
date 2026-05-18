/**
 * Scene 2 — 비효율 hook + 오늘 흐름 (10s)
 *
 * "한 반 학생 서른 명의 점수" — 변수 30개 vs 묶음 하나 hook.
 *
 * - 0~5s: 좌측 60% 코드 에디터에 s1=88, s2=92, s3=76, ..., s30=85 type-on.
 *         5줄 보인 뒤 `...` 길게 늘어짐. 좌측 회색 중괄호 + 라벨 "서른 줄 — 부담".
 * - 5~10s: 우측 violet-500 큰 화살표 + 한 줄 묶음 박스 시각화
 *         `[88, 92, 76, ..., 85]`. 좌측 코드 opacity 0.4 로 톤 다운 (자연 swap).
 *         라벨 "묶음 하나로 — 한 줄".
 */

import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import {
  CodeLine,
  CodePanel,
  FadeIn,
  PageBackground,
  PyToken,
} from "../primitives";
import { colors, fonts, radii, shadows } from "../theme";

// R-016 — narration (11.20s) 키워드 발화 시점 동기 (Stage 3 wire 조정).
//   "한 반 학생 서른 명의 점수" (~0~3.5s) — 코드 줄 등장
//   "변수를 서른 개 따로" (~3.5~6s) — 부담 라벨
//   "하나의 묶음에 담는" (~6~9.5s) — 화살표 + 묶음 박스
//   "오늘 다룰 리스트입니다" (~9.5~11s) — 묶음 라벨
const REVEAL = {
  codePanel: 0.2,
  line1: 0.6,
  line2: 1.1,
  line3: 1.6,
  dots: 2.4,
  line30: 3.3,
  burdenLabel: 4.2,
  dimDown: 6.5, // 좌측 코드 톤 다운 (묶음 전환 직전)
  arrow: 7.0,
  bundleBox: 7.5,
  bundleLabel: 9.5,
} as const;

/** 좌측 코드 패널이 fade 5.0s 이후 0.4 opacity 로 톤 다운. */
const DimWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = REVEAL.dimDown * fps;
  const end = (REVEAL.dimDown + 0.8) * fps;
  const dim = interpolate(frame, [start, end], [1.0, 0.4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return <div style={{ opacity: dim }}>{children}</div>;
};

export const Scene02: React.FC = () => {
  return (
    <PageBackground>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          padding: "120px 96px 100px",
          gap: 70,
        }}
      >
        {/* 좌측 60% — 코드 30줄 mock (5줄 + ... + 30번째) */}
        <div
          style={{
            flex: "0 0 60%",
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            position: "relative",
          }}
        >
          <DimWrapper>
            <FadeIn delaySec={REVEAL.codePanel} translateY={18}>
              <CodePanel fileName="scores.py" width={780} height={520}>
                <CodeLine lineNumber={1} revealAtSec={REVEAL.line1}>
                  <PyToken text="s1" kind="name" />
                  <PyToken text=" = " kind="op" />
                  <PyToken text="88" kind="number" />
                </CodeLine>
                <CodeLine lineNumber={2} revealAtSec={REVEAL.line2}>
                  <PyToken text="s2" kind="name" />
                  <PyToken text=" = " kind="op" />
                  <PyToken text="92" kind="number" />
                </CodeLine>
                <CodeLine lineNumber={3} revealAtSec={REVEAL.line3}>
                  <PyToken text="s3" kind="name" />
                  <PyToken text=" = " kind="op" />
                  <PyToken text="76" kind="number" />
                </CodeLine>
                <CodeLine revealAtSec={REVEAL.dots}>
                  <PyToken text="..." kind="comment" />
                </CodeLine>
                <CodeLine revealAtSec={REVEAL.dots + 0.4}>
                  <PyToken text="..." kind="comment" />
                </CodeLine>
                <CodeLine revealAtSec={REVEAL.dots + 0.8}>
                  <PyToken text="..." kind="comment" />
                </CodeLine>
                <CodeLine lineNumber={30} revealAtSec={REVEAL.line30}>
                  <PyToken text="s30" kind="name" />
                  <PyToken text=" = " kind="op" />
                  <PyToken text="85" kind="number" />
                </CodeLine>
              </CodePanel>
            </FadeIn>
          </DimWrapper>

          {/* "서른 줄 — 부담" 라벨 — 패널 좌측에 회색 큰 중괄호 + 라벨 */}
          <div
            style={{
              position: "absolute",
              top: 240,
              right: -40,
              pointerEvents: "none",
            }}
          >
            <FadeIn delaySec={REVEAL.burdenLabel} translateY={10} durationSec={0.5}>
              <div
                style={{
                  padding: "10px 18px",
                  borderRadius: radii.pill,
                  background: colors.borderSoft,
                  border: `1.5px solid ${colors.border}`,
                  color: colors.inkMuted,
                  fontFamily: fonts.sans,
                  fontSize: 22,
                  fontWeight: 700,
                  letterSpacing: "-0.01em",
                  whiteSpace: "nowrap",
                  boxShadow: shadows.cardSoft,
                }}
              >
                서른 줄 — 부담
              </div>
            </FadeIn>
          </div>
        </div>

        {/* 우측 — 화살표 + 묶음 한 줄 */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 28,
          }}
        >
          {/* 큰 화살표 → */}
          <FadeIn delaySec={REVEAL.arrow} translateY={0} durationSec={0.5}>
            <div
              style={{
                fontFamily: fonts.sans,
                fontSize: 92,
                fontWeight: 800,
                color: colors.accent,
                lineHeight: 1,
              }}
            >
              →
            </div>
          </FadeIn>

          {/* 묶음 박스 한 줄 */}
          <FadeIn delaySec={REVEAL.bundleBox} translateY={14} durationSec={0.6}>
            <div
              style={{
                padding: "28px 30px",
                borderRadius: 24,
                background: colors.bgWhite,
                border: `3px solid ${colors.accent}`,
                boxShadow: shadows.card,
                fontFamily: fonts.mono,
                fontSize: 42,
                fontWeight: 800,
                color: colors.accentDeep,
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
                whiteSpace: "nowrap",
              }}
            >
              [88, 92, 76, ..., 85]
            </div>
          </FadeIn>

          {/* 묶음 라벨 */}
          <FadeIn delaySec={REVEAL.bundleLabel} translateY={6} durationSec={0.4}>
            <div
              style={{
                padding: "8px 18px",
                borderRadius: radii.pill,
                background: colors.accentSoft,
                color: colors.accentInk,
                fontFamily: fonts.sans,
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: "-0.01em",
                border: `1.5px solid ${colors.accent}`,
              }}
            >
              묶음 하나로 — 한 줄
            </div>
          </FadeIn>
        </div>
      </div>
    </PageBackground>
  );
};
