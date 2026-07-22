import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';
import { HttpError } from '../lib/http-error';
import { asyncHandler } from '../lib/async-handler';

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  roles: string[];
  permissions: string[];
};

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export const requireAuth = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      throw HttpError.unauthorized('Token ausente');
    }
    const token = header.slice(7);
    const secret = process.env.JWT_ACCESS_SECRET;
    if (!secret) throw HttpError.unauthorized('JWT não configurado');

    let payload: { sub: string; email: string };
    try {
      payload = jwt.verify(token, secret) as { sub: string; email: string };
    } catch {
      throw HttpError.unauthorized('Token inválido');
    }

    const user = await prisma.user.findFirst({
      where: { id: payload.sub, deletedAt: null, status: 'ACTIVE' },
      include: {
        roles: {
          include: {
            role: {
              include: { permissions: { include: { permission: true } } },
            },
          },
        },
      },
    });
    if (!user) throw HttpError.unauthorized();

    const roles = user.roles.map((r) => r.role.name);
    const permissions = [
      ...new Set(
        user.roles.flatMap((r) =>
          r.role.permissions.map((p) => p.permission.code),
        ),
      ),
    ];

    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      roles,
      permissions,
    };
    next();
  },
);

export function requirePermissions(...codes: string[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) return next(HttpError.unauthorized());
    if (user.roles.includes('SUPER_ADMIN')) return next();
    const ok = codes.every((c) => user.permissions.includes(c));
    if (!ok) return next(HttpError.forbidden('Permissão insuficiente'));
    next();
  };
}
