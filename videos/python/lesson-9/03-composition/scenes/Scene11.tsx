/**
 * Scene 11 — 정리 4단 카드 + 10강 모듈 & 랜덤 예고 (21s)
 *
 * 시즌 정형 통일 (lesson-3 ~ lesson-8 마지막 Scene baseline) — 마지막 Scene 정형 3요소.
 *
 * 마지막 Scene 정형 3요소 (P0 fail 트리거):
 *   - 좌 절반: 4단 체크리스트 (✓ 36×36 violet bg + 라벨, delaySec 0.6 + i × 0.35)
 *   - 우 절반: <Card variant="accent"> 다음 강의 카드 (width 560, fontSize 56, delaySec 1.8)
 *   - 하단: <LowerThird> (delaySec 3.0)
 *
 * 4단 정리 (학습 목표 1·2·3·4 마무리 — 학습 목표 5 는 scene-10 에서 닫혔으므로 정리에서 제외):
 *   1. def 이름(자리): — 함수 정의
 *   2. 부를 때만 실행 — 이름(값)
 *   3. 자리에 값이 차례차례 — 매개변수
 *   4. return — 값을 돌려준다
 *
 * 다음 강의 카드 = 10강 모듈 & 랜덤.
 */

import React from "react";
import { Card, FadeIn, LowerThird, PageBackground } from "../primitives";
import { colors, fonts, radii } from "../theme";

const checklist: { label: React.ReactNode; desc: React.ReactNode }[] = [
  {
    label: <span style={{ fontFamily: fonts.mono }}>def 이름(자리):</span>,
    desc: "함수 정의",
  },
  {
    label: <span>부를 때만 실행</span>,
    desc: (
      <>
        <span style={{ fontFamily: fonts.mono }}>이름(값)</span>
      </>
    ),
  },
  {
    label: <span>자리에 값이 차례차례</span>,
    desc: "매개변수",
  },
  {
    label: <span style={{ fontFamily: fonts.mono }}>return</span>,
    desc: "값을 돌려준다",
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
        {/* Left: 4단 체크리스트 카드 */}
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
                  {/* 시즌 정형 — delaySec 0.6 + i × 0.35 */}
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
                            fontSize: 30,
                            fontWeight: 800,
                            color: colors.ink,
                            letterSpacing: "-0.02em",
                          }}
                        >
                          {item.label}
                        </span>
                        <span
                          style={{
                            fontSize: 24,
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

        {/* Right: 다음 강의 — 10강 모듈 & 랜덤 */}
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
              다음 강의 — 10강
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
              모듈 & 랜덤
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
              <span style={{ fontWeight: 700 }}>이미 만들어진</span> 함수들을
              <br />
              모은 묶음 꺼내 쓰기
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
      <LowerThird text="반복되는 코드는 함수로 묶어 부르세요" delaySec={3.0} />
    </PageBackground>
  );
};
