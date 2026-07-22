import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const PERMISSIONS_KEY = 'permissions';
export const RequirePermissions = (...permissions: string[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!required?.length) return true;

    const request = context.switchToHttp().getRequest<{
      user?: { roles?: string[]; permissions?: string[] };
    }>();
    const user = request.user;
    if (!user) throw new ForbiddenException();

    if (user.roles?.includes('SUPER_ADMIN')) return true;

    const has = required.every((p) => user.permissions?.includes(p));
    if (!has) throw new ForbiddenException('Permissão insuficiente');
    return true;
  }
}
