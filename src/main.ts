import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { enableApiDocs } from './utils/docs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  enableApiDocs('api/docs', app);

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
