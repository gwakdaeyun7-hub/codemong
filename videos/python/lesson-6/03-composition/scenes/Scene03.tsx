/**
 * Scene 3 — `for` + `range()` 도입 + 끝값 제외 가로 시각화 (15s)
 *
 * **6강 시그니처 컷.** 오개념 1번 (off-by-one) 정면 처치.
 *
 * - 0~5s: 화면 좌측 코드 패널, 2줄 type-on
 *     1줄: `for i in range(3):`
 *     2줄: `    print(i)`
 *   - `for`, `in`, `range` 키워드는 violet 강조 (PyToken kind="keyword"/"func")
 *   - 코드 좌측 2줄째 들여쓰기 영역에 violet-300 세로 가이드 라인 (5강 패턴)
 * - 5~10s: 화면 우측 — `range(3)` 가로 시각화
 *     세 개의 둥근 박스 (0, 1, 2) — RangeBoxes 컴포넌트
 *     라벨 헤더 "range(3)"
 * - 10~13s: 우측 가로 시각화 끝에 빨간 X + 빨간 줄로 그어진 `3`
 *     "끝값은 포함 안 됨" 라벨 (옅게)
 * - 13~15s: 화면 하단 lower-third — "`range(N)` = `0` 부터 `N-1` 까지"
 *
 * 빨간 표시는 한 번만, 부드럽게 (RangeBoxes 의 strike + X 마커 자동).
 */

import React from "react";
import {
  CodeLine,
  CodePanel,
  FadeIn,
  IndentGuide,
  LowerThird,
  PageBackground,
  PyToken,
  RangeBoxes,
} from "../primitives";
import { colors, fonts } from "../theme";

const REVEAL = {
  panel: 0.4,
  line1: 1.0,
  line2: 3.0,
  guide: 4.0,
  rangeHeader: 5.5,
  rangeBoxes: 6.0,
  strike: 10.0,
  endLabel: 11.0,
} as const;

export const Scene03: React.FC = () => {
  return (
    <PageBackground>
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
              fontWeight: 600,
              color: colors.accentDeep,
              letterSpacing: "0.04em",
            }}
          >
            `for` + `range()`
          </div>
        </FadeIn>
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          padding: "120px 80px 140px",
          gap: 60,
        }}
      >
        {/* 좌측 — 코드 패널 */}
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <FadeIn delaySec={REVEAL.panel} translateY={20}>
            <div style={{ position: "relative" }}>
              <CodePanel fileName="loop.py" width={680} height={220}>
                <CodeLine lineNumber={1} revealAtSec={REVEAL.line1}>
                  <PyToken text="for" kind="keyword" />
                  <PyToken text=" " />
                  <PyToken text="i" kind="name" />
                  <PyToken text=" " />
                  <PyToken text="in" kind="keyword" />
                  <PyToken text=" " />
                  <PyToken text="range" kind="func" />
                  <PyToken text="(" kind="op" />
                  <PyToken text="3" kind="number" />
                  <PyToken text=")" kind="op" />
                  <PyToken text=":" kind="op" />
                </CodeLine>
                <CodeLine lineNumber={2} revealAtSec={REVEAL.line2}>
                  <PyToken text="    " />
                  <PyToken text="print" kind="func" />
                  <PyToken text="(" kind="op" />
                  <PyToken text="i" kind="name" />
                  <PyToken text=")" kind="op" />
                </CodeLine>
              </CodePanel>
              {/*
                들여쓰기 가이드 (1단). 패널 본문 padding 20 + 헤더 40 = 60 base.
                line-height ≈ 48 → 2줄 시작 ≈ 108. 줄번호 minWidth 22 + gap 18 ≈ 40 좌측 offset.
              */}
              <IndentGuide
                left={64}
                top={108}
                height={50}
                depth={1}
                delaySec={REVEAL.guide}
                durationSec={0.5}
              />
            </div>
          </FadeIn>
        </div>

        {/* 우측 — range(3) 가로 시각화 */}
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <RangeBoxes
            values={[0, 1, 2]}
            endValue={3}
            boxDelaySec={REVEAL.rangeBoxes}
            boxStaggerSec={0.4}
            strikeDelaySec={REVEAL.strike}
            showStrike
            boxSize={120}
            fontSize={60}
            gap={20}
            showHeader
            header="range(3)"
          />
        </div>
      </div>

      {/* "끝값은 포함 안 됨" 라벨 — 우측 박스 옆에 fade-in */}
      <div
        style={{
          position: "absolute",
          right: 100,
          top: 720,
          maxWidth: 380,
          textAlign: "center",
        }}
      >
        <FadeIn delaySec={REVEAL.endLabel} translateY={10}>
          <div
            style={{
              fontFamily: fonts.sans,
              fontSize: 22,
              fontWeight: 700,
              color: colors.danger,
              letterSpacing: "-0.01em",
              padding: "10px 20px",
              borderRadius: 999,
              background: "rgba(239, 68, 68, 0.10)",
              border: `1.5px solid ${colors.danger}`,
              display: "inline-block",
            }}
          >
            끝값은 포함 안 됨
          </div>
        </FadeIn>
      </div>

      <LowerThird
        text={
          <>
            <span style={{ fontFamily: fonts.mono, color: colors.accentLight }}>range(N)</span>
            {" = "}
            <span style={{ fontFamily: fonts.mono }}>0</span>
            {" 부터 "}
            <span style={{ fontFamily: fonts.mono }}>N-1</span>
            {" 까지"}
          </>
        }
        delaySec={12.5}
      />
    </PageBackground>
  );
};
