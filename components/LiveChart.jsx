'use client';

import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

export default function LiveChart({
  data,
  dataKey,
  color,
  label,
  unit,
  min,
  max
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Retrieve the latest value for header display
  const latestValue = data.length > 0 ? data[data.length - 1][dataKey] : 0;
  const displayValue = latestValue !== undefined ? latestValue.toFixed(2) : '0.00';

  if (!mounted) {
    return (
      <div className="bg-[#1a1a2e] border border-white/5 rounded-2xl p-6 h-64 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold tracking-wider uppercase text-slate-400">
            {label}
          </span>
          <span className="text-xs font-mono text-slate-400">
            {displayValue}{unit}
          </span>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <span className="text-xs text-slate-600">Loading chart...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1a1a2e] border border-white/5 rounded-2xl p-6 h-64 flex flex-col justify-between transition-all duration-300 hover:border-white/10 hover:shadow-2xl hover:shadow-indigo-500/5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-semibold tracking-wider uppercase text-slate-400">
            {label}
          </span>
        </div>
        <div className="flex items-baseline gap-0.5">
          <span className="text-2xl font-bold font-mono text-white">
            {displayValue}
          </span>
          <span className="text-sm font-semibold text-slate-400">
            {unit}
          </span>
        </div>
      </div>

      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
          >
            <CartesianGrid stroke="#ffffff10" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="timestamp"
              tick={false}
              axisLine={false}
            />
            <YAxis
              domain={[min, max]}
              tick={{ fill: '#94a3b8', fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e1e38',
                borderColor: '#ffffff10',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '11px',
                fontFamily: 'monospace'
              }}
              labelStyle={{ display: 'none' }}
              formatter={(value) => [`${parseFloat(value).toFixed(2)}${unit}`, label]}
            />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
