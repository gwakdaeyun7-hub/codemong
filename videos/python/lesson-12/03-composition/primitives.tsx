/**
 * Shared visual primitives for Lesson 12 — 디버깅 & AI 활용.
 *
 * Base primitives (FadeIn / TypeOn / Card / CourseLabel / PageBackground /
 * AccentUnderline / LowerThird / CenteredStage / PyToken / CodePanel /
 * CodeLine / ConsolePanel / ConsoleLine / VarBox / SwapLabel / EmphasisPulse /
 * FlowArrow / CheckMark) are carried over from lesson-11 for visual continuity
 * across the season (시즌 통일 정형 답습).
 *
 * Lesson-12-specific primitives (디버깅 영상 — 콘솔/에러가 주인공):
 *   - TracebackBox    — 빨간 Traceback 박스 (어두운 콘솔 + 좌측 빨간 막대).
 *                       scene-02/03. 줄 단위 흐림(dimmed) / 노란 강조(highlight)
 *                       / glow 재프레이밍 지원.
 *   - Chip            — 오답분류 pill (문법오류/논리오류/개념미숙). scene-02/06/09.
 *   - MisclassChips   — 세 칩 가로 배열 + 강조 인덱스 + 펄스. scene-02/09.
 *   - UpArrow         — 아래→위 세로 화살표 (strokeWidth ≥ 6, length ≥ 200, R-012).
 *                       scene-03 (Traceback 읽는 방향).
 *   - RedIndentGuide  — 버그 줄(들여쓰기 0칸)을 빨간 세로 막대로 강조.
 *                       CodePanel 안 absolute, R-021 panel.height fit. scene-06.
 *   - QuestionBox     — Active Recall 질문 카드 + 정답 reveal (revealAtSec).
 *                       scene-05 (가림) → scene-06 (reveal). R-004 동기 대상.
 *   - ReframeMark     — ⚠ → 🔍 아이콘 교체 (재프레이밍 시각 신호). scene-02.
 *   - XMark           — 빨간 ✕ 마커 (나쁜 질문). scene-08. R-024 안쪽 inset.
 *   - DotMark         — 작은 빨간 점 마커 (에러로 잡히는 카드). scene-04.
 *
 * All animations are frame-driven via useCurrentFrame() + interpolate().
 * No CSS transitions / Tailwind animate-* classes — those break Remotion renders.
 *
 * R-002 준수: SwapLabel/letter swap 은 fade-out 완료 후 0.2s buffer 두고 fade-in.
 * R-009 준수: 코드 키워드/에러 이름은 원본 케이스 유지 — textTransform: uppercase
 *             는 한국어/숫자-only 라벨에만.
 * R-012 준수: UpArrow strokeWidth ≥ 6, length ≥ 200.
 * R-019 준수: SwapLabel parent + 두 layer 모두 whiteSpace: "nowrap".
 * R-021 준수: RedIndentGuide top + height ≤ panel.height (호출 측 책임).
 * R-022 준수: 토큰 위 말풍선/배지는 wrapper-relative (TokenWithBubble).
 * R-024 준수: ReframeMark / XMark / DotMark / CheckMark 등 panel 안 마커는
 *             안쪽 inset (음수 좌표 금지).
 */

import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts, radii, shadows } from "./theme";

const easeOutCubic = Easing.bezier(0.16, 1, 0.3, 1);
const easeInOut = Easing.bezier(0.45, 0, 0.55, 1);

/* ================================================================== */
/* CARRY-OVER PRIMITIVES (lesson-11 답습 — 시즌 통일)                   */
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
/* CourseLabel — "파이썬 기초 · 12강" pill                              */
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
/* CODE / CONSOLE PRIMITIVES (carry-over from lesson-11)               */
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
  /** 갈라지는(틀린) 줄을 빨갛게 — scene-06 기대 vs 실제 */
  danger?: boolean;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ revealAtSec = 0, dimmed = false, danger = false, children, style }) => {
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
        color: danger ? colors.traceErrName : undefined,
        fontWeight: danger ? 800 : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* VarBox — 변수 박스 (carry-over, scene-04 IndexError 리스트에 사용)    */
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
/* (R-002 / R-019 준수)                                                */
/*                                                                     */
/* ⚠️ 폭 통제 (lesson-12 수정): `newLabel` 을 _정상 flow_ 로 두고          */
/* `initial` 을 absolute 오버레이로 띄운다. 이렇게 하면 wrapper 폭이       */
/* _newLabel 기준_ 으로 잡혀, `a`→`score` / `scroe`→`score` 처럼 두 층의   */
/* 폭이 다른 swap 에서도 레이아웃이 안 흔들린다 (변수명 다듬기는 항상      */
/* newLabel 이 더 길/같음). parent + 두 layer 모두 whiteSpace: nowrap.    */
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
    <span style={{ position: "relative", display: "inline-block", whiteSpace: "nowrap", ...style }}>
      {/* newLabel — 정상 flow (wrapper 폭 결정) */}
      <span style={{ opacity: newOpacity, whiteSpace: "nowrap" }}>{newLabel}</span>
      {/* initial — absolute 오버레이 (좌측 기준) */}
      <span
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          opacity: oldOpacity,
          whiteSpace: "nowrap",
        }}
      >
        {initial}
      </span>
    </span>
  );
};

/* ------------------------------------------------------------------ */
/* EmphasisPulse — 한 토큰을 짧게 강조 펄스 (R-005 주의)                 */
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
/* FlowArrow — 곡선 화살표 (호출/결과 흐름 메타포, R-012)               */
/* ------------------------------------------------------------------ */

export const FlowArrow: React.FC<{
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  curve?: number;
  delaySec?: number;
  durationSec?: number;
  strokeWidth?: number;
  color?: string;
  width?: number;
  height?: number;
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
/* CheckMark — ✓ 마커 (scene-03 교정 / scene-08 좋은 질문 / scene-09)   */
/* (R-024 — panel 안쪽 inset 으로 호출)                                 */
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

/* ================================================================== */
/* LESSON-12-SPECIFIC PRIMITIVES                                       */
/* ================================================================== */

/* ------------------------------------------------------------------ */
/* TracebackBox — 빨간 Traceback 박스 (scene-02/03)                     */
/*                                                                     */
/* 어두운 콘솔 배경 + 좌측 빨간 세로 막대 (border-left 6px). 줄 단위로     */
/* TraceLine 자식을 넣음. `glow` true 면 재프레이밍 후 옅은 violet glow.  */
/*                                                                     */
/* 화면 노출용 (자막 OFF 정책 무관 — 12강 핵심 시각). 마지막 줄/줄번호    */
/* 강조는 TraceLine 의 highlight prop 으로.                              */
/* ------------------------------------------------------------------ */

export const TracebackBox: React.FC<{
  children: React.ReactNode;
  width?: number;
  height?: number | string;
  /** 재프레이밍 후 옅은 violet glow (scene-02 후반) */
  glowAtSec?: number;
  style?: React.CSSProperties;
}> = ({ children, width = 1080, height, glowAtSec, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const glow =
    typeof glowAtSec === "number"
      ? interpolate(frame, [glowAtSec * fps, (glowAtSec + 0.8) * fps], [0, 1], {
          easing: easeOutCubic,
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 0;

  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        background: colors.traceBg,
        borderRadius: 14,
        borderLeft: `6px solid ${colors.traceBarRed}`,
        border: `1px solid ${colors.darkBg2}`,
        borderLeftWidth: 6,
        borderLeftColor: colors.traceBarRed,
        boxShadow: glow > 0.02
          ? `${shadows.card}, 0 0 ${40 * glow}px ${10 * glow}px ${colors.traceBgGlow}`
          : shadows.card,
        overflow: "hidden",
        fontFamily: fonts.mono,
        ...style,
      }}
    >
      {/* 옅은 violet glow 오버레이 (재프레이밍) */}
      {glow > 0.02 ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: colors.traceBgGlow,
            opacity: glow,
            pointerEvents: "none",
          }}
        />
      ) : null}
      <div
        style={{
          position: "relative",
          padding: "28px 34px",
          color: colors.traceInk,
          fontSize: 30,
          lineHeight: 1.6,
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

/* TraceLine — Traceback 한 줄. dimmed(윗줄 흐림) / highlightAtSec(노란 강조) /
   errName(에러 이름 핑크-레드 색). children 으로 토큰 직접. */
export const TraceLine: React.FC<{
  revealAtSec?: number;
  dimmed?: boolean;
  /** 노란 강조 등장 시점 (scene-03 마지막 줄/줄번호). 없으면 강조 X */
  highlightAtSec?: number;
  /** 노란 강조 세기 — full(전체 줄) / partial(부분). 시각만 다름 */
  highlightStrength?: "full" | "partial";
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({
  revealAtSec = 0,
  dimmed = false,
  highlightAtSec,
  highlightStrength = "full",
  children,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = revealAtSec * fps;
  const reveal = interpolate(frame, [start, start + 0.4 * fps], [0, 1], {
    easing: easeOutCubic,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const hi =
    typeof highlightAtSec === "number"
      ? interpolate(
          frame,
          [highlightAtSec * fps, (highlightAtSec + 0.4) * fps],
          [0, 1],
          { easing: easeOutCubic, extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        )
      : 0;

  return (
    <div
      style={{
        position: "relative",
        opacity: reveal * (dimmed ? 0.4 : 1),
        transform: `translateY(${(1 - reveal) * 6}px)`,
        color: dimmed ? colors.traceMuted : colors.traceInk,
        whiteSpace: "pre",
        display: "inline-block",
        alignSelf: "flex-start",
        ...style,
      }}
    >
      {/* 노란 강조 배경 (마지막 줄/줄번호) */}
      {typeof highlightAtSec === "number" ? (
        <div
          style={{
            position: "absolute",
            left: -6,
            right: highlightStrength === "full" ? -10 : "40%",
            top: -2,
            bottom: -2,
            background: colors.highlightYellowSoft,
            border: `1.5px solid ${colors.highlightYellowEdge}`,
            borderRadius: 6,
            opacity: hi,
            pointerEvents: "none",
          }}
        />
      ) : null}
      <span style={{ position: "relative" }}>{children}</span>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Chip — 오답분류 pill (문법오류 / 논리오류 / 개념미숙)                  */
/*                                                                     */
/* tone: red(문법오류) / violet(논리오류) / gray(개념미숙).             */
/* active=false 면 opacity 0.5 톤 다운. pulseAtSec 으로 발화 시점 펄스.  */
/* ------------------------------------------------------------------ */

export type ChipTone = "red" | "violet" | "gray";

const chipPalette: Record<ChipTone, { bg: string; ink: string; border: string }> = {
  red: { bg: colors.dangerRedSoft, ink: colors.dangerRedDeep, border: colors.dangerRedBorder },
  violet: { bg: colors.accentSoft, ink: colors.accentInk, border: colors.accent },
  gray: { bg: colors.borderSoft, ink: colors.inkMuted, border: colors.border },
};

export const Chip: React.FC<{
  label: string;
  tone: ChipTone;
  active?: boolean;
  pulseAtSec?: number;
  fontSize?: number;
  style?: React.CSSProperties;
}> = ({ label, tone, active = true, pulseAtSec, fontSize = 28, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pal = chipPalette[tone];
  const pulse =
    typeof pulseAtSec === "number"
      ? interpolate(
          frame,
          [pulseAtSec * fps, (pulseAtSec + 0.25) * fps, (pulseAtSec + 0.6) * fps, (pulseAtSec + 1.0) * fps],
          [0, 1, 1, 0],
          { easing: easeInOut, extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        )
      : 0;
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "10px 24px",
        borderRadius: radii.pill,
        background: pal.bg,
        color: pal.ink,
        border: `2px solid ${pal.border}`,
        fontFamily: fonts.sans,
        fontSize,
        fontWeight: 700,
        letterSpacing: "-0.01em",
        whiteSpace: "nowrap",
        opacity: active ? 1 : 0.45,
        transform: `scale(${1 + pulse * 0.08})`,
        boxShadow: pulse > 0.05 ? `0 0 0 4px ${pal.border}` : "none",
        ...style,
      }}
    >
      {label}
    </div>
  );
};

/* MisclassChips — 세 칩 가로 배열. activeIndex 만 강조(나머지 톤 다운),
   activeIndex=null 이면 셋 다 active. pulseIndex/pulseAtSec 으로 한 칩 펄스. */
export const MisclassChips: React.FC<{
  delaySec?: number;
  /** 강조할 칩 인덱스 (0=문법, 1=논리, 2=개념). null=셋 다 active */
  activeIndex?: number | null;
  pulseIndex?: number;
  pulseAtSec?: number;
  fontSize?: number;
  gap?: number;
}> = ({ delaySec = 0, activeIndex = null, pulseIndex, pulseAtSec, fontSize = 28, gap = 20 }) => {
  const chips: { label: string; tone: ChipTone }[] = [
    { label: "문법오류", tone: "red" },
    { label: "논리오류", tone: "violet" },
    { label: "개념미숙", tone: "gray" },
  ];
  return (
    <FadeIn delaySec={delaySec} translateY={10}>
      <div style={{ display: "flex", alignItems: "center", gap }}>
        {chips.map((c, i) => (
          <Chip
            key={c.label}
            label={c.label}
            tone={c.tone}
            active={activeIndex === null || activeIndex === i}
            pulseAtSec={pulseIndex === i ? pulseAtSec : undefined}
            fontSize={fontSize}
          />
        ))}
      </div>
    </FadeIn>
  );
};

/* ------------------------------------------------------------------ */
/* UpArrow — 아래→위 세로 화살표 (scene-03 Traceback 읽는 방향)          */
/*                                                                     */
/* R-012 준수: strokeWidth ≥ 6, length(=height) ≥ 200.                 */
/* delaySec 시점에 아래에서 위로 자라남 (markerEnd 가 위쪽).             */
/* ------------------------------------------------------------------ */

export const UpArrow: React.FC<{
  /** 화살표 길이(세로). R-012: ≥ 200 */
  length?: number;
  strokeWidth?: number;
  color?: string;
  delaySec?: number;
  durationSec?: number;
  uid?: string;
  style?: React.CSSProperties;
}> = ({
  length = 240,
  strokeWidth = 6,
  color = colors.accentDeep,
  delaySec = 0,
  durationSec = 0.7,
  uid = "up",
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
  const w = strokeWidth + 20;
  const markerId = `uparrow-${color.replace("#", "")}-${uid}`;
  // path: 아래(y=length) → 위(y=8). dashoffset 으로 아래에서 위로 자라남.
  return (
    <svg
      width={w}
      height={length}
      viewBox={`0 0 ${w} ${length}`}
      style={{ overflow: "visible", ...style }}
    >
      <defs>
        <marker
          id={markerId}
          viewBox="0 0 12 12"
          refX={6}
          refY={4}
          markerWidth={5}
          markerHeight={5}
          orient="auto"
        >
          <path d="M 0 12 L 6 0 L 12 12 z" fill={color} />
        </marker>
      </defs>
      <path
        d={`M ${w / 2} ${length} L ${w / 2} 6`}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - grow}
        markerEnd={grow > 0.9 ? `url(#${markerId})` : undefined}
      />
    </svg>
  );
};

/* ------------------------------------------------------------------ */
/* RedIndentGuide — 버그 줄(들여쓰기 0칸)을 빨간 세로 막대로 강조        */
/*                                                                     */
/* CodePanel wrapper(position: relative) 안 absolute. 빨간 실선 막대.    */
/* R-021 준수: top + height ≤ panel.height (호출 측 책임).               */
/* ------------------------------------------------------------------ */

export const RedIndentGuide: React.FC<{
  left: number;
  top: number;
  height: number;
  delaySec?: number;
  durationSec?: number;
  thickness?: number;
}> = ({ left, top, height, delaySec = 0, durationSec = 0.5, thickness = 4 }) => {
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
        background: colors.dangerRed,
        borderRadius: 2,
        opacity: reveal,
        boxShadow: `0 0 8px 1px ${colors.dangerRedSoft}`,
        pointerEvents: "none",
      }}
    />
  );
};

/* ------------------------------------------------------------------ */
/* QuestionBox — Active Recall 질문 카드 + 정답 reveal (scene-05/06)    */
/*                                                                     */
/* 질문 텍스트 + 가려진 정답. revealAtSec 시점에 정답 reveal.            */
/* R-004 동기 대상 — wire 단계에서 narration "정답은 X" 발화에 맞춰      */
/* revealAtSec 재조정 필수 (placeholder 잔존 금지).                      */
/* ------------------------------------------------------------------ */

export const QuestionBox: React.FC<{
  question: React.ReactNode;
  /** 가려진 정답 (reveal 전엔 ? 박스). reveal 후 표시 */
  answer?: React.ReactNode;
  /** 정답 reveal 시점. 없으면 영원히 가림 (scene-05 용) */
  revealAtSec?: number;
  delaySec?: number;
  width?: number;
  style?: React.CSSProperties;
}> = ({ question, answer, revealAtSec, delaySec = 0, width = 720, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const revealed =
    typeof revealAtSec === "number"
      ? interpolate(
          frame,
          [revealAtSec * fps, (revealAtSec + 0.4) * fps],
          [0, 1],
          { easing: easeOutCubic, extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        )
      : 0;

  return (
    <FadeIn delaySec={delaySec} translateY={12} style={style}>
      <div
        style={{
          width,
          padding: "26px 34px",
          borderRadius: radii.card,
          background: colors.bgWhite,
          border: `2px solid ${colors.accent}`,
          boxShadow: shadows.card,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 24,
          fontFamily: fonts.sans,
        }}
      >
        <div
          style={{
            fontSize: 32,
            fontWeight: 700,
            color: colors.ink,
            letterSpacing: "-0.01em",
            lineHeight: 1.35,
          }}
        >
          {question}
        </div>
        {/* 정답 자리 — ? (가림) → answer (reveal) */}
        <div
          style={{
            position: "relative",
            minWidth: 92,
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {/* 가림 ? */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: 1 - revealed,
              fontFamily: fonts.sans,
              fontSize: 48,
              fontWeight: 800,
              color: colors.accentLight,
            }}
          >
            ?
          </div>
          {/* reveal 정답 */}
          {answer != null ? (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: revealed,
                fontFamily: fonts.mono,
                fontSize: 48,
                fontWeight: 800,
                color: colors.dangerRedDeep,
              }}
            >
              {answer}
            </div>
          ) : null}
        </div>
      </div>
    </FadeIn>
  );
};

/* ------------------------------------------------------------------ */
/* ReframeMark — ⚠ → 🔍 아이콘 교체 (재프레이밍 시각 신호, scene-02)     */
/*                                                                     */
/* warnAtSec 에 ⚠(빨강) 등장 → swapAtSec 에 🔍(violet) 로 교체.          */
/* R-002 준수: ⚠ fade-out 완료 후 buffer 두고 🔍 fade-in.               */
/* R-024 준수: 호출 측에서 박스 안쪽 inset 으로 배치.                     */
/* ------------------------------------------------------------------ */

export const ReframeMark: React.FC<{
  size?: number;
  warnAtSec?: number;
  swapAtSec?: number;
  style?: React.CSSProperties;
}> = ({ size = 60, warnAtSec = 0, swapAtSec = 1.0, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // ⚠ 등장 → swap 시점에 fade-out
  const warnIn = interpolate(frame, [warnAtSec * fps, (warnAtSec + 0.4) * fps], [0, 1], {
    easing: easeOutCubic,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const warnOut = interpolate(frame, [swapAtSec * fps, (swapAtSec + 0.35) * fps], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // 🔍 fade-in (R-002: ⚠ fade-out [swap, swap+0.35] 후 0.2s buffer)
  const lensIn = interpolate(
    frame,
    [(swapAtSec + 0.55) * fps, (swapAtSec + 0.95) * fps],
    [0, 1],
    { easing: easeOutCubic, extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const base: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    width: size,
    height: size,
    borderRadius: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: fonts.sans,
    fontSize: size * 0.5,
    fontWeight: 900,
    lineHeight: 1,
  };

  return (
    <div style={{ position: "relative", width: size, height: size, ...style }}>
      {/* ⚠ (빨강) */}
      <div
        style={{
          ...base,
          opacity: warnIn * warnOut,
          background: colors.dangerRed,
          color: "#ffffff",
          boxShadow: "0 4px 16px -4px rgba(220, 38, 38, 0.45)",
        }}
      >
        ⚠
      </div>
      {/* 🔍 (violet) */}
      <div
        style={{
          ...base,
          opacity: lensIn,
          background: colors.accent,
          color: "#ffffff",
          boxShadow: "0 4px 16px -4px rgba(139, 92, 246, 0.45)",
        }}
      >
        🔍
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* XMark — 빨간 ✕ 마커 (scene-08 나쁜 질문, R-024 안쪽 inset)            */
/* ------------------------------------------------------------------ */

export const XMark: React.FC<{
  size?: number;
  delaySec?: number;
  style?: React.CSSProperties;
}> = ({ size = 44, delaySec = 0, style }) => {
  return (
    <FadeIn delaySec={delaySec} translateY={6} style={style}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: Math.round(size * 0.28),
          background: colors.dangerRed,
          color: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: fonts.sans,
          fontSize: size * 0.52,
          fontWeight: 900,
          lineHeight: 1,
          boxShadow: "0 4px 16px -4px rgba(220, 38, 38, 0.45)",
        }}
      >
        ✕
      </div>
    </FadeIn>
  );
};

/* ------------------------------------------------------------------ */
/* DotMark — 작은 빨간 점 마커 (scene-04 에러로 잡히는 카드)             */
/* (R-024 — panel 안쪽 inset 으로 호출)                                 */
/* ------------------------------------------------------------------ */

export const DotMark: React.FC<{
  size?: number;
  delaySec?: number;
  color?: string;
  style?: React.CSSProperties;
}> = ({ size = 16, delaySec = 0, color = colors.dangerRed, style }) => {
  return (
    <FadeIn delaySec={delaySec} translateY={4} durationSec={0.4} style={style}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          background: color,
          boxShadow: `0 0 0 4px ${colors.dangerRedSoft}`,
        }}
      />
    </FadeIn>
  );
};

/* ------------------------------------------------------------------ */
/* TokenWithBubble — 토큰 위 말풍선 (wrapper-relative, R-022)           */
/*                                                                     */
/* 토큰을 inline-block relative wrapper 로 감싸 말풍선을 absolute 자식    */
/* 으로 위에 띄움. px 하드코딩 대신 토큰 자체 기준 자동 정렬.             */
/* ------------------------------------------------------------------ */

export const TokenWithBubble: React.FC<{
  children: React.ReactNode;
  bubble: React.ReactNode;
  bubbleDelaySec?: number;
  /** 토큰 위로 띄울 거리 (말풍선 아래 끝 ~ 토큰 위) */
  offsetY?: number;
  bubbleWidth?: number;
}> = ({ children, bubble, bubbleDelaySec = 0, offsetY = 14, bubbleWidth }) => {
  return (
    <span style={{ position: "relative", display: "inline-block" }}>
      {children}
      <span
        style={{
          position: "absolute",
          left: "50%",
          bottom: `calc(100% + ${offsetY}px)`,
          transform: "translateX(-50%)",
          pointerEvents: "none",
          whiteSpace: "nowrap",
        }}
      >
        <FadeIn delaySec={bubbleDelaySec} translateY={6} durationSec={0.4}>
          <div
            style={{
              position: "relative",
              padding: "8px 16px",
              borderRadius: 12,
              background: colors.bgWhite,
              border: `1.5px solid ${colors.accent}`,
              boxShadow: shadows.card,
              fontFamily: fonts.sans,
              fontSize: 24,
              fontWeight: 600,
              color: colors.ink,
              letterSpacing: "-0.01em",
              width: bubbleWidth,
              textAlign: "center",
            }}
          >
            {bubble}
            {/* 아래쪽 화살표 꼬리 */}
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "100%",
                transform: "translateX(-50%)",
                width: 0,
                height: 0,
                borderLeft: "8px solid transparent",
                borderRight: "8px solid transparent",
                borderTop: `9px solid ${colors.accent}`,
              }}
            />
          </div>
        </FadeIn>
      </span>
    </span>
  );
};

/* ------------------------------------------------------------------ */
/* easings re-export                                                   */
/* ------------------------------------------------------------------ */

export { easeOutCubic, easeInOut };
