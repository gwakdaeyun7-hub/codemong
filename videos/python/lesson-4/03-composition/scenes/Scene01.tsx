/**
 * Scene 1 — 도입: 오늘 배우는 것 (s01, ~14.27s)
 *
 * v3 — lesson-3 Scene01 패턴 모사로 갈아엎음 (시즌 통일).
 *
 * - 좌상단 코스 라벨: "파이썬 기초 · 4강"
 * - 중앙 큰 제목: "입력과 연산자" (fontSize 110, weight 800)
 * - violet underline
 * - 부제목: "사용자에게 받고, 계산하고, 보여주기" (fontSize 36)
 * - 우측 하단 회상 카드 (3강 mock): "3강 완료 / 변수와 자료형" (opacity 0.6)
 *
 * v2 대비 변경:
 *   - 회상 코드 박스 + 슬라이드아웃 / "이번 강" 라벨 / 하단 3개 TodayCard 전부 제거
 *   - lesson-3 Scene01 의 정형 패턴 차용 (시즌 통일)
 *
 * lesson-1·2·3 과 동일한 도입 패턴.
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
          <CourseLabel>파이썬 기초 · 4강</CourseLabel>
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
            입력과 연산자
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
            사용자에게 받고, 계산하고, 보여주기
          </p>
        </FadeIn>
      </div>

      {/* 우측 하단 회상 카드 (3강 완료 환기) */}
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
                3강 완료
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
                변수와 자료형
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </PageBackground>
  );
};
