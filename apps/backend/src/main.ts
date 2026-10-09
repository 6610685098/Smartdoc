import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { existsSync } from 'node:fs';
import { loadEnvFile } from 'node:process';
import { AppModule } from './app.module.js';

async function bootstrap() {
  // Deployment environments can supply variables without a local .env file.
  if (existsSync('.env')) {
    loadEnvFile('.env');
  }

  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix(process.env.API_PREFIX ?? 'api');

  const port = Number(process.env.PORT ?? 3001);
  await app.listen(port);
  console.log(`Smartdoc Backend running on port ${port}`);
}
await bootstrap();
