import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { BlockDirectAccessMiddleware } from './middleware/cors/blokedDirectAccess.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api');


  const allowedOrigins = [...(process.env.ENABLE_CORS ?? 'https://www.comodos.co,https://comodos.co')
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean)];

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: Origin ${origin} not allowed`));
      }
    },
    credentials: true
  });


  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true
  }));
  await app.listen(process.env.SERVER_PORT ?? 3001);
}
bootstrap();
