# IMU Sensor Dashboard

A real-time IMU sensor data visualization dashboard built with Next.js, WebSocket, Recharts, and Three.js.

## Features
- Real-time WebSocket data streaming at ~60Hz
- Live Roll / Pitch / Yaw orientation charts
- 3D cube visualization responding to IMU orientation
- Gait step detection with refractory interval
- CSV data export

## Tech Stack
- Next.js 15
- WebSocket (ws)
- Recharts
- Three.js
- Tailwind CSS

## Run Locally

1. Install dependencies:
   ```
   npm install
   ```

2. Start the WebSocket server:
   ```
   node server/ws-server.js
   ```

3. Start the Next.js app:
   ```
   npm run dev
   ```

4. Open http://localhost:3000

## Context
This dashboard was built as a demo to visualize IMU sensor data — inspired by research on wearable wireless IMU systems for real-time locomotion sensing.
