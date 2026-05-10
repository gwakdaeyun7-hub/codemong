/**
 * Scene 8 — 자연어로 풀어 쓰기 (17s)
 *
 * - 화면 좌측 절반: "자연어" NoteBox (살짝 종이 질감)
 *     박스 안에 줄글 4줄, 위에서 아래로 fade-in (각 0.5초 간격):
 *       1) 음료를 고른다
 *       2) 가격을 본다
 *       3) 5천 원이 넘으면 카드를 낸다
 *       4) 아니면 현금을 낸다
 *     박스 우측에 작은 사람 아이콘 (자연어 = 사람 말)
 * - 화면 우측 절반: 비워둠 (다음 scene 9 에서 채워짐)
 */

import React from "react";
import {
  FadeIn,
  NoteBox,
  PageBackground,
  PersonGlyph,
} from "../primitives";
import { colors, fonts } from "../theme";

const lines = [
  "1) 음료를 고른다",
  "2) 가격을 본다",
  "3) 5천 원이 넘으면 카드를 낸다",
  "4) 아니면 현금을 낸다",
];

export const Scene08: React.FC = () => {
  return (
    <PageBackground>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          padding: "120px 96px",
        }}
      >
        {/* 좌측 절반 — 자연어 노트 박스 + 사람 아이콘 */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "flex-start",
            gap: 24,
          }}
        >
          <FadeIn delaySec={0.3} translateY={16}>
            <NoteBox title="자연어 — 사람 말로 풀어 쓰기" width={780}>
              <ul
                style={{
                  listStyle: "none",
                  margin: 0,
                  padding: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: 22,
                }}
              >
                {lines.map((line, i) => (
                  <li key={i}>
                    <FadeIn delaySec={1.0 + i * 0.6} translateY={8}>
                      <div
                        style={{
                          fontFamily: fonts.sans,
                          fontSize: 32,
                          fontWeight: 500,
                          color: colors.ink,
                          letterSpacing: "-0.01em",
                          lineHeight: 1.5,
                        }}
                      >
                        {line}
                      </div>
                    </FadeIn>
                  </li>
                ))}
              </ul>
            </NoteBox>
          </FadeIn>
          <FadeIn delaySec={1.6} translateY={10}>
            <div
              style={{
                marginTop: 60,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
              }}
            >
              <PersonGlyph size={64} />
              <div
                style={{
                  fontFamily: fonts.sans,
                  fontSize: 18,
                  fontWeight: 600,
                  color: colors.inkMuted,
                  letterSpacing: "-0.01em",
                }}
              >
                사람
              </div>
            </div>
          </FadeIn>
        </div>

        {/* 우측 절반 — 비워둠 (scene 9 에서 사용) */}
        <div style={{ flex: 1 }} />
      </div>
    </PageBackground>
  );
};
