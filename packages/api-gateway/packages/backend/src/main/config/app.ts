import express, { type Express } from 'express';
import setupMiddlewares from './middlewares'
import setupRoutes from './routes'

const app: Express = express();

setupMiddlewares(app)
void setupRoutes(app)
export default app
