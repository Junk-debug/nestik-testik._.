import { Module } from '@nestjs/common';
import { LinksModule } from './links/links.module';
import { RootModule } from './root';

@Module({
  imports: [LinksModule, RootModule],
})
export class AppModule {}
