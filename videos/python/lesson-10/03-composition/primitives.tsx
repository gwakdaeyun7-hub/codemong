/**
 * Shared visual primitives for Lesson 10.
 *
 * Base primitives (FadeIn / TypeOn / Card / CourseLabel / PageBackground /
 * AccentUnderline / LowerThird / CenteredStage / PyToken / CodePanel /
 * CodeLine / ConsolePanel / ConsoleLine / VarBox / QuestionMark /
 * HighlightBox / SwapLabel / EmphasisPulse / InlineCallout / ChecklistCard)
 * are carried over from lesson-8 for visual continuity across the season
 * (시즌 통일 정형 답습).
 *
 * Lesson-10-specific primitives (further down):
 *   - ToolBox          — 도구 상자 일러스트 (회색/정상색 토글 + 상태 라벨).
 *                        scene-02 (닫힌, 미리 보기) / scene-03 (import 만 — 회색) /
 *                        scene-04 (호출 — 회색→정상색 변환).
 *   - FlowArrow        — 곡선 화살표 (호출/결과 흐름). strokeWidth 6 / length ≥ 180.
 *                        scene-04 (도구 꺼냄 → 결과 되돌아옴),
 *                        scene-07 (결과 변수에 받기),
 *                        scene-09 (choice 카드 선택 → 결과).
 *   - FourPartBox      — 점 표기 4분해 색깔 박스. scene-05.
 *   - DieFace          — 주사위 도형 (간단한 mono 회색 박스 + 도트 6개). scene-06.
 *   - DiceFace1to6     — `1` ~ `6` 6칸 가로 배열 + 마지막 `6` 강조 라벨. scene-06.
 *   - RPSCard          — 가위·바위·보 세 카드 가로 배열 (간단한 도형). scene-09.
 *   - SideNoteCard     — 점선 border + opacity 0.7 사이드 카드. scene-10
 *                        (`from random import randint` 존재만 짚기).
 *   - QuestionBox      — Active Recall 질문/정답 박스 (정답 swap, R-004/R-016 동기).
 *
 * All animations are frame-driven via useCurrentFrame() + interpolate().
 * No CSS transitions / Tailwind animate-* classes — those break Remotion renders.
 *
 * R-019 준수: SwapLabel 의 parent + 두 layer 에 whiteSpace: "nowrap" 강제.
 * R-008 준수: 좌·우 비교 카드는 동일 width/height — scene-07 / scene-10 에서.
 * R-009 준수: 코드 키워드는 모두 소문자 — textTransform: uppercase 미사용
 *             (UPPER 라벨은 한국어/숫자만 — CodeLabel / CourseLabel 의 "UPPERCASE"
 *             property 가 자동 적용되지 않도록 fonts.mono 토큰엔 textTransform 미적용).
 */

import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts, radii, shadows } from "./theme";

const easeOutCubic = Easing.bezier(0.16, 1, 0.3, 1);
const easeInOut = Easing.bezier(0.45, 0, 0.55, 1);

/* ================================================================== */
/* CARRY-OVER PRIMITIVES (lesson-8 답습 — 시즌 통일)                    */
/* ================================================================== */

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
/* CourseLabel — "파이썬 기초 · 10강" pill                              */
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
/* AccentUnderline                                                     */
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
/* LowerThird                                                          */
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
/* CenteredStage                                                       */
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
/* CODE / CONSOLE PRIMITIVES (carry-over from lesson-8)                */
/* ================================================================== */

export type PyTokenKind =
  | "keyword"
  | "string"
  | "number"
  | "name"
  | "func"
  | "op"
  | "text"
  | "dictKey"
  | "dictValue";

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
/* VarBox — 변수 박스                                                   */
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
        style={{ opacity: labelDimmed ? 0.4 : undefined }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            height: 36,
            lineHeight: 1,
            padding: "0 18px",
            borderRadius: radii.pill,
            background: colors.accentSoft,
            color: colors.accentInk,
            fontFamily: fonts.mono,
            fontSize: labelFontSize,
            fontWeight: 700,
            letterSpacing: "-0.01em",
            border: `1px solid ${colors.accent}`,
            whiteSpace: "nowrap",
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
/* QuestionMark — Active recall 정적 동안의 물음표 (R-012: size ≥ 180)  */
/* ------------------------------------------------------------------ */

export const QuestionMark: React.FC<{
  size?: number;
  delaySec?: number;
  lifespanSec?: number;
  color?: string;
}> = ({ size = 200, delaySec = 0, lifespanSec = 1.5, color = colors.accent }) => {
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
/* HighlightBox — 정적 형광 박스                                        */
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
/* SwapLabel — 두 layer 가 같은 좌표에서 fade-out → fade-in              */
/*                                                                     */
/* R-002 준수: oldFadeEnd → newFadeStart 사이 0.2초 buffer 권장.        */
/* R-019 준수: parent + 두 layer 모두 whiteSpace: "nowrap" 강제.        */
/* ------------------------------------------------------------------ */

export const SwapLabel: React.FC<{
  initial: React.ReactNode;
  newLabel: React.ReactNode;
  oldFadeOutAtSec: number;
  newFadeInAtSec: number;
  fadeDurationSec?: number;
  style?: React.CSSProperties;
}> = ({
  initial,
  newLabel,
  oldFadeOutAtSec,
  newFadeInAtSec,
  fadeDurationSec = 0.4,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const oldFadeStart = oldFadeOutAtSec * fps;
  const oldFadeEnd = oldFadeStart + fadeDurationSec * fps;
  const newFadeStart = newFadeInAtSec * fps;
  const newFadeEnd = newFadeStart + fadeDurationSec * fps;

  const oldOpacity = interpolate(frame, [oldFadeStart, oldFadeEnd], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const newOpacity = interpolate(frame, [newFadeStart, newFadeEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

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
/* EmphasisPulse — 한 토큰을 짧게 강조 펄스 (scale + opacity)           */
/* (R-005 주의: 이미 색상/굵기 강조된 토큰엔 사용 자제)                  */
/* ------------------------------------------------------------------ */

export const EmphasisPulse: React.FC<{
  children: React.ReactNode;
  atSec: number;
  durationSec?: number;
  scaleAmp?: number;
}> = ({ children, atSec, durationSec = 0.9, scaleAmp = 0.08 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = atSec * fps;
  const peak = start + (durationSec * fps) / 2;
  const end = start + durationSec * fps;
  const scale = interpolate(frame, [start, peak, end], [1, 1 + scaleAmp, 1], {
    easing: easeInOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <span style={{ display: "inline-block", transform: `scale(${scale})` }}>
      {children}
    </span>
  );
};

/* ------------------------------------------------------------------ */
/* InlineCallout — 토큰 옆 콜아웃 박스                                  */
/* (R-010: panel header / 코드 본문 / 타이틀 텍스트와 겹치지 않게)       */
/* ------------------------------------------------------------------ */

export const InlineCallout: React.FC<{
  title: React.ReactNode;
  body?: React.ReactNode;
  width?: number;
  arrowSide?: "bottom" | "left" | "none";
  delaySec?: number;
}> = ({ title, body, width = 320, arrowSide = "bottom", delaySec = 0 }) => {
  return (
    <FadeIn delaySec={delaySec} translateY={6}>
      <div
        style={{
          width,
          padding: "14px 18px",
          background: colors.bgWhite,
          border: `1.5px solid ${colors.accent}`,
          borderRadius: radii.card,
          boxShadow: shadows.card,
          fontFamily: fonts.sans,
          color: colors.ink,
          position: "relative",
        }}
      >
        <div
          style={{
            fontSize: 20,
            fontWeight: 800,
            color: colors.accentDeep,
            letterSpacing: "-0.01em",
            lineHeight: 1.3,
          }}
        >
          {title}
        </div>
        {body ? (
          <div
            style={{
              fontSize: 18,
              fontWeight: 500,
              color: colors.inkSoft,
              letterSpacing: "-0.01em",
              lineHeight: 1.4,
              marginTop: 6,
            }}
          >
            {body}
          </div>
        ) : null}
        {arrowSide === "bottom" ? (
          <div
            style={{
              position: "absolute",
              bottom: -10,
              left: "50%",
              transform: "translateX(-50%)",
              width: 0,
              height: 0,
              borderLeft: "10px solid transparent",
              borderRight: "10px solid transparent",
              borderTop: `10px solid ${colors.accent}`,
            }}
          />
        ) : arrowSide === "left" ? (
          <div
            style={{
              position: "absolute",
              left: -10,
              top: "50%",
              transform: "translateY(-50%)",
              width: 0,
              height: 0,
              borderTop: "10px solid transparent",
              borderBottom: "10px solid transparent",
              borderRight: `10px solid ${colors.accent}`,
            }}
          />
        ) : null}
      </div>
    </FadeIn>
  );
};

/* ------------------------------------------------------------------ */
/* ChecklistCard — scene-11 4단 정리 단일 카드                          */
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
/* LESSON-10-SPECIFIC PRIMITIVES                                       */
/* ================================================================== */

/* ------------------------------------------------------------------ */
/* ToolBox — 도구 상자 일러스트 (회색/정상색 토글)                       */
/*                                                                     */
/* state 가 "closed" 면 자물쇠 표시, "ready"(=open 회색) 면 도구 그림자,  */
/* "active" 면 정상색 (violet) + 도구 살아 있음. state 전환은 frame      */
/* 보간으로 색 interpolation (회색 → 정상색).                            */
/*                                                                     */
/* scene-02: state="closed" (자물쇠).                                  */
/* scene-03: state="ready" (회색, import 만 됐을 때).                   */
/* scene-04: state 가 ready → active 로 동적 전환 (activeAtSec 시점).   */
/* ------------------------------------------------------------------ */

export type ToolBoxState = "closed" | "ready" | "active";

export const ToolBox: React.FC<{
  state: ToolBoxState;
  /** state="active" 인 경우, ready → active 색 변환 시작 시점 (sec). undefined 면 즉시. */
  activeAtSec?: number;
  /** 색 변환 duration (sec). */
  activeDurationSec?: number;
  /** 박스 안에 보이는 도구 라벨 (예: ["randint", "choice"]). */
  tools?: string[];
  /** 박스 윗면 라벨 (대부분 "random"). */
  topLabel?: React.ReactNode;
  width?: number;
  height?: number;
  delaySec?: number;
  style?: React.CSSProperties;
}> = ({
  state,
  activeAtSec = 0,
  activeDurationSec = 0.6,
  tools = ["randint", "choice"],
  topLabel = "random",
  width = 360,
  height = 220,
  delaySec = 0,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 색 변환 (ready → active) — frame 기반 보간. state="closed" 또는 "ready" 면 항상 0.
  // state="active" 면 0 → 1 (activeAtSec 시점에 시작).
  let activeProgress = 0;
  if (state === "active") {
    const start = activeAtSec * fps;
    const end = start + activeDurationSec * fps;
    activeProgress = interpolate(frame, [start, end], [0, 1], {
      easing: easeOutCubic,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  }

  // 색 보간 — 회색 ↔ 정상색
  const bg = activeProgress < 0.001 ? colors.boxGrey : colors.boxActive;
  const border = activeProgress < 0.001 ? colors.boxGreyBorder : colors.boxActiveBorder;
  const labelColor = activeProgress < 0.001 ? colors.boxGreyText : colors.boxActiveText;

  // 부드러운 색 fade — overlay layer 두 개
  return (
    <FadeIn delaySec={delaySec} translateY={10} style={style}>
      <div
        style={{
          position: "relative",
          width,
          height,
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
        }}
      >
        {/* 상자 본체 */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            borderRadius: 18,
            background: bg,
            border: `2.5px solid ${border}`,
            boxShadow: shadows.cardSoft,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* 상자 윗면 (라벨 영역) */}
          <div
            style={{
              height: 56,
              borderBottom: `2px solid ${border}`,
              background: activeProgress < 0.001
                ? "rgba(228, 228, 231, 0.5)"
                : "rgba(196, 181, 253, 0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              padding: "0 18px",
              position: "relative",
            }}
          >
            {/* 좌측: 자물쇠 또는 손잡이 */}
            {state === "closed" ? (
              <span
                style={{
                  position: "absolute",
                  left: 18,
                  width: 26,
                  height: 26,
                  borderRadius: 6,
                  background: colors.inkSubtle,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                  fontSize: 16,
                  fontWeight: 800,
                }}
              >
                ⌂
              </span>
            ) : null}
            {/* 우측: 손잡이 (작은 회색 도형) */}
            <span
              style={{
                position: "absolute",
                right: 18,
                width: 22,
                height: 8,
                borderRadius: 4,
                background: activeProgress < 0.001 ? colors.boxGreyBorder : colors.boxActiveBorder,
                opacity: 0.55,
              }}
            />
            <span
              style={{
                fontFamily: fonts.mono,
                fontSize: 30,
                fontWeight: 800,
                color: labelColor,
                letterSpacing: "-0.01em",
              }}
            >
              {topLabel}
            </span>
          </div>
          {/* 상자 안 — 도구 그림자 */}
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 24,
              padding: "20px 24px",
            }}
          >
            {tools.map((t, i) => (
              <div
                key={i}
                style={{
                  fontFamily: fonts.mono,
                  fontSize: 22,
                  fontWeight: 700,
                  color: activeProgress < 0.001
                    ? colors.inkSubtle
                    : colors.accentInk,
                  background: activeProgress < 0.001
                    ? "rgba(161, 161, 170, 0.18)"
                    : "rgba(139, 92, 246, 0.16)",
                  border: `1.5px ${activeProgress < 0.001 ? "dashed" : "solid"} ${
                    activeProgress < 0.001 ? colors.inkSubtle : colors.accent
                  }`,
                  borderRadius: radii.md,
                  padding: "8px 16px",
                  letterSpacing: "-0.01em",
                  opacity: state === "closed" ? 0.5 : 0.95,
                }}
              >
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>
    </FadeIn>
  );
};

/* ------------------------------------------------------------------ */
/* FlowArrow — 곡선 화살표 (호출/결과 흐름 메타포)                       */
/*                                                                     */
/* R-012 준수: length ≥ 180, strokeWidth ≥ 6.                          */
/* 두 점 (start / end) 사이 SVG cubic-bezier curve. delaySec 시점에      */
/* growth 0 → 1 로 화살표가 자라남.                                     */
/* ------------------------------------------------------------------ */

export const FlowArrow: React.FC<{
  /** SVG viewBox 안 시작점 */
  startX: number;
  startY: number;
  /** 끝점 (화살촉 위치) */
  endX: number;
  endY: number;
  /** 곡률 (양수: 위로 휨, 음수: 아래로 휨) */
  curve?: number;
  delaySec?: number;
  durationSec?: number;
  strokeWidth?: number;
  color?: string;
  /** SVG 컨테이너 width/height. */
  width?: number;
  height?: number;
  style?: React.CSSProperties;
}> = ({
  startX,
  startY,
  endX,
  endY,
  curve = 60,
  delaySec = 0,
  durationSec = 0.6,
  strokeWidth = 6,
  color = colors.accent,
  width = 320,
  height = 200,
  style,
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

  // Cubic Bezier control points (위로 휘는 곡선)
  const ctrlX1 = startX + (endX - startX) * 0.35;
  const ctrlY1 = startY - curve;
  const ctrlX2 = startX + (endX - startX) * 0.65;
  const ctrlY2 = endY - curve;

  const path = `M ${startX} ${startY} C ${ctrlX1} ${ctrlY1}, ${ctrlX2} ${ctrlY2}, ${endX} ${endY}`;

  // pathLength 를 1 로 정규화하면 stroke-dashoffset 으로 부분 그리기
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ position: "absolute", overflow: "visible", ...style }}
    >
      <defs>
        <marker
          id={`fa-arrow-${color.replace("#", "")}`}
          viewBox="0 0 12 12"
          refX={9}
          refY={6}
          markerWidth={6}
          markerHeight={6}
          orient="auto"
        >
          <path d="M 0 0 L 12 6 L 0 12 z" fill={color} />
        </marker>
      </defs>
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - grow}
        markerEnd={grow > 0.92 ? `url(#fa-arrow-${color.replace("#", "")})` : undefined}
      />
    </svg>
  );
};

/* ------------------------------------------------------------------ */
/* FourPartBox — 점 표기 4분해 (scene-05)                               */
/*                                                                     */
/* `random`/`.`/`randint`/`(1, 6)` 네 부분을 색깔 다른 박스로 분해.       */
/* 각 박스 위에 작은 화살표 ↓ + 의미 라벨.                                 */
/* ------------------------------------------------------------------ */

export type FourPartBoxPart = {
  token: string;
  meaningLabel: string;
  color: "accent" | "yellow" | "pink" | "blue";
  enterAtSec: number;
  pulseAtSec?: number;
};

const partColors: Record<
  FourPartBoxPart["color"],
  { soft: string; deep: string; border: string }
> = {
  accent: {
    soft: colors.fourBoxAccentSoft,
    deep: colors.fourBoxAccentDeep,
    border: colors.fourBoxAccentBorder,
  },
  yellow: {
    soft: colors.fourBoxYellowSoft,
    deep: colors.fourBoxYellowDeep,
    border: colors.fourBoxYellowBorder,
  },
  pink: {
    soft: colors.fourBoxPinkSoft,
    deep: colors.fourBoxPinkDeep,
    border: colors.fourBoxPinkBorder,
  },
  blue: {
    soft: colors.fourBoxBlueSoft,
    deep: colors.fourBoxBlueDeep,
    border: colors.fourBoxBlueBorder,
  },
};

export const FourPartBox: React.FC<{
  parts: FourPartBoxPart[];
  tokenFontSize?: number;
  labelFontSize?: number;
  gap?: number;
}> = ({ parts, tokenFontSize = 64, labelFontSize = 22, gap = 16 }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap,
      }}
    >
      {parts.map((p, i) => (
        <FourPartItem
          key={i}
          part={p}
          tokenFontSize={tokenFontSize}
          labelFontSize={labelFontSize}
        />
      ))}
    </div>
  );
};

const FourPartItem: React.FC<{
  part: FourPartBoxPart;
  tokenFontSize: number;
  labelFontSize: number;
}> = ({ part, tokenFontSize, labelFontSize }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enterStart = part.enterAtSec * fps;
  const reveal = interpolate(frame, [enterStart, enterStart + 0.5 * fps], [0, 1], {
    easing: easeOutCubic,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  let pulse = 1;
  if (typeof part.pulseAtSec === "number") {
    const pStart = part.pulseAtSec * fps;
    pulse = interpolate(
      frame,
      [pStart, pStart + 0.25 * fps, pStart + 0.6 * fps, pStart + 1.0 * fps],
      [1.0, 1.08, 1.0, 1.0],
      {
        easing: easeInOut,
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      },
    );
  }
  const pal = partColors[part.color];
  return (
    <div
      style={{
        opacity: reveal,
        transform: `translateY(${(1 - reveal) * 10}px) scale(${pulse})`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
      }}
    >
      {/* 의미 라벨 (작은 글씨) */}
      <div
        style={{
          fontFamily: fonts.sans,
          fontSize: labelFontSize,
          fontWeight: 700,
          color: pal.deep,
          letterSpacing: "-0.01em",
          whiteSpace: "nowrap",
        }}
      >
        {part.meaningLabel}
      </div>
      {/* 작은 ↓ 화살표 */}
      <div
        style={{
          width: 0,
          height: 0,
          borderLeft: "8px solid transparent",
          borderRight: "8px solid transparent",
          borderTop: `12px solid ${pal.deep}`,
          opacity: 0.7,
        }}
      />
      {/* 토큰 박스 */}
      <div
        style={{
          padding: "10px 18px",
          background: pal.soft,
          border: `2.5px solid ${pal.border}`,
          borderRadius: radii.md,
          fontFamily: fonts.mono,
          fontSize: tokenFontSize,
          fontWeight: 800,
          color: pal.deep,
          letterSpacing: "-0.02em",
          lineHeight: 1,
          whiteSpace: "pre",
        }}
      >
        {part.token}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* DieFace — 주사위 도형 (scene-06)                                     */
/* ------------------------------------------------------------------ */

export const DieFace: React.FC<{
  size?: number;
  pips?: 1 | 2 | 3 | 4 | 5 | 6;
  delaySec?: number;
  style?: React.CSSProperties;
}> = ({ size = 90, pips = 4, delaySec = 0, style }) => {
  const dotSize = Math.max(8, Math.round(size * 0.13));
  const positions: Record<1 | 2 | 3 | 4 | 5 | 6, [number, number][]> = {
    1: [[0.5, 0.5]],
    2: [
      [0.25, 0.25],
      [0.75, 0.75],
    ],
    3: [
      [0.25, 0.25],
      [0.5, 0.5],
      [0.75, 0.75],
    ],
    4: [
      [0.25, 0.25],
      [0.75, 0.25],
      [0.25, 0.75],
      [0.75, 0.75],
    ],
    5: [
      [0.25, 0.25],
      [0.75, 0.25],
      [0.5, 0.5],
      [0.25, 0.75],
      [0.75, 0.75],
    ],
    6: [
      [0.25, 0.2],
      [0.75, 0.2],
      [0.25, 0.5],
      [0.75, 0.5],
      [0.25, 0.8],
      [0.75, 0.8],
    ],
  };
  return (
    <FadeIn delaySec={delaySec} translateY={8} style={style}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: 14,
          background: colors.bgWhite,
          border: `2px solid ${colors.inkSubtle}`,
          boxShadow: shadows.cardSoft,
          position: "relative",
        }}
      >
        {positions[pips].map((p, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: dotSize,
              height: dotSize,
              borderRadius: "50%",
              background: colors.inkSoft,
              left: p[0] * size - dotSize / 2,
              top: p[1] * size - dotSize / 2,
            }}
          />
        ))}
      </div>
    </FadeIn>
  );
};

/* ------------------------------------------------------------------ */
/* DiceFace1to6Row — 6칸 가로 배열 (`1` ~ `6`) + 마지막 `6` 강조 라벨    */
/* scene-06                                                            */
/* ------------------------------------------------------------------ */

export const DiceFace1to6Row: React.FC<{
  cellSize?: number;
  gap?: number;
  enterStartSec?: number;
  /** 칸당 등장 stagger 간격 (sec). */
  perCellStaggerSec?: number;
  /** 마지막 칸 (`6`) 의 펄스 시점 (sec). undefined 면 펄스 없음. */
  pulseLastAtSec?: number;
  /** 마지막 칸 (`6`) 의 2번째 펄스 시점 (sec). undefined 면 2번째 펄스 없음. 첫 펄스와 동일 형태. */
  pulseLastAtSec2?: number;
  /** 어떤 칸 위에 주사위가 멈춰 있는지 (1~6). undefined 면 표시 안 함. */
  dieOnCell?: 1 | 2 | 3 | 4 | 5 | 6;
  /** 주사위 등장 시점 (sec). dieOnCell 가 있을 때만 의미. */
  dieEnterAtSec?: number;
}> = ({
  cellSize = 90,
  gap = 14,
  enterStartSec = 0,
  perCellStaggerSec = 0.25,
  pulseLastAtSec,
  pulseLastAtSec2,
  dieOnCell,
  dieEnterAtSec = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cells = [1, 2, 3, 4, 5, 6] as const;

  // 마지막 칸 펄스 (각 펄스 0→1→1→0, 1.0s). 두 시점을 받아 max 합성 — 각 펄스가
  // narration 발화에 독립 동기 (R-016). 시점이 1.0s 이상 떨어져 있으면 겹침 0.
  const pulseEnvelope = (atSec: number): number => {
    const pStart = atSec * fps;
    return interpolate(
      frame,
      [pStart, pStart + 0.25 * fps, pStart + 0.6 * fps, pStart + 1.0 * fps],
      [0, 1, 1, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    );
  };
  let lastPulse = 0;
  if (typeof pulseLastAtSec === "number") {
    lastPulse = Math.max(lastPulse, pulseEnvelope(pulseLastAtSec));
  }
  if (typeof pulseLastAtSec2 === "number") {
    lastPulse = Math.max(lastPulse, pulseEnvelope(pulseLastAtSec2));
  }

  // 주사위 이동 (좌 → 우, 즉 4번 칸 위로). dieOnCell 가 4 면 4번 칸 위.
  const totalWidth = 6 * cellSize + 5 * gap;
  const dieStartProgressEnd = (dieEnterAtSec + 0.8) * fps;
  const dieOpacity = typeof dieOnCell === "number"
    ? interpolate(frame, [dieEnterAtSec * fps, dieStartProgressEnd], [0, 1], {
        easing: easeOutCubic,
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  const dieTargetX = typeof dieOnCell === "number"
    ? (dieOnCell - 1) * (cellSize + gap) + cellSize / 2
    : 0;

  return (
    <div style={{ position: "relative", width: totalWidth, height: cellSize + 80 }}>
      {/* 칸들 */}
      <div
        style={{
          position: "absolute",
          top: 56,
          left: 0,
          display: "flex",
          gap,
        }}
      >
        {cells.map((n, i) => {
          const enterStart = (enterStartSec + i * perCellStaggerSec) * fps;
          const reveal = interpolate(frame, [enterStart, enterStart + 0.4 * fps], [0, 1], {
            easing: easeOutCubic,
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const isLast = n === 6;
          const pulseScale = isLast ? 1 + lastPulse * 0.08 : 1;
          return (
            <div
              key={n}
              style={{
                width: cellSize,
                height: cellSize,
                borderRadius: 14,
                background: isLast && lastPulse > 0.1
                  ? colors.accentSoft
                  : colors.bgWhite,
                border: `2.5px solid ${colors.accent}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: fonts.mono,
                fontSize: 56,
                fontWeight: 800,
                color: isLast && lastPulse > 0.1 ? colors.accentInk : colors.accentDeep,
                letterSpacing: "-0.02em",
                opacity: reveal,
                transform: `translateY(${(1 - reveal) * 8}px) scale(${pulseScale})`,
                boxShadow: shadows.cardSoft,
              }}
            >
              {n}
            </div>
          );
        })}
      </div>
      {/* 마지막 6 위 "끝값 포함" 라벨 */}
      <div
        style={{
          position: "absolute",
          top: 18,
          left: 5 * (cellSize + gap) - 20,
          fontFamily: fonts.sans,
          fontSize: 22,
          fontWeight: 800,
          color: colors.accentDeep,
          letterSpacing: "-0.01em",
          opacity: interpolate(
            frame,
            [(enterStartSec + 5 * perCellStaggerSec + 0.4) * fps, (enterStartSec + 5 * perCellStaggerSec + 0.9) * fps],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          ),
          whiteSpace: "nowrap",
        }}
      >
        끝값 포함
      </div>
      {/* 주사위 (옵션) */}
      {typeof dieOnCell === "number" ? (
        <div
          style={{
            position: "absolute",
            top: -20,
            left: dieTargetX - cellSize / 2,
            opacity: dieOpacity,
          }}
        >
          <DieFace size={cellSize - 16} pips={dieOnCell} delaySec={0} />
        </div>
      ) : null}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* RPSCard — 가위·바위·보 세 카드 (scene-09)                            */
/* ------------------------------------------------------------------ */

export type RPSChoice = "가위" | "바위" | "보";

/* ------------------------------------------------------------------ */
/* 가위·바위·보 손 제스처 SVG (이모지 금지 — 직접 그린 단색 실루엣)        */
/*                                                                     */
/* 세 손 모두 viewBox "0 0 64 72" 공유 → 같은 비율. 위를 향한 손.         */
/* fill="currentColor" 로 RPSCard 의 색 로직(accentDeep / inkSoft) 상속. */
/* ------------------------------------------------------------------ */

/** 바위 — 꽉 쥔 주먹 (✊). 손등 + 위쪽 네 손가락 마디 + 좌측 엄지. */
const RockHand: React.FC<{ size?: number }> = ({ size = 78 }) => (
  <svg width={size} height={size} viewBox="0 0 64 72" fill="none" aria-hidden>
    {/* 주먹 본체 (손등 + 접힌 손가락) */}
    <path
      d="M16 30
         a4 4 0 0 1 4-4 a4 4 0 0 1 4 4
         a4 4 0 0 1 4-4 a4 4 0 0 1 4 4
         a4 4 0 0 1 4-4 a4 4 0 0 1 4 4
         a4 4 0 0 1 4-4 a4 4 0 0 1 4 4
         v18 a14 14 0 0 1 -14 14 h-8 a14 14 0 0 1 -14 -14 z"
      fill="currentColor"
    />
    {/* 엄지 (좌측에서 주먹을 감쌈) */}
    <path
      d="M16 34 a7 7 0 0 0 -7 7 a6 6 0 0 0 6 6 l3 0 z"
      fill="currentColor"
    />
  </svg>
);

/** 보 — 다섯 손가락 펼친 손바닥 (✋). 손바닥 + 위로 뻗은 다섯 손가락. */
const PaperHand: React.FC<{ size?: number }> = ({ size = 78 }) => (
  <svg width={size} height={size} viewBox="0 0 64 72" fill="none" aria-hidden>
    {/* 손바닥 */}
    <path
      d="M14 40 a18 18 0 0 1 36 0 v6 a14 14 0 0 1 -14 14 h-8 a14 14 0 0 1 -14 -14 z"
      fill="currentColor"
    />
    {/* 네 손가락 (검지~새끼) */}
    <rect x="18" y="14" width="6" height="30" rx="3" fill="currentColor" />
    <rect x="27" y="9" width="6" height="35" rx="3" fill="currentColor" />
    <rect x="36" y="11" width="6" height="33" rx="3" fill="currentColor" />
    <rect x="45" y="18" width="6" height="26" rx="3" fill="currentColor" />
    {/* 엄지 (좌측 사선) */}
    <rect
      x="6"
      y="30"
      width="6"
      height="20"
      rx="3"
      fill="currentColor"
      transform="rotate(-38 9 40)"
    />
  </svg>
);

/** 가위 — 검지+중지를 V자로 편 손 (✌). 주먹 본체 + 위로 벌어진 두 손가락. */
const ScissorsHand: React.FC<{ size?: number }> = ({ size = 78 }) => (
  <svg width={size} height={size} viewBox="0 0 64 72" fill="none" aria-hidden>
    {/* 주먹 본체 (접힌 약지·새끼 + 엄지) */}
    <path
      d="M20 38 a16 16 0 0 1 32 0 v8 a14 14 0 0 1 -14 14 h-6 a14 14 0 0 1 -14 -14 z"
      fill="currentColor"
    />
    {/* 검지 (좌측, 살짝 벌어짐) */}
    <rect
      x="22"
      y="8"
      width="6"
      height="34"
      rx="3"
      fill="currentColor"
      transform="rotate(-14 25 25)"
    />
    {/* 중지 (우측, 살짝 벌어짐) */}
    <rect
      x="40"
      y="8"
      width="6"
      height="34"
      rx="3"
      fill="currentColor"
      transform="rotate(14 43 25)"
    />
  </svg>
);

const rpsHand: Record<RPSChoice, React.FC<{ size?: number }>> = {
  가위: ScissorsHand,
  바위: RockHand,
  보: PaperHand,
};

export const RPSCard: React.FC<{
  choice: RPSChoice;
  delaySec?: number;
  /** 카드가 살짝 떠올라 강조될 시점 (sec). undefined 면 강조 안 함. */
  liftAtSec?: number;
  size?: number;
}> = ({ choice, delaySec = 0, liftAtSec, size = 180 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  let lift = 0;
  let scaleAmp = 0;
  if (typeof liftAtSec === "number") {
    const lStart = liftAtSec * fps;
    const lift01 = interpolate(frame, [lStart, lStart + 0.5 * fps], [0, 1], {
      easing: easeOutCubic,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    lift = lift01 * 30;
    scaleAmp = lift01 * 0.1;
  }

  return (
    <FadeIn delaySec={delaySec} translateY={12}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: 20,
          background: lift > 0.1 ? colors.accentSoft : colors.bgWhite,
          border: lift > 0.1
            ? `3px solid ${colors.accent}`
            : `2px solid ${colors.border}`,
          boxShadow: lift > 0.1 ? shadows.card : shadows.cardSoft,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          transform: `translateY(${-lift}px) scale(${1 + scaleAmp})`,
        }}
      >
        {/* 손 제스처 SVG — currentColor 로 색 로직 상속 (lift 강조 시 accentDeep) */}
        <div
          style={{
            color: lift > 0.1 ? colors.accentDeep : colors.inkSoft,
            lineHeight: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {(() => {
            const Hand = rpsHand[choice];
            return <Hand size={78} />;
          })()}
        </div>
        <div
          style={{
            fontFamily: fonts.sans,
            fontSize: 36,
            fontWeight: 800,
            color: lift > 0.1 ? colors.accentInk : colors.ink,
            letterSpacing: "-0.02em",
            lineHeight: 1,
          }}
        >
          {choice}
        </div>
      </div>
    </FadeIn>
  );
};

/* ------------------------------------------------------------------ */
/* SideNoteCard — 점선 border + opacity 0.7 사이드 카드 (scene-10)      */
/*                                                                     */
/* "부가 정보, 본문 아님" 의 시각 신호. 본문 카드와 위치 분리.            */
/* ------------------------------------------------------------------ */

export const SideNoteCard: React.FC<{
  children: React.ReactNode;
  delaySec?: number;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
}> = ({ children, delaySec = 0, width = 880, height = 100, style }) => {
  return (
    <FadeIn delaySec={delaySec} translateY={10}>
      <div
        style={{
          width,
          height,
          padding: "16px 24px",
          background: colors.bgWhite,
          border: `2px dashed ${colors.inkSubtle}`,
          borderRadius: radii.card,
          opacity: 0.7,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 6,
          fontFamily: fonts.sans,
          ...style,
        }}
      >
        {children}
      </div>
    </FadeIn>
  );
};

/* ------------------------------------------------------------------ */
/* QuestionBox — Active Recall 질문/정답 박스 (scene-08)                */
/*                                                                     */
/* 질문 phase → revealAtSec 시점에 정답 reveal swap.                    */
/* R-002: 질문 fade-out 종료 후 0.2초 buffer → 정답 fade-in.            */
/* R-004 / R-016: revealAtSec 가 narration "정답입니다" 발화 시점과 동기. */
/* ------------------------------------------------------------------ */

export const QuestionBox: React.FC<{
  question: React.ReactNode;
  answer: React.ReactNode;
  questionEnterAtSec: number;
  /** 정답 reveal 시점 (sec). 질문은 이 시점 0.6초 전부터 fade-out 시작. */
  revealAtSec: number;
  width?: number;
  height?: number;
}> = ({
  question,
  answer,
  questionEnterAtSec,
  revealAtSec,
  width = 1000,
  height = 240,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 질문 fade-in
  const qStart = questionEnterAtSec * fps;
  const qEnter = interpolate(frame, [qStart, qStart + 0.5 * fps], [0, 1], {
    easing: easeOutCubic,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 질문 fade-out (revealAtSec - 0.6s 부터 시작, revealAtSec - 0.2s 까지)
  const qFadeStart = (revealAtSec - 0.6) * fps;
  const qFadeEnd = (revealAtSec - 0.2) * fps;
  const qFadeOut = interpolate(frame, [qFadeStart, qFadeEnd], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 정답 fade-in (revealAtSec 부터 0.4s)
  const aStart = revealAtSec * fps;
  const aFadeIn = interpolate(frame, [aStart, aStart + 0.4 * fps], [0, 1], {
    easing: easeOutCubic,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 정답 박스 펄스 (R-016)
  const aPulse = interpolate(
    frame,
    [aStart, aStart + 0.3 * fps, aStart + 0.7 * fps, aStart + 1.1 * fps],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const qOpacity = qEnter * qFadeOut;

  return (
    <div style={{ position: "relative", width, height }}>
      {/* 질문 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          padding: "32px 40px",
          background: colors.bgWhite,
          border: `2px solid ${colors.border}`,
          borderRadius: radii.card,
          boxShadow: shadows.card,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: qOpacity,
          fontFamily: fonts.sans,
        }}
      >
        {question}
      </div>
      {/* 정답 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          padding: "32px 40px",
          background: aPulse > 0.1 ? colors.accentSoft : colors.bgWhite,
          border: `3px solid ${colors.accent}`,
          borderRadius: radii.card,
          boxShadow: shadows.card,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: aFadeIn,
          fontFamily: fonts.mono,
          fontSize: 56,
          fontWeight: 800,
          color: colors.accentInk,
        }}
      >
        {answer}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* easings re-export                                                   */
/* ------------------------------------------------------------------ */

export { easeOutCubic, easeInOut };
