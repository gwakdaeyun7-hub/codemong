/**
 * Scene 11 — 2차원 리스트: 표 격자 + `grid[행][열]` (16s)
 *
 * 학습 목표 5 + 오개념 4 정면 처치 (00-objectives §4).
 * R-016 (narration 키워드 동기) — narration "1번 줄" → 1단계 행 highlight,
 * "0번 자리" → 2단계 셀 highlight.
 *
 * - 0~5s: 화면 중앙 상단 코드 한 줄 `grid = [[1,2,3],[4,5,6]]` type-on (3s).
 *         바깥 [ ] 와 쉼표 violet-300 강조.
 * - 5~10s: 코드 아래 GridVisual fade-in (2행 3열). 행 라벨 [0] [1] (좌),
 *         열 라벨 [0] [1] [2] (상). 0.4초 stagger.
 * - 10~14s: 코드 우측에 한 줄 `grid[1][0]` type-on (1.5s). 2단계 강조 애니:
 *           1단계 (1.2s): 하단 행 ([1]) 전체 violet-200 highlight + 행 라벨 펄스.
 *           2단계 (1.2s): 그 안에서 첫 칸 (4) violet-500 + 흰 글씨 + 열 라벨 펄스.
 * - 14~16s: 코드 우측에 결과 `→ 4` fade-in.
 *         lower-third "바깥 = 줄 · 안쪽 = 그 줄의 자리".
 *
 * note: 중첩 for 절대 X (Scope §5 — 7강 OUT). `grid[1]` 만 쓰면 한 줄
 * 전체가 나온다는 점은 narration 에서 생략 — 다음 scene 양보.
 */

import React from "react";
import {
  CodeLine,
  CodePanel,
  FadeIn,
  GridVisual,
  LowerThird,
  PageBackground,
  PyToken,
} from "../primitives";
import { colors, fonts, radii } from "../theme";

// R-016 — narration (29.20s) 키워드 발화 시점 동기 (Stage 3 wire 조정).
//   "마지막으로 한 가지 더 ... 넣을 수도 있습니다" (~0~5s) — 도입
//   "그리드 등호 대괄호 ... 닫고" (~5~12s) — codeLine1 type-on
//   "두 줄짜리 표 모양입니다" (~12~15s) — grid + rowLabel + colLabel
//   "한 칸을 짚으려면 대괄호 두 개를 씁니다" (~15~19s) — 휴식
//   "그리드 대괄호 1 대괄호 0" (~19~21s) — pickCodePanel + pickCodeLine
//   "바깥 = 줄, 안쪽 = 그 줄의 자리" (~21~24s) — 휴식
//   "그래서 1번 줄" (~24~25s) — rowHighlight
//   "0번 자리" (~25~26.5s) — cellHighlight
//   "답은 4입니다" (~26.5~29s) — resultArrow + lowerThird
const REVEAL = {
  smallLabel: 0.1,
  codePanel: 0.4,
  codeLine1: 5.5, // narration "그리드 등호 대괄호"
  grid: 12.5, // narration "두 줄짜리 표 모양"
  cellStagger: 0.1,
  rowLabel: 13.0,
  colLabel: 13.5,
  pickCodePanel: 18.5, // narration "그리드 대괄호 1 대괄호 0" 직전
  pickCodeLine: 19.0,
  rowHighlight: 24.0, // narration "1번 줄"
  cellHighlight: 25.0, // narration "0번 자리"
  resultArrow: 26.5, // narration "답은 4입니다"
  lowerThird: 27.0,
} as const;

export const Scene11: React.FC = () => {
  return (
    <PageBackground>
      <div style={{ position: "absolute", top: 50, left: 0, right: 0, textAlign: "center" }}>
        <FadeIn delaySec={REVEAL.smallLabel} translateY={6}>
          <div
            style={{
              fontFamily: fonts.sans,
              fontSize: 28,
              fontWeight: 600,
              color: colors.accentDeep,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            2차원 리스트 — 표 모양
          </div>
        </FadeIn>
      </div>

      {/* 상단 코드 패널 — grid 선언 */}
      <div
        style={{
          position: "absolute",
          top: 130,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <FadeIn delaySec={REVEAL.codePanel} translateY={18}>
          <CodePanel fileName="grid.py" width={780} height={130}>
            <CodeLine lineNumber={1} revealAtSec={REVEAL.codeLine1}>
              <PyToken text="grid" kind="name" />
              <PyToken text=" = " kind="op" />
              <PyToken text="[" kind="op" highlight />
              <PyToken text="[" kind="op" />
              <PyToken text="1" kind="number" />
              <PyToken text=", " kind="op" />
              <PyToken text="2" kind="number" />
              <PyToken text=", " kind="op" />
              <PyToken text="3" kind="number" />
              <PyToken text="]" kind="op" />
              <PyToken text=", " kind="op" highlight />
              <PyToken text="[" kind="op" />
              <PyToken text="4" kind="number" />
              <PyToken text=", " kind="op" />
              <PyToken text="5" kind="number" />
              <PyToken text=", " kind="op" />
              <PyToken text="6" kind="number" />
              <PyToken text="]" kind="op" />
              <PyToken text="]" kind="op" highlight />
            </CodeLine>
          </CodePanel>
        </FadeIn>
      </div>

      {/* 좌측 — GridVisual 2행 3열 */}
      <div
        style={{
          position: "absolute",
          top: 330,
          left: 220,
        }}
      >
        <FadeIn delaySec={REVEAL.grid} translateY={14} durationSec={0.5}>
          <GridVisual
            rows={[
              [1, 2, 3],
              [4, 5, 6],
            ]}
            cellSize={110}
            gap={10}
            cellDelaySec={REVEAL.grid + 0.2}
            cellStaggerSec={REVEAL.cellStagger}
            rowLabelDelaySec={REVEAL.rowLabel}
            rowLabelStaggerSec={0.4}
            colLabelDelaySec={REVEAL.colLabel}
            colLabelStaggerSec={0.4}
            rowHighlight={{ row: 1, delaySec: REVEAL.rowHighlight, durationSec: 5.0 }}
            cellHighlight={{ row: 1, col: 0, delaySec: REVEAL.cellHighlight, durationSec: 4.0 }}
          />
        </FadeIn>
      </div>

      {/* 우측 — grid[1][0] 코드 패널 + 결과 */}
      <div
        style={{
          position: "absolute",
          top: 380,
          right: 200,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 28,
        }}
      >
        <FadeIn delaySec={REVEAL.pickCodePanel} translateY={14}>
          <CodePanel fileName="pick.py" width={420} height={130}>
            <CodeLine lineNumber={1} revealAtSec={REVEAL.pickCodeLine}>
              <PyToken text="grid" kind="name" />
              <PyToken text="[" kind="op" />
              <PyToken
                text="1"
                kind="number"
                style={{ fontWeight: 800, color: colors.accent }}
              />
              <PyToken text="]" kind="op" />
              <PyToken text="[" kind="op" />
              <PyToken
                text="0"
                kind="number"
                style={{ fontWeight: 800, color: colors.accent }}
              />
              <PyToken text="]" kind="op" />
            </CodeLine>
          </CodePanel>
        </FadeIn>

        <FadeIn delaySec={REVEAL.resultArrow} translateY={6} durationSec={0.5}>
          <div
            style={{
              padding: "12px 26px",
              borderRadius: radii.pill,
              background: colors.accent,
              color: "#fff",
              fontFamily: fonts.mono,
              fontSize: 42,
              fontWeight: 800,
              letterSpacing: "-0.02em",
              boxShadow: "0 4px 24px -8px rgba(139, 92, 246, 0.4)",
            }}
          >
            → 4
          </div>
        </FadeIn>
      </div>

      <LowerThird
        text={<>바깥 = 줄 · 안쪽 = 그 줄의 자리</>}
        delaySec={REVEAL.lowerThird}
      />
    </PageBackground>
  );
};
