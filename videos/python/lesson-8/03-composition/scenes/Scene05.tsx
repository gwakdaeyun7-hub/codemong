/**
 * Scene 5 — `dict` 새 항목 추가 + Active recall (24.34s, narration 226.92s 전체에서 71.5~95.8)
 *
 * - 0~4s: 좌측 코드 패널 — scene-03 의 코드 유지된 채로 새 줄 `scores["과학"] = 70` type-on.
 *         `"과학"`, `70` violet-300 강조.
 * - 4~7s: 우측 PairDiagram 에 세 번째 row `"과학"` → `70` fade-in. 새 row violet 펄스.
 * - 7~10s: 좌측 코드 아래에 한 줄 더 `scores["과학"]` type-on. 우측에 큰 ? 박스 등장.
 *          ? 가 long-form active recall 동안 유지됨 (lifespan 12.0s — narration "여기서 잠깐...
 *          결과는?" + 1.5초 정적 모두 커버).
 * - 20.5s: 물음표 → `70` 으로 swap (scale up 0.4s) — narration "정답은 70" 발화 시점.
 * - 21.0s~: lower-third "dict[새키] = 새값 — 새 항목 추가".
 *
 * R-004 / R-016: 정답 reveal (answerSwap = 20.5s) narration "정답은 70" 발화 시점에 동기.
 *   Sub-clip ffprobe: a0=18.408s, s1=1.541s, a2=4.104s. final voiceover rescale 0.99738.
 *   - 하한 = (18.408 + 1.541 + 0.3) × 0.99738 = 20.196s
 *   - 상한 = (18.408 + 1.541 + 4.104 × 0.25) × 0.99738 = 20.920s
 *   - answerSwap = 20.5 ∈ [20.196, 20.920] ✓
 *
 * R-002 (swap timing buffer): QuestionMark fade-out 끝 = 8.0 + 12.0 + 0.3 = 20.3s,
 *   answerSwap fade-in 시작 = 20.5s → gap 0.2s ✓
 *
 * R-012: QuestionMark size 180 (양옆 박스 사이 충분히 큼).
 */

import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import {
  CodeLine,
  CodePanel,
  FadeIn,
  LowerThird,
  PageBackground,
  PairDiagram,
  PyToken,
  QuestionMark,
} from "../primitives";
import { colors, fonts, radii, shadows } from "../theme";

const easeOutCubic = Easing.bezier(0.16, 1, 0.3, 1);

const REVEAL = {
  codePanel: 0.3,
  line1: 0.5,
  line2: 1.5, // scores["과학"] = 70
  diagram: 0.3,
  diagramRow1: 0.7,
  diagramRow2: 1.5,
  diagramRow3: 4.5, // 세 번째 짝 추가
  rowPulse: 5.0,
  line3: 7.0, // scores["과학"]
  questionMark: 8.0, // 큰 ? 박스
  answerSwap: 20.5, // 정답 70 reveal — narration "정답은 70" 발화 시점 (R-004 범위 내)
  workoutLabel: 21.0, // 답 직후 풀이 라벨
  lowerThird: 21.5,
} as const;

/** ? → 70 swap 박스. */
const AnswerBox: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const swapStart = REVEAL.answerSwap * fps;
  const opacity = interpolate(frame, [swapStart, swapStart + 0.3 * fps], [0, 1], {
    easing: easeOutCubic,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scale = interpolate(frame, [swapStart, swapStart + 0.4 * fps], [1.4, 1.0], {
    easing: easeOutCubic,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale})`,
        fontFamily: fonts.mono,
        fontSize: 180,
        fontWeight: 900,
        color: colors.accentDeep,
        letterSpacing: "-0.04em",
        lineHeight: 1,
        textShadow: "0 6px 24px rgba(139, 92, 246, 0.30)",
      }}
    >
      70
    </div>
  );
};

export const Scene05: React.FC = () => {
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
              fontWeight: 700,
              color: colors.accentDeep,
              letterSpacing: "0.04em",
            }}
          >
            새 항목 추가 —{" "}
            <span style={{ fontFamily: fonts.mono, fontWeight: 800 }}>dict[새키] = 새값</span>
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
        {/* 좌측 — 코드 + 정답 박스 */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 28,
          }}
        >
          <FadeIn delaySec={REVEAL.codePanel} translateY={20}>
            <CodePanel fileName="scores.py" width={720} height={260}>
              <CodeLine lineNumber={1} revealAtSec={REVEAL.line1}>
                <PyToken text="scores" kind="name" />
                <PyToken text=" " />
                <PyToken text="=" kind="op" />
                <PyToken text=" " />
                <PyToken text="{" kind="op" />
                <PyToken text={'"수학"'} kind="dictKey" />
                <PyToken text=": " kind="op" />
                <PyToken text="95" kind="number" />
                <PyToken text=", " kind="op" />
                <PyToken text={'"영어"'} kind="dictKey" />
                <PyToken text=": " kind="op" />
                <PyToken text="80" kind="number" />
                <PyToken text="}" kind="op" />
              </CodeLine>
              <CodeLine lineNumber={2} revealAtSec={REVEAL.line2}>
                <PyToken text="scores" kind="name" />
                <PyToken text="[" kind="op" />
                <PyToken text={'"과학"'} kind="dictKey" highlight />
                <PyToken text="]" kind="op" />
                <PyToken text=" " />
                <PyToken text="=" kind="op" />
                <PyToken text=" " />
                <PyToken text="70" kind="number" highlight />
              </CodeLine>
              <CodeLine lineNumber={3} revealAtSec={REVEAL.line3}>
                <PyToken text="scores" kind="name" />
                <PyToken text="[" kind="op" />
                <PyToken text={'"과학"'} kind="dictKey" />
                <PyToken text="]" kind="op" />
              </CodeLine>
            </CodePanel>
          </FadeIn>

          {/* 정답 박스 */}
          <FadeIn delaySec={REVEAL.questionMark - 0.2} translateY={14}>
            <div
              style={{
                width: 320,
                height: 200,
                background: colors.bgWhite,
                border: `3px solid ${colors.accent}`,
                borderRadius: radii.card,
                boxShadow: shadows.card,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* 물음표 (정적 동안) */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <QuestionMark
                  delaySec={REVEAL.questionMark}
                  lifespanSec={12.0}
                  size={180}
                  color={colors.accent}
                />
              </div>
              {/* 정답 70 */}
              <AnswerBox />
            </div>
          </FadeIn>
        </div>

        {/* 우측 — PairDiagram (3개 짝) */}
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <PairDiagram
            title="이름표 → 값"
            delaySec={REVEAL.diagram}
            width={520}
            rows={[
              {
                key: '"수학"',
                value: "95",
                enterAtSec: REVEAL.diagramRow1,
              },
              {
                key: '"영어"',
                value: "80",
                enterAtSec: REVEAL.diagramRow2,
              },
              {
                key: '"과학"',
                value: "70",
                enterAtSec: REVEAL.diagramRow3,
                pulseAtSec: REVEAL.rowPulse,
                pulseSide: "both",
              },
            ]}
          />
        </div>
      </div>

      {/* 풀이 라벨 */}
      <div
        style={{
          position: "absolute",
          bottom: 200,
          left: 80,
          width: 800,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <FadeIn delaySec={REVEAL.workoutLabel} translateY={8}>
          <div
            style={{
              padding: "8px 22px",
              borderRadius: radii.pill,
              background: colors.bgWhite,
              border: `1.5px solid ${colors.accent}`,
              color: colors.accentInk,
              fontFamily: fonts.sans,
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: "-0.01em",
            }}
          >
            방금 넣은 값
          </div>
        </FadeIn>
      </div>

      <LowerThird
        text={
          <>
            <span style={{ fontFamily: fonts.mono, color: colors.accentLight }}>
              dict[새키] = 새값
            </span>{" "}
            — 새 항목 추가
          </>
        }
        delaySec={REVEAL.lowerThird}
      />
    </PageBackground>
  );
};
