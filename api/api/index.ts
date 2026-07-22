/**
 * ÚNICA Serverless Function da API (Vercel Hobby = máx. 12).
 * Todo o NestJS sobe por este handler.
 */
import 'reflect-metadata';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import express, { type Request, type Response } from 'express';
import { AppModule } from '../src/app.module';

const expressApp = express();
expressApp.use(express.json({ limit: '2mb' }));
expressApp.use(express.urlencoded({ extended: true }));

let bootstrapped: Promise<void> | null = null;
let bootError: string | null = null;

function missingEnv(): string[] {
  const required = [
    'DATABASE_URL',
    'JWT_ACCESS_SECRET',
    'JWT_REFRESH_SECRET',
  ];
  return required.filter((k) => !process.env[k]?.trim());
}

async function bootstrap() {
  const missing = missingEnv();
  if (missing.length) {
    throw new Error(
      `Variáveis de ambiente ausentes na Vercel: ${missing.join(', ')}. ` +
        `Project Settings → Environment Variables → adicione e faça Redeploy.`,
    );
  }

  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
    { logger: ['error', 'warn', 'log'] },
  );

  const origins = (process.env.CORS_ORIGINS ?? '*')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

  app.enableCors({
    origin: origins.includes('*') ? true : origins,
    credentials: true,
  });

  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  await app.init();
}

function ensureBoot() {
  if (!bootstrapped) {
    bootstrapped = bootstrap().catch((err) => {
      bootstrapped = null;
      bootError = err instanceof Error ? err.message : String(err);
      throw err;
    });
  }
  return bootstrapped;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await ensureBoot();
  } catch (err) {
    const message =
      bootError ||
      (err instanceof Error ? err.message : 'Bootstrap failed');
    console.error('[api] bootstrap failed:', message);
    res.status(500).json({
      statusCode: 500,
      error: 'FUNCTION_BOOTSTRAP_FAILED',
      message,
      hint: 'Configure DATABASE_URL, JWT_ACCESS_SECRET e JWT_REFRESH_SECRET na Vercel (Production) e faça Redeploy.',
    });
    return;
  }

  return new Promise<void>((resolve) => {
    expressApp(req as unknown as Request, res as unknown as Response, () =>
      resolve(),
    );
  });
}
