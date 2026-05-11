/**
 * Shared visual primitives for Lesson 3.
 *
 * Base primitives (FadeIn / TypeOn / Card / CourseLabel / PageBackground /
 * AccentUnderline / LowerThird / CenteredStage) are duplicated from
 * lesson-1·lesson-2 for visual continuity across the season — see
 * `videos/python/lesson-2/03-composition/primitives.tsx` for the same set.
 *
 * Lesson-3-specific primitives (further down):
 *   - CodePanel       — 어두운 코드 에디터 패널 (줄번호 + monospace, 인라인 토큰 색상)
 *   - CodeLine        — 한 줄 코드 (type-on 또는 fade-in 모드)
 *   - PyToken         — Python 토큰 인라인 syntax-highlight (런타임 highlighter 호출 X)
 *   - ConsolePanel    — 출력 결과 패널 (어두운 배경, "출력 결과" 헤더)
 *   - VarBox          — 변수 박스 (위에 이름표 라벨 + 박스 안에 값)
 *   - DashedHArrow    — 코드↔콘솔 매칭용 가로 점선 화살표
 *   - LabelArrow      — 코드 토큰 위로 떨어지는 화살표 + 라벨 (scene 4)
 *   - PersonGlyph     — 자기소개 카드용 사람 실루엣
 *   - TrashIcon       — scene 11 휴지통 (잠깐 비치고 사라짐)
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
/* CourseLabel — "파이썬 기초 · 3강" pill                                */
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
/* LESSON-3-SPECIFIC PRIMITIVES                                        */
/* ================================================================== */

/* ------------------------------------------------------------------ */
/* PyToken — Python 토큰의 인라인 syntax-highlight                     */
/*                                                                     */
/* 런타임에 syntax-highlight 라이브러리를 호출하면 Remotion 렌더 워커가  */
/* 깨질 수 있어, 토큰 종류를 명시 prop 으로 받아 색만 칠한다             */
/* (대본의 모든 코드가 한두 줄이라 정적 토크나이즈 스크립트는 불필요).    */
/*                                                                     */
/* kind:                                                                */
/*   keyword  — True / False                                            */
/*   string   — "코드몽" 같은 따옴표 포함 문자열 (따옴표도 같은 색)       */
/*   number   — 5, 3.14, 6                                              */
/*   name     — name, age, is_student (변수)                            */
/*   func     — print                                                   */
/*   op       — = ( ) , .                                               */
/*   text     — 일반 (rare; default)                                    */
/* ------------------------------------------------------------------ */

export type PyTokenKind =
  | "keyword"
  | "string"
  | "number"
  | "name"
  | "func"
  | "op"
  | "text";

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
/* CodePanel — 어두운 코드 에디터 패널                                  */
/*                                                                     */
/* 줄번호 column + 코드 column. children 으로 CodeLine 들을 받음.      */
/* 헤더에 옵션 파일명 (e.g. "intro.py") 노출.                           */
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
/* CodeLine — 코드 한 줄                                                */
/*                                                                     */
/* 두 모드:                                                              */
/*  - children prop 으로 PyToken 들을 직접 받기 (정적 색칠)              */
/*  - 줄번호는 자동 부여 (lineNumber prop)                              */
/*  - revealAtSec 으로 등장 시점 (FadeIn translateY 8px) 컨트롤          */
/*  - dimmed=true 면 opacity 0.4 (이전 줄 톤다운)                        */
/*  - highlighted=true 면 줄 좌측에 violet 세로 막대 (새 줄 강조 / 0.4초) */
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
  const reveal = interpolate(
    frame,
    [start, start + 0.4 * fps],
    [0, 1],
    {
      easing: easeOutCubic,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
  const baseOpacity = dimmed ? 0.4 : 1;
  const opacity = reveal * baseOpacity;
  const ty = (1 - reveal) * 8;

  // 새 줄 강조 막대: revealAtSec 부터 highlightDurationSec 동안 보임 → fade out
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
      {/* 좌측 강조 막대 */}
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
      {/* 줄번호 */}
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
      {/* 코드 토큰 */}
      <span style={{ whiteSpace: "pre" }}>{children}</span>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* ConsolePanel — 출력 결과 패널                                        */
/*                                                                     */
/* 어두운 배경 + "출력 결과" 헤더 라벨. children 으로 ConsoleLine 들.   */
/* 코드 패널과 비주얼적으로 구분되도록 살짝 다른 톤 (zinc-800 base).    */
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
  children: React.ReactNode;
}> = ({ revealAtSec = 0, dimmed = false, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = revealAtSec * fps;
  const reveal = interpolate(
    frame,
    [start, start + 0.4 * fps],
    [0, 1],
    {
      easing: easeOutCubic,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
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
/*                                                                     */
/* 이름표는 위에서 떨어지듯 fade-in (delay = labelDelaySec).            */
/* 박스 본체는 rounded-2xl, violet-500 외곽선 (highlighted) 또는 1px.   */
/* 박스 안 값은 자식으로 받음 (PyToken / TypeOn / 일반 텍스트).          */
/* ------------------------------------------------------------------ */

export const VarBox: React.FC<{
  /** 이름표 텍스트 (변수 이름 — 따옴표 없는 영문) */
  label: string;
  /** 이름표 등장 시점 (sec, scene local) */
  labelDelaySec?: number;
  /** 박스 본체 등장 시점 (sec, scene local) */
  boxDelaySec?: number;
  /** 박스 외곽선 강조 (violet-500 + soft glow) */
  highlighted?: boolean;
  /** 박스 dim (opacity 0.5) */
  dimmed?: boolean;
  /** 박스 안 콘텐츠 (값) — 보통 PyToken 으로 색칠 */
  children?: React.ReactNode;
  /** 박스 폭 */
  width?: number;
  /** 박스 높이 */
  height?: number;
  /** 라벨 폰트 사이즈 */
  labelFontSize?: number;
  /** 값 폰트 사이즈 */
  valueFontSize?: number;
  /** 라벨 dim (튜플 swap 같은 시각화에서 라벨만 살리고 값만 변할 때) */
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
      {/* 이름표 라벨 — 위에서 떨어지듯 */}
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

      {/* 박스 본체 */}
      <FadeIn delaySec={boxDelaySec} translateY={10}>
        <div
          style={{
            width,
            height,
            borderRadius: 18,
            background: colors.bgWhite,
            border: highlighted
              ? `3px solid ${colors.accent}`
              : `2px solid ${colors.border}`,
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
/* DashedHArrow — 가로 점선 화살표 (코드 줄 ↔ 콘솔 줄 매칭)             */
/*                                                                     */
/* x0 → x1 (왼쪽 → 오른쪽) 으로 width=x1-x0 인 가로 점선.               */
/* delaySec 동안 좌→우 grow.                                            */
/* ------------------------------------------------------------------ */

export const DashedHArrow: React.FC<{
  width: number;
  delaySec?: number;
  durationSec?: number;
  color?: string;
  thickness?: number;
}> = ({
  width,
  delaySec = 0,
  durationSec = 0.5,
  color = colors.inkSubtle,
  thickness = 3,
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
      {/* 화살촉 (grow 가 끝에 도달하면 표시) */}
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
/*                                                                     */
/* scene 4 의 "변수 이름" / "할당" / "값" 화살표 라벨용.                 */
/* 작은 ↓ 화살표 + 라벨 텍스트 박스. 위에서 8px 떨어지며 fade-in.        */
/* ------------------------------------------------------------------ */

export const LabelArrow: React.FC<{
  label: string;
  delaySec?: number;
  color?: string;
  emphasize?: boolean; // violet 강조 톤 (true) vs 회색 (false)
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

/* ------------------------------------------------------------------ */
/* PersonGlyph — 자기소개 카드용 사람 실루엣 (scene 8)                  */
/*                                                                     */
/* 단순화 SVG. lesson-2 의 PersonGlyph 와 동일한 형상이지만 per-lesson  */
/* 복제 (workspace-layout 정책).                                        */
/* ------------------------------------------------------------------ */

export const PersonGlyph: React.FC<{ size?: number; color?: string }> = ({
  size = 96,
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

/* ------------------------------------------------------------------ */
/* TrashIcon — scene 11 휴지통 (잠깐 비치고 사라짐)                     */
/*                                                                     */
/* 단순한 사다리꼴 + 뚜껑. delaySec 부터 fade-in (0.3s),                 */
/* lifespanSec 동안 표시 후 fade-out (0.4s).                           */
/* ------------------------------------------------------------------ */

export const TrashIcon: React.FC<{
  size?: number;
  delaySec?: number;
  lifespanSec?: number;
  color?: string;
}> = ({ size = 56, delaySec = 0, lifespanSec = 1.0, color = colors.danger }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = delaySec * fps;
  const opacity = interpolate(
    frame,
    [
      start,
      start + 0.3 * fps,
      (delaySec + lifespanSec) * fps,
      (delaySec + lifespanSec + 0.4) * fps,
    ],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      style={{ opacity }}
    >
      {/* 뚜껑 */}
      <rect x="3" y="5" width="18" height="2.5" rx="1" fill={color} />
      {/* 손잡이 */}
      <rect x="9" y="2.5" width="6" height="2" rx="0.6" fill={color} />
      {/* 본체 */}
      <path
        d="M 5 8 L 6 21 Q 6.2 22 7.2 22 L 16.8 22 Q 17.8 22 18 21 L 19 8 Z"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* 세로 라인 (쓰레기통 표면 디테일) */}
      <line x1="9" y1="11" x2="9" y2="19" stroke={color} strokeWidth="1.4" />
      <line x1="12" y1="11" x2="12" y2="19" stroke={color} strokeWidth="1.4" />
      <line x1="15" y1="11" x2="15" y2="19" stroke={color} strokeWidth="1.4" />
    </svg>
  );
};

/* ------------------------------------------------------------------ */
/* HandPointer — scene 3 박스 이름표를 가리키는 손 모양 (단순)          */
/* ------------------------------------------------------------------ */

export const HandPointer: React.FC<{ size?: number; color?: string }> = ({
  size = 64,
  color = colors.accentDeep,
}) => {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M 6 13 L 6 18 Q 6 21 9 21 L 15 21 Q 18 21 18 18 L 18 12 Q 18 11 17 11 Q 16 11 16 12 L 16 14 L 15.5 14 L 15.5 8 Q 15.5 7 14.5 7 Q 13.5 7 13.5 8 L 13.5 13 L 13 13 L 13 5 Q 13 4 12 4 Q 11 4 11 5 L 11 13 L 10.5 13 L 10.5 7 Q 10.5 6 9.5 6 Q 8.5 6 8.5 7 L 8.5 13.5 L 7.5 14.5 Q 6 16 6 13 Z"
        fill={color}
        opacity={0.95}
      />
    </svg>
  );
};

/* ------------------------------------------------------------------ */
/* easings re-export for scene files                                   */
/* ------------------------------------------------------------------ */

export { easeOutCubic, easeInOut };
