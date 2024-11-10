import express from 'express';
import path from 'path';
import connectToDatabase from './database';
import mediaRoutes from './routes/index';

const app = express();
const PORT = 3000;

// Iniciar servidor
const startServer = async (): Promise<void> => {
  try {
    await connectToDatabase();
    console.log('Conexão com o banco de dados estabelecida.');

    app.use(express.json());

    const frontendPath = path.join(__dirname, '../../frontend/dist');
    app.use(express.static(frontendPath));

    app.use('/api/media', mediaRoutes);

    app.get('/home/', (req, res) => {
      res.sendFile(path.join(frontendPath, 'index.html'));
    });

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
