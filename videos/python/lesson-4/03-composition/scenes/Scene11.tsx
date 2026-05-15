/**
 * Scene 11 — 정리 + 5강 예고 (s11, ~23.52s)
 *
 * v3 — lesson-3 Scene13 패턴 모사로 갈아엎음 (시즌 통일).
 *
 * - 화면 좌측 절반: 오늘 한 일 체크리스트 4줄, 각 줄 좌측에 ✓
 *     "받기 — input()"
 *     "바꾸기 — int()"
 *     "계산 — + − * /"
 *     "보여주기 — print()"
 * - 화면 우측 절반: 다음 강의 예고 카드
 *     "다음 강의 — 5강"
 *     "조건문"
 *     카드 우측에 작은 화살표 →
 * - 화면 하단 lower-third: "오늘은 사용자 입력으로 한 흐름을 완성했습니다"
 *
 * v2 대비 변경:
 *   - 4단 StepsCard (slide-out) / 3중 중첩 EmphasisPulse / EndLabel 전부 제거
 *   - lesson-3 Scene13 의 정적 마무리 패턴 차용 (시즌 통일)
 *
 * 타이밍 (scene local, 총 ~23.52s):
 *   0.5s ~ 2.5s : 좌측 체크리스트 4줄 sequential fade-in (0.5s 간격)
 *   3.0s ~ 4.0s : 우측 다음 강의 카드 fade-in
 *   5.0s ~ 6.0s : 하단 lower-third fade-in
 *   18s ~ 23.5s: 영상 끝까지 머무름 (페이드 아웃 없음)
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
  { label: "받기", desc: "input()" },
  { label: "바꾸기", desc: "int()" },
  { label: "계산", desc: "+ − * /" },
  { label: "보여주기", desc: "print()" },
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
        <FadeIn delaySec={0.5} translateY={16}>
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
                  <FadeIn delaySec={0.8 + i * 0.5} translateY={8}>
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
                            fontFamily: fonts.mono,
                            fontSize: 26,
                            fontWeight: 600,
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
        <FadeIn delaySec={3.0} translateY={20}>
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
              다음 강의 — 5강
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
              조건문
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
              비교의 결과로
              <br />
              프로그램이 판단하게 만들어 봅니다
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
      <LowerThird
        text="오늘은 사용자 입력으로 한 흐름을 완성했습니다"
        delaySec={5.0}
      />
    </PageBackground>
  );
};
