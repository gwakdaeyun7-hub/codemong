/**
 * Scene 2 — 문제 제기 + 노트 비유 (14s)
 *
 * - 0~4s: 좌측 변수 박스 mock ("결과 = 42") + 라벨 "프로그램 안 변수".
 *         delaySec 0.6~1.4 사이에 opacity 1 → 0 으로 사라지는 시각.
 * - 4~9s: 중앙 큰 노트(공책) 일러스트 fade-in (delaySec 1.4),
 *         옆에 "프로그램이 끝나도 _그대로 남는다_" 회색 라벨 (delaySec 2.4).
 * - 9~14s: LowerThird fade-in (delaySec 3.0):
 *         "_프로그램이 끝나도 남는 곳_ — 파일".
 *
 * 시각 메타포: 변수 박스가 _사라지는_ 시각 = "10강까지의 모든 코드가
 * 실행 후 사라진다" 를 즉시 시각으로 박음 (00-objectives §2 목표 1 처치).
 * 노트(공책) 비유 = _시간을 넘어 데이터가 살아남는다_ 의 한국 입문자 친화 메타포.
 */

import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import {
  FadeIn,
  LowerThird,
  Notebook,
  PageBackground,
} from "../primitives";
import { colors, fonts, shadows } from "../theme";

const REVEAL = {
  varBoxEnter: 0.2,
  varBoxFadeOutStart: 1.6,
  varBoxFadeOutEnd: 2.4,
  notebookEnter: 1.4,
  notebookLabel: 2.4,
  lowerThird: 3.0,
} as const;

export const Scene02: React.FC = () => {
  return (
    <PageBackground>
      {/* 좌측 변수 박스 (사라지는 시각) */}
      <DisappearingVarBox />

      {/* 중앙 우측 — 노트(공책) 일러스트 + 옆 라벨 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingLeft: 480,
          paddingRight: 96,
          paddingBottom: 200,
        }}
      >
        <FadeIn delaySec={REVEAL.notebookEnter} translateY={16}>
          <Notebook
            width={520}
            height={340}
            lineCount={5}
            fileNameLabel="memo.txt"
            labelDelaySec={REVEAL.notebookEnter + 0.6}
          />
        </FadeIn>

        {/* 우측 라벨 */}
        <div style={{ marginLeft: 60, width: 320 }}>
          <FadeIn delaySec={REVEAL.notebookLabel} translateY={10}>
            <div
              style={{
                fontFamily: fonts.sans,
                fontSize: 28,
                fontWeight: 500,
                color: colors.inkSoft,
                letterSpacing: "-0.01em",
                lineHeight: 1.5,
              }}
            >
              프로그램이 끝나도{" "}
              <span style={{ color: colors.accentInk, fontWeight: 800 }}>
                그대로 남는다
              </span>
            </div>
          </FadeIn>
        </div>
      </div>

      <LowerThird
        text={
          <span>
            <span style={{ color: colors.accentLight, fontWeight: 700 }}>
              프로그램이 끝나도 남는 곳
            </span>{" "}
            — 파일
          </span>
        }
        delaySec={REVEAL.lowerThird}
      />
    </PageBackground>
  );
};

/** 좌측 변수 박스 — fade-in 후 빠르게 사라지는 시각 */
const DisappearingVarBox: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enterStart = REVEAL.varBoxEnter * fps;
  const enter = interpolate(frame, [enterStart, enterStart + 0.5 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeStart = REVEAL.varBoxFadeOutStart * fps;
  const fadeEnd = REVEAL.varBoxFadeOutEnd * fps;
  const fadeOut = interpolate(frame, [fadeStart, fadeEnd], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = enter * fadeOut;
  const translateY = (1 - enter) * 10;

  return (
    <div
      style={{
        position: "absolute",
        top: 380,
        left: 140,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 14,
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      {/* 위 라벨 */}
      <div
        style={{
          fontFamily: fonts.sans,
          fontSize: 22,
          fontWeight: 600,
          color: colors.inkMuted,
          letterSpacing: "-0.01em",
        }}
      >
        프로그램 안 변수
      </div>
      {/* 박스 */}
      <div
        style={{
          width: 280,
          height: 120,
          borderRadius: 18,
          background: colors.bgWhite,
          border: `2px solid ${colors.border}`,
          boxShadow: shadows.cardSoft,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: fonts.mono,
          fontSize: 36,
          fontWeight: 700,
          color: colors.ink,
        }}
      >
        결과 = 42
      </div>
      {/* 아래 작은 회색 라벨 (사라짐 표시) */}
      <FadeIn delaySec={REVEAL.varBoxFadeOutStart - 0.2} translateY={6}>
        <div
          style={{
            fontFamily: fonts.sans,
            fontSize: 20,
            fontWeight: 600,
            color: colors.inkMuted,
            fontStyle: "italic",
            opacity: 0.75,
          }}
        >
          → 사라짐
        </div>
      </FadeIn>
    </div>
  );
};
