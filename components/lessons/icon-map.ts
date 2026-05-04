// lessons 화면에서만 쓰는 lucide 아이콘 화이트리스트.
// course-icon.tsx / course-detail/icon-map.ts 와 같은 패턴 — 명시 import 로 트리쉐이킹 살림.

import {
  Award,
  BarChart3,
  CheckCircle2,
  Circle,
  Clock,
  Code2,
  Flame,
  Lightbulb,
  Lock,
  Plus,
  Play,
  PlayCircle,
  Rocket,
  Sparkles,
  Target,
  Trophy,
  Zap,
  type LucideIcon,
} from "lucide-react"

export const LESSONS_ICONS: Record<string, LucideIcon> = {
  Award,
  BarChart3,
  CheckCircle2,
  Circle,
  Clock,
  Code2,
  Flame,
  Lightbulb,
  Lock,
  Plus,
  Play,
  PlayCircle,
  Rocket,
  Sparkles,
  Target,
  Trophy,
  Zap,
}

export function resolveLessonIcon(name: string): LucideIcon {
  return LESSONS_ICONS[name] ?? Sparkles
}

/**
 * 뱃지 톤 키 → Tailwind 색상 클래스.
 * acquired=true 일 때는 채도 있게, false 일 때는 회색 처리.
 */
export const BADGE_TONE: Record<
  string,
  { bg: string; fg: string; ring: string }
> = {
  rose: { bg: "bg-rose-100", fg: "text-rose-600", ring: "ring-rose-200/60" },
  amber: { bg: "bg-amber-100", fg: "text-amber-600", ring: "ring-amber-200/60" },
  sky: { bg: "bg-sky-100", fg: "text-sky-600", ring: "ring-sky-200/60" },
  violet: { bg: "bg-violet-100", fg: "text-violet-600", ring: "ring-violet-200/60" },
  emerald: {
    bg: "bg-emerald-100",
    fg: "text-emerald-600",
    ring: "ring-emerald-200/60",
  },
}

export function resolveBadgeTone(tone: string) {
  return BADGE_TONE[tone] ?? BADGE_TONE.violet
}
