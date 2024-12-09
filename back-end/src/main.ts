import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {json, urlencoded} from 'body-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setBaseViewsDir(join(__dirname, 'views'));
  app.setViewEngine('hbs');
  app.enableCors({
    origin: ['https://open.spotify.com'],
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
  });
  app.use(json({limit: '50mb'}));
  app.use(urlencoded({limit: '50mb', extended: true}))
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
