import { Module } from '@nestjs/common';
import { NatsClientProxy } from './nats-client.proxy';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NATS_BROKER } from './constant';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: NATS_BROKER,
        useFactory: (configService: ConfigService) => {
          return {
            transport: Transport.NATS,
            options: {
              servers: configService.get('NATS_URL'),
            },
          };
        },
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [NatsClientProxy],
  exports: [NatsClientProxy],
})
export class NatsClientModule {}
