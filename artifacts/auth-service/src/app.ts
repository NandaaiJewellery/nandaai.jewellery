import express from 'express';
import authRoutes from './routes/auth.routes';
import { errorHandler } from './middleware/error.middleware';

const app = express();

app.use(express.json());

app.use('/auth', authRoutes);

app.use(errorHandler as express.ErrorRequestHandler);

export default app;
