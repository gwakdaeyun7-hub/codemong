import { notFound } from "next/navigation"

import { ChecklistCard } from "@/components/course-detail/checklist-card"
import { CourseDetailHeader } from "@/components/course-detail/course-detail-header"
import { CourseDetailSidebar } from "@/components/course-detail/course-detail-sidebar"
import { CtaCard } from "@/components/course-detail/cta-card"
import { LearningOutcomesCard } from "@/components/course-detail/learning-outcomes-card"
import { ReviewsCard } from "@/components/course-detail/reviews-card"
import { RoadmapCard } from "@/components/course-detail/roadmap-card"
import { SiteFooter } from "@/components/site-footer"
import { TopNav } from "@/components/top-nav"
import { getCourseDetail } from "@/lib/course-detail"
import { courses } from "@/lib/courses"

// Next.js 16 App Router: dynamic route params 는 Promise 로 들어옴.
// async server component 에서 await 후 사용.
export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ courseId: string }>
}) {
  const { courseId } = await params

  // 1) 상세 콘텐츠 룩업
  const detail = getCourseDetail(courseId)
  // 2) 헤더 카드에 쓸 메타(아이콘/난이도) 룩업.
  //    `courseId` 와 정확히 일치하는 카드가 없으면 (예: courseId === "python"),
  //    Python 카드(`be-python`) 로 폴백.
  const courseMeta =
    courses.find((c) => c.id === courseId) ??
    courses.find((c) => c.id === "be-python")

  if (!detail || !courseMeta) {
    notFound()
  }

  return (
    <>
      <TopNav active="study" />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:gap-6">
          <CourseDetailSidebar courseId={courseId} active="intro" />

          {/* 메인 컨텐츠 영역: min-w-0 으로 grid 자식이 부모 폭을 넘기지 않게 함 */}
          <div className="flex min-w-0 flex-1 flex-col gap-4 sm:gap-5">
            <CourseDetailHeader
              title={detail.title}
              description={detail.description}
              level={courseMeta.level}
              stats={detail.stats}
              icon={courseMeta.icon}
            />

            <LearningOutcomesCard outcomes={detail.learningOutcomes} />

            <RoadmapCard roadmap={detail.roadmap} />

            {/* 추천 + 준비사항: lg+ 2열, 모바일 1열 */}
            <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-2">
              <ChecklistCard variant="audience" items={detail.recommendedFor} />
              <ChecklistCard
                variant="prerequisite"
                items={detail.prerequisites}
              />
            </div>

            <CtaCard cta={detail.cta} courseId={courseId} />

            {detail.reviews.length > 0 && (
              <ReviewsCard reviews={detail.reviews} />
            )}
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  )
}
