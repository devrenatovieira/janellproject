import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { createHash, randomBytes } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  private hashToken(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }

  async login(dto: LoginDto, meta?: { ip?: string; userAgent?: string }) {
    const user = await this.prisma.user.findFirst({
      where: { email: dto.email.toLowerCase(), deletedAt: null },
      include: {
        roles: { include: { role: true } },
      },
    });

    if (!user || user.status !== 'ACTIVE') {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Credenciais inválidas');

    const tokens = await this.issueTokens(user.id, user.email, meta);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Contador de acessos ao painel (login bem-sucedido)
    const roles = user.roles.map((r) => r.role.name);
    if (
      roles.some((r) =>
        ['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'FINANCE', 'SUPPORT'].includes(r),
      )
    ) {
      await this.incrementAdminAccess();
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        roles,
      },
      ...tokens,
    };
  }

  private async incrementAdminAccess() {
    const key = 'admin_access_count';
    const current = await this.prisma.siteSetting.findUnique({ where: { key } });
    const count =
      Number((current?.value as { count?: number } | null)?.count ?? 0) + 1;
    const payload = {
      count,
      lastAt: new Date().toISOString(),
    };
    await this.prisma.siteSetting.upsert({
      where: { key },
      create: { key, value: payload, isPublic: false },
      update: { value: payload },
    });
  }

  async refresh(refreshToken: string, meta?: { ip?: string; userAgent?: string }) {
    const tokenHash = this.hashToken(refreshToken);
    const stored = await this.prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token inválido');
    }

    if (stored.user.status !== 'ACTIVE' || stored.user.deletedAt) {
      throw new ForbiddenException('Usuário inativo');
    }

    // rotate
    await this.prisma.refreshToken.update({
      where: { id: stored.id },
      data: { revokedAt: new Date() },
    });

    return this.issueTokens(stored.userId, stored.user.email, meta, stored.familyId);
  }

  async logout(refreshToken: string) {
    const tokenHash = this.hashToken(refreshToken);
    await this.prisma.refreshToken.updateMany({
      where: { tokenHash, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    return { success: true };
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
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
    if (!user) throw new UnauthorizedException();

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      status: user.status,
      roles: user.roles.map((r) => r.role.name),
      permissions: [
        ...new Set(
          user.roles.flatMap((r) =>
            r.role.permissions.map((p) => p.permission.code),
          ),
        ),
      ],
    };
  }

  private async issueTokens(
    userId: string,
    email: string,
    meta?: { ip?: string; userAgent?: string },
    familyId?: string,
  ) {
    const accessToken = await this.jwt.signAsync(
      { sub: userId, email },
      {
        secret: this.config.getOrThrow('JWT_ACCESS_SECRET'),
        expiresIn: this.config.get('JWT_ACCESS_TTL') ?? '15m',
      },
    );

    const refreshToken = randomBytes(48).toString('hex');
    const tokenHash = this.hashToken(refreshToken);
    const days = 7;
    const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    const fam = familyId ?? cryptoRandomUuid();

    await this.prisma.refreshToken.create({
      data: {
        userId,
        tokenHash,
        familyId: fam,
        expiresAt,
        ip: meta?.ip,
        userAgent: meta?.userAgent,
      },
    });

    return {
      accessToken,
      refreshToken,
      tokenType: 'Bearer',
      expiresIn: this.config.get('JWT_ACCESS_TTL') ?? '15m',
    };
  }
}

function cryptoRandomUuid() {
  return randomBytes(16).toString('hex').replace(
    /^(.{8})(.{4})(.{4})(.{4})(.{12})$/,
    '$1-$2-$3-$4-$5',
  );
}
