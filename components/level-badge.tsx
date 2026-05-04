import { cn } from "@/lib/utils"

import type { CourseLevel } from "@/lib/courses"

const LEVEL_LABEL: Record<CourseLevel, string> = {
  beginner: "초급",
  intermediate: "중급",
  advanced: "고급",
}

// pill 형태. 색상 + 텍스트로 의미 전달.
const LEVEL_TONE: Record<CourseLevel, string> = {
  beginner: "bg-orange-100 text-orange-600",
  intermediate: "bg-violet-100 text-violet-600",
  advanced: "bg-rose-100 text-rose-600",
}

export function LevelBadge({ level }: { level: CourseLevel }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold",
        LEVEL_TONE[level],
      )}
    >
      {LEVEL_LABEL[level]}
    </span>
  )
}
