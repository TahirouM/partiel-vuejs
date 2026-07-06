const express = require('express');
const logger = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');
const authRoutes = require('./routes/auth.routes');
const eventRoutes = require('./routes/event.routes');

const app = express();

// Middlewares globaux
app.use(express.json());
app.use(logger);

// Route de santé (pratique pour vérifier que l'API tourne)
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Routes de l'API
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

// 404 pour toute route inconnue
app.use((req, res) => {
  res.status(404).json({ error: 'Route introuvable' });
});

// Gestion centralisée des erreurs (doit être en dernier)
app.use(errorHandler);

module.exports = app;
