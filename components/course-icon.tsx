import {
  Atom,
  Code2,
  Diamond,
  FileText,
  Paintbrush,
  RefreshCw,
  Triangle,
  type LucideIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"

// 코스 아이콘 글리프 화이트리스트.
// 새 글리프를 추가하려면 lucide-react에서 import 하고 이 맵에만 추가하면 됨.
// (이렇게 정적 매핑하는 이유: dynamic import string으로 lucide 전체를 끌어다 쓰면
//  트리쉐이킹이 풀리고 번들이 부풀어. 명시적으로 적은 것만 들어오게 함.)
const ICON_MAP: Record<string, LucideIcon> = {
  Paintbrush,
  Atom,
  Triangle,
  RefreshCw,
  FileText,
  Diamond,
  Code2,
}

export function CourseIcon({
  glyph,
  tone,
  className,
}: {
  glyph: string
  tone: string
  className?: string
}) {
  const Icon = ICON_MAP[glyph] ?? Code2
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex size-9 shrink-0 items-center justify-center rounded-lg",
        tone,
        className,
      )}
    >
      <Icon className="size-5" strokeWidth={2.25} />
    </span>
  )
}
