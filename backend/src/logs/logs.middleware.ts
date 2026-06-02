import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LogsService } from './logs.service';

@Injectable()
export class LogsMiddleware implements NestMiddleware {
  constructor(private logsService: LogsService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip } = req;

    res.on('finish', () => {
      const userId = (req as any).user?.sub || null;
      this.logsService.createLog({
        method,
        url: originalUrl,
        statusCode: res.statusCode,
        userId,
        ip,
      });
    });

    next();
  }
}
