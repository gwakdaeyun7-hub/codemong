/**
 * Shared visual primitives for Lesson 8.
 *
 * Base primitives (FadeIn / TypeOn / Card / CourseLabel / PageBackground /
 * AccentUnderline / LowerThird / CenteredStage / PyToken / CodePanel /
 * CodeLine / ConsolePanel / ConsoleLine / VarBox / DashedHArrow / LabelArrow /
 * IndentGuide / QuestionMark / BranchLabel / BranchScenarioCard /
 * InlineCallout / HighlightBox / RedStrike) are carried over from lesson-6 for
 * visual continuity across the season (시즌 통일 정형 답습).
 *
 * Lesson-8-specific primitives (further down):
 *   - RedConsole       — 에러 박스 (KeyError / TypeError) 빨간 외곽 + 옅은 배경 — scene-06 / 08 / 10
 *   - PairDiagram      — 키 → 값 짝 다이어그램 (이름표 라벨 + 화살표 + 값 박스) — scene-03 / 05
 *   - DictBox / SetBox / TupleBox — 자료구조 박스 (다이어그램 시각용) — scene-07 / 09
 *   - ChecklistCard    — 4단 정리 카드 1개 (✓ 36×36 violet + 라벨/설명) — scene-11
 *   - StrikeoutItem    — set 중복 제거 시각: 항목이 흐려지며 빨간 X 와 함께 사라짐 — scene-09
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
/* (R-006: parent flex 작동 위해 style prop 을 outer div 에 전달)        */
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
/* CourseLabel — "파이썬 기초 · 8강" pill                                */
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
  | "text"
  | "dictKey"   // lesson-8 추가: dict 키 (이름표) 강조
  | "dictValue"; // lesson-8 추가: dict 값 (대부분 darkInk 와 동일)

const tokenColor: Record<PyTokenKind, string> = {
  keyword: colors.syntaxKeyword,
  string: colors.syntaxString,
  number: colors.syntaxNumber,
  name: colors.syntaxName,
  func: colors.syntaxFunc,
  op: colors.syntaxOp,
  text: colors.darkInk,
  dictKey: colors.syntaxDictKey,
  dictValue: colors.syntaxDictValue,
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
/* QuestionMark — Active recall 정적 동안의 물음표                       */
/* (R-012 준수 — 큰 박스 사이 신호는 size ≥ 180)                         */
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
/* HighlightBox — 코드/콘솔 줄 둘러싸는 정적 형광 박스                    */
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
/* RedStrike — 토큰 위에 빨간 줄 (lesson-6 carry-over)                  */
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

/* ================================================================== */
/* LESSON-8-SPECIFIC PRIMITIVES                                        */
/* ================================================================== */

/* ------------------------------------------------------------------ */
/* RedConsole — 에러 박스 (KeyError / TypeError 시연)                   */
/*                                                                     */
/* ConsolePanel 과 비슷한 dark 표면 + 빨간 외곽 + 옅은 빨간 배경.        */
/* 헤더는 작은 빨간 ✕ + ERROR 라벨. 본문에 에러 메시지 text.              */
/* scene-06 (KeyError) / scene-08 (TypeError) / scene-10 (TypeError).   */
/* ------------------------------------------------------------------ */

export const RedConsole: React.FC<{
  message: React.ReactNode;
  width?: number;
  height?: number | string;
  delaySec?: number;
  dimmedAfterSec?: number;
  style?: React.CSSProperties;
}> = ({ message, width = 600, height, delaySec = 0, dimmedAfterSec, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = delaySec * fps;
  const reveal = interpolate(frame, [start, start + 0.4 * fps], [0, 1], {
    easing: easeOutCubic,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  let dimOp = 1;
  if (typeof dimmedAfterSec === "number") {
    const dimStart = dimmedAfterSec * fps;
    dimOp = interpolate(frame, [dimStart, dimStart + 0.5 * fps], [1, 0.4], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  }

  return (
    <div
      style={{
        width,
        height,
        background: colors.darkBg2,
        borderRadius: 14,
        border: `2.5px solid ${colors.danger}`,
        boxShadow: "0 0 0 4px rgba(239, 68, 68, 0.16), 0 4px 24px -8px rgba(24, 24, 27, 0.10)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        fontFamily: fonts.mono,
        opacity: reveal * dimOp,
        transform: `translateY(${(1 - reveal) * 8}px)`,
        ...style,
      }}
    >
      <div
        style={{
          height: 40,
          background: "rgba(239, 68, 68, 0.16)",
          borderBottom: `1px solid ${colors.danger}`,
          display: "flex",
          alignItems: "center",
          padding: "0 18px",
          gap: 10,
        }}
      >
        <span
          style={{
            width: 22,
            height: 22,
            borderRadius: "50%",
            background: colors.danger,
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
            fontWeight: 900,
            flexShrink: 0,
          }}
        >
          ✕
        </span>
        <span
          style={{
            color: "#fca5a5", // red-300
            fontFamily: fonts.sans,
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          ERROR
        </span>
      </div>
      <div
        style={{
          flex: 1,
          padding: "20px 24px",
          color: colors.darkInk,
          fontSize: 26,
          lineHeight: 1.5,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {message}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* PairDiagram — 키 → 값 짝 다이어그램 (dict 시각화)                     */
/*                                                                     */
/* 큰 박스 한 개 안에 라벨 박스(이름표) → 화살표 → 값 박스 짝이 줄지어      */
/* 등장. 각 row 마다 enterAtSec stagger 가능.                            */
/* scene-03 / scene-05 에서 사용.                                       */
/* ------------------------------------------------------------------ */

export type PairRow = {
  key: React.ReactNode;
  value: React.ReactNode;
  enterAtSec?: number;
  // 등장 후 키 박스가 한 번 violet 으로 펄스할 비트 시점. undefined 면 펄스 X.
  pulseAtSec?: number;
  pulseSide?: "key" | "value" | "both";
};

export const PairDiagram: React.FC<{
  rows: PairRow[];
  delaySec?: number;
  width?: number;
  title?: React.ReactNode;
}> = ({ rows, delaySec = 0, width = 560, title }) => {
  return (
    <FadeIn delaySec={delaySec} translateY={14}>
      <div
        style={{
          width,
          background: colors.bgWhite,
          borderRadius: radii.card,
          border: `1px solid ${colors.border}`,
          boxShadow: shadows.card,
          padding: "32px 32px",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        {title ? (
          <div
            style={{
              fontFamily: fonts.sans,
              fontSize: 22,
              fontWeight: 700,
              color: colors.accentDeep,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              marginBottom: 4,
            }}
          >
            {title}
          </div>
        ) : null}
        {rows.map((row, i) => (
          <PairDiagramRow key={i} row={row} />
        ))}
      </div>
    </FadeIn>
  );
};

const PairDiagramRow: React.FC<{ row: PairRow }> = ({ row }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enterAt = (row.enterAtSec ?? 0) * fps;
  const reveal = interpolate(frame, [enterAt, enterAt + 0.5 * fps], [0, 1], {
    easing: easeOutCubic,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Pulse (optional)
  let keyPulse = 0;
  let valuePulse = 0;
  if (typeof row.pulseAtSec === "number") {
    const pStart = row.pulseAtSec * fps;
    const p = interpolate(
      frame,
      [pStart, pStart + 0.3 * fps, pStart + 0.7 * fps, pStart + 1.1 * fps],
      [0, 1, 1, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    );
    if (row.pulseSide === "key" || row.pulseSide === "both" || !row.pulseSide) keyPulse = p;
    if (row.pulseSide === "value" || row.pulseSide === "both") valuePulse = p;
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        opacity: reveal,
        transform: `translateY(${(1 - reveal) * 6}px)`,
      }}
    >
      {/* 이름표 박스 (좌측) */}
      <div
        style={{
          flex: "0 0 auto",
          minWidth: 140,
          padding: "10px 20px",
          borderRadius: radii.pill,
          background: keyPulse > 0.1 ? colors.accent : colors.accentSoft,
          color: keyPulse > 0.1 ? "#ffffff" : colors.accentInk,
          border: `1.5px solid ${colors.accent}`,
          fontFamily: fonts.mono,
          fontSize: 28,
          fontWeight: 700,
          letterSpacing: "-0.01em",
          textAlign: "center",
          boxShadow: keyPulse > 0.1 ? "0 0 0 4px rgba(139, 92, 246, 0.18)" : "none",
        }}
      >
        {row.key}
      </div>
      {/* 화살표 */}
      <div
        style={{
          flex: 1,
          height: 3,
          background: keyPulse > 0.1 ? colors.accent : colors.inkSubtle,
          borderRadius: 2,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -2,
            top: "50%",
            transform: "translateY(-50%)",
            width: 0,
            height: 0,
            borderLeft: `12px solid ${keyPulse > 0.1 ? colors.accent : colors.inkSubtle}`,
            borderTop: "8px solid transparent",
            borderBottom: "8px solid transparent",
          }}
        />
      </div>
      {/* 값 박스 (우측) */}
      <div
        style={{
          flex: "0 0 auto",
          minWidth: 100,
          padding: "10px 20px",
          borderRadius: 14,
          background: valuePulse > 0.1 ? colors.accentSoft : colors.bgWhite,
          color: colors.ink,
          border: `2.5px solid ${valuePulse > 0.1 ? colors.accent : colors.border}`,
          fontFamily: fonts.mono,
          fontSize: 36,
          fontWeight: 800,
          letterSpacing: "-0.01em",
          textAlign: "center",
          boxShadow: shadows.cardSoft,
        }}
      >
        {row.value}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* TupleBox — 튜플 시각: 둥근 박스 안에 값들 가로 배열 + 인덱스 라벨       */
/* scene-07 에서 (37.5, 127.0) 좌표 시각.                                */
/* ------------------------------------------------------------------ */

export const TupleBox: React.FC<{
  label?: React.ReactNode;
  values: React.ReactNode[];
  indexLabels?: boolean;
  delaySec?: number;
  width?: number;
  height?: number;
}> = ({ label, values, indexLabels = true, delaySec = 0, width = 560, height = 200 }) => {
  return (
    <FadeIn delaySec={delaySec} translateY={14}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 14,
        }}
      >
        {label ? (
          <div
            style={{
              fontFamily: fonts.sans,
              fontSize: 22,
              fontWeight: 700,
              color: colors.accentDeep,
              letterSpacing: "0.02em",
            }}
          >
            {label}
          </div>
        ) : null}
        <div
          style={{
            width,
            height,
            borderRadius: 40,
            background: colors.bgWhite,
            border: `3px solid ${colors.accent}`,
            boxShadow: shadows.card,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 60,
            padding: "0 40px",
            position: "relative",
          }}
        >
          {values.map((v, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
              }}
            >
              {indexLabels ? (
                <div
                  style={{
                    fontFamily: fonts.mono,
                    fontSize: 20,
                    fontWeight: 700,
                    color: colors.accentDeep,
                    background: colors.accentSoft,
                    border: `1.5px solid ${colors.accent}`,
                    borderRadius: radii.pill,
                    padding: "2px 12px",
                  }}
                >
                  [{i}]
                </div>
              ) : null}
              <div
                style={{
                  fontFamily: fonts.mono,
                  fontSize: 56,
                  fontWeight: 800,
                  color: colors.ink,
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                }}
              >
                {v}
              </div>
            </div>
          ))}
        </div>
      </div>
    </FadeIn>
  );
};

/* ------------------------------------------------------------------ */
/* SetBox — 셋 시각: 큰 박스 안에 항목 가로 배열                        */
/*                                                                     */
/* 항목마다 enterAtSec / fadeOutAtSec 지원 — 중복 제거 시각용 (scene-09). */
/* ------------------------------------------------------------------ */

export type SetItem = {
  label: React.ReactNode;
  enterAtSec?: number;
  fadeOutAtSec?: number; // 항목이 중복으로 사라지는 시점 (회색 → 0 으로)
  strikeAtSec?: number;  // 빨간 X 줄 긋기 (fadeOutAtSec 직전)
  key?: string | number;
};

export const SetBox: React.FC<{
  label?: React.ReactNode;
  items: SetItem[];
  delaySec?: number;
  width?: number;
  height?: number;
}> = ({ label, items, delaySec = 0, width = 600, height = 180 }) => {
  return (
    <FadeIn delaySec={delaySec} translateY={14}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 14,
        }}
      >
        {label ? (
          <div
            style={{
              fontFamily: fonts.sans,
              fontSize: 22,
              fontWeight: 700,
              color: colors.accentDeep,
              letterSpacing: "0.02em",
            }}
          >
            {label}
          </div>
        ) : null}
        <div
          style={{
            width,
            height,
            borderRadius: radii.card,
            background: colors.bgWhite,
            border: `3px solid ${colors.accent}`,
            boxShadow: shadows.card,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 36,
            padding: "0 36px",
          }}
        >
          {items.map((item, i) => (
            <StrikeoutSetItem key={item.key ?? i} item={item} />
          ))}
        </div>
      </div>
    </FadeIn>
  );
};

const StrikeoutSetItem: React.FC<{ item: SetItem }> = ({ item }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = (item.enterAtSec ?? 0) * fps;
  const reveal = interpolate(frame, [enter, enter + 0.4 * fps], [0, 1], {
    easing: easeOutCubic,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Strike 줄긋기
  let strikeGrow = 0;
  if (typeof item.strikeAtSec === "number") {
    const sStart = item.strikeAtSec * fps;
    strikeGrow = interpolate(frame, [sStart, sStart + 0.5 * fps], [0, 1], {
      easing: easeOutCubic,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  }

  // FadeOut → 사라짐
  let fadeOpacity = 1;
  let fadeColor: string = colors.ink;
  if (typeof item.fadeOutAtSec === "number") {
    const fStart = item.fadeOutAtSec * fps;
    fadeOpacity = interpolate(frame, [fStart, fStart + 0.6 * fps], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    // 사라지기 전 회색으로 변하기 시작
    const grayProgress = interpolate(frame, [fStart - 0.4 * fps, fStart], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    fadeColor = grayProgress > 0.5 ? colors.inkSubtle : colors.ink;
  }

  return (
    <div
      style={{
        position: "relative",
        display: "inline-block",
        opacity: reveal * fadeOpacity,
        transform: `translateY(${(1 - reveal) * 8}px)`,
        fontFamily: fonts.mono,
        fontSize: 42,
        fontWeight: 800,
        color: fadeColor,
        letterSpacing: "-0.01em",
        padding: "4px 8px",
      }}
    >
      {item.label}
      {/* 빨간 줄 (strike) */}
      {strikeGrow > 0 ? (
        <span
          style={{
            position: "absolute",
            left: 8,
            right: `${(1 - strikeGrow) * 100}%`,
            top: "50%",
            height: 4,
            background: colors.danger,
            borderRadius: 2,
            transform: "translateY(-50%) rotate(-6deg)",
            pointerEvents: "none",
          }}
        />
      ) : null}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* ChecklistCard — 단일 체크리스트 카드 (scene-11 4단 정리에 4개 stack)  */
/*                                                                     */
/* ✓ 36×36 violet bg + label + desc 한 줄. dimmed 옵션 (회색 옅은 톤).    */
/* lesson-6 Scene12 의 checklist 항목 구조를 그대로 답습 (시즌 통일).      */
/* ------------------------------------------------------------------ */

export const ChecklistCard: React.FC<{
  label: React.ReactNode;
  desc: React.ReactNode;
  delaySec?: number;
  dimmed?: boolean;
}> = ({ label, desc, delaySec = 0, dimmed = false }) => {
  return (
    <FadeIn delaySec={delaySec} translateY={8}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
          fontFamily: fonts.sans,
          opacity: dimmed ? 0.5 : 1,
        }}
      >
        <span
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: dimmed ? colors.inkSubtle : colors.accent,
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
            fontWeight: 800,
            flexShrink: 0,
          }}
        >
          ✓
        </span>
        <div>
          <span
            style={{
              fontSize: 30,
              fontWeight: 800,
              color: colors.ink,
              letterSpacing: "-0.02em",
            }}
          >
            {label}
          </span>
          <span
            style={{
              fontSize: 24,
              fontWeight: 500,
              color: colors.inkMuted,
              letterSpacing: "-0.01em",
              marginLeft: 14,
            }}
          >
            — {desc}
          </span>
        </div>
      </div>
    </FadeIn>
  );
};

/* ------------------------------------------------------------------ */
/* easings re-export for scene files                                   */
/* ------------------------------------------------------------------ */

export { easeOutCubic, easeInOut };
