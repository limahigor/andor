import express from 'express';
import connectToDatabase from './config/database.js';
import mediaRoutes from '../routes/index.js';
import cors from 'cors';
import env from './config/env.js';

const app = express();
const PORT = env.port;

// Iniciar servidor
const startServer = async (): Promise<void> => {
  try {
    await connectToDatabase();
    console.log('Conexão com o banco de dados estabelecida media-service.');

    // Middleware para JSON
    app.use(express.json());

    // Configuração de CORS (antes de todas as rotas)
    app.use(cors({
      origin: 'http://localhost:5173', // Permite requisições do frontend local
      methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
      allowedHeaders: ['Content-Type'], // Headers permitidos
    }));

    // Configurar rotas
    app.use('/api/media', mediaRoutes);

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`server running at http://localhost:${PORT}`);
    }).on('error', (error) => {
      console.error('Erro ao iniciar o servidor media-service.: ', error);
    });

  } catch (error) {
    console.error('Erro geral no servidor media-service: ', error);
  }
};

void startServer();
