import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

declare global {
  namespace Express {
    interface Request {
      user?: { id: string };
    }
  }
}

@Injectable()
export class MockUserMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction): void {
    const userId = req.headers['x-user-id'] as string;
    req.user = { id: userId || uuidv4() };
    next();
  }
}
