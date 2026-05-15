/**
 * Scene 8 — `while` 코드 + 종료 조건 책임 (n+1 빠지면 무한 루프) (22s)
 *
 * 학습 목표 3번 핵심. 오개념 3번 (무한 루프) 정면 처치 — 정적 강조만, 무한 출력 시뮬레이션 X.
 *
 * - 0~3s: 화면 중앙 코드 패널, 1줄 type-on `password = input("암호: ")`
 * - 3~8s: 2줄 type-on `while password != "1234":`
 *     `while`, `!=` violet 강조. 우측 라벨 "조건이 참인 동안 반복"
 * - 8~13s: 3줄 type-on `    password = input("다시: ")` (들여쓰기)
 *     좌측 violet-300 세로 가이드 라인
 * - 13~18s: 우측 콘솔 — 입력 시뮬레이션 fade-in
 *     `암호: 0000` (사용자 입력)
 *     `다시: 1111` (사용자 입력)
 *     `다시: 1234` ← 멈춤. 마지막 입력 violet-500 펄스
 * - 18~22s: 코드 3줄 둘러싸는 형광 박스 (HighlightBox). lower-third "이 줄 빠지면 — 영원히 안 멈춤"
 *
 * 무한 출력 컷 절대 없음. 정적 강조만.
 */

import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import {
  CodeLine,
  CodePanel,
  ConsoleLine,
  ConsolePanel,
  FadeIn,
  HighlightBox,
  IndentGuide,
  LowerThird,
  PageBackground,
  PyToken,
} from "../primitives";
import { colors, fonts, radii } from "../theme";

const REVEAL = {
  panel: 0.3,
  line1: 0.7,
  line2: 3.0,
  line3: 8.0,
  guide: 9.0,
  whileLabel: 6.0,
  console0: 13.0,
  console1: 14.5,
  console2: 16.0,
  consolePulse: 17.5,
  highlight: 18.0,
  lowerThird: 19.0,
} as const;

/** 마지막 입력 (1234) 위에 violet 펄스 외곽선. */
const LastLinePulse: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = REVEAL.consolePulse * fps;
  const opacity = interpolate(
    frame,
    [start, start + 0.3 * fps, start + 0.9 * fps, start + 1.4 * fps],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return (
    <div
      style={{
        position: "absolute",
        left: 16,
        right: 16,
        // 콘솔 마지막 줄 위치 — padding 20 (top) + 헤더 40 + line-height 약 50 * 2 = 160
        top: 196,
        height: 56,
        border: `2.5px solid ${colors.accent}`,
        borderRadius: 8,
        opacity,
        pointerEvents: "none",
        boxShadow: "0 0 0 3px rgba(139, 92, 246, 0.16)",
      }}
    />
  );
};

export const Scene08: React.FC = () => {
  return (
    <PageBackground>
      <div
        style={{
          position: "absolute",
          top: 50,
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
              textTransform: "uppercase",
            }}
          >
            `while` — 조건이 참인 동안
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
          gap: 50,
        }}
      >
        {/* 좌측 — 코드 패널 + 형광 박스 */}
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <FadeIn delaySec={REVEAL.panel} translateY={20}>
            <div style={{ position: "relative" }}>
              <CodePanel fileName="login.py" width={760} height={300}>
                <CodeLine lineNumber={1} revealAtSec={REVEAL.line1}>
                  <PyToken text="password" kind="name" />
                  <PyToken text=" " />
                  <PyToken text="=" kind="op" />
                  <PyToken text=" " />
                  <PyToken text="input" kind="func" />
                  <PyToken text="(" kind="op" />
                  <PyToken text={'"암호: "'} kind="string" />
                  <PyToken text=")" kind="op" />
                </CodeLine>
                <CodeLine lineNumber={2} revealAtSec={REVEAL.line2}>
                  <PyToken text="while" kind="keyword" />
                  <PyToken text=" " />
                  <PyToken text="password" kind="name" />
                  <PyToken text=" " />
                  <PyToken text="!=" kind="op" />
                  <PyToken text=" " />
                  <PyToken text={'"1234"'} kind="string" />
                  <PyToken text=":" kind="op" />
                </CodeLine>
                <CodeLine lineNumber={3} revealAtSec={REVEAL.line3}>
                  <PyToken text="    " />
                  <PyToken text="password" kind="name" />
                  <PyToken text=" " />
                  <PyToken text="=" kind="op" />
                  <PyToken text=" " />
                  <PyToken text="input" kind="func" />
                  <PyToken text="(" kind="op" />
                  <PyToken text={'"다시: "'} kind="string" />
                  <PyToken text=")" kind="op" />
                </CodeLine>
              </CodePanel>
              {/*
                3줄 들여쓰기 가이드 (1단). 패널 본문 padding 20 + 헤더 40 = 60.
                line-height ≈ 48 → 3줄 시작 ≈ 60 + 48*2 = 156.
              */}
              <IndentGuide
                left={64}
                top={156}
                height={50}
                depth={1}
                delaySec={REVEAL.guide}
                durationSec={0.5}
              />

              {/*
                형광 박스 — 3줄을 둘러쌈. 18s 부터 정적 등장.
                위치: line 3 ≈ top 156. 박스가 코드 줄 통째로 감싸도록 약간 여유.
              */}
              <HighlightBox
                left={26}
                top={148}
                width={690}
                height={64}
                delaySec={REVEAL.highlight}
                durationSec={0.6}
              />
            </div>
          </FadeIn>

          {/* 2줄 우측 — "조건이 참인 동안 반복" 라벨 */}
          <div
            style={{
              position: "absolute",
              left: "calc(50% - 30px)",
              top: 400, // approx 2줄 우측 — 패널 헤더 60 + line-height 48 + offset
              maxWidth: 280,
            }}
          >
            <FadeIn delaySec={REVEAL.whileLabel} translateY={-6}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span
                  style={{
                    fontSize: 22,
                    color: colors.accent,
                    fontWeight: 800,
                  }}
                >
                  ←
                </span>
                <div
                  style={{
                    padding: "6px 14px",
                    borderRadius: radii.pill,
                    background: colors.accentSoft,
                    color: colors.accentInk,
                    fontFamily: fonts.sans,
                    fontSize: 18,
                    fontWeight: 700,
                    letterSpacing: "-0.01em",
                    border: `1.5px solid ${colors.accent}`,
                    whiteSpace: "nowrap",
                  }}
                >
                  조건이 참인 동안 반복
                </div>
              </div>
            </FadeIn>
          </div>
        </div>

        {/* 우측 — 콘솔 (입력 시뮬레이션) */}
        <div
          style={{
            flex: "0 0 460",
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <div style={{ position: "relative" }}>
            <FadeIn delaySec={REVEAL.panel} translateY={20}>
              <ConsolePanel title="콘솔" width={440} height={300}>
                <ConsoleLine revealAtSec={REVEAL.console0}>
                  <span style={{ fontSize: 26, fontWeight: 600, color: colors.darkInk }}>
                    암호: <span style={{ color: colors.darkAccent }}>0000</span>
                  </span>
                </ConsoleLine>
                <ConsoleLine revealAtSec={REVEAL.console1}>
                  <span style={{ fontSize: 26, fontWeight: 600, color: colors.darkInk }}>
                    다시: <span style={{ color: colors.darkAccent }}>1111</span>
                  </span>
                </ConsoleLine>
                <ConsoleLine revealAtSec={REVEAL.console2}>
                  <span style={{ fontSize: 26, fontWeight: 600, color: colors.darkInk }}>
                    다시: <span style={{ color: colors.accentLight, fontWeight: 800 }}>1234</span>
                  </span>
                </ConsoleLine>
              </ConsolePanel>
            </FadeIn>
            <LastLinePulse />
          </div>
        </div>
      </div>

      <LowerThird
        text={
          <>
            이 줄 빠지면 —{" "}
            <span style={{ fontWeight: 800, color: colors.warn }}>영원히</span> 안 멈춤
          </>
        }
        delaySec={REVEAL.lowerThird}
      />
    </PageBackground>
  );
};
