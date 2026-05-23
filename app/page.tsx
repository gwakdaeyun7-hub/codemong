import { CourseCard } from "@/components/course-card"
import { TopNav } from "@/components/top-nav"
import { getCurrentUser } from "@/lib/auth/get-user"
import { backendCourses, type CourseStatus } from "@/lib/courses"
import { getCourseCompletion } from "@/lib/learning/progress-queries"

// 홈 화면 = 코드학습 페이지 (Server Component).
// MVP 범위: Python 백엔드 1개 코스만 노출. 카드 진행률/상태는 로그인 사용자의 실제 학습 완료(이수율)로 채운다.
// (코스가 늘면 코스별로 getCourseCompletion 을 호출하도록 확장.)
export default async function HomePage() {
  const user = await getCurrentUser()

  // 현재 단일 코스(be-python) 이수율.
  const completion = await getCourseCompletion("be-python", user?.id ?? null)
  const status: CourseStatus =
    completion.completed === 0
      ? "not-started"
      : completion.completed >= completion.total
        ? "done"
        : "in-progress"

  return (
    <>
      <TopNav active="study" />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* 페이지 헤더 */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-[26px]">
            코드 학습
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            강의 영상으로 기초부터 차근차근 배워보세요.
          </p>
        </div>

        {/* 코스 카드 그리드: 모바일 1열 → sm 2열 → lg 3열 */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {backendCourses.map((c) => (
            <CourseCard
              key={c.id}
              course={{
                ...c,
                status,
                progress: { current: completion.completed, total: completion.total },
              }}
            />
          ))}
        </div>
      </main>
    </>
  )
}
