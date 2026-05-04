// 강의 상세(개념 탭) 화면에서만 쓰는 lucide 아이콘 화이트리스트.
// course-detail/icon-map.ts / lessons/icon-map.ts 와 같은 패턴 — 명시 import 로 트리쉐이킹 살림.

import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Brain,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Code,
  Code2,
  Gamepad2,
  Globe,
  GraduationCap,
  Layers,
  Lightbulb,
  Play,
  Server,
  Sparkles,
  Terminal,
  Users,
  Workflow,
  type LucideIcon,
} from "lucide-react"

export const LESSON_CONTENT_ICONS: Record<string, LucideIcon> = {
  ArrowRight,
  BarChart3,
  BookOpen,
  Brain,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Code,
  Code2,
  Gamepad2,
  Globe,
  GraduationCap,
  Layers,
  Lightbulb,
  Play,
  Server,
  Sparkles,
  Terminal,
  Users,
  Workflow,
}

export function resolveLessonContentIcon(name: string): LucideIcon {
  return LESSON_CONTENT_ICONS[name] ?? Sparkles
}

import type { ContentTone } from "@/lib/lesson-content"

/**
 * ContentTone 키 → 카드 톤 (옅은 배경 + 진한 글자 + 링).
 * 의미 색이 아닌 시각적 다양성. 각 카드/노드/포인트가 살짝 다른 인상을 주도록.
 */
export const CONTENT_TONE: Record<
  ContentTone,
  {
    /** 옅은 배경 (카드/박스용) */
    softBg: string
    /** 옅은 ring */
    softRing: string
    /** 진한 글자 */
    text: string
    /** 작은 dot/icon 박스 (배경+글자) */
    badge: string
    /** dot 단색 */
    dot: string
  }
> = {
  violet: {
    softBg: "bg-violet-50",
    softRing: "ring-violet-100",
    text: "text-violet-700",
    badge: "bg-violet-100 text-violet-600",
    dot: "bg-violet-500",
  },
  blue: {
    softBg: "bg-blue-50",
    softRing: "ring-blue-100",
    text: "text-blue-700",
    badge: "bg-blue-100 text-blue-600",
    dot: "bg-blue-500",
  },
  amber: {
    softBg: "bg-amber-50",
    softRing: "ring-amber-100",
    text: "text-amber-700",
    badge: "bg-amber-100 text-amber-600",
    dot: "bg-amber-500",
  },
  emerald: {
    softBg: "bg-emerald-50",
    softRing: "ring-emerald-100",
    text: "text-emerald-700",
    badge: "bg-emerald-100 text-emerald-600",
    dot: "bg-emerald-500",
  },
  rose: {
    softBg: "bg-rose-50",
    softRing: "ring-rose-100",
    text: "text-rose-700",
    badge: "bg-rose-100 text-rose-600",
    dot: "bg-rose-500",
  },
  sky: {
    softBg: "bg-sky-50",
    softRing: "ring-sky-100",
    text: "text-sky-700",
    badge: "bg-sky-100 text-sky-600",
    dot: "bg-sky-500",
  },
}

export function resolveContentTone(tone: ContentTone) {
  return CONTENT_TONE[tone] ?? CONTENT_TONE.violet
}
