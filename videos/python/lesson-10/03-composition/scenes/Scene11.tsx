/**
 * Scene 11 — 정리 3단 카드 + 11강 파일 입출력 예고 (16s)
 *
 * 시즌 정형 통일 (lesson-8 Scene11 baseline) — 좌 절반 체크리스트 (✓ 36×36
 * violet) / 우 절반 `<Card variant="accent">` 다음 강의 카드 / 하단 LowerThird.
 *
 * 3단 정리:
 *   1. 도구 상자를 데려오기 — `import 상자`
 *   2. 점 찍고 이름 불러 꺼내기 — `상자.도구(값)`
 *   3. 결과를 변수에 받기 — `변수 = 상자.도구(값)`
 *
 * 추가 부가 라벨: "`math` · `datetime` · ..." 작은 회색 글씨 (시연 X, 이름만).
 *
 * 다음 강의 카드 = 11강 파일 입출력.
 *
 * delaySec 시퀀스 (lesson-8 답습):
 *   - 체크리스트 0.6 + i × 0.35 (i = 0/1/2 → 0.6 / 0.95 / 1.3)
 *   - 다음 강의 카드 1.8 (3항목이므로 lesson-8 의 1.8 그대로)
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
    label: "도구 상자를 데려오기",
    desc: (
      <span style={{ fontFamily: fonts.mono, color: colors.accentDeep, fontWeight: 700 }}>
        import 상자
      </span>
    ),
  },
  {
    label: "점 찍고 이름 불러 꺼내기",
    desc: (
      <span style={{ fontFamily: fonts.mono, color: colors.accentDeep, fontWeight: 700 }}>
        상자.도구(값)
      </span>
    ),
  },
  {
    label: "결과를 변수에 받기",
    desc: (
      <span style={{ fontFamily: fonts.mono, color: colors.accentDeep, fontWeight: 700 }}>
        변수 = 상자.도구(값)
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

            {/* 다른 도구 상자 이름 (작은 부가 라벨) */}
            <FadeIn delaySec={2.4} translateY={6}>
              <div
                style={{
                  marginTop: 28,
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  fontFamily: fonts.sans,
                  fontSize: 18,
                  fontWeight: 500,
                  color: colors.inkMuted,
                  opacity: 0.7,
                  letterSpacing: "-0.01em",
                }}
              >
                <span style={{ fontStyle: "italic" }}>랜덤 말고도 —</span>
                <span style={{ fontFamily: fonts.mono, fontWeight: 700 }}>math</span>
                <span>·</span>
                <span style={{ fontFamily: fonts.mono, fontWeight: 700 }}>datetime</span>
                <span>· ...</span>
              </div>
            </FadeIn>
          </Card>
        </FadeIn>

        {/* Right: next lesson */}
        <FadeIn delaySec={1.8} translateY={20}>
          <Card
            variant="accent"
            style={{
              width: 560,
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
              다음 강의 — 11강
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
              파일 입출력
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
              무작위로 만든 값들을{" "}
              <span style={{ fontWeight: 700 }}>파일에</span>
              <br />
              저장하고 다시 불러오기
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

      <LowerThird text="도구 상자를 데려와 점으로 꺼내 쓰세요" delaySec={3.0} />
    </PageBackground>
  );
};
