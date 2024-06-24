import { Module } from '@nestjs/common';
import { AlarmsServiceController } from './alarms-service.controller';
import { AlarmsServiceService } from './alarms-service.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MESSAGE_BROKER } from './constant';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ClientsModule.registerAsync([
      {
        imports: [ConfigModule.forRoot()],
        name: MESSAGE_BROKER,
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
  controllers: [AlarmsServiceController],
  providers: [AlarmsServiceService],
})
export class AlarmsServiceModule {}
