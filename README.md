# IMU Sensor Dashboard

A real-time IMU sensor data visualization dashboard built with Next.js, WebSocket, Recharts, and Three.js — inspired by research on wearable wireless IMU systems for real-time locomotion sensing.

## Live Demo

- **Frontend:** https://imu-dashboard-six.vercel.app
- **WebSocket Server:** https://imu-dashboard-production.up.railway.app

## Features

- Real-time WebSocket data streaming at ~60Hz
- Live Roll / Pitch / Yaw orientation charts
- 3D cube visualization responding to IMU orientation data
- Gait step detection with threshold and refractory interval algorithm
- Accelerometer XYZ live charts
- CSV data export

## Tech Stack

- Next.js 16
- WebSocket (ws)
- Recharts
- Three.js
- Tailwind CSS
- Deployed on Vercel (frontend) + Railway (WebSocket server)

## Run Locally

1. Install dependencies:
   npm install

2. Start the WebSocket server:
   node server/ws-server.js

3. Start the Next.js app:
   npm run dev

4. Open http://localhost:3000

## Context

This dashboard was built as a demo to visualize IMU sensor data — inspired by the paper "Wearable Wireless IMU for Real-Time Locomotion Sensing: Gait and End-to-End Latency Validation" (ICECIE 2025).
