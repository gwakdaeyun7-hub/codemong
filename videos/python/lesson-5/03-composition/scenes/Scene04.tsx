/**
 * Scene 4 — `if` 한 줄의 모양 (16s)
 *
 * - 화면 중앙에 코드 에디터 패널 (어두운 배경)
 * - 코드 2줄이 한 줄씩 type-on (각 1.2초)
 *     1줄: `if score >= 60:`
 *     2줄: `    print("합격")`
 * - 코드 좌측에 violet-300 세로 가이드 라인이 2줄째 들여쓰기 영역에 그어짐
 * - 1줄 우측에 작은 라벨 "조건 + 콜론"
 * - 2줄 우측에 작은 라벨 "True 일 때만 실행"
 * - 화면 하단 lower-third: "들여쓰기 = 이 줄은 `if`에 속한다는 표시"
 *
 * 학습 목표 1·2번 진입. 5강 특수 시각화: 들여쓰기 가이드 라인 (1단 깊이).
 */

import React from "react";
import {
  CenteredStage,
  CodeLine,
  CodePanel,
  FadeIn,
  IndentGuide,
  LowerThird,
  PageBackground,
  PyToken,
} from "../primitives";
import { colors, fonts } from "../theme";

export const Scene04: React.FC = () => {
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
              marginBottom: 44,
            }}
          >
            `if` 한 줄의 모양
          </div>
        </FadeIn>

        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "flex-start",
            gap: 40,
          }}
        >
          {/* 코드 패널 */}
          <FadeIn delaySec={0.5} translateY={20}>
            <div style={{ position: "relative" }}>
              <CodePanel fileName="grade.py" width={760} height={260}>
                <CodeLine lineNumber={1} revealAtSec={1.5}>
                  <PyToken text="if" kind="keyword" />
                  <PyToken text=" " />
                  <PyToken text="score" kind="name" />
                  <PyToken text=" " />
                  <PyToken text=">=" kind="op" />
                  <PyToken text=" " />
                  <PyToken text="60" kind="number" />
                  <PyToken text=":" kind="op" />
                </CodeLine>
                <CodeLine lineNumber={2} revealAtSec={5.5}>
                  <PyToken text="    " />
                  <PyToken text="print" kind="func" />
                  <PyToken text="(" kind="op" />
                  <PyToken text={'"합격"'} kind="string" />
                  <PyToken text=")" kind="op" />
                </CodeLine>
              </CodePanel>
              {/*
                들여쓰기 가이드 라인 (1단 깊이) — 2줄째 좌측에 violet-300 세로 띠.
                패널 본문 padding 20px, 헤더 40px, 1줄 line-height 48px → 2줄 시작 ≈ 108px.
                줄번호 + gap(18) = 약 40px 좌측 offset 후 4칸 들여쓰기 폭만큼 가이드.
              */}
              <IndentGuide
                left={64}
                top={108}
                height={52}
                depth={1}
                delaySec={6.0}
                durationSec={0.5}
              />
            </div>
          </FadeIn>

          {/* 우측 라벨 컬럼 */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 18,
              paddingTop: 80,
            }}
          >
            <FadeIn delaySec={4.0} translateY={-8}>
              <div
                style={{
                  padding: "8px 18px",
                  borderRadius: 999,
                  background: colors.accentSoft,
                  color: colors.accentInk,
                  fontFamily: fonts.sans,
                  fontSize: 22,
                  fontWeight: 700,
                  letterSpacing: "-0.01em",
                  border: `1.5px solid ${colors.accent}`,
                  whiteSpace: "nowrap",
                }}
              >
                ← 조건 + 콜론
              </div>
            </FadeIn>
            <FadeIn delaySec={7.0} translateY={-8}>
              <div
                style={{
                  padding: "8px 18px",
                  borderRadius: 999,
                  background: colors.accentSoft,
                  color: colors.accentInk,
                  fontFamily: fonts.sans,
                  fontSize: 22,
                  fontWeight: 700,
                  letterSpacing: "-0.01em",
                  border: `1.5px solid ${colors.accent}`,
                  whiteSpace: "nowrap",
                }}
              >
                ← <span style={{ fontFamily: fonts.mono }}>True</span>일 때만 실행
              </div>
            </FadeIn>
          </div>
        </div>
      </CenteredStage>

      <LowerThird
        text={
          <>
            들여쓰기 = 이 줄은{" "}
            <span style={{ fontFamily: fonts.mono, color: colors.accentLight }}>if</span>에 속한다는
            표시
          </>
        }
        delaySec={9.5}
      />
    </PageBackground>
  );
};
