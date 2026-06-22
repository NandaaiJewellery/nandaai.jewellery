import express from 'express';
import proxyRoutes from './routes/proxy.routes';
import { errorHandler } from './middleware/error.middleware';

const app = express();

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'api-gateway' });
});

app.use('/', proxyRoutes);

app.use(errorHandler as express.ErrorRequestHandler);

export default app;
