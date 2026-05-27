/**
 * Scene 7 — `return`: 값을 돌려준다 (16s)
 *
 * - 0~4s: 상단 pill 라벨 "네 번째 — return" + 부제 "_값을 부른 자리로 돌려주기_".
 *         (R-025: Scene 03/05/10 과 동일 정형.)
 * - 4~9s: 좌측 코드 패널 — 세 줄 (def add(a, b): / return a + b 유지) 그 아래 새 줄 type-on.
 *         result = add(3, 5)
 *         `result` 흰색 굵게, `=` violet-300, `add(3, 5)` 강조.
 * - 9~13s: 우측에 _되돌아오는 화살표_ 다이어그램 fade-in.
 *          `return a + b` 의 결과 박스 (`8`) 등장.
 *          그 박스에서 `result = add(3, 5)` 의 `add(3, 5)` 자리로 거꾸로 곡선 화살표 (1초).
 *          화살표 끝에 작은 라벨 "돌려준 값".
 *          R-012 준수: strokeWidth 7, length ≥ 180.
 * - 13~16s: 코드 아래 콘솔 작게 fade-in: `print(result)` → `8`.
 *          `result` 토큰 한 번 violet pulse.
 *          lower-third "return — 값이 부른 자리로 되돌아온다".
 *
 * 학습 목표 4번 진입. 오개념 1번 처치의 시각 절반 (되돌아오는 화살표).
 * R-016 (narration "돌려주기" 발화 시 return 토큰 펄스, Stage 3 에서 정밀 wire).
 */

import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import {
  CodeLine,
  CodePanel,
  ConsoleLine,
  ConsolePanel,
  FadeIn,
  LowerThird,
  PageBackground,
  PyToken,
  ReturnArrow,
} from "../primitives";
import { colors, fonts, radii, shadows } from "../theme";

const REVEAL = {
  headerLabel: 0.2,
  codePanel: 4.0,
  line1: 4.3, // def add(a, b): (dimmed slightly — 이전 scene 에서 이어짐)
  line2: 4.8, //     return a + b
  line3: 6.5, // (빈 줄)  result = add(3, 5)
  arrowDiagram: 9.0,
  resultBox: 9.5, // 결과 박스 "8" 등장
  returnArrow: 10.5, // 되돌아오는 화살표 그려짐
  console: 13.0,
  resultPulse: 14.0,
  lowerThird: 13.5,
} as const;

export const Scene07: React.FC = () => {
  return (
    <PageBackground>
      {/* 상단 pill 라벨 + 부제 */}
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
            네 번째 —{" "}
            <span style={{ fontFamily: fonts.mono, fontWeight: 800 }}>return</span>
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
            <span style={{ color: colors.accentInk, fontWeight: 700 }}>값을 부른 자리로 돌려주기</span>
          </div>
        </FadeIn>
      </div>

      {/* 좌측 코드 + 콘솔 / 우측 화살표 다이어그램 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          padding: "160px 80px 140px",
          gap: 50,
        }}
      >
        {/* 좌측 — 코드 + 콘솔 */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 24,
          }}
        >
          <FadeIn delaySec={REVEAL.codePanel} translateY={20}>
            <CodePanel fileName="add.py" width={680} height={260}>
              <CodeLine lineNumber={1} revealAtSec={REVEAL.line1}>
                <PyToken text="def" kind="keyword" />
                <PyToken text=" " />
                <PyToken text="add" kind="name" />
                <PyToken text="(" kind="op" />
                <PyToken text="a" kind="dictKey" />
                <PyToken text=", " kind="op" />
                <PyToken text="b" kind="dictKey" />
                <PyToken text=")" kind="op" />
                <PyToken text=":" kind="op" />
              </CodeLine>
              <CodeLine lineNumber={2} revealAtSec={REVEAL.line2}>
                <PyToken text="    " />
                <PyToken text="return" kind="keyword" highlight />
                <PyToken text=" " />
                <PyToken text="a" kind="dictKey" />
                <PyToken text=" + " kind="op" />
                <PyToken text="b" kind="dictKey" />
              </CodeLine>
              <CodeLine lineNumber={3} revealAtSec={REVEAL.line3}>
                <PyToken text="result" kind="name" highlight />
                <PyToken text=" " />
                <PyToken text="=" kind="op" highlight />
                <PyToken text=" " />
                <PyToken text="add" kind="name" />
                <PyToken text="(" kind="op" />
                <PyToken text="3" kind="number" />
                <PyToken text=", " kind="op" />
                <PyToken text="5" kind="number" />
                <PyToken text=")" kind="op" />
              </CodeLine>
            </CodePanel>
          </FadeIn>

          {/* 콘솔 — print(result) → 8 */}
          <FadeIn delaySec={REVEAL.console} translateY={14}>
            <ConsolePanel title="출력 결과" width={420} height={130}>
              <ConsoleLine revealAtSec={REVEAL.console + 0.2}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 12,
                    fontSize: 28,
                    fontWeight: 700,
                    color: colors.darkInk,
                  }}
                >
                  <PyToken text="print(result)" kind="name" />
                  <PyToken text="→" kind="op" />
                  <ResultPulseSpan pulseAt={REVEAL.resultPulse}>
                    <span style={{ color: colors.darkAccent, fontSize: 32, fontWeight: 800 }}>
                      8
                    </span>
                  </ResultPulseSpan>
                </span>
              </ConsoleLine>
            </ConsolePanel>
          </FadeIn>
        </div>

        {/* 우측 — 되돌아오는 화살표 다이어그램 */}
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FadeIn delaySec={REVEAL.arrowDiagram} translateY={14}>
            <div
              style={{
                width: 520, // 480 → 520: 화살표 우측 lane 확보 (좌측 코드 패널과 균형)
                background: colors.bgWhite,
                borderRadius: radii.card,
                border: `1px solid ${colors.border}`,
                boxShadow: "0 2px 12px -4px rgba(24, 24, 27, 0.06)",
                padding: "28px 32px",
                fontFamily: fonts.sans,
              }}
            >
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: colors.accentDeep,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  marginBottom: 18,
                }}
              >
                ← 값이 돌아온다
              </div>

              {/* inner 416 → 448. 두 박스는 좌측 zone(width 300)에 중앙 정렬 →
                  박스 중심 x≈150. 우측 lane(x≈300~448)은 화살표 전용 →
                  화살표가 박스 텍스트(중앙 정렬)를 가로지르지 않음. */}
              <div style={{ position: "relative", width: 448, height: 240 }}>
                {/* 상단 — 호출 자리 (add(3, 5)) — 좌측 zone 중앙 */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: 300,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <CallSiteBox />
                </div>

                {/* 하단 — return 결과 박스 (8) — 좌측 zone 중앙 */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: 300,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <ResultValueBox
                    enterAt={REVEAL.resultBox - REVEAL.arrowDiagram}
                  />
                </div>

                {/* 되돌아오는 화살표 — 결과(아래) → 호출자리(위).
                    엔드포인트를 박스 우측 가장자리 너머(우측 lane)로, 곡선은 우측으로 크게 부풀려
                    중앙 정렬된 박스 텍스트를 가로지르지 않게 한다 (R-024: inner 448 안). */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    pointerEvents: "none",
                  }}
                >
                  <ReturnArrow
                    width={448}
                    height={240}
                    strokeWidth={7}
                    arrows={[
                      {
                        // 결과 박스(중심 x≈150, 우측 끝 ≈ 210) 우측 → 호출자리 박스(우측 끝 ≈ 245) 우측.
                        // 곡선이 우측 lane(x 300+)으로 크게 부풀어 텍스트를 피함.
                        startX: 232,
                        startY: 172,
                        endX: 258,
                        endY: 78,
                        controlX: 408,
                        controlY: 125,
                        delaySec: REVEAL.returnArrow - REVEAL.arrowDiagram,
                        drawDurationSec: 1.0,
                      },
                    ]}
                    label="돌려준 값"
                    labelDelaySec={REVEAL.returnArrow - REVEAL.arrowDiagram + 0.6}
                    labelX={372}
                    labelY={125}
                  />
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>

      <LowerThird
        text={
          <>
            <span style={{ fontFamily: fonts.mono, color: colors.accentLight, fontWeight: 700 }}>
              return
            </span>{" "}
            — 값이 부른 자리로 <span style={{ fontWeight: 800 }}>되돌아온다</span>
          </>
        }
        delaySec={REVEAL.lowerThird}
      />
    </PageBackground>
  );
};

/** 호출 자리 박스 — add(3, 5) 라벨. */
const CallSiteBox: React.FC = () => {
  return (
    <div
      style={{
        padding: "16px 28px",
        borderRadius: 14,
        background: colors.accentSoft,
        border: `2.5px dashed ${colors.accent}`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        boxShadow: shadows.cardSoft,
      }}
    >
      <div
        style={{
          fontFamily: fonts.sans,
          fontSize: 14,
          fontWeight: 700,
          color: colors.accentInk,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          opacity: 0.7,
        }}
      >
        호출 자리
      </div>
      <div
        style={{
          fontFamily: fonts.mono,
          fontSize: 26,
          fontWeight: 800,
          color: colors.accentInk,
          letterSpacing: "-0.01em",
        }}
      >
        add(3, 5)
      </div>
    </div>
  );
};

/** return 결과 박스 — 8. enterAt 에 fade-in. */
const ResultValueBox: React.FC<{ enterAt: number }> = ({ enterAt }) => {
  return (
    <FadeIn delaySec={enterAt} translateY={10}>
      <div
        style={{
          padding: "14px 28px",
          borderRadius: 14,
          background: colors.bgWhite,
          border: `3px solid ${colors.accentDeep}`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          boxShadow: shadows.card,
        }}
      >
        <div
          style={{
            fontFamily: fonts.sans,
            fontSize: 14,
            fontWeight: 700,
            color: colors.accentDeep,
            letterSpacing: "0.04em",
            opacity: 0.7,
          }}
        >
          <span style={{ fontFamily: fonts.mono, fontWeight: 800 }}>return</span> 값
        </div>
        <div
          style={{
            fontFamily: fonts.mono,
            fontSize: 44,
            fontWeight: 900,
            color: colors.accentDeep,
            letterSpacing: "-0.01em",
            lineHeight: 1,
          }}
        >
          8
        </div>
      </div>
    </FadeIn>
  );
};

/** result 글자 한 번 펄스 (펄스 ring). */
const ResultPulseSpan: React.FC<{ pulseAt: number; children: React.ReactNode }> = ({
  pulseAt,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = pulseAt * fps;
  const pulse = interpolate(
    frame,
    [start, start + 0.3 * fps, start + 0.7 * fps, start + 1.2 * fps],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return (
    <span
      style={{
        position: "relative",
        display: "inline-block",
        padding: "0 6px",
      }}
    >
      {children}
      <span
        style={{
          position: "absolute",
          inset: -4,
          borderRadius: 8,
          border: `2.5px solid ${colors.accent}`,
          opacity: pulse,
          pointerEvents: "none",
        }}
      />
    </span>
  );
};
