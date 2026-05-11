/**
 * Scene 13 — 정리 + 다음 강의 예고 (13s)
 *
 * - 화면 좌측 절반: 오늘 한 일 체크리스트 3줄, 각 줄 좌측에 ✓
 *     "변수 — 값에 이름 붙이기"
 *     "자료형 — 숫자, 문자열, 불린"
 *     "print() — 화면에 출력"
 * - 화면 우측 절반: 다음 강의 예고 카드
 *     "다음 강의 — 4강"
 *     "입력과 연산자"
 *     카드 우측에 작은 화살표 →
 * - 화면 하단 lower-third: "오늘은 코드를 읽는 첫걸음"
 *
 * 1·2강 마무리 패턴과 동일 — 시즌 통일성. 다음 강의 예고는
 * 00-objectives §6 명시 문구 그대로.
 */

import React from "react";
import {
  Card,
  FadeIn,
  LowerThird,
  PageBackground,
} from "../primitives";
import { colors, fonts, radii } from "../theme";

const checklist = [
  { label: "변수", desc: "값에 이름 붙이기" },
  { label: "자료형", desc: "숫자, 문자열, 불린" },
  { label: "print()", desc: "화면에 출력" },
];

export const Scene13: React.FC = () => {
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
                <li key={item.label}>
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
              다음 강의 — 4강
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
              입력과 연산자
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
              사용자가 직접 값을 넣고
              <br />
              그 값들로 계산까지 해봅니다
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
      <LowerThird text="오늘은 코드를 읽는 첫걸음" delaySec={3.0} />
    </PageBackground>
  );
};
