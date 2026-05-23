/**
 * Scene 9 — 산술 결과 검증 + Active recall: double(7) (18s)
 *
 * - 0~4s: scene-08 우측의 `def double(x): / return x * 2` 두 줄이 화면 중앙으로 이동 (단일 컬럼).
 *         opacity 0.85 약간 톤 다운.
 * - 4~8s: 코드 아래 새 호출 줄 type-on: `double(7)`. `7` violet 강조.
 *         우측에 큰 물음표 박스 한 개 fade-in (가로 160, 세로 130, violet 외곽).
 *         박스 위 라벨 "결과는?". 1.5초 정적.
 * - 8~12s: 물음표 → `14` swap (scale up 0.4s, R-002 buffer 준수).
 *          violet pulse 한 번.
 *          R-004/R-016: narration "정답은 14" 발화 시점에 동기 (Stage 3 wire).
 * - 12~18s: 결과 박스에서 코드의 `return x * 2` 줄로 _되돌아오는 화살표_ 거꾸로 그려짐 (1.5s).
 *          화살표 옆 풀이 라벨 "x 자리에 7 → 7 × 2 = 14 → 돌려줌".
 *          lower-third "값이 자리로 들어가고, 계산 결과가 돌아온다".
 *
 * Active recall 2회차. 학습 목표 3·4 합산 검증.
 * scene-07/08 의 _되돌아오는 화살표_ 시각 일관성 유지 (시그니처 컷 학습 강화).
 */

import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import {
  CodeLine,
  CodePanel,
  FadeIn,
  LowerThird,
  PageBackground,
  PyToken,
  ReturnArrow,
} from "../primitives";
import { colors, fonts, radii, shadows } from "../theme";

const REVEAL = {
  codePanel: 0.3,
  line1: 0.5, // def double(x):  (dimmed 0.85)
  line2: 1.2, //     return x * 2 (dimmed 0.85)
  line3: 4.5, // double(7)
  questionBox: 5.5,
  // R-004 / R-016 — 정답 reveal 을 실측 audio 발화 시점에 동기 (re-sync):
  //   _scenes/scene-09.a0.mp3 = 8.664s (질문 발화)
  //   _scenes/scene-09.s1.mp3 = 1.567s (정적, 생각 비트)
  //   _scenes/scene-09.a2.mp3 = 7.656s (정답+풀이 발화)
  //   정답 발화 시작 = a0 + s1 = 10.23s, R-004 유효창 ≈ [10.53, 12.15]
  // 질문→정적 구간 [8.66, 10.23] 동안엔 물음표만. swap 은 정적 종료(10.23s) 이후.
  answerSwap: 10.7, // ? → 14, 실측 발화시점(10.23s) 직후. fade-in [11.2,11.6] 가 유효창 안.
  pulse: 11.2, // 답 settle(11.6) 직전부터 외곽 ring — 발화 비트와 동기
  // 정답 reveal 이 뒤로 밀렸으므로 "결과가 돌아온다" 비트(되돌아오는 화살표→풀이→lower-third)도 순차로 뒤로.
  returnArrow: 13.2, // 답 + pulse 후 되돌아오는 화살표 그리기 (1.5s)
  workoutLabel: 14.8, // 화살표 draw 완료(14.7) 직후
  lowerThird: 14.4,
} as const;

export const Scene09: React.FC = () => {
  return (
    <PageBackground>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          padding: "120px 80px 200px",
          gap: 60,
        }}
      >
        {/* 좌측 — 코드 + 호출 */}
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <FadeIn delaySec={REVEAL.codePanel} translateY={20}>
            <div style={{ position: "relative" }}>
              <CodePanel fileName="double.py" width={680} height={260}>
                <CodeLine lineNumber={1} revealAtSec={REVEAL.line1} dimmed>
                  <PyToken text="def" kind="keyword" />
                  <PyToken text=" " />
                  <PyToken text="double" kind="name" />
                  <PyToken text="(" kind="op" />
                  <PyToken text="x" kind="dictKey" />
                  <PyToken text=")" kind="op" />
                  <PyToken text=":" kind="op" />
                </CodeLine>
                <CodeLine lineNumber={2} revealAtSec={REVEAL.line2} dimmed>
                  <PyToken text="    " />
                  <PyToken text="return" kind="keyword" />
                  <PyToken text=" " />
                  <PyToken text="x" kind="dictKey" />
                  <PyToken text=" * " kind="op" />
                  <PyToken text="2" kind="number" />
                </CodeLine>
                <CodeLine lineNumber={3} revealAtSec={REVEAL.line3}>
                  <PyToken text="double" kind="name" />
                  <PyToken text="(" kind="op" />
                  <PyToken text="7" kind="number" highlight />
                  <PyToken text=")" kind="op" />
                </CodeLine>
              </CodePanel>

              {/* 되돌아오는 화살표 — line 3 (double(7)) 우측 → line 2 (return x * 2) 의 결과 자리
                  panel-relative 좌표:
                  CodePanel: header 40, padding 20, line height ~48
                  line 2 center ≈ 132 (return x * 2 의 결과 자리 우측)
                  line 3 center ≈ 186 (double(7) 우측)
                  화살표: (line 3 우측, y 186) → (line 2 결과 자리 우측, y 132)
                  곡선이 우측으로 부푸는 형태 — panel 안쪽 inset */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  pointerEvents: "none",
                }}
              >
                <ReturnArrow
                  width={680}
                  height={260}
                  strokeWidth={6}
                  arrows={[
                    {
                      // still frame 4770 측정: line 3 `double(7)` 텍스트 끝 ≈ x 198,
                      // line 2 `return x * 2` 텍스트 끝 ≈ x 286 (4-space indent 라 더 김).
                      // 두 endpoint X 를 텍스트 끝(286) 너머 우측 여백(x 330)으로 밀어
                      // 곡선이 코드 글자를 가로지르지 않게 한다. 곡선은 x 330 → 540 → 330
                      // 으로 우측으로만 부풀어 글자 영역(≤286)을 침범하지 않음.
                      // (scene-07/08 역방향 곡선 시각 일관성 유지.)
                      startX: 330, // double(7) 우측 여백 (텍스트 끝 198 너머)
                      startY: 186,
                      endX: 330, // return x * 2 결과 자리 — 텍스트 끝 286 너머
                      endY: 130,
                      controlX: 540, // 우측 여백으로 부풀기 (panel 680 안, R-024)
                      controlY: 158,
                      delaySec: REVEAL.returnArrow,
                      drawDurationSec: 1.5,
                      color: "#a78bfa", // violet-400, 다크 패널 위 가시
                    },
                  ]}
                />
              </div>
            </div>
          </FadeIn>
        </div>

        {/* 우측 — ? → 14 swap 박스 */}
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <BigSwapBox
            enterAt={REVEAL.questionBox}
            swapAt={REVEAL.answerSwap}
            pulseAt={REVEAL.pulse}
            answer="14"
          />
        </div>
      </div>

      {/* 풀이 라벨 — 답 + 화살표 등장 후 */}
      <div
        style={{
          position: "absolute",
          bottom: 200,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <FadeIn delaySec={REVEAL.workoutLabel} translateY={8}>
          <div
            style={{
              padding: "10px 26px",
              borderRadius: radii.pill,
              background: colors.bgWhite,
              border: `1.5px solid ${colors.accent}`,
              color: colors.accentInk,
              fontFamily: fonts.sans,
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: "-0.01em",
              whiteSpace: "nowrap",
            }}
          >
            <span style={{ fontFamily: fonts.mono, fontWeight: 800 }}>x</span> 자리에 7 → 7 × 2 = 14
            → 돌려줌
          </div>
        </FadeIn>
      </div>

      <LowerThird
        text={
          <>
            값이 <span style={{ color: colors.accentLight, fontWeight: 700 }}>자리로</span> 들어가고,
            계산 결과가 <span style={{ color: colors.accentLight, fontWeight: 700 }}>돌아온다</span>
          </>
        }
        delaySec={REVEAL.lowerThird}
      />
    </PageBackground>
  );
};

/** 큰 박스 — "결과는?" 라벨 위 + ? → answer swap. R-002 준수. */
const BigSwapBox: React.FC<{
  enterAt: number;
  swapAt: number;
  pulseAt: number;
  answer: string;
}> = ({ enterAt, swapAt, pulseAt, answer }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 등장
  const enter = enterAt * fps;
  const reveal = interpolate(frame, [enter, enter + 0.4 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // R-002: ? fade-out [swapAt, swapAt + 0.3], answer fade-in [swapAt + 0.5, swapAt + 0.9]
  const qFadeOpacity = interpolate(
    frame,
    [swapAt * fps, (swapAt + 0.3) * fps],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const aOpacity = interpolate(
    frame,
    [(swapAt + 0.5) * fps, (swapAt + 0.9) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const aScale = interpolate(
    frame,
    [(swapAt + 0.5) * fps, (swapAt + 1.0) * fps],
    [1.4, 1.0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // 답 등장 후 외곽 violet pulse
  const pStart = pulseAt * fps;
  const pulse = interpolate(
    frame,
    [pStart, pStart + 0.3 * fps, pStart + 0.7 * fps, pStart + 1.2 * fps],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 14,
        opacity: reveal,
        transform: `translateY(${(1 - reveal) * 10}px)`,
      }}
    >
      {/* 라벨 "결과는?" */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          padding: "8px 22px",
          borderRadius: radii.pill,
          background: colors.accentSoft,
          color: colors.accentInk,
          fontFamily: fonts.sans,
          fontSize: 24,
          fontWeight: 700,
          border: `1.5px solid ${colors.accent}`,
          letterSpacing: "-0.01em",
        }}
      >
        결과는?
      </div>

      {/* 박스 본체 */}
      <div
        style={{
          position: "relative",
          width: 200,
          height: 160,
          borderRadius: 18,
          background: colors.bgWhite,
          border: `3px solid ${colors.accent}`,
          boxShadow: shadows.card,
          overflow: "hidden",
        }}
      >
        {/* ? layer */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: qFadeOpacity,
            fontFamily: fonts.sans,
            fontSize: 120,
            fontWeight: 900,
            color: colors.accent,
            letterSpacing: "-0.04em",
            lineHeight: 1,
          }}
        >
          ?
        </div>
        {/* answer layer */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: aOpacity,
            transform: `scale(${aScale})`,
            fontFamily: fonts.mono,
            fontSize: 84,
            fontWeight: 900,
            color: colors.accentDeep,
            letterSpacing: "-0.02em",
            lineHeight: 1,
          }}
        >
          {answer}
        </div>
        {/* 외곽 pulse ring */}
        <div
          style={{
            position: "absolute",
            inset: -6,
            borderRadius: 24,
            border: `3px solid ${colors.accent}`,
            opacity: pulse,
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
};
