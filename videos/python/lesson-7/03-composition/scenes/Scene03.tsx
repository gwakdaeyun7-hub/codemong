/**
 * Scene 3 — 리스트 생성 + 인덱스 띠 시그니처 (16s)
 *
 * **7강 시그니처 #1.** 학습 목표 2 + 오개념 1 정면 진입.
 *
 * - 0~5s: 중앙 코드 에디터에 `scores = [88, 92, 76]` 한 줄 type-on (3.5s).
 *         `[`, `]`, `,` 는 violet-300 강조.
 * - 5~12s: 코드 아래 ListVisual fade-in — 둥근 박스 3개 `88` `92` `76` +
 *         인덱스 띠 `[0] [1] [2]` (값과 가로 정렬). 라벨이 0→1→2 순서로
 *         0.4초 간격 fade-in.
 * - 12~16s: 인덱스 띠 위 lower-third "값 세 개 — 자리 번호 `0` `1` `2`".
 *
 * note: 인덱스 띠가 값 박스 폭과 *정확히 정렬* (IndexStrip 컴포넌트가
 * boxSize 폭에 맞춰 라벨 배치). R-014 미적용 (single panel + 인덱스 띠).
 */

import React from "react";
import {
  CodeLine,
  CodePanel,
  FadeIn,
  ListVisual,
  LowerThird,
  PageBackground,
  PyToken,
} from "../primitives";
import { colors, fonts } from "../theme";

// R-016 — narration (22.84s) 키워드 발화 시점 동기 (Stage 3 wire 조정).
//   "리스트는 대괄호 안에 ... 만듭니다" (~0~5s) — 코드 패널 fade-in
//   "변수 스코어즈, 등호, 대괄호 ... 닫고" (~5~13s) — code line type-on
//   "이렇게 한 줄로 묶음이 만들어집니다" (~13~17s) — ListVisual fade-in
//   "각 값에는 자리 번호가 붙어있습니다" (~17~22s) — indexStrip + lowerThird
const REVEAL = {
  codePanel: 0.3,
  codeLine: 5.0, // narration "변수 스코어즈" 발화 즈음
  listBoxes: 13.0, // narration "한 줄로 묶음이 만들어집니다"
  indexStrip: 17.5, // narration "자리 번호가 붙어있습니다"
  lowerThird: 19.0,
} as const;

export const Scene03: React.FC = () => {
  return (
    <PageBackground>
      {/* 상단 작은 라벨 */}
      <div style={{ position: "absolute", top: 60, left: 0, right: 0, textAlign: "center" }}>
        <FadeIn delaySec={0.1} translateY={6}>
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
            리스트 만들기
          </div>
        </FadeIn>
      </div>

      {/* 중앙 코드 패널 */}
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
        <FadeIn delaySec={REVEAL.codePanel} translateY={18}>
          <CodePanel fileName="scores.py" width={780} height={130}>
            <CodeLine lineNumber={1} revealAtSec={REVEAL.codeLine}>
              <PyToken text="scores" kind="name" />
              <PyToken text=" = " kind="op" />
              <PyToken text="[" kind="op" highlight />
              <PyToken text="88" kind="number" />
              <PyToken text=", " kind="op" highlight />
              <PyToken text="92" kind="number" />
              <PyToken text=", " kind="op" highlight />
              <PyToken text="76" kind="number" />
              <PyToken text="]" kind="op" highlight />
            </CodeLine>
          </CodePanel>
        </FadeIn>
      </div>

      {/* 인덱스 띠 + 박스 — 화면 중앙 아래쪽 */}
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
        <ListVisual
          items={[
            { value: "88" },
            { value: "92" },
            { value: "76" },
          ]}
          boxSize={150}
          gap={28}
          showIndexStrip
          indexStripDelaySec={REVEAL.indexStrip}
          indexStripStaggerSec={0.4}
          defaultItemDelaySec={REVEAL.listBoxes}
        />
      </div>

      <LowerThird
        text={
          <>
            값 세 개 — 자리 번호{" "}
            <span style={{ fontFamily: fonts.mono, color: colors.accentLight }}>0</span>{" "}
            <span style={{ fontFamily: fonts.mono, color: colors.accentLight }}>1</span>{" "}
            <span style={{ fontFamily: fonts.mono, color: colors.accentLight }}>2</span>
          </>
        }
        delaySec={REVEAL.lowerThird}
      />
    </PageBackground>
  );
};
