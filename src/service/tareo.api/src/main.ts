import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PORT } from './config/constants';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept',
  });
  const configService = app.get(ConfigService);
  const port = configService.get<number>(PORT) || 3000;
  await app.listen(port);
}
bootstrap();
