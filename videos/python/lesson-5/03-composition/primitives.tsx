/**
 * Shared visual primitives for Lesson 5.
 *
 * Base primitives (FadeIn / TypeOn / Card / CourseLabel / PageBackground /
 * AccentUnderline / LowerThird / CenteredStage / PyToken / CodePanel /
 * CodeLine / ConsolePanel / ConsoleLine / VarBox / DashedHArrow / LabelArrow)
 * are duplicated from lesson-3 for visual continuity across the season.
 *
 * Lesson-5-specific primitives (further down):
 *   - IndentGuide        — 코드 패널 좌측의 들여쓰기 깊이별 세로 가이드 (1단/2단)
 *   - DecisionDiamond    — 2강 회상용 분기 마름모 SVG 도형
 *   - FlowArrow          — 코드 분기 흐름 화살표 (위→아래 진행, 라벨 옵션)
 *   - QuestionMark       — Active recall 정적 동안의 물음표
 *   - ComparisonBox      — 비교식 박스 (좌측 식 + 우측 True/False 라벨, scene-03)
 *   - BranchScenarioCard — 3분기 시나리오 카드 (scene-07)
 *   - ContainmentBoxes   — 박스 안 박스 (scene-11, 중첩 mental model)
 *   - InlineCallout      — 코드 옆에 떠오르는 작은 콜아웃 (scene-08 elif 한 단어)
 *   - BranchLabel        — 코드 우측에 붙는 True/False 라벨 (scene-09, 10, 13)
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
/* Card — rounded-2xl + soft shadow                                    */
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
/* CourseLabel — "파이썬 기초 · 5강" pill                                */
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
/* AccentUnderline — short violet bar under titles                      */
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
/* LowerThird — bottom-center info strip                                */
/* ------------------------------------------------------------------ */

export const LowerThird: React.FC<{
  text: React.ReactNode;
  delaySec?: number;
}> = ({ text, delaySec = 0.4 }) => {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 80,
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
/* CenteredStage — vertically/horizontally centers content              */
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
/* CODE / CONSOLE PRIMITIVES (from lesson-3, identical contract)       */
/* ================================================================== */

export type PyTokenKind = "keyword" | "string" | "number" | "name" | "func" | "op" | "text";

const tokenColor: Record<PyTokenKind, string> = {
  keyword: colors.syntaxKeyword,
  string: colors.syntaxString,
  number: colors.syntaxNumber,
  name: colors.syntaxName,
  func: colors.syntaxFunc,
  op: colors.syntaxOp,
  text: colors.darkInk,
};

export const PyToken: React.FC<{
  text: string;
  kind?: PyTokenKind;
  highlight?: boolean;
  style?: React.CSSProperties;
}> = ({ text, kind = "text", highlight = false, style }) => {
  return (
    <span
      style={{
        color: tokenColor[kind],
        fontFamily: fonts.mono,
        ...(highlight
          ? {
              background: "rgba(196, 181, 253, 0.16)",
              borderRadius: 4,
              padding: "0 2px",
              outline: `1px solid ${colors.accentLight}`,
            }
          : null),
        ...style,
      }}
    >
      {text}
    </span>
  );
};

/**
 * CodePanel — 어두운 코드 에디터 패널.
 *
 * lesson-5 에서는 indentGuides prop 으로 깊이별 세로 가이드 라인 활성화 가능.
 * (scene-04 / scene-08 / scene-12 에서 사용).
 */
export const CodePanel: React.FC<{
  fileName?: string;
  children: React.ReactNode;
  width?: number;
  height?: number | string;
  style?: React.CSSProperties;
}> = ({ fileName, children, width = 720, height, style }) => {
  return (
    <div
      style={{
        width,
        height,
        background: colors.darkBg,
        borderRadius: 14,
        border: `1px solid ${colors.darkBg2}`,
        boxShadow: shadows.card,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        fontFamily: fonts.mono,
        ...style,
      }}
    >
      <div
        style={{
          height: 40,
          background: "#1c1c20",
          borderBottom: `1px solid ${colors.darkBg2}`,
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          gap: 10,
        }}
      >
        <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#ef4444" }} />
        <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#f59e0b" }} />
        <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#22c55e" }} />
        {fileName ? (
          <span
            style={{
              marginLeft: 12,
              color: colors.darkMuted,
              fontFamily: fonts.sans,
              fontSize: 16,
            }}
          >
            {fileName}
          </span>
        ) : null}
      </div>
      <div
        style={{
          flex: 1,
          padding: "20px 22px",
          color: colors.darkInk,
          fontSize: 28,
          lineHeight: 1.7,
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export const CodeLine: React.FC<{
  lineNumber?: number;
  revealAtSec?: number;
  dimmed?: boolean;
  highlighted?: boolean;
  highlightDurationSec?: number;
  children: React.ReactNode;
}> = ({
  lineNumber,
  revealAtSec = 0,
  dimmed = false,
  highlighted = false,
  highlightDurationSec = 0.5,
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = revealAtSec * fps;
  const reveal = interpolate(frame, [start, start + 0.4 * fps], [0, 1], {
    easing: easeOutCubic,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const baseOpacity = dimmed ? 0.4 : 1;
  const opacity = reveal * baseOpacity;
  const ty = (1 - reveal) * 8;

  const hiOn = highlighted
    ? interpolate(
        frame,
        [
          start,
          start + 0.2 * fps,
          (revealAtSec + highlightDurationSec) * fps,
          (revealAtSec + highlightDurationSec + 0.4) * fps,
        ],
        [0, 1, 1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
      )
    : 0;

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${ty}px)`,
        display: "flex",
        alignItems: "center",
        gap: 18,
        position: "relative",
      }}
    >
      {highlighted ? (
        <div
          style={{
            position: "absolute",
            left: -14,
            top: 4,
            bottom: 4,
            width: 4,
            borderRadius: 2,
            background: colors.accent,
            opacity: hiOn,
          }}
        />
      ) : null}
      {typeof lineNumber === "number" ? (
        <span
          style={{
            color: colors.darkMuted,
            opacity: 0.55,
            minWidth: 22,
            textAlign: "right",
            fontVariantNumeric: "tabular-nums",
            userSelect: "none",
          }}
        >
          {lineNumber}
        </span>
      ) : null}
      <span style={{ whiteSpace: "pre" }}>{children}</span>
    </div>
  );
};

export const ConsolePanel: React.FC<{
  title?: string;
  children: React.ReactNode;
  width?: number;
  height?: number | string;
  style?: React.CSSProperties;
}> = ({ title = "출력 결과", children, width = 720, height, style }) => {
  return (
    <div
      style={{
        width,
        height,
        background: colors.darkBg2,
        borderRadius: 14,
        border: `1px solid ${colors.darkBg2}`,
        boxShadow: shadows.card,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        fontFamily: fonts.mono,
        ...style,
      }}
    >
      <div
        style={{
          height: 40,
          background: "#222226",
          borderBottom: `1px solid ${colors.darkBg2}`,
          display: "flex",
          alignItems: "center",
          padding: "0 18px",
          gap: 10,
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
        <span
          style={{
            color: colors.darkAccent,
            fontFamily: fonts.sans,
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          {title}
        </span>
      </div>
      <div
        style={{
          flex: 1,
          padding: "20px 24px",
          color: colors.darkInk,
          fontSize: 30,
          lineHeight: 1.7,
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export const ConsoleLine: React.FC<{
  revealAtSec?: number;
  dimmed?: boolean;
  children: React.ReactNode;
}> = ({ revealAtSec = 0, dimmed = false, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = revealAtSec * fps;
  const reveal = interpolate(frame, [start, start + 0.4 * fps], [0, 1], {
    easing: easeOutCubic,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        opacity: reveal * (dimmed ? 0.4 : 1),
        transform: `translateY(${(1 - reveal) * 6}px)`,
        whiteSpace: "pre",
      }}
    >
      {children}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* VarBox — 변수 박스 (위에 이름표 라벨 + 박스 안에 값)                  */
/* ------------------------------------------------------------------ */

export const VarBox: React.FC<{
  label: string;
  labelDelaySec?: number;
  boxDelaySec?: number;
  highlighted?: boolean;
  dimmed?: boolean;
  children?: React.ReactNode;
  width?: number;
  height?: number;
  labelFontSize?: number;
  valueFontSize?: number;
  labelDimmed?: boolean;
  style?: React.CSSProperties;
}> = ({
  label,
  labelDelaySec = 0,
  boxDelaySec = 0.2,
  highlighted = false,
  dimmed = false,
  labelDimmed = false,
  children,
  width = 240,
  height = 140,
  labelFontSize = 24,
  valueFontSize = 36,
  style,
}) => {
  const baseOpacity = dimmed ? 0.5 : 1;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
        opacity: baseOpacity,
        ...style,
      }}
    >
      <FadeIn
        delaySec={labelDelaySec}
        durationSec={0.5}
        translateY={-14}
        style={{
          opacity: labelDimmed ? 0.4 : undefined,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "6px 16px",
            borderRadius: radii.pill,
            background: colors.accentSoft,
            color: colors.accentInk,
            fontFamily: fonts.mono,
            fontSize: labelFontSize,
            fontWeight: 700,
            letterSpacing: "-0.01em",
            border: `1px solid ${colors.accent}`,
          }}
        >
          {label}
        </div>
      </FadeIn>

      <FadeIn delaySec={boxDelaySec} translateY={10}>
        <div
          style={{
            width,
            height,
            borderRadius: 18,
            background: colors.bgWhite,
            border: highlighted ? `3px solid ${colors.accent}` : `2px solid ${colors.border}`,
            boxShadow: highlighted ? shadows.card : shadows.cardSoft,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "10px 16px",
            fontFamily: fonts.mono,
            fontSize: valueFontSize,
            fontWeight: 700,
            color: colors.ink,
            letterSpacing: "-0.01em",
            textAlign: "center",
            overflow: "hidden",
          }}
        >
          {children}
        </div>
      </FadeIn>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* DashedHArrow — 가로 점선 화살표                                       */
/* ------------------------------------------------------------------ */

export const DashedHArrow: React.FC<{
  width: number;
  delaySec?: number;
  durationSec?: number;
  color?: string;
  thickness?: number;
}> = ({ width, delaySec = 0, durationSec = 0.5, color = colors.inkSubtle, thickness = 3 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = delaySec * fps;
  const end = start + durationSec * fps;
  const grow = interpolate(frame, [start, end], [0, 1], {
    easing: easeOutCubic,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const drawn = width * grow;

  return (
    <div
      style={{
        position: "relative",
        width,
        height: thickness * 4,
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: drawn,
          height: thickness,
          background: `repeating-linear-gradient(to right, ${color} 0 10px, transparent 10px 20px)`,
          opacity: 0.85,
          borderRadius: 2,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: drawn - 2,
          top: "50%",
          transform: "translateY(-50%)",
          width: 0,
          height: 0,
          borderLeft: `${thickness * 3}px solid ${color}`,
          borderTop: `${thickness * 1.6}px solid transparent`,
          borderBottom: `${thickness * 1.6}px solid transparent`,
          opacity: grow > 0.95 ? 1 : 0,
        }}
      />
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* LabelArrow — 코드 토큰 위로 떨어지는 화살표 + 라벨                   */
/* ------------------------------------------------------------------ */

export const LabelArrow: React.FC<{
  label: string;
  delaySec?: number;
  color?: string;
  emphasize?: boolean;
}> = ({ label, delaySec = 0, color, emphasize = true }) => {
  const c = color ?? (emphasize ? colors.accentDeep : colors.inkMuted);
  return (
    <FadeIn delaySec={delaySec} durationSec={0.4} translateY={-10}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
        }}
      >
        <div
          style={{
            padding: "4px 12px",
            borderRadius: radii.pill,
            background: emphasize ? colors.accentSoft : colors.borderSoft,
            color: c,
            fontFamily: fonts.sans,
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: "-0.01em",
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </div>
        <div
          style={{
            color: c,
            fontSize: 22,
            lineHeight: 1,
            fontWeight: 800,
          }}
        >
          ↓
        </div>
      </div>
    </FadeIn>
  );
};

/* ================================================================== */
/* LESSON-5-SPECIFIC PRIMITIVES                                        */
/* ================================================================== */

/* ------------------------------------------------------------------ */
/* IndentGuide — 코드 패널 좌측의 들여쓰기 깊이별 세로 가이드            */
/*                                                                     */
/* 코드 패널 안에서 absolute 로 배치. 코드 줄들의 들여쓰기 영역에         */
/* 깊이별 색상의 세로 띠를 그어 "이 줄들이 같은 블록"임을 시각화.          */
/* 입력: 각 가이드의 top / height / depth (1 또는 2).                    */
/* ------------------------------------------------------------------ */

export const IndentGuide: React.FC<{
  /** 코드 패널 좌측 padding 기준 x 위치 (px) */
  left: number;
  /** 패널 본문 기준 y 위치 (px) */
  top: number;
  /** 가이드 라인 길이 (px) */
  height: number;
  /** 깊이 1 (옅은 violet-300) 또는 2 (진한 violet-500) */
  depth: 1 | 2;
  /** 등장 delay (sec) */
  delaySec?: number;
  /** 등장 duration (sec) */
  durationSec?: number;
}> = ({ left, top, height, depth, delaySec = 0, durationSec = 0.4 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = delaySec * fps;
  const end = start + durationSec * fps;
  const grow = interpolate(frame, [start, end], [0, 1], {
    easing: easeOutCubic,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const edge = depth === 1 ? colors.indentEdge1 : colors.indentEdge2;
  const bg = depth === 1 ? colors.indentBg1 : colors.indentBg2;

  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width: 32,
        height: height * grow,
        opacity: grow,
        pointerEvents: "none",
      }}
    >
      {/* 옅은 배경 띠 */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          background: bg,
          borderRadius: 4,
        }}
      />
      {/* 좌측 진한 세로 라인 */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 3,
          background: edge,
          borderRadius: 2,
        }}
      />
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* DecisionDiamond — 분기 마름모 SVG (2강 회상 + scene-01 morph hook)   */
/*                                                                     */
/* lesson-2 의 FlowchartShape(decision) 와 동일 형상. lesson-3 와       */
/* 동일한 self-contained 정책으로 lesson-5 안에 복제.                    */
/* ------------------------------------------------------------------ */

export const DecisionDiamond: React.FC<{
  width?: number;
  height?: number;
  label?: string;
  outline?: string;
  fill?: string;
  textColor?: string;
  fontSize?: number;
  strokeWidth?: number;
  style?: React.CSSProperties;
}> = ({
  width = 200,
  height = 100,
  label,
  outline = colors.accent,
  fill = colors.bgWhite,
  textColor = colors.ink,
  fontSize = 20,
  strokeWidth = 3,
  style,
}) => {
  const cx = width / 2;
  const cy = height / 2;
  return (
    <div
      style={{
        width,
        height,
        position: "relative",
        ...style,
      }}
    >
      <svg width={width} height={height}>
        <polygon
          points={`${cx},${strokeWidth / 2} ${width - strokeWidth / 2},${cy} ${cx},${
            height - strokeWidth / 2
          } ${strokeWidth / 2},${cy}`}
          fill={fill}
          stroke={outline}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
        />
      </svg>
      {label ? (
        <div
          style={{
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
          }}
        >
          {label}
        </div>
      ) : null}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* FlowArrow — 코드 분기 흐름 화살표 (위→아래)                          */
/*                                                                     */
/* scene-09 에서 코드 우측에 그어 "위에서부터 차례로 검사" 흐름 시각화.   */
/* delaySec 부터 durationSec 동안 위→아래로 grow. 끝에 화살촉.            */
/* ------------------------------------------------------------------ */

export const FlowArrow: React.FC<{
  /** 화살표 시작점 (top px) */
  startY: number;
  /** 화살표 끝점 (top px) — 머리가 여기 */
  endY: number;
  /** 좌측 x 위치 */
  x: number;
  delaySec?: number;
  durationSec?: number;
  color?: string;
  strokeWidth?: number;
}> = ({
  startY,
  endY,
  x,
  delaySec = 0,
  durationSec = 0.6,
  color = colors.accent,
  strokeWidth = 3,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = delaySec * fps;
  const end = start + durationSec * fps;
  const grow = interpolate(frame, [start, end], [0, 1], {
    easing: easeOutCubic,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const totalLength = endY - startY;
  const drawn = totalLength * grow;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: startY,
        width: 20,
        height: totalLength,
        pointerEvents: "none",
      }}
    >
      {/* 세로선 */}
      <div
        style={{
          position: "absolute",
          left: 8,
          top: 0,
          width: strokeWidth,
          height: drawn,
          background: color,
          borderRadius: 2,
        }}
      />
      {/* 화살촉 (끝점) */}
      <div
        style={{
          position: "absolute",
          left: 8 - strokeWidth * 2,
          top: drawn - strokeWidth * 1.5,
          width: 0,
          height: 0,
          borderTop: `${strokeWidth * 3}px solid ${color}`,
          borderLeft: `${strokeWidth * 2}px solid transparent`,
          borderRight: `${strokeWidth * 2}px solid transparent`,
          opacity: grow > 0.92 ? 1 : 0,
        }}
      />
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* QuestionMark — Active recall 정적 동안의 물음표                       */
/*                                                                     */
/* 큰 ? 마크. delaySec 부터 lifespanSec 동안 fade-in → 표시 → fade-out.   */
/* scene-06, scene-10, scene-13 에서 사용.                              */
/* ------------------------------------------------------------------ */

export const QuestionMark: React.FC<{
  size?: number;
  delaySec?: number;
  lifespanSec?: number;
  color?: string;
}> = ({ size = 96, delaySec = 0, lifespanSec = 1.5, color = colors.accent }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = delaySec * fps;
  const opacity = interpolate(
    frame,
    [
      start,
      start + 0.3 * fps,
      (delaySec + lifespanSec) * fps,
      (delaySec + lifespanSec + 0.3) * fps,
    ],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  // 살짝 진동 (subtle pulse) — scale 1.0 ↔ 1.05
  const pulse = interpolate(
    frame,
    [start, start + 0.4 * fps, start + 0.8 * fps, start + 1.2 * fps],
    [1.0, 1.06, 1.0, 1.06],
    {
      easing: easeInOut,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
  return (
    <div
      style={{
        opacity,
        transform: `scale(${pulse})`,
        fontFamily: fonts.sans,
        fontSize: size,
        fontWeight: 900,
        color,
        letterSpacing: "-0.04em",
        lineHeight: 1,
        textShadow: "0 6px 24px rgba(139, 92, 246, 0.25)",
        userSelect: "none",
      }}
    >
      ?
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* ComparisonBox — 비교식 박스 (scene-03)                                */
/*                                                                     */
/* 좌측 모노스페이스 비교식 + 우측 True/False 라벨.                       */
/* fade-in 으로 등장. result 가 True 면 violet, False 면 회색.            */
/* ------------------------------------------------------------------ */

export const ComparisonBox: React.FC<{
  expression: string;
  result: "True" | "False";
  delaySec?: number;
  width?: number;
}> = ({ expression, result, delaySec = 0, width = 520 }) => {
  const resultColor = result === "True" ? colors.accentDeep : colors.inkMuted;
  const resultBg = result === "True" ? colors.accentSoft : colors.borderSoft;
  return (
    <FadeIn delaySec={delaySec} translateY={14}>
      <div
        style={{
          width,
          background: colors.bgWhite,
          borderRadius: radii.card,
          border: `1px solid ${colors.border}`,
          boxShadow: shadows.cardSoft,
          padding: "22px 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
        }}
      >
        <span
          style={{
            fontFamily: fonts.mono,
            fontSize: 40,
            fontWeight: 600,
            color: colors.ink,
            letterSpacing: "-0.01em",
          }}
        >
          {expression}
        </span>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <span
            style={{
              fontFamily: fonts.sans,
              fontSize: 22,
              fontWeight: 500,
              color: colors.inkMuted,
              letterSpacing: "-0.01em",
            }}
          >
            →
          </span>
          <span
            style={{
              padding: "8px 18px",
              borderRadius: radii.pill,
              background: resultBg,
              color: resultColor,
              fontFamily: fonts.mono,
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: "-0.01em",
              border: `1.5px solid ${resultColor}`,
            }}
          >
            {result}
          </span>
        </div>
      </div>
    </FadeIn>
  );
};

/* ------------------------------------------------------------------ */
/* BranchScenarioCard — 3분기 시나리오 카드 (scene-07)                   */
/*                                                                     */
/* 큰 박스 + 라벨 + 분기 목록 (3줄, 각 좌측 violet 점 + 우측 화살표).     */
/* ------------------------------------------------------------------ */

export const BranchScenarioCard: React.FC<{
  title: string;
  branches: { condition: string; outcome: string }[];
  cardDelaySec?: number;
  branchDelayStartSec?: number;
  branchStaggerSec?: number;
  width?: number;
}> = ({
  title,
  branches,
  cardDelaySec = 0.2,
  branchDelayStartSec = 0.7,
  branchStaggerSec = 0.4,
  width = 900,
}) => {
  return (
    <FadeIn delaySec={cardDelaySec} translateY={18}>
      <div
        style={{
          width,
          background: colors.bgWhite,
          borderRadius: radii.card,
          border: `1px solid ${colors.border}`,
          boxShadow: shadows.card,
          padding: "40px 48px",
        }}
      >
        <div
          style={{
            fontFamily: fonts.sans,
            fontSize: 26,
            fontWeight: 700,
            color: colors.accentDeep,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            marginBottom: 28,
          }}
        >
          {title}
        </div>
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
          {branches.map((b, i) => (
            <li key={i}>
              <FadeIn delaySec={branchDelayStartSec + i * branchStaggerSec} translateY={10}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 20,
                    fontFamily: fonts.sans,
                    fontSize: 36,
                    fontWeight: 600,
                    color: colors.ink,
                    letterSpacing: "-0.01em",
                  }}
                >
                  <span
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: "50%",
                      background: colors.accent,
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ flex: 1 }}>
                    <span style={{ fontWeight: 700 }}>{b.condition}</span>{" "}
                    <span
                      style={{
                        color: colors.inkMuted,
                        fontWeight: 500,
                      }}
                    >
                      →
                    </span>{" "}
                    <span style={{ color: colors.accentDeep, fontWeight: 700 }}>{b.outcome}</span>
                  </span>
                </div>
              </FadeIn>
            </li>
          ))}
        </ul>
      </div>
    </FadeIn>
  );
};

/* ------------------------------------------------------------------ */
/* ContainmentBoxes — 박스 안 박스 (scene-11)                            */
/*                                                                     */
/* 큰 박스(label outer) 안에 작은 박스(label inner) — 중첩 mental model. */
/* 두 박스 모두 옅은 violet 띠 배경 (깊이별).                             */
/* outer 가 먼저 등장 → 작은 박스 등장 (delay stagger).                  */
/* ------------------------------------------------------------------ */

export const ContainmentBoxes: React.FC<{
  outerLabel: string;
  innerLabel: string;
  outerDelaySec?: number;
  innerDelaySec?: number;
  outerWidth?: number;
  outerHeight?: number;
}> = ({
  outerLabel,
  innerLabel,
  outerDelaySec = 0.3,
  innerDelaySec = 1.2,
  outerWidth = 560,
  outerHeight = 340,
}) => {
  return (
    <div
      style={{
        position: "relative",
        width: outerWidth,
        height: outerHeight,
      }}
    >
      <FadeIn delaySec={outerDelaySec} translateY={16}>
        <div
          style={{
            width: outerWidth,
            height: outerHeight,
            background: colors.indentBg1,
            border: `2.5px solid ${colors.indentEdge1}`,
            borderRadius: 18,
            padding: "32px 36px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: 20,
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              fontFamily: fonts.sans,
              fontSize: 28,
              fontWeight: 700,
              color: colors.accentInk,
              letterSpacing: "-0.01em",
            }}
          >
            {outerLabel}
          </div>
          <FadeIn delaySec={innerDelaySec - outerDelaySec} translateY={12}>
            <div
              style={{
                width: outerWidth - 100,
                height: outerHeight - 140,
                background: colors.indentBg2,
                border: `2.5px solid ${colors.indentEdge2}`,
                borderRadius: 14,
                padding: "20px 24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxSizing: "border-box",
              }}
            >
              <div
                style={{
                  fontFamily: fonts.sans,
                  fontSize: 26,
                  fontWeight: 700,
                  color: colors.accentInk,
                  letterSpacing: "-0.01em",
                  textAlign: "center",
                }}
              >
                {innerLabel}
              </div>
            </div>
          </FadeIn>
        </div>
      </FadeIn>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* InlineCallout — 코드 옆에 떠오르는 작은 콜아웃                        */
/*                                                                     */
/* scene-08 의 `elif` 위쪽 "Python에선 한 단어 elif" 콜아웃용.            */
/* 작은 둥근 박스 + 화살표 (코드 토큰을 가리킴).                          */
/* ------------------------------------------------------------------ */

export const InlineCallout: React.FC<{
  title: string;
  subtitle?: string;
  delaySec?: number;
  width?: number;
}> = ({ title, subtitle, delaySec = 0, width = 320 }) => {
  return (
    <FadeIn delaySec={delaySec} translateY={-8}>
      <div
        style={{
          width,
          background: colors.accent,
          color: "#ffffff",
          borderRadius: 12,
          padding: "12px 18px",
          fontFamily: fonts.sans,
          boxShadow: shadows.card,
          position: "relative",
        }}
      >
        <div
          style={{
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: "-0.01em",
            lineHeight: 1.3,
          }}
        >
          {title}
        </div>
        {subtitle ? (
          <div
            style={{
              marginTop: 4,
              fontSize: 16,
              fontWeight: 500,
              opacity: 0.85,
              letterSpacing: "-0.01em",
            }}
          >
            {subtitle}
          </div>
        ) : null}
        {/* 화살표 (아래쪽으로) */}
        <div
          style={{
            position: "absolute",
            left: 32,
            bottom: -10,
            width: 0,
            height: 0,
            borderTop: `12px solid ${colors.accent}`,
            borderLeft: "10px solid transparent",
            borderRight: "10px solid transparent",
          }}
        />
      </div>
    </FadeIn>
  );
};

/* ------------------------------------------------------------------ */
/* BranchLabel — 코드 우측에 붙는 True/False 라벨 (scene-09, 10, 13)     */
/*                                                                     */
/* 코드 한 줄 옆에 작은 pill 형태로 등장. True 면 violet, False 면 회색. */
/* ------------------------------------------------------------------ */

export const BranchLabel: React.FC<{
  value: "True" | "False";
  delaySec?: number;
}> = ({ value, delaySec = 0 }) => {
  const color = value === "True" ? colors.accentDeep : colors.inkMuted;
  const bg = value === "True" ? colors.accentSoft : colors.borderSoft;
  return (
    <FadeIn delaySec={delaySec} durationSec={0.4} translateY={0}>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          padding: "4px 14px",
          borderRadius: radii.pill,
          background: bg,
          color,
          fontFamily: fonts.mono,
          fontSize: 22,
          fontWeight: 700,
          letterSpacing: "-0.01em",
          border: `1.5px solid ${color}`,
        }}
      >
        {value}
      </div>
    </FadeIn>
  );
};

/* ------------------------------------------------------------------ */
/* easings re-export for scene files                                   */
/* ------------------------------------------------------------------ */

export { easeOutCubic, easeInOut };
