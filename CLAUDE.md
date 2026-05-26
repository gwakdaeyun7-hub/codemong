# CodeMong

이해도 기반 코딩 교육 웹앱. 활동량(streak/세션 수)이 아닌 **이해**에 따라 캐릭터가 자라는 학습 플랫폼.

> 모든 UI 카피는 **한국어**, 입문자 친화·정직 톤. 과장 금지, 이모지 거의 안 씀.

---

## Stack

- **Next.js 16.2.4** (App Router, Server Components default)
- **React 19.2.4** + **TypeScript 5**
- **Tailwind CSS v4** (`@tailwindcss/postcss`) + `tailwind-merge` + `class-variance-authority`
- **shadcn/ui** v4 — 사실상 미사용 (디자인 톤 충돌). `components/ui/` 에 button/card/dialog/input/label/dropdown-menu 가 있지만 페이지는 native `<button>`/`<div>` + Tailwind 직접 구성으로 만들어짐
- **lucide-react v1.14.0** ← v0.x 아님. 컴포넌트 폴더별 `icon-map.ts` 화이트리스트로만 import (트리쉐이킹 보호)
- **Supabase** (`@supabase/ssr` + `@supabase/supabase-js`) — middleware/proxy, server/client helpers (`lib/supabase/`), 인증 UI 전체 구현 (`lib/auth/`, `app/(auth)/`, `app/auth/callback/`). OAuth Google + Kakao 지원
- **Prisma 7.8** → Supabase Postgres (singleton: `lib/prisma.ts`, generated client: `lib/generated/prisma/`). 모델 8개: Post / Comment / PostLike / CommentLike / LessonLike / PostReport / CommentReport / LessonProgress
- **pnpm** (workspace + onlyBuiltDependencies)
- **Remotion 4.0.456** (`remotion/` workspace 멤버, 영상 제작용 — 메인 앱 의존성 아님, sibling project)

---

## Routes (현재 구현)

| Path | Role | Notes |
|------|------|-------|
| `/` | 홈 = 코드학습 페이지 | 백엔드 Python 1개 카드 (프론트엔드 카드 전부 제거됨) |
| `/courses/[courseId]` | 강좌 소개 탭 | 사이드바 7탭 중 "소개" 활성. `python` / `be-python` 만 매칭, 그 외 `notFound()` |
| `/courses/[courseId]/lessons` | 강의 목록 (12강) | 좌 메인 + 우 320px 사이드바 (lg+ sticky) |
| `/courses/[courseId]/lessons/[lessonId]` | 강의 상세 (개념 탭) | **로그인 필수** (영상 게이팅 — 페이지 레벨 `redirect('/login?next=...')`, proxy 아님). `lesson-1` ~ `lesson-11` (파이썬 개요·개발환경 / 코딩의 표현 방법 / 변수와 자료형 / 입력과 연산자 / 조건문 / 반복문 / 리스트 / 딕셔너리 & 자료구조 / 함수 / 모듈 & 랜덤 / 파일 입출력) 매칭. **영상-only 모드** — 강의 헤더 + 영상 카드 + LessonLikeBar(좋아요+댓글 카운트) + CommentSection(댓글 임베드) + 이전/다음 네비. 우측 통계·진행률은 `LessonProgress` 실데이터(`getCourseLessonStatuses`) |
| `/login` | 로그인 | 이메일 + Google/Kakao OAuth |
| `/signup` | 회원가입 | 이메일/비밀번호/닉네임 |
| `/forgot-password` | 비밀번호 재설정 요청 | 메일 링크 전송 |
| `/reset-password` | 새 비밀번호 설정 | recovery 임시 세션 사용 (proxy 가드 예외) |
| `/verify-email` | 이메일 인증 안내 | |
| `/auth/callback` | OAuth/이메일확인/비번복구 공용 콜백 | Route Handler. PKCE `exchangeCodeForSession` |
| `/skill` | 실력향상 | "준비 중" 안내 stub (TopNav "실력향상" 메뉴 404 해소) |
| `/mypage` | 마이페이지 홈 | 프로필 카드 + 학습 통계(mock) + 최근 학습 |
| `/mypage/settings` | 설정 | 닉네임/비밀번호 변경 + 계정 삭제 안내 |
| `/mypage/comments` | 내가 쓴 댓글 | |
| `/mypage/posts` | 내가 쓴 글 | |
| `/mypage/likes` | 좋아요한 강의/글 | 두 섹션 |
| `/mypage/calendar` | 학습 캘린더 | mock (학습 진도 모델 부재로 자리만) |
| `/community` | 게시글 목록 | Q&A/자유 카테고리 탭 |
| `/community/new` | 글 작성 | 로그인 강제 |
| `/community/[postId]` | 게시글 상세 | 좋아요 + 댓글 섹션 임베드 |
| `/community/[postId]/edit` | 글 수정 | 작성자만 |

**Next 16 dynamic route 규칙**: `params: Promise<{...}>` + `await params` 정확히 사용. (위 페이지들 모두 그렇게 짜여있음.)

---

## Data (`lib/`)

전부 정적 mock — 추후 backend-developer가 만들 API/Server Action 응답으로 교체 예정.

| File | Exports |
|------|---------|
| `lib/courses.ts` | `Course` 타입 + `courses` 1개(Python) + `backendCourses` |
| `lib/course-detail.ts` | `CourseDetail` 타입 + `pythonCourseDetail` + `getCourseDetail(id)` |
| `lib/lesson-plan.ts` | `Lesson` / `LessonStatus` 타입 + `pythonLessonPlan` (12강) + `getLessonPlan(id)` |
| `lib/lesson-content.ts` | `LessonContent` 타입 + `pythonLesson1Content` ~ `pythonLesson11Content` + `getLessonContent(courseId, lessonId)` |
| `lib/quiz-content.ts` | `QuizPool` (`"evaluation" \| "practice"`) / `QuizQuestion` / `Misconception` / `QuizOption` / `DisallowedAnswer` 타입 + `pythonLesson1Quiz` / `pythonLesson2Quiz` + `pythonLesson1Misconceptions` / `pythonLesson2Misconceptions` + `getQuiz(courseId, lessonId)` / `getMisconceptions(courseId, lessonId)`. 강의당 30문항 (Pool A 10 + Pool B 20). 모든 문항이 `pool` (필수) + `isomorphGroup` (선택, 같은 학습목표·오개념을 다른 surface 로 묻는 isomorph 묶음 ID) 필드 보유. 보기마다 `misconceptionId` 라벨. 추천 알고리즘 진단 신호 = `misconceptionId` + `isomorphGroup` + `pool`. |
| `lib/auth/actions.ts` | Server Actions 8개 (이메일 가입/로그인, OAuth Google·Kakao, 로그아웃, 비번 재설정/변경, 닉네임 변경) + Supabase 에러 한국어 매핑 |
| `lib/auth/get-user.ts` | `getCurrentUser()` — Server Component용. nickname fallback: `user_metadata.nickname` → `full_name` / `name` → email @앞부분 |
| `lib/auth/validation.ts` | email/password/nickname 검증 + `translateAuthError()` Supabase 에러 한국어 매핑 |
| `lib/community/types.ts` | `PostCategory`, `CommentNode`, `PostListItem`, `PostDetail`, `LikedLessonItem`, `LikedPostItem`, `REPORT_REASONS`, `ReportReason` |
| `lib/community/validation.ts` | post title/body, comment body, report reason/detail, lessonRef 검증 |
| `lib/community/comments-actions.ts` | Server Actions: `createLessonCommentAction`, `createPostCommentAction`, `updateCommentAction`, `deleteCommentAction` (soft), `reportCommentAction` |
| `lib/community/comments-queries.ts` | `listLessonComments` / `listPostComments` (1-depth 트리 구성), `listMyComments` |
| `lib/community/posts-actions.ts` | `createPostAction`, `updatePostAction`, `deletePostAction` (soft), `toggleResolvedAction` (Q&A 해결, 작성자만), `reportPostAction` |
| `lib/community/posts-queries.ts` | `listPosts` (category 필터), `getPost`, `listMyPosts` |
| `lib/community/likes-actions.ts` | `togglePostLikeAction` / `toggleCommentLikeAction` / `toggleLessonLikeAction`, `getLessonLikeStatus` |
| `lib/community/likes-queries.ts` | `listMyLikedLessons` (lesson-plan join), `listMyLikedPosts` |
| `lib/learning/progress-actions.ts` | Server Actions: `markVideoWatchedAction` (영상 90% 시청 멱등 기록), `toggleLessonCompleteAction` (완료 토글 = `learnCompletedAt` on/off) |
| `lib/learning/progress-queries.ts` | `getLessonProgress` (강의 진도 상태), `getCourseCompletion` (코스 이수율 = `learnCompletedAt` 있는 강의 수 / 전체), `getCourseLessonStatuses` (코스 강의별 status 맵 `lessonId → LessonStatus` — 강의 목록/상세 진행률 실데이터. `learnCompletedAt`→completed, `videoWatchedAt`만→in-progress, 없음/비로그인→not-started) |
| `lib/format.ts` | `timeAgoKo`, `fmtCount` 헬퍼 |

룩업 함수는 모두 `python` / `be-python` 두 ID 모두 매칭 (홈 카드 ID 와 detail 페이지 fallback ID 가 분리되어 있어서).

---

## Components 폴더 컨벤션

| Path | 역할 |
|------|------|
| `components/` (root) | 글로벌: `top-nav`, `user-menu`, `course-card`, `status-badge`, `level-badge`, `course-icon`, `toast` (ToastProvider/useToast — 버튼형 mutation 성공·실패 알림, `app/layout.tsx` body 에서 children 감쌈), `learning-mode-toggle` (현재 미사용 — 홈에서 제거됨, 향후 코드에디터 모드용 보존) |
| `components/course-detail/` | 소개 탭 섹션 (header, sidebar — **Link 기반 Server Component**(탭별 라우팅, 미구현 탭은 "준비 중" 비활성), learning-outcomes, roadmap, checklist, reviews, cta, section-card) |
| `components/lessons/` | 강의 목록 페이지 (course-progress-header, lesson-list, lesson-card, progress-stat-card, stats-card, tips-card, badges-card) |
| `components/lesson-content/` | 강의 상세 영상 영역 (lesson-content-header, lesson-video-card — **Client Component**(영상 90% 시청 추적 + 학습 완료 버튼), lesson-navigation — 영상-only 모드) |
| `components/auth/` | 인증 폼 (이메일 로그인/회원가입, OAuth 버튼 — Kakao+Google 인라인 SVG, 비번 재설정/재발급, AuthLayout 좌측 브랜드+우측 폼, or-divider, form-feedback) |
| `components/mypage/` | 마이페이지 (사이드바, 프로필 카드, 학습 통계 카드(mock), 닉네임/비번 변경 폼, settings-section wrapper) |
| `components/comments/` | 영상/게시글 공용 댓글 (CommentSection — lesson\|post 통합 Server, CommentForm create+edit 통합, CommentItem, LikeButton — comment/lesson/post 통합, ReportForm — comment/post 통합, LessonLikeBar) |
| `components/community/` | 커뮤니티 (CategoryTabs, PostCard, PostForm create+edit 통합, PostActions — 수정/삭제/해결토글/신고) |
| `components/ui/` | shadcn 원본 (현재는 거의 안 씀 — 향후 디자인 시스템화하면 cva variant로 흡수) |

**각 도메인 폴더에 `icon-map.ts`** — lucide 아이콘 화이트리스트. 어떤 컴포넌트도 lucide에서 직접 동적 import 하지 않음. 단, 사용 아이콘이 적어 직접 import 만으로 충분한 폴더는 예외 — 현재 `components/lesson-content/` 가 그 케이스.

---

## Data Models

`prisma/schema.prisma`. Supabase Postgres + Prisma 7. connection URL은 `prisma.config.ts`에서 관리 (Prisma 7에서 schema datasource의 `url`/`directUrl` 제거됨).

### 모델 8개 + enum 1개

| 모델 | 테이블 | 역할 |
|------|-------|------|
| `Post` | posts | 커뮤니티 게시글 (Q&A / 자유). authorNickname/AvatarUrl 스냅샷, resolved(Q&A 해결), likeCount/commentCount 캐시, soft delete |
| `Comment` | comments | 댓글. postId 또는 lessonRef 중 하나에 달림 (lesson은 Prisma 외부라 string ref). parentId로 1-depth 답글 |
| `PostLike` | post_likes | postId+userId 복합 PK |
| `CommentLike` | comment_likes | commentId+userId 복합 PK |
| `LessonLike` | lesson_likes | lessonRef+userId 복합 PK (lesson은 string ref) |
| `PostReport` | post_reports | postId+reporterId @@unique (사용자당 1회). reason(spam/abuse/off-topic/other) + detail |
| `CommentReport` | comment_reports | commentId+reporterId @@unique |
| `LessonProgress` | lesson_progress | 학습 진도(이수율/이해도 2층). lessonRef+userId 복합 PK. `learnCompletedAt`=학습완료(이수율), `quizPassedAt`/`quizBestScore`=이해완료(이해도, 2단계 미구현) |
| `enum PostCategory` | — | question / free |

### 설계 결정

1. **작성자 표시 정보 스냅샷**: 댓글/게시글 작성 시 `user_metadata.nickname`과 `avatar_url`을 그대로 컬럼에 저장. 이유 = Supabase `auth.users`는 Prisma 외부 스키마라 join 불가, admin API 조회는 매번 외부 호출이라 느림. 트레이드오프: 닉네임 변경 후 과거 댓글 표시명 안 바뀜 (신규 댓글에만 반영).
2. **soft delete**: Post/Comment에 `deletedAt` 컬럼. 삭제된 댓글은 답글이 있으면 "삭제된 댓글입니다"로 자리 유지, 답글도 없으면 노출 X.
3. **카운트 캐시**: `Post.likeCount` / `Post.commentCount` / `Comment.likeCount` — 매번 `count()` 안 하도록 increment/decrement를 트랜잭션으로.
4. **lesson 참조**: lesson은 정적 `lib/lesson-plan.ts` mock이라 외래키 대신 `lessonRef` 문자열 (포맷: `<courseId>/<lessonId>`). 메타 매핑은 application code에서.
5. **답글 1-depth**: parentId가 있는 댓글에는 추가 답글 불가. application code에서 강제 (`parent.parentId !== null`이면 reject).
6. **진도 2층 구조**: 영상 90% 시청 + 완료 버튼 = "학습 완료"(이수율, `learnCompletedAt`), 퀴즈 통과 = "이해 완료"(이해도, `quizPassedAt`/`quizBestScore`). lesson은 Prisma 외부라 외래키 대신 `lessonRef` 문자열 (`LessonLike`와 동일 패턴).

### Auth

- Supabase Auth (email/password + OAuth Google + Kakao) 위임
- 닉네임은 `user_metadata.nickname`에 저장 (별도 user_profiles 테이블 X)
- 회원가입 시 `signUp({ options: { data: { nickname } } })`로 metadata 주입
- 이메일 인증 ON 가정 (Supabase 기본). 메일 링크 → `/auth/callback?code=...` → `exchangeCodeForSession`
- 비밀번호 재설정: `resetPasswordForEmail({ redirectTo: ${origin}/auth/callback?next=/reset-password })` → recovery 임시 세션으로 `/reset-password` 진입 → `updateUser({ password })`

### 권한 정책

- 읽기: 비로그인 OK (목록/상세/댓글 조회). 단, **강의 영상 상세(`/courses/[id]/lessons/[lessonId]`)는 로그인 필수** (영상 게이팅) — 강좌 소개·강의 목록은 비로그인 열람 가능
- 쓰기/좋아요/신고: 로그인 필수
- 수정/삭제: 본인만 (application code 체크)
- Q&A 해결 토글: Q&A 작성자만
- 본인 글/댓글 신고 불가
- 사용자당 같은 글/댓글 신고 1회 (DB unique 제약)

### proxy.ts (Next.js 16 — middleware → proxy)

- `/mypage/*` 미로그인 → `/login?next=...` 리다이렉트
- 로그인 상태에서 `/login`·`/signup`·`/forgot-password` → `/` 리다이렉트
- `/reset-password` 는 recovery 임시 세션 사용을 위해 예외
- matcher: 정적 자원(_next/static, _next/image, 이미지/미디어/json/ico/css/js) 제외
- 강의 영상 상세의 로그인 게이팅은 proxy matcher 가 아니라 **강의 상세 페이지 레벨 `redirect`** 로 처리 (그 페이지에서만 막고, 소개·목록은 열람 허용하기 위함)

### 커뮤니티 / 댓글 / 좋아요 흐름

- 영상 페이지 = lesson 좋아요 + 댓글 (lessonRef 기반)
- 커뮤니티 페이지 = post + post 좋아요 + 댓글 (postId 기반)
- 마이페이지 = 내 댓글 / 내 글 / 좋아요한 강의/글 / 학습 캘린더(mock)
- 댓글 좋아요는 source path 미상 → caller가 `router.refresh()` 호출 패턴
- lesson/post 좋아요는 server action 내에서 `revalidatePath` 처리

---

## 패턴 결정 (이미 합의된 것 — 다시 묻지 말 것)

1. **Server Component default**, `'use client'` 는 leaf 인터랙션에만 (예: `lesson-list` 필터). 레이아웃 통째로 client 로 마킹 금지.
2. **shadcn Card/Button 미사용** — 디자인 톤이 안 맞아서 native + Tailwind 직접 구성. 새 카드 만들 때 `components/ui/card` import 하지 말 것.
3. **카드 디자인 톤**: 흰 배경, `rounded-2xl`, 부드러운 shadow. 페이지 배경 `bg-zinc-50`. 메인 액센트 `violet-500` ~ `purple-600`.
4. **모바일-first 반응형**: 데스크톱 기준으로 디자인하되 모바일에서 자연스럽게 무너져야. 사이드바는 `lg+` 에서만, 모바일에선 가로 스크롤 탭으로 대체.
5. **Prop drilling > cloneElement** — `courseId` 같은 메타는 명시적 prop으로. children에 `cloneElement` 로 inject 하지 말 것.
6. **lucide 아이콘은 항상 명시 import + 폴더별 `icon-map.ts` 화이트리스트** 통과. `<Icon name={dynamic} />` 같은 동적 매핑은 그 맵을 거치게.
7. **TopNav 배치**: 좌측 [로고 + `코드학습` / `실력향상` / `커뮤니티` / `마이페이지`], 우측 [검색 / 알림 / 프로필]. (이미지 보고 결정한 최종 배치 — 변경하지 말 것.)
8. **카피 톤**: 한국어, 입문자 친화, 정직. "쉬워요!" 같은 과장 금지. 이모지 거의 안 씀.
9. **버튼형 mutation 알림 = `useToast`, `alert()` 금지**: 좋아요/삭제/완료 등 버튼형 액션의 성공·실패 알림은 `components/toast.tsx` 의 `useToast` 로 통일 (`alert()` 쓰지 말 것). 핸들러는 `startTransition` 내부 `try/catch` 로 server action 의 `!result.ok` 뿐 아니라 예상 못한 throw 도 잡아 "잠시 후 다시 시도해 주세요." toast 로 안내. 단 폼(댓글/게시글/신고)의 입력 검증은 inline(FormFeedback) 유지 — toast 로 옮기지 말 것.

---

## Commands

```bash
pnpm dev              # 개발 서버 (Next.js JIT — 첫 클릭 ~2s 지연 정상)
pnpm install          # 의존성 + postinstall 로 prisma generate
pnpm format           # prettier --write .
pnpm db:push          # prisma schema → Supabase
pnpm db:studio        # prisma studio
pnpm --filter remotion dev   # Remotion Studio 실행 (영상 미리보기)
pnpm --filter remotion build # Remotion 번들 빌드
py videos/_assets/_synth_sample.py  # TTS voice 샘플 합성 (voice/rate 변경해 비교)
pip install edge-tts        # 처음 한 번 (Python 3.10+)
```

---

## Troubleshooting

- **`pnpm tsc --noEmit` / `pnpm lint` 가 fresh state에서 실패한다.**
  `next-env.d.ts` 가 `.next/types/routes.d.ts` 를 import하는데 그 파일은 `next dev` 또는 `next build` 가 한 번 돌아야 생성됨. 작업 후 검증 시 `pnpm dev` 한 번 실행 후 종료하고 lint/typecheck 돌릴 것. ESLint 9 + pnpm hoisting 의 `Cannot find module 'debug'` 오류도 같은 맥락.
- **dev mode 첫 클릭 ~2s 지연**: Next.js JIT 정상 동작. 사용자 노트북 탓 아님.
- **`pnpm install` 시 `cd remotion && pnpm install` 하지 말 것**: pnpm이 root `pnpm-workspace.yaml`을 보고 root install을 돌려서 의도한 remotion install이 안 됨. root에서 `pnpm install`로 둘 다 install 되거나, 특정 프로젝트만이면 `pnpm --filter remotion install`.
- **Vercel build 가 `Cannot find module 'remotion'` 으로 실패**: `videos/<courseId>/<lessonId>/03-composition/*.tsx` 가 `import ... from "remotion"` 하는데, 메인 앱 `tsconfig.json` 의 `include` 가 모든 .tsx 를 잡아 그 파일들도 type check 대상이 됨. `remotion` 은 `remotion/` 워크스페이스에만 있어 메인 앱은 모듈을 못 찾음. 해결: `tsconfig.json` 의 `exclude` 에 `"videos"`, `"remotion"` 명시 (적용됨). Remotion 워크스페이스 자체 `tsconfig` 가 `../videos/**/*.tsx` 를 include 해 그쪽에서 type check 됨.

**전역 에러 바운더리 / 404**: `app/error.tsx`(렌더 에러 — 다시 시도), `app/not-found.tsx`(404), `app/global-error.tsx`(루트 레이아웃 폴백 — 인라인 스타일) 가 전역 폴백. 새 라우트별 에러 처리를 만들 때 이들과 중복/충돌하지 않게.

---

## Quiz Pools

**디렉토리 규약**:

```
quiz/
  <courseId>/<lessonId>/
    pool-b-spec.md     # Pool B 제작 명세서 (분포 목표 / 오개념 매트릭스 / 슬롯 20개 표 / 검수 체크리스트)
```

현재 시드: `quiz/python/lesson-1/pool-b-spec.md`, `quiz/python/lesson-2/pool-b-spec.md`.

**Pool A (evaluation) vs Pool B (practice)**:
- **Pool A** — 강의 직후 모든 학습자에게 동일 노출. base mastery 측정. `pool: "evaluation"`. 강의당 10문항.
- **Pool B** — 학습자에게 직접 노출 X. 추천 시스템이 약점 벡터(M-vector) 에 따라 동적 매칭하여 "복습/약점 보강" 으로 제공. `pool: "practice"`. 강의당 20문항.

**`isomorphGroup` 네이밍 규약**: `<lessonId>-<짧은 의미 키>` (예: `lesson-1-path`, `lesson-2-pseudocode-form`). Pool A/B 가 같은 그룹 ID 를 공유하면 isomorph 매칭 가능.

**작성 워크플로**:
1. 사람이 `quiz/<courseId>/<lessonId>/pool-b-spec.md` 작성 (분포·매트릭스·슬롯·체크리스트).
2. `programming-language-education-expert` 에이전트 호출 — 명세서 받아 `lib/quiz-content.ts` 의 해당 강의 Quiz 배열에 q11~q30 append.
3. 샘플 검증 후 검수.

**매칭 로직**: 별도 결정 사항. 현재 미구현 (backend-developer 영역). 후보 = 룰 베이스 / LLM 기반 추천 / ML 모델.

---

## Video Production

영상 제작 entry point: Skill `/make-codemong-video <주제>` (또는 자연어 트리거). Skill이 신규 4개 에이전트 + `programming-language-education-expert`를 자동 오케스트레이션. 단계별 재실행은 `--from=01-script` 같은 인자로.

**디렉토리 규약**:

```
videos/
  <courseId>/<lessonId>/
    00-objectives.md
    01-script.md
    02-audio/
    03-composition/
    04-out.mp4
  _assets/                  # 공용 자원 (pronunciation.json, voice 샘플 등)
```

**TTS 기본값**: Edge TTS 1순위 (`ko-KR-HyunsuMultilingualNeural`, rate `+10%`, 무료 — 키 불필요). ElevenLabs / OpenAI 는 `.env.local` 키가 있을 때만 fallback. voice는 잠정 — 향후 변경 가능.

**발음 사전**: `videos/_assets/pronunciation.json` (현재 시드 91개). 영상 대본 작성 시 참조용 — `_synth.py` 가 자동 치환하지는 않으므로 대본 작성자가 narration 표기를 발음 친화적으로 미리 적용해야 한다. 발음 강제가 필요한 한국어 단어(예: "묶입니다" 가 TTS 에서 [무깁니다] 로 잘못 발음되는 경우)는 narration 표기 자체를 발음형(예: "무낍니다") 으로 적어 우회.

**영상 정책**:
- 영상 1편 = 강의 1개 (lesson 1대1 매핑). **Python 기초 = 12강 = 영상 12편 예정** (확정 커리큘럼은 메모리 `python_curriculum_12.md` 참조).
- 길이 기본 180초.
- 카피 톤은 기존 CodeMong 톤 (한국어, 입문자 친화·정직, 과장/이모지 자제) + **"입문자 수준 + 정석적인 강의 느낌"** (학원 인강 스타일, 차분·구조화, 쇼츠톤·과장 X).
- **자막 (SRT/VTT) 은 만들지 않는 것이 정책**. 영상에 burn-in 도, 외부 자산 보존도 하지 않는다 — `02-audio/captions.srt` 같은 파일 자체를 생성하지 않음. narration 이 모든 정보를 음성으로 전달한다는 가정. 사용자가 향후 자막을 요청하면 별도 합의 후 별도 라운드. *lower-third 같은 씬별 디자인 텍스트 카드는 자막이 아니라 시각 디자인 요소 — 정책 영향 없음.*
- 디자인 토큰: Remotion도 Tailwind v4 → 메인 앱과 violet-500 액센트 등 공유 가능 (의도된 결과).
- **시즌 통일 정형 — Scene 01 / 마지막 Scene** (lesson N≥2 필수 답습, 새 도입/마무리 디자인 금지): 정형 구조·수치 metric·delaySec 시퀀스가 메모리 `season_consistency_pattern.md` 와 `.claude/agents/video-director.md` § "시즌 통일 — 구체적 fail 트리거" 에 P0/P1/P2 (구조/수치/시퀀스) 단위 grep-가능한 조건으로 박혀 있음. 새 lesson 영상 작업 시 `/make-codemong-video` skill 이 단계 1·2b·4 에서 자동 점검 — 한 개라도 어긋나면 video-director 가 fail + `--from=03-composition` 권고.
- **누적 quality rules — `videos/_assets/quality-rules.md`** (SSOT): 과거 영상 리뷰에서 발견된 일반 룰 누적 (콘솔 결과 fontSize 비례, swap timing buffer, Active Recall reveal 동기, scale pulse 절제, FadeIn flex 적용, 한국어 발음 우회 등). 룰마다 Category (G grep / R review / N narration), Status (ACTIVE/DEPRECATED), Origin (어느 lesson 에서 발견됐는지) 기록. `video-director` 의 P3 fail 트리거로 동작하며, 영상 리뷰 후 *재발 가능한 새 패턴* 발견 시 사용자 합의 후 R-NNN 으로 append.

**Git 권장사항** (강제 아님):
- 렌더 산출물 `04-out.mp4` 와 `02-audio/voiceover.mp3` 는 git ignore 권장.
- `_assets/pronunciation.json` 은 commit 권장 (시드 91개 공유 자원).
- `_assets/voice-sample-*.mp3` 는 사용자 결정.

---

## Agents

`.claude/agents/` 위치. 이 프로젝트에서 자주 쓰는 것:

- **frontend-developer** — UI 구현 메인. Next 16 + React 19 + Tailwind v4 + shadcn(거의 미사용) + Supabase 클라이언트 통합 + 이해도 게이지/캐릭터 시각화
- **backend-developer** — Route Handler + Prisma + Supabase + isolated-vm 채점 + GPT 분류/재설명
- **programming-language-education-expert** — 강의 콘텐츠 작성, 오답 분류 카피, 힌트 사다리, 미션 설계
- **coding-game-planner** — 게임화/이해화 기획, 학습 경로/보상 시스템 설계
- **table-organizer** — 표 정리/포맷 변환
- **video-script-writer** — 영상 대본 (narration + scene visual direction). 한국어, 발음 사전 적용.
- **remotion-composer** — Remotion 컴포지션 React 코드. `useCurrentFrame()`/`interpolate()` 강제, CSS transition / Tailwind animate-* 금지.
- **video-voiceover-audio** — Edge TTS 1순위 (`ko-KR-HyunsuMultilingualNeural`, rate `+10%`), ElevenLabs/OpenAI는 키 있을 때만 fallback. BGM/SFX. 자막(SRT/VTT) 은 정책상 미생성.
- **video-director** — 영상 end-to-end 오케스트레이터. 단일 craft 작업엔 호출 X.

UI + 콘텐츠를 동시에 다루는 작업 (예: 새 강의 페이지)은 **frontend-developer + programming-language-education-expert 동시 호출**이 사용자의 표준 워크플로우.

**영상 제작은 Skill `/make-codemong-video <주제>` 발동이 표준 — Skill이 위 4개 영상 에이전트 + `programming-language-education-expert` 를 자동 오케스트레이션함.**

---

## Out of scope (현재 미구현 — 카드/스텁만 존재)

- 퀴즈 / 채점 / 오답 분석 화면 — `concept` 외 사이드바 탭(개념응용/문제해결/학습완료/성장피드백/다음단계추천)은 "준비 중" 비활성(클릭 불가 + 흐림 + title 툴팁)으로 명시 처리, 라우트·화면 없음. 실력향상(`/skill`) 도 "준비 중" 안내 stub. 1·2강 평가 문제 데이터 60문항 (Pool A 20 + Pool B 40, 모두 `misconceptionId` / `isomorphGroup` / `pool` 라벨링) 은 `lib/quiz-content.ts` 에 정형화돼 있으나, **추천 매칭 로직 자체는 미구현** (backend-developer 영역 — 후보로 룰 베이스 / LLM 기반 / ML 모델 거론). 화면·채점 로직도 미구현.
- Python 12강 영상 — 1~11강은 완성·임베드 완료 (Hyunsu voice, 자막 정책상 미생성, lesson detail 페이지 임베드 완료). 12강("디버깅 & AI 활용")은 학습목표~대본~컴포지션 + audio wire 까지 제작 완료 (`videos/python/lesson-12/`: `00-objectives.md` + `01-script.md`(9 scenes) + `02-audio/` + `03-composition/Scene01~09 + Lesson12.tsx`). 단 **풀렌더(`04-out.mp4`)는 이 환경에서 미실행 — 사용자 환경/Vercel 에서 렌더 예정** + **lesson detail 페이지 임베드 미완료** (1~11강과 달리 아직 앱에 노출 안 됨).
- 다른 강좌 (CSS, React, Next, 상태관리, HTML, TypeScript 등) — 홈 카드만, detail 미구현
- 강의 상세 본문 카드 (개념 소개 / 구조 다이어그램 / 문법 가이드 / 예시 코드 / 핵심 정리 / 일상 속 활용) — 영상-only 모드라 제거됨. 추후 콘텐츠 모델 확장 시 재도입 가능. 단, 영상 아래에 LessonLikeBar(좋아요 + 댓글 카운트) + CommentSection(댓글) 은 추가됨.
- 학습 진도 — **이수율(1층: 영상 90% 시청 + 완료 버튼 → `LessonProgress.learnCompletedAt`)은 구현 완료**. 홈 카드뿐 아니라 **강의 목록·강의 상세 우측 진행률/통계까지 `LessonProgress` 실데이터(`getCourseLessonStatuses`)로 연결** (비로그인이면 전부 not-started). **이해도(2층: 퀴즈 통과 → `quizPassedAt`/`quizBestScore`)는 퀴즈 화면 구현 후 미구현**. streak/배지 추적 모델도 미구현 (`lib/lesson-plan.ts` 의 badges 는 전부 `acquired: false`, 뱃지 카드도 "준비 중"). `/mypage/calendar`·`/mypage/page.tsx`의 학습 통계 카드는 여전히 mock (`LessonProgress` 집계로 추후 연결 가능).
- 계정 삭제 자동화 — service_role admin API 필요. 현재 settings 페이지는 운영팀 메일 문의 안내만.
- Realtime / 알림 센터 / 검색 — TopNav 알림·검색 아이콘은 "준비 중" 비활성(`disabled` + title 툴팁, 가짜 "읽지 않은 알림" 점 제거). 실제 기능 미구현.
