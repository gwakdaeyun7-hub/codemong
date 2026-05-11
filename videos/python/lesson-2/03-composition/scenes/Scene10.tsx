/**
 * Scene 10 — 의사코드로 옮기기 (오개념 1 정면 처리) (22s)
 *
 * - 좌측 절반: 앞 scene 의 자연어 박스 (opacity 0.5 로 톤 다운)
 * - 우측 절반: "의사코드" PseudocodeBox (흰 배경 + 모노스페이스)
 *     박스 안에 한국어 의사코드 5줄, 위에서 아래로 fade-in:
 *       1) 음료를 고른다
 *       2) 가격을 확인한다
 *       3) 만약 가격이 5천 원보다 크면:
 *       4) ㅤㅤ카드로 결제하고 사인한다
 *       5) 아니면: 현금으로 결제한다
 *     박스 좌상단 라벨: "주의: 파이썬이 읽는 코드가 아님"
 * - 좌→우 화살표가 자연어 박스 → 의사코드 박스로 한 번 흐름
 *
 * 오개념 1 (의사코드를 진짜 코드로 착각) 비중 있게.
 */

import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import {
  FadeIn,
  NoteBox,
  PageBackground,
  PseudocodeBox,
  StaticArrow,
} from "../primitives";
import { colors, fonts } from "../theme";

const naturalLines = [
  "1) 음료를 고른다",
  "2) 가격을 본다",
  "3) 5천 원이 넘으면 카드를 낸다",
  "└ 사인을 한다",
  "4) 아니면 현금을 낸다",
];

const pseudoLines = [
  "1) 음료를 고른다",
  "2) 가격을 확인한다",
  "3) 만약 가격이 5천 원보다 크면:",
  // 전각 공백으로 들여쓰기 시각화 — 번호는 좌측 정렬, 본문만 들여쓰기.
  // (5강 조건문에서 if 본문 들여쓰기를 가르칠 때 회상 자산이 됨 — 번호 위치가
  // 다르면 "들여쓰기 = 본문" mental model 이 흐려진다.)
  "4) ㅤㅤ카드로 결제하고 사인한다",
  "5) 아니면: 현금으로 결제한다",
];

/** 의사코드 박스 좌상단 "주의" 라벨에 펄스 효과. */
const WarningPulse: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const breath = 0.7 + 0.3 * (Math.sin((frame / fps) * 2.0) * 0.5 + 0.5);
  return <span style={{ opacity: breath }}>{children}</span>;
};

export const Scene10: React.FC = () => {
  return (
    <PageBackground>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "100px 80px",
          gap: 50,
        }}
      >
        {/* 좌측 — 자연어 박스 (톤 다운) */}
        <FadeIn delaySec={0.2} translateY={10}>
          <NoteBox title="자연어" width={720} dimmed>
            <ul
              style={{
                listStyle: "none",
                margin: 0,
                padding: 0,
                display: "flex",
                flexDirection: "column",
                gap: 18,
              }}
            >
              {naturalLines.map((line, i) => (
                <li
                  key={i}
                  style={{
                    fontFamily: fonts.sans,
                    fontSize: 26,
                    fontWeight: 500,
                    color: colors.ink,
                    letterSpacing: "-0.01em",
                    lineHeight: 1.5,
                    paddingLeft: line.startsWith("└") ? 24 : 0,
                  }}
                >
                  {line}
                </li>
              ))}
            </ul>
          </NoteBox>
        </FadeIn>

        {/* 화살표 영역 (자연어 → 의사코드) — 양옆 gap 50 균등 */}
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 170,
            height: 80,
            flexShrink: 0,
          }}
        >
          <FadeIn delaySec={1.4}>
            <StaticArrow width={140} color={colors.accent} thickness={8} />
          </FadeIn>
        </div>

        {/* 우측 — 의사코드 박스 */}
        <FadeIn delaySec={1.0} translateY={20}>
          <PseudocodeBox
            title="의사코드"
            warning={<WarningPulse>주의: 파이썬이 읽는 코드가 아님</WarningPulse>}
            width={720}
          >
            <ul
              style={{
                listStyle: "none",
                margin: 0,
                padding: 0,
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              {pseudoLines.map((line, i) => (
                <li key={i}>
                  <FadeIn delaySec={3.0 + i * 0.55} translateY={6}>
                    <div
                      style={{
                        fontFamily: fonts.mono,
                        fontSize: 26,
                        fontWeight: 500,
                        color: colors.ink,
                        letterSpacing: "0",
                        lineHeight: 1.6,
                        whiteSpace: "pre",
                      }}
                    >
                      {line}
                    </div>
                  </FadeIn>
                </li>
              ))}
            </ul>
          </PseudocodeBox>
        </FadeIn>
      </div>
    </PageBackground>
  );
};
