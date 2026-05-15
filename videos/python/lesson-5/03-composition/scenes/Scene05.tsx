/**
 * Scene 5 — 오개념 직격: `=` vs `==` (15s)
 *
 * - 화면 좌우 분할 비교 컷
 * - 화면 좌측: 큰 글자 `=` (회색)
 *     아래 코드 `score = 60` (라벨 "값을 넣는다")
 *     박스 외곽선 회색
 * - 화면 우측: 큰 글자 `==` (violet-500, 살짝 크게)
 *     아래 코드 `if score == 60:` (라벨 "같은지 비교한다")
 *     박스 외곽선 violet-500
 * - 두 박스 사이 회색 구분선
 * - 화면 하단 lower-third: "`=` 는 대입 · `==` 는 비교"
 *
 * 오개념 1번 (00-objectives §4) 정면 처리 — 비중 있게. 학습 목표 4번.
 * 좌우 분할 컷은 lesson-3 scene-06 와 동일 패턴 — 시즌 통일성.
 *
 * 핵심 시각 신호: `==` 두 개를 좌측 `=` 보다 살짝 크게 + violet — 한눈에 다름을 인지.
 */

import React from "react";
import { CenteredStage, FadeIn, LowerThird, PageBackground, PyToken } from "../primitives";
import { colors, fonts, radii, shadows } from "../theme";

const ComparePanel: React.FC<{
  bigSymbol: string;
  bigSymbolColor: string;
  bigSymbolScale?: number;
  code: React.ReactNode;
  labelText: string;
  labelColor: string;
  borderColor: string;
  bgTint?: string;
  delaySec: number;
}> = ({
  bigSymbol,
  bigSymbolColor,
  bigSymbolScale = 1,
  code,
  labelText,
  labelColor,
  borderColor,
  bgTint = colors.bgWhite,
  delaySec,
}) => {
  return (
    <FadeIn delaySec={delaySec} translateY={20}>
      <div
        style={{
          width: 600,
          background: bgTint,
          borderRadius: radii.card,
          border: `2.5px solid ${borderColor}`,
          boxShadow: shadows.card,
          padding: "44px 36px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 28,
        }}
      >
        {/* 큰 기호 */}
        <div
          style={{
            fontFamily: fonts.mono,
            fontSize: 160 * bigSymbolScale,
            fontWeight: 800,
            color: bigSymbolColor,
            lineHeight: 1,
            letterSpacing: "-0.03em",
          }}
        >
          {bigSymbol}
        </div>

        {/* 코드 박스 */}
        <div
          style={{
            background: colors.darkBg,
            borderRadius: 12,
            border: `1.5px solid ${colors.darkBg2}`,
            padding: "20px 28px",
            fontFamily: fonts.mono,
            fontSize: 36,
            fontWeight: 600,
            color: colors.darkInk,
            whiteSpace: "pre",
            width: "100%",
            textAlign: "center",
          }}
        >
          {code}
        </div>

        {/* 의미 라벨 */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "10px 22px",
            borderRadius: radii.pill,
            background: borderColor === colors.accent ? colors.accentSoft : colors.borderSoft,
            color: labelColor,
            fontFamily: fonts.sans,
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: "-0.01em",
            border: `1.5px solid ${borderColor}`,
          }}
        >
          {labelText}
        </div>
      </div>
    </FadeIn>
  );
};

export const Scene05: React.FC = () => {
  return (
    <PageBackground>
      <CenteredStage paddingY={80}>
        <FadeIn delaySec={0.1} translateY={6}>
          <div
            style={{
              fontFamily: fonts.sans,
              fontSize: 30,
              fontWeight: 600,
              color: colors.accentDeep,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              marginBottom: 40,
            }}
          >
            `=` 와 `==`, 다릅니다
          </div>
        </FadeIn>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 36,
          }}
        >
          {/* 좌측 — `=` (대입) */}
          <ComparePanel
            bigSymbol="="
            bigSymbolColor={colors.inkMuted}
            bigSymbolScale={1.0}
            code={
              <>
                <PyToken text="score" kind="name" />
                <PyToken text=" " />
                <PyToken text="=" kind="op" />
                <PyToken text=" " />
                <PyToken text="60" kind="number" />
              </>
            }
            labelText="값을 넣는다 (대입)"
            labelColor={colors.inkSoft}
            borderColor={colors.border}
            delaySec={0.5}
          />

          {/* 가운데 구분선 */}
          <FadeIn delaySec={1.2} translateY={0}>
            <div
              style={{
                width: 2,
                height: 360,
                background: colors.border,
                borderRadius: 1,
                opacity: 0.7,
              }}
            />
          </FadeIn>

          {/* 우측 — `==` (비교) */}
          <ComparePanel
            bigSymbol="=="
            bigSymbolColor={colors.accentDeep}
            bigSymbolScale={1.15}
            code={
              <>
                <PyToken text="if" kind="keyword" />
                <PyToken text=" " />
                <PyToken text="score" kind="name" />
                <PyToken text=" " />
                <PyToken text="==" kind="op" />
                <PyToken text=" " />
                <PyToken text="60" kind="number" />
                <PyToken text=":" kind="op" />
              </>
            }
            labelText="같은지 비교한다"
            labelColor={colors.accentInk}
            borderColor={colors.accent}
            bgTint={colors.bgWhite}
            delaySec={1.6}
          />
        </div>
      </CenteredStage>

      <LowerThird
        text={
          <>
            <span style={{ fontFamily: fonts.mono }}>=</span>는 대입 ·{" "}
            <span style={{ fontFamily: fonts.mono, color: colors.accentLight }}>==</span>는 비교
          </>
        }
        delaySec={4.5}
      />
    </PageBackground>
  );
};
