/**
 * Scene 9 — 시험 평균 계산 시나리오 (30s)
 *
 * narration: "시나리오는 시험 평균 계산. 국어/영어/수학 점수를 입력받아 합과 평균을 출력.
 *             한 줄씩 같이 가 봅니다... 첫 줄, input 을 int 로 감싸 점수를 받습니다.
 *             ... 마지막으로 print 두 번으로 합과 평균을 보여 줍니다."
 *
 * 타이밍 (scene local, 30s):
 *   0.0 ~ 3.0  : 좌상단 라벨 "시나리오 — 시험 평균 계산"
 *   3.0 ~ 22.0 : 좌측 60% 코드 7줄 한 줄씩 type-on (각 2~3s)
 *   22.0 ~ 27.0: 우측 콘솔 입력 시뮬레이션 국어:80 → 영어:90 → 수학:70 (1s 간격)
 *   27.0 ~ 30.0: 콘솔 하단 결과 fade-in (합:240, 평균:80.0, 두 숫자 펄스)
 *
 * emphasisBeats:
 *   - narration "int 로 감싸" (~6.5s) → 첫 줄 int( 펄스
 *   - narration "3으로 나눠" (~14s) → 5줄 / 3 펄스
 */

import React from "react";
import {
  CodeLine,
  CodePanel,
  ConsoleLine,
  ConsolePanel,
  EmphasisPulse,
  FadeIn,
  PageBackground,
  PyToken,
  TypeOnTokens,
} from "../primitives";
import { colors, fonts, radii } from "../theme";

const LINE_REVEAL_AT = [3.0, 5.5, 8.0, 10.5, 13.0, 15.5, 17.5] as const;

export const Scene09: React.FC = () => {
  return (
    <PageBackground>
      {/* 좌상단 라벨 */}
      <div style={{ position: "absolute", top: 80, left: 80 }}>
        <FadeIn delaySec={0.2} translateY={8}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 22px",
              borderRadius: radii.pill,
              background: colors.accentSoft,
              border: `1px solid ${colors.accent}`,
              fontFamily: fonts.sans,
              fontSize: 22,
              fontWeight: 700,
              color: colors.accentInk,
            }}
          >
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: colors.accent,
              }}
            />
            시나리오 — 시험 평균 계산
          </div>
        </FadeIn>
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          padding: "140px 80px 60px",
          gap: 48,
        }}
      >
        {/* 좌 — 코드 패널 */}
        <div style={{ flex: 0.6, display: "flex", justifyContent: "flex-end" }}>
          <FadeIn delaySec={1.0} translateY={20}>
            <CodePanel fileName="grade.py" width={820} height={620}>
              {/* 1줄: korean = int(input("국어: ")) */}
              <CodeLine
                lineNumber={1}
                revealAtSec={LINE_REVEAL_AT[0]}
                highlighted
                highlightDurationSec={2.0}
              >
                <PyToken text="korean" kind="name" />
                <PyToken text=" " />
                <PyToken text="=" kind="op" />
                <PyToken text=" " />
                <EmphasisPulse atSec={6.5} durationSec={0.6}>
                  <PyToken text="int" kind="func" />
                </EmphasisPulse>
                <PyToken text="(" kind="op" />
                <TypeOnTokens
                  delaySec={LINE_REVEAL_AT[0] + 0.3}
                  msPerChar={50}
                  segments={[
                    { text: "input", kind: "func" },
                    { text: '("국어: ")', kind: "string" },
                  ]}
                />
                <PyToken text=")" kind="op" />
              </CodeLine>
              {/* 2줄 */}
              <CodeLine
                lineNumber={2}
                revealAtSec={LINE_REVEAL_AT[1]}
                highlighted
                highlightDurationSec={1.8}
              >
                <PyToken text="english" kind="name" />
                <PyToken text=" " />
                <PyToken text="=" kind="op" />
                <PyToken text=" " />
                <PyToken text="int" kind="func" />
                <PyToken text="(" kind="op" />
                <TypeOnTokens
                  delaySec={LINE_REVEAL_AT[1] + 0.3}
                  msPerChar={50}
                  segments={[
                    { text: "input", kind: "func" },
                    { text: '("영어: ")', kind: "string" },
                  ]}
                />
                <PyToken text=")" kind="op" />
              </CodeLine>
              {/* 3줄 */}
              <CodeLine
                lineNumber={3}
                revealAtSec={LINE_REVEAL_AT[2]}
                highlighted
                highlightDurationSec={1.8}
              >
                <PyToken text="math" kind="name" />
                <PyToken text=" " />
                <PyToken text="=" kind="op" />
                <PyToken text=" " />
                <PyToken text="int" kind="func" />
                <PyToken text="(" kind="op" />
                <TypeOnTokens
                  delaySec={LINE_REVEAL_AT[2] + 0.3}
                  msPerChar={50}
                  segments={[
                    { text: "input", kind: "func" },
                    { text: '("수학: ")', kind: "string" },
                  ]}
                />
                <PyToken text=")" kind="op" />
              </CodeLine>
              <div style={{ height: 8 }} />
              {/* 4줄: total = korean + english + math */}
              <CodeLine
                lineNumber={4}
                revealAtSec={LINE_REVEAL_AT[3]}
                highlighted
                highlightDurationSec={1.8}
              >
                <PyToken text="total" kind="name" />
                <PyToken text=" " />
                <PyToken text="=" kind="op" />
                <PyToken text=" " />
                <PyToken text="korean" kind="name" />
                <PyToken text=" " />
                <span
                  style={{
                    color: colors.accent,
                    fontFamily: fonts.mono,
                    fontWeight: 800,
                  }}
                >
                  +
                </span>
                <PyToken text=" " />
                <PyToken text="english" kind="name" />
                <PyToken text=" " />
                <span
                  style={{
                    color: colors.accent,
                    fontFamily: fonts.mono,
                    fontWeight: 800,
                  }}
                >
                  +
                </span>
                <PyToken text=" " />
                <PyToken text="math" kind="name" />
              </CodeLine>
              {/* 5줄: average = total / 3 */}
              <CodeLine
                lineNumber={5}
                revealAtSec={LINE_REVEAL_AT[4]}
                highlighted
                highlightDurationSec={1.8}
              >
                <PyToken text="average" kind="name" />
                <PyToken text=" " />
                <PyToken text="=" kind="op" />
                <PyToken text=" " />
                <PyToken text="total" kind="name" />
                <PyToken text=" " />
                <EmphasisPulse atSec={14.0} durationSec={0.6}>
                  <span
                    style={{
                      color: colors.accent,
                      fontFamily: fonts.mono,
                      fontWeight: 800,
                    }}
                  >
                    / 3
                  </span>
                </EmphasisPulse>
              </CodeLine>
              <div style={{ height: 8 }} />
              {/* 6줄: print("합:", total) */}
              <CodeLine
                lineNumber={6}
                revealAtSec={LINE_REVEAL_AT[5]}
                highlighted
                highlightDurationSec={1.8}
              >
                <PyToken text="print" kind="func" />
                <PyToken text="(" kind="op" />
                <PyToken text={'"합:"'} kind="string" />
                <PyToken text=", " kind="op" />
                <PyToken text="total" kind="name" />
                <PyToken text=")" kind="op" />
              </CodeLine>
              {/* 7줄: print("평균:", average) */}
              <CodeLine
                lineNumber={7}
                revealAtSec={LINE_REVEAL_AT[6]}
                highlighted
                highlightDurationSec={1.8}
              >
                <PyToken text="print" kind="func" />
                <PyToken text="(" kind="op" />
                <PyToken text={'"평균:"'} kind="string" />
                <PyToken text=", " kind="op" />
                <PyToken text="average" kind="name" />
                <PyToken text=")" kind="op" />
              </CodeLine>
            </CodePanel>
          </FadeIn>
        </div>

        {/* 우 — 콘솔 패널 */}
        <div style={{ flex: 0.4, display: "flex", justifyContent: "flex-start" }}>
          <FadeIn delaySec={20.5} translateY={20}>
            <ConsolePanel title="실행 결과" width={620} height={620}>
              <ConsoleLine revealAtSec={22.0}>
                <span style={{ color: colors.darkInk }}>국어: </span>
                <span style={{ color: colors.darkAccent, fontWeight: 800 }}>80</span>
              </ConsoleLine>
              <ConsoleLine revealAtSec={23.0}>
                <span style={{ color: colors.darkInk }}>영어: </span>
                <span style={{ color: colors.darkAccent, fontWeight: 800 }}>90</span>
              </ConsoleLine>
              <ConsoleLine revealAtSec={24.0}>
                <span style={{ color: colors.darkInk }}>수학: </span>
                <span style={{ color: colors.darkAccent, fontWeight: 800 }}>70</span>
              </ConsoleLine>
              <div style={{ height: 22 }} />
              {/* 출력 결과 */}
              <ConsoleLine revealAtSec={27.5}>
                <span style={{ color: colors.darkInk }}>합: </span>
                <EmphasisPulse atSec={28.0} durationSec={0.6} scaleAmp={0.18}>
                  <span
                    style={{
                      color: colors.darkAccent,
                      fontWeight: 800,
                      fontSize: 38,
                      fontFamily: fonts.mono,
                    }}
                  >
                    240
                  </span>
                </EmphasisPulse>
              </ConsoleLine>
              <ConsoleLine revealAtSec={28.5}>
                <span style={{ color: colors.darkInk }}>평균: </span>
                <EmphasisPulse atSec={29.0} durationSec={0.6} scaleAmp={0.18}>
                  <span
                    style={{
                      color: colors.darkAccent,
                      fontWeight: 800,
                      fontSize: 38,
                      fontFamily: fonts.mono,
                    }}
                  >
                    80.0
                  </span>
                </EmphasisPulse>
              </ConsoleLine>
            </ConsolePanel>
          </FadeIn>
        </div>
      </div>
    </PageBackground>
  );
};
