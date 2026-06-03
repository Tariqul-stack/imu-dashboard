'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import LiveChart from '../../components/LiveChart';
import GaitCounter from '../../components/GaitCounter';
import ExportCSV from '../../components/ExportCSV';

const Cube3D = dynamic(() => import('../../components/Cube3D'), { ssr: false });


export default function IMUDashboard() {
  const [connected, setConnected] = useState(false);
  const [imuData, setImuData] = useState({
    roll: 0,
    pitch: 0,
    yaw: 0,
    ax: 0,
    ay: 0,
    az: 9.8,
    timestamp: 0
  });
  const [history, setHistory] = useState([]);


  useEffect(() => {
    let ws = null;
    let reconnectTimeout = null;

    function connect() {
      // Connect to the local WebSocket server
      const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080';
      ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        setConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setImuData(data);
          setHistory((prev) => {
            const nextHistory = [...prev, data];
            return nextHistory.slice(-150);
          });
        } catch (error) {
          console.error('Error parsing IMU data:', error);
        }
      };

      ws.onclose = () => {
        setConnected(false);
        // Attempt reconnection after 3 seconds
        reconnectTimeout = setTimeout(connect, 3000);
      };

      ws.onerror = (err) => {
        console.error('WebSocket error:', err);
        ws.close();
      };
    }

    connect();

    // Clean up websocket and any pending reconnect timeouts on unmount
    return () => {
      if (ws) {
        ws.onclose = null;
        ws.close();
      }
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
    };
  }, []);

  // Format timestamp to localized time with milliseconds
  const formatTime = (ts) => {
    if (!ts) return '--:--:--';
    const date = new Date(ts);
    return date.toLocaleTimeString() + '.' + String(date.getMilliseconds()).padStart(3, '0');
  };

  // IMU parameters metadata for layout mapping
  const parameters = [
    { label: 'Roll', value: imuData.roll, unit: '°', desc: 'X-Axis Rotation' },
    { label: 'Pitch', value: imuData.pitch, unit: '°', desc: 'Y-Axis Rotation' },
    { label: 'Yaw', value: imuData.yaw, unit: '°', desc: 'Z-Axis Rotation' },
    { label: 'Acceleration X (ax)', value: imuData.ax, unit: ' g', desc: 'Linear X Acceleration' },
    { label: 'Acceleration Y (ay)', value: imuData.ay, unit: ' g', desc: 'Linear Y Acceleration' },
    { label: 'Acceleration Z (az)', value: imuData.az, unit: ' g', desc: 'Linear Z Acceleration' }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-100 flex flex-col font-sans antialiased selection:bg-indigo-500/30 selection:text-white">
      {/* Top Header Bar */}
      <header className="border-b border-white/5 bg-[#0e0e17]/85 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
            I
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              IMU Sensor Dashboard
            </h1>
            <p className="text-xs text-slate-500">Real-time Inertial Measurement Unit telemetry</p>
          </div>
        </div>

        {/* Connection Status Indicator */}
        <div className="flex items-center gap-3">
          <ExportCSV history={history} />
          <div className="flex items-center gap-2.5 bg-white/5 border border-white/5 px-4 py-2 rounded-full">
            <span className="relative flex h-2 w-2">
              {connected && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              )}
              <span className={`relative inline-flex rounded-full h-2 w-2 ${connected ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
            </span>
            <span className="text-xs font-semibold tracking-wider uppercase text-slate-300">
              {connected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 flex flex-col gap-6">
        
        {/* System Overview Details */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#0e0e17] border border-white/5 p-6 rounded-2xl">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">System Telemetry</h2>
            <div className="mt-2 text-xs text-slate-500 flex flex-wrap gap-x-6 gap-y-2">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 font-medium">Update Rate:</span> 
                <span className="text-indigo-400 font-semibold">~60 Hz (16ms)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 font-medium">Server URL:</span> 
                <span className="text-indigo-400 font-semibold">ws://localhost:8080</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 font-medium">Raw Timestamp:</span> 
                <span className="text-indigo-400 font-mono font-semibold">{imuData.timestamp || 'N/A'}</span>
              </div>
            </div>
          </div>
          
          <div className="text-xs text-slate-400 font-mono bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
            {formatTime(imuData.timestamp)}
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {parameters.map((param) => {
            const displayValue = param.value !== undefined ? param.value.toFixed(2) : '0.00';
            
            // Map header accent gradients for each type of measurement
            let borderAccent = 'from-indigo-500 to-indigo-300';
            if (param.label.includes('Roll')) borderAccent = 'from-cyan-500 to-cyan-300';
            else if (param.label.includes('Pitch')) borderAccent = 'from-fuchsia-500 to-fuchsia-300';
            else if (param.label.includes('Yaw')) borderAccent = 'from-amber-500 to-amber-300';
            else if (param.label.includes('X')) borderAccent = 'from-emerald-500 to-emerald-300';
            else if (param.label.includes('Y')) borderAccent = 'from-sky-500 to-sky-300';
            else if (param.label.includes('Z')) borderAccent = 'from-rose-500 to-rose-300';

            return (
              <div
                key={param.label}
                className="group relative bg-[#1a1a2e] border border-white/5 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/10 hover:shadow-2xl hover:shadow-indigo-500/5 flex flex-col justify-between overflow-hidden"
              >
                {/* Visual top border accent */}
                <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${borderAccent} opacity-50 transition-opacity duration-300 group-hover:opacity-100`} />

                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold tracking-wider uppercase text-slate-400">
                      {param.label}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium tracking-wide uppercase px-2 py-0.5 rounded bg-white/5">
                      {param.desc}
                    </span>
                  </div>
                  
                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-4xl font-bold font-mono tracking-tight text-white group-hover:scale-[1.02] transition-transform duration-200 block">
                      {displayValue}
                    </span>
                    <span className="text-lg font-semibold text-slate-400">
                      {param.unit}
                    </span>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between text-[9px] text-slate-500 font-mono border-t border-white/5 pt-4">
                  <span>TELEMETRY: LIVE</span>
                  <span className="text-indigo-400/80">60FPS</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 3D ORIENTATION */}
        <section className="flex flex-col gap-4 mt-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 border-l-2 border-indigo-500 pl-2">
            3D ORIENTATION
          </h2>
          <div className="bg-[#1a1a2e] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center gap-4">
            <Cube3D roll={imuData.roll} pitch={imuData.pitch} yaw={imuData.yaw} />
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">
              Real-time 3D orientation from IMU data
            </span>
          </div>
        </section>

        {/* GAIT DETECTION */}
        <section className="flex flex-col gap-4 mt-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 border-l-2 border-emerald-500 pl-2">
            GAIT DETECTION
          </h2>
          <GaitCounter az={imuData.az} timestamp={imuData.timestamp} />
        </section>

        {/* ORIENTATION CHARTS */}
        <section className="flex flex-col gap-4 mt-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 border-l-2 border-indigo-500 pl-2">
            ORIENTATION CHARTS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <LiveChart
              data={history}
              dataKey="roll"
              color="#3a86ff"
              label="Roll"
              unit="°"
              min={-35}
              max={35}
            />
            <LiveChart
              data={history}
              dataKey="pitch"
              color="#8338ec"
              label="Pitch"
              unit="°"
              min={-25}
              max={25}
            />
            <LiveChart
              data={history}
              dataKey="yaw"
              color="#ff006e"
              label="Yaw"
              unit="°"
              min={0}
              max={360}
            />
          </div>
        </section>

        {/* ACCELEROMETER CHARTS */}
        <section className="flex flex-col gap-4 mt-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 border-l-2 border-emerald-500 pl-2">
            ACCELEROMETER CHARTS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <LiveChart
              data={history}
              dataKey="ax"
              color="#06d6a0"
              label="AX"
              unit="g"
              min={-1}
              max={1}
            />
            <LiveChart
              data={history}
              dataKey="ay"
              color="#ffbe0b"
              label="AY"
              unit="g"
              min={-1}
              max={1}
            />
            <LiveChart
              data={history}
              dataKey="az"
              color="#fb5607"
              label="AZ"
              unit="g"
              min={9.5}
              max={10.1}
            />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-auto py-6 border-t border-white/5 bg-[#07070b] text-center text-xs text-slate-600">
        <p>© 2026 IMU Telemetry Systems. All rights reserved.</p>
      </footer>
    </div>
  );
}
