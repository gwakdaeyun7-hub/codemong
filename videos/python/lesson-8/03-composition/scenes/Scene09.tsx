/**
 * Scene 9 — `set` 도입: 중복 자동 제거 (16s)
 *
 * - 0~4s: 상단 라벨 "세 번째 — 셋" + 부제 "_중복 없이_ 모은 묶음".
 * - 4~9s: 좌측 CodePanel — `수강과목 = {"수학", "영어", "수학"}` type-on.
 *         `{`, `}` violet-300, 콜론이 없다는 점이 dict 와 자연 대비.
 * - 9~12s: 우측 SetBox — 세 항목 가로 배치 `"수학"` `"영어"` `"수학"`.
 *          세 번째 `"수학"` 이 빨간 X 와 함께 fade-out (회색 → 사라짐).
 *          결과는 박스 안에 두 개: `"수학"` `"영어"`.
 * - 12~16s: 좌측 코드 아래 한 줄 더 `print(수강과목)`. 콘솔 결과 `{"수학", "영어"}` fade-in.
 *           lower-third "셋 — 중복 자동 제거".
 *
 * 학습 목표 4번 진입. 시나리오: 수강한 과목 태그.
 */

import React from "react";
import {
  CodeLine,
  CodePanel,
  ConsoleLine,
  ConsolePanel,
  FadeIn,
  LowerThird,
  PageBackground,
  PyToken,
  SetBox,
} from "../primitives";
import { colors, fonts, radii } from "../theme";

const REVEAL = {
  headerLabel: 0.2,
  codePanel: 4.0,
  line1: 4.5,
  setBox: 9.0,
  setItem1: 9.3,
  setItem2: 9.8,
  setItem3: 10.3,
  setItem3Strike: 11.0,
  setItem3Fade: 11.6,
  line2: 12.5, // print(수강과목)
  console: 14.0,
  lowerThird: 14.2,
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
            세 번째 — 셋
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
            <span style={{ color: colors.accentInk, fontWeight: 700 }}>중복 없이</span> 모은 묶음
          </div>
        </FadeIn>
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          padding: "160px 80px 140px",
          gap: 60,
        }}
      >
        {/* 좌측 — 코드 + 콘솔 */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 28,
          }}
        >
          <FadeIn delaySec={REVEAL.codePanel} translateY={20}>
            <CodePanel fileName="subjects.py" width={680} height={220}>
              <CodeLine lineNumber={1} revealAtSec={REVEAL.line1}>
                <PyToken text="수강과목" kind="name" />
                <PyToken text=" " />
                <PyToken text="=" kind="op" />
                <PyToken text=" " />
                <PyToken text="{" kind="op" highlight />
                <PyToken text={'"수학"'} kind="string" />
                <PyToken text=", " kind="op" />
                <PyToken text={'"영어"'} kind="string" />
                <PyToken text=", " kind="op" />
                <PyToken text={'"수학"'} kind="string" />
                <PyToken text="}" kind="op" highlight />
              </CodeLine>
              <CodeLine lineNumber={2} revealAtSec={REVEAL.line2}>
                <PyToken text="print" kind="func" />
                <PyToken text="(" kind="op" />
                <PyToken text="수강과목" kind="name" />
                <PyToken text=")" kind="op" />
              </CodeLine>
            </CodePanel>
          </FadeIn>

          <FadeIn delaySec={REVEAL.console} translateY={14}>
            <ConsolePanel title="출력 결과" width={520} height={130}>
              <ConsoleLine revealAtSec={REVEAL.console + 0.2}>
                <span style={{ fontSize: 30, fontWeight: 800, color: colors.darkAccent }}>
                  {`{"수학", "영어"}`}
                </span>
              </ConsoleLine>
            </ConsolePanel>
          </FadeIn>
        </div>

        {/* 우측 — SetBox */}
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <SetBox
            label="수강과목"
            delaySec={REVEAL.setBox}
            width={580}
            height={180}
            items={[
              {
                key: "math-1",
                label: '"수학"',
                enterAtSec: REVEAL.setItem1,
              },
              {
                key: "eng",
                label: '"영어"',
                enterAtSec: REVEAL.setItem2,
              },
              {
                key: "math-dup",
                label: '"수학"',
                enterAtSec: REVEAL.setItem3,
                strikeAtSec: REVEAL.setItem3Strike,
                fadeOutAtSec: REVEAL.setItem3Fade,
              },
            ]}
          />
        </div>
      </div>

      <LowerThird
        text={
          <>
            셋 — <span style={{ color: colors.accentLight, fontWeight: 700 }}>중복 자동 제거</span>
          </>
        }
        delaySec={REVEAL.lowerThird}
      />
    </PageBackground>
  );
};
