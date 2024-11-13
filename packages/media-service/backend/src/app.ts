import express from 'express';
import mediaRoutes from './routes/index.js';

const app = express();

// Middleware para JSON
app.use(express.json());

// Rotas da API
app.use('/api/media', mediaRoutes);

export default app;




