/**
 * Scene 8 — `"w"` 덮어쓰기 경고 (시그니처 오개념, 17s)
 *
 * **11강의 시그니처 시각 장치 — 빨간 경고.** 00-objectives §4 오개념 1
 * (`"w"` 가 덮어쓴다) 의 가장 강한 처치.
 *
 * - 0~5s: 화면 중앙에 빨간 톤 경고 카드 fade-in (delaySec 0.2) — width 1280,
 *         height 540, 배경 zinc-50, border red-300 굵게 (4px), 좌측 상단에 큰
 *         ⚠ 마커 (size 80, dangerRed, R-024 안쪽 inset).
 *         카드 안 좌측에 노트 일러스트 (`오늘 할 일: 청소` 가 있음).
 * - 5~11s: 카드 안 우측에 코드 한 줄 (`f.write("새 메모")`) fade-in (delaySec 2.0).
 *          `"w"` 토큰 red-100 강조 + narration "더블유로 열면" ~7s 펄스 (R-016).
 *          코드 → 노트 빨간 화살표 (FlowArrow strokeWidth 6, length ≥ 180, R-012).
 * - 11~14s: 화살표 도착 순간 노트 안 `오늘 할 일: 청소` fade-out (delaySec 4.6,
 *          0.6초) → `새 메모` type-on (delaySec 5.2). 노트 위 "_기존 내용 사라짐_"
 *          라벨 (red-700, delaySec 6.4).
 * - 14~17s: 화면 하단 사이드 라벨 "이어 붙이려면 — `"a"` 모드" (delaySec 7.0,
 *           opacity 0.7). LowerThird (delaySec 7.4).
 *
 * R-024 충족: ⚠ 마커 카드 안쪽 좌측 상단 inset. 빨간 화살표 panel inset.
 * R-023 충족: RedStrike 사용 X (fade-out 으로 대체).
 * R-016 충족: `"w"` 펄스 = narration "더블유로 열면" 발화 시점 ~7s.
 */

import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import {
  FadeIn,
  FlowArrow,
  LowerThird,
  Notebook,
  PageBackground,
  TypeOn,
  WarnMark,
} from "../primitives";
import { colors, fonts, radii, shadows } from "../theme";

const REVEAL = {
  warnCard: 0.2,
  warnMark: 0.6,
  notebookEnter: 0.6,
  codeLineEnter: 2.0,
  modePulseAt: 7.0, // narration "더블유로 열면" 발화 시점 (R-016)
  flowArrowRed: 3.6,
  oldNoteFadeStart: 4.6, // 기존 "오늘 할 일: 청소" fade-out
  newNoteTypeOn: 5.2, // 새 "새 메모" type-on
  erasedLabel: 6.4, // "기존 내용 사라짐" 라벨
  appendModeNote: 7.0, // "이어 붙이려면 — "a" 모드" 사이드 라벨
  lowerThird: 7.4,
} as const;

export const Scene08: React.FC = () => {
  return (
    <PageBackground>
      {/* 빨간 톤 경고 카드 (중앙) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: 200,
        }}
      >
        <FadeIn delaySec={REVEAL.warnCard} translateY={20}>
          <div
            style={{
              position: "relative",
              width: 1280,
              height: 540,
              background: colors.bg,
              borderRadius: radii.card,
              border: `4px solid ${colors.dangerRedBorder}`,
              boxShadow: shadows.card,
              padding: "44px 56px",
            }}
          >
            {/* ⚠ 마커 (R-024 inset) */}
            <div style={{ position: "absolute", top: 24, left: 24 }}>
              <WarnMark size={80} delaySec={REVEAL.warnMark} />
            </div>

            {/* 좌·우 분할 */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                padding: "120px 56px 56px",
                display: "flex",
                alignItems: "center",
                gap: 80,
              }}
            >
              {/* 좌측 — 노트 */}
              <div style={{ position: "relative", flex: "0 0 auto" }}>
                <Notebook
                  width={420}
                  height={300}
                  lineCount={4}
                  fileNameLabel="memo.txt"
                  labelDelaySec={REVEAL.notebookEnter + 0.4}
                >
                  <SwappingNoteContent />
                </Notebook>
                {/* "기존 내용 사라짐" 라벨 — 노트 위 */}
                <div
                  style={{
                    position: "absolute",
                    top: -38,
                    left: 0,
                    right: 0,
                    textAlign: "center",
                  }}
                >
                  <FadeIn delaySec={REVEAL.erasedLabel} translateY={6}>
                    <div
                      style={{
                        display: "inline-block",
                        padding: "4px 14px",
                        borderRadius: 999,
                        background: colors.dangerRedSoft,
                        color: colors.dangerRedDeep,
                        border: `1.5px solid ${colors.dangerRedBorder}`,
                        fontFamily: fonts.sans,
                        fontSize: 22,
                        fontWeight: 700,
                        letterSpacing: "-0.01em",
                      }}
                    >
                      기존 내용 사라짐
                    </div>
                  </FadeIn>
                </div>
              </div>

              {/* 우측 — 코드 한 줄 */}
              <div style={{ flex: "1 1 0" }}>
                <CodeLineWithModeHighlight />
              </div>
            </div>

            {/* 빨간 화살표 (코드 → 노트) - card-relative.
                코드 텍스트(card-y 248~356) 를 가리지 않도록 아래로 우회.
                시작: 코드 블록 아래 빈 영역(x 700, y 408) — line2 밑.
                끝: 노트 하단 빈 줄 영역(x 430, y 400) — 본문 글자(y 192~230)와 겹치지 않음.
                curve 음수(아래로 볼록) → 호가 코드 텍스트 아래로 돌아 노트(파일)를 가리킴.
                arc 최저점 ~y465 < 카드 콘텐츠 bottom 484 (카드 안에 머무름, R-024 정신). */}
            <FlowArrow
              startX={700}
              startY={408}
              endX={430}
              endY={400}
              curve={-60}
              delaySec={REVEAL.flowArrowRed}
              durationSec={0.7}
              strokeWidth={6}
              color={colors.dangerRed}
              width={1280}
              height={540}
              uid="s08-overwrite"
              style={{ left: 0, top: 0 }}
            />
          </div>
        </FadeIn>
      </div>

      {/* 사이드 라벨 — 이어 붙이려면 "a" 모드 */}
      <div
        style={{
          position: "absolute",
          bottom: 160,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <FadeIn delaySec={REVEAL.appendModeNote} translateY={6}>
          <div
            style={{
              fontFamily: fonts.sans,
              fontSize: 20,
              fontWeight: 500,
              color: colors.inkMuted,
              opacity: 0.75,
              letterSpacing: "-0.01em",
            }}
          >
            이어 붙이려면 —{" "}
            <span style={{ fontFamily: fonts.mono, color: colors.inkSoft, fontWeight: 700 }}>
              "a"
            </span>{" "}
            모드
          </div>
        </FadeIn>
      </div>

      <LowerThird
        text={
          <span>
            <span style={{ fontFamily: fonts.mono, color: colors.dangerRedBorder }}>
              "w"
            </span>{" "}
            —{" "}
            <span style={{ color: colors.dangerRedBorder, fontWeight: 700 }}>
              기존 내용은 지워진다
            </span>
          </span>
        }
        delaySec={REVEAL.lowerThird}
      />
    </PageBackground>
  );
};

/** 노트 안 글자 — 기존 fade-out → 새 type-on (overwrite 시각) */
const SwappingNoteContent: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 노트 진입 시점 (notebookEnter + 0.5) 부터 기존 글자 표시
  const oldEnterStart = (REVEAL.notebookEnter + 0.5) * fps;
  const oldEnter = interpolate(
    frame,
    [oldEnterStart, oldEnterStart + 0.4 * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const oldFadeStart = REVEAL.oldNoteFadeStart * fps;
  const oldFadeEnd = oldFadeStart + 0.6 * fps;
  const oldFade = interpolate(frame, [oldFadeStart, oldFadeEnd], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const oldOpacity = oldEnter * oldFade;

  return (
    <div style={{ position: "relative", height: "100%" }}>
      {/* 기존 글자 (사라짐) */}
      <div
        style={{
          opacity: oldOpacity,
          fontFamily: fonts.mono,
          fontSize: 26,
          fontWeight: 700,
          color: colors.accentInk,
        }}
      >
        오늘 할 일: 청소
      </div>
      {/* 새 글자 — type-on */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          fontFamily: fonts.mono,
          fontSize: 26,
          fontWeight: 700,
          color: colors.dangerRedDeep,
        }}
      >
        <TypeOn
          text="새 메모"
          delaySec={REVEAL.newNoteTypeOn}
          msPerChar={130}
        />
      </div>
    </div>
  );
};

/** 우측 코드 한 줄 — `"w"` 토큰 강조 + 펄스 */
const CodeLineWithModeHighlight: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // line enter
  const enterStart = REVEAL.codeLineEnter * fps;
  const enter = interpolate(frame, [enterStart, enterStart + 0.5 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // "w" 펄스 (modePulseAt)
  const pulseStart = REVEAL.modePulseAt * fps;
  const pulse = interpolate(
    frame,
    [pulseStart, pulseStart + 0.25 * fps, pulseStart + 0.6 * fps, pulseStart + 1.0 * fps],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  // 두 번째 줄 (f.write("새 메모"))
  const line2Start = (REVEAL.codeLineEnter + 0.8) * fps;
  const line2Enter = interpolate(frame, [line2Start, line2Start + 0.5 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        opacity: enter,
        transform: `translateY(${(1 - enter) * 10}px)`,
        fontFamily: fonts.mono,
        fontSize: 36,
        fontWeight: 800,
        color: colors.ink,
        letterSpacing: "-0.02em",
        lineHeight: 1.5,
        whiteSpace: "pre",
      }}
    >
      <div>
        <span>{`with open("memo.txt", `}</span>
        <span
          style={{
            display: "inline-block",
            padding: "0 6px",
            background: colors.dangerRedSoft,
            color: colors.dangerRedDeep,
            borderRadius: 4,
            outline: pulse > 0.05 ? `3px solid ${colors.dangerRed}` : `0 solid transparent`,
            transform: `scale(${1 + pulse * 0.08})`,
          }}
        >
          "w"
        </span>
        <span>{`) as f:`}</span>
      </div>
      <div style={{ opacity: line2Enter }}>
        {`    f.write("새 메모")`}
      </div>
    </div>
  );
};
