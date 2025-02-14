import { Module } from '@nestjs/common';
import { LinksModule } from './links/links.module';
import { AppController } from './app.controller';

@Module({
  imports: [LinksModule],
  controllers: [AppController],
})
export class AppModule {}
