/**
 * Scene 6 — 짚고 넘어가기: 따옴표와 대문자 (16s)
 *
 * - 화면 좌측 절반: 비교 컷
 *     좌측 위 박스: `5` (라벨 "숫자")
 *     좌측 아래 박스: `"5"` (라벨 "문자열")
 *     두 박스 사이 회색 구분선 + 작은 텍스트 "따옴표 = 글자"
 * - 화면 우측 절반: 비교 컷
 *     우측 위 박스: `True` ✓ (violet-500 외곽선)
 *     우측 아래 박스: `true` ✗ (회색 + 빨간 X 아이콘)
 *     두 박스 사이 작은 텍스트 "첫 글자 대문자"
 *
 * 오개념 2 (대문자) + 오개념 3 (따옴표) 한 scene 에 묶어 정면 처리.
 * 둘 다 한두 문장만 (00-objectives §3 권고).
 */

import React from "react";
import {
  CenteredStage,
  FadeIn,
  PageBackground,
  PyToken,
} from "../primitives";
import { colors, fonts, radii, shadows } from "../theme";

type CompareItem = {
  label: string;
  value: React.ReactNode;
  status: "ok" | "fail" | "neutral";
};

const ComparePanel: React.FC<{
  title: string;
  separatorText: string;
  items: [CompareItem, CompareItem];
  delaySec: number;
}> = ({ title, separatorText, items, delaySec }) => {
  return (
    <FadeIn delaySec={delaySec} translateY={20}>
      <div
        style={{
          width: 540,
          background: colors.bgWhite,
          borderRadius: radii.card,
          border: `1px solid ${colors.border}`,
          boxShadow: shadows.card,
          padding: "32px 36px 36px",
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        <div
          style={{
            fontFamily: fonts.sans,
            fontSize: 24,
            fontWeight: 700,
            color: colors.accentDeep,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            marginBottom: 4,
          }}
        >
          {title}
        </div>
        {items.map((item, i) => (
          <React.Fragment key={i}>
            <FadeIn delaySec={delaySec + 0.4 + i * 0.6} translateY={10}>
              <CompareBox label={item.label} value={item.value} status={item.status} />
            </FadeIn>
            {i === 0 ? (
              <FadeIn delaySec={delaySec + 1.2} translateY={6}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    fontFamily: fonts.sans,
                    fontSize: 18,
                    fontWeight: 600,
                    color: colors.inkMuted,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    paddingLeft: 4,
                  }}
                >
                  <div
                    style={{
                      flex: 1,
                      height: 1,
                      background: colors.border,
                    }}
                  />
                  <span>{separatorText}</span>
                  <div
                    style={{
                      flex: 1,
                      height: 1,
                      background: colors.border,
                    }}
                  />
                </div>
              </FadeIn>
            ) : null}
          </React.Fragment>
        ))}
      </div>
    </FadeIn>
  );
};

const CompareBox: React.FC<{
  label: string;
  value: React.ReactNode;
  status: "ok" | "fail" | "neutral";
}> = ({ label, value, status }) => {
  const borderColor =
    status === "ok"
      ? colors.accent
      : status === "fail"
        ? colors.danger
        : colors.border;
  const labelColor =
    status === "ok"
      ? colors.accentDeep
      : status === "fail"
        ? colors.danger
        : colors.inkMuted;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 20,
      }}
    >
      <div
        style={{
          flex: 1,
          background: colors.darkBg,
          borderRadius: 12,
          border: `2px solid ${borderColor}`,
          padding: "22px 24px",
          fontFamily: fonts.mono,
          fontSize: 38,
          fontWeight: 700,
          color: colors.darkInk,
          textAlign: "center",
          opacity: status === "fail" ? 0.7 : 1,
        }}
      >
        {value}
      </div>
      <div
        style={{
          minWidth: 96,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 6,
        }}
      >
        {/* status icon */}
        {status === "ok" ? (
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: colors.accent,
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: fonts.sans,
              fontSize: 22,
              fontWeight: 800,
            }}
          >
            ✓
          </div>
        ) : status === "fail" ? (
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: colors.bgWhite,
              border: `2.5px solid ${colors.danger}`,
              color: colors.danger,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: fonts.sans,
              fontSize: 22,
              fontWeight: 800,
            }}
          >
            ×
          </div>
        ) : null}
        <div
          style={{
            fontFamily: fonts.sans,
            fontSize: 20,
            fontWeight: 700,
            color: labelColor,
            letterSpacing: "-0.01em",
          }}
        >
          {label}
        </div>
      </div>
    </div>
  );
};

export const Scene06: React.FC = () => {
  return (
    <PageBackground>
      <CenteredStage paddingY={100}>
        <FadeIn delaySec={0.1} translateY={6}>
          <div
            style={{
              fontFamily: fonts.sans,
              fontSize: 30,
              fontWeight: 600,
              color: colors.accentDeep,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              marginBottom: 36,
            }}
          >
            짚고 넘어가기
          </div>
        </FadeIn>
        <div
          style={{
            display: "flex",
            alignItems: "stretch",
            gap: 56,
          }}
        >
          {/* 좌: 따옴표 — 5 vs "5" */}
          <ComparePanel
            title="따옴표"
            separatorText="따옴표 = 글자"
            delaySec={0.4}
            items={[
              {
                label: "숫자",
                status: "neutral",
                value: <PyToken text="5" kind="number" />,
              },
              {
                label: "문자열",
                status: "neutral",
                value: <PyToken text={'"5"'} kind="string" />,
              },
            ]}
          />
          {/* 우: 대문자 — True ✓ vs true ✗ */}
          <ComparePanel
            title="대문자"
            separatorText="첫 글자 대문자"
            delaySec={1.2}
            items={[
              {
                label: "올바름",
                status: "ok",
                value: <PyToken text="True" kind="keyword" />,
              },
              {
                label: "에러",
                status: "fail",
                value: (
                  <span style={{ color: colors.darkMuted }}>true</span>
                ),
              },
            ]}
          />
        </div>
      </CenteredStage>
    </PageBackground>
  );
};
