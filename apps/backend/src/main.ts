import { NestFactory } from '@nestjs/core';
import { existsSync } from 'node:fs';
import { loadEnvFile } from 'node:process';
import { AppModule } from './app.module.js';

async function bootstrap() {
  // Deployment environments can supply variables without a local .env file.
  if (existsSync('.env')) {
    loadEnvFile('.env');
  }

  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(process.env.API_PREFIX ?? 'api');
  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
  });
  await app.listen(Number(process.env.PORT ?? 3001));
}
await bootstrap();
