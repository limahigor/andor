import mongoose from "mongoose";
import env from "./env.js";

export const connectToDatabase = async (): Promise<void> => {
  try {
    const MONGO_URI = env.mongoUrl;
    await mongoose.connect(MONGO_URI, {});
    console.log("Conectado ao MongoDB channel-service");
  } catch (error) {
    console.error("Erro ao conectar ao MongoDB channel-service:", error);
    process.exit(1); // Encerra a aplicação em caso de erro
  }
};

export default connectToDatabase;
