"use client";

import React from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

/* ------------------------------------------------------------------ */
/*  Custom Tooltip                                                     */
/* ------------------------------------------------------------------ */

function ChartTooltip({
  active,
  payload,
  label,
  valueLabel = "Value",
  formatter,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
  valueLabel?: string;
  formatter?: (v: number) => string;
}) {
  if (!active || !payload?.length) return null;
  const val = payload[0].value;
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 text-xs shadow-xl">
      <p className="mb-1 text-muted-foreground">{label}</p>
      <p className="font-semibold text-foreground">
        {valueLabel}: {formatter ? formatter(val) : val.toLocaleString()}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Views Line / Area Chart                                            */
/* ------------------------------------------------------------------ */

export interface ViewsDataPoint {
  date: string;
  views: number;
}

export function ViewsLineChart({ data }: { data: ViewsDataPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#27272a"
          vertical={false}
        />
        <XAxis
          dataKey="date"
          tick={{ fill: "#71717a", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          dy={8}
        />
        <YAxis
          tick={{ fill: "#71717a", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          dx={-8}
          tickFormatter={(v: number) =>
            v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v)
          }
        />
        <Tooltip
          content={<ChartTooltip valueLabel="Views" />}
          cursor={{ stroke: "#6366f1", strokeWidth: 1, strokeDasharray: "4 4" }}
        />
        <Area
          type="monotone"
          dataKey="views"
          stroke="#6366f1"
          strokeWidth={2}
          fill="url(#viewsGradient)"
          dot={false}
          activeDot={{ r: 4, fill: "#6366f1", stroke: "#09090b", strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

/* ------------------------------------------------------------------ */
/*  Top Content Bar Chart                                              */
/* ------------------------------------------------------------------ */

export interface TopContentDataPoint {
  name: string;
  views: number;
}

export function TopContentBarChart({ data }: { data: TopContentDataPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 0, right: 8, left: 0, bottom: 0 }}
        barCategoryGap="20%"
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#27272a"
          horizontal={false}
        />
        <XAxis
          type="number"
          tick={{ fill: "#71717a", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="name"
          tick={{ fill: "#a1a1aa", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          width={140}
          tickFormatter={(v: string) =>
            v.length > 22 ? v.slice(0, 22) + "..." : v
          }
        />
        <Tooltip content={<ChartTooltip valueLabel="Views" />} cursor={{ fill: "#18181b" }} />
        <Bar dataKey="views" radius={[0, 4, 4, 0]} maxBarSize={28}>
          {data.map((_, i) => (
            <Cell
              key={i}
              fill={i === 0 ? "#6366f1" : i < 3 ? "#818cf8" : "#4f46e5"}
              fillOpacity={1 - i * 0.06}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

/* ------------------------------------------------------------------ */
/*  Engagement Heatmap (horizontal segmented bar)                      */
/* ------------------------------------------------------------------ */

export interface EngagementSegment {
  second: number;
  intensity: number; // 0-1
}

export function EngagementHeatmap({ data }: { data: EngagementSegment[] }) {
  const max = Math.max(...data.map((d) => d.intensity), 1);
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>0:00</span>
        <span>Most watched segments</span>
        <span>
          {Math.floor(data.length / 60)}:{String(data.length % 60).padStart(2, "0")}
        </span>
      </div>
      <div className="flex h-10 w-full gap-px overflow-hidden rounded-md">
        {data.map((seg, i) => {
          const opacity = 0.15 + (seg.intensity / max) * 0.85;
          return (
            <div
              key={i}
              className="flex-1 transition-colors"
              style={{ backgroundColor: `rgba(99,102,241,${opacity})` }}
              title={`${Math.floor(seg.second / 60)}:${String(seg.second % 60).padStart(2, "0")} - ${Math.round(seg.intensity * 100)}%`}
            />
          );
        })}
      </div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <div className="h-2 w-2 rounded-sm bg-indigo-500/20" />
        <span>Low</span>
        <div className="h-2 w-2 rounded-sm bg-indigo-500/60" />
        <span>Medium</span>
        <div className="h-2 w-2 rounded-sm bg-indigo-500" />
        <span>High</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Completion Funnel                                                  */
/* ------------------------------------------------------------------ */

export interface FunnelStep {
  label: string;
  value: number;
}

export function CompletionFunnel({ data }: { data: FunnelStep[] }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="space-y-3">
      {data.map((step, i) => {
        const pct = (step.value / max) * 100;
        const dropoff =
          i > 0
            ? Math.round(((data[i - 1].value - step.value) / data[i - 1].value) * 100)
            : 0;
        return (
          <div key={step.label} className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-foreground">{step.label}</span>
              <div className="flex items-center gap-3">
                {i > 0 && dropoff > 0 && (
                  <span className="text-xs text-red-400">-{dropoff}%</span>
                )}
                <span className="font-medium tabular-nums text-foreground">
                  {step.value.toLocaleString()}
                </span>
              </div>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${pct}%`,
                  background:
                    i === 0
                      ? "#6366f1"
                      : i === data.length - 1
                        ? "#8b5cf6"
                        : `linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)`,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
