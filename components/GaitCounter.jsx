'use client';

import React, { useState, useEffect, useRef } from 'react';

export default function GaitCounter({ az, timestamp }) {
  const [stepCount, setStepCount] = useState(0);
  const [lastStepTime, setLastStepTime] = useState(0);
  const prevAz = useRef(9.8);

  useEffect(() => {
    const threshold = 9.6;
    const refractoryInterval = 300;

    // Detect step: az crosses below threshold from above, with refractory guard
    if (
      az < threshold &&
      prevAz.current >= threshold &&
      timestamp - lastStepTime > refractoryInterval
    ) {
      setStepCount((prev) => prev + 1);
      setLastStepTime(timestamp);
    }

    // Always update previous az value
    prevAz.current = az;
  }, [az]);

  return (
    <div className="group relative bg-[#1a1a2e] border border-white/5 rounded-2xl p-6 transition-all duration-300 hover:border-white/10 hover:shadow-2xl hover:shadow-emerald-500/5 overflow-hidden">
      {/* Visual top border accent */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500 to-teal-400 opacity-50 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="flex items-center justify-between mb-6">
        <span className="text-xs font-semibold tracking-wider uppercase text-slate-400">
          Gait Detection
        </span>
        <span className="text-[10px] text-slate-500 font-medium tracking-wide uppercase px-2 py-0.5 rounded bg-white/5">
          Pedometer
        </span>
      </div>

      <div className="flex flex-col items-center gap-2">
        <span className="text-6xl font-bold font-mono tracking-tight text-white transition-transform duration-200 group-hover:scale-[1.02]">
          {stepCount}
        </span>
        <span className="text-sm font-medium text-slate-400 uppercase tracking-wider">
          Steps Detected
        </span>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
        <span className="text-[9px] text-slate-500 font-mono">
          Threshold: az &lt; 9.6 | Refractory: 300ms
        </span>
        <button
          onClick={() => setStepCount(0)}
          className="text-[10px] font-semibold uppercase tracking-wider text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 px-3 py-1 rounded-lg transition-all duration-200 cursor-pointer"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
