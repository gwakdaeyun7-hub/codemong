/**
 * Scene 3 — 변수란 무엇인가 (17s)
 *
 * - 화면 중앙에 빈 박스 한 개 (둥근 사각형, violet-500 외곽선, 흰 배경)
 * - 박스 위쪽에 이름표 모양 라벨이 위에서 떨어지듯 fade-in: `name`
 * - 박스 안쪽에 값이 type-on 으로 채워짐: `"코드몽"`
 * - 박스 우측에 작은 손 아이콘 + 화살표 → 박스의 이름표를 가리킴
 * - 화면 하단 lower-third: "변수 = 값에 붙이는 이름표"
 *
 * 박스/이름표 비유 (00-objectives §1 권고). 코드 자체는 보여주지 않고
 * 박스 시각화로 mental model 먼저 심음.
 */

import React from "react";
import {
  CenteredStage,
  FadeIn,
  HandPointer,
  LowerThird,
  PageBackground,
  PyToken,
  TypeOn,
  VarBox,
} from "../primitives";
import { colors, fonts } from "../theme";

export const Scene03: React.FC = () => {
  return (
    <PageBackground>
      <CenteredStage paddingY={140}>
        <FadeIn delaySec={0.1} translateY={6}>
          <div
            style={{
              fontFamily: fonts.sans,
              fontSize: 30,
              fontWeight: 600,
              color: colors.accentDeep,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              marginBottom: 60,
            }}
          >
            변수란 무엇인가
          </div>
        </FadeIn>

        {/* 박스 + 손 아이콘 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 60,
          }}
        >
          {/* 변수 박스: 라벨 name (떨어지듯 fade-in) + 박스 안 "코드몽" type-on */}
          <VarBox
            label="name"
            labelDelaySec={3.0}
            boxDelaySec={2.0}
            highlighted
            width={360}
            height={180}
            valueFontSize={48}
          >
            {/*
              박스 안 type-on 은 4.0sec 부터 시작.
              "코드몽" 4글자 = 0.4초 정도 (msPerChar=100 으로 또박또박).
              따옴표 포함 6글자 — narration 에서 "코드몽"을 말할 시점에 맞춤.
            */}
            <span style={{ fontFamily: fonts.mono }}>
              <TypeOn
                text={'"코드몽"'}
                delaySec={4.5}
                msPerChar={100}
                style={{ color: colors.syntaxString }}
              />
            </span>
          </VarBox>

          {/* 손 아이콘이 박스 라벨을 가리킴 — 박스 라벨 등장 후 0.6초 뒤 */}
          <FadeIn delaySec={3.6} translateY={-12} durationSec={0.5}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
              }}
            >
              <div
                style={{
                  fontFamily: fonts.sans,
                  fontSize: 22,
                  fontWeight: 700,
                  color: colors.accentDeep,
                  letterSpacing: "-0.01em",
                }}
              >
                이름표
              </div>
              <HandPointer size={72} />
            </div>
          </FadeIn>
        </div>

        {/* 부연 설명: 박스에 값을 한 번 넣고 이름만 부르면 다시 꺼내 쓸 수 있다 */}
        <FadeIn delaySec={6.5} translateY={8}>
          <div
            style={{
              marginTop: 40,
              fontFamily: fonts.sans,
              fontSize: 28,
              fontWeight: 500,
              color: colors.inkMuted,
              letterSpacing: "-0.01em",
              maxWidth: 900,
              lineHeight: 1.5,
            }}
          >
            이름표를 한 번 붙여 두면, 다음부터는{" "}
            <span style={{ color: colors.accentDeep, fontWeight: 700 }}>
              <PyToken text="name" kind="name" />
            </span>{" "}
            만 불러도 같은 값을 꺼낼 수 있어요
          </div>
        </FadeIn>
      </CenteredStage>

      <LowerThird text="변수 = 값에 붙이는 이름표" delaySec={9.0} />
    </PageBackground>
  );
};
