/**
 * Shared visual primitives for Lesson 11.
 *
 * Base primitives (FadeIn / TypeOn / Card / CourseLabel / PageBackground /
 * AccentUnderline / LowerThird / CenteredStage / PyToken / CodePanel /
 * CodeLine / ConsolePanel / ConsoleLine / VarBox / SwapLabel / EmphasisPulse /
 * ChecklistCard / FlowArrow / FourPartBox) are carried over from lesson-10 for
 * visual continuity across the season (시즌 통일 정형 답습).
 *
 * Lesson-11-specific primitives:
 *   - Notebook         — 공책(노트) 일러스트 (scene-02/04/06/08).
 *                        violet-100 둥근 사각형 + 가로줄 4~5개 + 우측 상단
 *                        `memo.txt` 라벨. 안에 글자 type-on 가능 (children).
 *   - WarnMark         — ⚠ 마커 (scene-08). red-500 배경 둥근 사각형 + ⚠.
 *   - CheckMark        — ✓ 마커 (scene-04/09/11). green-500 / accent 배경.
 *   - FolderIcon       — 폴더 아이콘 (scene-10). 단순 사다리꼴 + 직사각형.
 *   - FileIcon         — 파일 아이콘 (scene-10). 모서리 접힌 사각형 + 라벨.
 *   - IndentSafetyGuide — with 블록 들여쓰기를 _녹색 점선 안전망_ 으로 강조
 *                        (scene-09). CodePanel 안 absolute, R-021 panel.height fit.
 *
 * All animations are frame-driven via useCurrentFrame() + interpolate().
 * No CSS transitions / Tailwind animate-* classes — those break Remotion renders.
 *
 * R-019 준수: SwapLabel 의 parent + 두 layer 에 whiteSpace: "nowrap" 강제.
 * R-009 준수: 코드 키워드는 모두 소문자 — textTransform: uppercase 미사용
 *             (UPPER 라벨은 한국어/숫자만).
 * R-024 준수: WarnMark / CheckMark 등 panel 안 마커는 안쪽 inset (음수 좌표 X).
 */

import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts, radii, shadows } from "./theme";

const easeOutCubic = Easing.bezier(0.16, 1, 0.3, 1);
const easeInOut = Easing.bezier(0.45, 0, 0.55, 1);

/* ================================================================== */
/* CARRY-OVER PRIMITIVES (lesson-10 답습 — 시즌 통일)                   */
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
/* CourseLabel — "파이썬 기초 · 11강" pill                              */
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
/* CODE / CONSOLE PRIMITIVES (carry-over from lesson-10)               */
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
/* FlowArrow — 곡선 화살표 (호출/결과 흐름 메타포)                       */
/*                                                                     */
/* R-012 준수: length ≥ 180, strokeWidth ≥ 6.                          */
/* 두 점 (start / end) 사이 SVG cubic-bezier curve. delaySec 시점에      */
/* growth 0 → 1 로 화살표가 자라남.                                     */
/* ------------------------------------------------------------------ */

export const FlowArrow: React.FC<{
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  /** 곡률 (양수: 위로 휨, 음수: 아래로 휨) */
  curve?: number;
  delaySec?: number;
  durationSec?: number;
  strokeWidth?: number;
  color?: string;
  width?: number;
  height?: number;
  /** marker id 충돌 방지용 unique suffix. 같은 화살표 색을 한 컴포지션에서 여러 번 쓸 때 다른 값으로. */
  uid?: string;
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
  uid = "default",
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

  const ctrlX1 = startX + (endX - startX) * 0.35;
  const ctrlY1 = startY - curve;
  const ctrlX2 = startX + (endX - startX) * 0.65;
  const ctrlY2 = endY - curve;

  const path = `M ${startX} ${startY} C ${ctrlX1} ${ctrlY1}, ${ctrlX2} ${ctrlY2}, ${endX} ${endY}`;
  const markerId = `fa-arrow-${color.replace("#", "")}-${uid}`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ position: "absolute", overflow: "visible", ...style }}
    >
      <defs>
        <marker
          id={markerId}
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
        markerEnd={grow > 0.92 ? `url(#${markerId})` : undefined}
      />
    </svg>
  );
};

/* ------------------------------------------------------------------ */
/* FourPartBox — 4분해 색깔 박스 (lesson-10 carry-over, scene-03 재활용)*/
/*                                                                     */
/* `open` / `"memo.txt"` / `"w"` / `as f` 네 부분을 색깔 다른 박스로.    */
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
}> = ({ parts, tokenFontSize = 56, labelFontSize = 22, gap = 16 }) => {
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

/* ================================================================== */
/* LESSON-11-SPECIFIC PRIMITIVES                                       */
/* ================================================================== */

/* ------------------------------------------------------------------ */
/* Notebook — 공책(노트) 일러스트 (scene-02/04/06/08)                   */
/*                                                                     */
/* violet-100 둥근 사각형 + 가로줄 + 우측 상단 `memo.txt` 라벨.           */
/* children 으로 본문 글자 넣을 수 있음 (type-on 등).                    */
/* ------------------------------------------------------------------ */

export const Notebook: React.FC<{
  /** 노트 전체 width (px). */
  width?: number;
  /** 노트 전체 height (px). */
  height?: number;
  /** 가로줄 개수 (등장 시 노트 비어 있음을 보여주는 배경 줄). */
  lineCount?: number;
  /** 우측 상단 라벨 (보통 `memo.txt`). null 이면 표시 X. */
  fileNameLabel?: React.ReactNode;
  /** children — 노트 본문에 들어갈 글자 (type-on 등). */
  children?: React.ReactNode;
  /** 노트 안쪽 본문 padding (left). */
  contentPaddingLeft?: number;
  /** 라벨 등장 delaySec. */
  labelDelaySec?: number;
  style?: React.CSSProperties;
}> = ({
  width = 360,
  height = 240,
  lineCount = 5,
  fileNameLabel = "memo.txt",
  children,
  contentPaddingLeft = 28,
  labelDelaySec = 0.2,
  style,
}) => {
  // 가로줄 y 위치: 상단 padding 56 (라벨 영역 피해서), 줄 간격 (height - 80) / lineCount
  const lineTopOffset = 64;
  const lineBottomOffset = 24;
  const lineGap = (height - lineTopOffset - lineBottomOffset) / Math.max(1, lineCount);
  const lines = Array.from({ length: lineCount }, (_, i) => lineTopOffset + (i + 0.5) * lineGap);

  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        background: colors.notePaper,
        border: `2.5px solid ${colors.notePaperEdge}`,
        borderRadius: 18,
        boxShadow: shadows.card,
        overflow: "hidden",
        ...style,
      }}
    >
      {/* 좌측 세로 marginline (공책 빨간 세로줄을 violet 톤으로) */}
      <div
        style={{
          position: "absolute",
          left: 20,
          top: 12,
          bottom: 12,
          width: 1.5,
          background: "rgba(139, 92, 246, 0.45)",
        }}
      />
      {/* 가로줄들 */}
      {lines.map((y, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: contentPaddingLeft,
            right: 18,
            top: y,
            height: 1.5,
            background: colors.noteLine,
          }}
        />
      ))}
      {/* 우측 상단 파일명 라벨 */}
      {fileNameLabel != null ? (
        <div
          style={{
            position: "absolute",
            top: 14,
            right: 16,
          }}
        >
          <FadeIn delaySec={labelDelaySec} translateY={6} durationSec={0.5}>
            <div
              style={{
                padding: "4px 12px",
                borderRadius: 8,
                background: colors.noteLabelBg,
                color: colors.noteLabelText,
                fontFamily: fonts.mono,
                fontSize: 22,
                fontWeight: 700,
                border: `1.5px solid ${colors.notePaperEdge}`,
                letterSpacing: "-0.01em",
                whiteSpace: "nowrap",
              }}
            >
              {fileNameLabel}
            </div>
          </FadeIn>
        </div>
      ) : null}
      {/* 노트 본문 — children */}
      <div
        style={{
          position: "absolute",
          left: contentPaddingLeft + 8,
          right: 18,
          top: lineTopOffset - 24,
          bottom: lineBottomOffset,
          display: "flex",
          flexDirection: "column",
          gap: 6,
          fontFamily: fonts.mono,
          fontSize: 28,
          fontWeight: 700,
          color: colors.accentInk,
          letterSpacing: "-0.01em",
          lineHeight: 1.7,
          overflow: "hidden",
        }}
      >
        {children}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* WarnMark — ⚠ 마커 (scene-08, R-024 panel 안쪽 inset)                 */
/* ------------------------------------------------------------------ */

export const WarnMark: React.FC<{
  size?: number;
  delaySec?: number;
  style?: React.CSSProperties;
}> = ({ size = 80, delaySec = 0, style }) => {
  return (
    <FadeIn delaySec={delaySec} translateY={8} style={style}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: 18,
          background: colors.dangerRed,
          color: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: fonts.sans,
          fontSize: size * 0.55,
          fontWeight: 900,
          letterSpacing: "-0.02em",
          lineHeight: 1,
          boxShadow: "0 4px 16px -4px rgba(239, 68, 68, 0.45)",
        }}
      >
        ⚠
      </div>
    </FadeIn>
  );
};

/* ------------------------------------------------------------------ */
/* CheckMark — ✓ 마커 (scene-04 작은 / scene-09 큰)                     */
/* ------------------------------------------------------------------ */

export const CheckMark: React.FC<{
  size?: number;
  delaySec?: number;
  variant?: "green" | "accent";
  style?: React.CSSProperties;
}> = ({ size = 36, delaySec = 0, variant = "green", style }) => {
  const bg = variant === "green" ? colors.safeGreen : colors.accent;
  const shadow =
    variant === "green"
      ? "0 4px 16px -4px rgba(34, 197, 94, 0.45)"
      : "0 4px 16px -4px rgba(139, 92, 246, 0.45)";
  return (
    <FadeIn delaySec={delaySec} translateY={6} style={style}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: Math.round(size * 0.28),
          background: bg,
          color: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: fonts.sans,
          fontSize: size * 0.55,
          fontWeight: 900,
          letterSpacing: "-0.02em",
          lineHeight: 1,
          boxShadow: shadow,
        }}
      >
        ✓
      </div>
    </FadeIn>
  );
};

/* ------------------------------------------------------------------ */
/* FolderIcon — 폴더 아이콘 (scene-10)                                  */
/* ------------------------------------------------------------------ */

export const FolderIcon: React.FC<{
  size?: number;
  delaySec?: number;
  color?: string;
}> = ({ size = 48, delaySec = 0, color = colors.inkMuted }) => {
  return (
    <FadeIn delaySec={delaySec} translateY={6}>
      <svg width={size} height={size} viewBox="0 0 48 48" style={{ display: "block" }}>
        {/* 폴더 뒤판 */}
        <path
          d="M4 14 L18 14 L22 18 L44 18 L44 40 L4 40 Z"
          fill={color}
          opacity={0.18}
          stroke={color}
          strokeWidth={2}
          strokeLinejoin="round"
        />
        {/* 폴더 앞판 */}
        <path
          d="M6 22 L42 22 L40 40 L8 40 Z"
          fill={color}
          opacity={0.32}
          stroke={color}
          strokeWidth={2}
          strokeLinejoin="round"
        />
      </svg>
    </FadeIn>
  );
};

/* ------------------------------------------------------------------ */
/* FileIcon — 파일 아이콘 (모서리 접힌 사각형, scene-10)                */
/* ------------------------------------------------------------------ */

export const FileIcon: React.FC<{
  size?: number;
  delaySec?: number;
  color?: string;
  label?: React.ReactNode;
}> = ({ size = 36, delaySec = 0, color = colors.accent, label }) => {
  return (
    <FadeIn delaySec={delaySec} translateY={6}>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
        <svg width={size} height={Math.round(size * 1.2)} viewBox="0 0 36 44" style={{ display: "block" }}>
          {/* 파일 본체 (우측 상단 접힘) */}
          <path
            d="M4 4 L24 4 L32 12 L32 40 L4 40 Z"
            fill={color}
            opacity={0.15}
            stroke={color}
            strokeWidth={2}
            strokeLinejoin="round"
          />
          {/* 접힌 모서리 */}
          <path
            d="M24 4 L24 12 L32 12"
            fill="none"
            stroke={color}
            strokeWidth={2}
            strokeLinejoin="round"
          />
          {/* 가로 줄 (텍스트 hint) */}
          <line x1={10} y1={22} x2={26} y2={22} stroke={color} strokeWidth={1.5} opacity={0.55} />
          <line x1={10} y1={28} x2={26} y2={28} stroke={color} strokeWidth={1.5} opacity={0.55} />
          <line x1={10} y1={34} x2={22} y2={34} stroke={color} strokeWidth={1.5} opacity={0.55} />
        </svg>
        {label != null ? (
          <span
            style={{
              fontFamily: fonts.mono,
              fontSize: 26,
              fontWeight: 700,
              color,
              letterSpacing: "-0.01em",
            }}
          >
            {label}
          </span>
        ) : null}
      </div>
    </FadeIn>
  );
};

/* ------------------------------------------------------------------ */
/* IndentSafetyGuide — with 블록 들여쓰기 안전망 (scene-09)             */
/*                                                                     */
/* CodePanel wrapper(position: relative) 안에 absolute 로 박혀,         */
/* 들여쓰기 영역 (좌측 들여쓰기 옆 수직 막대) 을 녹색 점선으로 강조.        */
/*                                                                     */
/* R-021 준수: top + height ≤ panel.height. 호출 측에서 panel.height    */
/* 보다 작은 값으로 사용해야.                                            */
/* ------------------------------------------------------------------ */

export const IndentSafetyGuide: React.FC<{
  left: number;
  top: number;
  height: number;
  delaySec?: number;
  durationSec?: number;
  /** 들여쓰기 막대 두께 */
  thickness?: number;
}> = ({
  left,
  top,
  height,
  delaySec = 0,
  durationSec = 0.5,
  thickness = 4,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = delaySec * fps;
  const end = start + durationSec * fps;
  const reveal = interpolate(frame, [start, end], [0, 1], {
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
        width: thickness,
        height,
        background: `repeating-linear-gradient(to bottom, ${colors.safeGreen} 0 6px, transparent 6px 12px)`,
        borderRadius: 2,
        opacity: reveal,
        pointerEvents: "none",
      }}
    />
  );
};

/* ------------------------------------------------------------------ */
/* easings re-export                                                   */
/* ------------------------------------------------------------------ */

export { easeOutCubic, easeInOut };
