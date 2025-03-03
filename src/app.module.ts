import { Module } from '@nestjs/common';
import { LinksModule } from './modules/links/links.module';
import { RootModule } from './modules/root';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    LinksModule,
    RootModule,
    CacheModule.register({
      isGlobal: true,
      ttl: 360000,
      max: 100,
    }),
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}
