/**
 * Scene 4 — 첫 코드 한 줄: 할당의 형태 (19s)
 *
 * - 화면 중앙에 코드 패널 (어두운 배경, monospace, violet 액센트)
 * - 코드 한 줄이 type-on 으로 등장: `name = "코드몽"`
 * - 코드 위쪽에 세 화살표가 차례로 fade-in (각 0.4초 간격):
 *     `name` 위 → 라벨 "변수 이름" (violet)
 *     `=` 위 → 라벨 "할당" (회색)
 *     `"코드몽"` 위 → 라벨 "값" (violet)
 * - 화면 하단 lower-third: "왼쪽 = 이름, 오른쪽 = 값"
 *
 * 이번 강의에서 학습자가 만나는 *첫 실제 파이썬 코드 한 줄*.
 * 오개념 1 (변수 이름에 따옴표) 정면 처리 — narration 에서 한 문장.
 */

import React from "react";
import {
  CenteredStage,
  CodeLine,
  CodePanel,
  FadeIn,
  LabelArrow,
  LowerThird,
  PageBackground,
  PyToken,
  TypeOn,
} from "../primitives";
import { colors, fonts } from "../theme";

export const Scene04: React.FC = () => {
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
            첫 코드 한 줄
          </div>
        </FadeIn>

        {/*
          화살표 라벨 영역 — 코드 패널 위쪽.
          코드 한 줄 등장 후 (5.5sec 부터) 라벨이 차례로 fade-in.
          코드 토큰 위치(grid)에 정확히 정렬하기 위해
          내부적으로 grid 3열로 분배 — name(108px) / =(40px) / "코드몽"(190px).
          간격은 코드 패널의 monospace font-size 28px 기준 시각적으로 맞췄음.

          외부 FadeIn 래퍼 없이 grid 컨테이너만 — 각 LabelArrow 가 자체
          delay/fade-in 을 가지므로 외부 fade 불필요. (이전엔 durationSec=0 인
          dummy FadeIn 이 있었으나 interpolate inputRange 모노토닉 검증에
          걸려 제거.)
        */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "auto auto auto",
            alignItems: "end",
            columnGap: 28,
            marginBottom: 24,
            minHeight: 80,
          }}
        >
          <LabelArrow label="변수 이름" delaySec={5.4} emphasize />
          <LabelArrow label="할당" delaySec={5.8} emphasize={false} />
          <LabelArrow label="값" delaySec={6.2} emphasize />
        </div>

        {/* 코드 패널 — 한 줄 type-on */}
        <FadeIn delaySec={1.0} translateY={20}>
          <CodePanel fileName="intro.py" width={780} height={180}>
            <CodeLine lineNumber={1} revealAtSec={1.5}>
              {/*
                Type-on 한 줄 — 단순화 위해 PyToken 으로 색칠된 정적 결과를
                opacity 로 띄우는 대신, monospace 영역에 TypeOn 을 한 번 돌리고
                토큰 색은 글자 위치별로 미리 알 수 없으므로 일반 텍스트로 둔다.
                4강·9강·12강 같은 길이 코드는 더 정밀한 토큰별 type-on 이
                필요해지면 별도 헬퍼로 분리.

                여기서는 narration "왼쪽이 변수 이름, 가운데 등호, 오른쪽이 그
                변수에 들어가는 값" 구간 (4~5sec) 까지 한 줄이 다 보이도록
                msPerChar=130 (느리게) 로 잡음. 총 9글자 ≈ 1.2초 (1.5 ~ 2.7sec).

                Type-on 완료 후 PyToken 색 입힌 정적 버전을 위에 덮어쓰는 fade
                도 가능하지만 학습자에게 시각 노이즈가 됨 — 단색 흰색 코드로 두고,
                토큰 색은 9·10·11·12강에서 정적 PyToken 으로 처리.
              */}
              <TypeOn
                text={'name = "코드몽"'}
                delaySec={1.7}
                msPerChar={130}
                caret
                style={{ color: colors.darkInk }}
              />
            </CodeLine>
          </CodePanel>
        </FadeIn>

        {/* 짚어주기: 왼쪽 이름엔 따옴표가 없다 (오개념 1) */}
        <FadeIn delaySec={9.5} translateY={8}>
          <div
            style={{
              marginTop: 36,
              fontFamily: fonts.sans,
              fontSize: 26,
              fontWeight: 500,
              color: colors.inkMuted,
              letterSpacing: "-0.01em",
              maxWidth: 880,
              lineHeight: 1.5,
            }}
          >
            왼쪽 이름{" "}
            <span style={{ color: colors.accentDeep, fontWeight: 700 }}>
              <PyToken text="name" kind="name" />
            </span>{" "}
            에는 따옴표가 없죠. 따옴표는 오른쪽 값에만 붙어요
          </div>
        </FadeIn>
      </CenteredStage>

      <LowerThird text="왼쪽 = 이름, 오른쪽 = 값" delaySec={11.5} />
    </PageBackground>
  );
};
