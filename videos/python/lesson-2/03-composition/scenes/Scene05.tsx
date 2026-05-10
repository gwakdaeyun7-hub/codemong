/**
 * Scene 5 — 셋이 각각 무엇인가 (19s)
 *
 * 가로로 3개 카드 (자연어 / 의사코드 / 순서도) — 각 카드:
 *   - 라벨 + 본문 한 줄
 *   - 좌상단 작은 아이콘 (말풍선 / 줄 박스 / 도형)
 *   - 하단 회색 점선으로 부연 한 줄
 *
 * 1강 scene-05 의 "Python ≠ VS Code" 박스 비교 패턴을 3카드로 응용 —
 * 시즌 통일성. 외우게 하지 않고 "보면 안다" 수준.
 */

import React from "react";
import {
  ConceptCard,
  CenteredStage,
  FadeIn,
  PageBackground,
} from "../primitives";
import { colors, fonts } from "../theme";

const concepts = [
  {
    label: "자연어",
    body: "사람 말로 풀어 쓴다",
    glyph: "💬",
    note: "처음 문제를 받았을 때",
  },
  {
    label: "의사코드",
    body: "코드 형식에 가깝게 정돈",
    glyph: "📝",
    note: "절차를 줄 단위로 정리",
  },
  {
    label: "순서도",
    body: "흐름을 도형으로 시각화",
    glyph: "◇",
    note: "분기·반복이 한눈에",
  },
];

export const Scene05: React.FC = () => {
  return (
    <PageBackground>
      <CenteredStage paddingY={140}>
        <FadeIn delaySec={0.1} translateY={6}>
          <div
            style={{
              fontFamily: fonts.sans,
              fontSize: 30,
              fontWeight: 600,
              color: colors.accentDeep,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            셋이 각각 무엇인가
          </div>
        </FadeIn>
        <FadeIn delaySec={0.4} translateY={10}>
          <h2
            style={{
              margin: 0,
              fontFamily: fonts.sans,
              fontSize: 56,
              fontWeight: 800,
              color: colors.ink,
              letterSpacing: "-0.02em",
              marginBottom: 60,
            }}
          >
            한 줄씩 정리해 봅니다
          </h2>
        </FadeIn>
        <div style={{ display: "flex", gap: 48, alignItems: "flex-start" }}>
          {concepts.map((c, i) => (
            <FadeIn key={c.label} delaySec={1.0 + i * 0.4} translateY={20}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
                <ConceptCard label={c.label} body={c.body} glyph={c.glyph} />
                {/* 부연 한 줄 (회색 점선 박스) */}
                <div
                  style={{
                    width: 360,
                    padding: "12px 16px",
                    borderTop: `1px dashed ${colors.inkSubtle}`,
                    fontFamily: fonts.sans,
                    fontSize: 20,
                    fontWeight: 500,
                    color: colors.inkMuted,
                    letterSpacing: "-0.01em",
                    textAlign: "center",
                  }}
                >
                  {c.note}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </CenteredStage>
    </PageBackground>
  );
};
