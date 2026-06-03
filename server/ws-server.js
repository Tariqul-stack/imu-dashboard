const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 }, () => {
  console.log('WebSocket server is running on port 8080');
});

wss.on('connection', (ws) => {
  console.log('Client connected');

  let yaw = 0;
  let phase = 0;

  const interval = setInterval(() => {
    // roll oscillates slowly between -30 and 30
    const roll = 30 * Math.sin(phase);
    
    // pitch oscillates slowly between -20 and 20
    const pitch = 20 * Math.cos(phase * 0.7);
    
    // yaw slowly increases from 0 to 360, then resets
    yaw = (yaw + 0.5) % 360;
    
    // ax, ay random small numbers between -0.5 and 0.5
    const ax = (Math.random() - 0.5);
    
    // ay random small number between -0.5 and 0.5
    const ay = (Math.random() - 0.5);
    
    // az simulates walking gait — sine wave with ~500ms period dipping below 9.5
    const az = 9.8 + Math.sin(Date.now() / 250) * 0.4;

    const data = {
      timestamp: Date.now(),
      roll: parseFloat(roll.toFixed(4)),
      pitch: parseFloat(pitch.toFixed(4)),
      yaw: parseFloat(yaw.toFixed(4)),
      ax: parseFloat(ax.toFixed(4)),
      ay: parseFloat(ay.toFixed(4)),
      az: parseFloat(az.toFixed(4))
    };

    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data));
    }

    phase += 0.02; // Increment phase slowly for rolling/pitching oscillations
  }, 16);

  ws.on('close', () => {
    console.log('Client disconnected');
    clearInterval(interval);
  });

  ws.on('error', (error) => {
    console.error('WebSocket connection error:', error);
    clearInterval(interval);
  });
});

// Run with: node server/ws-server.js
