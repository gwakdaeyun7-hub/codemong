/**
 * Scene 3 — `def` 도입: 레시피 카드 비유 (18s)
 *
 * - 0~5s: 상단 pill 라벨 "첫 번째 — 함수 정의" + 부제 "def 로 _이름 붙은 박스_ 만들기".
 *         (R-025: 순차 시리즈 라벨 완결성 — Scene 05/07/10 의 "두 번째" "세 번째" "네 번째" 와 동일 정형.)
 * - 5~10s: 좌측 코드 패널 — 두 줄 type-on.
 *         def greet(name):
 *             print("안녕,", name)
 * - 10~14s: 우측 RecipeCard fade-in — 이름: greet, 할 일: 인사 출력.
 *           우측 하단 "아직 안 만든 상태" 라벨.
 * - 14~18s: lower-third "함수 정의 — def 이름(자리): 다음 들여쓰기".
 *
 * 학습 목표 2번 진입 (정의 vs 호출 _정의_ 측). 오개념 2번 처치의 시각 절반 (레시피 카드 비유).
 */

import React from "react";
import {
  CodeLine,
  CodePanel,
  FadeIn,
  LowerThird,
  PageBackground,
  PyToken,
  RecipeCard,
} from "../primitives";
import { colors, fonts, radii } from "../theme";

const REVEAL = {
  headerLabel: 0.2,
  codePanel: 4.5,
  line1: 5.0, // def greet(name):
  line2: 6.5, // print("안녕,", name)
  recipeCard: 10.0,
  recipeBody: 11.0,
  lowerThird: 14.5,
} as const;

export const Scene03: React.FC = () => {
  return (
    <PageBackground>
      {/* 상단 pill 라벨 + 부제 — Scene 05/07/10 과 동일 정형 (R-025) */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
        }}
      >
        <FadeIn delaySec={REVEAL.headerLabel} translateY={6}>
          <div
            style={{
              padding: "8px 24px",
              borderRadius: radii.pill,
              background: colors.accentSoft,
              color: colors.accentInk,
              border: `1.5px solid ${colors.accent}`,
              fontFamily: fonts.sans,
              fontSize: 26,
              fontWeight: 700,
              letterSpacing: "-0.01em",
            }}
          >
            첫 번째 — 함수 정의
          </div>
        </FadeIn>
        <FadeIn delaySec={REVEAL.headerLabel + 0.4} translateY={6}>
          <div
            style={{
              fontFamily: fonts.sans,
              fontSize: 22,
              fontWeight: 500,
              color: colors.inkMuted,
              letterSpacing: "-0.01em",
            }}
          >
            <span style={{ fontFamily: fonts.mono, color: colors.accentInk, fontWeight: 700 }}>
              def
            </span>
            로{" "}
            <span style={{ color: colors.accentInk, fontWeight: 700 }}>이름 붙은 박스</span> 만들기
          </div>
        </FadeIn>
      </div>

      {/* 좌측 코드 + 우측 레시피 카드 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          padding: "160px 80px 140px",
          gap: 60,
        }}
      >
        {/* 좌측 — 코드 패널 */}
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <FadeIn delaySec={REVEAL.codePanel} translateY={20}>
            <CodePanel fileName="greet.py" width={720} height={220}>
              <CodeLine lineNumber={1} revealAtSec={REVEAL.line1}>
                <PyToken text="def" kind="keyword" highlight />
                <PyToken text=" " />
                <PyToken text="greet" kind="name" />
                <PyToken text="(" kind="op" />
                <PyToken text="name" kind="dictKey" />
                <PyToken text=")" kind="op" />
                <PyToken text=":" kind="op" highlight />
              </CodeLine>
              <CodeLine lineNumber={2} revealAtSec={REVEAL.line2}>
                <PyToken text="    " />
                <PyToken text="print" kind="func" />
                <PyToken text="(" kind="op" />
                <PyToken text={'"안녕,"'} kind="string" />
                <PyToken text=", " kind="op" />
                <PyToken text="name" kind="dictKey" />
                <PyToken text=")" kind="op" />
              </CodeLine>
            </CodePanel>
          </FadeIn>
        </div>

        {/* 우측 — 레시피 카드 */}
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <RecipeCard
            name="greet"
            task="인사 출력"
            delaySec={REVEAL.recipeCard}
            bodyDelaySec={REVEAL.recipeBody}
            width={420}
            height={280}
          />
        </div>
      </div>

      <LowerThird
        text={
          <>
            함수 <span style={{ color: colors.accentLight, fontWeight: 700 }}>정의</span> —{" "}
            <span style={{ fontFamily: fonts.mono, fontWeight: 700 }}>def 이름(자리):</span> 다음
            들여쓰기
          </>
        }
        delaySec={REVEAL.lowerThird}
      />
    </PageBackground>
  );
};
