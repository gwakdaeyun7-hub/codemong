# CodeMong 영상 품질 누적 룰북

영상 한 편을 리뷰하면서 발견된 시각·발음·타이밍 이슈를 **다음 영상에서 반복하지 않도록** 박는 누적 룰북. 단일 진실원천 (SSOT).

- **참조**: `video-director` 에이전트가 단계 6 리뷰에서 P3 카테고리로 점검. `make-codemong-video` skill 단계 4에서 자동 호출.
- **새 룰 추가 시**: 아래 형식에 맞춰 ID 다음 번호로 append. 기존 룰 제거는 `Status: DEPRECATED` 표시만 (히스토리 보존).
- **룰 카테고리**:
  - **G** (Grep-able) — 코드 텍스트 grep으로 자동 점검 가능
  - **R** (Review) — director 가 시각적으로 확인
  - **N** (Narration) — 대본 텍스트 패턴

---

## R-001 — 콘솔 결과 fontSize 는 입력값과 비례 (1.5× 이내)

- **Category**: G
- **Status**: ACTIVE
- **Origin**: 2026-05-15, lesson-4 Scene03 (영상 50초 시점)

**Why**: lesson-4 Scene03 의 ConsoleResultSwap 에서 입력값 `3`/`5` 는 `ConsoleLine` 본문 폰트(`fontSize: 30`) 였는데 결과 `35` / `8` 은 별도 `fontSize: 44` 로 박혀 약 1.47× 컸음. 사용자가 "다른 숫자들에 너무 크다" 지적. 같은 콘솔 안에서 입력/출력 글자 크기가 1.5× 이상 차이나면 결과가 압도적으로 커 보여 부자연스럽다.

**How to apply** (grep):
- `ConsolePanel` 안에 `fontSize: N` 의 큰 값(예: 40+)이 있으면 → 같은 `ConsolePanel` 안 `ConsoleLine` 본문 fontSize(보통 `primitives.tsx` 의 `ConsolePanel` 기본 `fontSize: 30`) 와 비교.
- 비율이 1.5× 초과면 fail. 결과 강조는 색상(`colors.darkAccent` / `colors.danger`) + `fontWeight: 800` 으로 처리하고, 크기는 입력값 × 1.0 ~ 1.3 범위에 둘 것.

**Good**:
```tsx
<span style={{ color: colors.darkAccent, fontSize: 32, fontWeight: 800, fontFamily: fonts.mono }}>
  35
</span>
```

**Bad**:
```tsx
<span style={{ color: colors.darkAccent, fontSize: 44, fontWeight: 800, fontFamily: fonts.mono }}>
  35  {/* ConsoleLine fontSize 30 대비 1.47× — 너무 큼 */}
</span>
```

---

## R-002 — swap timing 은 두 div 동시 노출 금지 (fade-out 완료 후 buffer)

- **Category**: G
- **Status**: ACTIVE
- **Origin**: 2026-05-15, lesson-4 Scene03 (영상 55초 시점)

**Why**: lesson-4 Scene03 의 결과 swap (`35` → `8`) 에서 fade-out `[24, 25]` 끝나는 시점에 fade-in `[25, 25.5]` 가 동시 시작되어, 영상 압축/디스플레이 잔상으로 "[출력]" 텍스트가 두 줄로 보인다는 사용자 지적. 같은 좌표 absolute 위치에 두 div 가 opacity 로만 swap 되면 fade 구간이 겹치면 안 된다.

**How to apply** (grep):
- 같은 `position: absolute, top: X, left: Y` 좌표에 있는 두 element 가 opacity 로 swap 될 때:
  - 1번 element fade-out 끝나는 시점 < 2번 element fade-in 시작 시점 ← 0.2초 이상 gap 필요
  - 예: `interpolate(frame, [24*fps, 24.5*fps], [1, 0])` 종료 후 `interpolate(frame, [24.7*fps, 25.1*fps], [0, 1])` 시작 (0.2초 buffer)
- fade-out 과 fade-in 의 frame 범위가 단 1 frame 이라도 겹치면 fail. 같은 시점 (예: `[..., 25*fps]` 와 `[25*fps, ...]`) 도 fail (잔상 보임).

**Good**: 
```tsx
const opacityOld = interpolate(frame, [24*fps, 24.5*fps], [1, 0], { ... });  // 끝: 24.5s
const opacityNew = interpolate(frame, [24.7*fps, 25.1*fps], [0, 1], { ... }); // 시작: 24.7s (0.2s gap)
```

**Bad**:
```tsx
const opacityOld = interpolate(frame, [24*fps, 25*fps], [1, 0], { ... });    // 끝: 25s
const opacityNew = interpolate(frame, [25*fps, 25.5*fps], [0, 1], { ... });  // 시작: 25s (gap 없음 — 잔상)
```

---

## R-003 — 우측 카드는 페이지 끝에 너무 붙지 않게 (padding 비대칭 허용)

- **Category**: R
- **Status**: ACTIVE
- **Origin**: 2026-05-15, lesson-4 Scene04 (영상 1:39 시점)

**Why**: lesson-4 Scene04 에서 좌측 표 + 우측 예시 카드 2개 구성. `padding: "120px 80px 60px"` 좌우 동일 80px 인데 우측 카드(width 380)가 페이지 우측 끝(1920px)에 80px만 떨어져 답답해 보였음. 사용자가 "너무 오른쪽에 있다" 지적. 좌측이 표 + 정렬 여백으로 시각 무게가 있다면, 우측은 비대칭 padding으로 안쪽으로 당기는 게 자연스럽다.

**How to apply** (review):
- 영상 1920×1080 가로 기준, scene 컨테이너의 `padding: "T R B L"` 검토:
  - 우측 단일 카드(width ≤ 500) 가 있고 좌측엔 큰 표/패널이 있다면 → 우측 padding ≥ 160 (좌측 80 일 때) 권장
  - 좌·우 동일 padding 80 + flex 안에 폭 차이가 크면 시각 무게 우측 끝으로 쏠림
- director 리뷰 시 우측 카드의 우측 여백을 좌측 무게와 비교해 검증.

**Good** (lesson-4 Scene04 v4):
```tsx
padding: "120px 200px 60px 80px"  // 좌 80, 우 200 — 우측 카드 안쪽으로
```

**Bad** (lesson-4 Scene04 v3):
```tsx
padding: "120px 80px 60px"  // 좌우 동일 80 — 우측 카드 페이지 끝에 붙음
```

---

## R-004 — Active Recall 정답 reveal 은 narration 발화 시점에 동기

- **Category**: G
- **Status**: ACTIVE
- **Origin**: 2026-05-15, lesson-4 Scene05 (영상 1:57 시점)

**Why**: lesson-4 Scene05 (Active Recall — `2+3*4` 예측) 에서 정답 `14` 가 `revealAtSec={9.0}` 으로 박혀, narration "정답은 14입니다" 가 발화되기 전(s05.a0 끝나는 시점 ≈ 8.928s 직후)에 답이 떠버림. 사용자가 "정답이 정답을 말하는 타이밍에 맞게 뜨도록" 요청. Active Recall 의 핵심은 "학습자가 답을 말하기 전 잠깐 멈추기" — 정답 reveal 시점이 narration 의 "정답은 X" 발화와 정확히 동기되어야 학습 효과 유지.

**How to apply** (grep + audio probe):
- `02-audio/_scenes/sNN.a0.mp3`, `sNN.s1.mp3`, `sNN.a2.mp3` sub-clip 이 존재하는 scene (= Active Recall scene) 에서:
  - a0 길이 = silence 직전까지 (질문 발화)
  - s1 길이 = 정적 (생각 시간)
  - a2 길이 = 정답+풀이 발화
- `QuestionBox` 또는 swap-style reveal 컴포넌트의 `revealAtSec` 값이 다음 범위에 있어야:
  - `revealAtSec ≥ (a0.duration + s1.duration + 0.3)` ← a2 시작 후 "정답은" 발화 시작 즈음
  - `revealAtSec ≤ (a0.duration + s1.duration + a2.duration × 0.25)` ← a2 의 첫 1/4 안 ("정답은 X입니다" 마무리 직전까지)
- 범위 벗어나면 fail. ffprobe 로 sub-clip 길이 측정해서 검증.

**Good** (lesson-4 Scene05 v4):
```tsx
// s05.a0=8.928s, s05.s1=2.037s → a2 시작=10.965s, "14" 발화≈11.5s
<QuestionBox revealAtSec={11.5} answer="14" ... />
```

**Bad** (lesson-4 Scene05 v3):
```tsx
<QuestionBox revealAtSec={9.0} answer="14" ... />  // a0 끝나기도 전(8.928s) 직후 — 너무 일찍
```

---

## R-005 — scale pulse 는 의미 있는 비트에만, 단순 강조는 정적으로

- **Category**: R
- **Status**: ACTIVE
- **Origin**: 2026-05-15, lesson-4 Scene06 (영상 2:19 시점)

**Why**: lesson-4 Scene06 의 라벨 카드 "비교의 결과는 True/False 라는 **값**" 에서 "값" 한 글자가 `EmphasisPulse atSec={17.0} scaleAmp={0.25}` 로 1초간 커졌다 작아짐. 사용자가 "값이 커졌다가 작아지는 모션은 의미가 없는 거 같다" 지적. scale pulse 는 "여기 주목" 신호인데, 이미 색상(`colors.accent`) + 굵기(`fontWeight: 800`) + 큰 fontSize(26) 로 강조되어 있는 단어를 또 모션으로 강조하면 의미가 중복되고 어색하다.

**How to apply** (review):
- 단일 단어 / 짧은 토큰에 걸린 `<EmphasisPulse>` 가 *이미 다음 시각 강조 중 2개 이상*과 함께 쓰이는 경우 → 제거 후보:
  1. 색상 액센트 (예: `color: colors.accent`)
  2. 굵기 (예: `fontWeight: 800`)
  3. 크기 (주변 글자보다 큰 fontSize)
  4. 박스/border 강조
- 위 중 2개 이상 이미 있는데 pulse 까지 추가하면 fail (의미 중복). pulse 는 *모션 없이 강조되지 않는* 토큰을 짧게 띄울 때만 사용.
- 비트 의미가 있는 경우 (예: narration "정답은 X" 발화 시점에 답 박스 펄스) 는 OK.

**Good** (정적 강조):
```tsx
<span style={{ color: colors.accent, fontWeight: 800, fontSize: 26 }}>값</span>
```

**Bad** (중복 강조 + 의미 없는 모션):
```tsx
<EmphasisPulse atSec={17.0} scaleAmp={0.25}>
  <span style={{ color: colors.accent, fontWeight: 800, fontSize: 26 }}>값</span>
</EmphasisPulse>
```

---

## R-006 — SplitColumn 류 컨테이너는 FadeIn 에 style 직접 전달 (flex:1 parent flex 작동)

- **Category**: G
- **Status**: ACTIVE
- **Origin**: 2026-05-15, lesson-4 Scene07 (영상 2:37 시점)

**Why**: lesson-4 Scene07 의 `SplitColumn` 이 `<FadeIn><div style={{ flex: 1, ... }}>...</div></FadeIn>` 구조였는데, FadeIn outer div 가 부모 flex 컨테이너의 flex:1 을 받지 못해 두 컬럼이 페이지 좌측에 차곡차곡 쌓이고, 박스가 "하나는 왼쪽 / 하나는 중앙" 처럼 보였음. 사용자가 가로 등간격 + 세로 통일 요청. FadeIn 으로 감싼 컬럼이 부모 flex 의 grow/shrink 를 받으려면, flex 스타일이 FadeIn outer div 에 직접 적용되어야 한다.

**How to apply** (grep):
- 부모가 `display: "flex"` 인 컨테이너 안에 자식 컴포넌트가 `<FadeIn><div style={{ flex: 1, ... }}>...</div></FadeIn>` 형태로 있으면 fail.
- FadeIn 컴포넌트는 `style?: React.CSSProperties` prop 을 받아 outer div 에 적용함 (`primitives.tsx` 의 FadeIn 시그니처 확인). 즉 다음 형태로 리팩토링:

**Good**:
```tsx
<FadeIn delaySec={delaySec} translateY={20} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
  <div>{title}</div>
  {children}
</FadeIn>
```

**Bad**:
```tsx
<FadeIn delaySec={delaySec} translateY={20}>
  <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
    {/* flex:1 이 FadeIn 의 outer div 가 아닌 안쪽 div 에 박혀 부모 flex 가 안 작동 */}
    <div>{title}</div>
    {children}
  </div>
</FadeIn>
```

추가 — split layout 의 좌·우 박스 본체가 세로 중심 일치하려면 각 컬럼 안 묶음의 *외부 높이* 가 같아야 한다. 한쪽은 라벨+박스(높이 a) 인데 다른 쪽은 박스만(높이 b) 이면, `justifyContent: center` 가 박스 중심이 아닌 묶음 중심을 정렬하므로 박스 중심이 어긋난다. 부족한 쪽에 spacer(`<div style={{ height: <차이>, ... }} aria-hidden />`) 를 박아 외부 높이를 맞춘다.

---

## R-007 — 한국어 발음 우회: TTS 가 잘못 읽는 단어는 narration 표기를 발음형으로

- **Category**: N
- **Status**: ACTIVE
- **Origin**: 2026-05-15, lesson-4 Scene11 (영상 4:23 시점)

**Why**: lesson-4 s11 narration "이 네 단계가 한 호흡으로 묶입니다" 에서 Edge TTS `ko-KR-HyunsuMultilingualNeural` 가 "묶입니다" 를 표준 발음 [무낍니다] 가 아닌 [무깁니다] 로 잘못 발음. 한국어 격음화·연음 규칙을 TTS 가 일관되게 처리하지 않는 단어가 가끔 발생. `_synth.py` 가 `pronunciation.json` 을 자동 치환하지 않으므로(현재 정책), narration 표기 자체를 발음형으로 적어 우회한다.

**How to apply** (narration review):
- 합성 후 voiceover.mp3 청취 단계에서 잘못 발음된 단어 발견 시:
  1. 표준 발음을 확인 (예: "묶입니다" → [무낍니다])
  2. narration 표기를 발음형으로 직접 적기 (예: "묶입니다" → "무낍니다"). 의미 손실이 작은 자연어 대체(예: "이어집니다") 가 가능하면 그쪽이 더 깔끔.
  3. `videos/_assets/pronunciation.json` 에도 등록 (future-proof reference — 다른 lesson 작성자가 같은 단어 만나면 참고).
  4. 합성 다시 (`py videos/<courseId>/<lessonId>/02-audio/_synth.py`).
- **표기 비표준이라도 OK** — narration 텍스트는 화면에 노출되지 않으므로 발음 정확성이 우선.
- **사전이 자동 치환되지 않음을 명심** — 사전 등록만으로는 합성 결과 안 바뀜. narration text 자체를 바꿔야 한다.

**Good** (lesson-4 s11 v4):
```
... 이 네 단계가 한 호흡으로 무낍니다. ...
```

**Bad** (lesson-4 s11 v3):
```
... 이 네 단계가 한 호흡으로 묶입니다. ...   // TTS [무깁니다] 잘못 발음
```

---

## 룰 추가 가이드 (앞으로 영상 수정 시)

1. 한 영상을 수정한 후 *재발할 수 있는 패턴* 이면 룰로 박는다. 일회성 미스 (예: 오타) 는 룰 아님.
2. ID 는 `R-NNN` 직선 증가, 사용자 합의 없이 ID 재사용 / 재배치 금지.
3. 각 룰엔 반드시 **Origin** (어느 lesson 의 어느 시점에서 발견됐는지) 명시 — 룰의 출처가 추적 가능해야 미래에 deprecate 판단 가능.
4. **Category 분포 목표**:
   - G (grep-able) — 자동 점검 가능한 룰을 우선. `video-director` 가 fast-scan 으로 잡음.
   - R (review) — 시각 감각이 필요한 룰. director 가 영상 보면서 확인.
   - N (narration) — 대본/TTS 패턴.
5. 룰 deprecate: `Status: DEPRECATED (yyyy-mm-dd)` + 이유 한 줄. 본문은 보존 (히스토리).
6. **새 영상 만들 때**: `make-codemong-video` skill 의 단계 4 (디렉터 리뷰) 가 자동으로 이 파일을 읽고 ACTIVE 룰 전체에 대해 영상 점검. director 가 한 개라도 위반 잡으면 fail + 권고 단계 (`--from=03-composition` 등) 안내.
