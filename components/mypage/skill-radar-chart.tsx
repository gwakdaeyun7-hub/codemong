import type { RadarPoint } from "@/lib/learning/skill-radar";

// 순수 SVG 레이더(스파이더) 차트 — Server Component (인터랙션/브라우저 API 없음).
// 사용자 폴리곤(violet) 과 전체 평균 곡선(amber 실선) 을 같은 N축 위에 겹쳐 그린다.
// 좌표는 삼각함수로 직접 계산 — 차트 라이브러리 의존성 없음.

const VW = 360; // viewBox 가로
const VH = 300; // viewBox 세로
const CX = 180; // 중심 x
const CY = 150; // 중심 y
const R = 100; // 최대 반지름 (바깥에 라벨 여백 확보)
const LABEL_GAP = 14; // 라벨을 vertex 바깥으로 띄우는 거리
const RINGS = [0.25, 0.5, 0.75, 1]; // 동심 격자 비율

// 축 i 의 각도(라디안). 위(-90°)에서 시작해 시계방향으로 등분.
function angleOf(i: number, n: number): number {
  return ((-90 + (360 / n) * i) * Math.PI) / 180;
}

// 반지름 비율(0..1) 위치의 좌표.
function pointAt(i: number, n: number, ratio: number): { x: number; y: number } {
  const a = angleOf(i, n);
  return { x: CX + R * ratio * Math.cos(a), y: CY + R * ratio * Math.sin(a) };
}

// 값 배열(0..100) → SVG polygon points 문자열.
function polygonPoints(values: number[]): string {
  const n = values.length;
  return values
    .map((v, i) => {
      const ratio = Math.max(0, Math.min(100, v)) / 100;
      const p = pointAt(i, n, ratio);
      return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
    })
    .join(" ");
}

export function SkillRadarChart({ points }: { points: RadarPoint[] }) {
  const n = points.length;
  if (n === 0) return null;

  const userPoly = polygonPoints(points.map((p) => p.userValue));
  const basePoly = polygonPoints(points.map((p) => p.averageValue));

  return (
    <svg
      viewBox={`0 0 ${VW} ${VH}`}
      className="mx-auto h-auto w-full max-w-[360px]"
      role="img"
      aria-label="코딩 역량 레이더 차트 (나 vs 전체 평균)"
    >
      {/* 동심 격자 */}
      {RINGS.map((r) => (
        <polygon
          key={r}
          points={polygonPoints(points.map(() => r * 100))}
          fill="none"
          stroke="#e4e4e7"
          strokeWidth={1}
        />
      ))}

      {/* 스포크 (center → vertex) */}
      {points.map((p, i) => {
        const v = pointAt(i, n, 1);
        return (
          <line
            key={p.axisKey}
            x1={CX}
            y1={CY}
            x2={v.x}
            y2={v.y}
            stroke="#e4e4e7"
            strokeWidth={1}
          />
        );
      })}

      {/* 전체 평균 곡선 폴리곤 (amber 실선 — 사용자 violet 과 뚜렷이 대비) */}
      <polygon
        points={basePoly}
        fill="#f59e0b"
        fillOpacity={0.12}
        stroke="#d97706"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />

      {/* 사용자 폴리곤 (violet) */}
      <polygon
        points={userPoly}
        fill="#8b5cf6"
        fillOpacity={0.22}
        stroke="#7c3aed"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />

      {/* 사용자 꼭짓점 dot */}
      {points.map((p, i) => {
        const v = pointAt(i, n, Math.max(0, Math.min(100, p.userValue)) / 100);
        return <circle key={p.axisKey} cx={v.x} cy={v.y} r={2.5} fill="#7c3aed" />;
      })}

      {/* 축 라벨 */}
      {points.map((p, i) => {
        const a = angleOf(i, n);
        const cos = Math.cos(a);
        const lx = CX + (R + LABEL_GAP) * cos;
        const ly = CY + (R + LABEL_GAP) * Math.sin(a);
        const anchor = cos < -0.3 ? "end" : cos > 0.3 ? "start" : "middle";
        return (
          <text
            key={p.axisKey}
            x={lx}
            y={ly}
            textAnchor={anchor}
            dominantBaseline="middle"
            className="fill-zinc-500 text-[11px] font-medium"
          >
            {p.label}
          </text>
        );
      })}
    </svg>
  );
}
