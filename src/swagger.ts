import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export class Swagger {
  static configureSwagger(app: INestApplication) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Snap Queue API')
      .setDescription('API documentation for Snap Queue')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api', app, document);
  }
}
