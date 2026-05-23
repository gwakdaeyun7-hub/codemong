/**
 * Scene 11 — 정리 3단 카드 + 12강 디버깅 & AI 예고 (18s)
 *
 * 시즌 정형 통일 (lesson-10 Scene11 baseline) — 좌 절반 체크리스트 (✓ 36×36
 * violet) / 우 절반 `<Card variant="accent">` 다음 강의 카드 / 하단 LowerThird.
 *
 * 3단 정리:
 *   1. 파일을 안전하게 열기 — `with open(파일, 모드) as f:`
 *   2. 저장하기 — `"w"` + `f.write(문자열)`
 *   3. 불러오기 — `"r"` + `내용 = f.read()`
 *
 * 추가 부가 라벨: "_프로그램이 끝나도_ — _파일은 남는다_" 작은 강조.
 *
 * 다음 강의 카드 = 12강 디버깅 & AI 활용.
 *
 * delaySec 시퀀스 (lesson-10 답습):
 *   - 체크리스트 0.6 + i × 0.35 (i = 0/1/2 → 0.6 / 0.95 / 1.3)
 *   - 다음 강의 카드 1.6 (시즌 정형 — lesson-10 의 1.8 과 ±0.2 범위 안)
 *   - LowerThird 3.0
 */

import React from "react";
import {
  Card,
  FadeIn,
  LowerThird,
  PageBackground,
} from "../primitives";
import { colors, fonts, radii } from "../theme";

const checklist: { label: React.ReactNode; desc: React.ReactNode }[] = [
  {
    label: "파일을 안전하게 열기",
    desc: (
      <span style={{ fontFamily: fonts.mono, color: colors.accentDeep, fontWeight: 700 }}>
        with open(파일, 모드) as f:
      </span>
    ),
  },
  {
    label: "저장하기",
    desc: (
      <span>
        <span style={{ fontFamily: fonts.mono, color: colors.accentDeep, fontWeight: 700 }}>
          "w"
        </span>{" "}
        +{" "}
        <span style={{ fontFamily: fonts.mono, color: colors.accentDeep, fontWeight: 700 }}>
          f.write(문자열)
        </span>
      </span>
    ),
  },
  {
    label: "불러오기",
    desc: (
      <span>
        <span style={{ fontFamily: fonts.mono, color: colors.accentDeep, fontWeight: 700 }}>
          "r"
        </span>{" "}
        +{" "}
        <span style={{ fontFamily: fonts.mono, color: colors.accentDeep, fontWeight: 700 }}>
          내용 = f.read()
        </span>
      </span>
    ),
  },
];

export const Scene11: React.FC = () => {
  return (
    <PageBackground>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 56,
          paddingLeft: 96,
          paddingRight: 96,
          paddingBottom: 200,
        }}
      >
        {/* Left: checklist */}
        <FadeIn delaySec={0.2} translateY={16}>
          <Card style={{ width: 640, padding: "48px 48px" }}>
            <div
              style={{
                fontFamily: fonts.sans,
                fontSize: 26,
                fontWeight: 600,
                color: colors.accentDeep,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                marginBottom: 24,
              }}
            >
              오늘 한 일
            </div>
            <ul
              style={{
                listStyle: "none",
                margin: 0,
                padding: 0,
                display: "flex",
                flexDirection: "column",
                gap: 22,
              }}
            >
              {checklist.map((item, i) => (
                <li key={i}>
                  <FadeIn delaySec={0.6 + i * 0.35} translateY={8}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 20,
                        fontFamily: fonts.sans,
                      }}
                    >
                      <span
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 10,
                          background: colors.accent,
                          color: "#ffffff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 22,
                          fontWeight: 800,
                          flexShrink: 0,
                          marginTop: 4,
                        }}
                      >
                        ✓
                      </span>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 4,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 26,
                            fontWeight: 800,
                            color: colors.ink,
                            letterSpacing: "-0.02em",
                            lineHeight: 1.3,
                          }}
                        >
                          {item.label}
                        </span>
                        <span
                          style={{
                            fontSize: 22,
                            fontWeight: 500,
                            color: colors.inkMuted,
                            letterSpacing: "-0.01em",
                          }}
                        >
                          {item.desc}
                        </span>
                      </div>
                    </div>
                  </FadeIn>
                </li>
              ))}
            </ul>

            {/* 작은 강조 라벨 — "프로그램이 끝나도 — 파일은 남는다" */}
            <FadeIn delaySec={3.0} translateY={6}>
              <div
                style={{
                  marginTop: 28,
                  fontFamily: fonts.sans,
                  fontSize: 18,
                  fontWeight: 600,
                  color: colors.inkMuted,
                  opacity: 0.75,
                  letterSpacing: "-0.01em",
                }}
              >
                <span style={{ fontStyle: "italic" }}>프로그램이 끝나도 —</span>{" "}
                <span style={{ fontWeight: 800, color: colors.accentDeep }}>
                  파일은 남는다
                </span>
              </div>
            </FadeIn>
          </Card>
        </FadeIn>

        {/* Right: next lesson — 12강 디버깅 & AI 활용 */}
        <FadeIn delaySec={1.6} translateY={20}>
          <Card
            variant="accent"
            style={{
              width: 580,
              padding: "48px 48px",
              borderRadius: radii.card,
            }}
          >
            <div
              style={{
                fontFamily: fonts.sans,
                fontSize: 24,
                fontWeight: 700,
                color: colors.accentInk,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                marginBottom: 16,
                opacity: 0.8,
              }}
            >
              다음 강의 — 12강
            </div>
            <div
              style={{
                fontFamily: fonts.sans,
                fontSize: 56,
                fontWeight: 800,
                color: colors.accentInk,
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
                marginBottom: 18,
              }}
            >
              디버깅 &amp; AI 활용
            </div>
            <div
              style={{
                fontFamily: fonts.sans,
                fontSize: 22,
                fontWeight: 500,
                color: colors.accentInk,
                letterSpacing: "-0.01em",
                opacity: 0.85,
                lineHeight: 1.5,
              }}
            >
              <span style={{ fontWeight: 700 }}>에러 메시지</span>를 읽고
              <br />
              AI 와 함께 <span style={{ fontWeight: 700 }}>고치는 방법</span>
            </div>
            <div
              style={{
                marginTop: 32,
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <span
                style={{
                  fontFamily: fonts.sans,
                  fontSize: 56,
                  color: colors.accentDeep,
                  fontWeight: 800,
                  lineHeight: 1,
                }}
              >
                →
              </span>
            </div>
          </Card>
        </FadeIn>
      </div>

      <LowerThird text="파일을 열어 저장하고, 모드만 바꿔 불러오세요" delaySec={3.0} />
    </PageBackground>
  );
};
