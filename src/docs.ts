/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function enableApiDocs(path: string, app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('URL Shortener server API')
    .setDescription(
      'This is the API documentation of the URL shortener server.',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(path, app, document);
}
