import { NestFactory } from '@nestjs/core';
import { AlarmsClassifierServiceModule } from './alarms-classifier-service.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AlarmsClassifierServiceModule);
  const configService = app.get<ConfigService>(ConfigService);

  app.useGlobalPipes(new ValidationPipe());

  app.connectMicroservice<MicroserviceOptions>(
    {
      transport: Transport.NATS,
      options: {
        servers: [configService.get('NATS_URL')],
        queue: 'alarms-classifier-service',
      },
    },
    { inheritAppConfig: true },
  );

  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
