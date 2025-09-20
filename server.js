const express = require('express');
const bodyParser = require('body-parser');
const WebSocket = require('ws');
const http = require('http');

const app = express();
app.use(bodyParser.json());

// Simple ML-like prediction endpoint
app.post('/predict', (req, res) => {
  const { route } = req.body;
  const riskScore = Math.random();
  const riskLevel = riskScore > 0.7 ? 'High' : riskScore > 0.4 ? 'Medium' : 'Low';
  res.json({ score: riskScore.toFixed(2), riskLevel });
});

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// WebSocket broadcasting obstacles every 10s
setInterval(() => {
  const event = {
    eventType: 'obstacle',
    data: {
      type: ['pedestrian', 'stray animal', 'rickshaw'][Math.floor(Math.random()*3)],
      lat: 20 + Math.random()*10,
      lng: 78 + Math.random()*10
    }
  };
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(event));
    }
  });
}, 10000);

server.listen(3000, () => console.log('Backend running on http://localhost:3000'));
