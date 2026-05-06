/**
 * Shared visual primitives for Lesson 1.
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

  // Blinking caret on integer-second cadence
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
/* CourseLabel — "파이썬 기초 · 1강" pill                                */
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
/* LowerThird — bottom-center caption strip                            */
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
/* CaptionPlaceholder — bottom band reserved for SRT in step 3         */
/* ------------------------------------------------------------------ */

export const CaptionPlaceholder: React.FC = () => {
  // Visible only as a faint guide so layouts don't clash with caption area.
  return (
    <div
      style={{
        position: "absolute",
        bottom: 80,
        left: 0,
        right: 0,
        height: 80,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          color: colors.inkSubtle,
          fontFamily: fonts.sans,
          fontSize: 24,
          opacity: 0.0, // hidden — reserves vertical space; SRT wires here in step 3
        }}
      >
        [captions]
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Browser / Editor / Terminal mocks                                   */
/* ------------------------------------------------------------------ */

export const BrowserMock: React.FC<{
  url?: string;
  children: React.ReactNode;
  width?: number;
  height?: number;
}> = ({ url = "python.org", children, width = 1100, height = 620 }) => {
  return (
    <div
      style={{
        width,
        height,
        background: colors.bgWhite,
        borderRadius: 16,
        border: `1px solid ${colors.border}`,
        boxShadow: shadows.card,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Chrome */}
      <div
        style={{
          height: 56,
          background: "#f4f4f5",
          borderBottom: `1px solid ${colors.border}`,
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          gap: 14,
        }}
      >
        <div style={{ display: "flex", gap: 8 }}>
          <span style={dot("#ef4444")} />
          <span style={dot("#f59e0b")} />
          <span style={dot("#22c55e")} />
        </div>
        <div
          style={{
            flex: 1,
            height: 32,
            background: colors.bgWhite,
            borderRadius: radii.pill,
            border: `1px solid ${colors.border}`,
            display: "flex",
            alignItems: "center",
            padding: "0 16px",
            color: colors.inkMuted,
            fontFamily: fonts.mono,
            fontSize: 18,
          }}
        >
          {url}
        </div>
      </div>
      {/* Body */}
      <div style={{ flex: 1, padding: 32, display: "flex", flexDirection: "column" }}>
        {children}
      </div>
    </div>
  );
};

export const TerminalMock: React.FC<{
  children: React.ReactNode;
  width?: number;
  height?: number;
  title?: string;
}> = ({ children, width = 900, height = 480, title = "Terminal" }) => {
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
      }}
    >
      <div
        style={{
          height: 44,
          background: "#1f1f23",
          borderBottom: `1px solid ${colors.darkBg2}`,
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          gap: 10,
        }}
      >
        <span style={dot("#ef4444")} />
        <span style={dot("#f59e0b")} />
        <span style={dot("#22c55e")} />
        <span
          style={{
            marginLeft: 16,
            color: colors.darkMuted,
            fontSize: 16,
            fontFamily: fonts.sans,
          }}
        >
          {title}
        </span>
      </div>
      <div
        style={{
          flex: 1,
          padding: "24px 28px",
          color: colors.darkInk,
          fontSize: 26,
          lineHeight: 1.6,
          overflow: "hidden",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export const VsCodeMock: React.FC<{
  fileName?: string;
  unsaved?: boolean;
  children: React.ReactNode;
  width?: number;
  height?: number;
}> = ({ fileName = "hello.py", unsaved = false, children, width = 900, height = 540 }) => {
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
        fontFamily: fonts.sans,
      }}
    >
      {/* Activity bar */}
      <div
        style={{
          width: 56,
          background: "#1c1c20",
          borderRight: `1px solid ${colors.darkBg2}`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: 16,
          gap: 18,
        }}
      >
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              width: 24,
              height: 24,
              borderRadius: 4,
              background: i === 0 ? colors.darkAccent : "#3f3f46",
              opacity: i === 0 ? 0.9 : 0.5,
            }}
          />
        ))}
      </div>
      {/* Sidebar (file tree) */}
      <div
        style={{
          width: 220,
          background: "#1f1f23",
          borderRight: `1px solid ${colors.darkBg2}`,
          padding: "16px 14px",
          color: colors.darkMuted,
          fontSize: 16,
        }}
      >
        <div style={{ fontWeight: 700, fontSize: 14, letterSpacing: 1, marginBottom: 14 }}>
          EXPLORER
        </div>
        <div
          style={{
            color: colors.darkInk,
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 8px",
            borderRadius: 4,
            background: "#2a2a30",
          }}
        >
          <span style={{ color: colors.darkAccent }}>·</span>
          {fileName}
        </div>
      </div>
      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Tab bar */}
        <div
          style={{
            height: 40,
            background: "#1c1c20",
            borderBottom: `1px solid ${colors.darkBg2}`,
            display: "flex",
            alignItems: "stretch",
          }}
        >
          <div
            style={{
              padding: "0 16px",
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: colors.darkBg,
              color: colors.darkInk,
              fontSize: 16,
              borderRight: `1px solid ${colors.darkBg2}`,
            }}
          >
            {fileName}
            {unsaved ? (
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: colors.darkInk,
                }}
              />
            ) : null}
          </div>
        </div>
        {/* Editor body */}
        <div
          style={{
            flex: 1,
            padding: "20px 24px",
            color: colors.darkInk,
            fontFamily: fonts.mono,
            fontSize: 26,
            lineHeight: 1.6,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

const dot = (color: string): React.CSSProperties => ({
  width: 12,
  height: 12,
  borderRadius: "50%",
  background: color,
});

/* ------------------------------------------------------------------ */
/* PythonLogoMock — simple two-snake violet/blue silhouette            */
/* ------------------------------------------------------------------ */

export const PythonLogoMock: React.FC<{ size?: number }> = ({ size = 220 }) => {
  return (
    <div
      style={{
        width: size,
        height: size,
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: size * 0.85,
          height: size * 0.85,
          borderRadius: "30% 60% 35% 60%",
          background: "linear-gradient(135deg, #3b82f6 0%, #6366f1 50%)",
          transform: "rotate(-25deg)",
          opacity: 0.92,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: size * 0.85,
          height: size * 0.85,
          borderRadius: "60% 30% 60% 35%",
          background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.accentDeep} 80%)`,
          transform: "rotate(155deg) translateX(20px) translateY(20px)",
          opacity: 0.92,
        }}
      />
      <div
        style={{
          position: "relative",
          color: "#ffffff",
          fontFamily: fonts.sans,
          fontSize: size * 0.18,
          fontWeight: 800,
          letterSpacing: "-0.02em",
          textShadow: "0 2px 8px rgba(0,0,0,0.25)",
        }}
      >
        Py
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Centered scene shell — vertically/horizontally centers content      */
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

/* re-export easings for scene files */
export { easeOutCubic, easeInOut };
