/**
 * Shared visual primitives for Lesson 7.
 *
 * Base primitives (FadeIn / TypeOn / Card / CourseLabel / PageBackground /
 * AccentUnderline / LowerThird / CenteredStage / PyToken / CodePanel /
 * CodeLine / ConsolePanel / ConsoleLine / VarBox / DashedHArrow / LabelArrow /
 * IndentGuide / QuestionMark / BranchLabel / BranchScenarioCard /
 * InlineCallout / LoopIcon / RedStrike / HighlightBox) are carried over from
 * lesson-6 for visual continuity across the season. LoopIcon stays so the
 * scene-01 회상 ✓ 카드 안 작은 도식이 그대로 작동한다 (시즌 정형 통일).
 *
 * Lesson-7-specific primitives (further down):
 *   - IndexStrip    — 리스트 값 위에 인덱스 라벨 [0] [1] [2] 띠 (값 박스 폭과 정렬). 7강 시그니처.
 *   - ListVisual    — 둥근 박스 가로 배열 + 인덱스 라벨 + 길이 라벨. append/del/swap 지원.
 *   - EmptySlot     — 빈 자리 점선 박스 + RedX 마커 (scene-04 / scene-12).
 *   - RedX          — 위에서 fade-in 되는 빨간 X 마커.
 *   - GridVisual    — 2차원 표 격자 (M행 N열). 행/열 라벨, 행 강조, 한 칸 강조 두 단계.
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
/* TypeOn — char-by-char string slicing                                */
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
/* CourseLabel — "파이썬 기초 · N강" pill                                */
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
/* CODE / CONSOLE PRIMITIVES (carry-over from lesson-3 → 6)            */
/* ================================================================== */

export type PyTokenKind =
  | "keyword"
  | "string"
  | "number"
  | "name"
  | "func"
  | "op"
  | "comment"
  | "text";

const tokenColor: Record<PyTokenKind, string> = {
  keyword: colors.syntaxKeyword,
  string: colors.syntaxString,
  number: colors.syntaxNumber,
  name: colors.syntaxName,
  func: colors.syntaxFunc,
  op: colors.syntaxOp,
  comment: colors.syntaxComment,
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

/* ------------------------------------------------------------------ */
/* HighlightBox — 정적 형광 박스 (lesson-6 carry-over)                    */
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

/* ================================================================== */
/* LESSON-6 CARRY-OVER (LoopIcon) — scene-01 회상카드 안 작은 도식        */
/* ================================================================== */

export const LoopIcon: React.FC<{
  width?: number;
  height?: number;
  color?: string;
}> = ({ width = 100, height = 96, color = colors.accent }) => {
  const stroke = 2.5;
  const boxW = 36;
  const boxH = 22;
  const topBoxY = 6;
  const botBoxY = height - 6 - boxH;
  const arrowStartX = 12 + boxW;
  const arrowStartY = botBoxY + boxH / 2;
  const arrowEndX = 12 + boxW;
  const arrowEndY = topBoxY + boxH / 2;
  const ctrlOffsetX = 36;

  return (
    <svg width={width} height={height}>
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
      <path
        d={`M ${arrowStartX} ${arrowStartY}
            C ${arrowStartX + ctrlOffsetX} ${arrowStartY},
              ${arrowEndX + ctrlOffsetX} ${arrowEndY},
              ${arrowEndX} ${arrowEndY}`}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
      />
      <polygon
        points={`${arrowEndX},${arrowEndY} ${arrowEndX + 8},${arrowEndY - 5} ${arrowEndX + 8},${arrowEndY + 5}`}
        fill={color}
      />
    </svg>
  );
};

/* ================================================================== */
/* LESSON-7-SPECIFIC PRIMITIVES                                        */
/* ================================================================== */

/* ------------------------------------------------------------------ */
/* RedX — 빨간 X 마커 (위에서 fade-in)                                    */
/*                                                                     */
/* 빈 자리 / 잘못된 자리 시각 신호. size 36 + 흰 X 가 빨간 원 안에 표시.   */
/* ------------------------------------------------------------------ */

export const RedX: React.FC<{
  size?: number;
  delaySec?: number;
  durationSec?: number;
}> = ({ size = 36, delaySec = 0, durationSec = 0.4 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = delaySec * fps;
  const end = start + durationSec * fps;
  const opacity = interpolate(frame, [start, end], [0, 1], {
    easing: easeOutCubic,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scale = interpolate(frame, [start, end], [0.7, 1.0], {
    easing: easeOutCubic,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: colors.danger,
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.55,
        fontWeight: 900,
        opacity,
        transform: `scale(${scale})`,
        boxShadow: shadows.cardSoft,
        fontFamily: fonts.sans,
      }}
    >
      ✕
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* EmptySlot — 빈 자리 점선 박스 + 큰 RedX 마커                          */
/*                                                                     */
/* scene-04 의 scores[3] 빈 자리 / scene-12 의 [3] 점선 박스에 사용.      */
/* width/height 는 ListVisual 의 박스 크기와 매칭 (default 120×120).      */
/* ------------------------------------------------------------------ */

export const EmptySlot: React.FC<{
  size?: number;
  delaySec?: number;
  xDelaySec?: number;
}> = ({
  size = 120,
  delaySec = 0,
  xDelaySec,
}) => {
  // R-018 — indexLabel 은 IndexStrip 의 trailingEmptyLabel 로 통합. EmptySlot 은
  // 박스 본체만 그려서 다른 ListBox 와 height 동일 (= size). 박스 행 alignItems:
  // center 일 때 모든 박스가 같은 y 에 위치.
  const xStart = typeof xDelaySec === "number" ? xDelaySec : delaySec + 0.4;
  return (
    <FadeIn delaySec={delaySec} translateY={10} durationSec={0.5}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: 20,
          background: colors.bgWhite,
          border: `3px dashed ${colors.emptySlotBorder}`,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <RedX size={size * 0.5} delaySec={xStart} durationSec={0.5} />
        </div>
      </div>
    </FadeIn>
  );
};

/* ------------------------------------------------------------------ */
/* IndexStrip — 리스트 박스 위에 인덱스 라벨 띠 ([0] [1] [2])              */
/*                                                                     */
/* count 개의 인덱스 라벨을 boxSize 폭에 맞춰 가로 배치. 라벨이 stagger     */
/* 로 fade-in (delaySec + i * staggerSec). 값 박스 위에 정렬 강제.         */
/* ListVisual 안에 통합되어 있지만 독립 사용도 가능.                       */
/* ------------------------------------------------------------------ */

export const IndexStrip: React.FC<{
  count: number;
  boxSize?: number;
  gap?: number;
  delaySec?: number;
  staggerSec?: number;
  startIndex?: number;
  highlightIndex?: number;
  highlightDelaySec?: number;
  highlightDurationSec?: number;
  fontSize?: number;
  /**
   * 마지막 박스 옆에 빈 자리 인덱스 라벨 (예: "[3]") 추가. R-018 — ListVisual 의
   * trailingEmptySlot 이 있을 때 IndexStrip 도 같은 폭 layout 으로 그려야 박스 위
   * 정렬이 맞음. 색상은 danger (빨강) 로 빈 자리 의미 강조.
   */
  trailingEmptyLabel?: string;
  trailingEmptyDelaySec?: number;
  /** trailingEmpty 와 박스 간 marginLeft (ListVisual 의 EmptySlot marginLeft 와 동일해야 함). */
  trailingEmptyMarginLeft?: number;
}> = ({
  count,
  boxSize = 120,
  gap = 18,
  delaySec = 0,
  staggerSec = 0.4,
  startIndex = 0,
  highlightIndex,
  highlightDelaySec = 0,
  highlightDurationSec = 0.8,
  fontSize = 26,
  trailingEmptyLabel,
  trailingEmptyDelaySec = 0,
  trailingEmptyMarginLeft = 6,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div style={{ display: "flex", gap, alignItems: "center" }}>
      {Array.from({ length: count }).map((_, i) => {
        const idx = startIndex + i;
        let pulseOpacity = 0;
        if (highlightIndex === idx) {
          const hs = highlightDelaySec * fps;
          const he = hs + highlightDurationSec * fps;
          pulseOpacity = interpolate(
            frame,
            [hs, hs + 0.2 * fps, he - 0.3 * fps, he],
            [0, 1, 1, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          );
        }
        return (
          <div
            key={`idx-${idx}`}
            style={{
              width: boxSize,
              display: "flex",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <FadeIn delaySec={delaySec + i * staggerSec} translateY={-6} durationSec={0.4}>
              <div
                style={{
                  fontFamily: fonts.mono,
                  fontSize,
                  fontWeight: 700,
                  color: colors.accentInk,
                  letterSpacing: "-0.01em",
                  opacity: 0.85,
                  padding: "2px 10px",
                  borderRadius: radii.sm,
                  background: pulseOpacity > 0.05 ? colors.accentSoft : "transparent",
                  border: pulseOpacity > 0.05 ? `1.5px solid ${colors.accent}` : "1.5px solid transparent",
                }}
              >
                [{idx}]
              </div>
            </FadeIn>
          </div>
        );
      })}
      {trailingEmptyLabel ? (
        <div
          style={{
            marginLeft: trailingEmptyMarginLeft,
            width: boxSize,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <FadeIn delaySec={trailingEmptyDelaySec} translateY={-6} durationSec={0.4}>
            <div
              style={{
                fontFamily: fonts.mono,
                fontSize,
                fontWeight: 700,
                color: colors.danger,
                letterSpacing: "-0.01em",
                opacity: 0.85,
                padding: "2px 10px",
                borderRadius: radii.sm,
              }}
            >
              {trailingEmptyLabel}
            </div>
          </FadeIn>
        </div>
      ) : null}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* ListVisual — 리스트 둥근 박스 가로 배열 + 인덱스 띠 + 길이 라벨        */
/*                                                                     */
/* 7강 시그니처 mental model — 리스트 값을 mental box 로 시각화.            */
/*                                                                     */
/* Props:                                                              */
/*   - items: { value, indexLabel, state? }[]                          */
/*       state: "normal" (default) | "incoming" (새로 fade-in) |        */
/*              "outgoing" (위로 떠올라 fade-out) | "swapped" (값 swap) | */
/*              "highlighted" (violet-500 강조)                          */
/*   - lengthLabel?: 길이 = N 표시 (옵션)                                */
/*   - boxSize?, gap?, indexStrip?                                       */
/*   - itemDelays?: 각 항목의 enter/leave 타이밍 제어                    */
/* ------------------------------------------------------------------ */

export type ListItemState = "normal" | "incoming" | "outgoing" | "swapped" | "highlighted";

export type ListItem = {
  value: React.ReactNode;
  indexLabel?: string;
  state?: ListItemState;
  /**
   * incoming 상태: fade-in 시작 시각 (sec). 기본 0.
   * outgoing 상태: fade-out 시작 시각 (sec). 기본 0.
   * swapped 상태: 새 값으로 swap 시작 시각 (sec). 기본 0.
   * highlighted 상태: 강조 fade-in 시작 시각 (sec). 기본 0.
   */
  atSec?: number;
  /** swapped 상태일 때 이전 값. atSec 에 fade-out, 새 값 fade-in. */
  prevValue?: React.ReactNode;
  /** highlight color override (default violet-500 외곽선). */
  highlightColor?: string;
};

const ListBox: React.FC<{
  item: ListItem;
  size: number;
}> = ({ item, size }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const state = item.state ?? "normal";
  const atSec = item.atSec ?? 0;
  const start = atSec * fps;

  // 박스 본체의 transform / opacity 계산
  let opacity = 1;
  let translateY = 0;
  if (state === "incoming") {
    opacity = interpolate(frame, [start, start + 0.5 * fps], [0, 1], {
      easing: easeOutCubic,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    translateY = interpolate(frame, [start, start + 0.5 * fps], [-20, 0], {
      easing: easeOutCubic,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  } else if (state === "outgoing") {
    opacity = interpolate(frame, [start, start + 0.6 * fps], [1, 0], {
      easing: easeOutCubic,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    translateY = interpolate(frame, [start, start + 0.6 * fps], [0, -30], {
      easing: easeOutCubic,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  }

  // 값 swap 처리 (state="swapped")
  // prevValue fade-out [start, start+0.4*fps], 새 value fade-in [start+0.6*fps, start+1.0*fps]
  // → R-002 0.2초 buffer 준수.
  let renderPrev = false;
  let prevOpacity = 0;
  let newOpacity = 1;
  if (state === "swapped" && item.prevValue !== undefined) {
    renderPrev = true;
    prevOpacity = interpolate(frame, [start, start + 0.4 * fps], [1, 0], {
      easing: easeOutCubic,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    newOpacity = interpolate(frame, [start + 0.6 * fps, start + 1.0 * fps], [0, 1], {
      easing: easeOutCubic,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  }

  // highlight 외곽선 처리 (state="highlighted")
  let highlightOpacity = 0;
  if (state === "highlighted") {
    highlightOpacity = interpolate(
      frame,
      [start, start + 0.3 * fps, start + 0.8 * fps, start + 1.2 * fps],
      [0, 1, 1, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    );
  }
  const highlightColor = item.highlightColor ?? colors.accent;

  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        borderRadius: 20,
        background: colors.bgWhite,
        border: `3px solid ${colors.accent}`,
        boxShadow: shadows.card,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: fonts.mono,
        fontSize: size * 0.4,
        fontWeight: 800,
        color: colors.accentDeep,
        letterSpacing: "-0.02em",
        opacity,
        transform: `translateY(${translateY}px)`,
        overflow: "hidden",
      }}
    >
      {renderPrev ? (
        <>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: prevOpacity }}>
            {item.prevValue}
          </div>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: newOpacity }}>
            {item.value}
          </div>
        </>
      ) : (
        item.value
      )}
      {highlightOpacity > 0.01 ? (
        <div
          style={{
            position: "absolute",
            inset: -6,
            borderRadius: 24,
            border: `4px solid ${highlightColor}`,
            opacity: highlightOpacity,
            pointerEvents: "none",
            boxShadow: `0 0 0 4px rgba(139, 92, 246, ${highlightOpacity * 0.2})`,
          }}
        />
      ) : null}
    </div>
  );
};

export const ListVisual: React.FC<{
  items: ListItem[];
  boxSize?: number;
  gap?: number;
  showIndexStrip?: boolean;
  indexStripDelaySec?: number;
  indexStripStaggerSec?: number;
  indexStripHighlight?: number;
  indexStripHighlightDelaySec?: number;
  indexStripHighlightDurationSec?: number;
  lengthLabel?: string;
  lengthLabelDelaySec?: number;
  /** 마지막에 점선 빈 자리 추가 (scene-04 `scores[3]` / scene-12 `[3]`). */
  trailingEmptySlot?: {
    indexLabel?: string;
    delaySec?: number;
    xDelaySec?: number;
    labelDelaySec?: number;
  } | null;
  /** 항목 fade-in 의 기본 stagger. items 의 state === "incoming" 의 atSec 으로 override. */
  defaultItemDelaySec?: number;
  defaultItemStaggerSec?: number;
}> = ({
  items,
  boxSize = 120,
  gap = 18,
  showIndexStrip = true,
  indexStripDelaySec = 0,
  indexStripStaggerSec = 0.4,
  indexStripHighlight,
  indexStripHighlightDelaySec = 0,
  indexStripHighlightDurationSec = 0.8,
  lengthLabel,
  lengthLabelDelaySec = 0,
  trailingEmptySlot = null,
  defaultItemDelaySec = 0,
  defaultItemStaggerSec = 0.0,
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
      }}
    >
      {showIndexStrip ? (
        <IndexStrip
          count={items.length}
          boxSize={boxSize}
          gap={gap}
          delaySec={indexStripDelaySec}
          staggerSec={indexStripStaggerSec}
          highlightIndex={indexStripHighlight}
          highlightDelaySec={indexStripHighlightDelaySec}
          highlightDurationSec={indexStripHighlightDurationSec}
          trailingEmptyLabel={trailingEmptySlot?.indexLabel}
          trailingEmptyDelaySec={
            trailingEmptySlot?.labelDelaySec ?? trailingEmptySlot?.delaySec ?? 0
          }
          trailingEmptyMarginLeft={6}
        />
      ) : null}

      <div style={{ display: "flex", gap, alignItems: "center" }}>
        {items.map((item, i) => {
          // state === "incoming" 면 item.atSec 을 사용. 아니면 default delay.
          const atSec =
            item.atSec ??
            (item.state === "incoming" ? defaultItemDelaySec : defaultItemDelaySec + i * defaultItemStaggerSec);
          const effective: ListItem = { ...item, atSec };
          return (
            <ListBox key={`box-${i}`} item={effective} size={boxSize} />
          );
        })}
        {trailingEmptySlot ? (
          <div style={{ marginLeft: 6 }}>
            <EmptySlot
              size={boxSize}
              delaySec={trailingEmptySlot.delaySec ?? 0}
              xDelaySec={trailingEmptySlot.xDelaySec}
            />
          </div>
        ) : null}
      </div>

      {lengthLabel ? (
        <FadeIn delaySec={lengthLabelDelaySec} translateY={6} durationSec={0.4}>
          <div
            style={{
              marginTop: 8,
              padding: "6px 18px",
              borderRadius: radii.pill,
              background: colors.borderSoft,
              border: `1.5px solid ${colors.border}`,
              fontFamily: fonts.sans,
              fontSize: 22,
              fontWeight: 700,
              color: colors.inkSoft,
              letterSpacing: "-0.01em",
            }}
          >
            {lengthLabel}
          </div>
        </FadeIn>
      ) : null}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* SwapLabel — 라벨 텍스트가 swap 되는 컴포넌트 (예: "길이 = 3" → "길이 = 4") */
/*                                                                     */
/* R-002 준수: fade-out 끝나는 시점 + 0.2초 buffer + fade-in 시작.         */
/* ------------------------------------------------------------------ */

export const SwapLabel: React.FC<{
  initial: React.ReactNode;
  newLabel: React.ReactNode;
  swapAtSec: number;
  fadeOutSec?: number;
  bufferSec?: number;
  fadeInSec?: number;
  style?: React.CSSProperties;
}> = ({
  initial,
  newLabel,
  swapAtSec,
  fadeOutSec = 0.4,
  bufferSec = 0.2,
  fadeInSec = 0.4,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fadeOutEnd = (swapAtSec + fadeOutSec) * fps;
  const fadeInStart = (swapAtSec + fadeOutSec + bufferSec) * fps;
  const fadeInEnd = fadeInStart + fadeInSec * fps;

  const oldOpacity = interpolate(frame, [swapAtSec * fps, fadeOutEnd], [1, 0], {
    easing: easeOutCubic,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const newOpacity = interpolate(frame, [fadeInStart, fadeInEnd], [0, 1], {
    easing: easeOutCubic,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // R-019 — initial 과 newLabel 의 폰트 굵기·길이 차이로 newLabel 의 inline 폭이
  // parent (initial 폭에 fit-content) 를 초과하면 wrap 됨. whiteSpace: nowrap 으로
  // 두 라벨 모두 1줄 보장.
  return (
    <div style={{ position: "relative", whiteSpace: "nowrap", ...style }}>
      <div style={{ opacity: oldOpacity, whiteSpace: "nowrap" }}>{initial}</div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: newOpacity,
          whiteSpace: "nowrap",
        }}
      >
        {newLabel}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* GridVisual — 2차원 표 격자 (M행 N열) — 행 강조 + 한 칸 강조             */
/*                                                                     */
/* scene-11 시그니처. grid[행][열] 짚기 두 단계 강조 애니메이션:           */
/*   1단계 — 행 전체 violet-200 배경 highlight + 행 라벨 펄스            */
/*   2단계 — 한 칸 violet-500 배경 + 흰 글씨 + 열 라벨 펄스                 */
/* ------------------------------------------------------------------ */

export type GridHighlight = {
  row?: number;
  col?: number;
  delaySec?: number;
  durationSec?: number;
};

export const GridVisual: React.FC<{
  rows: (React.ReactNode | number | string)[][];
  cellSize?: number;
  gap?: number;
  /** 행 라벨 fade-in delay (각 라벨 stagger). */
  rowLabelDelaySec?: number;
  rowLabelStaggerSec?: number;
  /** 열 라벨 fade-in delay (각 라벨 stagger). */
  colLabelDelaySec?: number;
  colLabelStaggerSec?: number;
  /** 셀 fade-in delay (전체 grid 가 한 번에 등장하지 않고 stagger). */
  cellDelaySec?: number;
  cellStaggerSec?: number;
  /** 1단계: 행 highlight (행 전체 violet-200 배경). */
  rowHighlight?: GridHighlight;
  /** 2단계: 한 칸 highlight (violet-500 배경 + 흰 글씨). */
  cellHighlight?: GridHighlight;
}> = ({
  rows,
  cellSize = 90,
  gap = 8,
  rowLabelDelaySec = 0,
  rowLabelStaggerSec = 0.3,
  colLabelDelaySec = 0,
  colLabelStaggerSec = 0.3,
  cellDelaySec = 0,
  cellStaggerSec = 0.1,
  rowHighlight,
  cellHighlight,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const nRows = rows.length;
  const nCols = nRows > 0 ? rows[0].length : 0;

  const rowHighlightOpacityFor = (r: number): number => {
    if (!rowHighlight || rowHighlight.row !== r) return 0;
    const ds = (rowHighlight.delaySec ?? 0) * fps;
    const dur = (rowHighlight.durationSec ?? 1.2) * fps;
    return interpolate(
      frame,
      [ds, ds + 0.3 * fps, ds + dur - 0.3 * fps, ds + dur],
      [0, 1, 1, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    );
  };

  const cellHighlightOpacityFor = (r: number, c: number): number => {
    if (!cellHighlight || cellHighlight.row !== r || cellHighlight.col !== c) return 0;
    const ds = (cellHighlight.delaySec ?? 0) * fps;
    const dur = (cellHighlight.durationSec ?? 1.2) * fps;
    return interpolate(
      frame,
      [ds, ds + 0.3 * fps, ds + dur - 0.3 * fps, ds + dur],
      [0, 1, 1, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    );
  };

  const rowLabelHighlightOpacity = (r: number): number => {
    if (!rowHighlight || rowHighlight.row !== r) return 0;
    return rowHighlightOpacityFor(r);
  };

  const colLabelHighlightOpacity = (c: number): number => {
    if (!cellHighlight || cellHighlight.col !== c) return 0;
    return cellHighlightOpacityFor(cellHighlight.row ?? -1, c);
  };

  // grid 안에서 셀 컴포넌트.
  const Cell: React.FC<{ r: number; c: number; value: React.ReactNode }> = ({ r, c, value }) => {
    const rowOp = rowHighlightOpacityFor(r);
    const cellOp = cellHighlightOpacityFor(r, c);
    const enterDelay = cellDelaySec + (r * nCols + c) * cellStaggerSec;
    return (
      <FadeIn delaySec={enterDelay} translateY={6} durationSec={0.4}>
        <div
          style={{
            position: "relative",
            width: cellSize,
            height: cellSize,
            borderRadius: 12,
            background: colors.gridCellBg,
            border: `2px solid ${colors.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: fonts.mono,
            fontSize: cellSize * 0.4,
            fontWeight: 800,
            color: colors.ink,
            letterSpacing: "-0.02em",
            overflow: "hidden",
          }}
        >
          {/* row highlight overlay (1단계) */}
          {rowOp > 0.01 ? (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: colors.gridCellBgHighlighted,
                opacity: rowOp,
                pointerEvents: "none",
                borderRadius: 10,
              }}
            />
          ) : null}
          {/* cell highlight overlay (2단계 — violet-500 배경 + 흰 글씨) */}
          {cellOp > 0.01 ? (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: colors.gridCellBgPicked,
                opacity: cellOp,
                pointerEvents: "none",
                borderRadius: 10,
              }}
            />
          ) : null}
          <span
            style={{
              position: "relative",
              color: cellOp > 0.6 ? "#fff" : colors.ink,
            }}
          >
            {value}
          </span>
        </div>
      </FadeIn>
    );
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `auto repeat(${nCols}, ${cellSize}px)`,
        gridTemplateRows: `auto repeat(${nRows}, ${cellSize}px)`,
        columnGap: gap,
        rowGap: gap,
      }}
    >
      {/* 빈 corner */}
      <div style={{ width: 56, height: 36 }} />
      {/* 열 라벨 (상단) */}
      {Array.from({ length: nCols }).map((_, c) => {
        const op = colLabelHighlightOpacity(c);
        return (
          <FadeIn
            key={`col-${c}`}
            delaySec={colLabelDelaySec + c * colLabelStaggerSec}
            translateY={-6}
            durationSec={0.4}
            style={{ display: "flex", justifyContent: "center", alignItems: "flex-end" }}
          >
            <div
              style={{
                fontFamily: fonts.mono,
                fontSize: 24,
                fontWeight: 700,
                color: colors.accentInk,
                letterSpacing: "-0.01em",
                opacity: 0.85,
                padding: "2px 10px",
                borderRadius: radii.sm,
                background: op > 0.05 ? colors.accentSoft : "transparent",
                border: op > 0.05 ? `1.5px solid ${colors.accent}` : "1.5px solid transparent",
              }}
            >
              [{c}]
            </div>
          </FadeIn>
        );
      })}

      {/* 각 행 — 행 라벨 + 셀들 */}
      {rows.map((rowCells, r) => {
        const rowOp = rowLabelHighlightOpacity(r);
        return (
          <React.Fragment key={`row-${r}`}>
            <FadeIn
              delaySec={rowLabelDelaySec + r * rowLabelStaggerSec}
              translateY={-6}
              durationSec={0.4}
              style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", paddingRight: 8 }}
            >
              <div
                style={{
                  fontFamily: fonts.mono,
                  fontSize: 24,
                  fontWeight: 700,
                  color: colors.accentInk,
                  letterSpacing: "-0.01em",
                  opacity: 0.85,
                  padding: "2px 10px",
                  borderRadius: radii.sm,
                  background: rowOp > 0.05 ? colors.accentSoft : "transparent",
                  border: rowOp > 0.05 ? `1.5px solid ${colors.accent}` : "1.5px solid transparent",
                }}
              >
                [{r}]
              </div>
            </FadeIn>
            {rowCells.map((value, c) => (
              <Cell key={`cell-${r}-${c}`} r={r} c={c} value={value} />
            ))}
          </React.Fragment>
        );
      })}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* easings re-export for scene files                                   */
/* ------------------------------------------------------------------ */

export { easeOutCubic, easeInOut };
