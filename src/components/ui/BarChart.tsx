"use client";

import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export type BarData = { label: string; value: number };

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white/90 backdrop-blur-md border border-gray-200 rounded-xl shadow-xl px-4 py-3 min-w-[130px]">
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-bold text-gray-900 mt-0.5">
        {payload[0].value}
        <span className="text-sm font-normal text-gray-400 ml-1">jadwal</span>
      </p>
    </div>
  );
}

const GRADIENTS = [
  { id: "g1", from: "#fbbf24", to: "#f59e0b" },
  { id: "g2", from: "#f472b6", to: "#ec4899" },
  { id: "g3", from: "#22d3ee", to: "#06b6d4" },
  { id: "g4", from: "#a78bfa", to: "#8b5cf6" },
  { id: "g5", from: "#fcd34d", to: "#d4a017" },
  { id: "g6", from: "#fb923c", to: "#f97316" },
];

export default function BarChart({
  title,
  subtitle,
  data,
  emptyMessage = "Tidak ada data",
}: {
  title: string;
  subtitle?: string;
  data: BarData[];
  emptyMessage?: string;
}) {
  if (data.length === 0) {
    return (
      <div className="brutal-box bg-white p-6">
        <h3 className="font-display font-bold text-lg text-brown uppercase tracking-tight">{title}</h3>
        {subtitle && <p className="font-sans text-xs text-brown-light mt-0.5">{subtitle}</p>}
        <p className="font-sans text-sm text-brown-light text-center py-10">{emptyMessage}</p>
      </div>
    );
  }

  const total = data.reduce((s, d) => s + d.value, 0);
  const chartData = data.map((d, i) => ({ ...d, fill: `url(#${GRADIENTS[i % GRADIENTS.length].id})` }));

  return (
    <div className="brutal-box bg-white p-5 md:p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="font-display font-bold text-lg text-brown uppercase tracking-tight">{title}</h3>
          {subtitle && <p className="font-sans text-xs text-brown-light mt-0.5">{subtitle}</p>}
        </div>
        <span className="font-display font-bold text-xs text-brown bg-kelas-yellow border-2 border-brown px-2.5 py-1 brutal-box-sm">
          {total} total
        </span>
      </div>

      {/* SVG defs for gradients */}
      <svg width="0" height="0" className="absolute">
        <defs>
          {GRADIENTS.map((g) => (
            <linearGradient key={g.id} id={g.id} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={g.from} />
              <stop offset="100%" stopColor={g.to} />
            </linearGradient>
          ))}
        </defs>
      </svg>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={260}>
        <RechartsBarChart data={chartData} margin={{ top: 0, right: 4, left: -16, bottom: 0 }} barCategoryGap="28%">
          <CartesianGrid vertical={false} stroke="#e5e7eb" strokeDasharray="3 3" />
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{ fontFamily: "Georgia, serif", fontSize: 12, fill: "#4b4731", fontWeight: 600 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontFamily: "Hanken Grotesk, sans-serif", fontSize: 11, fill: "#6b7280" }}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.03)" }} />
          <Bar dataKey="value" radius={[8, 8, 0, 0]} animationDuration={800} animationEasing="ease-out" />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}
