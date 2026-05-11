/**
 * Scene 12 — 잘못된 순서도 (오개념 2 정면 처리) (18s)
 *
 * - 화면 좌측: 잘못된 예시
 *     마름모 "5천 원 초과?" 에서 화살표가 "예" 방향으로만 나간 모습
 *     잘못된 마름모 위에 빨간 X 아이콘
 *     아래 라벨: "흐름이 막힘"
 * - 화면 우측: 올바른 예시
 *     마름모에서 "예" 와 "아니오" 두 화살표가 모두 나간 모습
 *     올바른 마름모 위에 violet ✓ 아이콘
 *     아래 라벨: "두 갈래 모두 있음"
 * - 두 그림 사이 회색 구분선
 *
 * 1강 scene-05 의 박스 비교 패턴과 동일.
 */

import React from "react";
import {
  CenteredStage,
  FadeIn,
  FlowchartArrow,
  FlowchartShape,
  PageBackground,
} from "../primitives";
import { colors, fonts, radii, shadows } from "../theme";

const PANEL_W = 540;
const PANEL_H = 540;

const DECISION_W = 220;
const DECISION_H = 110;
const PROC_W = 180;
const PROC_H = 60;

/** 잘못된 예시 패널. */
const WrongPanel: React.FC<{ delaySec: number }> = ({ delaySec }) => {
  // 도형 좌표 (panel 내부 기준)
  // 마름모 right vertex (decision.x + 110) 와 사각형 left edge (cardProc.x - 90)
  // 사이에 70px gap — 라벨("예") 60px width 가 들어가도 양 도형과 5px 씩 여유.
  const decision = { x: PANEL_W / 2 - 125, y: 200 };
  const cardProc = { x: PANEL_W / 2 + 145, y: 200 };
  return (
    <FadeIn delaySec={delaySec} translateY={20}>
      <div
        style={{
          width: PANEL_W,
          height: PANEL_H,
          background: colors.bgWhite,
          borderRadius: radii.card,
          border: `2px solid ${colors.danger}`,
          boxShadow: shadows.card,
          position: "relative",
          padding: "32px 28px",
        }}
      >
        <div
          style={{
            fontFamily: fonts.sans,
            fontSize: 22,
            fontWeight: 700,
            color: colors.danger,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            marginBottom: 8,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: colors.danger,
              color: "#ffffff",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              fontWeight: 800,
            }}
          >
            ×
          </span>
          잘못된 예시
        </div>

        {/* 도형 영역 */}
        <div style={{ position: "relative", height: PANEL_H - 200 }}>
          <div
            style={{
              position: "absolute",
              left: decision.x,
              top: decision.y,
              transform: "translate(-50%, -50%)",
            }}
          >
            <FlowchartShape
              variant="decision"
              label="5천 원 초과?"
              width={DECISION_W}
              height={DECISION_H}
              outline={colors.danger}
              fontSize={20}
            />
          </div>
          <div
            style={{
              position: "absolute",
              left: cardProc.x,
              top: cardProc.y,
              transform: "translate(-50%, -50%)",
            }}
          >
            <FlowchartShape
              variant="process"
              label="카드로 결제"
              width={PROC_W}
              height={PROC_H}
              outline={colors.danger}
              fontSize={18}
            />
          </div>
          <FlowchartArrow
            from={{ x: decision.x + DECISION_W / 2, y: decision.y }}
            to={{ x: cardProc.x - PROC_W / 2 - 2, y: cardProc.y }}
            label="예"
            labelPos={{
              x: (decision.x + DECISION_W / 2 + cardProc.x - PROC_W / 2) / 2,
              y: cardProc.y - 28,
            }}
            color={colors.danger}
          />
          {/* 아니오 방향이 끊긴 표시 — 마름모 아래로 점선 + X */}
          <div
            style={{
              position: "absolute",
              left: decision.x,
              top: decision.y + DECISION_H / 2 + 20,
              transform: "translateX(-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
            }}
          >
            <div
              style={{
                width: 4,
                height: 56,
                background: `repeating-linear-gradient(to bottom, ${colors.danger} 0 6px, transparent 6px 12px)`,
                opacity: 0.5,
              }}
            />
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: colors.bgWhite,
                border: `3px solid ${colors.danger}`,
                color: colors.danger,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                fontWeight: 800,
                fontFamily: fonts.sans,
              }}
            >
              ×
            </div>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 32,
            left: 0,
            right: 0,
            textAlign: "center",
            fontFamily: fonts.sans,
            fontSize: 26,
            fontWeight: 700,
            color: colors.danger,
            letterSpacing: "-0.01em",
          }}
        >
          흐름이 막힘
        </div>
      </div>
    </FadeIn>
  );
};

/** 올바른 예시 패널. */
const CorrectPanel: React.FC<{ delaySec: number }> = ({ delaySec }) => {
  // 마름모(decision) right vertex 와 사각형(cardProc) left edge 사이에 70px gap.
  // cashProc 는 마름모 아래 같은 x 축에 정렬, y 는 도형 영역(PANEL_H - 200 = 340)
  // 안에 bottom 이 들어오도록 310 으로 조정.
  const decision = { x: PANEL_W / 2 - 125, y: 180 };
  const cardProc = { x: PANEL_W / 2 + 145, y: 180 };
  const cashProc = { x: PANEL_W / 2 - 125, y: 310 };
  return (
    <FadeIn delaySec={delaySec} translateY={20}>
      <div
        style={{
          width: PANEL_W,
          height: PANEL_H,
          background: colors.bgWhite,
          borderRadius: radii.card,
          border: `2px solid ${colors.accent}`,
          boxShadow: shadows.card,
          position: "relative",
          padding: "32px 28px",
        }}
      >
        <div
          style={{
            fontFamily: fonts.sans,
            fontSize: 22,
            fontWeight: 700,
            color: colors.accentDeep,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            marginBottom: 8,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: colors.accent,
              color: "#ffffff",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              fontWeight: 800,
            }}
          >
            ✓
          </span>
          올바른 예시
        </div>

        <div style={{ position: "relative", height: PANEL_H - 200 }}>
          <div
            style={{
              position: "absolute",
              left: decision.x,
              top: decision.y,
              transform: "translate(-50%, -50%)",
            }}
          >
            <FlowchartShape
              variant="decision"
              label="5천 원 초과?"
              width={DECISION_W}
              height={DECISION_H}
              fontSize={20}
            />
          </div>
          <div
            style={{
              position: "absolute",
              left: cardProc.x,
              top: cardProc.y,
              transform: "translate(-50%, -50%)",
            }}
          >
            <FlowchartShape
              variant="process"
              label="카드로 결제"
              width={PROC_W}
              height={PROC_H}
              fontSize={18}
            />
          </div>
          <div
            style={{
              position: "absolute",
              left: cashProc.x,
              top: cashProc.y,
              transform: "translate(-50%, -50%)",
            }}
          >
            <FlowchartShape
              variant="process"
              label="현금으로 결제"
              width={PROC_W}
              height={PROC_H}
              fontSize={18}
            />
          </div>
          <FlowchartArrow
            from={{ x: decision.x + DECISION_W / 2, y: decision.y }}
            to={{ x: cardProc.x - PROC_W / 2 - 2, y: cardProc.y }}
            label="예"
            labelPos={{
              x: (decision.x + DECISION_W / 2 + cardProc.x - PROC_W / 2) / 2,
              y: cardProc.y - 28,
            }}
            color={colors.accent}
          />
          <FlowchartArrow
            from={{ x: decision.x, y: decision.y + DECISION_H / 2 }}
            to={{ x: cashProc.x, y: cashProc.y - PROC_H / 2 - 2 }}
            label="아니오"
            labelPos={{
              x: decision.x + 60,
              y: (decision.y + DECISION_H / 2 + cashProc.y - PROC_H / 2) / 2,
            }}
            color={colors.accent}
          />
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 32,
            left: 0,
            right: 0,
            textAlign: "center",
            fontFamily: fonts.sans,
            fontSize: 26,
            fontWeight: 700,
            color: colors.accentDeep,
            letterSpacing: "-0.01em",
          }}
        >
          두 갈래 모두 있음
        </div>
      </div>
    </FadeIn>
  );
};

export const Scene12: React.FC = () => {
  return (
    <PageBackground>
      <CenteredStage paddingY={100}>
        <FadeIn delaySec={0.1} translateY={6}>
          <div
            style={{
              fontFamily: fonts.sans,
              fontSize: 30,
              fontWeight: 600,
              color: colors.accentDeep,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              marginBottom: 36,
            }}
          >
            자주 보는 실수
          </div>
        </FadeIn>
        <div
          style={{
            display: "flex",
            alignItems: "stretch",
            gap: 60,
          }}
        >
          <WrongPanel delaySec={0.4} />
          <div
            style={{
              width: 2,
              background: colors.border,
            }}
          />
          <CorrectPanel delaySec={1.2} />
        </div>
      </CenteredStage>
    </PageBackground>
  );
};
