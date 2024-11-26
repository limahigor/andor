import dotenv from 'dotenv';
dotenv.config();

export default {
    mongoUrl: process.env.MONGO_URL ?? 'mongodb://localhost:27017/media-service',
    port: process.env.PORT ?? 3000
}