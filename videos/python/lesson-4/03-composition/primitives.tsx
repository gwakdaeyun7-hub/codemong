/**
 * Shared visual primitives for Lesson 4.
 *
 * Base primitives (FadeIn / TypeOn / Card / CourseLabel / PageBackground /
 * AccentUnderline / LowerThird / CenteredStage) are duplicated from
 * lesson-3 for visual continuity across the season — see
 * `videos/python/lesson-3/03-composition/primitives.tsx` for the same set.
 *
 * Code-panel primitives (CodePanel / CodeLine / PyToken / ConsolePanel /
 * ConsoleLine / VarBox / DashedHArrow / LabelArrow) are also carried over from
 * lesson-3. PersonGlyph / TrashIcon / HandPointer (lesson-3 only) are omitted.
 *
 * Lesson-4-specific primitives (further down):
 *   - OperatorTable    — 산술/비교 연산자 표 (s04, s06)
 *   - LogicCard        — and/or/not 한 카드 (s08)
 *   - QuestionBox      — Active Recall 의 ? → 결과 swap 박스 (s05, s10)
 *   - CountdownDots    — Active Recall 의 2초 카운트다운 도트 (s05, s10)
 *   - SwapValue        — frame 기반 swap (앞 텍스트 → 뒤 텍스트, scale-up reveal)
 *   - EmphasisPulse    — 자식 요소를 색상/scale 펄스 (emphasisBeats 용)
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
/* CourseLabel — "파이썬 기초 · 4강" pill                                */
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
/* CODE-PANEL PRIMITIVES (carried over from lesson-3)                  */
/* ================================================================== */

/* ------------------------------------------------------------------ */
/* PyToken — Python 토큰의 인라인 syntax-highlight                     */
/* ------------------------------------------------------------------ */

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
  highlight?: boolean; // 새 토큰 강조 (violet-300 외곽선)
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

/* ------------------------------------------------------------------ */
/* TypeOnTokens — multi-segment char-by-char with per-segment color    */
/*                                                                     */
/* segments 를 차례로 char-by-char 으로 노출하면서 각 segment 의 kind 에 */
/* 맞는 PyToken 색을 적용. `input("...")` 같은 한 줄짜리 호출에 사용.   */
/* ------------------------------------------------------------------ */

export type TypeOnSegment = {
  text: string;
  kind: PyTokenKind;
};

export const TypeOnTokens: React.FC<{
  segments: TypeOnSegment[];
  delaySec?: number;
  msPerChar?: number;
}> = ({ segments, delaySec = 0, msPerChar = 60 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = delaySec * fps;
  const framesPerChar = (msPerChar / 1000) * fps;
  const elapsed = Math.max(0, frame - start);
  let remaining = Math.floor(elapsed / framesPerChar);

  return (
    <>
      {segments.map((seg, i) => {
        const visibleLen = Math.min(seg.text.length, remaining);
        remaining = Math.max(0, remaining - seg.text.length);
        return (
          <span
            key={i}
            style={{
              color: tokenColor[seg.kind],
              fontFamily: fonts.mono,
              whiteSpace: "pre",
            }}
          >
            {seg.text.slice(0, visibleLen)}
          </span>
        );
      })}
    </>
  );
};

/* ------------------------------------------------------------------ */
/* CodePanel — 어두운 코드 에디터 패널                                  */
/* ------------------------------------------------------------------ */

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
      {/* 헤더 */}
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
      {/* 본문 */}
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

/* ------------------------------------------------------------------ */
/* CodeLine — 코드 한 줄 (reveal + 좌측 violet 강조 막대)               */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/* ConsolePanel — 출력 결과 패널                                        */
/* ------------------------------------------------------------------ */

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
      {/* 헤더 */}
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
      {/* 본문 */}
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
  emphasis?: boolean; // violet 큰 글씨로 강조
  children: React.ReactNode;
}> = ({ revealAtSec = 0, dimmed = false, emphasis = false, children }) => {
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
        color: emphasis ? colors.darkAccent : undefined,
        fontWeight: emphasis ? 800 : undefined,
        fontSize: emphasis ? 38 : undefined,
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
  labelDimmed?: boolean;
  children?: React.ReactNode;
  width?: number;
  height?: number;
  labelFontSize?: number;
  valueFontSize?: number;
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
/* DashedHArrow — 가로 점선 화살표 (코드↔콘솔 매칭)                     */
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
/* LESSON-4-SPECIFIC PRIMITIVES                                        */
/* ================================================================== */

/* ------------------------------------------------------------------ */
/* OperatorTable — 산술/비교 연산자 표 (s04, s06)                       */
/*                                                                     */
/* 4열 [연산자 / 의미 / 예시 / 결과]. 각 행이 staggered fade-in.        */
/* 연산자 셀과 결과 셀은 monospace + violet 강조 가능.                  */
/* ------------------------------------------------------------------ */

export type OpRow = {
  op: string;
  meaning: string;
  example: string;
  result: string;
};

export const OperatorTable: React.FC<{
  headers?: [string, string, string, string];
  rows: OpRow[];
  startDelaySec?: number;
  rowGapSec?: number;
  width?: number;
  resultEmphasize?: boolean;
  /**
   * Optional dead-air pulse beats per row.
   * key = row index (0-based), value = sec (scene-local) when that row pulses violet.
   * The pulse lasts 0.5s — row background fades to accentSoft and result text scales 1.08.
   * Used by Scene04 / Scene06 to add visual emphasis during long dead-air stretches.
   */
  pulseRowsAtSecs?: Record<number, number>;
  /**
   * Optional column-wide pulse for the "result" column.
   * `atSec` is when the pulse fires; lasts 0.5s. All result cells pulse at once.
   */
  pulseResultColumnAtSec?: number;
}> = ({
  headers = ["연산자", "의미", "예시", "결과"],
  rows,
  startDelaySec = 0.2,
  rowGapSec = 0.4,
  width = 1100,
  resultEmphasize = false,
  pulseRowsAtSecs,
  pulseResultColumnAtSec,
}) => {
  return (
    <div
      style={{
        width,
        borderRadius: radii.card,
        overflow: "hidden",
        border: `1px solid ${colors.border}`,
        boxShadow: shadows.card,
        background: colors.bgWhite,
        fontFamily: fonts.sans,
      }}
    >
      {/* 헤더 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "180px 1fr 1fr 180px",
          background: colors.inkSoft,
          color: "#ffffff",
        }}
      >
        {headers.map((h, i) => (
          <div
            key={i}
            style={{
              padding: "16px 24px",
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: "0.02em",
              textAlign: i === 0 || i === 3 ? "center" : "left",
              borderRight: i < 3 ? `1px solid ${colors.darkBg2}` : undefined,
            }}
          >
            {h}
          </div>
        ))}
      </div>
      {/* 본문 */}
      {rows.map((row, i) => (
        <OperatorTableRow
          key={i}
          row={row}
          delaySec={startDelaySec + i * rowGapSec}
          showBorder={i < rows.length - 1}
          resultEmphasize={resultEmphasize}
          pulseAtSec={pulseRowsAtSecs?.[i]}
          pulseResultColumnAtSec={pulseResultColumnAtSec}
        />
      ))}
    </div>
  );
};

const OperatorTableRow: React.FC<{
  row: OpRow;
  delaySec: number;
  showBorder: boolean;
  resultEmphasize: boolean;
  pulseAtSec?: number;
  pulseResultColumnAtSec?: number;
}> = ({ row, delaySec, showBorder, resultEmphasize, pulseAtSec, pulseResultColumnAtSec }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = delaySec * fps;
  const reveal = interpolate(frame, [start, start + 0.4 * fps], [0, 1], {
    easing: easeOutCubic,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // 행 펄스: pulseAtSec ~ +0.5s 동안 bgWhite → accentSoft → bgWhite
  // accentSoft #ede9fe = rgb(237,233,254)
  const rowPulseT =
    typeof pulseAtSec === "number"
      ? interpolate(
          frame,
          [pulseAtSec * fps, (pulseAtSec + 0.25) * fps, (pulseAtSec + 0.5) * fps],
          [0, 1, 0],
          {
            easing: easeOutCubic,
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          },
        )
      : 0;
  // result column 펄스 (전체 행 공통)
  const resultColumnT =
    typeof pulseResultColumnAtSec === "number"
      ? interpolate(
          frame,
          [
            pulseResultColumnAtSec * fps,
            (pulseResultColumnAtSec + 0.25) * fps,
            (pulseResultColumnAtSec + 0.5) * fps,
          ],
          [0, 1, 0],
          {
            easing: easeOutCubic,
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          },
        )
      : 0;
  // row 배경 lerp — bgWhite #fff (255,255,255) ↔ accentSoft #ede9fe (237,233,254)
  const rowBg =
    rowPulseT > 0
      ? `rgb(${Math.round(255 + (237 - 255) * rowPulseT)}, ${Math.round(255 + (233 - 255) * rowPulseT)}, ${Math.round(254 + (254 - 254) * rowPulseT)})`
      : colors.bgWhite;
  // 결과 셀 scale (row pulse + result column pulse 최댓값 사용)
  const resultScaleT = Math.max(rowPulseT, resultColumnT);
  const resultScale = 1 + 0.1 * resultScaleT;
  // 결과 셀 색상 — resultEmphasize 때는 항상 accentDeep, 아니면 ink. pulse 중엔 accentDeep 로 lerp.
  // accentDeep #7c3aed = rgb(124,58,237)
  const resultBaseColor = resultEmphasize ? colors.accentDeep : colors.ink;
  const resultColor =
    resultScaleT > 0 && !resultEmphasize
      ? `rgb(${Math.round(24 + (124 - 24) * resultScaleT)}, ${Math.round(24 + (58 - 24) * resultScaleT)}, ${Math.round(27 + (237 - 27) * resultScaleT)})`
      : resultBaseColor;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "180px 1fr 1fr 180px",
        borderBottom: showBorder ? `1px solid ${colors.borderSoft}` : undefined,
        background: rowBg,
        opacity: reveal,
        transform: `translateY(${(1 - reveal) * 6}px)`,
      }}
    >
      <div
        style={{
          padding: "18px 24px",
          fontFamily: fonts.mono,
          fontSize: 32,
          fontWeight: 800,
          color: colors.accent,
          textAlign: "center",
          borderRight: `1px solid ${colors.borderSoft}`,
        }}
      >
        {row.op}
      </div>
      <div
        style={{
          padding: "18px 24px",
          fontFamily: fonts.sans,
          fontSize: 24,
          fontWeight: 600,
          color: colors.ink,
          borderRight: `1px solid ${colors.borderSoft}`,
        }}
      >
        {row.meaning}
      </div>
      <div
        style={{
          padding: "18px 24px",
          fontFamily: fonts.mono,
          fontSize: 26,
          fontWeight: 600,
          color: colors.inkSoft,
          borderRight: `1px solid ${colors.borderSoft}`,
        }}
      >
        {row.example}
      </div>
      <div
        style={{
          padding: "18px 24px",
          fontFamily: fonts.mono,
          fontSize: 28,
          fontWeight: 800,
          color: resultColor,
          textAlign: "center",
          transform: `scale(${resultScale})`,
          transformOrigin: "center",
        }}
      >
        {row.result}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* LogicCard — and/or/not 한 카드 (s08)                                 */
/*                                                                     */
/* 헤더: 연산자 이름 (violet-500), 본문: 한 줄 직관 + 예시 한 줄.       */
/* 예시 결과(True/False) 는 굵게 + violet-600.                          */
/* ------------------------------------------------------------------ */

export const LogicCard: React.FC<{
  operator: string;
  intuition: string;
  exampleExpr: string;
  exampleResult: string;
  delaySec?: number;
  exampleDelaySec?: number;
}> = ({ operator, intuition, exampleExpr, exampleResult, delaySec = 0, exampleDelaySec = 0 }) => {
  return (
    <FadeIn delaySec={delaySec} translateY={16}>
      <div
        style={{
          width: 380,
          padding: "36px 32px 40px",
          borderRadius: radii.card,
          background: colors.bgWhite,
          border: `1px solid ${colors.border}`,
          boxShadow: shadows.card,
          textAlign: "center",
          fontFamily: fonts.sans,
          display: "flex",
          flexDirection: "column",
          gap: 22,
        }}
      >
        {/* 헤더 */}
        <div
          style={{
            fontFamily: fonts.mono,
            fontSize: 54,
            fontWeight: 800,
            color: colors.accent,
            letterSpacing: "-0.02em",
            lineHeight: 1,
          }}
        >
          {operator}
        </div>
        {/* 직관 한 줄 */}
        <div
          style={{
            fontSize: 24,
            fontWeight: 600,
            color: colors.inkSoft,
            letterSpacing: "-0.01em",
            lineHeight: 1.4,
          }}
        >
          {intuition}
        </div>
        {/* 분리선 */}
        <div
          style={{
            height: 1,
            background: colors.border,
            margin: "4px 0",
          }}
        />
        {/* 예시 */}
        <FadeIn delaySec={exampleDelaySec} translateY={8}>
          <div
            style={{
              background: colors.darkBg,
              borderRadius: 12,
              padding: "16px 18px",
              border: `1px solid ${colors.darkBg2}`,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <div
              style={{
                fontFamily: fonts.mono,
                fontSize: 24,
                fontWeight: 600,
                color: colors.darkInk,
              }}
            >
              {exampleExpr}
            </div>
            <div
              style={{
                fontFamily: fonts.mono,
                fontSize: 26,
                fontWeight: 800,
                color: colors.darkAccent,
              }}
            >
              → {exampleResult}
            </div>
          </div>
        </FadeIn>
      </div>
    </FadeIn>
  );
};

/* ------------------------------------------------------------------ */
/* QuestionBox — Active Recall ? → 결과 swap 박스 (s05, s10)            */
/*                                                                     */
/* 초기엔 큰 ? (회색 박스).                                              */
/* revealAtSec 시점에 결과로 swap (scale up 0.3s + violet 강조).         */
/* ------------------------------------------------------------------ */

export const QuestionBox: React.FC<{
  /** 결과가 드러나는 시점 (sec, scene local) */
  revealAtSec: number;
  /** 결과 텍스트 */
  answer: string;
  /** 박스 폭 */
  width?: number;
  /** 박스 높이 */
  height?: number;
  /** 결과 폰트 사이즈 */
  fontSize?: number;
}> = ({ revealAtSec, answer, width = 240, height = 160, fontSize = 72 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = revealAtSec * fps;

  // ?  → 결과 swap
  // [0, start): ? 보임 (opacity 1, scale 1)
  // [start, start+0.3s): ? fade out (opacity 1→0), 결과 fade-in + scale 0.7→1.05→1
  const qOpacity = interpolate(frame, [start, start + 0.15 * fps], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const aOpacity = interpolate(frame, [start, start + 0.25 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const aScale = interpolate(
    frame,
    [start, start + 0.18 * fps, start + 0.35 * fps],
    [0.7, 1.12, 1],
    {
      easing: easeOutCubic,
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
        borderRadius: radii.card,
        background: colors.bgWhite,
        border: `2.5px solid ${colors.border}`,
        boxShadow: shadows.card,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* ? */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: qOpacity,
          fontFamily: fonts.sans,
          fontSize,
          fontWeight: 800,
          color: colors.inkSubtle,
          letterSpacing: "-0.04em",
        }}
      >
        ?
      </div>
      {/* 결과 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: aOpacity,
          transform: `scale(${aScale})`,
          fontFamily: fonts.mono,
          fontSize,
          fontWeight: 800,
          color: colors.accentDeep,
          letterSpacing: "-0.02em",
        }}
      >
        {answer}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* CountdownDots — Active Recall 2초 카운트다운 도트                    */
/*                                                                     */
/* 3개 도트가 startSec 부터 1초 간격으로 violet-500 으로 점등.           */
/* 학습자에게 정적인 2~3초 동안의 시각적 "지금 생각해보세요" 신호.        */
/* ------------------------------------------------------------------ */

export const CountdownDots: React.FC<{
  /** 첫 도트가 점등되는 시점 (sec, scene local) */
  startSec: number;
  /** 도트 개수 (기본 3) */
  count?: number;
  /** 도트 간 간격 (sec) */
  stepSec?: number;
  size?: number;
}> = ({ startSec, count = 3, stepSec = 0.7, size = 16 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        display: "flex",
        gap: 14,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {Array.from({ length: count }).map((_, i) => {
        const litAt = (startSec + i * stepSec) * fps;
        const lit = interpolate(frame, [litAt, litAt + 0.2 * fps], [0, 1], {
          easing: easeOutCubic,
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <div
            key={i}
            style={{
              width: size,
              height: size,
              borderRadius: "50%",
              background: colors.accent,
              opacity: 0.2 + lit * 0.8,
              transform: `scale(${0.7 + lit * 0.3})`,
            }}
          />
        );
      })}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* SwapValue — frame 기반 swap (앞 → 뒤, scale-up reveal)              */
/*                                                                     */
/* before 가 보이다가 swapAtSec 시점에 after 로 교체.                    */
/* (콘솔의 "35" → "8" 같은 결과 교체 시 사용.)                          */
/* ------------------------------------------------------------------ */

export const SwapValue: React.FC<{
  swapAtSec: number;
  before: React.ReactNode;
  after: React.ReactNode;
  width?: number | string;
  height?: number | string;
  style?: React.CSSProperties;
}> = ({ swapAtSec, before, after, width, height, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = swapAtSec * fps;

  const beforeOpacity = interpolate(frame, [start, start + 0.15 * fps], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const afterOpacity = interpolate(frame, [start, start + 0.25 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const afterScale = interpolate(
    frame,
    [start, start + 0.2 * fps, start + 0.4 * fps],
    [0.85, 1.08, 1],
    {
      easing: easeOutCubic,
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
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        ...style,
      }}
    >
      <div style={{ opacity: beforeOpacity, position: "absolute" }}>{before}</div>
      <div
        style={{
          opacity: afterOpacity,
          transform: `scale(${afterScale})`,
          position: "absolute",
        }}
      >
        {after}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* EmphasisPulse — 자식 요소에 색상/scale 펄스 (emphasisBeats 용)        */
/*                                                                     */
/* atSec ± 0.2s 동안 scale 1→1.15→1, color 도 baseColor → pulseColor → */
/* baseColor 로 lerp. 강조 비트 한 번에 쓰는 wrapper.                   */
/* ------------------------------------------------------------------ */

export const EmphasisPulse: React.FC<{
  atSec: number;
  children: React.ReactNode;
  scaleAmp?: number;
  durationSec?: number;
  style?: React.CSSProperties;
}> = ({ atSec, children, scaleAmp = 0.15, durationSec = 0.5, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = atSec * fps;
  const mid = (atSec + durationSec / 2) * fps;
  const end = (atSec + durationSec) * fps;

  const t = interpolate(frame, [start, mid, end], [0, 1, 0], {
    easing: easeInOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <span
      style={{
        display: "inline-block",
        transform: `scale(${1 + scaleAmp * t})`,
        ...style,
      }}
    >
      {children}
    </span>
  );
};

/* ------------------------------------------------------------------ */
/* easings re-export for scene files                                   */
/* ------------------------------------------------------------------ */

export { easeOutCubic, easeInOut };
