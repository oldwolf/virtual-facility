import { Module } from '@nestjs/common';
import { AlarmsGeneratorService } from './alarms-generator.service';
import { ScheduleModule } from '@nestjs/schedule';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ALARMS_SERVICE } from './constants';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ClientsModule.registerAsync([
      {
        imports: [ConfigModule.forRoot()],
        name: ALARMS_SERVICE,
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
  controllers: [],
  providers: [AlarmsGeneratorService],
})
export class AlarmsGeneratorModule {}
