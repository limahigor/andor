import express from "express";
import path from "path";
import mediaRoutes from "../routes/index.js";
import cors from "cors";
import { fileURLToPath } from "url";
import env from "./config/env.js";
import { connectToDatabase } from "./config/database.js";

const app = express();
const PORT = env.port;

const FILENAME = fileURLToPath(import.meta.url);
const DIRNAME = path.dirname(FILENAME);

// Iniciar servidor
const startServer = async (): Promise<void> => {
  try {
    await connectToDatabase();
    console.log("Conexão com o banco de dados estabelecida channel-service.");

    // Middleware para JSON
    app.use(express.json());

    // Configuração de CORS (antes de todas as rotas)
    app.use(
      cors({
        origin: "http://localhost:5173", // Permite requisições do frontend local
        methods: ["GET", "POST", "PUT", "DELETE"], // Métodos permitidos
        allowedHeaders: ["Content-Type"], // Headers permitidos
      }),
    );

    // Configurar rotas
    app.use("/api/channel", mediaRoutes);

    // Iniciar servidor
    app
      .listen(PORT, () => {
        console.log(`server running at http://localhost:${PORT}`);
      })
      .on("error", (error) => {
        console.error("Erro ao iniciar o servidor channel-service: ", error);
      });
  } catch (error) {
    console.error("Erro geral no servidor channel-service: ", error);
  }
};

void startServer();