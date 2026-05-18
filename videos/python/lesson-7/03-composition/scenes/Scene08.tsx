/**
 * Scene 8 — Active Recall: 세 동작 후 모습 예측 (12s)
 *
 * 7강에서 가장 큰 인지 부하 구간 (`append`/`[i]=`/`del` 세 동작) 직후 적용 비트.
 * R-004 + R-016 (정답 reveal 동기) + R-012 (QuestionMark size ≥ 180) 준수.
 *
 * - 0~3s: 좌측 코드 3줄 fade-in (각 0.7s):
 *         scores.append(100)
 *         scores[0] = 95
 *         del scores[1]
 *         각 줄 violet-300 키워드 강조.
 * - 3~5s: 우측 QuestionMark size=200 fade-in.
 * - 5~7s: 2초 정적 (TTS 무음).
 * - 7~12s: QuestionMark fade-out → 결과 박스 fade-in (R-002 0.2s buffer).
 *         박스 안 세 개 둥근 박스 `95` `76` `100` + 인덱스 띠 `[0] [1] [2]`
 *         + 라벨 "길이 = 3". 결과가 violet-500 으로 한 번 펄스.
 *         revealAtSec ≈ 7.6 (단계 3 timestamps 받으면 narration 동기 재조정).
 */

import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import {
  CodeLine,
  CodePanel,
  FadeIn,
  ListVisual,
  PageBackground,
  PyToken,
  QuestionMark,
} from "../primitives";
import { colors, fonts } from "../theme";

const easeOutCubic = Easing.bezier(0.16, 1, 0.3, 1);

// R-004 + R-016 — narration sub-clip 기준 정답 reveal 동기 (Stage 3 wire).
//   subClips.a0 = 15.96s (질문, 0~15.96):
//     "여기서 잠깐. 출발 묶음이 88, 92, 76 이라고 합시다" (~0~4s)
//     "어펜드 100" (~4~5.5s) — line1
//     "그 다음 스코어즈 대괄호 0 등호 95" (~5.5~8s) — line2
//     "그 다음 델 스코어즈 대괄호 1" (~8~10.5s) — line3
//     "이 세 줄을 차례로 실행하면 어떤 모습이 될까요" (~10.5~15.96s) — questionMark
//   subClips.s1 = 2.00s (정적, 15.96~17.96) — 학습자 생각 시간
//   subClips.a2 = 5.35s (정답, 17.96~23.31):
//     "정답은 95, 76, 100. 길이는 3입니다."
//
// revealAtSec 공식 (사용자 권장):
//   revealAtSec >= a0 + s1 + 0.3 = 18.26s (a2 시작 후 "정답은" 발화 즈음)
//   revealAtSec <= a0 + s1 + a2 * 0.25 = 19.30s (a2 의 첫 1/4 안)
//   채택: 18.6s (보수적 중간 — a2 시작 후 0.64s, "여기서 정답은" 의 "정답은")
const REVEAL = {
  codePanel: 0.2,
  line1: 5.0, // narration "어펜드 100" 발화 시점
  line2: 7.5, // narration "스코어즈 대괄호 0 등호 95"
  line3: 10.0, // narration "델 스코어즈 대괄호 1"
  questionMark: 12.5, // narration "어떤 모습이 될까요" 즈음
  // questionMark 가 a0 끝(15.96s) + s1 정적(17.96s) 까지 보여야:
  //   17.96 - 12.5 = 5.46s → lifespan 5.5
  qmLifespan: 5.5,
  resultSwap: 18.6, // a2 시작(17.96) 후 0.64s — "정답은 X입니다" 발화 즈음
  resultPulse: 19.6,
} as const;

/** 결과 박스 — QuestionMark 가 fade-out 후 fade-in. */
const ResultBox: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fadeInStart = REVEAL.resultSwap * fps;
  const fadeInEnd = (REVEAL.resultSwap + 0.4) * fps;
  const opacity = interpolate(frame, [fadeInStart, fadeInEnd], [0, 1], {
    easing: easeOutCubic,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scale = interpolate(frame, [fadeInStart, fadeInEnd], [0.9, 1.0], {
    easing: easeOutCubic,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 펄스 (한 번)
  const pulseStart = REVEAL.resultPulse * fps;
  const pulseOpacity = interpolate(
    frame,
    [pulseStart, pulseStart + 0.3 * fps, pulseStart + 1.0 * fps, pulseStart + 1.4 * fps],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale})`,
        position: "relative",
        padding: "32px 28px",
        borderRadius: 24,
        background: colors.bgWhite,
        border: `3px solid ${colors.accent}`,
        boxShadow: "0 4px 24px -8px rgba(24, 24, 27, 0.10)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
      }}
    >
      <ListVisual
        items={[
          { value: "95" },
          { value: "76" },
          { value: "100" },
        ]}
        boxSize={120}
        gap={20}
        showIndexStrip
        indexStripDelaySec={REVEAL.resultSwap + 0.2}
        indexStripStaggerSec={0.15}
        defaultItemDelaySec={REVEAL.resultSwap}
        lengthLabel="길이 = 3"
        lengthLabelDelaySec={REVEAL.resultSwap + 0.8}
      />
      {/* 펄스 링 */}
      <div
        style={{
          position: "absolute",
          inset: -8,
          borderRadius: 28,
          border: `4px solid ${colors.accent}`,
          opacity: pulseOpacity,
          pointerEvents: "none",
          boxShadow: "0 0 0 4px rgba(139, 92, 246, 0.18)",
        }}
      />
    </div>
  );
};

export const Scene08: React.FC = () => {
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
              textTransform: "uppercase",
            }}
          >
            잠깐 — 세 동작 후 모습은?
          </div>
        </FadeIn>
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "120px 96px 80px",
          gap: 80,
        }}
      >
        {/* 좌측 — 코드 3줄 */}
        <FadeIn delaySec={REVEAL.codePanel} translateY={18}>
          <CodePanel fileName="apply.py" width={680} height={260}>
            <CodeLine lineNumber={1} revealAtSec={REVEAL.line1}>
              <PyToken text="scores" kind="name" />
              <PyToken text="." kind="op" />
              <PyToken
                text="append"
                kind="func"
                style={{ color: colors.accentLight, fontWeight: 800 }}
              />
              <PyToken text="(" kind="op" />
              <PyToken text="100" kind="number" />
              <PyToken text=")" kind="op" />
            </CodeLine>
            <CodeLine lineNumber={2} revealAtSec={REVEAL.line2}>
              <PyToken text="scores" kind="name" />
              <PyToken text="[" kind="op" />
              <PyToken text="0" kind="number" highlight />
              <PyToken text="]" kind="op" />
              <PyToken text=" = " kind="op" />
              <PyToken text="95" kind="number" />
            </CodeLine>
            <CodeLine lineNumber={3} revealAtSec={REVEAL.line3}>
              <PyToken
                text="del"
                kind="keyword"
                style={{ color: colors.accentLight, fontWeight: 800 }}
              />
              <PyToken text=" " />
              <PyToken text="scores" kind="name" />
              <PyToken text="[" kind="op" />
              <PyToken text="1" kind="number" highlight />
              <PyToken text="]" kind="op" />
            </CodeLine>
          </CodePanel>
        </FadeIn>

        {/* 우측 — QuestionMark / 결과 (같은 좌표 swap) */}
        <div
          style={{
            position: "relative",
            width: 520,
            height: 320,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* QuestionMark */}
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <QuestionMark
              size={200}
              delaySec={REVEAL.questionMark}
              lifespanSec={REVEAL.qmLifespan}
              color={colors.accent}
            />
          </div>
          {/* 결과 박스 */}
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ResultBox />
          </div>
        </div>
      </div>
    </PageBackground>
  );
};
