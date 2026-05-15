/**
 * Scene 3 — 오개념 1: input() 반환은 항상 문자열 (35s)
 *
 * 영상의 *가장 무거운 비트*. 학습 목표 2번 (input 반환 타입 = str → int()) 정면.
 *
 * 타이밍 (scene local, 총 35s):
 *   0.0 ~ 3.0  : 좌상단 라벨 카드 "자주 막히는 지점 1번 / input() 의 반환 타입"
 *   3.0 ~ 8.0  : 좌측 코드 패널에 3줄 type-on (a=input, b=input, print(a+b))
 *   8.0 ~ 13.0 : 우측 콘솔에 첫째: 3 / 둘째: 5 / 결과 "35" 큰 글씨 + 기대/실제 라벨
 *   13.0 ~ 18.0: 화면 좌우 split — "문자 + 문자 = 이어붙이기" vs "숫자 + 숫자 = 더하기"
 *   18.0 ~ 25.0: split 해소, 코드의 a/b 줄에 `int(` `)` 가 끼어드는 type-on
 *   25.0 ~ 32.0: 콘솔 갱신, 같은 입력 → 결과 "8"
 *   32.0 ~ 35.0: 결론 카드 "input 의 결과는 문자열 — 숫자로 쓰려면 int() 로 감싼다"
 *
 * emphasisBeats: 라벨의 "문자열" 단어 펄스 / 콘솔의 "8" 결과 펄스 (narration 동기).
 *
 * 35초가 길어 한 scene 안에서 visual 이 두 phase 로 나뉜다 — opacity 마스크로
 * 자연스럽게 phase 전환 (CSS transition 사용 안 함, frame interpolate 만).
 */

import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import {
  CodeLine,
  CodePanel,
  ConsoleLine,
  ConsolePanel,
  EmphasisPulse,
  FadeIn,
  PageBackground,
  PyToken,
  TypeOnTokens,
  easeOutCubic,
} from "../primitives";
import { colors, fonts, radii, shadows } from "../theme";

const PhaseA: React.FC = () => {
  // 0 ~ 13s 가시: 코드 패널 + 콘솔 (35 결과)
  // 13 ~ 18s split 으로 가는 동안 opacity 1 → 0.15 로 fade-out (코드만 dim, 콘솔은 split 안에서 살림)
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const codeOpacity = interpolate(frame, [13 * fps, 14.5 * fps], [1, 0.3], {
    easing: easeOutCubic,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // 18s 부터 다시 살아남 (split 해소)
  const codeRevive = interpolate(frame, [18 * fps, 19 * fps], [0, 1], {
    easing: easeOutCubic,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const finalOpacity = Math.max(codeOpacity, codeRevive * 1.0);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        padding: "120px 80px",
        gap: 40,
        opacity: finalOpacity,
      }}
    >
      {/* 좌 — 코드 패널 (3줄, 18s 부터 5줄로 자연 확장) */}
      <div style={{ flex: 0.55, display: "flex", justifyContent: "flex-end" }}>
        <FadeIn delaySec={2.5} translateY={20}>
          <CodePanel fileName="oops.py" width={700} height={420}>
            {/* 1줄: a = input("첫째: ") */}
            <CodeLine lineNumber={1} revealAtSec={3.0}>
              <PyToken text="a" kind="name" />
              <PyToken text=" " />
              <PyToken text="=" kind="op" />
              <PyToken text=" " />
              <TypeOnTokens
                delaySec={3.3}
                msPerChar={60}
                segments={[
                  { text: "input", kind: "func" },
                  { text: '("첫째: ")', kind: "string" },
                ]}
              />
            </CodeLine>
            {/* 2줄: b = input("둘째: ") */}
            <CodeLine lineNumber={2} revealAtSec={4.6}>
              <PyToken text="b" kind="name" />
              <PyToken text=" " />
              <PyToken text="=" kind="op" />
              <PyToken text=" " />
              <TypeOnTokens
                delaySec={4.9}
                msPerChar={60}
                segments={[
                  { text: "input", kind: "func" },
                  { text: '("둘째: ")', kind: "string" },
                ]}
              />
            </CodeLine>
            {/* 3줄: print(a + b) */}
            <CodeLine lineNumber={3} revealAtSec={6.2}>
              <PyToken text="print" kind="func" />
              <PyToken text="(" kind="op" />
              <PyToken text="a" kind="name" />
              <PyToken text=" " />
              <PyToken text="+" kind="op" />
              <PyToken text=" " />
              <PyToken text="b" kind="name" />
              <PyToken text=")" kind="op" />
            </CodeLine>
            <div style={{ height: 14 }} />
            {/*
              18s 부터 4·5줄 추가 (a, b 의 int() 적용 버전)
              "두 부분이 추가 type-on" 을 표현하기 위해 두 줄 통째로 새로 등장.
            */}
            <CodeLine lineNumber={4} revealAtSec={19.0} highlighted highlightDurationSec={4.0}>
              <PyToken text="a" kind="name" />
              <PyToken text=" " />
              <PyToken text="=" kind="op" />
              <PyToken text=" " />
              <TypeOnTokens
                delaySec={19.4}
                msPerChar={60}
                segments={[
                  { text: "int", kind: "func" },
                  { text: "(", kind: "op" },
                  { text: "input", kind: "func" },
                  { text: '("첫째: ")', kind: "string" },
                  { text: ")", kind: "op" },
                ]}
              />
            </CodeLine>
            <CodeLine lineNumber={5} revealAtSec={21.0} highlighted highlightDurationSec={3.0}>
              <PyToken text="b" kind="name" />
              <PyToken text=" " />
              <PyToken text="=" kind="op" />
              <PyToken text=" " />
              <TypeOnTokens
                delaySec={21.4}
                msPerChar={60}
                segments={[
                  { text: "int", kind: "func" },
                  { text: "(", kind: "op" },
                  { text: "input", kind: "func" },
                  { text: '("둘째: ")', kind: "string" },
                  { text: ")", kind: "op" },
                ]}
              />
            </CodeLine>
          </CodePanel>
        </FadeIn>
      </div>

      {/* 우 — 콘솔 패널 (35 → 8 swap) */}
      <div style={{ flex: 0.45, display: "flex", justifyContent: "flex-start" }}>
        <FadeIn delaySec={7.5} translateY={20}>
          <ConsolePanel title="콘솔" width={620} height={420}>
            <ConsoleLine revealAtSec={8.0}>
              <span style={{ color: colors.darkInk }}>첫째: </span>
              <span style={{ color: colors.darkAccent, fontWeight: 800 }}>3</span>
            </ConsoleLine>
            <ConsoleLine revealAtSec={9.0}>
              <span style={{ color: colors.darkInk }}>둘째: </span>
              <span style={{ color: colors.darkAccent, fontWeight: 800 }}>5</span>
            </ConsoleLine>
            <div style={{ height: 18 }} />
            {/*
              결과 35: 10s 등장 → 25s 까지 보임.
              25s 에 8 로 swap (별도 줄로 fade-in).
            */}
            <ConsoleResultSwap />
          </ConsolePanel>
        </FadeIn>
      </div>
    </div>
  );
};

const ConsoleResultSwap: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // v4 fix: 35 fade-out 0.5s, 그 후 0.2s gap, 8 fade-in 0.4s — 두 div 가 동시에 보이지 않도록.
  const opacity35 = interpolate(
    frame,
    [10 * fps, 10.4 * fps, 24 * fps, 24.5 * fps],
    [0, 1, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
  const opacity8 = interpolate(frame, [24.7 * fps, 25.1 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const labelOpacity35 = interpolate(
    frame,
    [10.6 * fps, 11.4 * fps, 24 * fps, 24.5 * fps],
    [0, 1, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
  const labelOpacity8 = interpolate(frame, [25.5 * fps, 26.2 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // v4 fix: fontSize 44 → 32 — 입력값(콘솔 fontSize 30)과 비례 자연스럽게.
  // 라벨 top 52 → 60 — 결과 글자와 라벨 사이 여백 확보.
  // whiteSpace nowrap — "출력: 8" 한 줄 보장.
  const resultFontSize = 32;
  const labelTop = 60;
  return (
    <>
      <div style={{ position: "relative", minHeight: 100 }}>
        {/* 결과 35 (잘못된 결과) */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            opacity: opacity35,
            display: "flex",
            alignItems: "center",
            gap: 14,
            whiteSpace: "nowrap",
          }}
        >
          <span style={{ color: colors.darkMuted, fontSize: 24, fontFamily: fonts.sans }}>
            출력:
          </span>
          <span
            style={{
              color: colors.danger,
              fontSize: resultFontSize,
              fontWeight: 800,
              fontFamily: fonts.mono,
            }}
          >
            35
          </span>
        </div>
        <div
          style={{
            position: "absolute",
            top: labelTop,
            left: 0,
            opacity: labelOpacity35,
            fontFamily: fonts.sans,
            fontSize: 20,
            fontWeight: 600,
            color: colors.darkMuted,
            whiteSpace: "nowrap",
          }}
        >
          기대: 8, 실제: 35
        </div>

        {/* 결과 8 (올바른 결과) — 35 fade-out 완료 후 0.2s gap 두고 등장 */}
        <EmphasisPulse atSec={27.0}>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              opacity: opacity8,
              display: "flex",
              alignItems: "center",
              gap: 14,
              whiteSpace: "nowrap",
            }}
          >
            <span style={{ color: colors.darkMuted, fontSize: 24, fontFamily: fonts.sans }}>
              출력:
            </span>
            <span
              style={{
                color: colors.darkAccent,
                fontSize: resultFontSize,
                fontWeight: 800,
                fontFamily: fonts.mono,
              }}
            >
              8
            </span>
          </div>
        </EmphasisPulse>
        <div
          style={{
            position: "absolute",
            top: labelTop,
            left: 0,
            opacity: labelOpacity8,
            fontFamily: fonts.sans,
            fontSize: 20,
            fontWeight: 600,
            color: colors.success,
            whiteSpace: "nowrap",
          }}
        >
          기대: 8, 실제: 8
        </div>
      </div>
    </>
  );
};

const SplitPhase: React.FC = () => {
  // 13 ~ 18s 만 가시
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = interpolate(frame, [13 * fps, 13.6 * fps, 17.6 * fps, 18.0 * fps], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "120px 96px",
        gap: 48,
        opacity,
        pointerEvents: "none",
      }}
    >
      {/* 좌측 — 문자 + 문자 */}
      <div
        style={{
          flex: 1,
          maxWidth: 720,
          background: colors.bgWhite,
          borderRadius: radii.card,
          border: `1px solid ${colors.border}`,
          boxShadow: shadows.card,
          padding: "40px 44px",
          textAlign: "center",
          fontFamily: fonts.sans,
        }}
      >
        <div
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: colors.inkMuted,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            marginBottom: 22,
          }}
        >
          문자 + 문자 = 이어붙이기
        </div>
        <div
          style={{
            background: colors.darkBg,
            borderRadius: 12,
            padding: "24px 28px",
            border: `1px solid ${colors.darkBg2}`,
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <div style={{ fontSize: 44, fontWeight: 700, fontFamily: fonts.mono }}>
            <PyToken text={'"3"'} kind="string" />
            <PyToken text=" + " kind="op" />
            <PyToken text={'"5"'} kind="string" />
          </div>
          <div style={{ fontSize: 30, color: colors.darkMuted, fontFamily: fonts.mono }}>
            → <span style={{ color: colors.danger, fontWeight: 800 }}>{'"35"'}</span>
          </div>
        </div>
      </div>

      {/* 우측 — 숫자 + 숫자 */}
      <div
        style={{
          flex: 1,
          maxWidth: 720,
          background: colors.bgWhite,
          borderRadius: radii.card,
          border: `1px solid ${colors.border}`,
          boxShadow: shadows.card,
          padding: "40px 44px",
          textAlign: "center",
          fontFamily: fonts.sans,
        }}
      >
        <div
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: colors.accentDeep,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            marginBottom: 22,
          }}
        >
          숫자 + 숫자 = 더하기
        </div>
        <div
          style={{
            background: colors.darkBg,
            borderRadius: 12,
            padding: "24px 28px",
            border: `1px solid ${colors.darkBg2}`,
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <div style={{ fontSize: 44, fontWeight: 700, fontFamily: fonts.mono }}>
            <PyToken text="3" kind="number" />
            <PyToken text=" + " kind="op" />
            <PyToken text="5" kind="number" />
          </div>
          <div style={{ fontSize: 30, color: colors.darkMuted, fontFamily: fonts.mono }}>
            → <span style={{ color: colors.darkAccent, fontWeight: 800 }}>8</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const ConclusionCard: React.FC = () => {
  // 32s 부터 등장
  return (
    <div
      style={{
        position: "absolute",
        bottom: 120,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <FadeIn delaySec={32.0} translateY={16}>
        <div
          style={{
            padding: "22px 36px",
            borderRadius: radii.card,
            background: colors.accentSoft,
            border: `1px solid ${colors.accent}`,
            boxShadow: shadows.card,
            fontFamily: fonts.sans,
            fontSize: 28,
            fontWeight: 700,
            color: colors.accentInk,
            letterSpacing: "-0.01em",
          }}
        >
          input() 의 결과는 문자열 — 숫자로 쓰려면{" "}
          <span style={{ color: colors.accent, fontWeight: 800, fontFamily: fonts.mono }}>
            int()
          </span>{" "}
          로 감싼다
        </div>
      </FadeIn>
    </div>
  );
};

export const Scene03: React.FC = () => {
  return (
    <PageBackground>
      {/* 좌상단 라벨 카드 — "자주 막히는 지점 1번" */}
      <div style={{ position: "absolute", top: 80, left: 80 }}>
        <FadeIn delaySec={0.2} translateY={8}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 20px",
              borderRadius: radii.pill,
              background: colors.accentSoft,
              border: `1px solid ${colors.accent}`,
              fontFamily: fonts.sans,
              fontSize: 22,
              fontWeight: 700,
              color: colors.accentInk,
              letterSpacing: "-0.01em",
            }}
          >
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: colors.accent,
              }}
            />
            <span>자주 막히는 지점 1번 · input() 의 반환 타입은 </span>
            <EmphasisPulse atSec={5.6} scaleAmp={0.18} durationSec={0.6}>
              <span style={{ color: colors.accentDeep, fontWeight: 800 }}>문자열</span>
            </EmphasisPulse>
          </div>
        </FadeIn>
      </div>

      <PhaseA />
      <SplitPhase />
      <ConclusionCard />
    </PageBackground>
  );
};
