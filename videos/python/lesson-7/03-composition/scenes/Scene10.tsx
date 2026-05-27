/**
 * Scene 10 — 6강 `range` vs 7강 리스트 비교 (14s)
 *
 * 학습 목표 4 + 오개념 3 정면 처치.
 * R-008 (좌우 카드 동일 크기), R-017 (콘솔 N줄 fit), R-009 (uppercase 금지).
 *
 * 추가 (2026-05-27, 사용자 요청): 우측 7강 카드 위에 "scores = [88, 92, 76]" 참고 칩
 * (delaySec REVEAL.lineRgt1+0.6 ≈ 13.6s, 영상 ≈3:05 → 3:13 까지 유지). 우측 카드의
 * `for s in scores:` 가 가리키는 리스트 내용을 명시 — 좌측 6강 카드와 미겹침 (top 155 band).
 *
 * - 0~3s: 좌상단 작은 라벨 "비교 — 6강 `range` vs 7강 리스트".
 * - 3~10s: 좌우 분할 — 좌측 6강 `range`, 우측 7강 리스트. 각 카드 width 720,
 *         height 460 (코드 + 콘솔 stack). 두 카드 사이 회색 구분선.
 *           좌측 코드: for i in range(3): / print(i) → 콘솔: 0, 1, 2
 *           우측 코드: for s in scores:    / print(s) → 콘솔: 88, 92, 76
 * - 10~14s: 양쪽 콘솔 결과 차례로 한 번 펄스. lower-third
 *           "`range` → 자리 번호 · 리스트 → 값 자체".
 *
 * R-017 fit 검증: 좌측 콘솔 3줄. ConsolePanel content fontSize 30 × line-height
 * 1.7 = 51 px strut. 3줄 = 3×51 + 2×6 (gap) = 165. content padding 40 → 205 +
 * header 40 = 245 → height 250 충분. 우측 동일.
 */

import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import {
  CodeLine,
  CodePanel,
  ConsoleLine,
  ConsolePanel,
  FadeIn,
  IndentGuide,
  LowerThird,
  PageBackground,
  PyToken,
} from "../primitives";
import { colors, fonts, radii, shadows } from "../theme";

// R-016 — narration (23.82s) 키워드 발화 시점 동기 (Stage 3 wire 조정).
//   "6강에서 본 포가 헷갈리지 않게 한 컷만 더" (~0~4s) — 도입
//   "왼쪽은 6강의 포 이 인 레인지 괄호 3" (~4~8s) — lineLft1/2
//   "결과는 0, 1, 2. 자리 번호가 나옵니다" (~8~12s) — consoleLft + pulseLft
//   "오른쪽은 7강의 포 에스 인 스코어즈" (~12~16s) — lineRgt1/2
//   "결과는 88, 92, 76. 값 자체가 나옵니다" (~16~20s) — consoleRgt + pulseRgt
//   "레인지를 따라가면 ... 값 자체입니다" (~20~24s) — lowerThird
const REVEAL = {
  smallLabel: 0.1,
  panelLeft: 0.6,
  panelRight: 0.8,
  // 좌측 코드
  lineLft1: 5.0, // narration "왼쪽은 6강의 포 이 인 레인지"
  lineLft2: 6.5,
  guideLft: 7.5,
  // 우측 코드
  lineRgt1: 13.0, // narration "오른쪽은 7강의 포 에스 인 스코어즈"
  lineRgt2: 14.5,
  guideRgt: 15.5,
  // 콘솔
  consoleLft: 8.5, // narration "결과는 0, 1, 2"
  consoleRgt: 16.5, // narration "결과는 88, 92, 76"
  // 결과 펄스 (각 콘솔 등장 + 약간 뒤)
  pulseLft: 10.5, // narration "자리 번호가 나옵니다"
  pulseRgt: 18.5, // narration "값 자체가 나옵니다"
  lowerThird: 20.5, // narration "레인지를 따라가면 ..."
} as const;

const PulseRing: React.FC<{ delaySec: number }> = ({ delaySec }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = delaySec * fps;
  const opacity = interpolate(
    frame,
    [start, start + 0.3 * fps, start + 0.9 * fps, start + 1.4 * fps],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return (
    <div
      style={{
        position: "absolute",
        inset: -6,
        borderRadius: 16,
        border: `3px solid ${colors.accent}`,
        opacity,
        pointerEvents: "none",
        boxShadow: "0 0 0 4px rgba(139, 92, 246, 0.18)",
      }}
    />
  );
};

export const Scene10: React.FC = () => {
  return (
    <PageBackground>
      <div style={{ position: "absolute", top: 50, left: 0, right: 0, textAlign: "center" }}>
        <FadeIn delaySec={REVEAL.smallLabel} translateY={6}>
          <div
            style={{
              fontFamily: fonts.sans,
              fontSize: 28,
              fontWeight: 600,
              color: colors.accentDeep,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            비교 — 6강 · 7강
          </div>
        </FadeIn>
      </div>

      {/* scores 리스트 내용 참고 — 우측 7강 카드의 `for s in scores:` 가 가리키는 리스트를
          작게 명시 (= [88, 92, 76] 라서 출력이 88 92 76). 우측 카드 위 중앙 band (top 155,
          left 1011 = 우측 카드 좌단) 에 고정, 좌측 6강 카드와 미겹침. delaySec = lineRgt1+0.6
          ≈ narration "오른쪽은 7강의 ... 스코어즈" (scene-10 ≈ 13.6s, 영상 3:05) → 3:13 까지 유지. */}
      <div
        style={{
          position: "absolute",
          top: 155,
          left: 1011,
          width: 720,
          display: "flex",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        <FadeIn delaySec={REVEAL.lineRgt1 + 0.6} translateY={8}>
          <div
            style={{
              display: "inline-block",
              padding: "9px 20px",
              borderRadius: radii.pill,
              background: colors.bgWhite,
              border: `1.5px solid ${colors.accent}`,
              boxShadow: shadows.cardSoft,
              fontFamily: fonts.mono,
              fontSize: 25,
              fontWeight: 800,
              letterSpacing: "-0.01em",
              whiteSpace: "nowrap",
            }}
          >
            <span style={{ color: colors.inkSoft }}>scores</span>
            <span style={{ color: colors.inkMuted }}>{" = "}</span>
            <span style={{ color: colors.accent }}>[</span>
            <span style={{ color: colors.ink }}>88</span>
            <span style={{ color: colors.inkMuted }}>{", "}</span>
            <span style={{ color: colors.ink }}>92</span>
            <span style={{ color: colors.inkMuted }}>{", "}</span>
            <span style={{ color: colors.ink }}>76</span>
            <span style={{ color: colors.accent }}>]</span>
          </div>
        </FadeIn>
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "120px 60px 140px",
          gap: 50,
        }}
      >
        {/* 좌측 카드 — 6강 range (R-021 — CodePanel height ≥ IndentGuide top + height) */}
        <FadeIn delaySec={REVEAL.panelLeft} translateY={18} style={{ flex: "0 0 720px" }}>
          <div
            style={{
              width: 720,
              height: 570,
              background: colors.bgWhite,
              borderRadius: radii.card,
              border: `2.5px solid ${colors.border}`,
              boxShadow: "0 4px 24px -8px rgba(24, 24, 27, 0.10)",
              padding: "28px 32px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 22,
            }}
          >
            {/* 카드 라벨 */}
            <div
              style={{
                padding: "6px 16px",
                borderRadius: radii.pill,
                background: colors.borderSoft,
                color: colors.inkSoft,
                fontFamily: fonts.sans,
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: "-0.01em",
                border: `1px solid ${colors.border}`,
              }}
            >
              6강
            </div>
            {/* 코드 (R-021 — height 180 으로 IndentGuide top108+50=158 < 180 fit) */}
            <div style={{ position: "relative" }}>
              <CodePanel fileName="range.py" width={620} height={180}>
                <CodeLine lineNumber={1} revealAtSec={REVEAL.lineLft1}>
                  <PyToken text="for" kind="keyword" />
                  <PyToken text=" " />
                  <PyToken text="i" kind="name" />
                  <PyToken text=" " />
                  <PyToken text="in" kind="keyword" />
                  <PyToken text=" " />
                  <PyToken text="range" kind="func" />
                  <PyToken text="(" kind="op" />
                  <PyToken text="3" kind="number" />
                  <PyToken text=")" kind="op" />
                  <PyToken text=":" kind="op" />
                </CodeLine>
                <CodeLine lineNumber={2} revealAtSec={REVEAL.lineLft2}>
                  <PyToken text="    " />
                  <PyToken text="print" kind="func" />
                  <PyToken text="(" kind="op" />
                  <PyToken text="i" kind="name" />
                  <PyToken text=")" kind="op" />
                </CodeLine>
              </CodePanel>
              <IndentGuide
                left={64}
                top={108}
                height={50}
                depth={1}
                delaySec={REVEAL.guideLft}
                durationSec={0.4}
              />
            </div>
            {/* 콘솔 */}
            <div style={{ position: "relative" }}>
              <FadeIn delaySec={REVEAL.consoleLft} translateY={10}>
                <ConsolePanel title="출력 결과" width={620} height={250}>
                  <ConsoleLine revealAtSec={REVEAL.consoleLft}>
                    <span style={{ fontSize: 30, fontWeight: 700, color: colors.darkInk }}>0</span>
                  </ConsoleLine>
                  <ConsoleLine revealAtSec={REVEAL.consoleLft + 0.4}>
                    <span style={{ fontSize: 30, fontWeight: 700, color: colors.darkInk }}>1</span>
                  </ConsoleLine>
                  <ConsoleLine revealAtSec={REVEAL.consoleLft + 0.8}>
                    <span style={{ fontSize: 30, fontWeight: 700, color: colors.darkInk }}>2</span>
                  </ConsoleLine>
                </ConsolePanel>
              </FadeIn>
              <PulseRing delaySec={REVEAL.pulseLft} />
            </div>
          </div>
        </FadeIn>

        {/* 구분선 (카드 height 570 에 맞춰 약간 늘림) */}
        <FadeIn delaySec={REVEAL.panelLeft + 0.2} translateY={0}>
          <div
            style={{
              width: 2,
              height: 490,
              background: colors.border,
              borderRadius: 1,
              opacity: 0.7,
            }}
          />
        </FadeIn>

        {/* 우측 카드 — 7강 리스트 (R-008 동일 크기 강제 + R-021 IndentGuide fit) */}
        <FadeIn delaySec={REVEAL.panelRight} translateY={18} style={{ flex: "0 0 720px" }}>
          <div
            style={{
              width: 720,
              height: 570,
              background: colors.bgWhite,
              borderRadius: radii.card,
              border: `2.5px solid ${colors.accent}`,
              boxShadow: "0 4px 24px -8px rgba(24, 24, 27, 0.10)",
              padding: "28px 32px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 22,
            }}
          >
            <div
              style={{
                padding: "6px 16px",
                borderRadius: radii.pill,
                background: colors.accentSoft,
                color: colors.accentInk,
                fontFamily: fonts.sans,
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: "-0.01em",
                border: `1px solid ${colors.accent}`,
              }}
            >
              7강
            </div>
            <div style={{ position: "relative" }}>
              <CodePanel fileName="list-iter.py" width={620} height={180}>
                <CodeLine lineNumber={1} revealAtSec={REVEAL.lineRgt1}>
                  <PyToken text="for" kind="keyword" />
                  <PyToken text=" " />
                  <PyToken text="s" kind="name" />
                  <PyToken text=" " />
                  <PyToken text="in" kind="keyword" />
                  <PyToken text=" " />
                  <PyToken text="scores" kind="name" />
                  <PyToken text=":" kind="op" />
                </CodeLine>
                <CodeLine lineNumber={2} revealAtSec={REVEAL.lineRgt2}>
                  <PyToken text="    " />
                  <PyToken text="print" kind="func" />
                  <PyToken text="(" kind="op" />
                  <PyToken text="s" kind="name" />
                  <PyToken text=")" kind="op" />
                </CodeLine>
              </CodePanel>
              <IndentGuide
                left={64}
                top={108}
                height={50}
                depth={1}
                delaySec={REVEAL.guideRgt}
                durationSec={0.4}
              />
            </div>
            <div style={{ position: "relative" }}>
              <FadeIn delaySec={REVEAL.consoleRgt} translateY={10}>
                <ConsolePanel title="출력 결과" width={620} height={250}>
                  <ConsoleLine revealAtSec={REVEAL.consoleRgt}>
                    <span style={{ fontSize: 30, fontWeight: 700, color: colors.darkInk }}>88</span>
                  </ConsoleLine>
                  <ConsoleLine revealAtSec={REVEAL.consoleRgt + 0.4}>
                    <span style={{ fontSize: 30, fontWeight: 700, color: colors.darkInk }}>92</span>
                  </ConsoleLine>
                  <ConsoleLine revealAtSec={REVEAL.consoleRgt + 0.8}>
                    <span style={{ fontSize: 30, fontWeight: 700, color: colors.darkInk }}>76</span>
                  </ConsoleLine>
                </ConsolePanel>
              </FadeIn>
              <PulseRing delaySec={REVEAL.pulseRgt} />
            </div>
          </div>
        </FadeIn>
      </div>

      <LowerThird
        text={
          <>
            <span style={{ fontFamily: fonts.mono, color: colors.accentLight }}>range</span> → 자리
            번호 · 리스트 → 값 자체
          </>
        }
        delaySec={REVEAL.lowerThird}
      />
    </PageBackground>
  );
};
