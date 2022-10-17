import { NestFactory } from '@nestjs/core';
import { environment } from './app.env';
import { AppModule } from './app.module';

import * as APP_CONFIG from './app.config';
import { INestApplication, Logger } from '@nestjs/common';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

const registerBlobalInterceptor = async (app: INestApplication) => {
  app.useGlobalInterceptors(new LoggingInterceptor());
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await registerBlobalInterceptor(app);

  const config = new DocumentBuilder()
    .setTitle('Fashion')
    .setDescription('The Fashion API description')
    .setVersion('0.1')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(APP_CONFIG.APP.PORT);
}

bootstrap().then(() => {
  Logger.log(`API is running at ${APP_CONFIG.APP.PORT}, env: ${environment}`);
});
