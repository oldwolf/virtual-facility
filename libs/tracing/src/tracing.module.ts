import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { TracingService } from './tracing.service';
import { TracingLogger } from './tracing.logger';
import { NatsClientModule } from './nats-client/nats-client.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), NatsClientModule],
  providers: [TracingService, TracingLogger],
  exports: [TracingService, TracingLogger],
})
export class TracingModule {}
