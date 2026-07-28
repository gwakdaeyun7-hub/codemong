# AI 채점 품질 검증 하네스

`lib/ai/rubric.ts`(채점 프롬프트)를 수정할 때 **반드시 이 스위트로 회귀 검증**한다.
규칙 하나를 추가하면 다른 시나리오가 회귀할 수 있다 — 실제로 2026-07-16 튜닝에서
"실행 실패 시 의도 기준" 규칙이 인젝션 방어를 뚫리게 만든 사례가 있었다.

프로덕션 코드(`lib/ai/rubric.ts`)를 Node 24 `--experimental-strip-types` 로 직접 import
하므로 프롬프트 드리프트가 없다. 문제 데이터는 `../problems-draft/*.json`
(lib/problems/lesson-N.ts 의 원천 초안 — lib 수정 시 여기도 동기화할 것).

## 실행 (프로젝트 루트 기준 상대 아님 — 이 폴더에서)

```bash
cd scripts/ai-eval

# 1) 결정적 채점 (Python 3.10+, API 안 씀)
py -X utf8 grade_samples.py      # 7시나리오 (samples-graded.json)
py -X utf8 grade_corpus.py       # 합성 코퍼스 64건 (corpus-graded.json)

# 2) Gemini 채점 (.env.local 의 GEMINI_API_KEY 사용, 무료 티어 RPM 주의)
node --experimental-strip-types run_regression.mjs   # 핵심 회귀 4건 (S1 모범/S3 오답/S6 문법오류/S7 인젝션) — 프롬프트 수정 시 최소 필수
node --experimental-strip-types run_corpus.mjs       # 64건 전량 (~7분)
node --experimental-strip-types adversarial.mjs      # 인젝션 10종 + 대조군
node --experimental-strip-types run_stability.mjs    # 재현성 (같은 입력 5회)

# 3) 일치율 분석 (블라인드 전문가 채점 vs Gemini)
py -X utf8 analyze_agreement.py  # → agreement-report.txt
```

## 2026-07-16 최종 결과 (발표 인용 가능)

- 재현성: 같은 입력 10/10 동일 점수
- 34문제 전수(모범답안): 이상 0건
- 전문가 대조 (합성 64건, 블라인드): 축별 평균절대오차 개념 6.9 / 효율 4.6 / 해석 6.2점,
  ±20점 이내 일치 93~96%, 방향 편향 ±2 이내
- 적대적 인젝션 10종: 전부 방어 (점수 부풀림·정답 유출·프롬프트 유출 없음)
- 남은 한계: 실사용 학습자 데이터 미검증 (베타 운영에서 수집), 축 귀속(같은 결함을
  어느 축에 감점하는가)은 전문가와 ±1축 차이가 날 수 있음
