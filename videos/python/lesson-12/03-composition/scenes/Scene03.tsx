/**
 * Scene 3 — NameError: 마지막 줄부터 아래에서 위로 읽기 (26s placeholder)
 *
 * 00-objectives §4 오개념 2 (위에서부터 읽다 길 잃음) + 학습목표 1·3 핵심 처치.
 *
 * - 0~5s: scene-02 Traceback 박스가 좌측으로 (width 820). 윗줄 두 줄 흐림(0.4).
 * - 5~13s: 박스 우측에 ①② 라벨 (화살표 없이 — 보라 세로바/화살표가 겹쳐 제거).
 *          ② "몇 번째 줄" = File 줄(2번째 줄) 세로 위치 / ① "무슨 에러" = NameError
 *          줄(4번째 줄) 세로 위치에 정렬. 맨 아래 `NameError` 줄 노란 full 강조 (2.0).
 * - 13~20s: 우측 코드 패널 (delaySec 5.0, width 640). `scroe` 빨간 강조 + 같은 줄
 *           오른쪽 인라인 힌트 "← score 인데 scroe?" (7.4 — 코드박스 안, 겹침 없음).
 * - 20~25s: `scroe` → `score` letter swap (8.0, R-002 buffer). 초록 ✓ (9.2,
 *           패널 안쪽 inset right 24 — R-024). LowerThird (9.6).
 *
 * R-016 / R-024 / R-002 충족. (UpArrow 제거 — 사용자 피드백: 세로바/화살표 겹침.)
 */

import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import {
  CheckMark,
  CodeLine,
  CodePanel,
  FadeIn,
  LowerThird,
  PageBackground,
  PyToken,
  SwapLabel,
  TraceLine,
  TracebackBox,
} from "../primitives";
import { colors, fonts, radii } from "../theme";

// scene-03.mp3 silencedetect 실측(local s)으로 재동기:
//   "맨 마지막 줄부터" 3.4s / "네임 에러" 5.7s / "바로 그 위를 보면" 9.07s
//   ("위를" ~9.4) / "세 번째 줄" 10.8s / "가서 보니" 13.0s
//   / "스코어를 스크로라고 잘못 쳤네요" 14.1~16.1s / "오타입니다" 16.8~19.2s
//   / "마지막 줄과 줄 번호" 20.0s. (이전 placeholder 는 전 비트가 5~9s 일찍 떴음.)
const REVEAL = {
  boxMove: 0.2,
  errHighlight: 3.5, // "맨 마지막 줄부터" → NameError 줄 노란 강조
  errLabel: 4.2, // ① 무슨 에러
  fileHighlight: 9.4, // "위를 보면" → File(line 3) 줄 가벼운(partial) 강조
  lineLabel: 9.7, // ② 몇 번째 줄
  codePanel: 12.8, // "가서 보니" → 원인 코드 패널 등장
  scroeHighlight: 14.5, // "스코어를 스크로라고" → scroe 빨간 강조
  bubble: 14.9, // "스크로라고 잘못" → "score 인데 scroe?" 힌트
  swapOldFadeOut: 16.3, // "잘못 쳤네요" 후 → scroe→score 교정
  swapNewFadeIn: 16.9, // 0.2s buffer (R-002)
  checkMark: 17.9, // "변수 이름 오타입니다" → 교정 ✓
  lowerThird: 20.0, // "마지막 줄과 줄 번호" → 정리
} as const;

export const Scene03: React.FC = () => {
  return (
    <PageBackground>
      {/* 상단 라벨 */}
      <div
        style={{
          position: "absolute",
          top: 64,
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
            에러는 아래에서 위로
          </div>
        </FadeIn>
      </div>

      {/* 메인 row — [Traceback (+우측 ①②라벨)] [코드 패널] */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 380,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 44,
        }}
      >
        {/* 좌측 — Traceback 박스 + 우측 ①②라벨 (에러 줄에 세로 정렬, 화살표 제거) */}
        <div style={{ position: "relative", marginRight: 210 }}>
          <FadeIn delaySec={REVEAL.boxMove} translateY={0}>
            <TracebackBox width={820}>
              <TraceLine revealAtSec={REVEAL.boxMove} dimmed>
                {`Traceback (most recent call last):`}
              </TraceLine>
              {/* File 줄(line 3) — "위를 보면" 발화 때 가볍게(partial) 강조 + 밝아짐 */}
              <TraceLine
                revealAtSec={REVEAL.boxMove}
                dimmed
                highlightAtSec={REVEAL.fileHighlight}
                highlightStrength="partial"
              >
                {`  File "main.py", line 3, in <module>`}
              </TraceLine>
              <TraceLine revealAtSec={REVEAL.boxMove} style={{ paddingLeft: 24 }}>
                <span style={{ color: colors.syntaxFunc }}>print</span>
                <span style={{ color: colors.traceMuted }}>(</span>
                <span style={{ color: colors.traceInk }}>scroe</span>
                <span style={{ color: colors.traceMuted }}>)</span>
              </TraceLine>
              <TraceLine
                revealAtSec={REVEAL.boxMove}
                highlightAtSec={REVEAL.errHighlight}
                highlightStrength="full"
              >
                <span style={{ color: colors.traceErrName, fontWeight: 800 }}>NameError</span>
                <span>{`: name 'scroe' is not defined`}</span>
              </TraceLine>
            </TracebackBox>
          </FadeIn>

          {/* ② 몇 번째 줄 — File 줄(2번째 줄) 세로 위치에 정렬 */}
          <div
            style={{
              position: "absolute",
              left: "100%",
              marginLeft: 36,
              top: 107,
              transform: "translateY(-50%)",
              whiteSpace: "nowrap",
            }}
          >
            <OrderLabel num="②" text="몇 번째 줄" delaySec={REVEAL.lineLabel} />
          </div>

          {/* ① 무슨 에러 — NameError 줄(4번째 줄) 세로 위치에 정렬 */}
          <div
            style={{
              position: "absolute",
              left: "100%",
              marginLeft: 36,
              top: 215,
              transform: "translateY(-50%)",
              whiteSpace: "nowrap",
            }}
          >
            <OrderLabel num="①" text="무슨 에러" delaySec={REVEAL.errLabel} />
          </div>
        </div>

        {/* 우측 — 원인 코드 패널 */}
        <div style={{ position: "relative" }}>
          <FadeIn delaySec={REVEAL.codePanel} translateY={16}>
            <CodePanel fileName="main.py" width={640} height={240}>
              <CodeLine lineNumber={1} revealAtSec={REVEAL.codePanel}>
                <PyToken text="score" kind="name" /> <PyToken text="=" kind="op" />{" "}
                <PyToken text="90" kind="number" />
              </CodeLine>
              <CodeLine lineNumber={2} revealAtSec={REVEAL.codePanel + 0.2}>
                <PyToken text="print" kind="func" />
                <PyToken text="(" kind="op" />
                <PyToken text={`"내 점수:"`} kind="string" />
                <PyToken text=")" kind="op" />
              </CodeLine>
              <CodeLine lineNumber={3} revealAtSec={REVEAL.codePanel + 0.4}>
                <PyToken text="print" kind="func" />
                <PyToken text="(" kind="op" />
                <ScroeToScoreSwap />
                <PyToken text=")" kind="op" />
                <ScroeHint />
              </CodeLine>
            </CodePanel>
          </FadeIn>

          {/* 교정 후 초록 ✓ (패널 안쪽 inset right 24 — R-024) */}
          <div style={{ position: "absolute", bottom: 22, right: 24 }}>
            <CheckMark size={40} delaySec={REVEAL.checkMark} variant="green" />
          </div>
        </div>
      </div>

      <LowerThird
        text={
          <span>
            에러는 <span style={{ color: colors.accentLight, fontWeight: 700 }}>아래에서 위로</span>{" "}
            — <span style={{ color: colors.highlightYellow, fontWeight: 700 }}>마지막 줄</span> → 줄
            번호
          </span>
        }
        delaySec={REVEAL.lowerThird}
      />
    </PageBackground>
  );
};

/** ①/② 순서 라벨 (작은 accent 칩) */
const OrderLabel: React.FC<{ num: string; text: string; delaySec: number }> = ({
  num,
  text,
  delaySec,
}) => {
  return (
    <FadeIn delaySec={delaySec} translateY={6}>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "6px 14px",
          borderRadius: radii.pill,
          background: colors.bgWhite,
          border: `1.5px solid ${colors.accent}`,
          fontFamily: fonts.sans,
          fontSize: 22,
          fontWeight: 700,
          color: colors.accentInk,
          whiteSpace: "nowrap",
          boxShadow: "0 2px 10px -4px rgba(124, 58, 237, 0.35)",
        }}
      >
        <span style={{ fontSize: 24 }}>{num}</span>
        {text}
      </div>
    </FadeIn>
  );
};

/** `scroe` (빨간 강조 + 말풍선) → `score` letter swap */
const ScroeToScoreSwap: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // scroe 빨간 강조 등장
  const hiStart = REVEAL.scroeHighlight * fps;
  const hi = interpolate(frame, [hiStart, hiStart + 0.3 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <SwapLabel
      oldFadeOutAtSec={REVEAL.swapOldFadeOut}
      newFadeInAtSec={REVEAL.swapNewFadeIn}
      fadeDurationSec={0.4}
      initial={
        <span
          style={{
            display: "inline-block",
            color: colors.traceInk,
            borderBottom: hi > 0.05 ? `3px solid ${colors.dangerRed}` : "3px solid transparent",
            background: hi > 0.05 ? "rgba(220, 38, 38, 0.18)" : "transparent",
            borderRadius: 3,
            padding: "0 2px",
            whiteSpace: "nowrap",
          }}
        >
          scroe
        </span>
      }
      newLabel={
        <span
          style={{
            display: "inline-block",
            color: colors.syntaxNumber,
            background: "rgba(52, 211, 153, 0.18)",
            borderRadius: 3,
            padding: "0 2px",
            whiteSpace: "nowrap",
          }}
        >
          score
        </span>
      }
    />
  );
};

/**
 * `score` 인데 `scroe`? 힌트 — 코드 패널 안, `print(scroe)` 오른쪽 인라인 주석.
 * (기존 토큰 위 말풍선이 윗줄 코드와 겹쳐서, 같은 줄 오른쪽으로 옮김.)
 */
const ScroeHint: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = REVEAL.bubble * fps;
  const op = interpolate(frame, [start, start + 0.4 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <span
      style={{
        marginLeft: 28,
        opacity: op,
        fontFamily: fonts.sans,
        fontSize: 22,
        fontWeight: 600,
        color: colors.accentLight,
        whiteSpace: "nowrap",
      }}
    >
      ← <span style={{ fontFamily: fonts.mono, color: colors.darkAccent }}>score</span> 인데{" "}
      <span style={{ fontFamily: fonts.mono, color: colors.traceErrName }}>scroe</span>?
    </span>
  );
};
