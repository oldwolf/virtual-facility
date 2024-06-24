import { NestFactory } from '@nestjs/core';
import { NotificationsServiceModule } from './notifications-service.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(NotificationsServiceModule);
  const configService = app.get<ConfigService>(ConfigService);

  app.useGlobalPipes(new ValidationPipe());

  app.connectMicroservice<MicroserviceOptions>(
    {
      transport: Transport.NATS,
      options: {
        servers: [configService.get('NATS_URL')],
        queue: 'notifications-service',
      },
    },
    { inheritAppConfig: true },
  );

  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
