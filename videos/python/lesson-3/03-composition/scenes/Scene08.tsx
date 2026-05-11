/**
 * Scene 8 — 시나리오: 자기소개 카드 (13s)
 *
 * - 화면 중앙에 시나리오 카드 (큰 박스, 살짝 둥근 모서리, 흰 배경)
 *     좌측: 단순화된 사람 실루엣 (violet)
 *     우측: 텍스트 3줄
 *       "이름 — 코드몽" (라벨 "문자열")
 *       "나이 — 5" (라벨 "숫자")
 *       "학생 여부 — 참" (라벨 "불린")
 *     각 자료형 라벨은 작은 violet 점 + 회색 텍스트
 *
 * 한 시나리오만 끝까지 — 두 개 이상 쓰면 인지 부하 증가 (00-objectives §5).
 */

import React from "react";
import {
  Card,
  CenteredStage,
  FadeIn,
  PageBackground,
  PersonGlyph,
} from "../primitives";
import { colors, fonts } from "../theme";

type Field = {
  label: string;
  value: string;
  type: string;
};

const fields: Field[] = [
  { label: "이름", value: "코드몽", type: "문자열" },
  { label: "나이", value: "5", type: "숫자" },
  { label: "학생 여부", value: "참", type: "불린" },
];

const FieldRow: React.FC<{ field: Field; delaySec: number }> = ({
  field,
  delaySec,
}) => {
  return (
    <FadeIn delaySec={delaySec} translateY={10}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 24,
          fontFamily: fonts.sans,
        }}
      >
        {/* 라벨 + 값 */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 18,
            flex: 1,
          }}
        >
          <span
            style={{
              fontSize: 30,
              fontWeight: 600,
              color: colors.inkMuted,
              letterSpacing: "-0.01em",
              minWidth: 160,
            }}
          >
            {field.label}
          </span>
          <span
            style={{
              fontSize: 36,
              fontWeight: 700,
              color: colors.ink,
              letterSpacing: "-0.02em",
            }}
          >
            — {field.value}
          </span>
        </div>
        {/* 자료형 라벨 (작은 violet 점 + 회색 텍스트) */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 14px",
            borderRadius: 999,
            background: colors.borderSoft,
            border: `1px solid ${colors.border}`,
            fontSize: 18,
            fontWeight: 600,
            color: colors.inkSoft,
            letterSpacing: "-0.01em",
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: colors.accent,
            }}
          />
          {field.type}
        </div>
      </div>
    </FadeIn>
  );
};

export const Scene08: React.FC = () => {
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
            오늘의 시나리오
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
              marginBottom: 48,
            }}
          >
            자기소개 카드
          </h2>
        </FadeIn>

        <FadeIn delaySec={1.0} translateY={20}>
          <Card style={{ width: 1100, padding: "48px 56px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 56,
              }}
            >
              {/* 좌측 — 사람 실루엣 */}
              <div style={{ flexShrink: 0 }}>
                <PersonGlyph size={140} />
              </div>
              {/* 우측 — 필드 3줄 */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 22,
                  textAlign: "left",
                }}
              >
                {fields.map((f, i) => (
                  <FieldRow key={f.label} field={f} delaySec={1.6 + i * 0.5} />
                ))}
              </div>
            </div>
          </Card>
        </FadeIn>
      </CenteredStage>
    </PageBackground>
  );
};
