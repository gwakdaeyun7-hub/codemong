/**
 * Scene 9 — 코드를 쓰는 도구, VS Code (16s)
 *
 * - 좌측: "Python" 박스 (톤 다운, opacity 0.5)
 * - 우측: "VS Code" 박스 (강조, violet-500 외곽선)
 * - 두 박스 사이 화살표: "+ 도구"
 * - 우측 박스 아래 작은 텍스트: "code.visualstudio.com"
 *
 * Scene 5 의 두 박스 재등장 — 학습자의 mental model 강화.
 */

import React from "react";
import { Card, CenteredStage, FadeIn, PageBackground } from "../primitives";
import { colors, fonts, radii } from "../theme";

export const Scene09: React.FC = () => {
  return (
    <PageBackground>
      <CenteredStage>
        <FadeIn delaySec={0.2} translateY={8}>
          <h2
            style={{
              margin: 0,
              fontFamily: fonts.sans,
              fontSize: 52,
              fontWeight: 800,
              color: colors.ink,
              letterSpacing: "-0.02em",
              marginBottom: 64,
            }}
          >
            코드를 쓰는 도구가 따로 필요합니다
          </h2>
        </FadeIn>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 36,
          }}
        >
          {/* Python (toned down) */}
          <FadeIn delaySec={0.5} translateY={16}>
            <Card style={{ width: 360, padding: "48px 36px", textAlign: "center", opacity: 0.5 }}>
              <div
                style={{
                  fontFamily: fonts.mono,
                  fontSize: 56,
                  fontWeight: 800,
                  color: colors.ink,
                  letterSpacing: "-0.02em",
                  marginBottom: 10,
                }}
              >
                Python
              </div>
              <div
                style={{
                  fontFamily: fonts.sans,
                  fontSize: 24,
                  color: colors.inkMuted,
                  fontWeight: 500,
                }}
              >
                언어
              </div>
            </Card>
          </FadeIn>
          {/* + 도구 */}
          <FadeIn delaySec={0.9}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
              }}
            >
              <div
                style={{
                  fontFamily: fonts.sans,
                  fontSize: 36,
                  fontWeight: 800,
                  color: colors.accent,
                }}
              >
                + 도구
              </div>
              <div
                style={{
                  width: 120,
                  height: 4,
                  borderRadius: 2,
                  background: colors.accent,
                }}
              />
            </div>
          </FadeIn>
          {/* VS Code (강조) */}
          <FadeIn delaySec={1.2} translateY={16}>
            <div style={{ position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  inset: -8,
                  borderRadius: radii.card + 8,
                  border: `4px solid ${colors.accent}`,
                  pointerEvents: "none",
                }}
              />
              <Card style={{ width: 380, padding: "48px 36px", textAlign: "center" }}>
                <div
                  style={{
                    fontFamily: fonts.mono,
                    fontSize: 56,
                    fontWeight: 800,
                    color: colors.ink,
                    letterSpacing: "-0.02em",
                    marginBottom: 10,
                  }}
                >
                  VS Code
                </div>
                <div
                  style={{
                    fontFamily: fonts.sans,
                    fontSize: 24,
                    color: colors.accentDeep,
                    fontWeight: 600,
                  }}
                >
                  에디터 (도구)
                </div>
              </Card>
              <div
                style={{
                  textAlign: "center",
                  marginTop: 18,
                  fontFamily: fonts.mono,
                  fontSize: 22,
                  color: colors.inkMuted,
                }}
              >
                code.visualstudio.com
              </div>
            </div>
          </FadeIn>
        </div>
      </CenteredStage>
    </PageBackground>
  );
};
