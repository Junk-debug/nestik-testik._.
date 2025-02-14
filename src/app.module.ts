import { Module } from '@nestjs/common';
import { LinksModule } from './modules/links/links.module';
import { RootModule } from './modules/root';

@Module({
  imports: [LinksModule, RootModule],
})
export class AppModule {}
