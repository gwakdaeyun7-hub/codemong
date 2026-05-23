/**
 * Scene 2 — 문제 제기: 같은 코드를 세 번 쓰는 답답함 (12s)
 *
 * - 0~5s: 화면 중앙 코드 패널 — 세 줄 type-on (각 1.5초 stagger).
 *         print(3 + 5)
 *         print(2 + 7)
 *         print(4 + 6)
 * - 5~9s: 세 줄의 `print(` 토큰이 회색 dashed 박스로 묶임 (반복되는 부분 시각화).
 *         옆에 작은 라벨 "같은 모양 × 3" fade-in.
 * - 9~12s: 화면 하단 lower-third "같은 일을 한 줄로 부를 수 있으면".
 *          코드가 마지막 0.5초 opacity 0.4 로 톤 다운.
 *
 * 트렌디 hook 없음 — _결핍 제시_ 자연스럽게.
 * 입력 사항 §7 도입 권고 정합.
 */

import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import {
  CodeLine,
  CodePanel,
  FadeIn,
  LowerThird,
  PageBackground,
  PyToken,
} from "../primitives";
import { colors, fonts, radii } from "../theme";

const REVEAL = {
  codePanel: 0.3,
  line1: 0.7,
  line2: 2.2,
  line3: 3.7,
  dashedBox: 5.5, // 회색 dashed 박스 (반복되는 print 토큰 묶음)
  sameShapeLabel: 6.5,
  toneDown: 11.5,
  lowerThird: 9.5,
} as const;

export const Scene02: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 마지막 0.5초 톤 다운
  const toneDownOpacity = interpolate(
    frame,
    [REVEAL.toneDown * fps, (REVEAL.toneDown + 0.5) * fps],
    [1, 0.4],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // dashed 박스 fade-in
  const dashedReveal = interpolate(
    frame,
    [REVEAL.dashedBox * fps, (REVEAL.dashedBox + 0.5) * fps],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <PageBackground>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: 200,
          gap: 40,
          opacity: toneDownOpacity,
        }}
      >
        {/* 코드 패널 — 세 줄 반복 */}
        <div style={{ position: "relative" }}>
          <FadeIn delaySec={REVEAL.codePanel} translateY={20}>
            <CodePanel fileName="hello.py" width={720} height={260}>
              <CodeLine lineNumber={1} revealAtSec={REVEAL.line1}>
                <PyToken text="print" kind="func" />
                <PyToken text="(" kind="op" />
                <PyToken text="3" kind="number" />
                <PyToken text=" + " kind="op" />
                <PyToken text="5" kind="number" />
                <PyToken text=")" kind="op" />
              </CodeLine>
              <CodeLine lineNumber={2} revealAtSec={REVEAL.line2}>
                <PyToken text="print" kind="func" />
                <PyToken text="(" kind="op" />
                <PyToken text="2" kind="number" />
                <PyToken text=" + " kind="op" />
                <PyToken text="7" kind="number" />
                <PyToken text=")" kind="op" />
              </CodeLine>
              <CodeLine lineNumber={3} revealAtSec={REVEAL.line3}>
                <PyToken text="print" kind="func" />
                <PyToken text="(" kind="op" />
                <PyToken text="4" kind="number" />
                <PyToken text=" + " kind="op" />
                <PyToken text="6" kind="number" />
                <PyToken text=")" kind="op" />
              </CodeLine>
            </CodePanel>
          </FadeIn>

          {/* dashed 박스 — 세 줄 한 줄 전체(`print(3 + 5)` 닫는 `)` 까지)를 동시에 묶음.
              CodePanel 좌측 lineNumber column 22px + gap 18px = 40px 후 print(
              세 줄 모두 같은 폭. 박스는 코드 텍스트 전체를 감쌈 (still frame 660 측정:
              텍스트 left panel-rel ≈ 61, `)` 우측 끝 panel-rel ≈ 232 → 약간 여유 inset). */}
          <div
            style={{
              position: "absolute",
              left: 54, // 텍스트 시작(62) 보다 살짝 왼쪽 — dash 가 글자에 안 붙게
              top: 60, // header 40 + padding 20
              width: 208, // 닫는 `)` 우측 끝 + 여유 → 54+208=262 (CodePanel 720 안, dash 가 `)` 에 안 붙음)
              height: 170, // 3 lines × ~53 커버
              border: `3px dashed ${colors.inkSubtle}`,
              borderRadius: 8,
              opacity: dashedReveal * 0.85,
              pointerEvents: "none",
            }}
          />

          {/* "같은 모양 × 3" 라벨 — 넓어진 dashed 박스 오른쪽 바깥 (겹침 제거).
              박스 우측 끝(262) + 여백 → left 286. 박스 상단(line 1)과 같은 높이. */}
          <div
            style={{
              position: "absolute",
              left: 286,
              top: 66,
            }}
          >
            <FadeIn delaySec={REVEAL.sameShapeLabel} translateY={-6}>
              <div
                style={{
                  padding: "6px 14px",
                  borderRadius: radii.pill,
                  background: colors.bgWhite,
                  border: `1.5px solid ${colors.inkSubtle}`,
                  color: colors.inkSoft,
                  fontFamily: fonts.sans,
                  fontSize: 22,
                  fontWeight: 700,
                  letterSpacing: "-0.01em",
                  whiteSpace: "nowrap",
                  boxShadow: "0 2px 8px rgba(24, 24, 27, 0.06)",
                }}
              >
                <span style={{ fontStyle: "italic" }}>같은 모양</span> × 3
              </div>
            </FadeIn>
          </div>
        </div>
      </div>

      <LowerThird
        text={
          <>
            <span style={{ color: colors.accentLight, fontWeight: 700 }}>같은 일을 한 줄로</span>{" "}
            부를 수 있으면
          </>
        }
        delaySec={REVEAL.lowerThird}
      />
    </PageBackground>
  );
};
