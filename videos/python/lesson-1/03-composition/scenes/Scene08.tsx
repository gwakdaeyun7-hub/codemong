/**
 * Scene 8 — 설치됐는지 확인하기 (14s)
 *
 * - 화면 중앙 단순화된 터미널 창 mock
 * - 프롬프트: $ python --version  (한 글자씩 type-on, 약 1초)
 * - 1초 후 다음 줄에 출력: Python 3.12.5  (fade-in)
 * - 출력 줄 우측에 작은 ✓ 아이콘 (violet-500)
 * - lower-third: "맥은 python3 --version 일 수 있어요"
 */

import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { FadeIn, LowerThird, PageBackground, TerminalMock, TypeOn } from "../primitives";
import { colors, fonts } from "../theme";

const TYPE_START = 0.6; // sec
const COMMAND = "python --version";
const COMMAND_MS_PER_CHAR = 60;
const COMMAND_END = TYPE_START + (COMMAND.length * COMMAND_MS_PER_CHAR) / 1000;
const OUTPUT_AT = COMMAND_END + 0.6;

export const Scene08: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const checkOpacity = interpolate(
    frame,
    [(OUTPUT_AT + 0.4) * fps, (OUTPUT_AT + 1.0) * fps],
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
            설치 확인
          </div>
        </FadeIn>
        <FadeIn delaySec={0.3} translateY={20}>
          <TerminalMock width={1100} height={460} title="Terminal — 버전 확인">
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  fontFamily: fonts.mono,
                  fontSize: 32,
                }}
              >
                <span style={{ color: colors.darkAccent }}>$</span>
                <TypeOn
                  text={COMMAND}
                  delaySec={TYPE_START}
                  msPerChar={COMMAND_MS_PER_CHAR}
                  caret
                  style={{ color: colors.darkInk }}
                />
              </div>
              <FadeIn delaySec={OUTPUT_AT} translateY={6}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    fontFamily: fonts.mono,
                    fontSize: 32,
                    color: colors.darkInk,
                  }}
                >
                  <span style={{ width: 18 }} />
                  <span>Python 3.12.5</span>
                  <span
                    style={{
                      marginLeft: 12,
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: colors.accent,
                      color: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 22,
                      fontWeight: 800,
                      fontFamily: fonts.sans,
                      opacity: checkOpacity,
                    }}
                  >
                    ✓
                  </span>
                </div>
              </FadeIn>
            </div>
          </TerminalMock>
        </FadeIn>
      </div>
      <LowerThird text="맥은 python3 --version 일 수 있어요" delaySec={6.0} />
    </PageBackground>
  );
};
