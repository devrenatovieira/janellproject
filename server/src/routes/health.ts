import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { asyncHandler } from '../lib/async-handler';

export const healthRouter = Router();

healthRouter.get('/', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

healthRouter.get(
  '/ready',
  asyncHandler(async (_req, res) => {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: 'ready',
      database: 'up',
      timestamp: new Date().toISOString(),
    });
  }),
);
