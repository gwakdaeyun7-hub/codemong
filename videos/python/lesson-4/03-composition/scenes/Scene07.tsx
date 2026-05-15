/**
 * Scene 7 — `=` vs `==` 한 컷 (10s)
 *
 * narration: "헷갈리기 쉬운 한 가지. 등호 하나는 값을 담는다. 등호 두 개는 같은지 묻는다.
 *             모양은 비슷해도 역할은 전혀 다릅니다."
 *
 * 타이밍 (scene local):
 *   0.0 ~ 0.4  : scene 라벨
 *   0.4 ~ 5.0  : 좌측 — "= 담는다" 라벨 + `name = "지윤"` + 변수 박스 다이어그램
 *   5.0 ~ 10.0 : 우측 — "== 같은지 묻는다" 라벨 + `name == "지윤"` → True 박스
 *
 * 두 영역의 등호 기호 (`=` / `==`) 가 violet-500 으로 굵게 강조.
 */

import React from "react";
import { CodePanel, CodeLine, FadeIn, PageBackground, PyToken, VarBox } from "../primitives";
import { colors, fonts, radii, shadows } from "../theme";

const SplitColumn: React.FC<{
  title: React.ReactNode;
  delaySec: number;
  children: React.ReactNode;
}> = ({ title, delaySec, children }) => {
  return (
    <FadeIn delaySec={delaySec} translateY={20}>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 28,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 14,
            padding: "12px 28px",
            borderRadius: radii.pill,
            background: colors.bgWhite,
            border: `1px solid ${colors.border}`,
            boxShadow: shadows.cardSoft,
            fontFamily: fonts.sans,
            fontSize: 28,
            fontWeight: 700,
            color: colors.ink,
            letterSpacing: "-0.01em",
          }}
        >
          {title}
        </div>
        {children}
      </div>
    </FadeIn>
  );
};

// v3 fix: width/height 260x120 명시 — 좌측 VarBox 와 시각적 대칭 확보.
const ResultBox: React.FC<{ text: string; delaySec: number }> = ({ text, delaySec }) => {
  return (
    <FadeIn delaySec={delaySec} translateY={12}>
      <div
        style={{
          width: 260,
          height: 120,
          padding: "20px 36px",
          borderRadius: 16,
          background: colors.accentSoft,
          border: `2px solid ${colors.accent}`,
          fontFamily: fonts.mono,
          fontSize: 42,
          fontWeight: 800,
          color: colors.accentDeep,
          letterSpacing: "-0.01em",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxSizing: "border-box",
        }}
      >
        → {text}
      </div>
    </FadeIn>
  );
};

export const Scene07: React.FC = () => {
  return (
    <PageBackground>
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 0,
          right: 0,
          textAlign: "center",
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
            }}
          >
            = 와 == 의 역할은 다릅니다
          </div>
        </FadeIn>
      </div>

      {/* v3 fix: padding 좌우 동일 80px, gap 48 — 좌우 컬럼 대칭. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          padding: "140px 80px 60px",
          gap: 48,
        }}
      >
        {/* 좌 — = 담는다 */}
        <SplitColumn
          title={
            <>
              <span
                style={{
                  fontFamily: fonts.mono,
                  color: colors.accent,
                  fontSize: 36,
                  fontWeight: 800,
                  marginRight: 12,
                }}
              >
                =
              </span>
              <span>담는다</span>
            </>
          }
          delaySec={0.4}
        >
          <CodePanel fileName="set.py" width={620} height={120}>
            <CodeLine lineNumber={1} revealAtSec={0.7}>
              <PyToken text="name" kind="name" />
              <PyToken text=" " />
              <span
                style={{
                  color: colors.accent,
                  fontFamily: fonts.mono,
                  fontWeight: 800,
                  fontSize: 32,
                  padding: "0 4px",
                }}
              >
                =
              </span>
              <PyToken text=" " />
              <PyToken text={'"지윤"'} kind="string" />
            </CodeLine>
          </CodePanel>
          <FadeIn delaySec={1.6} translateY={14}>
            <VarBox
              label="name"
              labelDelaySec={1.6}
              boxDelaySec={2.0}
              highlighted
              width={260}
              height={120}
            >
              <PyToken text={'"지윤"'} kind="string" />
            </VarBox>
          </FadeIn>
        </SplitColumn>

        {/* 우 — == 같은지 묻는다 */}
        <SplitColumn
          title={
            <>
              <span
                style={{
                  fontFamily: fonts.mono,
                  color: colors.accent,
                  fontSize: 36,
                  fontWeight: 800,
                  marginRight: 12,
                }}
              >
                ==
              </span>
              <span>같은지 묻는다</span>
            </>
          }
          delaySec={5.0}
        >
          <CodePanel fileName="check.py" width={620} height={120}>
            <CodeLine lineNumber={1} revealAtSec={5.3}>
              <PyToken text="name" kind="name" />
              <PyToken text=" " />
              <span
                style={{
                  color: colors.accent,
                  fontFamily: fonts.mono,
                  fontWeight: 800,
                  fontSize: 32,
                  padding: "0 4px",
                }}
              >
                ==
              </span>
              <PyToken text=" " />
              <PyToken text={'"지윤"'} kind="string" />
            </CodeLine>
          </CodePanel>
          <ResultBox text="True" delaySec={6.4} />
        </SplitColumn>
      </div>
    </PageBackground>
  );
};
