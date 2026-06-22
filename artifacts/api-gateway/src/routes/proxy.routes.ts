import { Router, Request, Response, NextFunction } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth.middleware';

const router = Router();

function injectUserHeaders(req: AuthenticatedRequest, _res: Response, next: NextFunction): void {
  const internalSecret = process.env.INTERNAL_SECRET;
  if (!internalSecret) {
    throw new Error('INTERNAL_SECRET is not set');
  }
  req.headers['x-user-id'] = req.userId ?? '';
  req.headers['x-user-email'] = req.userEmail ?? '';
  req.headers['x-internal-secret'] = internalSecret;
  next();
}

function buildProxy(target: string | undefined, targetName: string) {
  if (!target) throw new Error(`${targetName} is not set`);
  return createProxyMiddleware<Request, Response>({
    target,
    changeOrigin: true,
    on: {
      error: (err, _req, res) => {
        console.error(`[api-gateway] Proxy error to ${targetName}:`, err.message);
        if ('status' in res && typeof res.status === 'function') {
          (res as Response).status(502).json({ error: 'Bad gateway' });
        }
      },
    },
  });
}

router.use(
  '/prods',
  authMiddleware,
  injectUserHeaders as (req: Request, res: Response, next: NextFunction) => void,
  buildProxy(process.env.PRODUCT_SERVICE_URL, 'PRODUCT_SERVICE_URL'),
);

router.use(
  '/ods',
  authMiddleware,
  injectUserHeaders as (req: Request, res: Response, next: NextFunction) => void,
  buildProxy(process.env.ORDER_SERVICE_URL, 'ORDER_SERVICE_URL'),
);

export default router;
