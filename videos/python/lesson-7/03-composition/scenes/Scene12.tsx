/**
 * Scene 12 — `len` vs 마지막 인덱스 (오개념 5) (14s)
 *
 * 정리 직전 한 컷. `scores[-1]` 음수 인덱스는 언급 X. "`len` = 개수,
 * 마지막 자리 = `len - 1`" 한 줄 정리.
 *
 * - 0~5s: 화면 중앙 상단에 ListVisual — 둥근 박스 3개 [88, 92, 76] +
 *         인덱스 띠 [0] [1] [2] + 큰 라벨 "개수 = 3" (좌측, violet-500).
 * - 5~9s: 코드 패널 fade-in: `len(scores)   # → 3`. `len` violet-500 강조.
 * - 9~14s: 인덱스 띠 우측에 점선 빈 자리 [3] + RedX (scene-04 패턴 재활용).
 *         인덱스 띠 마지막 [2] violet-500 펄스. 화면 하단 한 줄 정리 카드
 *         "**개수 = `len`** · **마지막 자리 = `len - 1`**".
 *
 * R-009 (uppercase 금지) 준수. 모든 코드 토큰 소문자 유지.
 */

import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import {
  CodeLine,
  CodePanel,
  FadeIn,
  ListVisual,
  PageBackground,
  PyToken,
} from "../primitives";
import { colors, fonts, shadows } from "../theme";

// R-016 — narration (21.52s) 키워드 발화 시점 동기 (Stage 3 wire 조정).
//   "정리 들어가기 전에 한 컷만 더" (~0~3s) — 도입 (list/strip)
//   "스코어즈 안에 값이 세 개 있다면, 렌 괄호 스코어즈는 3입니다" (~3~8s)
//     → codePanel + codeLine
//   "묶음 안의 개수죠" (~8~10s) — countLabel
//   "그런데 마지막 자리 번호는 3이 아니라 2입니다" (~10~14s)
//     → emptySlot + emptyX
//   "자리 번호가 0부터 시작하니까요" (~14~16s) → lastIndexPulse
//   "렌은 개수, 마지막 자리는 렌 빼기 1. 이 한 가지만 기억해 두세요" (~16~21s)
//     → summaryCard
const REVEAL = {
  list: 0.2,
  indexStrip: 0.5,
  countLabel: 8.0, // narration "묶음 안의 개수죠"
  codePanel: 5.0,
  codeLine: 5.3, // narration "렌 괄호 스코어즈는 3입니다"
  // 점선 빈 자리 [3] (scene-04 패턴 재활용)
  emptySlot: 11.0, // narration "마지막 자리 번호는 3이 아니라"
  emptyX: 12.5, // narration "2입니다"
  // 인덱스 띠 마지막 [2] 펄스
  lastIndexPulse: 13.5, // narration "0부터 시작하니까요" 즈음
  // 한 줄 정리 카드
  summaryCard: 17.0, // narration "렌은 개수, 마지막 자리는 렌 빼기 1"
} as const;

/** 인덱스 띠 [2] 위에 외곽 펄스. ListVisual 의 indexStrip 위치 추정. */
const LastIndexPulse: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = REVEAL.lastIndexPulse * fps;
  const opacity = interpolate(
    frame,
    [start, start + 0.3 * fps, start + 1.0 * fps, start + 1.4 * fps],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return (
    <div
      style={{
        position: "absolute",
        // [2] 박스 위 인덱스 라벨 — 박스 폭 130 + gap 24 의 2번째 박스 위치
        // ListVisual 가운데 정렬. 본 컨테이너의 width 가 ListVisual 폭과 동일하므로 좌측 0 기준.
        // 3개 박스 + 점선 슬롯 = 4 * 130 + 3 * 24 + extra. [2] 박스의 위 라벨 = 2 * (130 + 24) + 65
        left: 2 * (130 + 24) + 35,
        top: -8,
        width: 60,
        height: 40,
        borderRadius: 8,
        border: `2.5px solid ${colors.accent}`,
        background: "rgba(139, 92, 246, 0.10)",
        opacity,
        pointerEvents: "none",
        boxShadow: "0 0 0 4px rgba(139, 92, 246, 0.18)",
      }}
    />
  );
};

export const Scene12: React.FC = () => {
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
            <span style={{ fontFamily: fonts.mono }}>len</span> · 마지막 자리
          </div>
        </FadeIn>
      </div>

      {/* 중앙 상단 — ListVisual + 빈 자리 [3] + 인덱스 [2] 펄스 + "개수 = 3" 라벨 */}
      <div
        style={{
          position: "absolute",
          top: 150,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div style={{ position: "relative" }}>
          <ListVisual
            items={[
              { value: "88" },
              { value: "92" },
              { value: "76" },
            ]}
            boxSize={130}
            gap={24}
            showIndexStrip
            indexStripDelaySec={REVEAL.indexStrip}
            indexStripStaggerSec={0.25}
            defaultItemDelaySec={REVEAL.list}
            trailingEmptySlot={{
              indexLabel: "[3]",
              delaySec: REVEAL.emptySlot,
              xDelaySec: REVEAL.emptyX,
              labelDelaySec: REVEAL.emptySlot,
            }}
          />
          {/* [2] 인덱스 펄스 */}
          <LastIndexPulse />
        </div>
      </div>

      {/* "개수 = 3" 라벨 — ListVisual 좌측 */}
      <div
        style={{
          position: "absolute",
          top: 240,
          left: 380,
        }}
      >
        <FadeIn delaySec={REVEAL.countLabel} translateY={6} durationSec={0.5}>
          <div
            style={{
              padding: "16px 28px",
              borderRadius: 18,
              background: colors.bgWhite,
              border: `3px solid ${colors.accent}`,
              boxShadow: shadows.card,
              fontFamily: fonts.sans,
              fontSize: 42,
              fontWeight: 800,
              color: colors.accentDeep,
              letterSpacing: "-0.02em",
              whiteSpace: "nowrap",
            }}
          >
            개수 = 3
          </div>
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
          <CodePanel fileName="count.py" width={680} height={130}>
            <CodeLine lineNumber={1} revealAtSec={REVEAL.codeLine}>
              <PyToken
                text="len"
                kind="func"
                style={{ fontWeight: 800, color: colors.accent }}
              />
              <PyToken text="(" kind="op" />
              <PyToken text="scores" kind="name" />
              <PyToken text=")" kind="op" />
              <PyToken text="   " />
              <PyToken text="# → 3" kind="comment" />
            </CodeLine>
          </CodePanel>
        </FadeIn>
      </div>

      {/* 한 줄 정리 카드 — 하단 본문 카드 */}
      <div
        style={{
          position: "absolute",
          top: 700,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <FadeIn delaySec={REVEAL.summaryCard} translateY={10} durationSec={0.5}>
          <div
            style={{
              padding: "20px 36px",
              borderRadius: 18,
              background: colors.bgWhite,
              border: `2px solid ${colors.accent}`,
              boxShadow: shadows.card,
              fontFamily: fonts.sans,
              fontSize: 28,
              fontWeight: 600,
              color: colors.ink,
              letterSpacing: "-0.01em",
              display: "flex",
              gap: 30,
              alignItems: "center",
            }}
          >
            <span>
              개수 ={" "}
              <span style={{ fontFamily: fonts.mono, color: colors.accentDeep, fontWeight: 800 }}>
                len
              </span>
            </span>
            <span style={{ color: colors.inkSubtle }}>·</span>
            <span>
              마지막 자리 ={" "}
              <span style={{ fontFamily: fonts.mono, color: colors.accentDeep, fontWeight: 800 }}>
                len - 1
              </span>
            </span>
          </div>
        </FadeIn>
      </div>
    </PageBackground>
  );
};
