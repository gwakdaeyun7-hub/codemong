import type { ReactNode } from "react"
import { LayoutGrid, Settings } from "lucide-react"

import { CourseCard } from "@/components/course-card"
import { LearningModeToggle } from "@/components/learning-mode-toggle"
import { TopNav } from "@/components/top-nav"
import { backendCourses, frontendCourses } from "@/lib/courses"

// 홈 화면 = 코드학습 페이지 (Server Component).
// LearningModeToggle 만 클라이언트 컴포넌트로 격리되어 있음 — 나머지는 모두 서버 렌더.
export default function HomePage() {
  return (
    <>
      <TopNav active="study" />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* 학습 모드 토글 */}
        <div className="mb-6">
          <LearningModeToggle defaultMode="concept" />
        </div>

        {/* 페이지 헤더 */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-[26px]">
            코드 학습
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            기초부터 단계별로 이루어진 문제들을 풀어보세요.
          </p>
        </div>

        {/* 프론트엔드 섹션 */}
        <CourseSection
          title="프론트엔드"
          icon={<LayoutGrid className="size-4 text-violet-600" />}
        >
          {frontendCourses.map((c) => (
            <CourseCard key={c.id} course={c} />
          ))}
        </CourseSection>

        {/* 백엔드 섹션 — MVP 범위 결정에 따라 Python 1개만 노출 */}
        <CourseSection
          title="백엔드"
          icon={<Settings className="size-4 text-violet-600" />}
        >
          {backendCourses.map((c) => (
            <CourseCard key={c.id} course={c} />
          ))}
        </CourseSection>
      </main>
    </>
  )
}

// 같은 파일 내부 보조 컴포넌트 — 다른 페이지에서 쓰일 가능성이 낮아 page.tsx 안에 둠.
// 재사용이 필요해지면 components/section.tsx 로 이동.
function CourseSection({
  title,
  icon,
  children,
}: {
  title: string
  icon: ReactNode
  children: ReactNode
}) {
  return (
    <section className="mb-10 last:mb-0">
      <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-zinc-900">
        {icon}
        {title}
      </h2>
      {/* 그리드: 모바일 1열 → sm 2열 → lg 3열.
          백엔드처럼 카드가 1개여도 첫 칸에 자연스럽게 들어가도록 justify-start 기본값 유지 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {children}
      </div>
    </section>
  )
}
