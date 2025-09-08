import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class BlockDirectAccessMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const origin = req.headers.origin;
    const referer = req.headers.referer;

    const allowedOrigins = [...(process.env.ENABLE_CORS ?? 'https://www.comodos.co,https://comodos.co')
      .split(',')
      .map((o) => o.trim())
      .filter(Boolean)];

    // Permitir preflight CORS
    if (req.method === 'OPTIONS') {
      return next();
    }

    // Permitir si no hay Origin ni Referer (ej: Postman, curl, server-to-server)
    if (!origin && !referer) {
      return next();
    }

    const originAllowed = origin ? allowedOrigins.includes(origin) : true;
    const refererAllowed = referer
      ? allowedOrigins.includes(new URL(referer).origin)
      : true;

    if (!originAllowed || !refererAllowed) {
      throw new ForbiddenException('Access denied: Origin or Referer not allowed.');
    }

    next();
  }
}
