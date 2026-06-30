"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode, RefObject } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { useAppStore } from "@/store/app-store";
import { cn } from "@/lib/utils";

const tooltipStyle = {
  background: "rgba(4,6,18,.92)",
  border: "1px solid rgba(159,92,255,.45)",
  borderRadius: 8,
  color: "white",
  boxShadow: "0 0 22px rgba(159,92,255,.35)"
};

export function WeeklyChart({ className = "h-64" }: { className?: string }) {
  const weeklyData = useAppStore(state => state.weeklyData);
  return (
    <ChartFrame className={className}>
      {({ width, height }) => (
        <BarChart width={width} height={height} data={weeklyData} margin={{ top: 10, right: 8, left: -18, bottom: 0 }}>
          <CartesianGrid stroke="rgba(159,92,255,.12)" vertical={false} />
          <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} width={36} />
          <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(159,92,255,.08)" }} />
          <Bar dataKey="completion" radius={[6, 6, 2, 2]} fill="#9f5cff" isAnimationActive={false} />
          <Bar dataKey="focus" radius={[6, 6, 2, 2]} fill="#32e6ff" isAnimationActive={false} />
        </BarChart>
      )}
    </ChartFrame>
  );
}

export function TrendChart({ className = "h-72" }: { className?: string }) {
  const monthlyTrend = useAppStore(state => state.monthlyTrend);
  return (
    <ChartFrame className={className}>
      {({ width, height }) => (
        <AreaChart width={width} height={height} data={monthlyTrend} margin={{ top: 12, right: 12, left: -18, bottom: 0 }}>
          <defs>
            <linearGradient id="xpGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#9f5cff" stopOpacity={0.7} />
              <stop offset="95%" stopColor="#9f5cff" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(159,92,255,.12)" vertical={false} />
          <XAxis dataKey="week" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} width={36} />
          <Tooltip contentStyle={tooltipStyle} />
          <Area
            type="monotone"
            dataKey="xp"
            stroke="#9f5cff"
            fill="url(#xpGradient)"
            strokeWidth={3}
            isAnimationActive={false}
          />
        </AreaChart>
      )}
    </ChartFrame>
  );
}

export function DisciplineLineChart({ className = "h-56" }: { className?: string }) {
  const monthlyTrend = useAppStore(state => state.monthlyTrend);
  return (
    <ChartFrame className={className}>
      {({ width, height }) => (
        <LineChart width={width} height={height} data={monthlyTrend} margin={{ top: 12, right: 12, left: -18, bottom: 0 }}>
          <CartesianGrid stroke="rgba(159,92,255,.12)" vertical={false} />
          <XAxis dataKey="week" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} width={36} />
          <Tooltip contentStyle={tooltipStyle} />
          <Line
            type="monotone"
            dataKey="discipline"
            stroke="#42ffba"
            strokeWidth={3}
            dot={{ r: 5, fill: "#42ffba", stroke: "#07111a", strokeWidth: 2 }}
            isAnimationActive={false}
          />
        </LineChart>
      )}
    </ChartFrame>
  );
}

type ChartSize = { width: number; height: number };

function ChartFrame({ className, children }: { className: string; children: (size: ChartSize) => ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const size = useChartSize(ref, getInitialChartSize(className));

  return (
    <div ref={ref} className={cn("chart-shell relative min-h-44 w-full min-w-0 overflow-hidden rounded-md", className)}>
      {children(size)}
    </div>
  );
}

function useChartSize(ref: RefObject<HTMLDivElement | null>, initialSize: ChartSize) {
  const [size, setSize] = useState<ChartSize>(initialSize);
  const measured = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const update = () => {
      const rect = node.getBoundingClientRect();
      if (rect.width > 48 && rect.height > 48) {
        setSize((current) => {
          const next = {
            width: Math.floor(rect.width),
            height: Math.floor(rect.height)
          };

          if (!measured.current) {
            measured.current = true;
            return next;
          }

          if (current.width === next.width && current.height === next.height) return current;
          return next;
        });
      }
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);

    return () => observer.disconnect();
  }, [ref]);

  return size;
}

function getInitialChartSize(className: string): ChartSize {
  if (className.includes("h-32")) return { width: 560, height: 128 };
  if (className.includes("h-56")) return { width: 640, height: 224 };
  if (className.includes("h-72")) return { width: 720, height: 288 };
  return { width: 680, height: 256 };
}
