/**
 * Scene 9 — 정리: 세 가지 디버깅 = 코드몽 오답분류 + 13강 프로젝트 hook (26s)
 *
 * 시즌 정형 통일 (lesson-11 Scene11 baseline) — 좌 절반 체크리스트 (✓ 36×36
 * accent) / 우 절반 `<Card variant="accent">` 다음 강의 카드 / 하단 LowerThird.
 *
 * 세 가지 디버깅 사고를 CodeMong 오답분류 세 단어로 정리 (scene-02 의 세 칩이
 * 여기서 _완성_ — 셋 다 강조). 13강 프로젝트 hook ("직접 만들 차례 / 계산기").
 *
 * delaySec 시퀀스 (lesson-11 답습):
 *   - 체크리스트 0.6 + i × 0.35 (i = 0/1/2 → 0.6 / 0.95 / 1.3)
 *   - 다음 강의 카드 1.6
 *   - LowerThird 3.0
 *
 * R-026 엄수: LowerThird = 인사이트 한 줄 ("에러는 읽고, 흐름은 찍어 보고,
 *             모르면 다시 배우세요") — "12강 · 끝" 종료 라벨 금지.
 */

import React from "react";
import { Card, Chip, ChipTone, FadeIn, LowerThird, PageBackground } from "../primitives";
import { colors, fonts, radii } from "../theme";

const checklist: { label: React.ReactNode; chipLabel: string; chipTone: ChipTone }[] = [
  {
    label: (
      <span>
        <span style={{ fontWeight: 800, color: colors.ink }}>마지막 줄부터</span> 읽기
      </span>
    ),
    chipLabel: "문법오류",
    chipTone: "red",
  },
  {
    label: (
      <span>
        <span style={{ fontFamily: fonts.mono, color: colors.accentDeep, fontWeight: 700 }}>
          print
        </span>
        로 <span style={{ fontWeight: 800, color: colors.ink }}>중간값</span> 찍기
      </span>
    ),
    chipLabel: "논리오류",
    chipTone: "violet",
  },
  {
    label: (
      <span>
        <span style={{ fontWeight: 800, color: colors.ink }}>모르겠으면 그 강의로</span>
      </span>
    ),
    chipLabel: "개념미숙",
    chipTone: "gray",
  },
];

export const Scene09: React.FC = () => {
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
        {/* Left: 체크리스트 (각 항목에 오답분류 칩 병기) */}
        <FadeIn delaySec={0.2} translateY={16}>
          <Card style={{ width: 660, padding: "48px 48px" }}>
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
              오늘의 디버깅
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
                        gap: 18,
                        fontFamily: fonts.sans,
                      }}
                    >
                      {/* ✓ 마커 36×36 accent (시즌 정형) */}
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
                      {/* 라벨 */}
                      <span
                        style={{
                          flex: 1,
                          fontSize: 26,
                          fontWeight: 600,
                          color: colors.inkSoft,
                          letterSpacing: "-0.02em",
                          lineHeight: 1.3,
                        }}
                      >
                        {item.label}
                      </span>
                      {/* 오답분류 칩 */}
                      <Chip
                        label={item.chipLabel}
                        tone={item.chipTone}
                        fontSize={20}
                        style={{ padding: "6px 16px", flexShrink: 0 }}
                      />
                    </div>
                  </FadeIn>
                </li>
              ))}
            </ul>

            {/* 강조 라벨 — "내 디버깅 = 코드몽의 오답분석" */}
            <FadeIn delaySec={3.0} translateY={6}>
              <div
                style={{
                  marginTop: 28,
                  fontFamily: fonts.sans,
                  fontSize: 20,
                  fontWeight: 600,
                  color: colors.inkMuted,
                  opacity: 0.85,
                  letterSpacing: "-0.01em",
                }}
              >
                <span style={{ fontStyle: "italic" }}>내 디버깅</span> ={" "}
                <span style={{ fontWeight: 800, color: colors.accentDeep }}>코드몽의 오답분석</span>
              </div>
            </FadeIn>
          </Card>
        </FadeIn>

        {/* Right: 다음 강의 — 13강 계산기 만들기 */}
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
              다음 강의 — 13강
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
              계산기 만들기
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
              <span style={{ fontWeight: 700 }}>직접 만드는</span> 첫 프로젝트
              <br />
              오늘 익힌 <span style={{ fontWeight: 700 }}>고치는 힘</span>으로
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

      <LowerThird text="에러는 읽고, 흐름은 찍어 보고, 모르면 다시 배우세요" delaySec={3.0} />
    </PageBackground>
  );
};
