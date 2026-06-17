const express = require('express');
const cors = require('cors');
const path = require('path');
const qaRoutes = require('./routes/qa');
const agentsRoutes = require('./routes/agents');
const chatRoutes = require('./routes/chat');

const app = express();
const PORT = process.env.PORT || 3700;

app.use(cors());
app.use(express.json());

// Servir le dashboard HTML statique
app.use(express.static(path.join(__dirname, '..')));

// Routes API
app.use('/api/qa', qaRoutes);
app.use('/api/agents', agentsRoutes);
app.use('/api/chat', chatRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    version: '1.1.0',
    project: 'TR7 Shop Builder',
    timestamp: new Date().toISOString(),
    endpoints: [
      'GET  /api/health',
      'POST /api/qa/run',
      'GET  /api/qa/report/:id',
      'GET  /api/agents/list',
      'GET  /api/agents/:name',
      'POST /api/chat',
      'GET  /api/chat/models',
    ]
  });
});

// Page d'accueil → dashboard
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'TR7-SHOP-BUILDER.html'));
});

app.listen(PORT, () => {
  console.log(`\n🚀 TR7 Shop Builder Backend`);
  console.log(`   Port     : ${PORT}`);
  console.log(`   Dashboard: http://localhost:${PORT}`);
  console.log(`   API      : http://localhost:${PORT}/api/health\n`);
});

module.exports = app;
