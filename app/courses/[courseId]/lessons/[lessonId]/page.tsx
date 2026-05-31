// 강의 상세 화면.
// Server Component — 데이터 룩업 + 화면 조립. 클라이언트 인터랙션은 leaf 컴포넌트로 한정.
//
// 라우팅: /courses/[courseId]/lessons/[lessonId]
//   - courseId ∈ {python, be-python}
//   - 영상 강의: lessonId ∈ {"lesson-1" ~ "lesson-12"} (getLessonContent 매칭) → 영상 카드
//   - 프로젝트 강의: lessonId == "lesson-13" (getProject 매칭) → 영상 대신 ProjectRunner
//   - 그 외엔 notFound()
//   - 로그인 필수 (영상/프로젝트 모두) — 비로그인은 로그인 후 이 강의로 돌아오게 한다.
//
// 레이아웃 (lg+): [좌 사이드바] [가운데 본문] [우 사이드바 320px]
// 모바일: 좌 사이드바 → 상단 가로 스크롤 탭, 우 사이드바 → 본문 아래

import { notFound, redirect } from "next/navigation";

import { CommentSection } from "@/components/comments/comment-section";
import { LessonLikeBar } from "@/components/comments/lesson-like-bar";
import { CourseDetailSidebar } from "@/components/course-detail/course-detail-sidebar";
import { PracticeEntryLink } from "@/components/exercise/practice-entry-link";
import { LessonContentHeader } from "@/components/lesson-content/lesson-content-header";
import { LessonNavigation } from "@/components/lesson-content/lesson-navigation";
import { LessonVideoCard } from "@/components/lesson-content/lesson-video-card";
import { BadgesCard } from "@/components/lessons/badges-card";
import { CourseProgressHeader } from "@/components/lessons/course-progress-header";
import { ProgressStatCard } from "@/components/lessons/progress-stat-card";
import { StatsCard } from "@/components/lessons/stats-card";
import { TipsCard } from "@/components/lessons/tips-card";
import { ProjectRunner } from "@/components/project/project-runner";
import { SiteFooter } from "@/components/site-footer";
import { TopNav } from "@/components/top-nav";
import { getCurrentUser } from "@/lib/auth/get-user";
import { getCourseDetail } from "@/lib/course-detail";
import { courses } from "@/lib/courses";
import { getExercises } from "@/lib/exercise-content";
import {
  getLessonContent,
  type LessonNavigation as LessonNavData,
  type LessonNavTarget,
} from "@/lib/lesson-content";
import { getCourseExerciseStatuses } from "@/lib/learning/exercise-queries";
import { getCourseLessonStatuses, getLessonProgress } from "@/lib/learning/progress-queries";
import { getProjectProgress } from "@/lib/learning/project-queries";
import { getLessonPlan } from "@/lib/lesson-plan";
import { getProject } from "@/lib/project-content";

export default async function LessonContentPage({
  params,
}: {
  params: Promise<{ courseId: string; lessonId: string }>;
}) {
  const { courseId, lessonId } = await params;

  // 강의는 로그인 필수 — 비로그인은 로그인 후 이 강의로 돌아오게 한다.
  // (소개/강의 목록은 비로그인도 둘러볼 수 있고, 영상/프로젝트가 있는 이 페이지에서만 막는다.)
  const user = await getCurrentUser();
  if (!user) {
    redirect(`/login?next=${encodeURIComponent(`/courses/${courseId}/lessons/${lessonId}`)}`);
  }

  // 공통 메타 (우측 사이드바 + 상단 헤더)
  const plan = getLessonPlan(courseId);
  const detail = getCourseDetail(courseId);
  const courseMeta =
    courses.find((c) => c.id === courseId) ?? courses.find((c) => c.id === "be-python");

  // 본문 분기: 프로젝트형(lesson-13) 우선, 아니면 영상 강의.
  const project = getProject(courseId, lessonId);
  const content = project ? undefined : getLessonContent(courseId, lessonId);

  if (!plan || !detail || !courseMeta || (!project && !content)) {
    notFound();
  }

  const lessonRef = `${courseId}/${lessonId}`;

  // 이 강에 코드 연습 문제가 있으면 영상 아래에 진입 링크를 노출 (현재는 4강에만 데이터 존재).
  const exerciseSet = getExercises(courseId, lessonId);

  // 학습 진도 — 코스 전체(우측 통계) + 현재 강의(영상이면 시청/완료, 프로젝트면 스텝/코드)
  //   + 코스 연습 통과 현황(진입 카드 N/M 배지).
  const [lessonStatuses, videoProgress, projectProgress, exerciseStatuses] = await Promise.all([
    getCourseLessonStatuses(courseId, user.id),
    content ? getLessonProgress(lessonRef, user.id) : Promise.resolve(null),
    project ? getProjectProgress(lessonRef, user.id) : Promise.resolve(null),
    exerciseSet
      ? getCourseExerciseStatuses(courseId, user.id)
      : Promise.resolve<Record<string, { passed: number; total: number }>>({}),
  ]);

  // 이 강의 연습 통과 수 — 진입 카드 "N/M 통과" 배지용 (연습 없으면 카드 자체가 안 뜸).
  const exercisePassedCount = exerciseStatuses[lessonId]?.passed;

  // 영상 강의 이전/다음 라우트 — 콘텐츠 등록된 영상 강의 또는 프로젝트 강의(lesson-13)면 활성 링크.
  // (12강 → 13강 계산기처럼 영상→프로젝트 전환도 getProject 로 매칭해 링크 활성화)
  let previousHref: string | null = null;
  let nextHref: string | null = null;
  if (content) {
    const resolveLessonHref = (target: LessonNavTarget | null): string | null => {
      if (!target) return null;
      const targetId = `lesson-${target.number}`;
      return getLessonContent(courseId, targetId) || getProject(courseId, targetId)
        ? `/courses/${courseId}/lessons/${targetId}`
        : null;
    };
    previousHref = resolveLessonHref(content.navigation.previous);
    nextHref = resolveLessonHref(content.navigation.next);
  }

  // 프로젝트 강의 네비 — 이전 강의(번호-1)만, 다음은 없음(현재 마지막 강).
  let projectNav: LessonNavData | null = null;
  let projectPrevHref: string | null = null;
  let projectDurationMinutes = 45;
  if (project) {
    const projectLesson = plan.lessons.find((l) => l.id === lessonId);
    if (projectLesson) projectDurationMinutes = projectLesson.durationMinutes;
    const prevLesson = plan.lessons.find((l) => l.number === project.lessonNumber - 1);
    projectNav = {
      previous: prevLesson ? { number: prevLesson.number, title: prevLesson.title } : null,
      next: null,
    };
    projectPrevHref =
      prevLesson && getLessonContent(courseId, prevLesson.id)
        ? `/courses/${courseId}/lessons/${prevLesson.id}`
        : null;
  }

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

              {project && projectProgress ? (
                <>
                  {/* 프로젝트 강의 — 영상 대신 코드 미션 */}
                  <LessonContentHeader
                    lessonNumber={project.lessonNumber}
                    title={project.title}
                    durationMinutes={projectDurationMinutes}
                    subtabs={[]}
                    activeSubtab="개념"
                  />
                  <ProjectRunner
                    project={project}
                    lessonRef={lessonRef}
                    initialCompleted={projectProgress.completed}
                    initialCode={projectProgress.submittedCode["solution"] ?? ""}
                  />
                  <LessonLikeBar lessonRef={lessonRef} />
                  {projectNav && (
                    <LessonNavigation
                      navigation={projectNav}
                      previousHref={projectPrevHref}
                      nextHref={null}
                    />
                  )}
                  <CommentSection target={{ kind: "lesson", lessonRef }} />
                </>
              ) : content && videoProgress ? (
                <>
                  {/* 영상 강의 */}
                  <LessonContentHeader
                    lessonNumber={content.lessonNumber}
                    title={content.title}
                    durationMinutes={content.durationMinutes}
                    subtabs={content.subtabs}
                    activeSubtab={content.activeSubtab}
                  />
                  <LessonVideoCard
                    video={content.video}
                    durationMinutes={content.durationMinutes}
                    lessonRef={lessonRef}
                    initialVideoWatched={videoProgress.videoWatched}
                    initialLearnCompleted={videoProgress.learnCompleted}
                  />
                  <LessonLikeBar lessonRef={lessonRef} />
                  {exerciseSet && (
                    <PracticeEntryLink
                      href={`/courses/${courseId}/lessons/${lessonId}/practice`}
                      exerciseCount={exerciseSet.exercises.length}
                      passedCount={exercisePassedCount}
                    />
                  )}
                  <LessonNavigation
                    navigation={content.navigation}
                    previousHref={previousHref}
                    nextHref={nextHref}
                  />
                  <CommentSection target={{ kind: "lesson", lessonRef }} />
                </>
              ) : null}
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

      <SiteFooter />
    </>
  );
}
