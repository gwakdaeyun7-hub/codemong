/**
 * Scene 4 — TypeError · IndexError: 이미 배운 실수의 그림자 (이름만, 24s)
 *
 * 00-objectives §2 학습목표 3 + §4 "에러 다 외워야 한다는 부담 덜기" 처치 —
 * 이름만/짧게 보조 컷. `try/except` 등장 X.
 *
 * - 0~3s: 중앙 라벨 "자주 만나는 둘" (delaySec 0.4).
 * - 3~11s: 두 카드 가로 배열 sequential (0.8 / 1.6 — R-008 동일 width 560/height 280).
 *          카드1 TypeError: `print("3" + 5)` ("3" 문자열 yellow / 5 숫자 blue),
 *          하단 "4강 — 입력은 문자열". 카드2 IndexError: `점수 = [90, 85, 70]` /
 *          `print(점수[3])` ([3] 빨강), 하단 "7강 — 마지막 자리 = len - 1".
 *          각 카드 좌상단 빨간 점 마커 (panel 안쪽 inset — R-024).
 * - 11~17s: 강조 라벨 "에러 = 이미 아는 개념의 작은 어긋남" (3.6). LowerThird (4.2).
 *
 * R-008 충족 (두 카드 동일 크기, 차별화는 헤더 텍스트/색만).
 * R-009 충족 (TypeError/IndexError PascalCase 유지 — uppercase 변환 X).
 * R-024 충족 (빨간 점 마커 panel 안쪽).
 */

import React from "react";
import {
  Card,
  DotMark,
  FadeIn,
  LowerThird,
  PageBackground,
  PyToken,
} from "../primitives";
import { colors, fonts } from "../theme";

const REVEAL = {
  topLabel: 0.4,
  card1: 0.8,
  card2: 1.6,
  insightLabel: 3.6,
  lowerThird: 4.2,
} as const;

const CARD_W = 560;
const CARD_H = 280;

export const Scene04: React.FC = () => {
  return (
    <PageBackground>
      {/* 상단 라벨 */}
      <div
        style={{
          position: "absolute",
          top: 130,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <FadeIn delaySec={REVEAL.topLabel} translateY={6}>
          <div
            style={{
              fontFamily: fonts.sans,
              fontSize: 30,
              fontWeight: 600,
              color: colors.inkMuted,
              letterSpacing: "-0.01em",
            }}
          >
            자주 만나는 둘
          </div>
        </FadeIn>
      </div>

      {/* 두 카드 가로 배열 */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 330,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: 64,
        }}
      >
        {/* 카드 1 — TypeError */}
        <ErrorCard
          delaySec={REVEAL.card1}
          headerName="TypeError"
          shadowLesson="4강 — 입력은 문자열"
          codeLine={
            <span>
              <PyToken text="print" kind="func" style={{ color: colors.syntaxFunc }} />
              <span style={{ color: colors.inkMuted }}>(</span>
              <span
                style={{
                  background: colors.fourBoxYellowSoft,
                  color: colors.fourBoxYellowDeep,
                  border: `1.5px solid ${colors.fourBoxYellowBorder}`,
                  borderRadius: 4,
                  padding: "0 5px",
                  fontWeight: 800,
                }}
              >
                "3"
              </span>
              <span style={{ color: colors.inkMuted }}> + </span>
              <span
                style={{
                  background: colors.fourBoxBlueSoft,
                  color: colors.fourBoxBlueDeep,
                  border: `1.5px solid ${colors.fourBoxBlueBorder}`,
                  borderRadius: 4,
                  padding: "0 5px",
                  fontWeight: 800,
                }}
              >
                5
              </span>
              <span style={{ color: colors.inkMuted }}>)</span>
            </span>
          }
          meaning={
            <span>
              <span style={{ color: colors.fourBoxYellowDeep, fontWeight: 700 }}>문자열</span> +{" "}
              <span style={{ color: colors.fourBoxBlueDeep, fontWeight: 700 }}>숫자</span> → 안 됨
            </span>
          }
        />

        {/* 카드 2 — IndexError */}
        <ErrorCard
          delaySec={REVEAL.card2}
          headerName="IndexError"
          shadowLesson={
            <span>
              7강 — 마지막 자리 ={" "}
              <span style={{ fontFamily: fonts.mono }}>len - 1</span>
            </span>
          }
          codeLine={
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <span>
                <span style={{ color: colors.ink }}>점수</span>
                <span style={{ color: colors.inkMuted }}> = [</span>
                <span style={{ color: colors.fourBoxBlueDeep }}>90, 85, 70</span>
                <span style={{ color: colors.inkMuted }}>]</span>
              </span>
              <span>
                <PyToken text="print" kind="func" style={{ color: colors.syntaxFunc }} />
                <span style={{ color: colors.inkMuted }}>(점수</span>
                <span
                  style={{
                    background: "rgba(220, 38, 38, 0.16)",
                    color: colors.dangerRedDeep,
                    border: `1.5px solid ${colors.dangerRedBorder}`,
                    borderRadius: 4,
                    padding: "0 4px",
                    fontWeight: 800,
                  }}
                >
                  [3]
                </span>
                <span style={{ color: colors.inkMuted }}>)</span>
              </span>
            </div>
          }
          meaning={
            <span>
              <span style={{ color: colors.dangerRedDeep, fontWeight: 700 }}>3개</span>인데{" "}
              <span style={{ color: colors.dangerRedDeep, fontWeight: 700 }}>3번 자리</span> 없음
              (0·1·2 까지)
            </span>
          }
        />
      </div>

      {/* 강조 라벨 — "에러 = 이미 아는 개념의 작은 어긋남" */}
      <div
        style={{
          position: "absolute",
          bottom: 200,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <FadeIn delaySec={REVEAL.insightLabel} translateY={8}>
          <div
            style={{
              fontFamily: fonts.sans,
              fontSize: 30,
              fontWeight: 700,
              color: colors.accentInk,
              letterSpacing: "-0.01em",
            }}
          >
            에러 ={" "}
            <span style={{ color: colors.accentDeep, fontWeight: 800 }}>이미 아는 개념</span>의 작은
            어긋남
          </div>
        </FadeIn>
      </div>

      <LowerThird
        text={
          <span>
            에러 이름은{" "}
            <span style={{ color: colors.accentLight, fontWeight: 700 }}>다 외울 필요 없다</span> —{" "}
            <span style={{ color: colors.highlightYellow, fontWeight: 700 }}>마지막 줄</span>만
          </span>
        }
        delaySec={REVEAL.lowerThird}
      />
    </PageBackground>
  );
};

/** 에러 보조 카드 (동일 크기 — R-008, 차별화는 헤더/색만) */
const ErrorCard: React.FC<{
  delaySec: number;
  headerName: string;
  shadowLesson: React.ReactNode;
  codeLine: React.ReactNode;
  meaning: React.ReactNode;
}> = ({ delaySec, headerName, shadowLesson, codeLine, meaning }) => {
  return (
    <FadeIn delaySec={delaySec} translateY={16}>
      <Card style={{ position: "relative", width: CARD_W, height: CARD_H, padding: "28px 32px" }}>
        {/* 빨간 점 마커 (panel 안쪽 좌상단 inset — R-024) */}
        <div style={{ position: "absolute", top: 22, left: 22 }}>
          <DotMark size={16} delaySec={delaySec + 0.3} />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            justifyContent: "center",
            gap: 20,
          }}
        >
          {/* 헤더 — 에러 이름 (mono, red-700, PascalCase 유지) */}
          <div
            style={{
              fontFamily: fonts.mono,
              fontSize: 36,
              fontWeight: 800,
              color: colors.dangerRedDeep,
              letterSpacing: "-0.02em",
              textAlign: "center",
            }}
          >
            {headerName}
          </div>
          {/* 본문 코드 한 줄 */}
          <div
            style={{
              fontFamily: fonts.mono,
              fontSize: 32,
              fontWeight: 700,
              color: colors.ink,
              letterSpacing: "-0.01em",
              textAlign: "center",
              lineHeight: 1.4,
            }}
          >
            {codeLine}
          </div>
          {/* 의미 라벨 */}
          <div
            style={{
              fontFamily: fonts.sans,
              fontSize: 22,
              fontWeight: 600,
              color: colors.inkSoft,
              letterSpacing: "-0.01em",
              textAlign: "center",
            }}
          >
            {meaning}
          </div>
          {/* 하단 — 어느 강의의 그림자 */}
          <div
            style={{
              fontFamily: fonts.sans,
              fontSize: 18,
              fontWeight: 600,
              color: colors.inkMuted,
              letterSpacing: "-0.01em",
              textAlign: "center",
              opacity: 0.8,
            }}
          >
            {shadowLesson}
          </div>
        </div>
      </Card>
    </FadeIn>
  );
};
