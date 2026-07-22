import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { ZodError } from 'zod';
import { HttpError } from './lib/http-error';
import { healthRouter } from './routes/health';
import { authRouter } from './routes/auth';
import { publicRouter } from './routes/public';
import { adminRouter } from './routes/admin';

export function createApp() {
  const app = express();

  app.set('trust proxy', 1);
  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true }));

  const origins = (process.env.CORS_ORIGINS ?? '*')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

  app.use(
    cors({
      origin: origins.includes('*') ? true : origins,
      credentials: true,
    }),
  );

  app.use(
    rateLimit({
      windowMs: Number(process.env.THROTTLE_TTL ?? 60) * 1000,
      max: Number(process.env.THROTTLE_LIMIT ?? 200),
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );

  app.get('/', (_req, res) => {
    res.json({
      name: 'Lar Batista Janell Doyle API',
      version: '1.0.0',
      health: '/api/v1/health',
    });
  });

  app.use('/api/v1/health', healthRouter);
  app.use('/api/v1/auth', authRouter);
  app.use('/api/v1/public', publicRouter);
  app.use('/api/v1/admin', adminRouter);

  app.use(
    (
      err: unknown,
      _req: express.Request,
      res: express.Response,
      _next: express.NextFunction,
    ) => {
      if (err instanceof ZodError) {
        res.status(400).json({
          statusCode: 400,
          message: err.errors.map((e) => e.message).join('; '),
          errors: err.errors,
        });
        return;
      }
      if (err instanceof HttpError) {
        res.status(err.status).json({ statusCode: err.status, message: err.message });
        return;
      }
      console.error('[api]', err);
      res.status(500).json({
        statusCode: 500,
        message: err instanceof Error ? err.message : 'Internal Server Error',
      });
    },
  );

  return app;
}
