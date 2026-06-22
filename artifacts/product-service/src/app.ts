import express from 'express';
import { internalOnly } from './middleware/internal.middleware';
import productRoutes from './routes/product.routes';
import { errorHandler } from './middleware/error.middleware';

const app = express();

app.use(express.json());

app.use('/products', internalOnly, productRoutes);

app.use(errorHandler as express.ErrorRequestHandler);

export default app;
