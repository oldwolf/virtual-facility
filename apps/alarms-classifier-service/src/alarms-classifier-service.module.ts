import { TracingModule } from '@app/tracing';
import { Module } from '@nestjs/common';
import { AlarmsClassifierServiceController } from './alarms-classifier-service.controller';
import { AlarmsClassifierServiceService } from './alarms-classifier-service.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TracingModule, ConfigModule.forRoot({ isGlobal: true })],
  controllers: [AlarmsClassifierServiceController],
  providers: [AlarmsClassifierServiceService],
})
export class AlarmsClassifierServiceModule {}
