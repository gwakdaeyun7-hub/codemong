// 주간 리포트 대시보드 섹션들 — Server Component (집계는 getWeeklyDashboard 가 끝내고 여기선 렌더만).
// 활동 스트립(월~일) · KPI 타일 · 푼 문제 목록 · 오류·감점 태그. 축 점수·AI 코멘트는
// <WeeklyReportCard variant="full" /> (client, "열 때 생성") 이 담당.

import Link from "next/link";

import { DIFFICULTY_CHIP_CLASS, DIFFICULTY_LABEL } from "@/components/skill/difficulty";
import type { WeeklyDashboard } from "@/lib/skill/weekly-dashboard-queries";
import { cn } from "@/lib/utils";
import { mypageIcons } from "./icon-map";

const card = "rounded-2xl bg-white p-5 shadow-sm ring-1 ring-zinc-200/80 sm:p-6";

// 요일별 활동 3계열 — 색은 앱 액센트(violet) + sky + amber. dataviz 검증기 통과(CVD ΔE 10.9, 정상 19.8).
// 대비 경고(sky/amber < 3:1)는 막대 위 숫자 라벨 + 범례 + 툴팁으로 보완한다.
const ACTIVITY_SERIES = [
  { key: "videos", label: "강의", color: "#8b5cf6" },
  { key: "exercises", label: "연습", color: "#0ea5e9" },
  { key: "submissions", label: "문제", color: "#f59e0b" },
] as const;

/**
 * 순수 SVG 그룹 막대 차트 — 월~일 × (강의/연습/문제). 차트 라이브러리 없음.
 * y축 눈금은 정수(최대치 6 이하면 1 간격), 격자는 hairline, 막대는 폭 16px·상단 4px 라운드·바닥 각짐,
 * 값이 0인 막대도 얇은 회색 자리표시로 그려 "그날 그 활동이 없었음"이 보이게 한다.
 */
function WeeklyActivityChart({ days }: { days: WeeklyDashboard["days"] }) {
  const W = 720;
  const H = 210;
  const x0 = 30;
  const x1 = W - 8;
  const yTop = 12;
  const yBase = H - 26;
  const plotW = x1 - x0;
  const plotH = yBase - yTop;

  const rawMax = Math.max(0, ...days.flatMap((d) => ACTIVITY_SERIES.map((sr) => d[sr.key])));
  const step = rawMax <= 6 ? 1 : Math.ceil(rawMax / 5);
  const yMax = Math.max(step, Math.ceil(rawMax / step) * step);
  const ticks = Array.from({ length: yMax / step + 1 }, (_, i) => i * step);
  const yOf = (n: number) => yBase - (n / yMax) * plotH;

  const gw = plotW / days.length;
  const bw = 16;
  const gap = 2;
  const groupW = ACTIVITY_SERIES.length * bw + (ACTIVITY_SERIES.length - 1) * gap;

  // 상단만 둥근 막대 경로 (바닥은 각짐)
  const barPath = (x: number, top: number, w: number, bottom: number) => {
    const r = Math.min(4, Math.max(0, (bottom - top) / 2));
    return [
      `M${x},${bottom}`,
      `L${x},${top + r}`,
      `Q${x},${top} ${x + r},${top}`,
      `L${x + w - r},${top}`,
      `Q${x + w},${top} ${x + w},${top + r}`,
      `L${x + w},${bottom}`,
      "Z",
    ].join(" ");
  };

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-auto w-full"
      role="img"
      aria-label="요일별 학습 활동 — 강의·연습·문제 횟수"
    >
      {/* 격자 + y축 눈금 */}
      {ticks.map((t) => (
        <g key={t}>
          <line
            x1={x0}
            x2={x1}
            y1={yOf(t)}
            y2={yOf(t)}
            stroke={t === 0 ? "#d4d4d8" : "#e4e4e7"}
            strokeWidth={1}
          />
          <text x={x0 - 8} y={yOf(t) + 3.5} textAnchor="end" fontSize={10} fill="#a1a1aa">
            {t}
          </text>
        </g>
      ))}

      {/* 막대 */}
      {days.map((d, gi) => {
        const gx = x0 + gi * gw + (gw - groupW) / 2;
        return (
          <g key={d.key}>
            {ACTIVITY_SERIES.map((sr, si) => {
              const n = d[sr.key];
              const x = gx + si * (bw + gap);
              const label = `${d.key} ${sr.label} ${n}회`;
              return (
                <g key={sr.key}>
                  {n > 0 ? (
                    <path d={barPath(x, yOf(n), bw, yBase)} fill={sr.color}>
                      <title>{label}</title>
                    </path>
                  ) : (
                    <rect x={x} y={yBase - 2} width={bw} height={2} fill="#e4e4e7">
                      <title>{label}</title>
                    </rect>
                  )}
                  {n > 0 && (
                    <text
                      x={x + bw / 2}
                      y={yOf(n) - 4}
                      textAnchor="middle"
                      fontSize={10}
                      fontWeight={600}
                      fill="#52525b"
                    >
                      {n}
                    </text>
                  )}
                </g>
              );
            })}
            <text
              x={x0 + gi * gw + gw / 2}
              y={yBase + 17}
              textAnchor="middle"
              fontSize={11}
              fontWeight={d.active ? 600 : 400}
              fill={d.active ? "#3f3f46" : "#a1a1aa"}
            >
              {d.weekday}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/** 지난주 활동 — 요일별 막대 차트 + KPI 4개 */
export function WeeklyActivitySection({ data }: { data: WeeklyDashboard }) {
  const Flame = mypageIcons.flame;
  const tiles = [
    { label: "학습한 날", value: `${data.activeDays}일`, sub: "7일 중" },
    { label: "본 강의", value: `${data.videos}개`, sub: "영상 90% 이상 시청" },
    {
      label: "연습 통과",
      value: `${data.exercisesPassed}개`,
      sub: data.exerciseAttempts > 0 ? `시도 ${data.exerciseAttempts}회` : "시도 없음",
    },
    {
      label: "문제 제출",
      value: `${data.submissionCount}회`,
      sub:
        data.submissionCount > 0
          ? `통과율 ${data.passRate}% · 해결 ${data.solvedProblems}문제`
          : "실력향상 제출 없음",
    },
  ];

  return (
    <section className={card}>
      <h2 className="flex items-center gap-2 text-base font-bold text-zinc-900">
        <Flame className="size-4 text-violet-600" aria-hidden />
        지난주 활동
      </h2>

      {/* 요일별 활동 막대 차트 (순수 SVG — 축·격자·범례 포함, 0인 날도 자리 표시) */}
      <div className="mt-4">
        <WeeklyActivityChart days={data.days} />
        <div className="mt-2 flex items-center gap-3 text-[11px] text-zinc-500">
          {ACTIVITY_SERIES.map((sr) => (
            <span key={sr.key} className="inline-flex items-center gap-1">
              <span
                className="inline-block size-2 rounded-sm"
                style={{ backgroundColor: sr.color }}
              />
              {sr.label}
            </span>
          ))}
        </div>
      </div>

      {/* KPI 타일 */}
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {tiles.map((t) => (
          <div key={t.label} className="rounded-xl bg-zinc-50 px-3 py-3 ring-1 ring-zinc-200">
            <p className="text-[11px] font-medium text-zinc-500">{t.label}</p>
            <p className="mt-0.5 text-lg font-bold text-zinc-900 tabular-nums">{t.value}</p>
            <p className="text-[11px] text-zinc-400">{t.sub}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/** 지난주에 푼 실력향상 문제 목록 */
export function WeeklyProblemsSection({ data }: { data: WeeklyDashboard }) {
  const Target = mypageIcons.target;
  const ChevronRight = mypageIcons.chevronRight;

  return (
    <section className={card}>
      <div className="flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-base font-bold text-zinc-900">
          <Target className="size-4 text-violet-600" aria-hidden />
          지난주에 푼 문제
        </h2>
        {data.problems.length > 0 && (
          <span className="text-xs text-zinc-500 tabular-nums">
            {data.solvedProblems}/{data.problems.length} 해결
          </span>
        )}
      </div>

      {data.problems.length === 0 ? (
        <p className="mt-2 text-[13px] leading-relaxed text-zinc-500">
          지난주에는 실력향상 문제를 풀지 않았어요.{" "}
          <Link href="/skill" className="font-semibold text-violet-600 hover:text-violet-700">
            문제 풀러 가기 →
          </Link>
        </p>
      ) : (
        <ul className="mt-3 flex flex-col gap-1.5">
          {data.problems.map((p) => (
            <li key={`${p.lessonId}/${p.problemId}`}>
              <Link
                href={p.href}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 ring-1 ring-zinc-200 transition hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
              >
                <span
                  className={cn(
                    "shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold",
                    p.passed
                      ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                      : "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
                  )}
                >
                  {p.passed ? "정답" : "오답"}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-semibold text-zinc-900">
                    <span className="mr-1.5 text-[11px] font-semibold text-violet-600">
                      {p.lessonNumber}강
                    </span>
                    {p.number}. {p.title}
                  </span>
                  <span className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[11px] text-zinc-500">
                    <span
                      className={cn(
                        "rounded-full px-1.5 py-px",
                        DIFFICULTY_CHIP_CLASS[p.difficulty],
                      )}
                    >
                      {DIFFICULTY_LABEL[p.difficulty]}
                    </span>
                    <span>
                      케이스 {p.bestPassed}/{p.casesTotal}
                    </span>
                    <span>· 시도 {p.attempts}회</span>
                    {p.lastErrorType && (
                      <span className="rounded bg-zinc-100 px-1.5 py-px font-mono text-[10px] text-zinc-500">
                        {p.lastErrorType}
                      </span>
                    )}
                  </span>
                </span>
                <ChevronRight className="size-4 shrink-0 text-zinc-300" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

/** 자주 난 오류·감점 태그 */
export function WeeklyTagsSection({ data }: { data: WeeklyDashboard }) {
  const Alert = mypageIcons.alert;

  return (
    <section className={card}>
      <h2 className="flex items-center gap-2 text-base font-bold text-zinc-900">
        <Alert className="size-4 text-violet-600" aria-hidden />
        자주 난 오류·감점
      </h2>
      {data.tags.length === 0 ? (
        <p className="mt-2 text-[13px] leading-relaxed text-zinc-500">
          {data.submissionCount + data.exerciseAttempts > 0
            ? "지난주 제출에서는 실행 오류나 AI 감점이 없었어요."
            : "제출 기록이 없어 아직 볼 수 있는 오류가 없어요."}
        </p>
      ) : (
        <>
          <ul className="mt-3 flex flex-wrap gap-2">
            {data.tags.map((t) => (
              <li
                key={t.label}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-medium ring-1",
                  t.kind === "error"
                    ? "bg-rose-50 text-rose-700 ring-rose-200"
                    : "bg-amber-50 text-amber-700 ring-amber-200",
                )}
              >
                {t.kind === "error" && <span className="font-mono text-[11px]">{t.label}</span>}
                {t.kind === "deduction" && <span>{t.label}</span>}
                <span className="tabular-nums opacity-70">×{t.count}</span>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-[11px] text-zinc-400">
            빨강 = 실행 중 난 파이썬 오류, 노랑 = AI 진단에서 감점된 축. 횟수는 지난주 제출 기준.
          </p>
        </>
      )}
    </section>
  );
}
