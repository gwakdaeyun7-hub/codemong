/**
 * Scene 14 — 정리 + 다음 강의 예고 (14s)
 *
 * - 화면 좌측 절반: 오늘 한 일 체크리스트 3줄, 각 줄 좌측에 ✓
 *     "조건에 따라 코드가 갈라진다"
 *     "if → elif → else 위에서부터 차례로"
 *     "중첩은 들여쓰기 깊이 = 소속"
 * - 화면 우측 절반: 다음 강의 예고 카드
 *     "다음 강의 — 6강"
 *     "반복문"
 *     "같은 일을 여러 번 시키는 코드를 짧게"
 *     카드 우측에 화살표 →
 * - 화면 하단 lower-third: "오늘은 흐름을 갈래 짓는 첫걸음"
 *
 * 1·2·3강 마무리 패턴 — 시즌 통일성. 다음 강의 예고는 00-objectives §7 문구.
 */

import React from "react";
import { Card, FadeIn, LowerThird, PageBackground } from "../primitives";
import { colors, fonts, radii } from "../theme";

const checklist = [
  { label: "조건에 따라", desc: "코드가 갈라진다" },
  {
    label: <span style={{ fontFamily: fonts.mono }}>if → elif → else</span>,
    desc: "위에서부터 차례로",
  },
  { label: "중첩", desc: "들여쓰기 깊이 = 소속" },
];

export const Scene14: React.FC = () => {
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
                        alignItems: "center",
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
                        }}
                      >
                        ✓
                      </span>
                      <div>
                        <span
                          style={{
                            fontSize: 32,
                            fontWeight: 800,
                            color: colors.ink,
                            letterSpacing: "-0.02em",
                          }}
                        >
                          {item.label}
                        </span>
                        <span
                          style={{
                            fontSize: 26,
                            fontWeight: 500,
                            color: colors.inkMuted,
                            letterSpacing: "-0.01em",
                            marginLeft: 14,
                          }}
                        >
                          — {item.desc}
                        </span>
                      </div>
                    </div>
                  </FadeIn>
                </li>
              ))}
            </ul>
          </Card>
        </FadeIn>

        {/* Right: next lesson */}
        <FadeIn delaySec={1.6} translateY={20}>
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
              다음 강의 — 6강
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
              반복문
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
              같은 일을 여러 번 시키는
              <br />
              코드를 짧게 쓰는 법을 배웁니다
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
      <LowerThird text="오늘은 흐름을 갈래 짓는 첫걸음" delaySec={3.0} />
    </PageBackground>
  );
};
