// src/index.js — NaHora Backend API
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { runMigrations } = require('./database/migrations');
const { errorHandler } = require('./middleware/error-handler');

// Rotas
const authRoutes          = require('./modules/auth/auth.routes');
const professionalsRoutes = require('./modules/professionals/professionals.routes');
const servicesRoutes      = require('./modules/services/services.routes');
const appointmentsRoutes  = require('./modules/appointments/appointments.routes');
const reviewsRoutes       = require('./modules/reviews/reviews.routes');
const notificationsRoutes = require('./modules/notifications/notifications.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middlewares globais ────────────────────────────────
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Health check ───────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'NaHora API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// ─── Rotas da API ───────────────────────────────────────
app.use('/api/auth',          authRoutes);
app.use('/api/professionals', professionalsRoutes);
app.use('/api/services',      servicesRoutes);
app.use('/api/appointments',  appointmentsRoutes);
app.use('/api/reviews',       reviewsRoutes);
app.use('/api/notifications', notificationsRoutes);

// Categorias (simples, sem controller próprio)
const { dbAll } = require('./database/connection');
app.get('/api/categories', async (req, res) => {
  try {
    const cats = await dbAll('SELECT * FROM categories ORDER BY name');
    res.json({ success: true, data: cats });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Erro ao buscar categorias' });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Rota não encontrada: ${req.method} ${req.originalUrl}` });
});

// ─── Error handler global ──────────────────────────────
app.use(errorHandler);

// ─── Inicialização ─────────────────────────────────────
async function start() {
  try {
    await runMigrations();
    const server = app.listen(PORT, () => {
      console.log(`\n🚀 NaHora API rodando em http://localhost:${PORT}`);
      console.log(`📋 Health check: http://localhost:${PORT}/health`);
      console.log(`🔐 Auth:         http://localhost:${PORT}/api/auth`);
      console.log(`👥 Profissionais:http://localhost:${PORT}/api/professionals`);
      console.log(`📅 Agendamentos: http://localhost:${PORT}/api/appointments`);
      console.log(`\n📌 Ambiente: ${process.env.NODE_ENV || 'development'}\n`);
      console.log('✅ Servidor ativo. Pressione Ctrl+C para parar.\n');
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`\n❌ ERRO: Porta ${PORT} já está em uso por outro processo!`);
      } else {
        console.error('❌ Erro no servidor:', err);
      }
      process.exit(1);
    });
  } catch (err) {
    console.error('❌ Falha ao iniciar servidor:', err);
    process.exit(1);
  }
}

start();
