import { Module } from '@nestjs/common';
import { NotificationsServiceController } from './notifications-service.controller';
import { NotificationsServiceService } from './notifications-service.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [NotificationsServiceController],
  providers: [NotificationsServiceService],
})
export class NotificationsServiceModule {}
