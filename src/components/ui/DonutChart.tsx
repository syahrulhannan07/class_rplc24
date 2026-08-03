"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export type DonutData = { label: string; value: number; color: string };

const COLORS = [
  { fill: "#fbbf24", stroke: "#f59e0b" },
  { fill: "#f472b6", stroke: "#ec4899" },
  { fill: "#22d3ee", stroke: "#06b6d4" },
  { fill: "#a78bfa", stroke: "#8b5cf6" },
  { fill: "#fb923c", stroke: "#f97316" },
  { fill: "#34d399", stroke: "#10b981" },
];

type TooltipProps = {
  active?: boolean;
  payload?: { payload?: { fill?: string }; name?: string; value?: number }[];
};

function CustomTooltip({ active, payload }: TooltipProps) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="bg-white/90 backdrop-blur-md border border-gray-200 rounded-xl shadow-xl px-4 py-3 min-w-[130px]">
      <div className="flex items-center gap-2">
        <span className="w-3 h-3 rounded-sm" style={{ background: item.payload?.fill }} />
        <p className="text-sm font-semibold text-gray-800">{item.name}</p>
      </div>
      <p className="text-xl font-bold text-gray-900 mt-1">
        {item.value}
        <span className="text-sm font-normal text-gray-400 ml-1">item</span>
      </p>
    </div>
  );
}

export default function DonutChart({
  title,
  subtitle,
  data,
  emptyMessage = "Tidak ada data",
}: {
  title: string;
  subtitle?: string;
  data: DonutData[];
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
  const chartData = data.map((d, i) => ({
    name: d.label,
    value: d.value,
    fill: d.color || COLORS[i % COLORS.length].fill,
  }));

  return (
    <div className="brutal-box bg-white p-5 md:p-6">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="font-display font-bold text-lg text-brown uppercase tracking-tight">{title}</h3>
          {subtitle && <p className="font-sans text-xs text-brown-light mt-0.5">{subtitle}</p>}
        </div>
        <span className="font-display font-bold text-xs text-brown bg-kelas-yellow border-2 border-brown px-2.5 py-1 brutal-box-sm">
          {total} total
        </span>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-6 mt-2">
        <ResponsiveContainer width="100%" height={220} className="max-w-[220px]">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={90}
              dataKey="value"
              strokeWidth={2}
              stroke="#1f1c0b"
              animationDuration={800}
              animationEasing="ease-out"
            >
              {chartData.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center">
          {chartData.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm border border-brown/30" style={{ background: item.fill }} />
              <span className="font-serif font-bold text-xs text-brown">{item.name}</span>
              <span className="font-display font-bold text-xs text-brown">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
