// 강의 목록 화면 — 강좌 헤더 + 강의 카드 리스트 + 우측 사이드바.
// Server Component. 데이터 룩업 + 화면 조립만 담당, 인터랙션은 client 자식(LessonList)으로 한정.

import { notFound } from "next/navigation"

import { BadgesCard } from "@/components/lessons/badges-card"
import { CourseProgressHeader } from "@/components/lessons/course-progress-header"
import { LessonList } from "@/components/lessons/lesson-list"
import { ProgressStatCard } from "@/components/lessons/progress-stat-card"
import { StatsCard } from "@/components/lessons/stats-card"
import { TipsCard } from "@/components/lessons/tips-card"
import { TopNav } from "@/components/top-nav"
import { getCurrentUser } from "@/lib/auth/get-user"
import { getCourseDetail } from "@/lib/course-detail"
import { courses } from "@/lib/courses"
import { getCourseLessonStatuses } from "@/lib/learning/progress-queries"
import { getLessonPlan } from "@/lib/lesson-plan"

// Next.js 16 App Router: dynamic route params 는 Promise 로 들어옴.
export default async function CourseLessonsPage({
  params,
}: {
  params: Promise<{ courseId: string }>
}) {
  const { courseId } = await params

  // 1) 강의 목록 데이터 룩업 (python / be-python 둘 다 매칭)
  const plan = getLessonPlan(courseId)
  // 2) 헤더 카드용 강좌 메타 (난이도/아이콘) + 누적 시간 stat
  const courseMeta =
    courses.find((c) => c.id === courseId) ??
    courses.find((c) => c.id === "be-python")
  const detail = getCourseDetail(courseId)

  if (!plan || !courseMeta || !detail) {
    notFound()
  }

  // 강의별 실제 진도(이수율) — 로그인 사용자의 LessonProgress 기반. 비로그인이면 전부 미시작.
  const user = await getCurrentUser()
  const statusMap = await getCourseLessonStatuses(courseId, user?.id ?? null)
  const lessons = plan.lessons.map((l) => ({
    ...l,
    status: statusMap[l.id] ?? l.status,
  }))

  // status 별 카운트 — 헤더/사이드바 양쪽에서 재사용.
  const completedCount = lessons.filter((l) => l.status === "completed").length
  const inProgressCount = lessons.filter((l) => l.status === "in-progress").length
  const notStartedCount = lessons.filter((l) => l.status === "not-started").length
  const totalCount = lessons.length

  // 사이드바 카운트 — completed 외 모두 "남음"으로 묶어 카드 안에서 다시 표기.
  const remainingCount = totalCount - completedCount

  // 사이드바 진행률 — completed 비율 (헤더와 동일 산식, 한 곳에서 일관)
  const progressPercent =
    totalCount > 0 ? Math.floor((completedCount / totalCount) * 100) : 0

  // 남은 강의들의 분 합 — completed 가 아닌 것 모두 (in-progress + not-started)
  const remainingMinutes = lessons
    .filter((l) => l.status !== "completed")
    .reduce((acc, l) => acc + l.durationMinutes, 0)

  return (
    <>
      <TopNav active="study" />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* 2열 레이아웃: lg+ 좌측 메인 + 우측 320px 사이드바 / 모바일 1열 */}
        <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-[1fr_320px]">
          {/* 좌측 메인 영역 */}
          <div className="flex min-w-0 flex-col gap-4 sm:gap-5">
            <CourseProgressHeader
              title={detail.title}
              description={detail.description}
              level={courseMeta.level}
              icon={courseMeta.icon}
              completedCount={completedCount}
              totalCount={totalCount}
              totalHours={detail.stats.totalHours}
            />

            <LessonList lessons={lessons} courseId={courseId} />
          </div>

          {/* 우측 사이드바 — lg+ 에서 sticky 로 따라옴 */}
          <aside className="flex flex-col gap-4 sm:gap-5 lg:sticky lg:top-20 lg:self-start">
            <ProgressStatCard
              percent={progressPercent}
              completedCount={completedCount}
              remainingCount={remainingCount}
            />
            <StatsCard
              completedCount={completedCount}
              inProgressCount={inProgressCount}
              notStartedCount={notStartedCount}
              remainingMinutes={remainingMinutes}
            />
            <TipsCard tips={plan.tips} />
            <BadgesCard badges={plan.badges} />
          </aside>
        </div>
      </main>
    </>
  )
}
