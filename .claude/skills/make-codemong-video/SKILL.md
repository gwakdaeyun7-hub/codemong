---
name: make-codemong-video
description: "특정 코딩 학습 주제로부터 CodeMong 학습 영상 한 편을 처음부터 끝까지 자동 제작하는 결정론적 파이프라인. 사용자가 '코딩 학습 영상 만들어줘', 'Python 변수 영상화', '/make-codemong-video <주제>', '강의 영상 한 편 뽑아줘', 'for 루프 영상 만들어줘', 'list comprehension 강의 영상화', 'CodeMong 영상 파이프라인 돌려줘' 같은 입력을 줄 때 발동. 학습 목표 분해 → 대본 → 오디오/컴포지션(병렬) → wire & render → 디렉터 리뷰 → (선택) 웹앱 임베드 순서로 기존 에이전트(programming-language-education-expert, video-script-writer, video-voiceover-audio, remotion-composer, video-director, frontend-developer)를 호출한다. Skill 자체는 영상을 만들지 않고, 호출 순서·산출물 규약·재실행 정책·사전 조건 검증을 강제하는 매뉴얼."
argument-hint: "<주제> [--from=00-objectives|01-script|02-audio|03-composition|04-render|05-embed] [--length=<초>] [--orientation=landscape|portrait]"
---

# make-codemong-video

CodeMong 학습 영상 한 편을 자동으로 만든다. 이 Skill은 **오케스트레이션 매뉴얼**이지 작업자가 아니다. 정해진 순서로 기존 에이전트를 호출하고, 산출물을 약속된 위치에 떨어뜨리고, 재실행 가능성을 강제한다.

## 1. 발동 시점 (트리거 예시)

다음과 비슷한 입력에서 자동 매칭:

- "Python 변수 영상 만들어줘"
- "for 루프 영상화"
- "/make-codemong-video list-comprehension"
- "이 강의 영상 한 편 뽑자"
- "CodeMong 영상 파이프라인 돌려줘"

좁은 단계만 다루는 요청 (예: "방금 대본만 다시 써줘", "오디오만 다시 합성") 은 이 Skill이 아니라 해당 단일 에이전트(video-script-writer, video-voiceover-audio 등)를 직접 호출해야 한다.

> 확정 커리큘럼/lessonId 매핑은 memory `python_curriculum_12.md`, 영상 톤 방향은 memory `video_tone_direction.md` 를 단일 진실원천으로 참조한다. Skill 본문 안에 12강 목차나 톤 규칙을 중복 하드코딩하지 말 것.

## 2. 사전 조건 체크 (Skill 첫 단계에서 무조건 검증)

다음 셋 중 하나라도 충족되지 않으면 **즉시 중단**하고 사용자에게 한국어로 정직하게 알린다. 우회·추측·임시방편 금지.

### 2.1. Remotion 프로젝트 셋업 여부

CodeMong 루트에 **Remotion 프로젝트가 따로 셋업되어 있어야 한다**. 다음 중 하나의 위치에 `package.json`이 있고 그 안에 `"remotion"` 의존성이 있는지 확인:

- `<repo-root>/remotion/` (서브폴더)
- `<repo-root>/../codemong-remotion/` (sibling repo)
- 사용자가 명시한 다른 경로

확인 방법: `Glob` 으로 `**/remotion/package.json` 검색 + 그 파일에 `remotion` 의존성 grep.

**없으면**: Skill 실행 중단. 사용자에게 다음 질문을 한국어로 던진다.

> Remotion 프로젝트가 아직 셋업되지 않았습니다. 어디에 두시겠습니까?
> 1. `remotion/` 서브폴더 (Next.js 앱과 같은 repo)
> 2. sibling repo (별도 디렉토리)
>
> 결정 후 `npx create-video@latest --yes --blank --no-tailwind <name>` 으로 셋업하시고 다시 호출해주세요. 자동 셋업은 진행하지 않습니다 — 위치 결정은 프로젝트 구조에 영향을 주므로 사용자가 직접 정해야 합니다.

### 2.2. TTS 엔진

기본 엔진은 **Edge TTS** (`edge-tts` 파이썬 패키지). 무료, API 키 불필요. 따라서 **이 항목은 더 이상 차단 사유가 아니다** — 즉시 통과.

선택적 fallback (있으면 우선순위 올라감, 없어도 실패 아님):

- `.env.local` 에 `ELEVENLABS_API_KEY=...` 있으면 ElevenLabs 사용 가능
- `.env.local` 에 `OPENAI_API_KEY=...` 있으면 OpenAI TTS 사용 가능
- 둘 다 없으면 Edge TTS 그대로 진행

확인 방법: `Read` 로 `.env`, `.env.local` 열어 키 존재 여부 *기록*만. 없어도 진행한다.

> 안내: Edge TTS 가 기본입니다 (무료, 키 불필요). ElevenLabs / OpenAI 키가 있으면 더 자연스러운 음성을 위해 fallback 으로 활용 가능합니다. 없어도 그대로 진행합니다.

### 2.3. 출력 디렉토리

CodeMong 루트에 `videos/` 와 `videos/_assets/` 두 디렉토리가 있는지. 없으면 만든다 (자동 OK — 단순 mkdir).

또한 `videos/_assets/pronunciation.json` 이 없으면 시드 파일로 생성한다 (영어 약어/외래어 → 한국어 음역 사전). 시드 매핑은 `Python`, `JavaScript`, `TypeScript`, `HTML`, `CSS`, `API`, `HTTP`, `HTTPS`, `JSON`, `SQL`, `URL`, `DOM`, `SDK`, `Git`, `GitHub`, `React`, `Next.js`, `Node.js` 18개. 알파벳 정렬.

## 3. 입력 정규화

사용자 입력을 다음 변수로 정규화:

| 변수 | 규칙 | 예시 |
|---|---|---|
| `courseId` | CodeMong courseId. 사용자 입력에서 추론하거나 명시. 미상 시 사용자에게 확인. | `python` |
| `lessonId` | `lesson-N` 형식. CodeMong 강의 체계 따름 (Python 기초는 lesson-1 ~ lesson-12 — 확정 커리큘럼은 memory `python_curriculum_12.md` 참조). | `lesson-1` |
| `topic` | 강의 제목 (참고용, slug 안 만듦) | "파이썬 개요 & 개발환경" |
| `length-seconds` | 명시 없으면 **180초 (3분)** | 180 |
| `orientation` | 명시 없으면 **landscape (1920x1080)** | landscape |
| `tts-voice` | 명시 없으면 **`ko-KR-HyunsuMultilingualNeural`**. 향후 변경 가능 (`ko-KR-InJoonNeural` 등) | `ko-KR-HyunsuMultilingualNeural` |
| `tts-rate` | 명시 없으면 **`+10%`** | `+10%` |

사용자가 lesson 매핑 없이 ad-hoc 주제만 던지면 어느 강의에 매핑할지 확인 후 진행.

## 4. 산출물 디렉토리 규약 (강제)

```
videos/
├── _assets/
│   └── pronunciation.json         # 영어→한국어 음역 사전
└── <courseId>/                    # 예: python
    └── <lessonId>/                # 예: lesson-1
        ├── 00-objectives.md       # programming-language-education-expert
        ├── 01-script.md           # video-script-writer
        ├── 02-audio/              # video-voiceover-audio
        │   ├── voiceover.mp3
        │   └── timestamps.json    # [{ sceneId, startMs, endMs, narrationText }]
        ├── 03-composition/        # remotion-composer (Remotion repo로 symlink/복사 결정은 composer가)
        │   └── *.tsx
        └── 04-out.mp4             # remotion-composer (final render)
```

각 단계 산출물은 **반드시 위 경로에 떨어져야** 한다. 에이전트 호출 시 출력 경로를 명시적으로 지시할 것.

## 5. 단계별 호출 순서 (고정)

### 단계 0 — 학습 목표 분해

**호출 에이전트**: `programming-language-education-expert`

**입력**: 주제 (`topic`), 대상(한국 코딩 입문자), 영상 길이(`length-seconds`).

**요청 내용**:
> CodeMong 학습 영상 "<topic>" 의 학습 목표를 분해해줘. 산출물은 `videos/<courseId>/<lessonId>/00-objectives.md` 에 마크다운으로 떨어뜨려라. 포함:
> - 이 영상이 끝났을 때 학습자가 *구체적으로 무엇을 할 수 있어야 하는지* (행동 가능 목표 3~5개)
> - prerequisite (이 영상 보기 전에 알고 있어야 할 것)
> - 입문자가 자주 막히는 지점 / 오개념 2~4개
> - 영상에서 다루지 *않을* 인접 개념 (scope 제한)

**검증**: `00-objectives.md` 가 만들어졌는지 확인. 없으면 재호출.

### 단계 1 — 대본

**호출 에이전트**: `video-script-writer`

**입력**: `00-objectives.md` 경로 + `topic` + `length-seconds` + `orientation` + `videos/_assets/pronunciation.json` 경로.

**요청 내용**:
> `videos/<courseId>/<lessonId>/00-objectives.md` 의 학습 목표를 입력으로 받아 대본을 작성해라. 산출물은 `videos/<courseId>/<lessonId>/01-script.md`. 포함:
> - scene 단위 분할 (보통 8~15 scenes for 3분)
> - 각 scene 마다: `sceneId`, narration text (한국어, 입문자 친화·정직 톤, "쉬워요!"/"꿀팁!" 금지), 화면 visual 지시문 (어떤 코드/다이어그램/텍스트가 보여야 하는지), 예상 길이(초)
> - 도입부에서 학습 목표를 차분히 제시 (학원 인강 스타일 도입 — "오늘은 ~를 배워보겠습니다" 형태). 트렌디한 8초 hook·과장된 약속 금지
> - 30~60초마다 active recall 비트
> - 정리 비트 (마지막 scene)
>
> **발음 사전 1차 적용**: `videos/_assets/pronunciation.json` 을 로드해서 narration 안의 영어 약어/외래어를 한국어 음역으로 *대본 텍스트 자체에* 박아라. 사전에 없는 신규 단어를 발견하면 사전에 추가하고 재실행하라.
>
> **시즌 통일 reference 강제 (lesson N≥2 일 때 무조건)**: 작업 시작 전 *반드시* `videos/python/lesson-<N-1>/01-script.md` 의 Scene 1 (도입) 과 마지막 Scene (정리+다음 강의 예고) 을 읽고 narration 톤·길이·visual 정형 패턴을 *그대로 답습*. 메모리 `season_consistency_pattern.md` 도 참조. 새 도입/마무리 디자인 짜지 말 것. Scene 1 = "안녕하세요. 파이썬 기초 N강을 시작합니다…" + 회상 + 오늘 한 줄 (12~14s) + 정형 visual 5요소. 마지막 = "오늘은 … 했습니다" + 인사이트 + "다음 강의는 …" (12~14s) + 정형 visual 3요소.

**검증**: `01-script.md` 존재 + scene 분할이 있는지 확인.

### 단계 2 — 오디오 + 컴포지션 골격 (병렬)

**중요**: 이 두 작업은 **한 메시지 안에 두 개의 Agent 호출을 동시에** 보내서 병렬 실행한다. 순서대로 돌리지 말 것.

#### 단계 2a — 오디오

**호출 에이전트**: `video-voiceover-audio`

**입력**: `01-script.md` 경로.

**요청 내용**:
> `videos/<courseId>/<lessonId>/01-script.md` 의 narration 을 한국어 TTS로 합성해라. 출력 디렉토리는 `videos/<courseId>/<lessonId>/02-audio/`. 산출물:
> - `voiceover.mp3` — 최종 보이스오버 (silence 다듬기 포함)
> - `timestamps.json` — `[{ sceneId, startMs, endMs, narrationText }]` 배열, scene 경계와 정확히 일치
>
> **자막 (SRT/VTT) 은 생성하지 마라**. CodeMong 영상은 자막 OFF 정책 — 외부 자산으로도 만들지 않는다.
> **TTS 엔진**: Edge TTS 1순위 (무료, 키 불필요). `.env.local` 에 ElevenLabs/OpenAI 키 있고 더 자연스러운 음성이 필요하면 fallback 으로 사용 가능.
> **기본값**: voice `ko-KR-HyunsuMultilingualNeural`, rate `+10%`. 사용자가 인자로 override 가능.
> **발음 사전 2차 검수**: TTS 합성 *직전* 단계로 `videos/_assets/pronunciation.json` 을 다시 로드해서, 대본에 누락된 영어 약어/외래어가 있으면 치환하고 합성해라. 사전에 없는 신규 단어 발견 시 사용자에게 보고 + 사전 추가 후 재실행.
> BGM/SFX 는 이번 라운드에서는 생략 (필요시 별도 라운드).

#### 단계 2b — 컴포지션 골격

**호출 에이전트**: `remotion-composer`

**입력**: `01-script.md` 경로 + `00-objectives.md` 경로 + Remotion 프로젝트 위치 + `orientation`.

**요청 내용**:
> `videos/<courseId>/<lessonId>/01-script.md` 의 scene 분할과 visual 지시문을 Remotion 컴포지션으로 구현해라. **이 단계에서는 audio wire 하지 말 것** — 나중에 단계 3에서 한다. 산출물:
> - scene 단위 React 컴포넌트 → `videos/<courseId>/<lessonId>/03-composition/` (Remotion repo 안 복제·symlink는 composer 판단)
> - `Root.tsx` 에 Composition 등록 (id: `<courseId>-<lessonId>`, fps: 30, 해상도는 `orientation` 에 따라)
> - 각 scene 의 placeholder duration은 script 의 예상 길이로 (timestamps.json 받으면 단계 3에서 정확히 맞출 것)
> - `useCurrentFrame()` + `interpolate()` + `Easing` 만 사용. CSS transitions / Tailwind animate-* 클래스 절대 금지 (remotion-best-practices skill 참조).
> - 액센트 컬러 violet-500 ~ purple-600, 폰트 Pretendard 또는 Noto Sans KR.
> - 비주얼은 `00-objectives.md` 의 행동 가능 목표·자주 막히는 지점과 정합되어야 한다.
>
> **시즌 통일 reference 강제 (lesson N≥2 일 때 무조건)**: 작업 시작 전 *반드시* `videos/python/lesson-<N-1>/03-composition/scenes/Scene01.tsx` 와 마지막 `SceneN.tsx` 를 읽고 정형 컴포넌트 구조 + delaySec 값 + fontSize 를 *그대로 답습*. 메모리 `season_consistency_pattern.md` 도 참조. Scene01 정형 5요소: 좌상단 `<CourseLabel>` (delaySec 0.2) / 중앙 110px h1 (0.6) / `<AccentUnderline width={180}>` (1.4) / 36px 부제목 (1.8) / 우하단 회상 ✓ 카드 (2.6). 마지막 Scene 정형 3요소: 좌 절반 체크리스트 (✓ 36×36 accent bg + 라벨) / 우 절반 `<Card variant="accent">` 다음 강의 카드 (width 560~640, fontSize 56) / 하단 `<LowerThird>`. 새 도입/마무리 디자인 짜지 말 것.

**참고**: `remotion-composer` 는 호출되면 자동으로 `.claude/skills/remotion-best-practices/` 를 참조한다. Skill 본문에서 명시적으로 그 스킬을 호출하지 말 것.

**검증**: 두 작업 끝난 뒤 `02-audio/voiceover.mp3` + `timestamps.json` 과 `03-composition/*.tsx` 가 모두 있는지 확인. (`captions.srt` 는 더 이상 생성하지 않으므로 검증 항목 아님.)

### 단계 3 — wire & render

**호출 에이전트**: `remotion-composer` (재호출)

**입력**: `02-audio/timestamps.json` + `02-audio/voiceover.mp3` + `03-composition/`.

**요청 내용**:
> 단계 2에서 만든 컴포지션에 오디오를 wire 해라.
> - `timestamps.json` 의 startMs/endMs 로 각 scene `<Sequence>` 의 from/durationInFrames 정확히 맞춤
> - `voiceover.mp3` 를 `<Audio>` 컴포넌트로 마운트
> - **자막 burn-in 절대 금지**. CodeMong 영상은 자막 OFF 정책 — `@remotion/captions` 호출도, SRT 파싱도, 화면 자막 렌더도 하지 마라. (lower-third 같은 *씬별 디자인 텍스트* 는 자막이 아니므로 별개 — 그건 그대로 진행.)
> - `npx remotion render <courseId>-<lessonId> videos/<courseId>/<lessonId>/04-out.mp4` 로 최종 렌더
>
> 렌더 실패 시 에러 원문 그대로 보고. 추측으로 우회하지 말 것.

**검증**: `04-out.mp4` 파일 존재 + 크기가 0보다 큰지.

### 단계 4 — 완성본 리뷰

**호출 에이전트**: `video-director`

**입력**: `00-objectives.md` + `01-script.md` + `04-out.mp4` + `02-audio/timestamps.json`.

**요청 내용**:
> 완성된 영상 `videos/<courseId>/<lessonId>/04-out.mp4` 를 학습 목표 (`00-objectives.md`) 대비 리뷰해라.
> - pass / fail 판정
> - fail 이면 어느 단계로 되돌려서 재실행해야 할지 추천 (`--from=01-script` 등)
> - pass 여도 개선 제안 있으면 명시
> - CodeMong 톤 (정직·구체·친절, 과장 금지) 위반 여부
> - 정석 강의 느낌 이탈 여부 (게이미피케이션 과다, 쇼츠톤, 과한 연출, 트렌디한 hook 등 — 학원 인강이라면 자연스러운가? 기준)
> - **시즌 통일 점검 (lesson N≥2 일 때 필수) — P0/P1/P2 fail 트리거**: 첫 scene 정형 5요소 (좌상단 CourseLabel / 중앙 110px 제목 / underline 180 / 36px 부제목 / 우하단 회상 ✓) + 마지막 scene 정형 3요소 (좌 체크리스트 / 우 다음 강의 카드 → / 하단 lower-third) 가 모두 있을 뿐 아니라, *수치 metric 과 delaySec 시퀀스* 까지 정형을 답습하는지 video-director 의 agent system prompt § "시즌 통일 — 구체적 fail 트리거" 의 P0/P1/P2 리스트로 grep 수준 점검. 메모리 `season_consistency_pattern.md` 와 lesson-<N-1> 의 Scene 01·마지막 Scene 을 reference 로 cross-check. 한 개라도 어긋나면 즉시 fail + `--from=03-composition` 권고. P0 위반 (별도 morph hook 컴포넌트 존재 / `<LowerThird>` 부재 / `SlideOut`·`PageFadeOut`·"Lesson N/끝" 라벨 존재 등) 은 *반드시* 잡아야 함 — 추상적 인상평으로 통과시키지 말 것.
> - **P3 — 누적 quality rules 점검 (필수)**: `videos/_assets/quality-rules.md` 를 `Read` 로 로드해 ACTIVE 상태 룰 전체를 훑는다.
>   - Category G (Grep-able) 룰: 명시된 grep 패턴/조건으로 `03-composition/scenes/*.tsx` fast-scan. 일치(=위반)면 fail.
>   - Category R (Review) 룰: 영상 final cut 을 비주얼로 점검.
>   - Category N (Narration) 룰: 합성된 voiceover.mp3 를 청취해 잘못 발음된 단어 확인 (또는 사용자 보고 인용).
>   - 한 개라도 위반 시 fail + 적절한 `--from=` 권고 (G/R → `--from=03-composition`, N → `--from=01-script`).
>   - 리뷰 후 *재발 가능한 새 패턴* 발견 시 사용자 합의 후 `quality-rules.md` 에 다음 ID(R-NNN)로 append — 룰은 시간이 갈수록 누적되며, 새 영상부터 적용된다.

판정 결과를 사용자에게 그대로 전달.

### 단계 5 — (선택) 웹앱 임베드

사용자가 명시적으로 "강의 페이지에 붙여줘" 같은 요청을 했을 때만 실행. 기본은 건너뜀.

**호출 에이전트**: `frontend-developer`

**요청 내용**:
> `videos/<courseId>/<lessonId>/04-out.mp4` 를 CodeMong 웹앱의 lesson-video 카드에 통합해라. 대상 lesson 은 사용자가 명시한 lessonId. `components/lesson-content/lesson-video.tsx` 를 참고해서 자연스럽게 연결.

## 6. 재실행 정책 (idempotent)

호출 시 `videos/<courseId>/<lessonId>/` 가 이미 부분적으로 차 있을 수 있다. 다음 규칙 따른다.

1. 디렉토리 스캔으로 **어디까지 산출물이 있는지** 감지:
   - `00-objectives.md` 있음 → 단계 0 skip 가능
   - `01-script.md` 있음 → 단계 1 skip 가능
   - `02-audio/voiceover.mp3` + `timestamps.json` 모두 있음 → 단계 2a skip 가능
   - `03-composition/*.tsx` 있음 → 단계 2b skip 가능
   - `04-out.mp4` 있음 → 단계 3 skip 가능

2. 사용자가 `--from=<단계>` 인자를 줬으면 그 단계부터 재실행. 가능 값:
   - `--from=00-objectives` (전체 처음부터)
   - `--from=01-script`
   - `--from=02-audio` (단계 2a만 재실행, 2b는 그대로)
   - `--from=03-composition` (단계 2b만 재실행)
   - `--from=04-render` (단계 3만 재실행)
   - `--from=05-embed` (단계 5만 — 4까지 끝났을 때)

3. `--from=` 인자가 없고 부분 산출물이 있으면 사용자에게 확인:
   > `videos/<courseId>/<lessonId>/` 에 이미 단계 X까지 산출물이 있습니다. 어디서부터 재실행할까요?
   > 1. 처음부터 (`--from=00-objectives`)
   > 2. 다음 단계부터 (`--from=<next>`)
   > 3. 특정 단계 재실행 (`--from=<단계>`)

4. **첫 산출물은 거의 손봐야 한다는 것을 정직하게 안내**:
   > 첫 라운드 영상은 대부분 대본·타이밍·시각화 어딘가에서 손을 봐야 합니다. video-director 의 리뷰 결과를 보고 `--from=` 으로 해당 단계부터 다시 돌리는 게 정상 흐름입니다.

## 7. 실패 모드 (즉시 중단 + 정직 안내)

다음 상황에서는 우회하지 말고 즉시 멈추고 사용자에게 알린다.

| 상황 | 행동 |
|---|---|
| Remotion 프로젝트 없음 | 단계 0도 시작 안 함. 사전 조건 안내. |
| Edge TTS 합성 자체가 실패 (네트워크 등) | 사용자에게 에러 원문 보고하고 멈춤. 추측으로 우회 금지. |
| 어떤 에이전트가 산출물을 약속된 경로에 안 떨어뜨림 | 그 단계 재호출 1회 → 또 실패하면 사용자에게 보고하고 멈춤 |
| `npx remotion render` 실패 | 에러 원문 그대로 사용자에게 + remotion-composer 에 디버깅 위임 권유 |
| `courseId` 또는 `lessonId` 매핑이 모호 | 진행 전 사용자에게 확인 |
| `01-script.md` 의 scene 합산 길이가 `length-seconds` 와 ±20% 이상 차이 | video-script-writer 에 재요청 |

추측으로 임시 산출물을 만들거나 빈 파일을 채우지 말 것.

## 8. 톤·기본값 (Skill이 강제)

- 모든 카피·대본: **한국어**, 입문자 친화, 정직 톤. "쉬워요!", "꿀팁!", "충격!" 금지. 이모지 거의 안 씀.
- 영상 형식 톤: **입문자 수준 + 정석적인 강의 느낌** (학원/인강 스타일, 차분·구조화). 트렌디한 쇼츠 톤·과장된 hook·게이미피케이션 과다 연출 금지. 도입 → 개념 설명 → 예시 → 정리의 전형적 강의 흐름 유지. 자세한 톤 가이드는 memory `video_tone_direction.md` 단일 진실원천 참조.
- 영상 기본 길이: **180초 (3분)**.
- 액센트 컬러: violet-500 ~ purple-600.
- 폰트: Pretendard 또는 Noto Sans KR (한국어 fallback 포함). 최종 결정은 remotion-composer.
- **자막 (SRT/VTT) 정책**: **만들지 않는다**. 영상에 burn-in 도, 외부 자산으로 보존도 하지 않는다. video-voiceover-audio 단계에서 SRT/VTT 생성 자체를 건너뛰고, remotion-composer 도 자막 렌더 코드를 추가하지 않는다. (lower-third 같은 *씬별 디자인 텍스트 카드* 는 자막이 아니라 시각 디자인 요소이므로 정책 영향 없음.) 사용자가 향후 명시적으로 자막을 요청해도 **이 Skill 의 default 는 OFF** 이며, 그 경우만 별도 라운드로 처리.
- **TTS 기본값**: voice `ko-KR-HyunsuMultilingualNeural`, rate `+10%`. 사용자 인자로 override 가능 (예: `ko-KR-InJoonNeural`, `--rate=+5%`).

## 9. 완료 후 사용자에게 보여줄 형태

모든 단계 완료 후 한국어로 다음 요약을 출력:

```
완료. 산출물:
- videos/<courseId>/<lessonId>/00-objectives.md
- videos/<courseId>/<lessonId>/01-script.md
- videos/<courseId>/<lessonId>/02-audio/{voiceover.mp3, timestamps.json}
- videos/<courseId>/<lessonId>/03-composition/*.tsx
- videos/<courseId>/<lessonId>/04-out.mp4

video-director 리뷰: <pass | fail + 권고 단계>
<리뷰 본문 요약>

다음 단계 제안:
- 손볼 곳이 있으면: /make-codemong-video <courseId>/<lessonId> --from=<단계>
- 만족스러우면: 강의 페이지 임베드 (frontend-developer 호출, lessonId 지정 필요)
```

리뷰 결과가 fail 이면 자동으로 재실행하지 말고 사용자 결정 기다림. 첫 라운드는 거의 항상 손봐야 한다는 점을 다시 한 번 안내.
