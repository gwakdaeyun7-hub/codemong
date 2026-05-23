/**
 * Scene 9 — `with` 자동 닫기 (안전망, 16s)
 *
 * **scene-08 의 빨간 경고와 대비 — 녹색 안전망.**
 *
 * - 0~4s: 좌측에 코드 에디터 패널 `memo.py` 세 줄 fade-in (delaySec 0.6):
 *   1. with open("memo.txt", "w") as f:
 *   2.     f.write("오늘 할 일: 청소")
 *   3. print("끝")
 * - 4~10s: with 블록의 들여쓰기된 본문(line2) 이 _녹색 점선 안전망_ 으로 강조
 *   (IndentSafetyGuide, delaySec 2.0, left 112, top 108, height 52 — line2 한 줄만
 *   감싸고 line1 헤더는 건드리지 않음, panel.height 280 안에 fit, R-021 충족).
 *   그 옆(패널 왼쪽 바깥 여백)에 작은 라벨 "_안전망_" (delaySec 2.8).
 * - 10~14s: 3번째 줄 `print("끝")` fade-in (delaySec 4.0) 과 동시에, 코드
 *   패널 우측에 큰 초록 체크 ✓ 마커 (size 80, delaySec 4.6, R-024 panel
 *   안쪽 inset right 24). 옆에 "_자동으로 닫힘_" 라벨 (delaySec 5.0).
 * - 14~16s: LowerThird (delaySec 6.0).
 *
 * R-021 충족: IndentSafetyGuide top 108 + height 52 = 160 ≤ panel.height 280.
 * R-024 충족: 초록 체크 panel 안쪽 inset right 24 (panel padding 22 보다 안쪽).
 * R-016 충족: 초록 체크 등장 시점 4.6s ↔ narration "자동으로 안전하게 닫힙니다"
 *             ~8s — 시각이 먼저 자리잡고 narration 이 의미 부여 (OK).
 */

import React from "react";
import {
  CheckMark,
  CodeLine,
  CodePanel,
  FadeIn,
  IndentSafetyGuide,
  LowerThird,
  PageBackground,
  PyToken,
} from "../primitives";
import { colors, fonts, radii } from "../theme";

const REVEAL = {
  codePanel: 0.6,
  line1: 0.8,
  line2: 1.4,
  line3: 4.0, // print("끝") - 블록 끝
  indentGuide: 2.0,
  indentLabel: 2.8,
  checkMark: 4.6,
  closedLabel: 5.0,
  lowerThird: 6.0,
} as const;

export const Scene09: React.FC = () => {
  return (
    <PageBackground>
      {/* 상단 라벨 */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <FadeIn delaySec={0.1} translateY={6}>
          <div
            style={{
              padding: "8px 24px",
              borderRadius: radii.pill,
              background: colors.safeGreenSoft,
              color: colors.safeGreenDeep,
              border: `1.5px solid ${colors.safeGreenBorder}`,
              fontFamily: fonts.sans,
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: "-0.01em",
            }}
          >
            with 의 안전망 — 자동으로 닫힙니다
          </div>
        </FadeIn>
      </div>

      {/* 중앙 — 코드 패널 (relative wrapper, IndentSafetyGuide + CheckMark 위해) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: 220,
        }}
      >
        <FadeIn delaySec={REVEAL.codePanel} translateY={20}>
          <div style={{ position: "relative" }}>
            <CodePanel fileName="memo.py" width={820} height={280}>
              <CodeLine lineNumber={1} revealAtSec={REVEAL.line1}>
                <PyToken text="with" kind="keyword" />
                <PyToken text=" " />
                <PyToken text="open" kind="func" />
                <PyToken text="(" kind="op" />
                <PyToken text={`"memo.txt"`} kind="string" />
                <PyToken text=", " kind="op" />
                <PyToken text={`"w"`} kind="string" />
                <PyToken text=")" kind="op" />
                <PyToken text=" " />
                <PyToken text="as" kind="keyword" />
                <PyToken text=" " />
                <PyToken text="f" kind="name" />
                <PyToken text=":" kind="op" />
              </CodeLine>
              <CodeLine lineNumber={2} revealAtSec={REVEAL.line2}>
                <PyToken text="    " kind="op" />
                <PyToken text="f" kind="name" />
                <PyToken text="." kind="op" />
                <PyToken text="write" kind="func" />
                <PyToken text="(" kind="op" />
                <PyToken text={`"오늘 할 일: 청소"`} kind="string" />
                <PyToken text=")" kind="op" />
              </CodeLine>
              <CodeLine lineNumber={3} revealAtSec={REVEAL.line3}>
                <PyToken text="print" kind="func" />
                <PyToken text="(" kind="op" />
                <PyToken text={`"끝"`} kind="string" />
                <PyToken text=")" kind="op" />
              </CodeLine>
            </CodePanel>

            {/* IndentSafetyGuide — with 블록의 들여쓰기된 본문(line2)만 감싸는 점선 안전망.
                CodePanel: header 40 + content paddingTop 20 = 60. line1 row 60~108(들여쓰기 없음),
                line2 row 114~162(4칸 들여쓰기, `f.write` 텍스트는 x≈129 부터).
                guide 는 line1 헤더를 건드리지 않고 line2 한 줄만 cover:
                  - top 108 (line1 row 아래), height 52 (line2 한 줄) → bottom 160 ≤ panel.height 280 (R-021)
                  - left 112 — 4칸 들여쓰기 공백 자리(line2 `f`@129 바로 왼쪽, line1 텍스트와 무관) */}
            <IndentSafetyGuide
              left={112}
              top={108}
              height={52}
              delaySec={REVEAL.indentGuide}
              durationSec={0.6}
              thickness={5}
            />

            {/* 작은 "안전망" 라벨 — 코드 패널 왼쪽 바깥 여백(panel-x 음수), line2 높이.
                코드 텍스트(line1/line2 모두 x≥62)와 안 겹치도록 패널 밖 좌측에 두고
                같은 줄(line2) 의 점선 guide 를 가리키는 형태. */}
            <div
              style={{
                position: "absolute",
                left: -96,
                top: 120,
                pointerEvents: "none",
              }}
            >
              <FadeIn delaySec={REVEAL.indentLabel} translateY={4}>
                <div
                  style={{
                    padding: "3px 10px",
                    borderRadius: 6,
                    background: colors.safeGreenSoft,
                    color: colors.safeGreenDeep,
                    border: `1.5px solid ${colors.safeGreenBorder}`,
                    fontFamily: fonts.sans,
                    fontSize: 18,
                    fontWeight: 700,
                    letterSpacing: "-0.01em",
                    whiteSpace: "nowrap",
                    opacity: 0.92,
                  }}
                >
                  안전망
                </div>
              </FadeIn>
            </div>

            {/* CheckMark — panel 안쪽 inset right 24 (R-024) */}
            <div
              style={{
                position: "absolute",
                top: 70,
                right: 24,
              }}
            >
              <CheckMark size={80} variant="green" delaySec={REVEAL.checkMark} />
            </div>

            {/* "자동으로 닫힘" 라벨 — CheckMark 아래 */}
            <div
              style={{
                position: "absolute",
                top: 158,
                right: 24,
                width: 100,
                textAlign: "center",
              }}
            >
              <FadeIn delaySec={REVEAL.closedLabel} translateY={4}>
                <div
                  style={{
                    fontFamily: fonts.sans,
                    fontSize: 16,
                    fontWeight: 700,
                    color: colors.safeGreenDeep,
                    letterSpacing: "-0.01em",
                    lineHeight: 1.3,
                  }}
                >
                  자동으로
                  <br />
                  닫힘
                </div>
              </FadeIn>
            </div>
          </div>
        </FadeIn>
      </div>

      <LowerThird
        text={
          <span>
            <span style={{ fontFamily: fonts.mono, color: colors.accentLight }}>
              with
            </span>{" "}
            — 블록 끝에서{" "}
            <span style={{ color: colors.accentLight, fontWeight: 700 }}>
              자동으로 닫힌다
            </span>
          </span>
        }
        delaySec={REVEAL.lowerThird}
      />
    </PageBackground>
  );
};
