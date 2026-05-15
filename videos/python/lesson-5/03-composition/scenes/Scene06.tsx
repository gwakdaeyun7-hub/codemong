/**
 * Scene 6 — Active recall: score=75 어느 줄이 실행될까 (14s)
 *
 * - 화면 좌측 절반: scene-04 의 코드 2줄 재등장
 *     `if score >= 60:`
 *     `    print("합격")`
 * - 코드 위쪽에 변수 박스: `score = 75`
 * - 1.5초 정적 동안 코드 우측에 큰 물음표
 * - 정적 후: 조건식 옆에 True 라벨 fade-in, 들여쓰기 줄 violet 하이라이트
 * - 우측 콘솔 패널에 `합격` 출력
 *
 * 학습 목표 2번 강화. lesson-3 의 active recall 패턴 재활용.
 *
 * 타이밍 (scene local, narration 14초):
 *   0.0 ~ 1.0   : 패널 + 변수 박스 등장
 *   1.5 ~ 4.0   : 코드 등장
 *   4.5 ~ 6.0   : 정적 — 물음표 표시
 *   7.0         : True 라벨 + 줄 하이라이트
 *   8.0         : 콘솔 결과 등장
 *   10+         : settle
 */

import React from "react";
import {
  BranchLabel,
  CodeLine,
  CodePanel,
  ConsoleLine,
  ConsolePanel,
  FadeIn,
  PageBackground,
  PyToken,
  QuestionMark,
  VarBox,
} from "../primitives";
import { colors, fonts } from "../theme";

export const Scene06: React.FC = () => {
  return (
    <PageBackground>
      {/* scene 라벨 */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 0,
          right: 0,
          textAlign: "center",
        }}
      >
        <FadeIn delaySec={0.1} translateY={6}>
          <div
            style={{
              fontFamily: fonts.sans,
              fontSize: 28,
              fontWeight: 600,
              color: colors.accentDeep,
              letterSpacing: "0.04em",
            }}
          >
            잠깐 — 어느 줄이 실행될까?
          </div>
        </FadeIn>
      </div>

      {/*
        Layout: VarBox 를 코드 패널 위쪽에 absolute 배치하고,
        CodePanel / QuestionMark / ConsolePanel 을 horizontal flex row 로 정렬.
        세 박스는 모두 같은 세로 위치 + 가로 간격 동일.
      */}
      {/* 변수 박스 — 코드 패널 위쪽 가운데 */}
      <div
        style={{
          position: "absolute",
          top: 200,
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <VarBox
          label="score"
          labelDelaySec={0.5}
          boxDelaySec={0.8}
          width={220}
          height={120}
          valueFontSize={48}
        >
          <PyToken text="75" kind="number" />
        </VarBox>
      </div>

      {/* 메인 row — CodePanel / ? / ConsolePanel 같은 세로 위치 */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 430,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 80,
        }}
      >
        {/* 좌측 — 코드 패널 */}
        <div style={{ position: "relative" }}>
          <FadeIn delaySec={1.2} translateY={16}>
            <CodePanel fileName="grade.py" width={620} height={220}>
              <CodeLine lineNumber={1} revealAtSec={1.8}>
                <PyToken text="if" kind="keyword" />
                <PyToken text=" " />
                <PyToken text="score" kind="name" />
                <PyToken text=" " />
                <PyToken text=">=" kind="op" />
                <PyToken text=" " />
                <PyToken text="60" kind="number" />
                <PyToken text=":" kind="op" />
              </CodeLine>
              <CodeLine lineNumber={2} revealAtSec={2.4} highlighted highlightDurationSec={4.0}>
                <PyToken text="    " />
                <PyToken text="print" kind="func" />
                <PyToken text="(" kind="op" />
                <PyToken text={'"합격"'} kind="string" />
                <PyToken text=")" kind="op" />
              </CodeLine>
            </CodePanel>
          </FadeIn>

          {/* True 라벨 (1줄 우측, 정적 후 등장) — 1줄 세로 중심에 정렬 */}
          <div
            style={{
              position: "absolute",
              top: 68,
              right: -110,
            }}
          >
            <BranchLabel value="True" delaySec={7.0} />
          </div>
        </div>

        {/* 가운데 — 물음표 (정적 동안) — 더 큰 사이즈 */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: 160,
            height: 220,
          }}
        >
          <QuestionMark delaySec={4.5} lifespanSec={2.0} size={180} color={colors.accent} />
        </div>

        {/* 우측 — 콘솔 */}
        <FadeIn delaySec={0.5} translateY={20}>
          <ConsolePanel title="출력 결과" width={500} height={220}>
            <div style={{ height: 30 }} />
            <ConsoleLine revealAtSec={8.5}>
              <span style={{ fontSize: 36, fontWeight: 700 }}>합격</span>
            </ConsoleLine>
          </ConsolePanel>
        </FadeIn>
      </div>
    </PageBackground>
  );
};
