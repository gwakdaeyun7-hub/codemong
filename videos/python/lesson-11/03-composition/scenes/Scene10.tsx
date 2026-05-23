/**
 * Scene 10 — 짧은 안내: 파일은 어디에 만들어지나 (11s)
 *
 * 00-objectives §4 오개념 4 (파일 경로 함정) 의 처치 — _한 컷 짧게 사실 한 줄_.
 * 절대 경로 / 상대 경로 용어 등장 X.
 *
 * - 0~3s: 화면 중앙에 작은 안내 카드 fade-in (delaySec 0.6, width 880, height
 *         320, 점선 border, opacity 0.95).
 * - 3~9s: 카드 안 sequential fade-in (delaySec 1.0 / 1.4 / 1.8 / 2.2):
 *   - 상단: 폴더 아이콘 (size 64) + 라벨 "_같은 폴더_"
 *   - 중앙: mock 코드 `open("memo.txt", "w")` (fontSize 30 mono)
 *   - 하단: 작은 → 화살표 + 파일 아이콘 + `memo.txt` 라벨
 * - 9~11s: LowerThird (delaySec 3.4).
 */

import React from "react";
import {
  FadeIn,
  FileIcon,
  FolderIcon,
  LowerThird,
  PageBackground,
  PyToken,
} from "../primitives";
import { colors, fonts, radii } from "../theme";

const REVEAL = {
  card: 0.6,
  topRow: 1.0,
  codeMock: 1.4,
  bottomRow: 1.8,
  lowerThird: 3.4,
} as const;

export const Scene10: React.FC = () => {
  return (
    <PageBackground>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: 200,
        }}
      >
        <FadeIn delaySec={REVEAL.card} translateY={16}>
          <div
            style={{
              width: 880,
              padding: "44px 56px",
              background: colors.bgWhite,
              border: `2px dashed ${colors.inkSubtle}`,
              borderRadius: radii.card,
              opacity: 0.95,
              display: "flex",
              flexDirection: "column",
              gap: 36,
              fontFamily: fonts.sans,
            }}
          >
            {/* 상단: 폴더 + "같은 폴더" 라벨 */}
            <FadeIn delaySec={REVEAL.topRow} translateY={8}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                }}
              >
                <FolderIcon size={64} color={colors.inkMuted} delaySec={0} />
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 700,
                    color: colors.inkMuted,
                    letterSpacing: "-0.01em",
                  }}
                >
                  <span style={{ color: colors.ink, fontWeight: 800 }}>같은 폴더</span>{" "}
                  — 프로그램이 있는 자리
                </div>
              </div>
            </FadeIn>

            {/* 중앙: mock 코드 한 줄 */}
            <FadeIn delaySec={REVEAL.codeMock} translateY={8}>
              <div
                style={{
                  padding: "20px 28px",
                  background: colors.darkBg,
                  borderRadius: 12,
                  fontFamily: fonts.mono,
                  fontSize: 30,
                  fontWeight: 700,
                  letterSpacing: "-0.01em",
                  whiteSpace: "pre",
                  alignSelf: "flex-start",
                }}
              >
                <PyToken text="open" kind="func" />
                <PyToken text="(" kind="op" />
                <PyToken text={`"memo.txt"`} kind="string" />
                <PyToken text=", " kind="op" />
                <PyToken text={`"w"`} kind="string" />
                <PyToken text=")" kind="op" />
              </div>
            </FadeIn>

            {/* 하단: → + 파일 아이콘 + memo.txt */}
            <FadeIn delaySec={REVEAL.bottomRow} translateY={8}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 18,
                }}
              >
                <span
                  style={{
                    fontFamily: fonts.sans,
                    fontSize: 32,
                    color: colors.inkMuted,
                    fontWeight: 800,
                    lineHeight: 1,
                  }}
                >
                  →
                </span>
                <FileIcon
                  size={40}
                  color={colors.accent}
                  label="memo.txt"
                  delaySec={0}
                />
                <span
                  style={{
                    marginLeft: 8,
                    fontSize: 22,
                    fontWeight: 500,
                    color: colors.inkMuted,
                    fontStyle: "italic",
                    letterSpacing: "-0.01em",
                  }}
                >
                  여기에 생깁니다
                </span>
              </div>
            </FadeIn>
          </div>
        </FadeIn>
      </div>

      <LowerThird
        text={
          <span>
            <span style={{ color: colors.accentLight, fontWeight: 700 }}>
              프로그램이 있는 자리
            </span>{" "}
            에 파일이 생깁니다
          </span>
        }
        delaySec={REVEAL.lowerThird}
      />
    </PageBackground>
  );
};
