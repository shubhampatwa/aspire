import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import { AppConfig } from './config/config';
import { AllExceptionFilter } from './utils/exception.filter';

const CONFIG = AppConfig();
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalFilters(new AllExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      disableErrorMessages: false,
      whitelist: true,
    }),
  );
  app.enableCors();

  app.setGlobalPrefix('api');
  const config = new DocumentBuilder()
    .setTitle('Priori Capital')
    .setDescription('The API for Priori Capital')
    .setVersion('1.0')
    .addTag('wallets')
    .addTag('auth')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(CONFIG.PORT, '0.0.0.0');
}
bootstrap();
