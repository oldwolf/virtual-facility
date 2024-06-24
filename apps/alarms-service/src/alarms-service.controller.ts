import { Controller, Inject, Logger } from '@nestjs/common';
import { ClientProxy, EventPattern, Payload } from '@nestjs/microservices';
import { MESSAGE_BROKER } from './constant';
import { lastValueFrom } from 'rxjs';

@Controller()
export class AlarmsServiceController {
  private readonly logger = new Logger(AlarmsServiceController.name);

  constructor(
    @Inject(MESSAGE_BROKER) private readonly messageBroker: ClientProxy,
  ) {}

  @EventPattern('alarm.created')
  async create(@Payload() data: { name: string; buildingId: number }) {
    this.logger.debug(
      `Received new "alarm.created" event: ${JSON.stringify(data)}`,
    );

    const alarmClassification = await lastValueFrom(
      this.messageBroker.send('alarm.classify', data),
    );
    this.logger.debug(
      `Alarm "${data.name}" has been classified as "${alarmClassification.category}"`,
    );

    const notify$ = this.messageBroker.emit('notification.send', {
      alarm: data,
      classification: alarmClassification,
    });
    await lastValueFrom(notify$);
    this.logger.debug(`Dispatched "notification.send" event.`);
  }
}
