# Python lesson-2 Pool B 제작 명세서

> programming-language-education-expert 에이전트가 받아서 20문항을 한 번에 작성할 수 있도록 자체 컨테인된 작업 명세.

---

## 1. 컨텍스트

CodeMong 2강 (코딩의 표현 방법 — 자연어/의사코드/순서도) 평가 문제는 두 풀로 운영:

- **Pool A (10문항, 기존)** — 강의 직후 모든 학습자에게 동일 노출. base mastery 측정. `pool: "evaluation"`.
- **Pool B (20문항, 본 작업)** — 학습자에게 직접 노출되지 않음. 추천 시스템이 Pool A 결과로 산출한 약점 벡터(M-vector)에 따라 동적으로 매칭하여 "복습/약점 보강" 으로 제공. `pool: "practice"`.

추천 알고리즘이 사용하는 시그널·정책은 1강 명세서 §1 와 동일.

**2강 고유 도전**: 주제가 "표현 방법의 차이" 라는 추상적 메타 — 1강(설치/실행) 보다 applied 시나리오 표면이 좁음. 같은 결제 시나리오 반복 금지, **새 시나리오 표면**(자판기, 도서관 게이트, 지도 길찾기, ATM, 출퇴근 카드 등)을 슬롯별로 다르게 배치.

---

## 2. 스키마 (변경 금지)

`lib/quiz-content.ts` 의 `QuizQuestion` 타입 그대로. 모든 신규 문항:

```ts
pool: "practice"        // q11~q30 동일
isomorphGroup: string   // §6 슬롯 표 참조
```

- ID 네이밍: `lesson-2-q11` ~ `lesson-2-q30`
- 모든 오답 옵션에 `misconceptionId` 라벨 필수 (정답에는 X)
- 단답형 `disallowedAnswers` — 진단 정보 있는 표기에만 라벨
- 2강 오개념 카탈로그 M1~M10 (`lib/quiz-content.ts:292-343`) 그대로 재사용. 신규 M 추가 금지.

---

## 3. 톤·카피 규약 (CodeMong 표준)

- 한국어. 입문자 친화·정직.
- "쉬워요!" / 이모지 / 과장 — 금지.
- 강의 본문 어휘 그대로 사용 (예: "자연어", "의사코드", "순서도", "마름모", "분기").
- explanation 1~2줄. 왜 정답이 정답이고 왜 오답이 오답인지 핵심 한 가지.
- applied 시나리오는 본문/Pool A 시나리오(편의점 음료 결제 시나리오) 와 **다른 새 맥락** 사용 — 슬롯별로 시나리오를 다르게(자판기, 도서관 게이트, 지도 길찾기, ATM 출금, 카페 주문 등).

---

## 4. 분포 목표 (양적)

| 차원 | Pool A (참고) | Pool B 목표 | 이유 |
|------|--------------|------------|------|
| 난이도 | easy 4 / med 3 / hard 3 | **easy 4 / med 10 / hard 6** | medium 비중 ↑로 변별력 확보. |
| 타입 | MC 8 / SA 2 | **MC 12 / SA 8** | 단답형은 추측 차단. |
| Scope | in-lesson 7 / applied 3 | **in-lesson 6 / applied 14** | Pool B 는 전이(transfer) 측정 위주. |

---

## 5. 오개념 커버리지 매트릭스

Pool A 의 dominant M 횟수 + Pool B 추가:

| M | 라벨 | Pool A | Pool B 추가 | 비고 |
|---|------|--------|------------|------|
| M1 | 의사코드 = 진짜 코드 착각 | 3 (q3, q6, q10) | **+3** | main, 가장 강력하게 진단해야. |
| M2 | 판단 기호 한 방향 분기 | 1 (q8) | **+2** | main, 시각 단서 보강. |
| M3 | 빠진 단계 자동 채움 기대 | 1 (q9) | **+2** | main, 새 시나리오 다양화. |
| M4 | 셋 중 우열 가리기 | 1 (q7) | **+2** | main, 메타 인식 강화. |
| M5 | 표현 단계 생략 | 1 (q1 부분) | **+3** | supp 이지만 메타 인식 핵심. |
| M6 | 단계 순서 오해 | 1 (q1 부분) | **+1** | |
| M7 | 도형 ↔ 역할 매칭 오류 | 1 (q5) | **+2** | supp 이지만 학습자가 자주 틀림. |
| M8 | 기호의 시각적 의미 무시 | 0 dominant | **+1** | Pool A 에서 distractor 로만 등장 → Pool B 가 dominant 진단. |
| M9 | 의사코드 = 영어 강제 | 0 dominant | **+2** | Pool A 에서 distractor 로만 → Pool B 가 처음 진단. |
| M10 | 자연어/의사코드 형식 혼동 | 0 dominant | **+2** | Pool A 에서 distractor 로만 → Pool B 가 처음 진단. |
| **합계** | | 9 dominant | **+20** | |

**중요**: M8/M9/M10 은 Pool A 에서 dominant 진단 슬롯이 0 — Pool B 가 메인 진단 풀이 됨. 슬롯 hint 가 그것을 잘 진단하도록 설계되어 있음.

---

## 6. 슬롯 20개 (q11~q30)

| ID | M | iso­morph­Group | Diff | Type | Scope | 작성 hint |
|----|---|----------------|------|------|-------|----------|
| q11 | M1 | `lesson-2-pseudocode-vs-code` (신규) | easy | MC | in-lesson | "의사코드를 파이썬이 그대로 실행할 수 있는가?" 빠른 회상. distractor 에 "들여쓰기만 맞으면 OK"(M9 변형), "한국어라 안 됨"(M9). |
| q12 | M1 | `lesson-2-pseudocode-vs-code` | medium | SA | applied | "`만약 가격이 5000보다 크면:` 한 줄을 그대로 .py 로 저장 후 `python file.py` 실행하면?" 단답. allowed: "오류" / "에러" / "SyntaxError" / "실행 안 됨". disallowed: "그대로 실행됨"(M1), "5000 출력"(M1). |
| q13 | M1 | `lesson-2-pseudocode-vs-code` | hard | MC | applied | 친구가 의사코드 메모를 카톡으로 보내면서 "이거 돌려봐" 라고 함. 가장 정확한 답변. distractor 에 M1, M9. |
| q14 | M2 | `lesson-2-decision-branch` | medium | MC | applied | 새 시나리오 (도서관 출입 게이트 또는 ATM). 마름모에 "예" 만 있는 그림. 무엇이 잘못됐나. distractor 에 M7 (도형 매칭 오류) 섞기. |
| q15 | M2 | `lesson-2-decision-branch-fix` (신규) | hard | SA | applied | 같은 종류 시나리오에서 "마름모에서 빠진 것은 무엇인가?" 단답. allowed: "아니오 화살표" / "다른 분기" / "False 방향" / "거짓일 때 화살표". disallowed: "사각형"(M7), "값"(라벨 없음). |
| q16 | M3 | `lesson-2-implicit-step` | medium | MC | applied | 새 시나리오 (자판기): "1) 음료 고름 2) 돈 넣음 3) 음료 받음". 빠진 암묵 단계 식별 (가격 확인 또는 거스름돈 확인). distractor 에 "컴퓨터가 알아서 채운다"(M3). |
| q17 | M3 | `lesson-2-implicit-step` | hard | MC | applied | 새 시나리오 (지도 길찾기): "1) 출발지 입력 2) 도착지 입력 3) 길찾기". 빠진 단계 (결과 표시 / 거리 계산). distractor 에 M3, M5. |
| q18 | M4 | `lesson-2-three-equal` | easy | SA | in-lesson | "자연어, 의사코드, 순서도 중 가장 좋은 표현은?" 단답. allowed: "정답 없음" / "용도가 다르다" / "상황에 따라 다르다" / "셋 다 안 쓸 수도 있다". disallowed: "순서도"(M4), "의사코드"(M4), "자연어"(M4 변형). |
| q19 | M4 | `lesson-2-three-context-pick` (신규) | medium | SA | applied | "분기·반복이 복잡한 절차의 흐름을 한눈에 보고 싶을 때 가장 적합한 표현은?" 단답. allowed: "순서도". disallowed: "자연어"(M4), "의사코드"(M4). |
| q20 | M5 | `lesson-2-stage-existence` (신규) | easy | MC | in-lesson | "문제를 받자마자 코드부터 쓰는 행동의 가장 큰 문제는?" 정답 = 표현 단계 누락. distractor 에 M5 변형들. |
| q21 | M5 | `lesson-2-stage-order` | medium | SA | applied | 시나리오: 친구가 코드 작성 중 막힘. 빈칸: "자연어 → ___ → 순서도 → 코드". 단답. allowed: "의사코드" / "슈도코드" / "의사 코드". disallowed: "파이썬 코드"(M1), "주석"(라벨 없음). |
| q22 | M5 | `lesson-2-stage-existence` | hard | MC | applied | 시나리오: 친구가 30분째 코드만 헤매고 있음. 가장 정확한 조언. 정답 = "표현 단계로 돌아가서 자연어로 정리해보기". distractor 에 "더 빨리 타이핑해봐"(M5), "구글 검색해봐"(라벨 없음). |
| q23 | M6 | `lesson-2-stage-order` | medium | SA | applied | "코딩할 때 항상 자연어부터 시작해야 하는가?" 시나리오 단답. allowed: "아니다" / "상황에 따라 다르다" / "셋 다 안 쓸 수도 있다". disallowed: "그렇다"(M6), "순서도부터"(M6), "의사코드부터"(M6 변형). |
| q24 | M7 | `lesson-2-flowchart-shape-role` | medium | MC | applied | 새 시나리오 (출퇴근 카드 시스템) 의 순서도. 사각형 vs 평행사변형 차이 식별. 정답 = "처리 vs 입출력". distractor 에 M7. |
| q25 | M7 | `lesson-2-flowchart-input-output` (신규) | hard | SA | applied | 새 시나리오 (카페 주문) 에서 "사용자에게 주문 받기" 단계는 어떤 도형? 단답. allowed: "평행사변형" / "기울어진 사각형". disallowed: "사각형"(M7), "마름모"(M7). |
| q26 | M8 | `lesson-2-flowchart-shape-meaning` (신규) | medium | MC | in-lesson | "마름모의 갈라지는 모서리가 시각적으로 의미하는 것은?" 정답 = "흐름이 둘 이상으로 나뉜다". distractor 에 "그냥 디자인"(M8), "마름모는 정중앙에만 둔다"(M8 변형). |
| q27 | M9 | `lesson-2-pseudocode-language` (신규) | easy | MC | in-lesson | "한국어로 적힌 의사코드(`만약 ~ 이면:`) 도 의사코드인가?" 정답 = 그렇다. distractor 에 M9 (영어만 의사코드). |
| q28 | M9 | `lesson-2-pseudocode-language` | medium | SA | applied | 영어 의사코드(`IF price > 5000 THEN ...`) 와 한국어 의사코드(`만약 가격이 5000보다 크면 ...`) 를 보여주고 "둘 다 의사코드인가?" 단답. allowed: "그렇다" / "둘 다 의사코드" / "맞다". disallowed: "영어만"(M9), "한국어만"(M9 변형), "둘 다 아니다"(M1). |
| q29 | M10 | `lesson-2-nl-vs-pseudocode-form` (신규) | medium | MC | in-lesson | 줄글 자연어 vs 들여쓰기 의사코드의 형식 차이 식별. 정답 = "줄글 vs 형식 정돈된 표기". distractor 에 M10 (둘 다 줄글), M10 (둘 다 들여쓰기). |
| q30 | M10 | `lesson-2-nl-vs-pseudocode-form` | hard | MC | applied | 새 시나리오 (ATM 출금). 자연어/의사코드/순서도 셋이 섞인 보기 4개에서 "자연어가 아닌 것" 또는 "의사코드가 아닌 것" 식별. distractor 에 M10, M7. |

---

## 7. 작성 규칙 체크리스트 (검수 포인트)

문항 작성 후 자체 점검:

- [ ] 모든 q11~q30 에 `pool: "practice"` + `isomorphGroup` 존재
- [ ] 모든 오답 옵션에 `misconceptionId` 라벨 (정답에는 X)
- [ ] 단답형 `allowedAnswers` 가 한국어/영어/공백/대소문자 변형 합리적 커버
- [ ] 단답형 `disallowedAnswers` 의 진단 정보가 있는 표기에만 `misconceptionId` 부여
- [ ] applied 시나리오가 Pool A 의 편의점 결제 시나리오와 **다른 새 맥락** (자판기, 도서관 게이트, ATM, 지도, 카페 주문, 출퇴근 카드 등)
- [ ] 같은 isomorphGroup 안의 두 문항은 prompt 표면이 거의 똑같지 않음 (한쪽은 객관식, 한쪽은 단답형이거나 시나리오를 바꾸는 식)
- [ ] explanation 1~2줄. 어휘는 강의 본문 그대로.
- [ ] "쉬워요!" / 이모지 / 과장 없음.
- [ ] §4 분포 목표 충족 (난이도 4/10/6, 타입 12/8, scope 6/14)
- [ ] §5 오개념 매트릭스 합계 +20 일치
- [ ] M8/M9/M10 의 dominant 진단 슬롯 (Pool A 에서 0 dominant 였던) 이 §5 추가 수만큼 등장 — Pool B 가 카탈로그를 처음으로 dominant 진단

---

## 8. 산출물

- `lib/quiz-content.ts` 의 `pythonLesson2Quiz` 배열 끝에 q11~q30 을 append.
- 같은 파일 다른 곳 손대지 않음 (Pool A 마킹은 본 명세 작업과 별개로 이미 완료됨).
- 신규 isomorphGroup ID 8개 (`lesson-2-pseudocode-vs-code`, `lesson-2-decision-branch-fix`, `lesson-2-three-context-pick`, `lesson-2-stage-existence`, `lesson-2-flowchart-input-output`, `lesson-2-flowchart-shape-meaning`, `lesson-2-pseudocode-language`, `lesson-2-nl-vs-pseudocode-form`) 가 §6 슬롯 표대로 등장하는지 확인.
- 기존 isomorphGroup 5개 (`lesson-2-decision-branch`, `lesson-2-implicit-step`, `lesson-2-three-equal`, `lesson-2-stage-order`, `lesson-2-flowchart-shape-role`) 가 Pool A 의 같은 그룹 ID 와 정확히 일치하는지 확인 (Pool A 와 isomorph 매칭이 가능해야 추천 시스템이 작동).

작성 완료 후 빌드 실패 시 — `pnpm tsc --noEmit` 은 fresh state 에서 실패 가능 (CLAUDE.md Troubleshooting). `pnpm dev` 한 번 실행 → 종료 → typecheck.
