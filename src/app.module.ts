import { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { ArticleModule } from './modules/article/article.module';

import { PrismaModule } from './providers/prisma/prisma.module';

@Module({
  imports: [ArticleModule, PrismaModule],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply();
  }
}
