import express from 'express';
import { internalOnly } from './middleware/internal.middleware';
import orderRoutes from './routes/order.routes';
import { errorHandler } from './middleware/error.middleware';

const app = express();

app.use(express.json());

app.use('/orders', internalOnly, orderRoutes);

app.use(errorHandler as express.ErrorRequestHandler);

export default app;
