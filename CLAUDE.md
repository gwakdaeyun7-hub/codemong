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
- **Supabase** (`@supabase/ssr` + `@supabase/supabase-js`) — middleware, server/client helpers (`lib/supabase/`)
- **Prisma 7.8** → Supabase Postgres (singleton: `lib/prisma.ts`, generated client: `lib/generated/prisma/`)
- **pnpm** (workspace + onlyBuiltDependencies)
- **Remotion 4.0.456** (`remotion/` workspace 멤버, 영상 제작용 — 메인 앱 의존성 아님, sibling project)

---

## Routes (현재 구현)

| Path | Role | Notes |
|------|------|-------|
| `/` | 홈 = 코드학습 페이지 | 프론트 6 + 백엔드 1(Python) 카드 |
| `/courses/[courseId]` | 강좌 소개 탭 | 사이드바 7탭 중 "소개" 활성. `python` / `be-python` 만 매칭, 그 외 `notFound()` |
| `/courses/[courseId]/lessons` | 강의 목록 (12강) | 좌 메인 + 우 320px 사이드바 (lg+ sticky) |
| `/courses/[courseId]/lessons/[lessonId]` | 강의 상세 (개념 탭) | `lesson-1`, `lesson-2`, `lesson-3` (파이썬 개요·개발환경 / 코딩의 표현 방법 / 변수와 자료형) 매칭. **영상-only 모드** — 강의 헤더 + 영상 카드 + 이전/다음 네비만 표시 |

**Next 16 dynamic route 규칙**: `params: Promise<{...}>` + `await params` 정확히 사용. (위 페이지들 모두 그렇게 짜여있음.)

---

## Data (`lib/`)

전부 정적 mock — 추후 backend-developer가 만들 API/Server Action 응답으로 교체 예정.

| File | Exports |
|------|---------|
| `lib/courses.ts` | `Course` 타입 + `courses` 7개 + `frontendCourses` / `backendCourses` |
| `lib/course-detail.ts` | `CourseDetail` 타입 + `pythonCourseDetail` + `getCourseDetail(id)` |
| `lib/lesson-plan.ts` | `Lesson` / `LessonStatus` 타입 + `pythonLessonPlan` (12강) + `getLessonPlan(id)` |
| `lib/lesson-content.ts` | `LessonContent` 타입 + `pythonLesson1Content` + `pythonLesson2Content` + `pythonLesson3Content` + `getLessonContent(courseId, lessonId)` |
| `lib/quiz-content.ts` | `QuizPool` (`"evaluation" \| "practice"`) / `QuizQuestion` / `Misconception` / `QuizOption` / `DisallowedAnswer` 타입 + `pythonLesson1Quiz` / `pythonLesson2Quiz` + `pythonLesson1Misconceptions` / `pythonLesson2Misconceptions` + `getQuiz(courseId, lessonId)` / `getMisconceptions(courseId, lessonId)`. 강의당 30문항 (Pool A 10 + Pool B 20). 모든 문항이 `pool` (필수) + `isomorphGroup` (선택, 같은 학습목표·오개념을 다른 surface 로 묻는 isomorph 묶음 ID) 필드 보유. 보기마다 `misconceptionId` 라벨. 추천 알고리즘 진단 신호 = `misconceptionId` + `isomorphGroup` + `pool`. |

룩업 함수는 모두 `python` / `be-python` 두 ID 모두 매칭 (홈 카드 ID 와 detail 페이지 fallback ID 가 분리되어 있어서).

---

## Components 폴더 컨벤션

| Path | 역할 |
|------|------|
| `components/` (root) | 글로벌: `top-nav`, `course-card`, `status-badge`, `level-badge`, `course-icon`, `learning-mode-toggle` |
| `components/course-detail/` | 소개 탭 섹션 (header, sidebar, learning-outcomes, roadmap, checklist, reviews, cta, section-card) |
| `components/lessons/` | 강의 목록 페이지 (course-progress-header, lesson-list, lesson-card, progress-stat-card, stats-card, tips-card, badges-card) |
| `components/lesson-content/` | 강의 상세 영상 영역 (lesson-content-header, lesson-video-card, lesson-navigation — 영상-only 모드) |
| `components/ui/` | shadcn 원본 (현재는 거의 안 씀 — 향후 디자인 시스템화하면 cva variant로 흡수) |

**각 도메인 폴더에 `icon-map.ts`** — lucide 아이콘 화이트리스트. 어떤 컴포넌트도 lucide에서 직접 동적 import 하지 않음. 단, 사용 아이콘이 적어 직접 import 만으로 충분한 폴더는 예외 — 현재 `components/lesson-content/` 가 그 케이스.

---

## 패턴 결정 (이미 합의된 것 — 다시 묻지 말 것)

1. **Server Component default**, `'use client'` 는 leaf 인터랙션에만 (예: `lesson-list` 필터, `example-code-card` 복사 버튼, `course-detail-sidebar` 탭 활성). 레이아웃 통째로 client 로 마킹 금지.
2. **shadcn Card/Button 미사용** — 디자인 톤이 안 맞아서 native + Tailwind 직접 구성. 새 카드 만들 때 `components/ui/card` import 하지 말 것.
3. **카드 디자인 톤**: 흰 배경, `rounded-2xl`, 부드러운 shadow. 페이지 배경 `bg-zinc-50`. 메인 액센트 `violet-500` ~ `purple-600`.
4. **모바일-first 반응형**: 데스크톱 기준으로 디자인하되 모바일에서 자연스럽게 무너져야. 사이드바는 `lg+` 에서만, 모바일에선 가로 스크롤 탭으로 대체.
5. **Prop drilling > cloneElement** — `courseId` 같은 메타는 명시적 prop으로. children에 `cloneElement` 로 inject 하지 말 것.
6. **lucide 아이콘은 항상 명시 import + 폴더별 `icon-map.ts` 화이트리스트** 통과. `<Icon name={dynamic} />` 같은 동적 매핑은 그 맵을 거치게.
7. **TopNav 배치**: 좌측 [로고 + `코드학습` / `실력향상` / `커뮤니티` / `마이페이지`], 우측 [검색 / 알림 / 프로필]. (이미지 보고 결정한 최종 배치 — 변경하지 말 것.)
8. **카피 톤**: 한국어, 입문자 친화, 정직. "쉬워요!" 같은 과장 금지. 이모지 거의 안 씀.

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

**발음 사전**: `videos/_assets/pronunciation.json` (현재 시드 38개). 영상 대본 작성 시 자동 적용.

**영상 정책**:
- 영상 1편 = 강의 1개 (lesson 1대1 매핑). **Python 기초 = 12강 = 영상 12편 예정** (확정 커리큘럼은 메모리 `python_curriculum_12.md` 참조).
- 길이 기본 180초.
- 카피 톤은 기존 CodeMong 톤 (한국어, 입문자 친화·정직, 과장/이모지 자제) + **"입문자 수준 + 정석적인 강의 느낌"** (학원 인강 스타일, 차분·구조화, 쇼츠톤·과장 X).
- **자막 (SRT/VTT) 은 만들지 않는 것이 정책**. 영상에 burn-in 도, 외부 자산 보존도 하지 않는다 — `02-audio/captions.srt` 같은 파일 자체를 생성하지 않음. narration 이 모든 정보를 음성으로 전달한다는 가정. 사용자가 향후 자막을 요청하면 별도 합의 후 별도 라운드. *lower-third 같은 씬별 디자인 텍스트 카드는 자막이 아니라 시각 디자인 요소 — 정책 영향 없음.*
- 디자인 토큰: Remotion도 Tailwind v4 → 메인 앱과 violet-500 액센트 등 공유 가능 (의도된 결과).

**Git 권장사항** (강제 아님):
- 렌더 산출물 `04-out.mp4` 와 `02-audio/voiceover.mp3` 는 git ignore 권장.
- `_assets/pronunciation.json` 은 commit 권장 (시드 38개 공유 자원).
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

- 백엔드 Route Handler / Server Action — Prisma schema 비어있음
- 퀴즈 / 채점 / 오답 분석 화면 — `concept` 외 사이드바 탭은 stub. 1·2강 평가 문제 데이터 60문항 (Pool A 20 + Pool B 40, 모두 `misconceptionId` / `isomorphGroup` / `pool` 라벨링) 은 `lib/quiz-content.ts` 에 정형화돼 있으나, **추천 매칭 로직 자체는 미구현** (backend-developer 영역 — 후보로 룰 베이스 / LLM 기반 / ML 모델 거론). 화면·채점 로직도 미구현.
- Python 4~12강 영상 (1강·2강·3강은 본 시리즈 첫 세 강 — Hyunsu voice, 자막 정책상 미생성, lesson detail 페이지 임베드 완료)
- 다른 강좌 (CSS, React, Next, 상태관리, HTML, TypeScript 등) — 홈 카드만, detail 미구현
- Supabase Auth UI (middleware/helper 만 wired)
- 강의 상세 본문 카드 (개념 소개 / 구조 다이어그램 / 문법 가이드 / 예시 코드 / 핵심 정리 / 일상 속 활용) — 영상-only 모드라 제거됨. 추후 콘텐츠 모델 확장 시 재도입 가능
