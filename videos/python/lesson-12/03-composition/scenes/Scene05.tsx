/**
 * Scene 5 — 논리오류 함정 깔기 + Active Recall (예측 비트, 23s placeholder)
 *
 * 00-objectives §4 오개념 3 (에러 없으면 맞다는 착각) 함정 깔기 + Active Recall.
 * 12강 가장 무게 큰 구간의 도입. 정답 reveal 은 scene-06 으로 넘김 (R-004).
 *
 * - 0~4s: 코드 패널 (sum.py, width 720, height 240). 네 줄 sequential type-on.
 *         버그 = 세 번째 줄 `합계 = 합계 + n` 들여쓰기 0칸 (for 블록 밖). 이 시점엔
 *         _버그 강조 안 함_ (함정).
 * - 4~10s: 콘솔 패널 (출력, width 360, height 120) — _비어있음_. 큰 `?` (2.6).
 *          "에러 없음 ✓" 함정 라벨 (3.0).
 * - 10~18s: QuestionBox "합계엔 얼마가 나올까요?" (4.0) — 정답 _가림_. 2.5s 정적.
 *           이 scene 에선 정답 reveal 안 함 (scene-06 에서).
 *
 * R-004 충족 (정답 reveal 을 scene-06 으로 분리 — placeholder reveal 잔존 X).
 * R-014 충족 (코드/콘솔 패널 top 정렬, alignItems flex-start).
 * ⚠️ wire 단계에서 scene-05 _scenes/s05.{a0,s1}.mp3 실측으로 QuestionBox 등장
 *    + 정적 길이 re-sync 필수.
 */

import React from "react";
import {
  CodeLine,
  CodePanel,
  ConsolePanel,
  FadeIn,
  PageBackground,
  PyToken,
  QuestionBox,
} from "../primitives";
import { colors, fonts, radii } from "../theme";

/**
 * Wire (Stage 3) — 실측 audio 에 re-sync (R-004 / R-016 / R-027).
 * scene-05.a0 (질문 narration) = 21.336s (local frame 640), s1 (정적) = 2.56s
 * → a0+s1 = 23.896s (local frame 717). scene-05 total = 725 frames.
 * 음절-비율 발화 시점 (probe + 음절 카운트):
 *   "코드가 틀릴 수도"      ~ 4.9s  -> 코드 패널/줄 type-on
 *   "이 코드는 일,이,삼을"  ~ 7.1s  -> 코드 줄들이 설명 직전 다 등장
 *   "잘 돌아가고"           ~12.0s  -> 빈 콘솔 + ?
 *   "빨간 글자도 전혀 없"   ~13.1s  -> "빨간 에러 없음" 함정 라벨
 *   "합계엔 얼마가 나올까요" ~16.2s -> QuestionBox 등장 (정답 가림), s1 정적까지 유지
 * placeholder(4.0s 등) 잔존 금지 — R-004.
 */
const REVEAL = {
  codePanel: 4.5,
  line0: 5.0,
  lineStep: 0.7,
  consolePanel: 10.5,
  questionMark: 11.5,
  noErrorLabel: 13.1,
  questionBox: 16.2,
} as const;

export const Scene05: React.FC = () => {
  return (
    <PageBackground>
      {/* 상단 라벨 */}
      <div
        style={{
          position: "absolute",
          top: 96,
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
            빨간 에러가 없는데 — 틀릴 수도 있다?
          </div>
        </FadeIn>
      </div>

      {/* 메인 row — 코드 패널 | 콘솔 패널 (top 정렬) */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 250,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: 64,
        }}
      >
        {/* 코드 패널 — 합계 버그 (함정: 세 번째 줄 들여쓰기 0칸) */}
        <CodePanel fileName="sum.py" width={720} height={240}>
          <CodeLine lineNumber={1} revealAtSec={REVEAL.line0}>
            <PyToken text="합계" kind="name" /> <PyToken text="=" kind="op" />{" "}
            <PyToken text="0" kind="number" />
          </CodeLine>
          <CodeLine lineNumber={2} revealAtSec={REVEAL.line0 + REVEAL.lineStep}>
            <PyToken text="for" kind="keyword" /> <PyToken text="n" kind="name" />{" "}
            <PyToken text="in" kind="keyword" /> <PyToken text="[1, 2, 3]" kind="number" />
            <PyToken text=":" kind="op" />
          </CodeLine>
          {/* 버그 줄 — 들여쓰기 0칸 (for 블록 밖). 강조 X (함정) */}
          <CodeLine lineNumber={3} revealAtSec={REVEAL.line0 + REVEAL.lineStep * 2}>
            <PyToken text="합계" kind="name" /> <PyToken text="=" kind="op" />{" "}
            <PyToken text="합계" kind="name" /> <PyToken text="+" kind="op" />{" "}
            <PyToken text="n" kind="name" />
          </CodeLine>
          <CodeLine lineNumber={4} revealAtSec={REVEAL.line0 + REVEAL.lineStep * 3}>
            <PyToken text="print" kind="func" />
            <PyToken text="(" kind="op" />
            <PyToken text="합계" kind="name" />
            <PyToken text=")" kind="op" />
          </CodeLine>
        </CodePanel>

        {/* 콘솔 패널 — 비어있음 (Active Recall) + 큰 ? */}
        <div style={{ position: "relative" }}>
          <FadeIn delaySec={REVEAL.consolePanel} translateY={12}>
            <ConsolePanel title="출력" width={360} height={240}>
              {/* 비어있음 — 결과 안 보여줌 (Active Recall) */}
              <span aria-hidden />
            </ConsolePanel>
          </FadeIn>
          {/* 큰 ? (콘솔 위) */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              paddingTop: 40,
            }}
          >
            <FadeIn delaySec={REVEAL.questionMark} translateY={10}>
              <div
                style={{
                  fontFamily: fonts.sans,
                  fontSize: 120,
                  fontWeight: 800,
                  color: colors.darkAccent,
                  lineHeight: 1,
                }}
              >
                ?
              </div>
            </FadeIn>
          </div>
        </div>
      </div>

      {/* "에러 없음 ✓" 함정 라벨 (코드 패널 좌상단 위) */}
      <div
        style={{
          position: "absolute",
          top: 200,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <FadeIn delaySec={REVEAL.noErrorLabel} translateY={6}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 16px",
              borderRadius: radii.pill,
              background: colors.safeGreenSoft,
              color: colors.safeGreenDeep,
              border: `1.5px solid ${colors.safeGreenBorder}`,
              fontFamily: fonts.sans,
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: "-0.01em",
            }}
          >
            <span style={{ fontWeight: 900 }}>✓</span> 빨간 에러 없음
          </div>
        </FadeIn>
      </div>

      {/* Active Recall 질문 카드 (정답 가림 — scene-06 에서 reveal) */}
      <div
        style={{
          position: "absolute",
          bottom: 180,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <QuestionBox
          question={
            <span>
              합계엔 <span style={{ color: colors.accentInk, fontWeight: 800 }}>얼마</span>가
              나올까요?
            </span>
          }
          delaySec={REVEAL.questionBox}
          width={620}
        />
      </div>
    </PageBackground>
  );
};
