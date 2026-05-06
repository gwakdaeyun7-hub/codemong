/**
 * Scene 11 — 저장이 안 되면 반영도 안 됩니다 (10s)
 *
 * - VS Code mock 에디터 화면
 * - 파일 탭에 작은 점 (●) = "저장되지 않은 변경 있음"
 * - 화면 하단 lower-third: "저장 단축키: Ctrl+S (윈도우) / Cmd+S (맥)"
 *   단축키 텍스트 위에 violet-500 강조 박스
 *
 * 오개념 3번. 한 줄로 짧게.
 */

import React from "react";
import { FadeIn, PageBackground, VsCodeMock } from "../primitives";
import { colors, fonts, radii } from "../theme";

export const Scene11: React.FC = () => {
  return (
    <PageBackground>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: 200,
        }}
      >
        <FadeIn delaySec={0.1} translateY={6}>
          <div
            style={{
              fontFamily: fonts.sans,
              fontSize: 28,
              fontWeight: 600,
              color: colors.accentDeep,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              marginBottom: 18,
            }}
          >
            저장이 안 되면, 반영도 안 됩니다
          </div>
        </FadeIn>
        <FadeIn delaySec={0.3} translateY={8}>
          <h2
            style={{
              margin: 0,
              fontFamily: fonts.sans,
              fontSize: 44,
              fontWeight: 700,
              color: colors.ink,
              letterSpacing: "-0.02em",
              marginBottom: 36,
            }}
          >
            파일 탭의 점 = 저장되지 않은 변경
          </h2>
        </FadeIn>
        <FadeIn delaySec={0.6} translateY={20}>
          <VsCodeMock fileName="hello.py" unsaved width={1000} height={400}>
            <div style={{ display: "flex", gap: 18 }}>
              <span style={{ color: colors.darkMuted, opacity: 0.6 }}>1</span>
              <span style={{ color: colors.darkInk }}>
                print(&quot;Hello, Python!&quot;)
              </span>
            </div>
          </VsCodeMock>
        </FadeIn>
        <FadeIn delaySec={1.6} translateY={10}>
          <div style={{ marginTop: 32 }}>
            <ShortcutBadge />
          </div>
        </FadeIn>
      </div>
    </PageBackground>
  );
};

const ShortcutBadge: React.FC = () => {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 18,
        padding: "16px 28px",
        borderRadius: radii.pill,
        background: colors.accentSoft,
        border: `2px solid ${colors.accent}`,
        fontFamily: fonts.sans,
        fontSize: 28,
        fontWeight: 700,
        color: colors.accentInk,
        letterSpacing: "-0.01em",
      }}
    >
      <span>저장 단축키</span>
      <KeyChip>Ctrl + S</KeyChip>
      <span style={{ color: colors.inkMuted, fontWeight: 500 }}>윈도우</span>
      <span style={{ color: colors.inkSubtle }}>·</span>
      <KeyChip>Cmd + S</KeyChip>
      <span style={{ color: colors.inkMuted, fontWeight: 500 }}>맥</span>
    </div>
  );
};

const KeyChip: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span
    style={{
      padding: "6px 14px",
      borderRadius: 8,
      background: colors.bgWhite,
      border: `1px solid ${colors.border}`,
      fontFamily: fonts.mono,
      fontSize: 24,
      color: colors.ink,
    }}
  >
    {children}
  </span>
);
