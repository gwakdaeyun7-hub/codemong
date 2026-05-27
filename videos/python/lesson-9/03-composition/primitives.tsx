/**
 * Shared visual primitives for Lesson 9.
 *
 * Base primitives (FadeIn / TypeOn / Card / CourseLabel / PageBackground /
 * AccentUnderline / LowerThird / CenteredStage / PyToken / CodePanel /
 * CodeLine / ConsolePanel / ConsoleLine / VarBox / QuestionMark /
 * HighlightBox / RedStrike / ChecklistCard) are carried over from
 * lesson-6 → lesson-7 → lesson-8 for visual continuity across the season
 * (시즌 통일 정형 답습).
 *
 * Lesson-9-specific primitives (further down):
 *   - ParameterArrow  — 호출 → 매개변수 자리로 흐르는 정방향 곡선 화살표
 *                       (scene-05: add(3,5) → a,b 자리)
 *                       R-012 준수: strokeWidth ≥ 6, length ≥ 160
 *   - ReturnArrow     — return 값이 호출 자리로 _되돌아오는_ 역방향 곡선 화살표
 *                       (scene-07: add 결과 8 → result, scene-08 우측: double(5) 결과 → result,
 *                        scene-09: double(7) 결과 → 호출자리)
 *                       R-012 준수: strokeWidth ≥ 6, length ≥ 160
 *   - RecipeCard      — 둥근 베이지 카드 (scene-03 레시피 카드 비유 — _아직 안 만든 상태_)
 *   - StateBoxSwap    — 회색(잠자는) → 노란색(실행 중) 박스 swap (scene-04)
 *                       R-002 준수: fade-out / fade-in 사이 0.2s buffer
 *   - ScopeMemoryPair — 두 칸 메모리 다이어그램 (scene-10 함수 바깥 / 함수 안)
 *                       함수 안 박스에 변수가 잠깐 만들어졌다가 _함수 끝나면 사라짐_
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
/* CourseLabel — "파이썬 기초 · 9강" pill                                */
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
/* CODE / CONSOLE PRIMITIVES (carry-over from lesson-3 → 8)            */
/* ================================================================== */

export type PyTokenKind =
  | "keyword"
  | "string"
  | "number"
  | "name"
  | "func"
  | "op"
  | "text"
  | "dictKey" // lesson-8 carry-over (9강 미사용 but 호환)
  | "dictValue"; // lesson-8 carry-over

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
/* RedStrike — 토큰 위에 빨간 줄 (lesson-6 carry-over, R-023 준수)        */
/* ------------------------------------------------------------------ */

export const RedStrike: React.FC<{
  children: React.ReactNode;
  delaySec?: number;
  durationSec?: number;
  lifespanSec?: number;
  fadeOutSec?: number;
  thickness?: number;
  color?: string;
  /**
   * Strike 회전 각도 (deg). 기본 0 = 가로 직선 — R-023 준수.
   */
  angleDeg?: number;
}> = ({
  children,
  delaySec = 0,
  durationSec = 0.5,
  lifespanSec,
  fadeOutSec = 0.4,
  thickness = 4,
  color = colors.danger,
  angleDeg = 0,
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
          transform: `translateY(-50%) rotate(${angleDeg}deg)`,
          pointerEvents: "none",
        }}
      />
    </span>
  );
};

/* ------------------------------------------------------------------ */
/* ChecklistCard — 단일 체크리스트 카드 (scene-11 4단 정리에 4개 stack)  */
/* lesson-6 → 7 → 8 의 checklist 항목 구조를 그대로 답습 (시즌 통일).      */
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

/* ================================================================== */
/* LESSON-9-SPECIFIC PRIMITIVES                                        */
/* ================================================================== */

/* ------------------------------------------------------------------ */
/* CurvedArrowSVG — 곡선 화살표 SVG 한 개 (정/역방향 공용 base)            */
/*                                                                     */
/* 두 점 (start, end) 사이를 quadratic Bezier 로 잇는 화살표.              */
/* `growProgress` (0~1) 에 따라 그려지는 정도 결정 — strokeDasharray 트릭.  */
/* R-012 준수: strokeWidth 7 default, length ≥ 160 권장.                  */
/* ------------------------------------------------------------------ */

const CurvedArrowSVG: React.FC<{
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  controlX: number;
  controlY: number;
  growProgress: number; // 0~1
  strokeWidth?: number;
  color?: string;
  arrowheadSize?: number;
}> = ({
  startX,
  startY,
  endX,
  endY,
  controlX,
  controlY,
  growProgress,
  strokeWidth = 7,
  color = colors.accent,
  arrowheadSize = 18,
}) => {
  // Approximate arc length via segment sampling (충분히 정확)
  const samples = 32;
  let totalLen = 0;
  const points: [number, number][] = [];
  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const x = (1 - t) * (1 - t) * startX + 2 * (1 - t) * t * controlX + t * t * endX;
    const y = (1 - t) * (1 - t) * startY + 2 * (1 - t) * t * controlY + t * t * endY;
    points.push([x, y]);
    if (i > 0) {
      const [px, py] = points[i - 1];
      totalLen += Math.hypot(x - px, y - py);
    }
  }

  // Arrowhead 방향 (end 직전 점 → end 의 각도)
  const [px, py] = points[points.length - 2];
  const angle = Math.atan2(endY - py, endX - px);
  const arrowVisible = growProgress >= 0.95;

  // dasharray = totalLen, dashoffset 으로 그려지는 정도 제어
  const dashOffset = totalLen * (1 - growProgress);

  return (
    <>
      <path
        d={`M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={totalLen}
        strokeDashoffset={dashOffset}
      />
      {arrowVisible ? (
        <polygon
          points={[
            [endX, endY],
            [
              endX - arrowheadSize * Math.cos(angle - Math.PI / 6),
              endY - arrowheadSize * Math.sin(angle - Math.PI / 6),
            ],
            [
              endX - arrowheadSize * Math.cos(angle + Math.PI / 6),
              endY - arrowheadSize * Math.sin(angle + Math.PI / 6),
            ],
          ]
            .map(([x, y]) => `${x},${y}`)
            .join(" ")}
          fill={color}
          opacity={(growProgress - 0.95) / 0.05}
        />
      ) : null}
    </>
  );
};

/* ------------------------------------------------------------------ */
/* ParameterArrow — 호출 → 매개변수 자리로 흐르는 정방향 곡선 화살표         */
/*                                                                     */
/* 한 SVG 안에 여러 화살표를 stagger 로 그려 넣을 수 있음.                  */
/* scene-05: add(3, 5) 의 3 → a, 5 → b 두 줄 화살표.                      */
/* ------------------------------------------------------------------ */

export type ArrowSpec = {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  controlX: number;
  controlY: number;
  delaySec: number; // 그려지기 시작하는 시각
  drawDurationSec?: number;
  color?: string;
};

export const ParameterArrow: React.FC<{
  width: number;
  height: number;
  arrows: ArrowSpec[];
  strokeWidth?: number;
}> = ({ width, height, arrows, strokeWidth = 7 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ overflow: "visible", display: "block" }}
    >
      {arrows.map((arrow, i) => {
        const start = arrow.delaySec * fps;
        const end = start + (arrow.drawDurationSec ?? 0.7) * fps;
        const grow = interpolate(frame, [start, end], [0, 1], {
          easing: easeOutCubic,
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <CurvedArrowSVG
            key={i}
            startX={arrow.startX}
            startY={arrow.startY}
            endX={arrow.endX}
            endY={arrow.endY}
            controlX={arrow.controlX}
            controlY={arrow.controlY}
            growProgress={grow}
            strokeWidth={strokeWidth}
            color={arrow.color ?? colors.accent}
          />
        );
      })}
    </svg>
  );
};

/* ------------------------------------------------------------------ */
/* ReturnArrow — return 값이 호출 자리로 _되돌아오는_ 역방향 곡선 화살표      */
/*                                                                     */
/* ParameterArrow 와 동일 구조 — 의미만 다름 (역방향).                       */
/* scene-07: return a + b 의 결과 8 → result = add(3, 5) 의 add(3, 5) 자리. */
/* scene-08 우측: double(5) 의 return 결과 → result =.                     */
/* scene-09: double(7) 의 결과 14 → 호출 자리.                              */
/* 라벨 ("돌려준 값") 옵션. 색상은 violet-deep (정방향과 시각 구분).            */
/* ------------------------------------------------------------------ */

export const ReturnArrow: React.FC<{
  width: number;
  height: number;
  arrows: ArrowSpec[];
  strokeWidth?: number;
  label?: React.ReactNode;
  labelDelaySec?: number;
  labelX?: number;
  labelY?: number;
}> = ({ width, height, arrows, strokeWidth = 7, label, labelDelaySec, labelX, labelY }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 라벨 fade-in 진행
  let labelOpacity = 1;
  if (typeof labelDelaySec === "number") {
    const start = labelDelaySec * fps;
    labelOpacity = interpolate(frame, [start, start + 0.5 * fps], [0, 1], {
      easing: easeOutCubic,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  }

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ overflow: "visible", display: "block" }}
    >
      {arrows.map((arrow, i) => {
        const start = arrow.delaySec * fps;
        const end = start + (arrow.drawDurationSec ?? 1.0) * fps;
        const grow = interpolate(frame, [start, end], [0, 1], {
          easing: easeOutCubic,
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <CurvedArrowSVG
            key={i}
            startX={arrow.startX}
            startY={arrow.startY}
            endX={arrow.endX}
            endY={arrow.endY}
            controlX={arrow.controlX}
            controlY={arrow.controlY}
            growProgress={grow}
            strokeWidth={strokeWidth}
            color={arrow.color ?? colors.accentDeep}
          />
        );
      })}
      {label && typeof labelX === "number" && typeof labelY === "number" ? (
        <g opacity={labelOpacity}>
          <foreignObject x={labelX - 80} y={labelY - 18} width={160} height={36}>
            <div
              style={{
                fontFamily: fonts.sans,
                fontSize: 18,
                fontWeight: 700,
                color: colors.accentDeep,
                background: colors.bgWhite,
                border: `1.5px solid ${colors.accent}`,
                borderRadius: radii.pill,
                padding: "4px 14px",
                textAlign: "center",
                letterSpacing: "-0.01em",
                whiteSpace: "nowrap",
                display: "inline-block",
              }}
            >
              {label}
            </div>
          </foreignObject>
        </g>
      ) : null}
    </svg>
  );
};

/* ------------------------------------------------------------------ */
/* RecipeCard — 둥근 베이지 카드 (scene-03 레시피 카드 비유)               */
/*                                                                     */
/* "함수를 종이에 적어둔 상태" 시각 메타포. _아직 실행 X_ 라벨이 우측 하단에     */
/* 떠 있음. 카드 안에 "이름:" / "할 일:" 두 줄.                             */
/* ------------------------------------------------------------------ */

export const RecipeCard: React.FC<{
  name: React.ReactNode;
  task: React.ReactNode;
  delaySec?: number;
  bodyDelaySec?: number;
  width?: number;
  height?: number;
}> = ({ name, task, delaySec = 0, bodyDelaySec, width = 380, height = 280 }) => {
  return (
    <FadeIn delaySec={delaySec} translateY={14}>
      <div
        style={{
          width,
          height,
          background: "#fef9c3", // amber-100/yellow-100 류 — 종이/스티커 느낌
          border: `2px solid #facc15`, // yellow-400
          borderRadius: 16,
          boxShadow: "0 6px 20px -8px rgba(120, 100, 30, 0.18), 0 2px 6px rgba(120, 100, 30, 0.08)",
          padding: "28px 32px",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          position: "relative",
          fontFamily: fonts.sans,
        }}
      >
        {/* 헤더 라벨 — "레시피 카드" */}
        <div
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: "#854d0e", // amber-800
            letterSpacing: "0.02em",
            textTransform: "uppercase",
          }}
        >
          레시피 카드
        </div>

        {/* 본문 — 이름 / 할 일 */}
        <FadeIn delaySec={bodyDelaySec ?? delaySec + 0.4} translateY={8}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 4 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
              <span style={{ fontSize: 22, fontWeight: 700, color: "#713f12" }}>이름:</span>
              <span
                style={{
                  fontFamily: fonts.mono,
                  fontSize: 28,
                  fontWeight: 800,
                  color: colors.ink,
                  letterSpacing: "-0.01em",
                }}
              >
                {name}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
              <span style={{ fontSize: 22, fontWeight: 700, color: "#713f12" }}>할 일:</span>
              <span
                style={{
                  fontSize: 24,
                  fontWeight: 500,
                  color: colors.inkSoft,
                  letterSpacing: "-0.01em",
                }}
              >
                {task}
              </span>
            </div>
          </div>
        </FadeIn>

        {/* 우측 하단 라벨 — "아직 안 만든 상태" */}
        <div
          style={{
            position: "absolute",
            bottom: 16,
            right: 18,
            fontSize: 16,
            fontWeight: 600,
            color: colors.inkMuted,
            fontStyle: "italic",
            letterSpacing: "-0.01em",
          }}
        >
          아직 안 만든 상태
        </div>
      </div>
    </FadeIn>
  );
};

/* ------------------------------------------------------------------ */
/* StateBoxSwap — 잠자는(회색) → 실행 중(노란) 박스 swap (scene-04)        */
/*                                                                     */
/* 박스 하나가 시간에 따라 색·라벨이 바뀜.                                   */
/* - sleeping (0~swapAtSec): 회색 배경 + "잠자는 상태" 라벨                  */
/* - running (swapAtSec~): 노란 배경 + "실행 중" 라벨, 옅게 pulse            */
/* R-002 (swap timing buffer) 준수.                                       */
/* ------------------------------------------------------------------ */

export const StateBoxSwap: React.FC<{
  delaySec?: number;
  swapAtSec: number;
  width?: number;
  height?: number;
  sleepingLabel?: string;
  runningLabel?: string;
}> = ({
  delaySec = 0,
  swapAtSec,
  width = 320,
  height = 200,
  sleepingLabel = "잠자는 상태",
  runningLabel = "실행 중",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 등장 fade-in
  const enter = delaySec * fps;
  const reveal = interpolate(frame, [enter, enter + 0.5 * fps], [0, 1], {
    easing: easeOutCubic,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // R-002 준수: sleeping fade-out [swapAtSec, swapAtSec + 0.3]
  //             running fade-in [swapAtSec + 0.5, swapAtSec + 1.0]
  //   → gap 0.2s
  const sleepFadeStart = swapAtSec * fps;
  const sleepFadeEnd = (swapAtSec + 0.3) * fps;
  const runFadeStart = (swapAtSec + 0.5) * fps;
  const runFadeEnd = (swapAtSec + 1.0) * fps;

  const sleepOpacity = interpolate(frame, [sleepFadeStart, sleepFadeEnd], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const runOpacity = interpolate(frame, [runFadeStart, runFadeEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 실행 중 박스의 옅은 pulse (등장 후 첫 1.2s)
  const pulseStart = runFadeEnd;
  const pulseScale = interpolate(
    frame,
    [pulseStart, pulseStart + 0.3 * fps, pulseStart + 0.7 * fps, pulseStart + 1.1 * fps],
    [1.0, 1.04, 1.0, 1.02],
    {
      easing: easeInOut,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        opacity: reveal,
        transform: `translateY(${(1 - reveal) * 10}px) scale(${pulseScale})`,
      }}
    >
      {/* Sleeping (회색) layer */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: colors.sleepingBg,
          border: `2px dashed ${colors.sleepingBorder}`,
          borderRadius: radii.card,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          opacity: sleepOpacity,
          fontFamily: fonts.sans,
        }}
      >
        <div
          style={{
            fontSize: 44,
            opacity: 0.6,
            lineHeight: 1,
          }}
        >
          {/* 자는 그림자 — 작은 z z z 텍스트 */}
          <span style={{ color: colors.inkSubtle, fontSize: 36, fontWeight: 800 }}>z z z</span>
        </div>
        <div
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: colors.inkMuted,
            letterSpacing: "-0.01em",
          }}
        >
          {sleepingLabel}
        </div>
      </div>

      {/* Running (노란) layer */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: colors.runningBg,
          border: `3px solid ${colors.runningBorder}`,
          borderRadius: radii.card,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          opacity: runOpacity,
          fontFamily: fonts.sans,
          boxShadow: "0 0 0 4px rgba(245, 158, 11, 0.18)",
        }}
      >
        <div
          style={{
            fontSize: 32,
            color: colors.runningBorder,
            fontWeight: 900,
            lineHeight: 1,
          }}
        >
          ▶
        </div>
        <div
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: "#92400e", // amber-900
            letterSpacing: "-0.01em",
          }}
        >
          {runningLabel}
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* ScopeMemoryPair — 두 칸 메모리 다이어그램 (scene-10)                     */
/*                                                                     */
/* 좌측 "함수 바깥" + 우측 "함수 안" 두 큰 박스.                              */
/* 함수 안 박스에 변수 라벨 (`x = 10`) 이 잠깐 등장 (enterAtSec) → 함수가      */
/* 끝나는 시점 (fadeOutAtSec) 에 회색으로 흐려지며 사라짐.                    */
/* 좌측 박스 안에는 빨간 X 마크 (notFoundAtSec) — _그런 이름 없음_.            */
/* ------------------------------------------------------------------ */

export const ScopeMemoryPair: React.FC<{
  delaySec?: number;
  innerVarLabel: React.ReactNode;
  innerVarEnterAtSec: number;
  outerNotFoundAtSec: number;
  width?: number;
  height?: number;
  gap?: number;
}> = ({
  delaySec = 0,
  innerVarLabel,
  innerVarEnterAtSec,
  outerNotFoundAtSec,
  width = 420,
  height = 280,
  gap = 40,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const containerEnter = delaySec * fps;
  const containerReveal = interpolate(frame, [containerEnter, containerEnter + 0.5 * fps], [0, 1], {
    easing: easeOutCubic,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 함수 안 변수 라벨 — 등장 후 _계속 유지_ (재편집).
  // x = 10 이 함수 범위 안에 있다는 것을 정적으로 보여주기 위해 fade-out / 회색 전환 /
  // "실행 중" 주황 펄스 ring 을 모두 제거했다 (사용자 요청).
  const innerStart = innerVarEnterAtSec * fps;
  const innerEnter = interpolate(frame, [innerStart, innerStart + 0.4 * fps], [0, 1], {
    easing: easeOutCubic,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 좌측 박스 안 빨간 X (이름 없음)
  const xStart = outerNotFoundAtSec * fps;
  const xReveal = interpolate(frame, [xStart, xStart + 0.5 * fps], [0, 1], {
    easing: easeOutCubic,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const xPulse = interpolate(
    frame,
    [xStart, xStart + 0.3 * fps, xStart + 0.7 * fps, xStart + 1.1 * fps],
    [1.0, 1.08, 1.0, 1.05],
    {
      easing: easeInOut,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  return (
    <div
      style={{
        display: "flex",
        gap,
        opacity: containerReveal,
        transform: `translateY(${(1 - containerReveal) * 12}px)`,
      }}
    >
      {/* 좌측 — 함수 바깥 */}
      <div
        style={{
          width,
          height,
          background: colors.scopeOuterBg,
          border: `2px solid ${colors.inkSubtle}`,
          borderRadius: radii.card,
          padding: "20px 24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          fontFamily: fonts.sans,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 16,
            left: 24,
            fontSize: 20,
            fontWeight: 700,
            color: colors.inkSoft,
            letterSpacing: "-0.01em",
          }}
        >
          함수 바깥
        </div>
        {/* 빨간 X 마크 + 라벨 (이름 없음) */}
        {xReveal > 0 ? (
          <div
            style={{
              opacity: xReveal,
              transform: `scale(${xPulse})`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 14,
            }}
          >
            <div
              style={{
                width: 100,
                height: 100,
                borderRadius: "50%",
                background: colors.bgWhite,
                border: `4px solid ${colors.danger}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: colors.danger,
                fontSize: 64,
                fontWeight: 900,
                lineHeight: 1,
                boxShadow: "0 0 0 6px rgba(239, 68, 68, 0.14)",
              }}
            >
              ✕
            </div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: colors.danger,
                letterSpacing: "-0.01em",
              }}
            >
              그런 이름 없음
            </div>
          </div>
        ) : null}
      </div>

      {/* 우측 — 함수 안 */}
      <div
        style={{
          width,
          height,
          background: colors.scopeInnerBg,
          border: `2px solid ${colors.accent}`,
          borderRadius: radii.card,
          padding: "20px 24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          fontFamily: fonts.sans,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 16,
            left: 24,
            fontSize: 20,
            fontWeight: 700,
            color: colors.accentInk,
            letterSpacing: "-0.01em",
          }}
        >
          함수 안
        </div>
        {/* 함수 안 변수 라벨 — 등장 후 계속 유지 (사라지지 않음) */}
        <div
          style={{
            opacity: innerEnter,
            transform: `translateY(${(1 - innerEnter) * 6}px)`,
            padding: "10px 22px",
            background: colors.bgWhite,
            border: `2px solid ${colors.accent}`,
            borderRadius: 14,
            fontFamily: fonts.mono,
            fontSize: 34,
            fontWeight: 800,
            color: colors.accentInk,
            letterSpacing: "-0.01em",
            boxShadow: shadows.cardSoft,
          }}
        >
          {innerVarLabel}
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* easings re-export for scene files                                   */
/* ------------------------------------------------------------------ */

export { easeOutCubic, easeInOut };
