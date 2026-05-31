import { cn } from "@/lib/utils"

import type { CourseStatus } from "@/lib/courses"

const STATUS_LABEL: Record<CourseStatus, string> = {
  "in-progress": "진행중",
  done: "완료",
  "not-started": "미시작",
}

// 색상은 dot(원) + 텍스트 둘 다에 의미가 들리도록 텍스트로도 표시.
// (a11y: 색상만으로 상태를 전달하지 않음)
const STATUS_TONE: Record<CourseStatus, { dot: string; text: string }> = {
  "in-progress": { dot: "bg-violet-500", text: "text-violet-600" },
  done: { dot: "bg-emerald-500", text: "text-emerald-600" },
  "not-started": { dot: "bg-zinc-400", text: "text-zinc-500" },
}

export function StatusBadge({ status }: { status: CourseStatus }) {
  const tone = STATUS_TONE[status]
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium">
      <span
        aria-hidden
        className={cn("size-1.5 rounded-full", tone.dot)}
      />
      <span className={tone.text}>{STATUS_LABEL[status]}</span>
    </span>
  )
}
