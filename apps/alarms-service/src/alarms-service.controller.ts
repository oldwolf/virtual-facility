import { Controller, Inject } from '@nestjs/common';
import { ClientProxy, EventPattern, Payload } from '@nestjs/microservices';
import { NOTIFICATIONS_SERViCE } from './constant';
import { lastValueFrom } from 'rxjs';
import { TracingLogger } from '@app/tracing/tracing.logger';
import { NatsClientProxy } from '@app/tracing/nats-client/nats-client.proxy';

@Controller()
export class AlarmsServiceController {
  constructor(
    private readonly natsMessageBroker: NatsClientProxy,
    @Inject(NOTIFICATIONS_SERViCE)
    private readonly notificationsService: ClientProxy,
    private readonly logger: TracingLogger,
  ) {}

  @EventPattern('alarm.created')
  async create(@Payload() data: { name: string; buildingId: number }) {
    this.logger.debug(
      `Received new "alarm.created" event: ${JSON.stringify(data)}`,
    );

    const alarmClassification = await lastValueFrom(
      this.natsMessageBroker.send('alarm.classify', data),
    );
    this.logger.debug(
      `Alarm "${data.name}" has been classified as "${alarmClassification.category}"`,
    );

    const notify$ = this.notificationsService.emit('notification.send', {
      alarm: data,
      category: alarmClassification.category,
    });
    await lastValueFrom(notify$);
    this.logger.debug(`Dispatched "notification.send" event.`);
  }
}
