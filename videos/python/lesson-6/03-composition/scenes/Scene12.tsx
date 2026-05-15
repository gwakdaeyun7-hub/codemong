/**
 * Scene 12 — 정리 + 7강 예고 (16s)
 *
 * 시즌 정형 통일 (lesson-3 Scene13 baseline) — 체크리스트 label+desc,
 * 좌 640 / 우 560 width, ✓ 36×36, 다음 강의 라벨 24, 제목 56, 부제 22.
 * SlideOut + PageFadeOut + "Lesson 6/끝" 라벨 제거.
 * LowerThird 추가 — narration 마지막 정리에서 추출.
 *
 * 4항목 → 체크리스트 0.6 + i × 0.35 (마지막 i=3 → 1.65),
 *         다음 강의 카드 1.8 (4항목 자연 보정).
 * LowerThird delaySec 3.0 — 정형.
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
    label: <span style={{ fontFamily: fonts.mono }}>for</span>,
    desc: "정해진 횟수 반복",
  },
  {
    label: <span style={{ fontFamily: fonts.mono }}>while</span>,
    desc: "조건 만족 동안",
  },
  {
    label: (
      <>
        <span style={{ fontFamily: fonts.mono }}>break</span> ·{" "}
        <span style={{ fontFamily: fonts.mono }}>continue</span>
      </>
    ),
    desc: "빠져나가기 · 건너뛰기",
  },
  {
    label: "들여쓰기 깊이",
    desc: "루프 안 / 밖",
  },
];

export const Scene12: React.FC = () => {
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
              다음 강의 — 7강
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
              리스트
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
              <span style={{ fontFamily: fonts.mono, fontWeight: 700 }}>
                for
              </span>
              가 숫자 묶음 대신
              <br />
              진짜 데이터 묶음을 따라갑니다
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
      <LowerThird text="오늘은 같은 일을 짧게 쓰는 첫걸음" delaySec={3.0} />
    </PageBackground>
  );
};
