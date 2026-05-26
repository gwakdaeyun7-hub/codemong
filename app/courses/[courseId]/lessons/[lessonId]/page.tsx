// 강의 상세(개념 탭) 화면.
// Server Component — 데이터 룩업 + 화면 조립. 클라이언트 인터랙션은 leaf(예시 코드 카드 복사 버튼)로 한정.
//
// 라우팅: /courses/[courseId]/lessons/[lessonId]
//   - MVP: courseId ∈ {python, be-python}, lessonId ∈ {"lesson-1" ~ "lesson-11"} 매칭
//   - lesson-12 는 영상 미제작 → notFound()
//   - 그 외엔 notFound()
//
// 레이아웃 (lg+): [좌 사이드바] [가운데 본문] [우 사이드바 320px]
// 모바일: 좌 사이드바 → 상단 가로 스크롤 탭, 우 사이드바 → 본문 아래

import { notFound, redirect } from "next/navigation";

import { CommentSection } from "@/components/comments/comment-section";
import { LessonLikeBar } from "@/components/comments/lesson-like-bar";
import { CourseDetailSidebar } from "@/components/course-detail/course-detail-sidebar";
import { LessonContentHeader } from "@/components/lesson-content/lesson-content-header";
import { LessonNavigation } from "@/components/lesson-content/lesson-navigation";
import { LessonVideoCard } from "@/components/lesson-content/lesson-video-card";
import { BadgesCard } from "@/components/lessons/badges-card";
import { CourseProgressHeader } from "@/components/lessons/course-progress-header";
import { ProgressStatCard } from "@/components/lessons/progress-stat-card";
import { StatsCard } from "@/components/lessons/stats-card";
import { TipsCard } from "@/components/lessons/tips-card";
import { TopNav } from "@/components/top-nav";
import { getCurrentUser } from "@/lib/auth/get-user";
import { getCourseDetail } from "@/lib/course-detail";
import { courses } from "@/lib/courses";
import { getLessonContent } from "@/lib/lesson-content";
import { getCourseLessonStatuses, getLessonProgress } from "@/lib/learning/progress-queries";
import { getLessonPlan } from "@/lib/lesson-plan";

export default async function LessonContentPage({
  params,
}: {
  params: Promise<{ courseId: string; lessonId: string }>;
}) {
  const { courseId, lessonId } = await params;

  // 영상 강의는 로그인 필수 — 비로그인은 로그인 후 이 강의로 돌아오게 한다.
  // (소개/강의 목록은 비로그인도 둘러볼 수 있고, 영상이 있는 이 페이지에서만 막는다.)
  const user = await getCurrentUser();
  if (!user) {
    redirect(
      `/login?next=${encodeURIComponent(`/courses/${courseId}/lessons/${lessonId}`)}`,
    );
  }

  // 1) 강의 콘텐츠 룩업 — 핵심
  const content = getLessonContent(courseId, lessonId);
  // 2) 우측 사이드바용 메타 (강의 목록 + 코스 상세 + 코스 카드 메타)
  const plan = getLessonPlan(courseId);
  const detail = getCourseDetail(courseId);
  const courseMeta =
    courses.find((c) => c.id === courseId) ?? courses.find((c) => c.id === "be-python");

  if (!content || !plan || !detail || !courseMeta) {
    notFound();
  }

  // 학습 진도(이수율 1층) — 현재 강의의 시청/완료 상태 + 코스 전체 강의의 진도(우측 통계용).
  const [progress, lessonStatuses] = await Promise.all([
    getLessonProgress(`${courseId}/${lessonId}`, user.id),
    getCourseLessonStatuses(courseId, user.id),
  ]);

  // 이전/다음 강의 라우트 계산 — 콘텐츠 등록된 강의로만 활성 링크.
  const previousHref =
    content.navigation.previous &&
    getLessonContent(courseId, `lesson-${content.navigation.previous.number}`)
      ? `/courses/${courseId}/lessons/lesson-${content.navigation.previous.number}`
      : null;
  const nextHref =
    content.navigation.next &&
    getLessonContent(courseId, `lesson-${content.navigation.next.number}`)
      ? `/courses/${courseId}/lessons/lesson-${content.navigation.next.number}`
      : null;

  // 강좌 상단 헤더용 카운트 — 실제 진도(lessonStatuses) 기반. (강의 목록 화면과 동일 산식)
  const completedCount = plan.lessons.filter((l) => lessonStatuses[l.id] === "completed").length;
  const inProgressCount = plan.lessons.filter((l) => lessonStatuses[l.id] === "in-progress").length;
  const notStartedCount = plan.lessons.filter((l) => lessonStatuses[l.id] === "not-started").length;
  const totalCount = plan.lessons.length;
  const remainingCount = totalCount - completedCount;
  const progressPercent = totalCount > 0 ? Math.floor((completedCount / totalCount) * 100) : 0;
  const remainingMinutes = plan.lessons
    .filter((l) => lessonStatuses[l.id] !== "completed")
    .reduce((acc, l) => acc + l.durationMinutes, 0);

  return (
    <>
      <TopNav active="study" />

      <main className="mx-auto w-full max-w-7xl flex-1 bg-zinc-50 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:gap-6">
          {/* 좌측 사이드바 (lg+ 세로 / 모바일 가로 스크롤) — `concept` 탭 활성 */}
          <CourseDetailSidebar courseId={courseId} active="concept" />

          {/* 가운데 + 우측: 모바일 1열, lg+ 1fr / 320px */}
          <div className="grid min-w-0 flex-1 grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-[1fr_320px]">
            {/* 가운데 본문 영역 */}
            <div className="flex min-w-0 flex-col gap-4 sm:gap-5">
              {/* 0. 강좌 헤더 (얇게) */}
              <CourseProgressHeader
                title={detail.title}
                description={detail.description}
                level={courseMeta.level}
                icon={courseMeta.icon}
                completedCount={completedCount}
                totalCount={totalCount}
                totalHours={detail.stats.totalHours}
              />

              {/* 1. 강의 헤더 + 서브탭 */}
              <LessonContentHeader
                lessonNumber={content.lessonNumber}
                title={content.title}
                durationMinutes={content.durationMinutes}
                subtabs={content.subtabs}
                activeSubtab={content.activeSubtab}
              />

              {/* 2. 강의 영상 */}
              <LessonVideoCard
                video={content.video}
                durationMinutes={content.durationMinutes}
                lessonRef={`${courseId}/${lessonId}`}
                initialVideoWatched={progress.videoWatched}
                initialLearnCompleted={progress.learnCompleted}
              />

              {/* 2-1. 강의 좋아요 + 댓글 카운트 바 */}
              <LessonLikeBar lessonRef={`${courseId}/${lessonId}`} />

              {/* 3. 이전/다음 강의 */}
              <LessonNavigation
                navigation={content.navigation}
                previousHref={previousHref}
                nextHref={nextHref}
              />

              {/* 4. 댓글 섹션 */}
              <CommentSection target={{ kind: "lesson", lessonRef: `${courseId}/${lessonId}` }} />
            </div>

            {/* 우측 사이드바 — lg+ sticky, 모바일 본문 아래 */}
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
        </div>
      </main>
    </>
  );
}
