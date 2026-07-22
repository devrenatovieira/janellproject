import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiPropertyOptional, ApiTags } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PrismaService } from '../prisma/prisma.service';

class PageViewDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  path?: string;
}

@ApiTags('public')
@Controller('public/analytics')
export class AnalyticsController {
  constructor(private readonly prisma: PrismaService) {}

  @Post('pageview')
  async pageview(@Body() body: PageViewDto) {
    const key = 'site_pageviews';
    const current = await this.prisma.siteSetting.findUnique({ where: { key } });
    const value = Number((current?.value as { count?: number } | null)?.count ?? 0) + 1;
    const byPath = {
      ...(((current?.value as { byPath?: Record<string, number> } | null)?.byPath) ??
        {}),
    };
    const path = body.path || '/';
    byPath[path] = (byPath[path] ?? 0) + 1;

    await this.prisma.siteSetting.upsert({
      where: { key },
      create: {
        key,
        value: { count: value, byPath, updatedAt: new Date().toISOString() },
        isPublic: false,
      },
      update: {
        value: { count: value, byPath, updatedAt: new Date().toISOString() },
      },
    });

    return { ok: true, count: value };
  }

  @Get('summary')
  async summary() {
    const pageviews = await this.prisma.siteSetting.findUnique({
      where: { key: 'site_pageviews' },
    });
    const adminAccess = await this.prisma.siteSetting.findUnique({
      where: { key: 'admin_access_count' },
    });
    return {
      sitePageviews: Number(
        (pageviews?.value as { count?: number } | null)?.count ?? 0,
      ),
      siteByPath:
        (pageviews?.value as { byPath?: Record<string, number> } | null)?.byPath ??
        {},
      adminAccesses: Number(
        (adminAccess?.value as { count?: number } | null)?.count ?? 0,
      ),
      lastAdminAccessAt:
        (adminAccess?.value as { lastAt?: string } | null)?.lastAt ?? null,
    };
  }
}
