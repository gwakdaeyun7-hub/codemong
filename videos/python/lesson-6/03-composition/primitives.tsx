/**
 * Shared visual primitives for Lesson 6.
 *
 * Base primitives (FadeIn / TypeOn / Card / CourseLabel / PageBackground /
 * AccentUnderline / LowerThird / CenteredStage / PyToken / CodePanel /
 * CodeLine / ConsolePanel / ConsoleLine / VarBox / DashedHArrow / LabelArrow /
 * IndentGuide / QuestionMark / BranchLabel / BranchScenarioCard /
 * InlineCallout / DecisionDiamond / FlowArrow) are carried over from lesson-5
 * for visual continuity across the season.
 *
 * Lesson-6-specific primitives (further down):
 *   - LoopIcon       — 2강 고리 회상용 mock 도형 (사각형 두 개 + 위로 굽은 화살표) — scene-01
 *   - RedStrike      — 작은 토큰 위에 빨간 줄을 긋는 원자 컴포넌트 — scene-03 / scene-05
 *   - RangeBoxes     — `range(N)` 가로 시각화 (둥근 박스 N개 + 끝값 빨간 X) — scene-03
 *   - HighlightBox   — 코드 줄을 둘러싸는 정적 형광 박스 (yellow-300 outline) — scene-08
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
/* CourseLabel — "파이썬 기초 · 6강" pill                                */
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
/* CODE / CONSOLE PRIMITIVES (carry-over from lesson-3 → 5)            */
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
/* CARRY-OVER FROM LESSON-5                                            */
/* ================================================================== */

/* ------------------------------------------------------------------ */
/* IndentGuide — 코드 패널 좌측의 들여쓰기 깊이별 세로 가이드 (lesson-5)  */
/* ------------------------------------------------------------------ */

export const IndentGuide: React.FC<{
  left: number;
  top: number;
  height: number;
  depth: 1 | 2;
  delaySec?: number;
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
/* QuestionMark — Active recall 정적 동안의 물음표 (lesson-5)            */
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
/* BranchLabel — 코드 우측에 붙는 True/False 라벨 (lesson-5)            */
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
/* BranchScenarioCard — 분기 시나리오 카드 (scene-07 시나리오용)         */
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
/* InlineCallout — 코드 옆에 떠오르는 작은 콜아웃 (lesson-5)             */
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

/* ================================================================== */
/* LESSON-6-SPECIFIC PRIMITIVES                                        */
/* ================================================================== */

/* ------------------------------------------------------------------ */
/* LoopIcon — 2강 고리 회상용 mock 도형 (scene-01)                       */
/*                                                                     */
/* 작은 사각형 두 개가 위아래로 놓이고, 우측에서 위로 굽은 화살표가         */
/* 아래 박스 → 위 박스 로 되돌아옴 (loop 모양).                            */
/* 시리즈 연속성 — 2강 순서도 회상 카드 안에 들어가는 작은 도식.            */
/* ------------------------------------------------------------------ */

export const LoopIcon: React.FC<{
  width?: number;
  height?: number;
  color?: string;
  pulse?: boolean;
  pulseDelaySec?: number;
}> = ({
  width = 100,
  height = 96,
  color = colors.accent,
  pulse = false,
  pulseDelaySec = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Pulse: arrow 가 한 번 violet-500 으로 깜빡 후 base color 로 settle.
  // delay → 0.5s 동안 fade-in 강조 → 0.3s rest → 0.5s fade-out.
  const pulseStart = pulseDelaySec * fps;
  const pulseAmount = pulse
    ? interpolate(
        frame,
        [
          pulseStart,
          pulseStart + 0.3 * fps,
          pulseStart + 0.8 * fps,
          pulseStart + 1.3 * fps,
        ],
        [0, 1, 1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
      )
    : 0;
  const arrowColor = pulse
    ? // base 회색에서 시작 → pulse 동안 accent → base 회색으로 settle
      pulseAmount > 0.05
      ? color
      : colors.inkSubtle
    : color;

  const stroke = 2.5;
  const boxW = 36;
  const boxH = 22;
  // box top y values
  const topBoxY = 6;
  const botBoxY = height - 6 - boxH;
  // arrow path: start at right edge of bottom box, sweep right then up then left to right edge of top box.
  // viewBox 좌표계 사용 (SVG)
  const arrowStartX = 12 + boxW;
  const arrowStartY = botBoxY + boxH / 2;
  const arrowEndX = 12 + boxW;
  const arrowEndY = topBoxY + boxH / 2;
  // control points — bulge to the right
  const ctrlOffsetX = 36;

  return (
    <svg width={width} height={height}>
      {/* 위 박스 */}
      <rect
        x={12}
        y={topBoxY}
        width={boxW}
        height={boxH}
        rx={4}
        fill={colors.bgWhite}
        stroke={colors.inkSubtle}
        strokeWidth={stroke}
      />
      {/* 아래 박스 */}
      <rect
        x={12}
        y={botBoxY}
        width={boxW}
        height={boxH}
        rx={4}
        fill={colors.bgWhite}
        stroke={colors.inkSubtle}
        strokeWidth={stroke}
      />
      {/* 굽은 화살표 — 아래 박스 → 위 박스 로 우측을 도는 모양 (cubic bezier) */}
      <path
        d={`M ${arrowStartX} ${arrowStartY}
            C ${arrowStartX + ctrlOffsetX} ${arrowStartY},
              ${arrowEndX + ctrlOffsetX} ${arrowEndY},
              ${arrowEndX} ${arrowEndY}`}
        fill="none"
        stroke={arrowColor}
        strokeWidth={stroke + (pulse ? pulseAmount * 1.5 : 0)}
        strokeLinecap="round"
      />
      {/* 화살촉 (위 박스에 도착) */}
      <polygon
        points={`${arrowEndX},${arrowEndY} ${arrowEndX + 8},${arrowEndY - 5} ${arrowEndX + 8},${arrowEndY + 5}`}
        fill={arrowColor}
      />
    </svg>
  );
};

/* ------------------------------------------------------------------ */
/* RedStrike — 토큰 위에 빨간 줄을 긋는 atom (scene-03, scene-05)        */
/*                                                                     */
/* delaySec 부터 durationSec 동안 좌→우로 빨간 줄을 그어간다.              */
/* lifespan 후 fade-out 옵션 (scene-05 의 짧은 콜아웃처럼).                */
/* 자체 컨테이너는 inline-block, 자식을 감싼다.                            */
/* ------------------------------------------------------------------ */

export const RedStrike: React.FC<{
  children: React.ReactNode;
  delaySec?: number;
  durationSec?: number;
  lifespanSec?: number;
  fadeOutSec?: number;
  thickness?: number;
  color?: string;
}> = ({
  children,
  delaySec = 0,
  durationSec = 0.5,
  lifespanSec,
  fadeOutSec = 0.4,
  thickness = 4,
  color = colors.danger,
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

  // optional fade-out (lifespanSec 이 주어진 경우만)
  let fade = 1;
  if (typeof lifespanSec === "number") {
    const fadeStart = (delaySec + lifespanSec) * fps;
    const fadeEnd = fadeStart + fadeOutSec * fps;
    fade = interpolate(frame, [fadeStart, fadeEnd], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  }

  return (
    <span
      style={{
        position: "relative",
        display: "inline-block",
        opacity: fade,
      }}
    >
      {children}
      <span
        style={{
          position: "absolute",
          left: 0,
          right: `${(1 - grow) * 100}%`,
          top: "50%",
          height: thickness,
          background: color,
          borderRadius: thickness / 2,
          transform: "translateY(-50%) rotate(-6deg)",
          pointerEvents: "none",
        }}
      />
    </span>
  );
};

/* ------------------------------------------------------------------ */
/* RangeBoxes — `range(N)` 가로 시각화 (scene-03 시그니처)               */
/*                                                                     */
/* 둥근 사각형 N 개 (라벨 0, 1, ..., N-1) 가로 배치 + 끝값 `N` 빨간 X.   */
/* values: 등장할 정수 배열 (예: [0, 1, 2]).                              */
/* endValue: 빨간 X 와 줄 그어진 끝값 (예: 3).                            */
/* boxDelaySec: 첫 박스 등장 delay. 박스마다 stagger 0.25초 간격.          */
/* strikeDelaySec: 끝값 빨간 X 등장 delay.                                */
/* ------------------------------------------------------------------ */

export const RangeBoxes: React.FC<{
  values: number[];
  endValue?: number | null;
  boxDelaySec?: number;
  boxStaggerSec?: number;
  strikeDelaySec?: number;
  showStrike?: boolean;
  boxSize?: number;
  fontSize?: number;
  gap?: number;
  showHeader?: boolean;
  header?: string;
}> = ({
  values,
  endValue = null,
  boxDelaySec = 0,
  boxStaggerSec = 0.25,
  strikeDelaySec = 0,
  showStrike = true,
  boxSize = 110,
  fontSize = 56,
  gap = 24,
  showHeader = true,
  header = "range",
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 20,
      }}
    >
      {showHeader ? (
        <FadeIn delaySec={boxDelaySec - 0.3} translateY={6}>
          <div
            style={{
              fontFamily: fonts.mono,
              fontSize: 26,
              fontWeight: 700,
              color: colors.accentInk,
              letterSpacing: "-0.01em",
              padding: "6px 18px",
              borderRadius: radii.pill,
              background: colors.accentSoft,
              border: `1.5px solid ${colors.accent}`,
            }}
          >
            {header}
          </div>
        </FadeIn>
      ) : null}

      <div style={{ display: "flex", alignItems: "center", gap }}>
        {values.map((v, i) => (
          <FadeIn
            key={`v-${i}`}
            delaySec={boxDelaySec + i * boxStaggerSec}
            translateY={14}
          >
            <div
              style={{
                width: boxSize,
                height: boxSize,
                borderRadius: 20,
                background: colors.bgWhite,
                border: `3px solid ${colors.accent}`,
                boxShadow: shadows.card,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: fonts.mono,
                fontSize,
                fontWeight: 800,
                color: colors.accentDeep,
                letterSpacing: "-0.02em",
              }}
            >
              {v}
            </div>
          </FadeIn>
        ))}
        {endValue !== null && showStrike ? (
          <FadeIn
            delaySec={strikeDelaySec}
            translateY={14}
            style={{ marginLeft: 12 }}
          >
            <div
              style={{
                width: boxSize,
                height: boxSize,
                borderRadius: 20,
                background: colors.bgWhite,
                border: `3px dashed ${colors.danger}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: fonts.mono,
                fontSize,
                fontWeight: 800,
                color: colors.danger,
                letterSpacing: "-0.02em",
                position: "relative",
              }}
            >
              <RedStrike delaySec={strikeDelaySec + 0.2} durationSec={0.5}>
                {endValue}
              </RedStrike>
              {/* X 마커 우상단 */}
              <FadeIn
                delaySec={strikeDelaySec + 0.7}
                translateY={-6}
                style={{
                  position: "absolute",
                  top: -16,
                  right: -16,
                  background: colors.danger,
                  color: "#fff",
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                  fontWeight: 900,
                  boxShadow: shadows.cardSoft,
                }}
              >
                ✕
              </FadeIn>
            </div>
          </FadeIn>
        ) : null}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* HighlightBox — 코드 줄을 둘러싸는 정적 형광 박스 (scene-08)            */
/*                                                                     */
/* yellow-300 outline + yellow-100 옅은 배경. 정적 강조 (펄스 X).         */
/* "이 줄 빠지면 무한 루프" 의 시각 신호. CodePanel 안에서 absolute 로     */
/* 위치 잡아 사용.                                                       */
/* ------------------------------------------------------------------ */

export const HighlightBox: React.FC<{
  left: number;
  top: number;
  width: number | string;
  height: number;
  delaySec?: number;
  durationSec?: number;
  color?: string;
  bg?: string;
  borderWidth?: number;
}> = ({
  left,
  top,
  width,
  height,
  delaySec = 0,
  durationSec = 0.5,
  color = colors.highlightYellow,
  bg = colors.highlightYellowSoft,
  borderWidth = 3,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = delaySec * fps;
  const end = start + durationSec * fps;
  const opacity = interpolate(frame, [start, end], [0, 1], {
    easing: easeOutCubic,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width,
        height,
        border: `${borderWidth}px solid ${color}`,
        borderRadius: 8,
        background: bg,
        opacity,
        pointerEvents: "none",
        boxShadow: "0 0 0 2px rgba(253, 224, 71, 0.18)",
      }}
    />
  );
};

/* ------------------------------------------------------------------ */
/* easings re-export for scene files                                   */
/* ------------------------------------------------------------------ */

export { easeOutCubic, easeInOut };
