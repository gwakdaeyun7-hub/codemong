---
name: sync-harness
description: 현재 세션의 코드 변경사항을 분석하여 CLAUDE.md, agents, hooks, skills 등 하네스 파일을 동기화하고 GitHub에 커밋+푸시합니다.
user-invocable: true
---

# Sync Harness — CodeMong 하네스 파일 동기화 + GitHub 푸시

현재 세션에서 수정된 코드 변경사항을 분석하여, 관련 하네스 파일(CLAUDE.md, `.claude/agents/`, `.claude/skills/`, `.claude/agent-memory/`, `skills-lock.json`)을 업데이트하고 GitHub에 커밋+푸시합니다.

## 사용법

- `/sync-harness` — 전체 변경사항 분석 → 하네스 업데이트 → 커밋+푸시
- `/sync-harness dry` — 변경사항만 분석하고 수정 계획만 출력 (실제 수정/커밋 안 함)
- `/sync-harness push-only` — 이미 수정된 하네스 파일만 커밋+푸시 (분석+수정 스킵)

## 실행 절차

### Phase 0: 세션 범위 판별 (BLOCKING — 이 단계 없이 Phase 1로 진행 금지)

**핵심 원칙**: `git status`에 나타나는 파일은 **이전 세션의 잔재일 수 있다**. 이 스킬은 반드시 **현재 대화 세션(이번 /sync-harness 호출이 속한 Claude 대화)**에서 Claude가 Edit/Write/Bash 도구로 실제로 수정·생성·삭제한 파일만 대상으로 삼는다.

**MUST 규칙 — 위반 시 작업 중단**:

1. **현재 세션의 편집 증거 수집**: Phase 1로 진행하기 전에, 이번 대화 컨텍스트를 스캔하여 다음을 명시적으로 리스트업한다:
   - Claude가 이번 세션에서 **직접 호출한** Edit/Write 도구의 대상 파일 경로
   - Claude가 이번 세션에서 **직접 실행한** Bash 명령으로 생성/수정/삭제한 파일 (예: `pnpm db:push` 결과 마이그레이션, `rm`, `mv`, `mkdir`, 영상 렌더 산출물)
   - 이 목록을 `SESSION_EDITED_FILES`로 정의한다

2. **git status와의 교집합만 대상**: `git status --short`의 출력 중 `SESSION_EDITED_FILES`에 포함된 파일만 커밋/푸시/하네스 동기화 대상이다. **교집합이 아닌 파일은 절대 staging하지 않는다**.

3. **대화 컨텍스트에서 편집 증거가 없는 파일은 배제**:
   - `git status`에 나타나지만 이번 대화 로그에 편집 흔적이 없는 파일 → **"이전 세션 잔재 — 제외"로 명시적으로 배제**하고 보고서에 나열
   - 불확실한 경우 (파일이 대화에서 언급만 되고 실제 편집은 안 한 경우) → **배제**가 기본값
   - NEVER 이전 세션 잔재 파일을 "정리 차원에서" 포함시키지 말 것

4. **세션 편집 증거가 0개인 경우**: "현재 세션에서 편집한 파일이 없음 — 동기화할 내용 없음"을 보고하고 Phase 1 이후를 전부 스킵한다. `push-only` 모드에서도 동일하게 적용한다.

5. **사용자 명시 지시가 있을 때만 예외**: 사용자가 "`이전 세션 변경사항 X도 포함해줘`"처럼 **구체적으로 파일을 지정**했을 때만 `SESSION_EDITED_FILES`에 추가한다. "전부 커밋해" 같은 모호한 지시는 Phase 0 재확인 요청으로 응답한다.

**보고 형식 (Phase 0 완료 시)**:
```
## 세션 범위 판별 결과
- 현재 세션 편집 파일 ({N}개): {파일 리스트}
- git status 총 변경 ({M}개): 그 중 현재 세션 {N}개 / 이전 세션 잔재 {M-N}개
- 배제된 이전 세션 파일: {파일 리스트}
- 진행 여부: {N>0 ? "Phase 1 진행" : "동기화할 내용 없음 — 종료"}
```

### Phase 1: 변경사항 수집

**전제**: Phase 0에서 확정된 `SESSION_EDITED_FILES`만 대상으로 진행한다. `git diff HEAD` 출력에서도 이 목록에 포함된 파일의 diff만 읽는다.

1. `git diff HEAD -- {SESSION_EDITED_FILES}` 실행 (세션 파일 한정)
2. `git diff --cached -- {SESSION_EDITED_FILES}` 실행 (세션 파일 한정)
3. `git log --oneline -10` 실행하여 최근 커밋 메시지 확인 (스타일 참조용)
4. 변경된 파일 목록을 영역별로 분류:
   - `app/` 라우트 파일 변경/추가 → CLAUDE.md "Routes" 표 갱신 후보
   - `lib/courses.ts`, `lib/course-detail.ts`, `lib/lesson-plan.ts`, `lib/lesson-content.ts` 변경 → CLAUDE.md "Data" 표 갱신 후보
   - `lib/supabase/`, `lib/prisma.ts` 구조 변경 → CLAUDE.md "Stack" 또는 새 섹션 후보
   - `prisma/schema.prisma` 변경 → CLAUDE.md "Out of scope" 갱신 (백엔드 구현 진행 시 새 섹션 추가)
   - `components/` 새 도메인 폴더 → CLAUDE.md "Components 폴더 컨벤션" 표 갱신
   - `components/*/icon-map.ts` 변경 → 자체 자립 (CLAUDE.md 수정 불필요, 단 원칙 위반 시 보고)
   - `package.json` 의존성 메이저 변경 (Next, React, Tailwind, Prisma, Supabase, Remotion) → CLAUDE.md "Stack" 갱신
   - `pnpm-workspace.yaml` 변경 → CLAUDE.md "Stack" workspace 멤버 목록
   - `next.config.ts`, `eslint.config.mjs`, `prisma.config.ts` 변경 → CLAUDE.md "Troubleshooting" 후보
   - `.claude/agents/*.md` 변경 → CLAUDE.md "Agents" 섹션 갱신 후보
   - `.claude/skills/*/SKILL.md` 변경 → 자체 자립
   - `videos/` 산출물 변경 → CLAUDE.md "Video Production" 갱신 (디렉토리 규약/정책만, 산출물 자체는 staging 안 함)
   - `videos/_assets/pronunciation.json` 시드 변경 → CLAUDE.md "Video Production" 의 "발음 사전" 항목 갱신
   - `remotion/` workspace 변경 → CLAUDE.md "Stack" 의 Remotion 항목 또는 "Video Production"

### Phase 2: 하네스 파일 영향 분석

변경사항별로 다음을 판단:

| 변경 유형 | 영향받는 하네스 파일 | 업데이트 기준 |
|-----------|---------------------|-------------|
| 새 라우트 추가 / 라우트 동작 변경 | CLAUDE.md "Routes" 표 | Path / Role / Notes |
| 새 lib mock/데이터 파일 | CLAUDE.md "Data" 표 | File / Exports |
| `Course` / `CourseDetail` / `Lesson` / `LessonContent` 타입 변경 | CLAUDE.md "Data" 표 + 관련 룩업 함수 동작 설명 | 타입 이름 + Exports |
| 새 components 도메인 폴더 (`components/{domain}/`) | CLAUDE.md "Components 폴더 컨벤션" 표 | Path / 역할 |
| `icon-map.ts` 컨벤션 변경 | CLAUDE.md "Components 폴더 컨벤션" 하단 주석 + "패턴 결정" 6번 | 화이트리스트 규칙 변화 |
| 새 패턴 결정 (사용자 합의로 굳어진 룰) | CLAUDE.md "패턴 결정" 섹션 | 번호 매긴 룰로 추가 |
| Stack 의존성 메이저 변경 (Next 16→17, React 19→20, Tailwind v4→v5, Prisma 7→8, Supabase 메이저, Remotion 메이저) | CLAUDE.md "Stack" | 패키지 + 새 버전 |
| 새 명령 추가 (`package.json` scripts, `pnpm --filter` 패턴, py 스크립트) | CLAUDE.md "Commands" 코드 블록 | 명령 + 한 줄 설명 |
| 새 Troubleshooting 케이스 발견 | CLAUDE.md "Troubleshooting" | 증상 + 원인 + 회피 |
| 새 에이전트 (`.claude/agents/`) | CLAUDE.md "Agents" 섹션 | 에이전트 1줄 설명 |
| 영상 디렉토리 규약 변경 | CLAUDE.md "Video Production" "디렉토리 규약" | 트리 + 파일 의미 |
| TTS 기본값/voice 변경 | CLAUDE.md "Video Production" "TTS 기본값" | voice / rate / fallback 우선순위 |
| 영상 정책 변경 (1편 길이, 톤, 디자인 토큰) | CLAUDE.md "Video Production" "영상 정책" | 룰 한 줄 |
| `videos/_assets/pronunciation.json` 시드 추가 | CLAUDE.md "Video Production" "발음 사전" 항목 | 현재 시드 개수 |
| `prisma/schema.prisma` 모델 추가 (현재 비어있음) | CLAUDE.md "Out of scope" 에서 해당 항목 제거 + 새 "Data Models" 섹션 추가 검토 | 모델명 + 용도 |
| 새 강좌 / 새 강의 detail 구현 (현재 Python 1강만) | CLAUDE.md "Out of scope" 에서 해당 항목 제거 + "Routes" 표에 매칭 ID 추가 | courseId / lessonId |
| Supabase Auth UI 구현 (현재 middleware/helper만) | CLAUDE.md "Out of scope" 에서 해당 항목 제거 + "Stack" 또는 새 섹션 | Auth 흐름 요약 |
| 새 슬래시 커맨드 (`.claude/commands/` — 폴더 신설) | CLAUDE.md 새 "Commands (Slash)" 섹션 신설 | 커맨드 + 위임 에이전트 |
| 새 hook (`.claude/hooks/` — 폴더 신설) | CLAUDE.md 새 "Hooks" 섹션 신설 | Hook / Trigger / Mode / Scope |

**업데이트 하지 않는 것:**
- 단순 버그 수정, Tailwind 클래스 미세 조정, 색/패딩 변경
- `app/courses/[courseId]/page.tsx` 같은 기존 라우트 내부 구현 리팩토링 (Routes 표는 동작 단위, 내부는 무관)
- 컴포넌트 내부 마크업 재배열 (Components 표는 폴더 단위, 내부 컴포넌트 추가는 자체 자립)
- `videos/{courseId}/{lessonId}/04-out.mp4`, `02-audio/voiceover.mp3` 산출물 (gitignore 권장 — 절대 staging 안 함)
- `lib/generated/prisma/` (Prisma 생성물)
- `node_modules/`, `.next/`, `next-env.d.ts` 자동 생성물
- `package.json` 의 마이너/패치 버전 업데이트 (메이저만 하네스 반영)
- 코드에서 직접 확인할 수 있는 정보 (props 타입, 함수 시그니처) → CLAUDE.md에 이미 있으면 갱신, 없으면 추가 안 함
- `skills-lock.json` 자체 (skill 등록 메타 — 자체 자립)

### Phase 3: claude-code-harness-engineer 에이전트 호출

영향 분석 결과 업데이트가 필요한 경우, `claude-code-harness-engineer` 에이전트(글로벌 `~/.claude/agents/`)를 호출하여 수정을 위임합니다.

**에이전트 호출 프롬프트 템플릿:**

```
CodeMong (Next.js 16 + React 19 + Tailwind v4 + Prisma + Supabase + Remotion) 프로젝트의 현재 세션에서 다음 코드 변경이 발생했습니다:

[변경 요약 — 어떤 파일이 어떻게 변경되었는지]

이 변경으로 인해 다음 하네스 파일들을 업데이트해야 합니다:

1. {파일 경로}: {업데이트 이유} — {구체적 수정 내용}
2. {파일 경로}: {업데이트 이유} — {구체적 수정 내용}

수정 원칙:
- 변경된 부분만 최소한으로 수정 (CLAUDE.md 전체 재작성 금지)
- 기존 포맷/스타일 유지 (한국어, `---` 구분선, 표, 절제된 톤, "쉬워요!" 같은 과장 금지, 이모지 거의 안 씀)
- 코드/스키마/config 파일에서 직접 확인 가능한 정보는 정확히 반영
- 추측이나 미래 계획은 포함하지 않음
- "Out of scope" 섹션의 항목이 구현되면 해당 항목을 제거하고 적절한 섹션에 새 정보 반영
- "패턴 결정" 섹션은 사용자가 명시적으로 합의한 룰만 추가 (Claude 단독 판단으로 추가 금지)

각 파일을 읽고, 해당 섹션만 Edit으로 수정하세요.
```

**에이전트 수정 범위 제한:**
- `CLAUDE.md`: Stack, Routes, Data, Components 폴더 컨벤션, 패턴 결정, Commands, Troubleshooting, Video Production, Agents, Out of scope, (필요 시 신설) Commands (Slash) / Hooks / Data Models

### Phase 4: 커밋 + 푸시

Phase 0에서 확정된 `SESSION_EDITED_FILES` + Phase 3에서 수정된 하네스 파일만 커밋하고 푸시합니다.

1. **변경 파일 확인**: `git status --short` 출력과 `SESSION_EDITED_FILES`의 **교집합만** 사용. `git add -A`, `git add .`, `git commit -a` 같은 광범위 staging 명령은 **절대 금지**. 파일을 하나씩 이름으로 지정해서 add한다.
2. **코드 변경 커밋** (세션 파일 중 하네스 외 변경이 있는 경우):
   - `SESSION_EDITED_FILES` 중 코드 파일만 이름으로 지정해서 staging
   - **절대 staging 금지**: `.env*`, `node_modules/`, `.next/`, `lib/generated/prisma/`, `videos/*/04-out.mp4`, `videos/*/02-audio/voiceover.mp3`, credentials/secret 파일
   - 커밋 메시지 형식:
     ```
     {type}: {변경 내용 요약}

     {상세 설명 (필요시)}

     Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
     ```
   - `{type}`: feat (새 기능/라우트), fix (버그), refactor, chore, content (강의/영상 데이터), video (영상 산출물 메타)

3. **하네스 변경 커밋** (Phase 3에서 수정이 발생한 경우):
   - 수정된 하네스 파일만 staging:
     ```
     git add CLAUDE.md .claude/agents/*.md .claude/skills/*/SKILL.md
     ```
     (실제 변경된 파일만 add)
   - 커밋 메시지 형식:
     ```
     chore: sync harness files with session changes

     Updated:
     - {파일1}: {변경 요약}
     - {파일2}: {변경 요약}

     Triggered by changes to: {변경된 코드 영역 요약}

     Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
     ```

4. **푸시**: `git pull --rebase` 후 `git push` (현재 브랜치의 upstream으로)

**범위 제한 (STRICT)**:
- 대상은 **오직** Phase 0에서 확정된 `SESSION_EDITED_FILES` + Phase 3에서 수정된 하네스 파일
- `git status`에 나타나지만 `SESSION_EDITED_FILES`에 없는 파일 → **절대 건드리지 않음** (staging/reset/rm 모두 금지)
- 이미 커밋된 이전 세션의 변경도 건드리지 않음
- `git add .`, `git add -A`, `git commit -a` 등 광범위 staging 명령 **금지**. 파일을 하나씩 이름으로 명시해야 함

### Phase 5: 결과 보고

```
## Harness Sync 완료

### 변경 분석
- 코드 변경: {N}개 파일 ({영역 요약})
- 하네스 영향: {M}개 파일 업데이트 {필요 / 불필요}

### 수정 내역
| 하네스 파일 | 수정 섹션 | 변경 내용 |
|-------------|----------|----------|
| CLAUDE.md | Routes | `/courses/[courseId]/lessons/[lessonId]/quiz` 추가 |
| CLAUDE.md | Out of scope | "퀴즈 / 채점" 항목 제거 |

### Git
- Code commit: {hash} — {message} ({N}개 파일)
- Harness commit: {hash} — {message} ({M}개 파일)
- Pushed to: {remote/branch}
```

## dry 모드

`/sync-harness dry` 실행 시:
- Phase 0~2만 실행 (세션 범위 판별 + 변경사항 수집 + 영향 분석)
- Phase 3~5 스킵 (수정/커밋/푸시 안 함)
- 어떤 하네스 파일에 어떤 수정이 필요한지 계획만 출력

## push-only 모드

`/sync-harness push-only` 실행 시:
- Phase 0은 **반드시 실행** (세션 범위 판별은 모든 모드에서 필수)
- Phase 1~3 스킵 (변경 분석 + 하네스 수정 안 함)
- Phase 0에서 확정된 `SESSION_EDITED_FILES`만 커밋+푸시 (이전 세션 잔재는 절대 포함 금지)
- Phase 4~5 실행

## 주의사항

- **하네스 파일 외 코드는 절대 수정하지 않는다** — 이 스킬은 하네스 동기화 전용. 코드 작성은 frontend-developer/backend-developer 에이전트, 영상은 `/make-codemong-video`.
- **세션 범위 위반은 치명적 오류** — Phase 0에서 판별한 `SESSION_EDITED_FILES` 밖의 파일을 건드리면 사용자 작업이 의도치 않게 커밋되거나 유실될 수 있음. 불확실하면 **배제**가 기본값
- **영상 산출물 (`04-out.mp4`, `02-audio/voiceover.mp3`) 절대 staging 금지** — gitignore 권장 대상. 메타데이터(`00-objectives.md`, `01-script.md`, `pronunciation.json`)만 커밋 대상
- **`lib/generated/prisma/` 절대 staging 금지** — Prisma 생성물
- **`.env*`, `.env.local` 절대 staging 금지** — Supabase / TTS API 키 보관소
- **"Out of scope" 항목이 구현되면 그 항목을 먼저 제거** — CLAUDE.md "Out of scope"에 남아 있는 항목이 코드로 들어왔으면, 새 섹션 추가와 동시에 Out of scope 리스트에서 빼야 일관성 유지
- **"패턴 결정"은 사용자 합의 사항 전용** — 이 섹션에 새 항목 추가는 Claude 단독 판단 금지. 사용자가 "이거 룰로 굳히자"라고 명시했을 때만 추가
- 변경사항이 하네스에 영향을 주지 않으면 "업데이트 불필요" 보고 후 종료
- 충돌 방지: 푸시 전 `git pull --rebase` 실행
- 커밋 메시지에 실제 변경 내용을 구체적으로 기술 (제네릭한 메시지 금지)
