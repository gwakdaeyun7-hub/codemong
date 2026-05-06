/**
 * Scene 10 — .py 작성·저장·실행 (18s)
 *
 * - 좌측: VS Code mock (사이드바 + 에디터)
 *     사이드바에 hello.py
 *     에디터에 print("Hello, Python")  type-on
 * - 우측: 터미널 mock
 *     $ python hello.py  type-on
 *     Hello, Python  fade-in
 * - 좌→우 흐름이 보이도록 작은 화살표 transition
 *
 * 학습 목표 4번 핵심: "쓰기 → 저장 → 실행" 순서 인식.
 */

import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { FadeIn, PageBackground, TerminalMock, TypeOn, VsCodeMock } from "../primitives";
import { colors, fonts } from "../theme";

const EDITOR_TYPE_AT = 0.8;
const EDITOR_CODE = 'print("Hello, Python")';
const EDITOR_CODE_MS = 55;
const EDITOR_END = EDITOR_TYPE_AT + (EDITOR_CODE.length * EDITOR_CODE_MS) / 1000;

const ARROW_AT = EDITOR_END + 0.6;
const TERMINAL_TYPE_AT = ARROW_AT + 0.4;
const TERMINAL_COMMAND = "python hello.py";
const TERMINAL_MS = 55;
const TERMINAL_END =
  TERMINAL_TYPE_AT + (TERMINAL_COMMAND.length * TERMINAL_MS) / 1000;
const TERMINAL_OUTPUT_AT = TERMINAL_END + 0.6;

const FlowArrow: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = interpolate(
    frame,
    [ARROW_AT * fps, (ARROW_AT + 0.4) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const slide = interpolate(
    frame,
    [ARROW_AT * fps, (ARROW_AT + 0.6) * fps],
    [-12, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return (
    <div
      style={{
        opacity,
        transform: `translateX(${slide}px)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
      }}
    >
      <div
        style={{
          fontFamily: fonts.sans,
          fontSize: 22,
          fontWeight: 700,
          color: colors.accent,
          letterSpacing: "-0.01em",
        }}
      >
        실행
      </div>
      <div
        style={{
          fontFamily: fonts.sans,
          fontSize: 64,
          color: colors.accent,
          fontWeight: 800,
          lineHeight: 1,
        }}
      >
        →
      </div>
    </div>
  );
};

export const Scene10: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const outputOpacity = interpolate(
    frame,
    [TERMINAL_OUTPUT_AT * fps, (TERMINAL_OUTPUT_AT + 0.5) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <PageBackground>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: 200,
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
              marginBottom: 24,
            }}
          >
            쓰기 → 저장 → 실행
          </div>
        </FadeIn>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 28,
          }}
        >
          <FadeIn delaySec={0.4} translateY={20}>
            <VsCodeMock fileName="hello.py" width={820} height={460}>
              <div style={{ display: "flex", gap: 18 }}>
                <span style={{ color: colors.darkMuted, opacity: 0.6 }}>1</span>
                <TypeOn
                  text={EDITOR_CODE}
                  delaySec={EDITOR_TYPE_AT}
                  msPerChar={EDITOR_CODE_MS}
                  caret
                  style={{ color: colors.darkInk }}
                />
              </div>
            </VsCodeMock>
          </FadeIn>
          <FlowArrow />
          <FadeIn delaySec={0.5} translateY={20}>
            <TerminalMock width={780} height={460} title="Terminal">
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <span style={{ color: colors.darkAccent }}>$</span>
                  <TypeOn
                    text={TERMINAL_COMMAND}
                    delaySec={TERMINAL_TYPE_AT}
                    msPerChar={TERMINAL_MS}
                    caret
                    style={{ color: colors.darkInk }}
                  />
                </div>
                <div
                  style={{
                    paddingLeft: 18,
                    color: colors.darkInk,
                    opacity: outputOpacity,
                  }}
                >
                  Hello, Python
                </div>
              </div>
            </TerminalMock>
          </FadeIn>
        </div>
      </div>
    </PageBackground>
  );
};
