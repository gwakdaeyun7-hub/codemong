// course-detail 화면에서만 쓰는 lucide 아이콘 화이트리스트.
// course-icon.tsx 와 같은 패턴 — 명시적으로 적은 것만 import 해서 트리쉐이킹을 살림.

import {
  BarChart3,
  BookOpen,
  Brackets,
  CheckCircle2,
  Code2,
  Database,
  FileText,
  FunctionSquare,
  GitBranch,
  Layers,
  Lightbulb,
  Repeat,
  Rocket,
  Server,
  ShieldCheck,
  Sparkles,
  Variable,
  Wand2,
  Zap,
  type LucideIcon,
} from "lucide-react"

export const COURSE_DETAIL_ICONS: Record<string, LucideIcon> = {
  BookOpen,
  Lightbulb,
  Sparkles,
  Wand2,
  Code2,
  CheckCircle2,
  BarChart3,
  Rocket,
  ShieldCheck,
  Server,
  Zap,
  Database,
  Layers,
  Variable,
  GitBranch,
  Repeat,
  Brackets,
  FunctionSquare,
  FileText,
}

export function resolveDetailIcon(name: string): LucideIcon {
  return COURSE_DETAIL_ICONS[name] ?? Sparkles
}
