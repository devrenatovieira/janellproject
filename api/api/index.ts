/**
 * Vercel serverless entry for NestJS.
 * Routes: /api/v1/*
 */
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import express, { type Request, type Response } from 'express';
import { AppModule } from '../src/app.module';

const expressApp = express();
// Body parser for Vercel serverless
expressApp.use(express.json({ limit: '2mb' }));
expressApp.use(express.urlencoded({ extended: true }));

let bootstrapped: Promise<void> | null = null;

async function bootstrap() {
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
      throw err;
    });
  }
  return bootstrapped;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await ensureBoot();
  return new Promise<void>((resolve) => {
    expressApp(req as unknown as Request, res as unknown as Response, () =>
      resolve(),
    );
  });
}
