/**
 * Scene 2 — 비효율 hook + 오늘 흐름 예고 (10s)
 *
 * - 0~5s: 화면 중앙 코드 패널 — `print("안녕")` 5줄이 한 줄씩 type-on (각 0.7초)
 *   - 좌측에 큰 회색 중괄호 + 라벨 "5번 — 그럭저럭"
 * - 5~8s: 코드 우측에 "100번이면?" + 회색 점 세 개 (...) 가 길게 늘어져 화면 밖으로
 *   - 반복의 부담을 시각화
 * - 8~10s: 화면 하단 violet-500 라벨 "오늘 목표 — 한 줄로"
 *   - 5줄 코드 opacity 0.4 로 톤다운 → 다음 scene 으로 자연스럽게 넘어가는 준비
 *
 * "꿀팁/충격" 류 카피 0개. 문제 제시형 도입.
 */

import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { CodeLine, CodePanel, FadeIn, PageBackground, PyToken } from "../primitives";
import { colors, fonts } from "../theme";

const BraceLabel: React.FC = () => {
  return (
    <FadeIn delaySec={0.4} translateY={6}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginRight: 16,
        }}
      >
        <span
          style={{
            fontFamily: fonts.mono,
            fontSize: 220,
            color: colors.inkSubtle,
            fontWeight: 200,
            lineHeight: 0.85,
            letterSpacing: "-0.04em",
          }}
        >
          {"{"}
        </span>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          <span
            style={{
              fontFamily: fonts.sans,
              fontSize: 26,
              fontWeight: 700,
              color: colors.inkSoft,
              letterSpacing: "-0.01em",
              whiteSpace: "nowrap",
            }}
          >
            5번
          </span>
          <span
            style={{
              fontFamily: fonts.sans,
              fontSize: 18,
              fontWeight: 500,
              color: colors.inkMuted,
              letterSpacing: "-0.01em",
              whiteSpace: "nowrap",
            }}
          >
            그럭저럭
          </span>
        </div>
      </div>
    </FadeIn>
  );
};

const Dimmer: React.FC<{ children: React.ReactNode; sinceSec: number }> = ({
  children,
  sinceSec,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = sinceSec * fps;
  const opacity = interpolate(frame, [start, start + 0.6 * fps], [1, 0.4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return <div style={{ opacity }}>{children}</div>;
};

/** 회색 점 세 개가 가로로 늘어져 화면 밖으로 나가는 시각 */
const TrailingDots: React.FC<{ delaySec: number }> = ({ delaySec }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = delaySec * fps;
  const grow = interpolate(frame, [start, start + 1.0 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const dotCount = Math.floor(grow * 14);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        flexWrap: "nowrap",
        opacity: grow > 0.05 ? 1 : 0,
      }}
    >
      {Array.from({ length: dotCount }).map((_, i) => (
        <span
          key={i}
          style={{
            width: 14 - Math.min(i * 0.5, 8),
            height: 14 - Math.min(i * 0.5, 8),
            borderRadius: "50%",
            background: colors.inkSubtle,
            opacity: 1 - i * 0.05,
            flexShrink: 0,
          }}
        />
      ))}
    </div>
  );
};

export const Scene02: React.FC = () => {
  return (
    <PageBackground>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: 80,
          paddingBottom: 140,
          paddingLeft: 100,
          paddingRight: 100,
        }}
      >
        <Dimmer sinceSec={8.0}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
            }}
          >
            <BraceLabel />
            <FadeIn delaySec={0.2} translateY={20}>
              <CodePanel fileName="hello.py" width={520} height={400}>
                <CodeLine lineNumber={1} revealAtSec={0.6}>
                  <PyToken text="print" kind="func" />
                  <PyToken text="(" kind="op" />
                  <PyToken text={'"안녕"'} kind="string" />
                  <PyToken text=")" kind="op" />
                </CodeLine>
                <CodeLine lineNumber={2} revealAtSec={1.3}>
                  <PyToken text="print" kind="func" />
                  <PyToken text="(" kind="op" />
                  <PyToken text={'"안녕"'} kind="string" />
                  <PyToken text=")" kind="op" />
                </CodeLine>
                <CodeLine lineNumber={3} revealAtSec={2.0}>
                  <PyToken text="print" kind="func" />
                  <PyToken text="(" kind="op" />
                  <PyToken text={'"안녕"'} kind="string" />
                  <PyToken text=")" kind="op" />
                </CodeLine>
                <CodeLine lineNumber={4} revealAtSec={2.7}>
                  <PyToken text="print" kind="func" />
                  <PyToken text="(" kind="op" />
                  <PyToken text={'"안녕"'} kind="string" />
                  <PyToken text=")" kind="op" />
                </CodeLine>
                <CodeLine lineNumber={5} revealAtSec={3.4}>
                  <PyToken text="print" kind="func" />
                  <PyToken text="(" kind="op" />
                  <PyToken text={'"안녕"'} kind="string" />
                  <PyToken text=")" kind="op" />
                </CodeLine>
              </CodePanel>
            </FadeIn>
          </div>
        </Dimmer>

        {/* 우측 — "100번이면?" + trailing dots */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 32,
            marginLeft: 60,
            paddingTop: 40,
            maxWidth: 720,
          }}
        >
          <FadeIn delaySec={5.0} translateY={10}>
            <div
              style={{
                fontFamily: fonts.sans,
                fontSize: 64,
                fontWeight: 800,
                color: colors.ink,
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
              }}
            >
              100번이면<span style={{ color: colors.accent }}>?</span>
            </div>
          </FadeIn>
          <TrailingDots delaySec={5.8} />
        </div>
      </div>

      {/* 하단 — "오늘 목표" 라벨 (8s 부터 등장) */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <FadeIn delaySec={8.0} translateY={10}>
          <div
            style={{
              padding: "16px 36px",
              borderRadius: 999,
              background: colors.accent,
              color: "#ffffff",
              fontFamily: fonts.sans,
              fontSize: 30,
              fontWeight: 700,
              letterSpacing: "-0.01em",
              boxShadow: "0 6px 24px -6px rgba(139, 92, 246, 0.45)",
            }}
          >
            오늘 목표 — 한 줄로
          </div>
        </FadeIn>
      </div>
    </PageBackground>
  );
};
