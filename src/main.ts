import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { enableApiDocs } from './utils/docs';
import { Request, Response } from 'express';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.use('/favicon.ico', (_: Request, res: Response) => res.status(204).end());

  app.enableCors();
  enableApiDocs('api/docs', app);

  await app.listen(process.env.PORT ?? 3000);
  console.log(
    `Application is running on: ${(await app.getUrl()).replace('[::1]', 'localhost')}`,
  );
}
void bootstrap();
