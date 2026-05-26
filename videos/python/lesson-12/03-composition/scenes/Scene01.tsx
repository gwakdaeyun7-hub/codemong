/**
 * Scene 1 — 도입: 오늘 다룰 것 + 11강 일반 회상 (16s placeholder)
 *
 * 시즌 정형 통일 (lesson-11 Scene01 baseline) — inset:0 center,
 * h1 110/800/ink, underline width 180, 36px gap, 부제 36/500/inkMuted.
 *
 * Scene01 정형 5요소 (lesson-11 답습):
 *   - 좌상단 CourseLabel (delaySec 0.2)
 *   - 중앙 110px h1 (delaySec 0.6) — "디버깅 & AI 활용" (`&` → `&amp;`)
 *   - AccentUnderline width 180 (delaySec 1.4)
 *   - 36px 부제목 (delaySec 1.8) — "안 돌아가는 코드를 읽고 고치기"
 *   - 우하단 회상 ✓ 카드 (delaySec 2.6, opacity 0.6)
 *
 * 11강 narration 의존 0회 — 회상 카드 본문은 일반 개념 한 줄
 * "도구를 하나씩 익혀 보다". 11강 구체 도구/파일/시나리오 (memo.txt /
 * with open / "w"/"r" 등) 인용 X. (00-objectives §0 "11강 narration 의존 금지")
 *
 * 새 도입 hook (회상 코드 박스 슬라이드 / 하단 N카드 시퀀셜 등) 추가 X.
 */

import React from "react";
import {
  AccentUnderline,
  CourseLabel,
  FadeIn,
  PageBackground,
} from "../primitives";
import { colors, fonts, radii, shadows } from "../theme";

export const Scene01: React.FC = () => {
  return (
    <PageBackground>
      {/* 좌상단 코스 라벨 */}
      <div style={{ position: "absolute", top: 96, left: 96 }}>
        <FadeIn delaySec={0.2} translateY={6}>
          <CourseLabel>파이썬 기초 · 12강</CourseLabel>
        </FadeIn>
      </div>

      {/* 중앙 큰 제목 + underline + 부제목 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: 80,
        }}
      >
        <FadeIn delaySec={0.6} translateY={16}>
          <h1
            style={{
              margin: 0,
              fontFamily: fonts.sans,
              fontSize: 110,
              fontWeight: 800,
              color: colors.ink,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
            }}
          >
            디버깅 &amp; AI 활용
          </h1>
        </FadeIn>
        <div style={{ height: 28 }} />
        <AccentUnderline width={180} delaySec={1.4} durationSec={0.7} />
        <div style={{ height: 36 }} />
        <FadeIn delaySec={1.8} translateY={10}>
          <p
            style={{
              margin: 0,
              fontFamily: fonts.sans,
              fontSize: 36,
              fontWeight: 500,
              color: colors.inkMuted,
              letterSpacing: "-0.01em",
            }}
          >
            안 돌아가는 코드를 읽고 고치기
          </p>
        </FadeIn>
      </div>

      {/* 우측 하단 회상 카드 (11강 일반 회상 — 11강 narration 의존 X) */}
      <div style={{ position: "absolute", bottom: 96, right: 96, opacity: 0.6 }}>
        <FadeIn delaySec={2.6} translateY={10}>
          <div
            style={{
              padding: "16px 22px",
              borderRadius: radii.card,
              background: colors.bgWhite,
              border: `1px solid ${colors.border}`,
              boxShadow: shadows.cardSoft,
              display: "flex",
              alignItems: "center",
              gap: 14,
              fontFamily: fonts.sans,
            }}
          >
            <span
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: colors.success,
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                fontWeight: 800,
              }}
            >
              ✓
            </span>
            <div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: colors.accentDeep,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}
              >
                11강 회상
              </div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 600,
                  color: colors.ink,
                  letterSpacing: "-0.01em",
                  marginTop: 2,
                }}
              >
                도구를 하나씩 익혀 보다
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </PageBackground>
  );
};
