import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getPublicKey } from '../utils/publicKey.cache';

export interface AuthenticatedRequest extends Request {
  userId?: string;
  userEmail?: string;
}

export async function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing or malformed Authorization header' });
    return;
  }

  const token = authHeader.slice(7);

  try {
    const publicKey = await getPublicKey();
    const decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] }) as {
      userId: string;
      email: string;
    };

    req.userId = decoded.userId;
    req.userEmail = decoded.email;
    next();
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Token verification failed';
    console.error('[api-gateway] Auth error:', message);
    res.status(401).json({ error: 'Unauthorized', detail: message });
  }
}
