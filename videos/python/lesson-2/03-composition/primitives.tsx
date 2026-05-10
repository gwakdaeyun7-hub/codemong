/**
 * Shared visual primitives for Lesson 2.
 *
 * Base primitives (FadeIn / TypeOn / Card / CourseLabel / PageBackground /
 * AccentUnderline / LowerThird / CenteredStage) are duplicated from
 * lesson-1 for visual continuity across the season — see
 * `videos/python/lesson-1/03-composition/primitives.tsx`.
 *
 * Lesson-2-specific primitives (further down):
 *   - NoteBox       — 자연어를 적는 노트 박스 (scene 8, 9)
 *   - PseudocodeBox — 의사코드 박스 (scene 10)
 *   - FlowchartShape — 순서도 4기호 (둥근 사각형 / 사각형 / 마름모 / 평행사변형)
 *   - FlowchartArrow — 순서도 화살표 (라벨 옵션 — 예/아니오)
 *   - ConceptCard   — 자연어/의사코드/순서도 3박스 (scene 4~6 mental model)
 *
 * All animations are frame-driven via useCurrentFrame() + interpolate().
 * No CSS transitions / Tailwind animate-* classes — those break Remotion renders.
 */

import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts, radii, shadows } from "./theme";

const easeOutCubic = Easing.bezier(0.16, 1, 0.3, 1);
const easeInOut = Easing.bezier(0.45, 0, 0.55, 1);

/* ------------------------------------------------------------------ */
/* FadeIn — opacity 0→1 with optional translateY                       */
/* ------------------------------------------------------------------ */

export const FadeIn: React.FC<{
  children: React.ReactNode;
  delaySec?: number;
  durationSec?: number;
  translateY?: number;
  style?: React.CSSProperties;
}> = ({ children, delaySec = 0, durationSec = 0.6, translateY = 12, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = delaySec * fps;
  const end = start + durationSec * fps;

  const progress = interpolate(frame, [start, end], [0, 1], {
    easing: easeOutCubic,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        opacity: progress,
        transform: `translateY(${(1 - progress) * translateY}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* TypeOn — char-by-char string slicing (per text-animations.md)       */
/* ------------------------------------------------------------------ */

export const TypeOn: React.FC<{
  text: string;
  delaySec?: number;
  msPerChar?: number;
  caret?: boolean;
  style?: React.CSSProperties;
}> = ({ text, delaySec = 0, msPerChar = 50, caret = false, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = delaySec * fps;
  const framesPerChar = (msPerChar / 1000) * fps;
  const end = start + framesPerChar * text.length;

  const charCount = Math.floor(
    interpolate(frame, [start, end], [0, text.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
  const visible = text.slice(0, charCount);
  const caretOn = caret && Math.floor((frame / fps) * 2) % 2 === 0;

  return (
    <span style={style}>
      {visible}
      {caretOn ? <span style={{ opacity: 0.7 }}>▍</span> : null}
    </span>
  );
};

/* ------------------------------------------------------------------ */
/* Card — rounded-2xl + soft shadow, the CodeMong card surface         */
/* ------------------------------------------------------------------ */

export const Card: React.FC<{
  children: React.ReactNode;
  variant?: "light" | "dark" | "accent";
  style?: React.CSSProperties;
}> = ({ children, variant = "light", style }) => {
  const surface =
    variant === "dark"
      ? { background: colors.darkBg, color: colors.darkInk, border: `1px solid ${colors.darkBg2}` }
      : variant === "accent"
        ? {
            background: colors.accentSoft,
            color: colors.accentInk,
            border: `1px solid ${colors.accent}`,
          }
        : { background: colors.bgWhite, color: colors.ink, border: `1px solid ${colors.border}` };

  return (
    <div
      style={{
        borderRadius: radii.card,
        padding: 32,
        boxShadow: variant === "dark" ? shadows.cardSoft : shadows.card,
        fontFamily: fonts.sans,
        ...surface,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* CourseLabel — "파이썬 기초 · 2강" pill                                */
/* ------------------------------------------------------------------ */

export const CourseLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 16px",
        borderRadius: radii.pill,
        background: colors.accentSoft,
        color: colors.accentInk,
        fontFamily: fonts.sans,
        fontSize: 22,
        fontWeight: 600,
        letterSpacing: "-0.01em",
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: colors.accent,
        }}
      />
      {children}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* PageBackground — soft zinc-50 page with subtle radial accent        */
/* ------------------------------------------------------------------ */

export const PageBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: colors.bg,
        fontFamily: fonts.sans,
        color: colors.ink,
        overflow: "hidden",
      }}
    >
      {/* subtle violet glow, top-right */}
      <div
        style={{
          position: "absolute",
          top: -200,
          right: -200,
          width: 800,
          height: 800,
          borderRadius: "50%",
          background:
            "radial-gradient(closest-side, rgba(139, 92, 246, 0.10), rgba(139, 92, 246, 0))",
          filter: "blur(20px)",
        }}
      />
      {children}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* AccentUnderline — short violet bar used under titles                */
/* ------------------------------------------------------------------ */

export const AccentUnderline: React.FC<{
  width?: number;
  delaySec?: number;
  durationSec?: number;
}> = ({ width = 120, delaySec = 0.3, durationSec = 0.6 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = delaySec * fps;
  const end = start + durationSec * fps;
  const grow = interpolate(frame, [start, end], [0, 1], {
    easing: easeOutCubic,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        width: width * grow,
        height: 6,
        borderRadius: 3,
        background: `linear-gradient(90deg, ${colors.accent}, ${colors.accentDeep})`,
      }}
    />
  );
};

/* ------------------------------------------------------------------ */
/* LowerThird — bottom-center info strip (design element, not captions)*/
/* ------------------------------------------------------------------ */

export const LowerThird: React.FC<{
  text: string;
  delaySec?: number;
}> = ({ text, delaySec = 0.4 }) => {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 220,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      <FadeIn delaySec={delaySec} translateY={8}>
        <div
          style={{
            padding: "14px 28px",
            borderRadius: radii.pill,
            background: "rgba(24, 24, 27, 0.92)",
            color: "#ffffff",
            fontFamily: fonts.sans,
            fontSize: 26,
            fontWeight: 500,
            letterSpacing: "-0.01em",
            boxShadow: shadows.card,
          }}
        >
          {text}
        </div>
      </FadeIn>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* CenteredStage — vertically/horizontally centers content             */
/* ------------------------------------------------------------------ */

export const CenteredStage: React.FC<{
  children: React.ReactNode;
  paddingY?: number;
}> = ({ children, paddingY = 120 }) => {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: `${paddingY}px 96px`,
        textAlign: "center",
      }}
    >
      {children}
    </div>
  );
};

/* ================================================================== */
/* LESSON-2-SPECIFIC PRIMITIVES                                        */
/* ================================================================== */

/* ------------------------------------------------------------------ */
/* ConceptCard — 자연어/의사코드/순서도 3 mental-model 카드             */
/*   (scene 4 박스 형태, scene 5 카드 확대, scene 6 강조/톤다운)       */
/* ------------------------------------------------------------------ */

export const ConceptCard: React.FC<{
  label: string;
  body?: string;
  glyph: string;
  highlighted?: boolean;
  dimmed?: boolean;
  width?: number;
  style?: React.CSSProperties;
}> = ({ label, body, glyph, highlighted = false, dimmed = false, width = 360, style }) => {
  const opacity = dimmed ? 0.45 : 1;
  return (
    <div
      style={{
        width,
        padding: "36px 32px",
        borderRadius: radii.card,
        background: colors.bgWhite,
        border: highlighted
          ? `3px solid ${colors.accent}`
          : `1px solid ${colors.border}`,
        boxShadow: highlighted ? shadows.card : shadows.cardSoft,
        textAlign: "center",
        opacity,
        transform: highlighted ? "scale(1.04)" : "scale(1)",
        ...style,
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          margin: "0 auto 18px",
          borderRadius: 16,
          background: colors.accentSoft,
          color: colors.accentDeep,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 38,
          fontWeight: 700,
        }}
      >
        {glyph}
      </div>
      <div
        style={{
          fontFamily: fonts.sans,
          fontSize: 36,
          fontWeight: 800,
          color: colors.ink,
          letterSpacing: "-0.02em",
          marginBottom: body ? 12 : 0,
        }}
      >
        {label}
      </div>
      {body ? (
        <div
          style={{
            fontFamily: fonts.sans,
            fontSize: 22,
            fontWeight: 500,
            color: colors.inkMuted,
            letterSpacing: "-0.01em",
            lineHeight: 1.4,
          }}
        >
          {body}
        </div>
      ) : null}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* NoteBox — 자연어 풀어쓰기용 노트 박스 (scene 8, 9)                   */
/*   살짝 종이 질감 (warmer cream tint), 좌측 점선 세로줄 (노트 라인)   */
/* ------------------------------------------------------------------ */

export const NoteBox: React.FC<{
  title?: string;
  children: React.ReactNode;
  width?: number;
  dimmed?: boolean;
  style?: React.CSSProperties;
}> = ({ title = "자연어", children, width = 720, dimmed = false, style }) => {
  return (
    <div
      style={{
        width,
        padding: "32px 40px 36px",
        borderRadius: radii.card,
        background: "#fffdf7", // very subtle paper cream
        border: `1px solid ${colors.border}`,
        boxShadow: shadows.cardSoft,
        opacity: dimmed ? 0.5 : 1,
        position: "relative",
        ...style,
      }}
    >
      {/* 좌측 노트라인 표시 */}
      <div
        style={{
          position: "absolute",
          top: 24,
          bottom: 24,
          left: 24,
          width: 3,
          background:
            "repeating-linear-gradient(to bottom, rgba(245, 158, 11, 0.4) 0 6px, transparent 6px 12px)",
          borderRadius: 2,
        }}
      />
      <div
        style={{
          fontFamily: fonts.sans,
          fontSize: 22,
          fontWeight: 700,
          color: colors.accentDeep,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          marginBottom: 18,
          paddingLeft: 22,
        }}
      >
        {title}
      </div>
      <div style={{ paddingLeft: 22 }}>{children}</div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* PseudocodeBox — 의사코드 박스 (scene 10)                            */
/*   흰 배경 + 모노스페이스, 살짝 코드-에디터 느낌이지만 어둡지 않게      */
/* ------------------------------------------------------------------ */

export const PseudocodeBox: React.FC<{
  title?: string;
  warning?: React.ReactNode; // "주의: 파이썬이 읽는 코드가 아님" 같은 좌상단 라벨
  children: React.ReactNode;
  width?: number;
  style?: React.CSSProperties;
}> = ({ title = "의사코드", warning, children, width = 720, style }) => {
  return (
    <div
      style={{
        width,
        padding: 0,
        borderRadius: radii.card,
        background: colors.bgWhite,
        border: `1px solid ${colors.border}`,
        boxShadow: shadows.card,
        overflow: "hidden",
        ...style,
      }}
    >
      {/* header strip */}
      <div
        style={{
          padding: "14px 24px",
          borderBottom: `1px solid ${colors.border}`,
          background: colors.borderSoft,
          display: "flex",
          alignItems: "center",
          gap: 16,
          fontFamily: fonts.sans,
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            color: colors.accentDeep,
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: 2,
              background: colors.accent,
            }}
          />
          {title}
        </span>
        {warning ? (
          <span
            style={{
              marginLeft: "auto",
              fontSize: 18,
              fontWeight: 500,
              color: colors.inkMuted,
              fontStyle: "italic",
            }}
          >
            {warning}
          </span>
        ) : null}
      </div>
      <div
        style={{
          padding: "32px 36px",
          fontFamily: fonts.mono,
          fontSize: 28,
          color: colors.ink,
          lineHeight: 1.7,
        }}
      >
        {children}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* FlowchartShape — 순서도 4기호                                       */
/*   variant: terminal (둥근 사각형 = 시작/끝)                          */
/*           process  (사각형 = 처리)                                  */
/*           decision (마름모 = 판단)                                  */
/*           io       (평행사변형 = 입출력)                             */
/*                                                                    */
/*   라벨은 도형 내부 텍스트, color 는 outline (default violet-500)     */
/* ------------------------------------------------------------------ */

export type FlowchartVariant = "terminal" | "process" | "decision" | "io";

export const FlowchartShape: React.FC<{
  variant: FlowchartVariant;
  label: string;
  width?: number;
  height?: number;
  outline?: string;
  fill?: string;
  textColor?: string;
  fontSize?: number;
  style?: React.CSSProperties;
}> = ({
  variant,
  label,
  width = 220,
  height = 90,
  outline = colors.accent,
  fill = colors.bgWhite,
  textColor = colors.ink,
  fontSize = 22,
  style,
}) => {
  // SVG 로 렌더하면 마름모/평행사변형의 외곽선 정밀도가 좋음
  const stroke = 3;
  const labelStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: fonts.sans,
    fontSize,
    fontWeight: 700,
    color: textColor,
    letterSpacing: "-0.01em",
    textAlign: "center",
    padding: "0 12px",
    pointerEvents: "none",
  };

  const shape = (() => {
    if (variant === "terminal") {
      const radius = height / 2;
      return (
        <svg width={width} height={height}>
          <rect
            x={stroke / 2}
            y={stroke / 2}
            width={width - stroke}
            height={height - stroke}
            rx={radius}
            ry={radius}
            fill={fill}
            stroke={outline}
            strokeWidth={stroke}
          />
        </svg>
      );
    }
    if (variant === "process") {
      return (
        <svg width={width} height={height}>
          <rect
            x={stroke / 2}
            y={stroke / 2}
            width={width - stroke}
            height={height - stroke}
            rx={6}
            ry={6}
            fill={fill}
            stroke={outline}
            strokeWidth={stroke}
          />
        </svg>
      );
    }
    if (variant === "decision") {
      const cx = width / 2;
      const cy = height / 2;
      return (
        <svg width={width} height={height}>
          <polygon
            points={`${cx},${stroke / 2} ${width - stroke / 2},${cy} ${cx},${
              height - stroke / 2
            } ${stroke / 2},${cy}`}
            fill={fill}
            stroke={outline}
            strokeWidth={stroke}
            strokeLinejoin="round"
          />
        </svg>
      );
    }
    // io: 평행사변형
    const skew = 24;
    return (
      <svg width={width} height={height}>
        <polygon
          points={`${skew + stroke / 2},${stroke / 2} ${width - stroke / 2},${
            stroke / 2
          } ${width - skew - stroke / 2},${height - stroke / 2} ${stroke / 2},${
            height - stroke / 2
          }`}
          fill={fill}
          stroke={outline}
          strokeWidth={stroke}
          strokeLinejoin="round"
        />
      </svg>
    );
  })();

  return (
    <div
      style={{
        width,
        height,
        position: "relative",
        ...style,
      }}
    >
      {shape}
      <div style={labelStyle}>{label}</div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* FlowchartArrow — 화살표 (수직/수평/꺾임), 라벨 옵션 ("예"/"아니오")  */
/* ------------------------------------------------------------------ */

export const FlowchartArrow: React.FC<{
  /** 화살표 시작점 (svg 좌표) */
  from: { x: number; y: number };
  /** 화살표 끝점 (svg 좌표) — 머리가 여기에 그려짐 */
  to: { x: number; y: number };
  /** 꺾임 점 (있으면 from→bend→to 의 L자 경로) */
  bend?: { x: number; y: number };
  label?: string;
  labelPos?: { x: number; y: number };
  color?: string;
  strokeWidth?: number;
  style?: React.CSSProperties;
}> = ({
  from,
  to,
  bend,
  label,
  labelPos,
  color = colors.inkMuted,
  strokeWidth = 2.5,
  style,
}) => {
  const path = bend
    ? `M ${from.x} ${from.y} L ${bend.x} ${bend.y} L ${to.x} ${to.y}`
    : `M ${from.x} ${from.y} L ${to.x} ${to.y}`;

  return (
    <svg
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        overflow: "visible",
        ...style,
      }}
    >
      <defs>
        <marker
          id={`arrowhead-${color.replace(/[^a-z0-9]/gi, "")}`}
          markerWidth="10"
          markerHeight="10"
          refX="8"
          refY="5"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill={color} />
        </marker>
      </defs>
      <path
        d={path}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        markerEnd={`url(#arrowhead-${color.replace(/[^a-z0-9]/gi, "")})`}
      />
      {label && labelPos ? (
        <foreignObject x={labelPos.x - 30} y={labelPos.y - 14} width={60} height={28}>
          <div
            style={{
              fontFamily: fonts.sans,
              fontSize: 18,
              fontWeight: 700,
              color: colors.accentDeep,
              background: colors.bgWhite,
              border: `1px solid ${colors.border}`,
              borderRadius: radii.pill,
              padding: "2px 10px",
              textAlign: "center",
              whiteSpace: "nowrap",
            }}
          >
            {label}
          </div>
        </foreignObject>
      ) : null}
    </svg>
  );
};

/* ------------------------------------------------------------------ */
/* StaticArrow — 박스 사이 단순 가로 화살표 (scene 4 등)                */
/* ------------------------------------------------------------------ */

export const StaticArrow: React.FC<{
  width?: number;
  color?: string;
  thickness?: number;
}> = ({ width = 80, color = colors.accent, thickness = 4 }) => {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 2,
      }}
    >
      <div
        style={{
          width,
          height: thickness,
          background: color,
          borderRadius: thickness / 2,
        }}
      />
      <div
        style={{
          width: 0,
          height: 0,
          borderLeft: `${thickness * 3}px solid ${color}`,
          borderTop: `${thickness * 1.6}px solid transparent`,
          borderBottom: `${thickness * 1.6}px solid transparent`,
        }}
      />
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* PersonGlyph / ComputerGlyph — 단순화된 시각 신호 아이콘              */
/*   scene 8 (사람), scene 9 (컴퓨터+말풍선?)                          */
/* ------------------------------------------------------------------ */

export const PersonGlyph: React.FC<{ size?: number; color?: string }> = ({
  size = 56,
  color = colors.accentDeep,
}) => {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56">
      <circle cx="28" cy="18" r="9" fill={color} />
      <path
        d="M 12 50 Q 12 32 28 32 Q 44 32 44 50"
        fill={color}
        stroke="none"
      />
    </svg>
  );
};

export const ComputerGlyph: React.FC<{
  size?: number;
  color?: string;
  withQuestion?: boolean;
}> = ({ size = 64, color = colors.inkSoft, withQuestion = false }) => {
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 64 64">
        <rect
          x={6}
          y={10}
          width={52}
          height={34}
          rx={4}
          fill={colors.bgWhite}
          stroke={color}
          strokeWidth={3}
        />
        <rect x={22} y={48} width={20} height={3} fill={color} />
        <rect x={14} y={51} width={36} height={3} rx={1.5} fill={color} />
      </svg>
      {withQuestion ? (
        <div
          style={{
            position: "absolute",
            top: -18,
            right: -18,
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: colors.bgWhite,
            border: `2.5px solid ${colors.danger}`,
            color: colors.danger,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: fonts.sans,
            fontSize: 22,
            fontWeight: 800,
            boxShadow: shadows.cardSoft,
          }}
        >
          ?
        </div>
      ) : null}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* BeverageGlyph — 음료수 페트병 단순화 (scene 7)                      */
/* ------------------------------------------------------------------ */

export const BeverageGlyph: React.FC<{ size?: number }> = ({ size = 96 }) => {
  return (
    <svg width={size} height={size * 1.4} viewBox="0 0 96 134">
      {/* 뚜껑 */}
      <rect x={36} y={4} width={24} height={14} rx={3} fill={colors.accentDeep} />
      {/* 목 */}
      <rect x={38} y={18} width={20} height={10} fill={colors.accentDeep} />
      {/* 본체 */}
      <path
        d="M 28 30 Q 22 38 22 50 L 22 118 Q 22 128 32 128 L 64 128 Q 74 128 74 118 L 74 50 Q 74 38 68 30 Z"
        fill={colors.accentSoft}
        stroke={colors.accent}
        strokeWidth={3}
      />
      {/* 라벨 */}
      <rect
        x={28}
        y={62}
        width={40}
        height={28}
        rx={3}
        fill={colors.accent}
        opacity={0.85}
      />
    </svg>
  );
};

/* ------------------------------------------------------------------ */
/* easings re-export for scene files                                   */
/* ------------------------------------------------------------------ */

export { easeOutCubic, easeInOut };
