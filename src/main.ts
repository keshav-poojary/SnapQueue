import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Swagger } from './swagger';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  Swagger.configureSwagger(app);
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );

  process.on('SIGTERM', () => {
    Logger.log('SIGTERM received, shutting down gracefully...');
    app
      .close()
      .then(() => {
        Logger.log('Application closed successfully.');
        process.exit(0);
      })
      .catch((err) => {
        Logger.error('Error during shutdown:', err);
        process.exit(1);
      });
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
