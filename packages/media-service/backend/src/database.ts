import mongoose from 'mongoose';

export const connectToDatabase = async (): Promise<void> => {
  try {
    // const MONGO_URI = "mongodb+srv://anderson:masterkey@media-service.385ds.mongodb.net/?retryWrites=true&w=majority&appName=media-service";
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/media-service';
    await mongoose.connect(MONGO_URI, {
    });
    console.log('Conectado ao MongoDB');
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error);
    process.exit(1); // Encerra a aplicação em caso de erro
  }
};

export default connectToDatabase;


