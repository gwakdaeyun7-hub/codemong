"use client"

// 자체 미니 toast — 외부 라이브러리 없이 Context 로 전역 알림을 제공한다.
// 버튼형 액션(좋아요/삭제/완료 등)의 실패·성공 알림을 화면 하단에 통일된 톤으로 띄운다.
// (아이콘이 3개뿐이라 icon-map 없이 직접 import — lesson-content/skill 과 동일한 예외.)

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react"
import { AlertCircle, CheckCircle2, X } from "lucide-react"

import { cn } from "@/lib/utils"

type ToastKind = "success" | "error"
type ToastItem = { id: number; kind: ToastKind; message: string }

type ToastContextValue = {
  toast: (message: string, kind?: ToastKind) => void
  success: (message: string) => void
  error: (message: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error("useToast 는 ToastProvider 안에서만 사용할 수 있습니다.")
  return ctx
}

let idCounter = 0

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])

  const remove = useCallback((id: number) => {
    setItems((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = useCallback(
    (message: string, kind: ToastKind = "error") => {
      const id = ++idCounter
      setItems((prev) => [...prev, { id, kind, message }])
      // 4초 후 자동 제거
      setTimeout(() => remove(id), 4000)
    },
    [remove],
  )

  const success = useCallback((m: string) => toast(m, "success"), [toast])
  const error = useCallback((m: string) => toast(m, "error"), [toast])

  return (
    <ToastContext.Provider value={{ toast, success, error }}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4 sm:bottom-6"
      >
        {items.map((t) => (
          <ToastCard key={t.id} item={t} onClose={() => remove(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

function ToastCard({
  item,
  onClose,
}: {
  item: ToastItem
  onClose: () => void
}) {
  const isError = item.kind === "error"
  const Icon = isError ? AlertCircle : CheckCircle2
  return (
    <div
      role="status"
      className={cn(
        "pointer-events-auto flex w-full max-w-sm items-start gap-2.5 rounded-xl bg-white px-4 py-3 shadow-lg ring-1",
        isError ? "ring-rose-200" : "ring-emerald-200",
      )}
    >
      <Icon
        className={cn(
          "mt-0.5 size-4 shrink-0",
          isError ? "text-rose-500" : "text-emerald-500",
        )}
        strokeWidth={2.25}
        aria-hidden
      />
      <p className="flex-1 text-sm leading-snug text-zinc-800">{item.message}</p>
      <button
        type="button"
        onClick={onClose}
        aria-label="알림 닫기"
        className="shrink-0 text-zinc-400 transition hover:text-zinc-600"
      >
        <X className="size-4" strokeWidth={2.25} />
      </button>
    </div>
  )
}
