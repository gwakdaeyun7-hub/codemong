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

## R-008 — 좌우 분할 비교 카드는 동일 크기 (시각 차별화는 색상·border 만)

- **Category**: G
- **Status**: ACTIVE
- **Origin**: 2026-05-16, lesson-5 Scene05 (영상 0:54 시점)

**Why**: lesson-5 Scene05 의 `=` (left) vs `==` (right) 비교 컷에서 우측 카드의 `bigSymbolScale: 1.15` 로 큰 기호 글자가 1.15× 박혀 우측 카드 height 가 좌측보다 약 24px 컸음. 사용자 지적: "두 카드박스의 크기가 다른데 같게 수정해줘". 좌우 분할 비교는 "둘 다 동등한 무게의 개념"을 가르치는 시각 신호인데 한쪽이 크면 한쪽이 더 중요해 보여 의도 와해. 차별화는 색상(violet vs gray)·border 만으로 충분히 표현된다.

**How to apply** (grep):
- 좌우로 나란히 배치되는 두 박스(`ComparePanel` / `SideBySideBox` / 좌·우 column 등) 가 있을 때:
  - 두 박스의 `width` / `height` 가 명시 동일해야 함 (`width: 600, height: 500` 둘 다)
  - 큰 기호 / 타이틀 / 코드 박스 등 내부 element 의 `fontSize` 도 둘 다 동일 (scale prop 으로 한쪽만 키우지 말 것)
  - 차별화는 `color` (violet vs gray) + `border` (`2.5px solid accent` vs `2.5px solid border`) + `bgTint` 만 사용
- box height 가 명시 안 되어 있고 내부 content 로 자동 결정되는 경우, 양쪽 content 가 동일 height 가 아니면 fail → `height: <fixed>` + `justifyContent: center` 로 강제 정렬

**Good** (lesson-5 Scene05 v2):
```tsx
// 두 ComparePanel 모두 height: 500, bigSymbol fontSize: 160 동일
<ComparePanel bigSymbol="=" bigSymbolColor={colors.inkMuted} borderColor={colors.border} />
<ComparePanel bigSymbol="==" bigSymbolColor={colors.accentDeep} borderColor={colors.accent} />
```

**Bad** (lesson-5 Scene05 v1):
```tsx
<ComparePanel bigSymbol="=" bigSymbolScale={1.0} ... />    // height 자동
<ComparePanel bigSymbol="==" bigSymbolScale={1.15} ... />  // height 자동 → 우측 ~24px 더 큼
```

---

## R-009 — 코드 키워드·영문 식별자에 `textTransform: "uppercase"` 금지

- **Category**: G
- **Status**: ACTIVE
- **Origin**: 2026-05-16, lesson-5 Scene08 (영상 1:44 시점)

**Why**: lesson-5 Scene08 의 scene 제목 `` `if` · `elif` · `else` `` 가 `textTransform: "uppercase"` 로 박혀 화면에 `IF · ELIF · ELSE` 로 표시됨. 사용자 지적: "IF, ELIF, ELSE를 모두 소문자로 바꿔줘". Python (또는 JavaScript) 키워드는 소문자가 원본이며, 학습 영상에서 uppercase 로 박으면 학습자가 실제 코드 작성 시 `IF` 를 입력해 syntax error 를 만남. scene 제목/lower-third 등 강조용 텍스트에 uppercase 가 흔히 박히는데, 코드 토큰이 섞이면 사고 우회 안 됨.

**How to apply** (grep):
- 코드 키워드(`if|elif|else|for|while|return|def|class|import|from|as|in|not|and|or|True|False|None|null|undefined|var|let|const|function|async|await|try|catch|throw`) 또는 영문 식별자(snake_case, camelCase) 가 텍스트에 포함된 element 에 `textTransform: "uppercase"` 가 있으면 fail.
- 작은 라벨(scene 라벨 "오늘의 목표" 등 — 한국어 only) 에 uppercase 는 OK. 영문 토큰 0개일 때만 허용.
- 대체 강조: `letterSpacing` 약간 + `fontWeight: 700` + `color: accentDeep` 으로 visual emphasis.

**Good** (lesson-5 Scene08 v2):
```tsx
<div style={{ fontSize: 30, fontWeight: 600, color: colors.accentDeep, letterSpacing: "0.04em" }}>
  <span style={{ fontFamily: fonts.mono }}>if</span> · <span style={{ fontFamily: fonts.mono }}>elif</span> · <span style={{ fontFamily: fonts.mono }}>else</span>
</div>
```

**Bad** (lesson-5 Scene08 v1):
```tsx
<div style={{ ..., textTransform: "uppercase" }}>
  `if` · `elif` · `else`   {/* 화면엔 IF · ELIF · ELSE 로 표시 — 학습 혼동 */}
</div>
```

---

## R-010 — 콜아웃·말풍선은 원본 텍스트(코드 / 패널 header / 타이틀)와 겹치지 않게

- **Category**: R + G
- **Status**: ACTIVE
- **Origin**: 2026-05-16, lesson-5 Scene08 (영상 1:50 시점)

**Why**: lesson-5 Scene08 의 `InlineCallout` ("Python에선 한 단어 `elif`") 가 `top: -56, left: 60` 으로 박혀 코드 패널 상단 header (`grade.py` 파일명 영역, height 40) 와 겹쳤음. 사용자 지적: "원래 있던것과 글자가 겹치는데 안겹치도록 수정. 코드 오른쪽 빈공간에 배치해도됨". 콜아웃은 부가 설명인데 panel header/code text 와 겹치면 두 정보가 동시에 안 읽혀 정보 손실. 모든 callout 배치는 빈 공간 우선.

**How to apply**:
- `InlineCallout` 의 위치 결정 시 3가지 옵션:
  1. **패널 위쪽** (top < 0): `top ≤ -100` 으로 패널 header(40) + callout content height(~72) + 여유 여백(~10) 확보. `arrowSide="bottom"` 으로 아래 가리킴.
  2. **패널 오른쪽 빈공간** (코드 본문 폭이 panel width 의 60% 미만일 때): `top: <line_y>` (가리키려는 코드 줄과 같은 y), `left: <code_text_right + ~40>`. `arrowSide="left"` 로 왼쪽(코드) 가리킴.
  3. **패널 외부 우측** (panel 옆 빈공간): scene 컨테이너 padding 안에서 panel 오른쪽 + 40px. `arrowSide="left"`.
- 콜아웃 컴포넌트는 `arrowSide` prop 으로 화살표 방향 명시. 옵션: `"bottom" | "left" | "none"` (`primitives.tsx` 의 `InlineCallout` 참조).
- 절대 금지: callout 의 content/arrow 가 panel header(top 0~40), 코드 본문 line, scene 타이틀 텍스트 좌표와 충돌.

**Good** (lesson-5 Scene08 v2 — 오른쪽 빈공간):
```tsx
<div style={{ position: "absolute", top: 134, left: 420 }}>  {/* 코드 우측 빈영역, line 3 (elif) 와 같은 y */}
  <InlineCallout title="Python에선 한 단어 elif" arrowSide="left" width={360} />
</div>
```

**Bad** (lesson-5 Scene08 v1):
```tsx
<div style={{ position: "absolute", top: -56, left: 60 }}>  {/* panel header(top 0~40) 와 overlap */}
  <InlineCallout title="..." width={340} />
</div>
```

---

## R-011 — Active recall · 흐름 scene 의 3박스 row 는 같은 세로 위치 + 균등 가로 간격

- **Category**: G
- **Status**: ACTIVE
- **Origin**: 2026-05-16, lesson-5 Scenes 06 / 09 / 10 / 13 (영상 1:10, 1:57, 2:17, 2:58 시점)

**Why**: lesson-5 Scene06/09/10/13 (Active Recall + 흐름 시각화 scene) 에서 좌측(CodePanel) / 가운데(? 또는 FlowArrow) / 우측(ConsolePanel) 3박스 레이아웃이 outer flex 안 left/right column 으로 나뉘어 (left 는 VarBox+CodePanel column, right 는 paddingTop 으로 정렬 시도), 세 박스의 세로 위치 / 가로 간격이 어긋남. 사용자 지적 (3 scene 동시): "네모박스가 위치가 안맞고, 오른쪽 출력 결과 코드박스가 너무 오른쪽에 있고, 중간에 화살표가 너무 작은데 모두 수정". "입력 → 신호 → 출력" 흐름은 **시각적 직선** 으로 읽혀야 하며 세로 어긋나면 흐름이 안 보임.

**How to apply** (구조 패턴 강제):
- **VarBox(입력 변수 박스)** 는 main row 위쪽에 `position: absolute` 로 분리 배치:
  - `top: <header_below + 60>` (대략 130~200)
  - `left: "50%", transform: "translateX(-50%)"` (가로 가운데)
- **Main row** 는 single flex container, **각 박스는 same row 의 직접 자식**:
  - `position: absolute, left: 0, right: 0, top: <main_row_y>` (대략 310~430)
  - `display: "flex", justifyContent: "center", alignItems: "center", gap: <60-80>`
  - 자식: CodePanel relative wrapper / Middle 신호 wrapper / ConsolePanel
- **Middle 신호 wrapper** 는 명시 `width` + `height` (CodePanel height 와 동일) + `flexShrink: 0`:
  - `<div style={{ width: 100~160, height: <CodePanel height>, flexShrink: 0, ...flex center }}>`
- **BranchLabel (True/False)** 은 CodePanel relative wrapper 안 `position: absolute, right: -110` (panel 우측 + 110, 너무 멀지 않게)

**Bad pattern (지양)**:
```tsx
<div style={{ inset: 0, display: "flex", alignItems: "center", padding: "120px 60px 60px" }}>
  <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
    <VarBox />
    <CodePanel />          {/* left column 안에서만 center 정렬 — 다른 column 과 어긋남 */}
  </div>
  <div style={{ width: 140 }}><QuestionMark /></div>
  <div style={{ flex: "0 0 480", paddingTop: 110 }}>  {/* paddingTop 으로 정렬 시도 — fragile */}
    <ConsolePanel />
  </div>
</div>
```

**Good** (lesson-5 Scene09 v2):
```tsx
{/* VarBox 분리 — main row 위쪽 가운데 */}
<div style={{ position: "absolute", top: 130, left: "50%", transform: "translateX(-50%)" }}>
  <VarBox label="score">75</VarBox>
</div>

{/* Main row — 3박스 같은 세로 + 균등 gap */}
<div style={{
  position: "absolute", left: 0, right: 0, top: 330,
  display: "flex", justifyContent: "center", alignItems: "center", gap: 60,
}}>
  <div style={{ position: "relative" }}>
    <CodePanel width={680} height={460}>...</CodePanel>
    <div style={{ position: "absolute", top: 68, right: -110 }}><BranchLabel value="True"/></div>
  </div>
  <div style={{ width: 100, height: 460, flexShrink: 0, ...flex center }}>
    <FlowArrow ... />
  </div>
  <ConsolePanel width={460} height={200}>...</ConsolePanel>
</div>
```

---

## R-012 — 가운데 신호 element (? · arrow) 는 양옆 박스 대비 충분히 큰 사이즈

- **Category**: G
- **Status**: ACTIVE
- **Origin**: 2026-05-16, lesson-5 Scenes 06 / 09 / 10 / 13 (영상 1:10, 1:57, 2:17, 2:58 시점)

**Why**: lesson-5 Scene09/10/13 에서 가운데 신호 (FlowArrow length 108 strokeWidth 3, QuestionMark size 120) 가 양옆 박스 (CodePanel 680×460, ConsolePanel 460×200) 대비 미니어처 같이 보임. 사용자 지적: "중간에 화살표가 너무 작은데 수정". 1920×1080 frame 에서 좌·우 박스가 큰데 가운데 신호만 작으면 "이거 중요한가?" 라는 시각 약세 — 학습자 시선이 박스에만 가고 가운데 흐름·물음표를 놓침. 신호는 양옆 박스와 비례하는 크기여야 의미 강조 유지.

**How to apply** (grep):
- `<QuestionMark size={N} ... />` 가 Active Recall 가운데 신호용 (양옆에 CodePanel + ConsolePanel) → `N ≥ 180`
- `<FlowArrow startY={A} endY={B} strokeWidth={S} ... />` 가 흐름 표시용 →
  - `strokeWidth ≥ 6`
  - `(B - A) ≥ 160`
- 작은 신호(size 120, strokeWidth 3, length 108 미만) 는 양옆 박스가 panel 류(width ≥ 400) 일 때 fail.
- 단, 신호가 *코드 패널 내부* 라인 옆에 박혀 특정 코드 위치를 가리키는 의미가 있으면 size 작아도 OK (예 R-011 의 line-by-line 화살표는 line height 에 맞춰야).

**Good** (lesson-5 Scene10 v2):
```tsx
<QuestionMark size={180} delaySec={...} lifespanSec={2.0} />  {/* 양옆 CodePanel 460h, ConsolePanel 200h 사이에서 충분히 큼 */}
```

**Bad** (lesson-5 Scene10 v1):
```tsx
<QuestionMark size={120} ... />  {/* 양옆 큰 박스 사이에서 작아 보임 */}
<FlowArrow startY={92} endY={200} strokeWidth={3} />  {/* length 108, strokeWidth 3 — 가는 실 */}
```

---

## R-013 — narration 은 직접 표현 우선, 신체 동작 비유는 추상 동사로 대체

- **Category**: N
- **Status**: ACTIVE
- **Origin**: 2026-05-16, lesson-5 Scene02 (영상 0:20 시점)

**Why**: lesson-5 Scene02 narration "어느 줄이 실행될지 **손가락으로 짚을 수 있게** 됩니다" 에 신체 동작(손가락으로 짚다) 비유가 박혀 있어 학습자가 듣기에 비자연스럽고 추상화 단계가 한 번 더 들어감. 사용자 지적: "[손가락으로 짚을 수 있게]를 [알 수 있게] 또는 다른 자연스러운 표현으로 수정". 학습 영상의 narration 은 학습자 머릿속에서 "이 표현 = 어떤 행동" 을 매핑하는 비용 없이 직접 의미가 전달되어야 한다. "손가락으로 짚다" / "한눈에 잡힌다" / "가슴으로 받아들이다" 같은 신체·관용 비유는 학습 카피에선 사족.

**How to apply** (narration review):
- 합성 전 narration 검토 단계에서, 다음 표현이 나오면 추상 동사로 대체 후보:
  - "손가락으로 짚을 수 있게" → "알 수 있게" / "구분할 수 있게" / "찾을 수 있게"
  - "눈에 들어온다" → "보인다" / "이해된다"
  - "한눈에 잡힌다" → "한번에 이해된다" / "바로 보인다"
  - "머리에 박힌다" → "기억된다" / "익힌다"
  - "가슴으로 와닿는다" → "이해된다" / "느낌이 온다"
- 단, 비유가 *학습 목표 자체* (예: "조건문 갈래" 시각 비유, "변수 박스" 멘탈모델) 인 경우는 keep — 그건 메타포가 학습 도구.
- 일상 동사("쓰다", "안다", "본다", "이해한다", "구분한다") 로 줄였을 때 의미 손실이 거의 없으면 무조건 줄임 안.

**Good** (lesson-5 Scene02 v2):
```
이 영상이 끝나면, 조건문이 들어간 코드를 보고 어느 줄이 실행될지 알 수 있게 됩니다.
```

**Bad** (lesson-5 Scene02 v1):
```
이 영상이 끝나면, 조건문이 들어간 코드를 보고 어느 줄이 실행될지 손가락으로 짚을 수 있게 됩니다.
```

---

## R-014 — 좌측 코드 패널 + 우측 콘솔 패널 layout: 두 패널의 세로 y 범위 일치

- **Category**: G
- **Status**: ACTIVE
- **Origin**: 2026-05-16, lesson-6 Scene04 (영상 1:03 시점)

**Why**: lesson-6 Scene04 에서 좌측 column = [VarBox 172 + gap 30 + RoundLabel 40 + gap 30 + CodePanel 200] = 472 height, 우측 column = [paddingTop 60 + ConsolePanel 320] = 380 height. parent flex `alignItems: center` 로 두 column 모두 세로 중앙정렬되었지만 column 총 높이가 달라 ConsolePanel 이 screen-y 400~720, CodePanel 이 screen-y 566~766 — y 범위 불일치. 사용자 지적: "출력결과를 작게 만들어주고 코드박스의 높이(세로)위치와 같도록 해줘". 좌·우 패널이 "같은 코드 / 같은 결과" 라는 짝 관계를 시각으로 잡으려면 y 범위가 일치해야 학습자 시선이 자연스럽게 좌→우로 이동한다.

**How to apply** (grep + calc):
- 좌측 column 에 코드 패널 위쪽으로 VarBox/RoundLabel/시나리오 카드 등 부가 element 가 stack 되어 있고, 우측은 단일 ConsolePanel 인 layout 패턴 검출 시:
  1. **좌측 column 총 높이 H_L** = Σ(element heights) + Σ(gaps) 계산
  2. **좌측 column 내 CodePanel top offset T_C** = Σ(element heights above code) + Σ(gaps above code)
  3. **우측 ConsolePanel height = CodePanel height** (시각 무게 동일)
  4. **우측 column paddingTop = T_C** (column 위쪽 빈 공간이 좌측 부가 element stack 과 일치)
  5. **우측 column 총 높이 = paddingTop + ConsolePanel height = T_C + CodePanel height** (이 값이 H_L 과 일치하면 자동 정렬)
- 위 공식 위반 (paddingTop 자의적 값 / Console height ≠ Code height) 이면 fail
- 대안: R-011 처럼 VarBox 를 main row 위쪽 절대 좌표로 분리 → main row 가 단순 [code | console] 가 되어 alignItems:center 가 자동으로 정렬

**Good** (lesson-6 Scene04 v2):
```tsx
{/* 좌측: VarBox 172 + gap 30 + Label 40 + gap 30 + Code 200 = 472, Code top offset = 272 */}
<div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
  <VarBoxArea />
  <RoundLabel />
  <CodePanel width={620} height={200} />
</div>

{/* 우측: paddingTop 272 + console 200 = 472 (좌측과 동일), console height = code height */}
<div style={{ flex: 1, ..., paddingTop: 272 }}>
  <ConsolePanel width={300} height={200} />
</div>
```

**Bad** (lesson-6 Scene04 v1):
```tsx
<div style={{ flex: 1, ..., gap: 30 }}>
  <VarBoxArea /> <RoundLabel /> <CodePanel height={200} />  {/* col total 472 */}
</div>
<div style={{ flex: 1, ..., paddingTop: 60 }}>
  <ConsolePanel height={320} />  {/* col total 380 — 좌측과 다름 → y 어긋남 */}
</div>
```

---

## R-015 — 좌·우 패널의 짝 강조 박스(HighlightBox / PulseRing)는 동일 screen-y · height 강제 정렬

- **Category**: G
- **Status**: ACTIVE
- **Origin**: 2026-05-16, lesson-6 Scene08 (영상 2:25 시점)

**Why**: lesson-6 Scene08 의 좌측 CodePanel line 3 둘러싸는 HighlightBox (`top: 148, height: 64`) 와 우측 ConsolePanel line 3 둘러싸는 LastLinePulse (`top: 196, height: 56`) 가 양쪽 panel 이 같은 screen-y 에 있음에도 박스 top·height 가 달라 시각상 두 박스가 어긋난 위치에 떠 학습자가 "이 줄 ↔ 이 줄" 대응을 빠르게 못 잡음. 사용자 지적: "네모박스 2개 위치가 안맞는데 잘 맞도록 수정". 좌·우 패널의 짝 강조 박스(같은 line index 를 가리키는 것)는 학습 메타포가 "코드 line N ↔ 출력 line N 대응". 정렬이 시각 메타포 자체. 패널 내부 line-box 가 다른 fontSize·strut 으로 6~8px 어긋나도 박스 자체는 강제 정렬해 메타포를 우선한다.

**How to apply** (grep):
- 좌·우 패널(CodePanel / ConsolePanel) 안에 짝을 이루는 강조 element 가 있으면 (둘 다 line N 을 가리킴):
  - 두 박스의 `top` 동일 (차이 ≤ 4px 권장)
  - 두 박스의 `height` 동일 (차이 ≤ 4px)
  - 좌측 박스 `left`, 우측 박스 `right` 마진은 패널 내부 padding 차이만큼만 다를 수 있음 (예: HighlightBox `left: 26`, PulseRing `left: 16, right: 16`)
- top 차이 > 4 또는 height 차이 > 4 면 fail
- 패널마다 line-box 가 다르면 (parent fontSize 차이) 박스가 정확히 line 을 surround 하지 못할 수 있지만, **시각 정렬 우선** — line 약간 오프셋은 허용

**Good** (lesson-6 Scene08 v2):
```tsx
<HighlightBox left={26} top={162} width={690} height={50} ... />
<div style={{ position: "absolute", left: 16, right: 16, top: 162, height: 50, ... }} />  {/* top·height 동일 */}
```

**Bad** (lesson-6 Scene08 v1):
```tsx
<HighlightBox top={148} height={64} />
<div style={{ top: 196, height: 56 }} />  {/* top 48 차이, height 8 차이 — 짝 메타포 와해 */}
```

---

## R-016 — narration 키워드 강조 시각효과(pulse · color change · scale)는 그 단어 발화 시점에 동기 (R-004 일반화)

- **Category**: G + N
- **Status**: ACTIVE
- **Origin**: 2026-05-16, lesson-6 Scene09 (영상 2:39 시점)

**Why**: lesson-6 Scene09 에서 `for` 카드 violet pulse 가 `forPulse: 6.0s`, `while` 카드 pulse 가 `whilePulse: 7.0s` 로 박혀, narration "반복 횟수가 미리 정해져 있으면 포(@~9s), 조건이 만족될 때까지 반복해야 하면 와일(@~12.5s)" 보다 3~5초 일찍 펄스가 끝남 — 발화 순간엔 시각 강조 없음. 사용자 지적: "for와 while 보라글씨로 바뀌는 타이밍이 안맞는데 잘 맞게 수정". R-004 는 "Active Recall 정답 reveal" 에 한정되어 있으나, **모든 narration 키워드 강조 시각효과**(keyword pulse / color change / scale up / underline draw) 는 그 단어 발화 시점에 동기되어야 학습자의 "들은 단어 ↔ 본 단어" 매핑이 강해진다. 발화 전 끝나거나 발화 후 시작하면 매핑 비용 발생.

**How to apply** (audio probe + grep):
- 다음 패턴 element 의 `delaySec` 값을 narration 의 키워드 발화 시점과 매칭:
  - `<PulseText text={keyword} delaySec={X} />`
  - `<PulseRing delaySec={X} />`
  - `interpolate(frame, [X*fps, ...], [baseColor, accentColor, ...])` (색상 펄스)
  - `interpolate(frame, [X*fps, ...], [1.0, 1.06, ...])` (scale 펄스)
  - 키워드 token 의 highlight `interpolate(frame, [X*fps, ...], [0, 1, 1, 0])` 패턴
- 키워드 발화 시점 측정:
  - scene 의 `02-audio/_scenes/sNN.mp3` ffprobe 로 전체 길이 확인
  - narration text 에서 키워드까지의 음절 비율로 추정 (Korean TTS +10% rate ≈ 4.5~4.7 syl/s)
  - 또는 청취로 단어 시작 시점 정확히 측정
- 검증 범위:
  - `delaySec ≤ keyword_uttered_time + 0.5s` (단어 시작 즈음 펄스 시작)
  - `delaySec + pulse_duration ≥ keyword_uttered_time + word_duration` (단어 끝까지 효과 유지)
- 범위 벗어나면 fail. 같은 scene 에 2+ 키워드 펄스가 있으면 각각 검증 (예: for + while)

**Good** (lesson-6 Scene09 v2):
```tsx
// narration 음절 분석: 64 syl / 13.7s ≈ 4.7 syl/s → "포" ≈ 9.7s, "와일" ≈ 13.0s
const REVEAL = {
  forPulse: 9.0,    // narration "포" 발화 시점에 동기
  whilePulse: 12.3, // narration "와일" 발화 시점에 동기
};
```

**Bad** (lesson-6 Scene09 v1):
```tsx
const REVEAL = {
  forPulse: 6.0,   // narration "포" 9s 보다 3초 일찍 — 발화 시 펄스 끝남
  whilePulse: 7.0, // narration "와일" 12.5s 보다 5초 일찍 — 매핑 와해
};
```

---

## R-017 — Panel(Console/Code) N줄 콘텐츠 height: line-box = max(parent strut, child span) 기준 검증

- **Category**: G
- **Status**: ACTIVE
- **Origin**: 2026-05-16, lesson-6 Scene11 (영상 3:23 시점)

**Why**: lesson-6 Scene11 좌측 ConsolePanel (`width 400, height 310`) 에 6줄(`0`/`끝`/`1`/`끝`/`2`/`끝`) 이 들어가는데 마지막 `2` + `끝` 이 잘려 안 보였음. 사용자 지적: "왼쪽 출력결과에서 마지막 '2'가 짤리는데 수정". 원인: primitive ConsolePanel 의 content div 가 `fontSize: 30, lineHeight: 1.7` (parent strut 51px) 인데 각 ConsoleLine 안의 span 만 `fontSize: 26` 으로 override → 실제 line-box = max(strut 51, span 44.2) = **51**. 6 × 51 + 5 × 6 (gap) = 336 > 230 (content area = 310 - 80). 개발자가 흔히 `span fontSize × 1.7 = 44.2 × 6 = 265 fits in 310` 으로 추정해 빗나감 — **parent fontSize 가 strut 으로 line-box 에 항상 기여**한다는 점이 함정.

**How to apply** (grep + calc):
- ConsolePanel / CodePanel / 임의 multi-line text panel 의 N줄 fit 검증:
  ```
  line_box = max(
    parent_content_div.fontSize × parent_content_div.lineHeight,  // strut (항상 기여)
    child_span.fontSize × child_span.lineHeight                   // inline content
  )
  required_content_height = N × line_box + (N - 1) × gap
  required_panel_height = header_height + (padding_top + padding_bottom) + required_content_height
  ```
- 패널 primitive 의 default content div fontSize 확인 (`primitives.tsx` → `ConsolePanel`: 30, `CodePanel`: 28).
- `panel.height < required_panel_height` 이면 fail. 해결:
  1. **Panel height 증가** (가장 단순) — 좌·우 panel 이 짝이면 둘 다 같은 height 로
  2. **parent fontSize 를 span fontSize 로 일치** (primitive 수정 — 사이드이펙트 검토 필요)
  3. **span 을 inline-block + lineHeight 명시** 로 strut bypass (변수)
- 빠른 sanity: `N ≥ 5 + 패널 height < 350` 이면 거의 확실히 잘림 — 직관 검증

**Good** (lesson-6 Scene11 v2):
```tsx
{/* 6 lines × line-box 51 + 5 gaps × 6 = 336 → content ≥ 336 → panel ≥ 416 → 420 사용 */}
<ConsolePanel width={400} height={420}>
  {/* 6 lines */}
</ConsolePanel>
```

**Bad** (lesson-6 Scene11 v1):
```tsx
{/* span fontSize 26 만 보고 height 310 책정 → strut 51 미고려 → 마지막 2줄 잘림 */}
<ConsolePanel width={400} height={310}>
  {/* 6 lines, but content area 230 < required 336 */}
</ConsolePanel>
```

---

## R-018 — IndexStrip + 박스 행 + trailing EmptySlot 은 동일 가로 layout 으로 통합 (라벨이 박스 사이에 끼지 않게)

- **Category**: G
- **Status**: ACTIVE
- **Origin**: 2026-05-19, lesson-7 Scene04 (영상 1:05) / Scene12 (영상 3:57)

**Why**: lesson-7 Scene04 / Scene12 에서 `ListVisual` 의 인덱스 띠 `[0] [1] [2]` 가 박스 `88` `92` `76` 위에 정렬되지 않고 박스 *사이* 에 표시됐음. 사용자 지적: "상단에 인덱스 위치가 숫자 위에 있는게 아니라 숫자들 사이에 있다". 원인: `IndexStrip` 은 `count = items.length` 만큼만 라벨을 그리는데 (`count × boxSize + (count-1) × gap` 폭), 박스 행은 그 위에 `EmptySlot` 까지 추가로 그려 폭이 다름 (`count × boxSize + (count-1) × gap + marginLeft + EmptySlot.size`). 둘 다 `alignItems: center` 인 컬럼 안에 있어 가로 center 정렬되면 IndexStrip 이 박스 행보다 좁아 라벨 위치가 박스 *사이* 로 밀려남. 또한 `EmptySlot` 이 자체적으로 `indexLabel + 박스` 의 두 줄 구조(`column` flex, gap 10)라 height = `36 + 10 + size` = `size + 46` → 다른 ListBox(`height = size`) 보다 크고, 박스 행 `alignItems: center` 에서 가운데 정렬되어 EmptySlot 의 박스 부분이 다른 박스 대비 ~23px 아래로 떨어졌음 → 사용자 지적 "인덱스 3에 해당하는 박스의 높이위치가 나머지와 다르다".

**How to apply** (grep):
- `ListVisual` 컴포넌트가 `trailingEmptySlot` prop 을 받고 `IndexStrip` 을 같이 그리면:
  - **IndexStrip 폭 ≡ 박스 행 폭** 강제: `IndexStrip` 에 `trailingEmptyLabel` 옵션을 더해 빈 자리 라벨도 같은 가로 stride(`marginLeft + boxSize`) 로 추가
  - **EmptySlot 의 자체 indexLabel 제거**: 인덱스 라벨은 `IndexStrip` 일원으로 그려야 박스 위 정렬 보장. `EmptySlot` 은 박스 본체만(`height = size`) 그려 다른 `ListBox` 와 정렬
- `EmptySlot` 컴포넌트에 `indexLabel` prop 이 존재하면 fail (deprecated — `IndexStrip.trailingEmptyLabel` 로 이동).
- 직접 `<EmptySlot indexLabel="[N]" />` 호출하면 fail.

**Good** (primitives.tsx 의 ListVisual 안):
```tsx
{showIndexStrip ? (
  <IndexStrip
    count={items.length}
    boxSize={boxSize}
    gap={gap}
    trailingEmptyLabel={trailingEmptySlot?.indexLabel}
    trailingEmptyDelaySec={trailingEmptySlot?.labelDelaySec ?? trailingEmptySlot?.delaySec ?? 0}
    trailingEmptyMarginLeft={6}
  />
) : null}
<div style={{ display: "flex", gap, alignItems: "center" }}>
  {items.map(...)}
  {trailingEmptySlot ? (
    <div style={{ marginLeft: 6 }}>
      <EmptySlot size={boxSize} delaySec={...} xDelaySec={...} />  {/* indexLabel 전달 X */}
    </div>
  ) : null}
</div>
```

**Bad** (lesson-7 v1 — fail):
```tsx
<IndexStrip count={3} boxSize={130} gap={24} />  {/* 폭: 3*130 + 2*24 = 438 */}
<div style={{ display: "flex", gap: 24, alignItems: "center" }}>
  ...3 boxes...                                    {/* 박스 행 폭: 438 + 6 + 130 = 574 → 어긋남 */}
  <EmptySlot size={130} indexLabel="[3]" />         {/* EmptySlot 자체에 라벨 → 박스 height 130 + 46 → 정렬 깨짐 */}
</div>
```

---

## R-019 — 두 layer 가 겹치는 inline label (SwapLabel 류) 은 whiteSpace: nowrap 강제

- **Category**: G
- **Status**: ACTIVE
- **Origin**: 2026-05-19, lesson-7 Scene05 (영상 1:27)

**Why**: lesson-7 Scene05 의 `SwapLabel` 이 `"길이 = 3"` → `"길이 = 4"` swap 할 때, 새 라벨 `"길이 = 4"` 가 2줄로 보였음 (`길이 =` 첫 줄, `4` 둘째 줄). 사용자 지적: "[길이=4] 이거 2줄로 이상하게 보이는데 수정해줘". 원인: `SwapLabel` 의 구조가 `<div pos:relative>{initial}<div pos:absolute inset:0>{newLabel}</div></div>` — parent div 의 폭은 `initial` 의 inline span 폭에 fit-content. `newLabel` 의 span 은 absolute 영역(parent 폭) 안에서 inline 그려짐. 두 span 의 `fontWeight` 차이(700 vs 800) 로 굵은 쪽 폭이 살짝 더 커서 parent fit-content 폭을 넘어 wrap. 같은 위치에 layer 가 겹치는 swap pattern 은 두 layer 의 폭 차이가 1~2px 만 있어도 wrap 위험.

**How to apply** (grep):
- `position: "absolute", inset: 0` 으로 layer 두 개가 겹치는 swap pattern 검출 (`SwapLabel` / 유사 컴포넌트):
  - parent div, 두 layer div 모두 `whiteSpace: "nowrap"` 명시
- 또는 두 label 의 폭을 미리 명시(`width: <max>`) 로 강제
- font weight / font size / 텍스트 길이 가 다른 두 label 을 같은 좌표에 swap 할 때 nowrap 안 박으면 fail

**Good** (primitives.tsx 의 SwapLabel):
```tsx
<div style={{ position: "relative", whiteSpace: "nowrap", ...style }}>
  <div style={{ opacity: oldOpacity, whiteSpace: "nowrap" }}>{initial}</div>
  <div style={{ position: "absolute", inset: 0, opacity: newOpacity, whiteSpace: "nowrap" }}>
    {newLabel}
  </div>
</div>
```

**Bad** (lesson-7 v1):
```tsx
<div style={{ position: "relative" }}>
  <div>{initial}</div>                                              {/* fontWeight 700 */}
  <div style={{ position: "absolute", inset: 0 }}>{newLabel}</div>  {/* fontWeight 800 — 폭 약간 큼 → wrap */}
</div>
```

---

## R-020 — 좌·우 컬럼 패널 정렬: wrapper height 명시 + inline-flex label 의 height 강제 (R-014 보강)

- **Category**: G
- **Status**: ACTIVE
- **Origin**: 2026-05-19, lesson-7 Scene09 (영상 2:40)

**Why**: lesson-7 Scene09 (좌측: VarBox + RoundLabel + CodePanel / 우측: ConsolePanel) 에서 좌·우 패널의 세로 y 가 어긋났음. 사용자 지적: "코드박스와 출력결과박스의 높이위치가 다른거 같다". R-014 적용으로 좌측 sum 과 우측 sum 을 같게 설계(`label 36 + gap 10 + box 160 + gap 30 + roundLabel 36 + gap 30 + code 200 = 502` vs `paddingTop 302 + console 200 = 502`) 했음에도 어긋남. 원인: VarBox 의 inline-flex label 이 명시 height 없이 `padding "6px 18px" + fontSize 26` 만 잡혀 실제 line-box 가 `padding 12 + font 26×default-lineHeight(~1.2) = ~45px` 까지 늘어남 → 좌측 sum 이 ~511 로 보임 → `alignItems: center` 일 때 좌측 column center 가 우측보다 ~4.5px 위로 → CodePanel/ConsolePanel y 어긋남.

**How to apply** (grep + calc):
- R-014 의 좌측·우측 sum 매칭 + 추가로 다음 강제:
  1. **인라인 label (VarBox label, RoundLabel 등) 의 명시 height**: `display: "inline-flex", alignItems: "center", height: <N>, lineHeight: 1, padding: "0 18px"` — height 를 sum 계산값으로 직접 강제. padding top/bottom 은 0 으로 두고 height 와 lineHeight 1 로 통제 (브라우저 default line-height ~1.2 가 영향 못 미치게).
  2. **좌·우 wrapper 의 명시 height**: `height: COL_HEIGHT` (예: 502) 를 좌·우 wrapper 양쪽에 동시 강제. 한쪽만 강제하면 다른 쪽이 자식 sum 에 의존해 다시 어긋남.
  3. **상수 추출**: `const COL_HEIGHT = 502` 같은 명시 상수를 scene 안에 두고 좌·우 wrapper 가 같은 상수 참조.
- 위 3개 중 하나라도 누락이면 fail. 단, R-011 처럼 VarBox 를 main row 위쪽 absolute 좌표로 분리 → main row 가 단순 [code | console] 두 박스만 남으면 sum 정렬 자체가 단순해져 본 룰 면제 (단, label 류 inline-flex height 는 여전히 명시 권장).

**Good** (lesson-7 Scene09 v2):
```tsx
const COL_HEIGHT = 502;  // 좌측 sum = 36+10+160+30+36+30+200, 우측 = 302+200

{/* 좌측 column */}
<div style={{ flex: 1, ..., gap: 30, height: COL_HEIGHT }}>
  {/* label height 36 강제 */}
  <div style={{ display: "inline-flex", alignItems: "center", height: 36, lineHeight: 1, padding: "0 18px", fontSize: 26, ... }}>s</div>
  <VarBoxBody height={160} />
  <RoundLabel height={36} />
  <CodePanel height={200} />
</div>

{/* 우측 column */}
<div style={{ flex: 1, ..., paddingTop: 302, height: COL_HEIGHT, alignItems: "flex-start" }}>
  <ConsolePanel height={200} />
</div>
```

**Bad** (lesson-7 Scene09 v1):
```tsx
{/* 좌측 — wrapper height 미명시, label height 미강제 */}
<div style={{ flex: 1, ..., gap: 30 }}>
  <div style={{ display: "inline-flex", padding: "6px 18px", fontSize: 26, ... }}>s</div>  {/* 실제 ~45px */}
  ...
</div>

{/* 우측 — paddingTop 만, wrapper height 미명시 */}
<div style={{ flex: 1, ..., paddingTop: 302 }}>
  <ConsolePanel height={200} />
</div>
{/* → 좌측 sum 511 vs 우측 sum 502 → alignItems:center 에서 ~4.5px 어긋남 */}
```

---

## R-021 — CodePanel/Panel wrapper 안 absolute element (IndentGuide·HighlightBox) 는 panel.height 안에 fit

- **Category**: G
- **Status**: ACTIVE
- **Origin**: 2026-05-19, lesson-7 Scene10 (영상 3:11)

**Why**: lesson-7 Scene10 의 6강·7강 비교 카드에서 `IndentGuide` (둘째 줄 들여쓰기 시각화 막대) 가 `CodePanel` 어두운 박스 *아래로* 튀어나왔음. 사용자 지적: "박스에 2번째줄의 바(막대기)가 코드박스 아래부분을 통과한다". 원인: `IndentGuide` 는 CodePanel wrapper(`<div style={position:relative}>`) 안에 `position: absolute, top: 108, height: 50` 으로 박혀 있는데, CodePanel 자체 height 는 150 → IndentGuide 의 bottom (`top 108 + height 50 = 158`) 이 CodePanel bottom(150) 을 8px 초과. CodePanel wrapper 의 `overflow: visible` (default) 이라 IndentGuide 가 CodePanel 박스 *밖*(그 wrapper 의 아래 영역) 에 그려져 어두운 박스 외부에 떠 있는 막대처럼 보임. lesson-7 Scene09 의 CodePanel(height 200) 안 같은 IndentGuide(top 108 + height 50 = 158 < 200) 는 fit 했기 때문에 lesson-9 작성자가 lesson-10 의 좁은 height 150 케이스를 누락.

**How to apply** (grep + calc):
- `CodePanel` (또는 임의 `position: relative` wrapper) 안 `position: absolute` 자식 (`IndentGuide` / `HighlightBox` / 임의 overlay) 에 대해:
  - `(child.top ?? 0) + (child.height ?? 0) ≤ panel.height` 검증
  - 위반 시 fail. 해결:
    1. **panel.height 증가** (가장 단순) — 카드 안 다른 element 와의 sum 도 함께 조정
    2. **absolute child 의 height/top 축소** (시각 강조가 약해지지만 영향 작음)
    3. **wrapper 에 `overflow: hidden`** (강제 잘림 — 디자인상 어색, 권장 X)
- 빠른 sanity: `IndentGuide top + height` 가 70 이상이면 CodePanel height ≥ 180 권장 (대부분 lesson-3~9 의 IndentGuide 사용 패턴 기준).
- Panel 외부에 절대값 element 가 의도된 경우(예: panel 옆 callout, panel 위 사이드 라벨) 는 본 룰 면제. 단, panel "안" 의 시각 강조 element 는 panel 안에 머물러야 학습자가 panel-content 의 일원으로 인식.

**Good** (lesson-7 Scene10 v2):
```tsx
<div style={{ position: "relative" }}>
  <CodePanel width={620} height={180}>...</CodePanel>  {/* 180 ≥ IndentGuide top 108 + height 50 = 158 */}
  <IndentGuide left={64} top={108} height={50} ... />
</div>
```

**Bad** (lesson-7 Scene10 v1):
```tsx
<div style={{ position: "relative" }}>
  <CodePanel width={620} height={150}>...</CodePanel>  {/* 150 < 158 — IndentGuide 8px overflow */}
  <IndentGuide left={64} top={108} height={50} ... />  {/* 코드 박스 아래로 튀어나옴 */}
</div>
```

---

## R-022 — 토큰 위 마커(배지·말풍선·물음표)는 절대 px 대신 인라인 자동 정렬 (wrap-relative)

- **Category**: G
- **Status**: ACTIVE
- **Origin**: 2026-05-19, lesson-8 Scene02 (영상 27초 시점)

**Why**: lesson-8 Scene02 의 `?` 배지 3개가 `scores = [80, 95, 70]` 의 각 숫자 위에 위치해야 하는데, 배지가 CodePanel sibling 으로 `position: absolute; left: 240/358/472` 하드코딩됨. char width 를 ~29.5px 로 가정한 값이었지만 실제 mono 28px 의 advance width 는 ~17.4px → badge 1 은 그나마 비슷, badge 2/3 는 우측으로 53/95px 어긋남. 사용자 지적: "[?] 원이 각 숫자 위에 위치하도록 수정해줘". 모노스페이스라도 실제 char width 는 (a) 어떤 fallback font 가 실제 로딩되는지 (b) Korean glyph 가 섞이면 inline-flow 가 어떻게 짜이는지에 따라 달라져, 개발자의 px 추측은 거의 항상 빗나간다. **토큰 위 마커는 토큰 자체를 relative-anchor 로 삼아 브라우저 layout 에 맡겨야 한다.**

**How to apply** (grep):
- 코드/콘솔 panel 안 특정 토큰(숫자·식별자·연산자)을 가리키는 마커 element 가:
  ```tsx
  <div style={{ position: "absolute", left: <hardcoded-px>, top: <hardcoded-px>, ... }}>
    <Marker />
  </div>
  ```
  형태로 panel 외부 sibling 으로 박혀 있으면 fail.
- 대신 토큰을 inline-block relative wrapper 로 감싸 마커를 absolute 자식으로:
  ```tsx
  const TokenWithMarker: React.FC<...> = ({ ... }) => (
    <span style={{ position: "relative", display: "inline-block" }}>
      <PyToken text={...} kind={...} />
      <span style={{
        position: "absolute",
        left: "50%",
        top: <negative offset to escape upward>,
        transform: "translateX(-50%)",
        pointerEvents: "none",
      }}>
        <Marker />
      </span>
    </span>
  );
  ```
- **CodePanel 의 `overflow: hidden` 을 `style={{ overflow: "visible" }}` 로 override** 필요 — 마커가 panel 위로 escape 해야 하기 때문.
- 패널 내부 line index, 헤더 height, content padding-top 을 계산해 `top` 값 도출:
  - default CodePanel: header 40 + content padding-top 20 = 60 → wrapper-relative 에서 panel.top 위로 N px 띄우려면 `top: -(N + 60)` (line index 0 기준)
- 다중 마커 stagger 등장 / 동시 pulse 도 wrapper-anchor 로 동작 — 각 wrapper 는 독립.

**Good** (lesson-8 Scene02 v2):
```tsx
<CodePanel fileName="scores.py" width={720} height={140} style={{ overflow: "visible" }}>
  <CodeLine lineNumber={1} revealAtSec={...}>
    <PyToken text="scores" kind="name" /> <PyToken text=" = [" kind="op" />
    <NumberWithBadge number="80" ... />
    <PyToken text=", " kind="op" />
    <NumberWithBadge number="95" ... />
    ...
  </CodeLine>
</CodePanel>
```

**Bad** (lesson-8 Scene02 v1):
```tsx
<div style={{ position: "relative" }}>
  <CodePanel>...</CodePanel>
  <div style={{ position: "absolute", left: 240, top: -28 }}><QuestionBadge /></div>
  <div style={{ position: "absolute", left: 358, top: -28 }}><QuestionBadge /></div>  {/* 실제 "95" 보다 ~53px 오른쪽 */}
  <div style={{ position: "absolute", left: 472, top: -28 }}><QuestionBadge /></div>  {/* 실제 "70" 보다 ~95px 오른쪽 */}
</div>
```

---

## R-023 — RedStrike 회전 기본 0deg (가로 직선) — 디자인 비틀기는 명시 opt-in

- **Category**: G
- **Status**: ACTIVE
- **Origin**: 2026-05-19, lesson-8 Scene08 (영상 2:31 시점)

**Why**: lesson-8 Scene08 의 코드 4번째 줄 `좌표[0] = 38.0` 에 걸린 RedStrike 가 `transform: translateY(-50%) rotate(-6deg)` 로 살짝 비스듬한 작대기로 렌더. 사용자 지적: "빨간색 작대기가 각도가 부자연스러운데 자연스럽게 수정해줘". -6deg 는 손글씨 사선 strike 의 디자인 의도였으나, 코드 문맥(가로 직선 = 표준 strike-through, IDE/diff tool 컨벤션)에서 비스듬한 사선은 학습자에게 "왜 기울어졌지?" 라는 시각 노이즈가 된다. **코드 strike 는 기본 0deg 가로 직선이 가독성·자연스러움 양쪽 다 우선.**

**How to apply** (grep):
- `RedStrike` primitive 의 `transform: rotate(...)` 기본값이 0deg 가 아니면 fail.
- `angleDeg?: number` prop 추가, 기본 `0`. ±6deg 이내 디자인 비틀기는 명시 opt-in (`<RedStrike angleDeg={-6}>...</RedStrike>`) 으로만.
- StrikeoutSetItem (lesson-8 set 중복 제거 시각) 같은 별도 inline strike 도 같은 룰 적용 권장 — 의미 부여 없는 사선 회전은 코드 문맥에선 노이즈.
- 단, **set 항목·UI 라벨 strike** 같이 _코드가 아닌 단어/항목_ strike 는 -6deg 살짝 사선이 캐주얼 톤에 어울려 OK — 코드 문맥에서만 0deg 강제.

**Good** (lesson-8 RedStrike v2):
```tsx
export const RedStrike: React.FC<{ ..., angleDeg?: number }> = ({ ..., angleDeg = 0 }) => (
  <span style={{ position: "relative", display: "inline-block", ... }}>
    {children}
    <span style={{ ..., transform: `translateY(-50%) rotate(${angleDeg}deg)` }} />
  </span>
);
```

**Bad** (lesson-8 RedStrike v1):
```tsx
<span style={{ ..., transform: "translateY(-50%) rotate(-6deg)" }} />  // 모든 호출 사선 hardcoded
```

---

## R-024 — 패널 외부로 튀어나오는 마커 금지 (안쪽 inset)

- **Category**: G
- **Status**: ACTIVE
- **Origin**: 2026-05-19, lesson-8 Scene08 (영상 2:31 시점)

**Why**: lesson-8 Scene08 의 빨간 ✕ 원이 `position: absolute; right: -20` 으로 박혀 코드 패널 우측 테두리에 반쯤 걸쳐 panel 외부로 튀어나옴. 사용자 지적: "빨간색 X 원이 코드박스 테두리에 겹치는데 코드박스 테두리 안으로 자연스럽게 들어오도록 수정". panel border 를 마커가 가로지르면 (a) panel 의 시각 컨테이너 의미(코드 영역)가 부서지고 (b) border-radius rounding 으로 마커 일부가 잘려 보일 수 있고 (c) box-shadow 와 마커 그림자가 겹쳐 지저분해진다. **panel 안 의미를 가진 마커는 panel 안에 — 외부 영역(예: 좌·우 다른 컬럼)으로 갈 거면 panel 과 명확히 분리.**

**How to apply** (grep):
- panel(CodePanel / ConsolePanel / Card / RedConsole) wrapper 안에 sibling 으로 `position: absolute` 마커가 있고 `left` / `right` / `top` / `bottom` 값이 음수면 fail.
  - 예: `right: -20`, `top: -28` (단, top 음수는 R-022 의 "토큰 위 배지" 케이스라면 OK — wrapper-anchor 인지 확인)
- 의도가 panel 안 의미 부여 (예: "이 코드는 에러") 면 `right`/`top`/`bottom`/`left` ≥ 0 으로 patch — 보통 panel padding (22) 안쪽 inset 정도가 자연스러움 (`right: 24` 등).
- panel 외부 시각 분리가 의도면 (예: 다른 컬럼으로 화살표) panel wrapper 밖으로 element 를 이동하고 wrapper 좌표계로 다시 anchor.
- 음수 inset 이 *디자인 의도* 인 케이스도 있음 (예: lower-third 가 화면 아래로 약간 escape) — 그 경우는 주석으로 의도 명시 + reviewer 가 명시적 OK.

**Good** (lesson-8 Scene08 v2):
```tsx
<div style={{ position: "relative" }}>
  <CodePanel width={680} ...>...</CodePanel>
  <FadeIn style={{
    position: "absolute",
    top: 230,
    right: 24,  // panel 안쪽 inset — padding(22) 보다 살짝 더 (border 와 안 겹침)
    width: 44, height: 44, ...
  }}>✕</FadeIn>
</div>
```

**Bad** (lesson-8 Scene08 v1):
```tsx
<FadeIn style={{
  position: "absolute",
  top: 230,
  right: -20,   // panel 우측 테두리 가로지름 — 반쯤 외부
  ...
}}>✕</FadeIn>
```

---

## R-025 — 순차 시리즈 라벨(첫 번째 / 두 번째 / ...) 완결성 검사

- **Category**: G
- **Status**: ACTIVE
- **Origin**: 2026-05-19, lesson-8 Scene03 (영상 전반)

**Why**: lesson-8 영상에서 자료구조 3개를 차례로 소개. Scene 07 = "두 번째 — 튜플", Scene 09 = "세 번째 — 셋" 상단 pill 라벨이 있으나 Scene 03 (딕셔너리 도입) 에는 동일 정형의 "첫 번째 — 딕셔너리" pill 이 빠져 있고 다른 디자인(uppercase 단일 타이틀)으로 박혀 있었음. 사용자 지적: "[두 번째 - 튜플], [세 번째 - 셋] 이렇게 두 개가 있는데 [첫번째] 에 해당하는 것이 있는지 확인해주고 없다면 추가해줘". **시각 디자인이 순차 시리즈를 약속하면 (둘째·셋째 라벨이 있으면) 첫째도 같은 정형으로 있어야 학습자가 "아 이게 시리즈구나" 라는 멘탈 모델을 잡는다.** 한 칸 빠지면 시리즈 자체가 깨짐 — 디자인 톤 통일과 별개로 "이 영상은 N가지를 가르친다" 라는 학습 구조 자체에 균열.

**How to apply** (grep):
- 한 lesson 영상 안 scene 파일 grep:
  ```
  rg "두 번째|세 번째|네 번째|다섯 번째|첫 번째" videos/<course>/<lesson>/03-composition/scenes/
  ```
- 결과에서 "N 번째" 가 N ≥ 2 인 라벨이 ≥ 1 개 있으면 → "첫 번째" ~ "(N-1) 번째" 모든 단계 라벨도 같은 정형(pill / 부제 / 색상 / 위치)으로 있어야 fail 아님.
- 정형 일치 검사:
  - pill 의 `padding`, `borderRadius`, `background`, `border`, `fontSize`, `fontWeight` 모두 동일
  - 부제(subtitle) 의 `fontSize`, `fontWeight`, `color`, 강조 토큰 색 동일
  - 절대 위치 `top` 동일
  - 정형이 다르면 (예: 한쪽은 pill, 한쪽은 uppercase title) fail — 통일.
- "첫 번째" 가 *있는데 N≥2 가 없는* 경우는 fail 아님 (그냥 한 개 강조일 수 있음). 양방향 의무 아니고, **N≥2 가 있으면 첫째 의무**.

**Good** (lesson-8 Scene03 v2 — Scene 07/09 와 동일 pill+subtitle 정형):
```tsx
<div style={{ position: "absolute", top: 60, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
  <FadeIn delaySec={REVEAL.headerLabel} translateY={6}>
    <div style={{ padding: "8px 24px", borderRadius: radii.pill, background: colors.accentSoft, ... }}>
      첫 번째 — 딕셔너리
    </div>
  </FadeIn>
  <FadeIn delaySec={REVEAL.headerLabel + 0.4} translateY={6}>
    <div style={{ fontFamily: fonts.sans, fontSize: 22, ... }}>
      <span style={{ color: colors.accentInk, fontWeight: 700 }}>이름표(키)</span>로 짝지은 묶음
    </div>
  </FadeIn>
</div>
```

**Bad** (lesson-8 Scene03 v1):
```tsx
{/* uppercase 타이틀 — Scene 07/09 의 pill 정형과 불일치 */}
<div style={{ position: "absolute", top: 60, ... }}>
  <FadeIn delaySec={0.1} translateY={6}>
    <div style={{ fontFamily: fonts.sans, fontSize: 28, fontWeight: 600, color: colors.accentDeep, textTransform: "uppercase" }}>
      딕셔너리 — 이름표로 꺼내기
    </div>
  </FadeIn>
</div>
{/* "두 번째" / "세 번째" 와 짝이 안 맞음 → 시리즈 깨짐 */}
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
