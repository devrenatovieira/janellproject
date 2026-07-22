import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { AuthService } from '../services/auth.service';
import { asyncHandler } from '../lib/async-handler';
import { requireAuth } from '../middleware/auth';
import { HttpError } from '../lib/http-error';

export const authRouter = Router();
const auth = new AuthService(prisma);

authRouter.post(
  '/login',
  asyncHandler(async (req, res) => {
    const body = z
      .object({ email: z.string().email(), password: z.string().min(1) })
      .parse(req.body);
    const result = await auth.login(body.email, body.password, {
      ip: req.ip,
      userAgent: req.get('user-agent') ?? undefined,
    });
    res.json(result);
  }),
);

authRouter.post(
  '/refresh',
  asyncHandler(async (req, res) => {
    const body = z.object({ refreshToken: z.string().min(1) }).parse(req.body);
    const result = await auth.refresh(body.refreshToken, {
      ip: req.ip,
      userAgent: req.get('user-agent') ?? undefined,
    });
    res.json(result);
  }),
);

authRouter.post(
  '/logout',
  asyncHandler(async (req, res) => {
    const body = z.object({ refreshToken: z.string().min(1) }).parse(req.body);
    res.json(await auth.logout(body.refreshToken));
  }),
);

authRouter.get(
  '/me',
  requireAuth,
  asyncHandler(async (req, res) => {
    if (!req.user) throw HttpError.unauthorized();
    res.json(await auth.me(req.user.id));
  }),
);
