import { Module } from '@nestjs/common';
import { OutboxService } from './outbox.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Outbox } from './entities/outbox.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { WORKFLOWS_SERVICE } from '../constant';
import { ConfigService } from '@nestjs/config';
import { OutboxProcessor } from './outbox.processor';
import { OutboxEntitySubscriber } from './outbox.entity-subscriber';

@Module({
  imports: [
    TypeOrmModule.forFeature([Outbox]),
    ClientsModule.registerAsync([
      {
        name: WORKFLOWS_SERVICE,
        useFactory: (configService: ConfigService) => {
          return {
            transport: Transport.RMQ,
            options: {
              urls: [configService.get<string>('RABBITMQ_URL')],
              queue: 'workflows-service',
            },
          };
        },
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [OutboxService, OutboxProcessor, OutboxEntitySubscriber],
})
export class OutboxModule {}
