import { Controller, Get, Body, Patch, Param, Delete } from '@nestjs/common';
import { WorkflowsService } from './workflows.service';
import { CreateWorkflowDto, UpdateWorkflowDto } from '@app/workflows';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';

@Controller('workflows')
export class WorkflowsController {
  constructor(private readonly workflowsService: WorkflowsService) {}

  @MessagePattern('workflows.create')
  create(
    @Payload() createWorkflowDto: CreateWorkflowDto,
    @Ctx() context: RmqContext,
  ) {
    console.log(`Pattern: ${context.getPattern()}`);
    return this.workflowsService.create(createWorkflowDto);
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
