/**
 * Scene 5 — 자료형 세 가지 한눈에 (18s)
 *
 * 화면 가로로 3개 카드, 위에서 아래로 fade-in (각 0.5초 간격):
 *   카드 1 — 라벨 "숫자" + 예시 `5`, `3.14` + 부연 "정수와 실수"
 *   카드 2 — 라벨 "문자열" + 예시 `"안녕"`, `"코드몽"` + 부연 "따옴표로 감쌈"
 *   카드 3 — 라벨 "불린" + 예시 `True`, `False` + 부연 "참 또는 거짓"
 *
 * 각 카드 좌상단에 작은 아이콘 (숫자 / 따옴표 / 체크-엑스).
 * 모든 예시 코드는 monospace, 따옴표·대문자가 시각적으로 구분되도록.
 *
 * 1·2강의 3카드 패턴과 동일한 톤 — 시즌 통일성.
 */

import React from "react";
import {
  CenteredStage,
  FadeIn,
  PageBackground,
  PyToken,
} from "../primitives";
import { colors, fonts, radii, shadows } from "../theme";

type DataType = {
  label: string;
  glyph: React.ReactNode;
  examples: { text: string; kind: "number" | "string" | "keyword" }[];
  note: string;
};

const types: DataType[] = [
  {
    label: "숫자",
    glyph: "123",
    examples: [
      { text: "5", kind: "number" },
      { text: "3.14", kind: "number" },
    ],
    note: "정수와 실수",
  },
  {
    label: "문자열",
    glyph: '" "',
    examples: [
      { text: '"안녕"', kind: "string" },
      { text: '"코드몽"', kind: "string" },
    ],
    note: "따옴표로 감쌈",
  },
  {
    label: "불린",
    glyph: "T/F",
    examples: [
      { text: "True", kind: "keyword" },
      { text: "False", kind: "keyword" },
    ],
    note: "참 또는 거짓",
  },
];

const TypeCard: React.FC<{ t: DataType; delaySec: number }> = ({
  t,
  delaySec,
}) => {
  return (
    <FadeIn delaySec={delaySec} translateY={20}>
      <div
        style={{
          width: 380,
          padding: "36px 32px",
          borderRadius: radii.card,
          background: colors.bgWhite,
          border: `1px solid ${colors.border}`,
          boxShadow: shadows.card,
          textAlign: "center",
          fontFamily: fonts.sans,
        }}
      >
        {/* 좌상단 단서 아이콘 */}
        <div
          style={{
            width: 56,
            height: 56,
            margin: "0 auto 18px",
            borderRadius: 14,
            background: colors.accentSoft,
            color: colors.accentDeep,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
            fontWeight: 800,
            fontFamily: fonts.mono,
          }}
        >
          {t.glyph}
        </div>

        {/* 라벨 (자료형 이름) */}
        <div
          style={{
            fontSize: 38,
            fontWeight: 800,
            color: colors.ink,
            letterSpacing: "-0.02em",
            marginBottom: 18,
          }}
        >
          {t.label}
        </div>

        {/* 예시 — monospace + 토큰 색 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 6,
            background: colors.darkBg,
            padding: "16px 20px",
            borderRadius: 12,
            border: `1px solid ${colors.darkBg2}`,
            marginBottom: 18,
          }}
        >
          {t.examples.map((ex, i) => (
            <div
              key={i}
              style={{
                fontSize: 30,
                fontWeight: 600,
                fontFamily: fonts.mono,
                lineHeight: 1.4,
              }}
            >
              <PyToken text={ex.text} kind={ex.kind} />
            </div>
          ))}
        </div>

        {/* 부연 한 줄 */}
        <div
          style={{
            fontSize: 22,
            fontWeight: 500,
            color: colors.inkMuted,
            letterSpacing: "-0.01em",
            paddingTop: 8,
            borderTop: `1px dashed ${colors.inkSubtle}`,
          }}
        >
          {t.note}
        </div>
      </div>
    </FadeIn>
  );
};

export const Scene05: React.FC = () => {
  return (
    <PageBackground>
      <CenteredStage paddingY={120}>
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
            자료형 세 가지
          </div>
        </FadeIn>
        <FadeIn delaySec={0.4} translateY={10}>
          <h2
            style={{
              margin: 0,
              fontFamily: fonts.sans,
              fontSize: 52,
              fontWeight: 800,
              color: colors.ink,
              letterSpacing: "-0.02em",
              marginBottom: 56,
            }}
          >
            숫자 / 문자열 / 불린
          </h2>
        </FadeIn>
        <div style={{ display: "flex", gap: 36, alignItems: "stretch" }}>
          {types.map((t, i) => (
            <TypeCard key={t.label} t={t} delaySec={1.0 + i * 0.5} />
          ))}
        </div>
      </CenteredStage>
    </PageBackground>
  );
};
