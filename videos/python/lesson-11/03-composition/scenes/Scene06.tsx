/**
 * Scene 6 — 불러오기 시연: `f.read` + 변수 + print (20s)
 *
 * - 0~5s: 좌측 코드 패널 `memo_read.py` 세 줄 sequential type-on:
 *   1. with open("memo.txt", "r") as f:
 *   2.     내용 = f.read()
 *   3. print(내용)
 * - 5~13s: 우측 노트(공책) 일러스트 fade-in (delaySec 2.0). 노트 안엔 이미
 *   `오늘 할 일: 청소` 가 있음. 노트 글자에서 _되돌아오는_ 곡선 화살표가
 *   코드의 `f.read()` 위치로 흘러나옴 (scene-04 와 반대 방향). 화살표 끝
 *   에 작은 변수 박스 `내용` 시각화.
 * - 13~17s: 코드 우측 콘솔 패널 fade-in. 콘솔 안 한 줄 type-on:
 *   `오늘 할 일: 청소` (fontSize 30 — R-001).
 * - 17~20s: LowerThird fade-in (delaySec 7.8).
 *
 * R-014 충족: 좌측 코드 패널 height 240, 우측 노트 height 240 동일.
 *             콘솔 패널은 우측 별도 위치.
 * R-001 충족: 콘솔 결과 fontSize 30, 코드 본문 28 (1.07×, 1.5× 이내).
 * R-016 충족: 변수 박스 `내용` 등장 시점 4.6s 가 narration "내용이라는 변수에
 *             담깁니다" 발화 시점 ~11.5s 보다 사전 자리잡기 (시각 먼저).
 */

import React from "react";
import {
  CodeLine,
  CodePanel,
  ConsoleLine,
  ConsolePanel,
  FadeIn,
  FlowArrow,
  LowerThird,
  Notebook,
  PageBackground,
  PyToken,
  TypeOn,
} from "../primitives";
import { colors, fonts, radii, shadows } from "../theme";

const REVEAL = {
  codePanel: 0.2,
  line1: 0.4, // with open ... "r"
  line2: 1.5, // 내용 = f.read()
  line3: 3.0, // print(내용)
  notebookEnter: 2.0,
  flowArrowReturn: 3.4, // 노트 → 코드 (scene-04 와 반대 방향)
  varBoxEnter: 4.6,
  consolePanel: 5.8,
  consoleResult: 6.4,
  lowerThird: 7.8,
} as const;

export const Scene06: React.FC = () => {
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
              background: colors.accentSoft,
              color: colors.accentInk,
              border: `1.5px solid ${colors.accent}`,
              fontFamily: fonts.sans,
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: "-0.01em",
            }}
          >
            불러오기 시연 — 파일을 문자열로
          </div>
        </FadeIn>
      </div>

      {/* 좌측 코드 패널 + 우측 노트 (같은 y) */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 200,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 80,
        }}
      >
        {/* 좌측 — 코드 패널 (3줄) */}
        <FadeIn delaySec={REVEAL.codePanel} translateY={20}>
          <CodePanel fileName="memo_read.py" width={780} height={280}>
            <CodeLine lineNumber={1} revealAtSec={REVEAL.line1}>
              <PyToken text="with" kind="keyword" />
              <PyToken text=" " />
              <PyToken text="open" kind="func" />
              <PyToken text="(" kind="op" />
              <PyToken text={`"memo.txt"`} kind="string" />
              <PyToken text=", " kind="op" />
              <PyToken text={`"r"`} kind="string" />
              <PyToken text=")" kind="op" />
              <PyToken text=" " />
              <PyToken text="as" kind="keyword" />
              <PyToken text=" " />
              <PyToken text="f" kind="name" />
              <PyToken text=":" kind="op" />
            </CodeLine>
            <CodeLine
              lineNumber={2}
              revealAtSec={REVEAL.line2}
              highlighted
              highlightDurationSec={2.0}
            >
              <PyToken text="    " kind="op" />
              <PyToken text="내용" kind="dictKey" />
              <PyToken text=" = " kind="op" />
              <PyToken text="f" kind="name" />
              <PyToken text="." kind="op" />
              <PyToken text="read" kind="func" />
              <PyToken text="()" kind="op" />
            </CodeLine>
            <CodeLine lineNumber={3} revealAtSec={REVEAL.line3}>
              <PyToken text="print" kind="func" />
              <PyToken text="(" kind="op" />
              <PyToken text="내용" kind="dictKey" />
              <PyToken text=")" kind="op" />
            </CodeLine>
          </CodePanel>
        </FadeIn>

        {/* 우측 — 노트 (이미 글자가 있음) */}
        <FadeIn delaySec={REVEAL.notebookEnter} translateY={16}>
          <Notebook
            width={420}
            height={280}
            lineCount={4}
            fileNameLabel="memo.txt"
            labelDelaySec={REVEAL.notebookEnter + 0.4}
          >
            <div
              style={{
                fontFamily: fonts.mono,
                fontSize: 28,
                fontWeight: 700,
                color: colors.accentInk,
              }}
            >
              <FadeIn delaySec={REVEAL.notebookEnter + 0.5} translateY={6}>
                <span>오늘 할 일: 청소</span>
              </FadeIn>
            </div>
          </Notebook>
        </FadeIn>
      </div>

      {/* FlowArrow overlay — 노트 → 코드 (scene-04 의 반대 방향) */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 240,
          height: 260,
          pointerEvents: "none",
        }}
      >
        <FlowArrow
          startX={1300}
          startY={120}
          endX={870}
          endY={130}
          curve={-50}
          delaySec={REVEAL.flowArrowReturn}
          durationSec={0.8}
          strokeWidth={6}
          color={colors.accentLight}
          width={1920}
          height={260}
          uid="s06-read"
        />
      </div>

      {/* 변수 박스 `내용` (화살표 끝 시각) */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 510,
          display: "flex",
          justifyContent: "center",
          paddingLeft: 96,
          paddingRight: 96,
          gap: 80,
        }}
      >
        {/* 좌측 column — 변수 박스 */}
        <div style={{ width: 780, display: "flex", justifyContent: "flex-start" }}>
          <FadeIn delaySec={REVEAL.varBoxEnter} translateY={10}>
            <VarBoxMini label="내용" value="오늘 할 일: 청소" />
          </FadeIn>
        </div>
        {/* 우측 column — 콘솔 (`print(내용)` 결과) */}
        <div style={{ width: 420 }}>
          <FadeIn delaySec={REVEAL.consolePanel} translateY={10}>
            <ConsolePanel title="출력 결과" width={420} height={120}>
              <ConsoleLine revealAtSec={REVEAL.consoleResult}>
                <span
                  style={{
                    color: colors.darkInk,
                    fontSize: 30,
                    fontWeight: 700,
                    fontFamily: fonts.mono,
                  }}
                >
                  <TypeOn
                    text="오늘 할 일: 청소"
                    delaySec={REVEAL.consoleResult}
                    msPerChar={90}
                  />
                </span>
              </ConsoleLine>
            </ConsolePanel>
          </FadeIn>
        </div>
      </div>

      <LowerThird
        text={
          <span>
            <span style={{ fontFamily: fonts.mono, color: colors.accentLight }}>
              f.read()
            </span>{" "}
            —{" "}
            <span style={{ color: colors.accentLight, fontWeight: 700 }}>
              파일 전체
            </span>
            를{" "}
            <span style={{ color: colors.accentLight, fontWeight: 700 }}>
              문자열 하나
            </span>{" "}
            로
          </span>
        }
        delaySec={REVEAL.lowerThird}
      />
    </PageBackground>
  );
};

/** 작은 변수 박스 — `내용` 라벨 + 값 */
const VarBoxMini: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 18,
      padding: "12px 22px",
      background: colors.bgWhite,
      borderRadius: 18,
      border: `2px solid ${colors.accent}`,
      boxShadow: shadows.card,
      fontFamily: fonts.mono,
      whiteSpace: "nowrap",
    }}
  >
    <span
      style={{
        padding: "4px 14px",
        borderRadius: 999,
        background: colors.accentSoft,
        color: colors.accentInk,
        fontSize: 22,
        fontWeight: 800,
        letterSpacing: "-0.01em",
      }}
    >
      {label}
    </span>
    <span style={{ color: colors.inkMuted, fontSize: 26, fontWeight: 600 }}>=</span>
    <span style={{ color: colors.ink, fontSize: 26, fontWeight: 700 }}>
      "{value}"
    </span>
  </div>
);
