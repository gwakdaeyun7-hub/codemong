# Python lesson-1 Pool B 제작 명세서

> programming-language-education-expert 에이전트가 받아서 20문항을 한 번에 작성할 수 있도록 자체 컨테인된 작업 명세.

---

## 1. 컨텍스트

CodeMong 1강 (파이썬 개요 & 개발환경) 평가 문제는 두 풀로 운영:

- **Pool A (10문항, 기존)** — 강의 직후 모든 학습자에게 동일 노출. base mastery 측정. `pool: "evaluation"`.
- **Pool B (20문항, 본 작업)** — 학습자에게 직접 노출되지 않음. 추천 시스템이 Pool A 결과로 산출한 약점 벡터(M-vector)에 따라 동적으로 매칭하여 "복습/약점 보강" 으로 제공. `pool: "practice"`.

추천 알고리즘은 다음 시그널을 사용:
- 진단된 `misconceptionId` (학습자가 어느 보기에서 막혔는가)
- `isomorphGroup` (같은 학습목표를 다른 surface 로 묻는 묶음 — 한 학습자에게 같은 그룹 두 번 안 줌)
- `difficulty` / `scope` (적응형 난이도, in-lesson → applied 전이 측정)

**중요**: Pool B 는 학습자에게 "강의 평가" 가 아니라 "복습/연습" 으로 제시될 것이므로, 톤은 평가가 아닌 **친근한 점검** 으로 살짝 부드럽게.

---

## 2. 스키마 (변경 금지)

`lib/quiz-content.ts` 의 `QuizQuestion` 타입을 그대로 사용. 모든 신규 문항은 다음 두 필드 필수:

```ts
pool: "practice"        // 모든 q11~q30 문항 동일
isomorphGroup: string   // 슬롯 표(§5)에 명시된 값 사용
```

- ID 네이밍: `lesson-1-q11` ~ `lesson-1-q30`
- 모든 오답 옵션에 `misconceptionId` 라벨 필수 (정답 옵션에는 X)
- 단답형은 `disallowedAnswers` 에 자주 나올 오답을 라벨링 (단순 오타·진단 정보 없는 것은 라벨 생략 OK — Pool A q7 의 "최신 버전" 패턴 참조)
- 1강 오개념 카탈로그 M1~M11 은 `lib/quiz-content.ts:53-109` 그대로 재사용. 신규 M 추가 금지 (Pool B 가 카탈로그 확장 권한이 없도록 — 추적 일관성).

---

## 3. 톤·카피 규약 (CodeMong 표준)

- 한국어. 입문자 친화·정직.
- "쉬워요!" / "간단합니다!" / 이모지 — 금지.
- 강의 본문 어휘 그대로 사용 (예: "파이썬", "VS Code", "터미널", "PATH").
- explanation 은 1~2줄. 왜 정답이 정답이고 왜 오답이 오답인지 핵심 한 가지.
- applied 시나리오는 본문 시나리오(`hello.py` / `study.py` / "친구가 VS Code 설치") 와 **다른 새 맥락** 사용 — 학습자가 단순 암기로 풀지 못하도록.

---

## 4. 분포 목표 (양적)

| 차원 | Pool A (참고) | Pool B 목표 | 이유 |
|------|--------------|------------|------|
| 난이도 | easy 4 / med 3 / hard 3 | **easy 4 / med 10 / hard 6** | easy 는 변별력 낮음. medium 비중 ↑로 추천 시스템 신호 강화. |
| 타입 | MC 8 / SA 2 | **MC 12 / SA 8** | 단답형은 추측 차단 → 진짜 이해 측정. |
| Scope | in-lesson 7 / applied 3 | **in-lesson 5 / applied 15** | Pool B 는 전이(transfer) 측정 위주. 새 시나리오로 일반화 능력 진단. |

---

## 5. 오개념 커버리지 매트릭스

Pool A 에서 진단되는 dominant M 횟수 + Pool B 추가 슬롯 수:

| M | 라벨 | Pool A | Pool B 추가 | 비고 |
|---|------|--------|------------|------|
| M1 | Python ≠ VS Code | 2 | **+3** | 가장 흔한 입문자 오개념. surface 다양화 핵심. |
| M2 | PATH 의미 | 1 | **+3** | applied 시나리오로 진단. |
| M3 | --version 명령 | 1 | **+2** | 다른 명령어 (-V, --help) 와 헷갈림 잡기. |
| M4 | 확장자 | 1 | **+2** | 새 파일명 시나리오. |
| M5 | 저장-실행 | 1 | **+3** | 코어 매커니즘. transfer 풍부. |
| M6 | Python 2/3 | 1 | **+1** | |
| M7 | 설치 출처 | 1 | **+2** | 다른 비공식 도메인 변형. |
| M8 | 활용처 협소화 | 0 | **+2** | Pool A 미사용 — Pool B 가 처음 진단. |
| M9 | 카테고리 오해 | 부분 | **+1** | dominant 진단 1개. |
| M10 | 가짜 명령어 | 부분 | **+1** | dominant 진단 1개. |
| M11 | 별도 사이트 혼동 | 부분 | **0** | distractor 라벨로만 사용. |
| **합계** | | 9 dominant | **+20** | |

---

## 6. 슬롯 20개 (q11~q30)

각 슬롯에 작성 hint 한 줄. 실제 prompt/options/explanation 은 에이전트 자유 설계.

| ID | M | iso­morph­Group | Diff | Type | Scope | 작성 hint |
|----|---|----------------|------|------|-------|----------|
| q11 | M1 | `lesson-1-python-vs-vscode` | medium | MC | applied | VS Code 의 Run 버튼이 실제 누구를 호출하는지 묻는다 (인터프리터 분리). |
| q12 | M1 | `lesson-1-python-vs-vscode` | easy | SA | in-lesson | "파이썬은 ___, VS Code 는 ___" 빈칸 채우기. allowedAnswers 에 "언어, 도구" / "프로그래밍 언어, 에디터" 등 변형. |
| q13 | M1 | `lesson-1-editor-agnostic` (신규) | medium | MC | applied | 메모장이나 다른 에디터로 일반화. "VS Code 가 아니어도 파이썬 코드를 쓸 수 있는가?" |
| q14 | M2 | `lesson-1-path` | hard | MC | applied | 다른 OS (맥) 시나리오 또는 PATH 추가했는데도 인식 안 되는 케이스 (재시작 누락). |
| q15 | M2 | `lesson-1-path-meaning` (신규) | medium | SA | in-lesson | "PATH 는 ___ 가 명령을 찾을 위치 목록이다." 빈칸. allowed 에 "터미널" / "쉘" / "운영체제". |
| q16 | M2 | `lesson-1-path` | medium | MC | applied | PATH 미체크 상태에서 발생할 수 있는 증상 식별. distractor 에 "VS Code 가 안 켜진다"(M1) 섞기. |
| q17 | M3 | `lesson-1-version-check` | medium | MC | applied | 같은 목적으로 쓰는 짧은 형태 `python -V`. distractor 에 `--update`, `--install`(M3). |
| q18 | M3 | `lesson-1-version-check` | hard | SA | applied | 출력이 `Python 3.12.5` 일 때 "이 결과는 무엇을 의미하는가?" 단답. allowed 에 "설치 확인" / "버전 확인". |
| q19 | M4 | `lesson-1-extension` | medium | MC | applied | `.py` 가 아닌 다른 확장자로 저장한 파일을 `python` 으로 실행하면 무슨 일이 생기는가. |
| q20 | M4 | `lesson-1-extension` | easy | SA | in-lesson | "`hello.world` 라는 파일은 파이썬 코드 파일인가?" 단답. allowed: "아니다" / "아니오" / "X". disallowed: "맞다"(M4). |
| q21 | M5 | `lesson-1-save-execute` | hard | MC | applied | 새 시나리오: VS Code 에서 코드 고치고 Ctrl+S 안 누른 상태로 터미널 재실행. "이전 파일이 출력된다" 진단. |
| q22 | M5 | `lesson-1-save-execute` | medium | SA | applied | "코드를 고친 뒤 실행 전에 반드시 해야 할 한 가지" 단답. allowed: "저장" / "Ctrl+S" / "파일 저장". |
| q23 | M5 | `lesson-1-save-execute-cause` (신규) | hard | MC | applied | 인과 추론 — 친구가 "분명 고쳤는데 결과가 안 바뀐다" 라고 할 때 가장 먼저 의심할 것. |
| q24 | M6 | `lesson-1-py3` | medium | MC | applied | 검색 결과에서 "Python 2 강의" 와 "Python 3 강의" 중 골라야 할 때 추천 + 이유. |
| q25 | M7 | `lesson-1-official-source` | medium | MC | applied | 광고로 뜬 `python-download.com` 클릭 여부. distractor 에 pypi.org(M11) 섞기. |
| q26 | M7 | `lesson-1-official-source` | hard | SA | applied | 도메인 후보 4개 중 공식 하나를 적기. allowed: python.org. disallowed 에 .com / .io / .co.kr / pypi.org (각각 M7/M11 라벨). |
| q27 | M8 | `lesson-1-python-domain` (신규) | easy | MC | in-lesson | "파이썬은 어떤 분야에서만 쓰는가?" — 정답: "분야 제한 없이 다양하게 쓰인다". 오답 = M8 (AI 전용 / 게임 전용 / 웹 전용). |
| q28 | M8 | `lesson-1-python-domain` | medium | MC | applied | 데이터 분석을 하려는 친구에게 "파이썬은 AI 전용이라 안 된다" 라는 잘못된 조언 식별. |
| q29 | M9 | `lesson-1-python-identity` | easy | SA | in-lesson | "파이썬은 다음 중 어디에 속하는가? (운영체제 / 프로그래밍 언어 / 웹 브라우저 / 사무용 프로그램)" 단답. |
| q30 | M10 | `lesson-1-run-command` | hard | SA | applied | 터미널에서 `chat.py` 실행 명령. allowed: `python chat.py` / `python3 chat.py`. disallowed: `run chat.py`(M10), `execute chat.py`(M10), `chat.py`(라벨 없음). |

---

## 7. 작성 규칙 체크리스트 (검수 포인트)

문항을 다 작성한 뒤 자체 점검:

- [ ] 모든 q11~q30 에 `pool: "practice"` + `isomorphGroup` 존재
- [ ] 모든 오답 옵션에 `misconceptionId` 라벨 (정답에는 X)
- [ ] 단답형 `allowedAnswers` 가 한국어/영어/공백/대소문자 변형을 합리적으로 커버
- [ ] 단답형 `disallowedAnswers` 의 진단 정보가 있는 표기에만 `misconceptionId` 부여 (정보 없는 표기는 라벨 생략)
- [ ] applied 시나리오가 본문/Pool A 시나리오(`hello.py` / `study.py` / "친구가 VS Code 설치 후") 와 다른 새 맥락
- [ ] 같은 isomorphGroup 안의 두 문항이 prompt 표면이 거의 똑같지 않음 (한쪽은 객관식, 한쪽은 단답형이거나 시나리오를 바꾸는 식)
- [ ] explanation 은 1~2줄. 어휘는 강의 본문 그대로.
- [ ] "쉬워요!" / 이모지 / 과장 없음.
- [ ] §4 분포 목표 충족 (난이도 4/10/6, 타입 12/8, scope 6/14)
- [ ] §5 오개념 매트릭스 합계가 +20 슬롯과 일치

---

## 8. 산출물

- `lib/quiz-content.ts` 의 `pythonLesson1Quiz` 배열 끝에 q11~q30 을 append.
- 같은 파일 다른 곳 손대지 않음 (Pool A 마킹은 본 명세 작업과 별개로 이미 완료됨).
- 신규 isomorphGroup ID 5개 (`lesson-1-editor-agnostic`, `lesson-1-path-meaning`, `lesson-1-save-execute-cause`, `lesson-1-python-domain`, `lesson-1-python-identity`) 가 §6 슬롯 표대로 등장하는지 확인.

작성 완료 후 빌드 실패 시 — `pnpm tsc --noEmit` 은 fresh state 에서 실패 가능 (CLAUDE.md Troubleshooting 참조). `pnpm dev` 한 번 실행 → 종료 → typecheck 순서.
