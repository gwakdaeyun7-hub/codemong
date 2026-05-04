"use client"

// 클라이언트 컴포넌트인 이유: 활성 탭 상태와 onClick 핸들러가 필요.
// (라우트가 연결되면 next/navigation 의 usePathname 으로 active를 derive 하도록 교체 예정)

import { useState } from "react"
import { BookOpen, Code2 } from "lucide-react"

import { cn } from "@/lib/utils"

type Mode = "concept" | "editor"

const MODES: { key: Mode; label: string; icon: typeof BookOpen }[] = [
  { key: "concept", label: "개념학습", icon: BookOpen },
  { key: "editor", label: "코드에디터", icon: Code2 },
]

export function LearningModeToggle({
  defaultMode = "concept",
  onChange,
}: {
  defaultMode?: Mode
  onChange?: (mode: Mode) => void
}) {
  const [mode, setMode] = useState<Mode>(defaultMode)

  return (
    <div
      role="tablist"
      aria-label="학습 모드"
      className="inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-white p-1 shadow-sm"
    >
      {MODES.map((m) => {
        const Icon = m.icon
        const isActive = mode === m.key
        return (
          <button
            key={m.key}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => {
              setMode(m.key)
              onChange?.(m.key)
            }}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500",
              isActive
                ? "bg-violet-600 text-white shadow"
                : "text-zinc-500 hover:text-zinc-800",
            )}
          >
            <Icon className="size-4" />
            {m.label}
          </button>
        )
      })}
    </div>
  )
}
