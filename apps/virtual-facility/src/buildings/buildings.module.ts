import { Module } from '@nestjs/common';
import { BuildingsService } from './buildings.service';
import { BuildingsController } from './buildings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Building } from './entities/building.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { WORKFLOWS_SERVICE } from '../constant';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Building]),
    ClientsModule.registerAsync([
      {
        imports: [ConfigModule],
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
  controllers: [BuildingsController],
  providers: [BuildingsService],
})
export class BuildingsModule {}
