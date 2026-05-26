// "학습 커리큘럼 로드맵" 카드.
// Server Component.

import { Code2 } from "lucide-react"

import { SectionCard } from "@/components/course-detail/section-card"

import type { RoadmapStep } from "@/lib/course-detail"

// 스텝마다 다른 색을 주어 진행감을 표현. 의미 색이 아닌 "위치 인식" 용도.
const STEP_TONES = [
  "bg-violet-100 text-violet-600",
  "bg-emerald-100 text-emerald-600",
  "bg-blue-100 text-blue-600",
  "bg-cyan-100 text-cyan-600",
  "bg-amber-100 text-amber-600",
  "bg-rose-100 text-rose-600",
]

export function RoadmapCard({ roadmap }: { roadmap: RoadmapStep[] }) {
  return (
    <SectionCard
      title="학습은 이렇게 진행돼요"
      icon={Code2}
      tone="bg-violet-100 text-violet-600"
    >
      <ol className="flex flex-col gap-3.5">
        {roadmap.map((s, i) => {
          const tone = STEP_TONES[i % STEP_TONES.length]
          return (
            <li
              key={s.step}
              className="flex items-start gap-3 rounded-xl px-1 py-1"
            >
              {/* 좌측: 컬러 원형 배지 */}
              <span
                aria-hidden
                className={`inline-flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${tone}`}
              >
                {s.step}
              </span>

              {/* 우측: STEP 라벨 + 한글 라벨 + 설명 */}
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-[11px] font-semibold tracking-wide text-violet-600">
                    STEP {s.step}
                  </span>
                  <span className="text-sm font-bold text-zinc-900">
                    {s.label}
                  </span>
                </div>
                <p className="mt-0.5 text-xs leading-relaxed text-zinc-500">
                  {s.description}
                </p>
              </div>
            </li>
          )
        })}
      </ol>
    </SectionCard>
  )
}
