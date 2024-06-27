import { Controller, Get, Body, Patch, Param, Delete } from '@nestjs/common';
import { WorkflowsService } from './workflows.service';
import { CreateWorkflowDto, UpdateWorkflowDto } from '@app/workflows';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Inbox } from '../inbox/entities/inbox.entity';
import { Repository } from 'typeorm';

@Controller('workflows')
export class WorkflowsController {
  constructor(
    private readonly workflowsService: WorkflowsService,
    @InjectRepository(Inbox)
    private readonly inboxRepository: Repository<Inbox>,
  ) {}

  @EventPattern('workflows.create')
  async create(
    @Payload() createWorkflowDto: CreateWorkflowDto,
    @Ctx() context: RmqContext,
  ) {
    console.log(`Pattern: ${context.getPattern()}`);

    const message = context.getMessage();
    const inboxMessage = await this.inboxRepository.findOne({
      where: {
        messageId: message.properties.messageId,
      },
    });
    if (!inboxMessage) {
      await this.inboxRepository.save({
        messageId: message.properties.messageId,
        pattern: context.getPattern(),
        payload: createWorkflowDto,
        status: 'Pending',
      });
    }

    const channel = context.getChannelRef();
    channel.ack(message);
  }

  @Get()
  findAll() {
    return this.workflowsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workflowsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWorkflowDto: UpdateWorkflowDto,
  ) {
    return this.workflowsService.update(+id, updateWorkflowDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workflowsService.remove(+id);
  }
}
