/**
 * Lesson 1 design tokens. Aligns with CodeMong main app:
 *   - background zinc-50 (#fafafa) for page; zinc-900 (#18181b) for code/terminal panels
 *   - violet accent (#8b5cf6 = violet-500, #7c3aed = violet-600, #a855f7 = purple-500)
 *   - rounded-2xl cards with soft shadow
 *   - Pretendard 1순위, fallback Noto Sans KR / system-ui
 */

export const colors = {
  bg: "#fafafa", // zinc-50
  bgWhite: "#ffffff",
  ink: "#18181b", // zinc-900
  inkSoft: "#3f3f46", // zinc-700
  inkMuted: "#71717a", // zinc-500
  inkSubtle: "#a1a1aa", // zinc-400
  border: "#e4e4e7", // zinc-200
  borderSoft: "#f4f4f5", // zinc-100
  accent: "#8b5cf6", // violet-500
  accentDeep: "#7c3aed", // violet-600
  accentSoft: "#ede9fe", // violet-100
  accentInk: "#5b21b6", // violet-800
  // dark surfaces (terminal / code panel)
  darkBg: "#18181b", // zinc-900
  darkBg2: "#27272a", // zinc-800
  darkInk: "#e4e4e7", // zinc-200
  darkMuted: "#a1a1aa", // zinc-400
  darkAccent: "#a78bfa", // violet-400
  // status
  success: "#22c55e",
} as const;

export const fonts = {
  sans: 'Pretendard, "Noto Sans KR", system-ui, -apple-system, sans-serif',
  mono: '"JetBrains Mono", "Fira Code", ui-monospace, "SF Mono", Menlo, Consolas, monospace',
} as const;

export const radii = {
  card: 24, // rounded-2xl
  pill: 999,
  sm: 8,
  md: 12,
} as const;

export const shadows = {
  card: "0 4px 24px -8px rgba(24, 24, 27, 0.10), 0 1px 2px rgba(24, 24, 27, 0.04)",
  cardSoft: "0 2px 12px -4px rgba(24, 24, 27, 0.06)",
} as const;
