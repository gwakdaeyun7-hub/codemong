/**
 * Scene 4 — 0-인덱스 핵심 + scores[3] 빨간 X (14s)
 *
 * 오개념 1 정면 처치 (00-objectives §4 시그니처).
 * "일상의 _첫 번째_ = 코드의 `0`" narration 명시.
 *
 * - 0~6s: 상단에 scene-03 의 [88, 92, 76] + 인덱스 띠 유지. 그 _아래_ 에
 *         인덱싱 코드 3줄 stagger fade-in (각 1.5s):
 *         scores[0]  # → 88
 *         scores[1]  # → 92
 *         scores[2]  # → 76
 *         각 줄 등장 시 해당 인덱스 띠 펄스 (R-016 narration 동기).
 * - 6~14s: 4번째 줄 scores[3]  # ? + 인덱스 띠 우측에 점선 빈 자리 박스
 *         + 빨간 X. lower-third "_자리 번호는 0부터_ · 마지막 자리는 `2`".
 *         (영문 에러 메시지 없음 — 시각만)
 *
 * note: R-013 (신체 동작 비유 금지) — "손가락으로 짚을 수 있게" 형태 회피.
 * "자리가 없습니다" 직접 표현.
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

// R-016 — narration (20.04s) 키워드 발화 시점 동기 (Stage 3 wire 조정).
//   "중요한 점 하나 ... 자리 번호 0입니다" (~0~5.5s) — 도입 (list/strip/code)
//   "스코어즈 대괄호 0은 88" (~5.5~7.5s) — line1
//   "스코어즈 대괄호 1은 92" (~7.5~9.5s) — line2
//   "스코어즈 대괄호 2는 76이 됩니다" (~9.5~12.5s) — line3
//   "그러면 스코어즈 대괄호 3은 어떻게 될까요" (~12.5~16s) — line4
//   "자리가 없습니다" (~17~20s) — emptySlot/emptyX/lowerThird
const REVEAL = {
  list: 0.2,
  indexStrip: 0.5,
  codePanel: 1.0,
  line1: 6.5, // scores[0] — narration "0은 88" 발화 시점
  pulse1: 6.7,
  line2: 8.5, // scores[1] — narration "1은 92"
  pulse2: 8.7,
  line3: 10.5, // scores[2] — narration "2는 76"
  pulse3: 10.7,
  line4: 13.5, // scores[3] — narration "그러면 ... 3은"
  emptySlot: 15.5,
  emptyX: 17.5, // narration "자리가 없습니다"
  lowerThird: 18.5,
} as const;

export const Scene04: React.FC = () => {
  // 코드 4줄의 어느 줄이 active 인지에 따라 ListVisual highlight 갱신.
  // 각 줄별로 동시에 띠 highlight 가 다른 시각에 일어나도록 ListVisual 의
  // indexStripHighlight 를 사용. 다만 highlight 는 한 번에 한 인덱스만 잡힘.
  // → 각 펄스 시각마다 다른 인덱스를 강조하려면 여러 ListVisual 인스턴스가
  //   필요하지만, 그러면 박스 중복 표시. 대신 IndexStrip 의 highlight 시각을
  //   순차적으로 잡으려고 indexStrip 자체를 별도로 그리지 않고 ListVisual
  //   안에 두고 highlight 시점만 마지막(가장 최근) 줄에 맞춤. 본 scene 은
  //   3 펄스가 시간이 1.5s 떨어져 있어 각 시점만 잡으면 됨 → ListVisual 을
  //   여러 번 그리지 않고 highlight 만 마지막 활성 인덱스로 잡는 단순화.
  //
  // 더 깔끔한 방식은 IndexStrip 을 풀고 각 인덱스를 absolute 로 직접 박는
  // 것이지만, 본 scene 의 펄스는 *3번에 걸친 점진적 강조* 라서 ListVisual
  // 의 indexStrip 옆에 별도 absolute 펄스 마커를 띄우는 방식으로 처리.
  // → 본 구현에서는 indexStripHighlight 를 사용하지 않고, 코드 줄별 펄스는
  //   "줄 자체의 highlighted=true" 로 좌측 violet bar 가 펄스해 학습자가
  //   "현재 짚고 있는 자리" 를 인지하게 한다. 시각 단순화.
  return (
    <PageBackground>
      {/* 상단 작은 라벨 */}
      <div style={{ position: "absolute", top: 50, left: 0, right: 0, textAlign: "center" }}>
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
            자리 번호 0부터
          </div>
        </FadeIn>
      </div>

      {/* 상단 — ListVisual + 인덱스 띠 + 점선 빈 자리 */}
      <div
        style={{
          position: "absolute",
          top: 140,
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
          boxSize={130}
          gap={24}
          showIndexStrip
          indexStripDelaySec={REVEAL.indexStrip}
          indexStripStaggerSec={0.3}
          defaultItemDelaySec={REVEAL.list}
          trailingEmptySlot={{
            indexLabel: "[3]",
            delaySec: REVEAL.emptySlot,
            xDelaySec: REVEAL.emptyX,
            labelDelaySec: REVEAL.emptySlot,
          }}
        />
      </div>

      {/* 중앙 — 인덱싱 코드 4줄 */}
      <div
        style={{
          position: "absolute",
          top: 470,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <FadeIn delaySec={REVEAL.codePanel} translateY={18}>
          <CodePanel fileName="lookup.py" width={680} height={350}>
            <CodeLine lineNumber={1} revealAtSec={REVEAL.line1} highlighted highlightDurationSec={1.0}>
              <PyToken text="scores" kind="name" />
              <PyToken text="[" kind="op" />
              <PyToken text="0" kind="number" highlight />
              <PyToken text="]" kind="op" />
              <PyToken text="   " />
              <PyToken text="# → 88" kind="comment" />
            </CodeLine>
            <CodeLine lineNumber={2} revealAtSec={REVEAL.line2} highlighted highlightDurationSec={1.0}>
              <PyToken text="scores" kind="name" />
              <PyToken text="[" kind="op" />
              <PyToken text="1" kind="number" highlight />
              <PyToken text="]" kind="op" />
              <PyToken text="   " />
              <PyToken text="# → 92" kind="comment" />
            </CodeLine>
            <CodeLine lineNumber={3} revealAtSec={REVEAL.line3} highlighted highlightDurationSec={1.0}>
              <PyToken text="scores" kind="name" />
              <PyToken text="[" kind="op" />
              <PyToken text="2" kind="number" highlight />
              <PyToken text="]" kind="op" />
              <PyToken text="   " />
              <PyToken text="# → 76" kind="comment" />
            </CodeLine>
            <CodeLine lineNumber={4} revealAtSec={REVEAL.line4} highlighted highlightDurationSec={1.5}>
              <PyToken text="scores" kind="name" />
              <PyToken text="[" kind="op" />
              <PyToken text="3" kind="number" highlight />
              <PyToken text="]" kind="op" />
              <PyToken text="   " />
              <PyToken text="# IndexError" kind="comment" style={{ color: colors.danger }} />
            </CodeLine>
          </CodePanel>
        </FadeIn>
      </div>

      {/* 실제 실행 결과 — scores[3] 은 자리가 없어 IndexError (영상 1:04, 사용자 요청:
          [?] 대신 실제로 어떻게 뜨는지). red X 등장(emptyX)과 동기. */}
      <div
        style={{
          position: "absolute",
          top: 845,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <FadeIn delaySec={REVEAL.emptyX} translateY={8} durationSec={0.5}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "12px 26px",
              borderRadius: 12,
              background: "rgba(239, 68, 68, 0.10)",
              border: `1.5px solid ${colors.danger}`,
              fontFamily: fonts.mono,
              fontSize: 26,
              fontWeight: 700,
              color: colors.danger,
              letterSpacing: "-0.01em",
            }}
          >
            IndexError: list index out of range
          </div>
        </FadeIn>
      </div>

      <LowerThird
        text={
          <>
            자리 번호는 0부터 · 마지막 자리는{" "}
            <span style={{ fontFamily: fonts.mono, color: colors.accentLight }}>2</span>
          </>
        }
        delaySec={REVEAL.lowerThird}
      />
    </PageBackground>
  );
};
