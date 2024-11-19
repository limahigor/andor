import mongoose from 'mongoose';

export const connectToDatabase = async (): Promise<void> => {
  try {
    const MONGO_URI = "mongodb+srv://joseandersonsilv4:hXjyAqSDiop4tAKi@channel-service.j4tmc.mongodb.net/?retryWrites=true&w=majority&appName=channel-service";
    await mongoose.connect(MONGO_URI, {
    });
    console.log('Conectado ao MongoDB channel-service');
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB channel-service:', error);
    process.exit(1); // Encerra a aplicação em caso de erro
  }
};

export default connectToDatabase;


