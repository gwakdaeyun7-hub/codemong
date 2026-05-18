/**
 * Scene 11 — 정리 4단 카드 + 9강 함수 예고 (21s)
 *
 * 시즌 정형 통일 (lesson-3 Scene13 / lesson-6 Scene12 baseline) —
 * 체크리스트 label+desc, 좌 640 / 우 560 width, ✓ 36×36, 다음 강의 라벨 24, 제목 56, 부제 22.
 *
 * 4항목 → 체크리스트 0.6 + i × 0.35 (마지막 i=3 → 1.65),
 *         다음 강의 카드 1.8 (4항목 자연 보정).
 * LowerThird delaySec 3.0 — 정형.
 *
 * 4단 정리:
 *   1. dict — 이름표로 짝지어진
 *   2. tuple — 바뀌면 안 되는
 *   3. set — 중복 없이
 *   4. list — 순서대로 나열 (7강 회상, dimmed 옅은 톤)
 *
 * 다음 강의 카드 = 9강 함수.
 */

import React from "react";
import {
  Card,
  FadeIn,
  LowerThird,
  PageBackground,
} from "../primitives";
import { colors, fonts, radii } from "../theme";

const checklist: { label: React.ReactNode; desc: React.ReactNode; dimmed?: boolean }[] = [
  {
    label: <span style={{ fontFamily: fonts.mono }}>dict</span>,
    desc: "이름표로 짝지어진",
  },
  {
    label: <span style={{ fontFamily: fonts.mono }}>tuple</span>,
    desc: "바뀌면 안 되는",
  },
  {
    label: <span style={{ fontFamily: fonts.mono }}>set</span>,
    desc: "중복 없이",
  },
  {
    label: <span style={{ fontFamily: fonts.mono }}>list</span>,
    desc: "순서대로 나열 (7강)",
    dimmed: true,
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
                        alignItems: "center",
                        gap: 20,
                        fontFamily: fonts.sans,
                        opacity: item.dimmed ? 0.5 : 1,
                      }}
                    >
                      <span
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 10,
                          background: item.dimmed ? colors.inkSubtle : colors.accent,
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
              다음 강의 — 9강
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
              함수
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
              <span style={{ fontWeight: 700 }}>자료구조</span>가 함수의
              <br />
              입력과 출력으로 흐릅니다
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
      <LowerThird text="데이터의 성질을 보고 자료구조를 고르세요" delaySec={3.0} />
    </PageBackground>
  );
};
