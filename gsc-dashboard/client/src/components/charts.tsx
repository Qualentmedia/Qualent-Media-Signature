import { useMemo, useState } from 'react';
import { shortDate, fmtInt } from '../lib/format';

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  fill?: boolean;
}

/** Tiny inline trend line — used in tables and alert cards. */
export function Sparkline({ data, width = 120, height = 32, color = '#2563eb', fill = true }: SparklineProps) {
  if (!data.length) return null;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const span = max - min || 1;
  const step = width / Math.max(data.length - 1, 1);
  const pts = data.map((v, i) => [i * step, height - ((v - min) / span) * (height - 4) - 2]);
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  const area = `${line} L${width},${height} L0,${height} Z`;
  return (
    <svg width={width} height={height} className="overflow-visible">
      {fill && <path d={area} fill={color} opacity={0.1} />}
      <path d={line} fill="none" stroke={color} strokeWidth={1.5} strokeLinejoin="round" />
    </svg>
  );
}

interface LinePoint {
  date: string;
  value: number;
}

interface MultiLineProps {
  series: { name: string; color: string; points: LinePoint[] }[];
  height?: number;
  yFormat?: (n: number) => string;
}

/** Responsive multi-series line chart with hover tooltip. */
export function LineChart({ series, height = 260, yFormat = fmtInt }: MultiLineProps) {
  const [hover, setHover] = useState<number | null>(null);
  const W = 760;
  const H = height;
  const padL = 52;
  const padB = 28;
  const padT = 12;
  const padR = 12;

  const { all, dates } = useMemo(() => {
    const dates = series[0]?.points.map((p) => p.date) ?? [];
    const all = series.flatMap((s) => s.points.map((p) => p.value));
    return { all, dates };
  }, [series]);

  if (!dates.length) return <div className="text-sm text-slate-400 p-8 text-center">No data</div>;

  const max = Math.max(...all, 1);
  const min = 0;
  const span = max - min || 1;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const x = (i: number) => padL + (i / Math.max(dates.length - 1, 1)) * plotW;
  const y = (v: number) => padT + plotH - ((v - min) / span) * plotH;

  const ticks = 4;
  const yTicks = Array.from({ length: ticks + 1 }, (_, i) => (max / ticks) * i);
  const xEvery = Math.ceil(dates.length / 7);

  return (
    <div className="w-full overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: H }}
        onMouseLeave={() => setHover(null)}>
        {yTicks.map((t, i) => (
          <g key={i}>
            <line x1={padL} x2={W - padR} y1={y(t)} y2={y(t)} stroke="#eef2f7" />
            <text x={padL - 8} y={y(t) + 4} textAnchor="end" fontSize={11} fill="#94a3b8">
              {yFormat(t)}
            </text>
          </g>
        ))}
        {dates.map((d, i) =>
          i % xEvery === 0 ? (
            <text key={d} x={x(i)} y={H - 8} textAnchor="middle" fontSize={11} fill="#94a3b8">
              {shortDate(d)}
            </text>
          ) : null
        )}
        {series.map((s) => {
          const path = s.points
            .map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(p.value).toFixed(1)}`)
            .join(' ');
          return <path key={s.name} d={path} fill="none" stroke={s.color} strokeWidth={2} strokeLinejoin="round" />;
        })}
        {/* hover layer */}
        {dates.map((_, i) => (
          <rect
            key={i}
            x={x(i) - plotW / dates.length / 2}
            y={padT}
            width={plotW / dates.length}
            height={plotH}
            fill="transparent"
            onMouseEnter={() => setHover(i)}
          />
        ))}
        {hover !== null && (
          <>
            <line x1={x(hover)} x2={x(hover)} y1={padT} y2={padT + plotH} stroke="#cbd5e1" strokeDasharray="3 3" />
            {series.map((s) => (
              <circle key={s.name} cx={x(hover)} cy={y(s.points[hover].value)} r={3.5} fill={s.color} />
            ))}
          </>
        )}
      </svg>
      <div className="flex items-center gap-4 justify-center mt-1">
        {series.map((s) => (
          <div key={s.name} className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="inline-block w-3 h-3 rounded-sm" style={{ background: s.color }} />
            {s.name}
            {hover !== null && (
              <span className="font-semibold text-slate-800">: {yFormat(s.points[hover].value)}</span>
            )}
          </div>
        ))}
        {hover !== null && (
          <span className="text-xs text-slate-400">({shortDate(dates[hover])})</span>
        )}
      </div>
    </div>
  );
}

interface BarDatum {
  label: string;
  value: number;
}

/** Horizontal bar chart for top-N breakdowns. */
export function BarChart({ data, color = '#2563eb', valueFormat = fmtInt }: {
  data: BarDatum[];
  color?: string;
  valueFormat?: (n: number) => string;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="space-y-2">
      {data.map((d) => (
        <div key={d.label} className="flex items-center gap-3">
          <div className="w-40 truncate text-sm text-slate-600 text-right" title={d.label}>
            {d.label}
          </div>
          <div className="flex-1 bg-slate-100 rounded h-6 relative overflow-hidden">
            <div
              className="h-full rounded transition-all"
              style={{ width: `${(d.value / max) * 100}%`, background: color }}
            />
          </div>
          <div className="w-20 text-sm font-semibold text-slate-700 text-right">
            {valueFormat(d.value)}
          </div>
        </div>
      ))}
    </div>
  );
}
