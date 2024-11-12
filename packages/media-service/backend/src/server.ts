import express from 'express';
import path from 'path';
import connectToDatabase from './database';
import mediaRoutes from './routes/index';
import cors from 'cors';


const app = express();
const PORT = 3000;

// Iniciar servidor
const startServer = async (): Promise<void> => {
  try {
    await connectToDatabase();
    console.log('Conexão com o banco de dados estabelecida.');

    // Middleware para JSON
    app.use(express.json());

    // Configuração de CORS (antes de todas as rotas)
    app.use(cors({
      origin: 'http://localhost:5173', // Permite requisições do frontend local
      methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
      allowedHeaders: ['Content-Type'], // Headers permitidos
    }));

    // Servir arquivos estáticos do frontend
    const frontendPath = path.join(__dirname, '../../frontend/dist');
    app.use(express.static(frontendPath));

    // Configurar rotas
    app.use('/api/media', mediaRoutes);
    
    // Rota para a página inicial (index.html)
    app.get('/home/', (req, res) => {
      res.sendFile(path.join(frontendPath, 'index.html'));
    });

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    }).on('error', (error) => {
      console.error('Erro ao iniciar o servidor:', error);
    });

  } catch (error) {
    console.error('Erro geral no servidor:', error);
  }
};

void startServer();
