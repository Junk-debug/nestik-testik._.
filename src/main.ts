import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { enableApiDocs } from './utils/docs';
import { Request, Response } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  enableApiDocs('api/docs', app);

  app.use('/favicon.ico', (_: Request, res: Response) => res.status(204).end());

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
