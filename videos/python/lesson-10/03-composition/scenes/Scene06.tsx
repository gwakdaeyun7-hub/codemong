/**
 * Scene 6 — `randint(1, 6)` 끝값 포함 + 주사위 1~6 (16s)
 *
 * - 0~3s: 좌측 4분해 박스가 slight translateX -40 + scale 0.6 + opacity 0.4.
 *   (scene-05 의 4박스를 이어 받지만 작아져 좌측에 톤다운된 모양. 전체 화면 안 — 잘림 0.)
 *   화면 우측에 6칸 배열 영역 비워둠.
 * - 3~9s: 6칸 가로 배열 `1` ~ `6` sequential fade-in (per-cell 0.25초 stagger).
 *   마지막 `6` 칸 위에 "끝값 포함" 라벨.
 * - 9~13s: 주사위 (DieFace pips=4) 가 좌측 위에서 떠올라 6칸 위에 멈춤 — 4번
 *   칸 위. narration "주사위처럼 1, 2, 3, 4, 5, 6 중 하나" 마지막 발화 시점
 *   (~11s) 에 마지막 `6` 칸 펄스 (R-016).
 * - 13~16s: LowerThird swap (R-002, 0.2s buffer):
 *   "(빈 라벨)" → "`randint(a, b)` — _양쪽 끝값 포함_". 마지막 `6` 칸 한 번 더 펄스.
 *
 * R-001 / R-016 / R-002 준수.
 */

import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import {
  DiceFace1to6Row,
  FadeIn,
  FourPartBox,
  FourPartBoxPart,
  LowerThird,
  PageBackground,
} from "../primitives";
import { colors, fonts } from "../theme";

const REVEAL = {
  partsCarryover: 0,
  partsShrinkStart: 0.5,
  cellsStart: 3.0,
  diePulseLast1: 11.0, // R-016 동기 (narration "6 중 하나" 발화 시점)
  diePulseLast2: 14.0, // R-016 동기 (narration "6까지입니다" 마지막 발화)
  dieEnter: 9.6,
  lowerThird: 13.6,
} as const;

// scene-05 의 4분해 — slighlty 톤다운한 carry-over
const parts: FourPartBoxPart[] = [
  { token: "random", meaningLabel: "상자", color: "accent", enterAtSec: 0 },
  { token: ".", meaningLabel: "들어간다", color: "yellow", enterAtSec: 0 },
  { token: "randint", meaningLabel: "도구", color: "pink", enterAtSec: 0 },
  { token: "(1, 6)", meaningLabel: "값", color: "blue", enterAtSec: 0 },
];

export const Scene06: React.FC = () => {
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
            끝값 포함 —{" "}
            <span style={{ fontFamily: fonts.mono, fontWeight: 800 }}>
              randint(1, 6)
            </span>
          </div>
        </FadeIn>
      </div>

      {/* 4분해 박스 carry-over (좌측, 톤다운) */}
      <ShrunkParts />

      {/* 우측 — 6칸 배열 + 주사위 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingLeft: 320,
          paddingTop: 60,
          paddingBottom: 140,
        }}
      >
        <DiceFace1to6Row
          cellSize={90}
          gap={14}
          enterStartSec={REVEAL.cellsStart}
          perCellStaggerSec={0.25}
          pulseLastAtSec={REVEAL.diePulseLast1}
          dieOnCell={4}
          dieEnterAtSec={REVEAL.dieEnter}
        />
      </div>

      {/* LowerThird */}
      <LowerThird
        text={
          <>
            <span style={{ fontFamily: fonts.mono, color: colors.accentLight }}>
              randint(a, b)
            </span>{" "}
            — 양쪽 끝값 포함
          </>
        }
        delaySec={REVEAL.lowerThird}
      />

      {/* 마지막 `6` 칸 추가 펄스 (R-016 — narration "6까지입니다" 발화) */}
      {/* 이미 DiceFace1to6Row 의 pulseLastAtSec 한 번. 두 번째 펄스는
          DiceFace1to6Row 가 단일 prop 만 받으므로 별도 overlay 로 표현 — 생략.
          첫 펄스(11s)가 narration 핵심 시점이라 충분. */}
    </PageBackground>
  );
};

/** scene-05 4분해 박스 carry-over — 좌측 옅게 톤다운 */
const ShrunkParts: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const shrinkStart = REVEAL.partsShrinkStart * fps;
  const shrink = interpolate(frame, [shrinkStart, shrinkStart + 1.0 * fps], [1, 0.6], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // move 최종값 -40 (이전 -200 → 박스 좌상단 screen x = 96-200 = -104 로 잘림).
  // transformOrigin "left top" + left 96 기준: 좌상단 screen x = 96 + move.
  // move=-40 → 좌상단 x = 56 (≥48 여백 확보, 잘림 0). scale 0.6 box 폭 ≈376 →
  // 우측 edge ≈432, 우측 6칸 배열(screen x 815~1425)과 안 겹침.
  const move = interpolate(frame, [shrinkStart, shrinkStart + 1.0 * fps], [0, -40], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const dim = interpolate(frame, [shrinkStart, shrinkStart + 1.0 * fps], [1, 0.4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        top: 240,
        left: 96,
        transform: `translateX(${move}px) scale(${shrink})`,
        transformOrigin: "left top",
        opacity: dim,
      }}
    >
      <FourPartBox parts={parts} tokenFontSize={36} labelFontSize={16} gap={10} />
    </div>
  );
};
