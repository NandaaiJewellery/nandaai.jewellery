import { Request, Response, NextFunction } from 'express';

export function internalOnly(req: Request, res: Response, next: NextFunction): void {
  const internalSecret = process.env.INTERNAL_SECRET;
  if (!internalSecret) {
    res.status(500).json({ error: 'INTERNAL_SECRET is not configured' });
    return;
  }

  const providedSecret = req.headers['x-internal-secret'];
  if (!providedSecret || providedSecret !== internalSecret) {
    res.status(401).json({ error: 'Unauthorized: invalid or missing internal secret' });
    return;
  }

  next();
}
