/**
 * Scene 4 — 저장 시연: `f.write` 한 줄 + 종이 안으로 (20s)
 *
 * - 0~5s: 좌측 코드 패널 `memo_write.py` 두 줄 sequential type-on.
 *   두 번째 줄 `f.write("오늘 할 일: 청소")` 들여쓰기 4칸, violet 강조.
 * - 5~13s: 우측 노트(공책) 일러스트 fade-in (delaySec 2.4) — 비어있음.
 *   코드의 문자열에서 곡선 화살표 (FlowArrow strokeWidth 6, length ≥ 180)
 *   가 노트 안으로 흘러 들어감. 화살표 도착 직후 노트 안에 한 글자씩
 *   `오늘 할 일: 청소` type-on (delaySec 4.6, 1.2s).
 * - 13~18s: 들여쓰기 안전망 펄스 (0.6s) + 노트 위 작은 초록 체크 ✓
 *   (size 36) + "파일에 _남았다_" 라벨.
 * - 18~20s: LowerThird fade-in (delaySec 8.6).
 *
 * R-012 충족: FlowArrow strokeWidth 6, length ≥ 180.
 * R-016 충족: f.write 강조 ↔ narration "에프 점 라이트" ~5.5s.
 *             곡선 화살표 시작 ↔ narration "파일에 적는다" ~11s.
 * R-001 충족: 노트 안 type-on fontSize 28 == 코드 본문 28.
 */

import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import {
  CheckMark,
  CodeLine,
  CodePanel,
  FadeIn,
  FlowArrow,
  LowerThird,
  Notebook,
  PageBackground,
  PyToken,
  TypeOn,
} from "../primitives";
import { colors, fonts } from "../theme";

const REVEAL = {
  codePanel: 0.2,
  line1: 0.4,
  line2: 1.8, // f.write 줄 type-on
  line2HighlightEnd: 5.5,
  notebookEnter: 2.4,
  flowArrowToNote: 4.0, // 코드 문자열 → 노트 (R-016: narration "파일에 적는다" ~11s 와 사전 자리잡기)
  noteContentTypeOn: 5.0, // 노트 안 글자 type-on
  indentSafetyPulseStart: 7.0,
  checkMark: 7.8,
  fileSavedLabel: 8.2,
  lowerThird: 9.0,
} as const;

export const Scene04: React.FC = () => {
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
          <SectionPill>저장 시연 — 문자열을 파일에 적는다</SectionPill>
        </FadeIn>
      </div>

      {/* 좌측 코드 + 우측 노트 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          paddingLeft: 96,
          paddingRight: 96,
          paddingTop: 160,
          paddingBottom: 180,
          gap: 80,
        }}
      >
        {/* 좌측 — 코드 패널 (relative wrapper, IndentSafetyGuide 위해) */}
        <FadeIn
          delaySec={REVEAL.codePanel}
          translateY={20}
          style={{
            flex: "0 0 auto",
            position: "relative",
          }}
        >
          <CodePanel fileName="memo_write.py" width={760} height={220}>
            <CodeLine
              lineNumber={1}
              revealAtSec={REVEAL.line1}
            >
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
            <CodeLine
              lineNumber={2}
              revealAtSec={REVEAL.line2}
              highlighted
              highlightDurationSec={REVEAL.line2HighlightEnd - REVEAL.line2}
            >
              <PyToken text="    " kind="op" />
              <PyToken text="f" kind="name" />
              <PyToken text="." kind="op" />
              <PyToken text="write" kind="func" />
              <PyToken text="(" kind="op" />
              <PyToken text={`"오늘 할 일: 청소"`} kind="string" />
              <PyToken text=")" kind="op" />
            </CodeLine>
          </CodePanel>

          {/* 블록 안전망 펄스 (delaySec 7.0, 0.6s) — 들여쓰기 영역 강조 */}
          <IndentSafetyPulse panelHeight={220} />
        </FadeIn>

        {/* 우측 — 노트 일러스트 */}
        <FadeIn
          delaySec={REVEAL.notebookEnter}
          translateY={16}
          style={{
            flex: "0 0 auto",
            position: "relative",
          }}
        >
          <Notebook
            width={400}
            height={260}
            lineCount={4}
            fileNameLabel="memo.txt"
            labelDelaySec={REVEAL.notebookEnter + 0.4}
          >
            {/* 노트 안 글자 type-on (delaySec 5.0, 1.2s) */}
            <NoteContent />
          </Notebook>

          {/* 노트 위 ✓ 마커 (저장됨) */}
          <div style={{ position: "absolute", top: -18, right: -18 }}>
            <CheckMark size={36} variant="green" delaySec={REVEAL.checkMark} />
          </div>

          {/* 노트 옆 작은 라벨 — "파일에 남았다" */}
          <div style={{ position: "absolute", bottom: -40, left: 0, right: 0, textAlign: "center" }}>
            <FadeIn delaySec={REVEAL.fileSavedLabel} translateY={6}>
              <div
                style={{
                  fontFamily: fonts.sans,
                  fontSize: 22,
                  fontWeight: 700,
                  color: colors.safeGreenDeep,
                  letterSpacing: "-0.01em",
                }}
              >
                파일에{" "}
                <span style={{ fontWeight: 800 }}>남았다</span>
              </div>
            </FadeIn>
          </div>
        </FadeIn>
      </div>

      {/* FlowArrow overlay — 코드 line2 문자열 → 노트 본문.
          overlay 를 전체 화면(top 0, height 1080)으로 두어 SVG 좌표 = 화면 좌표.
          시작: 코드 패널 우측 가장자리(x≈856) line2 `f.write(...)` 높이(화면 y≈557).
          끝: 노트 본문 글자("오늘 할 일: 청소", "오"@x≈975) _왼쪽 앞_ (x≈948, y≈470)
              — 머리가 글자를 찌르지 않고 진입 지점만 가리킨다.
          curve +40 (위로 볼록, 완만) — 끝 진입을 수평에 가깝게 해 글자 위 찌름 방지. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
        }}
      >
        <FlowArrow
          startX={852}
          startY={555}
          endX={948}
          endY={470}
          curve={40}
          delaySec={REVEAL.flowArrowToNote}
          durationSec={0.8}
          strokeWidth={6}
          color={colors.accent}
          width={1920}
          height={1080}
          uid="s04-write"
        />
      </div>

      <LowerThird
        text={
          <span>
            <span style={{ fontFamily: fonts.mono, color: colors.accentLight }}>
              f.write(문자열)
            </span>{" "}
            —{" "}
            <span style={{ color: colors.accentLight, fontWeight: 700 }}>
              파일에 적는다
            </span>
          </span>
        }
        delaySec={REVEAL.lowerThird}
      />
    </PageBackground>
  );
};

/** 노트 안 글자 — type-on (delaySec 5.0, ~1.2s) */
const NoteContent: React.FC = () => {
  return (
    <div
      style={{
        fontFamily: fonts.mono,
        fontSize: 28,
        fontWeight: 700,
        color: colors.accentInk,
      }}
    >
      <TypeOn
        text="오늘 할 일: 청소"
        delaySec={REVEAL.noteContentTypeOn}
        msPerChar={130}
      />
    </div>
  );
};

/** 들여쓰기 안전망 펄스 — 블록 끝나는 순간 0.6초 강조 */
const IndentSafetyPulse: React.FC<{ panelHeight: number }> = ({ panelHeight }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = REVEAL.indentSafetyPulseStart * fps;
  // 0.6s 펄스: 0 → 1 (0.25s) → 1 → 0 (0.6s ~ 1.0s)
  const opacity = interpolate(
    frame,
    [start, start + 0.25 * fps, start + 0.6 * fps, start + 1.0 * fps],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  // CodePanel: header 40 + content paddingTop 20 + line1 (28×1.7≈48) + gap 6 = 114 → indent guide top
  // height: line2 만 cover ~ 50
  return (
    <div
      style={{
        position: "absolute",
        left: 48,
        top: 114,
        width: 4,
        height: Math.min(60, panelHeight - 114 - 20),
        background: colors.safeGreen,
        borderRadius: 2,
        boxShadow: `0 0 12px ${colors.safeGreen}`,
        opacity: opacity * 0.85,
        pointerEvents: "none",
      }}
    />
  );
};

const SectionPill: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      padding: "8px 24px",
      borderRadius: 999,
      background: colors.accentSoft,
      color: colors.accentInk,
      border: `1.5px solid ${colors.accent}`,
      fontFamily: fonts.sans,
      fontSize: 24,
      fontWeight: 700,
      letterSpacing: "-0.01em",
    }}
  >
    {children}
  </div>
);
