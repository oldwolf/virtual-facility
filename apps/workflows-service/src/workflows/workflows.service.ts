import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Workflow } from './entities/workflow.entity';
import { Repository } from 'typeorm';
import { CreateWorkflowDto, UpdateWorkflowDto } from '@app/workflows';

@Injectable()
export class WorkflowsService {
  private readonly logger = new Logger(WorkflowsService.name);

  constructor(
    @InjectRepository(Workflow)
    private readonly workflowsRepository: Repository<Workflow>,
  ) {}

  async create(createWorkflowDto: CreateWorkflowDto): Promise<Workflow> {
    const workflow = this.workflowsRepository.create(createWorkflowDto);
    const newWorkflowEntity = await this.workflowsRepository.save(workflow);

    this.logger.debug(
      `Created workflow: ${newWorkflowEntity.id} for building ${newWorkflowEntity.buildingId}`,
    );

    return newWorkflowEntity;
  }

  async findAll(): Promise<Workflow[]> {
    return await this.workflowsRepository.find();
  }

  async findOne(id: number): Promise<Workflow> {
    const workflow = await this.workflowsRepository.findOne({ where: { id } });

    if (!workflow) {
      throw new NotFoundException(`Workflow #{id} does not exist`);
    }

    return workflow;
  }

  async update(
    id: number,
    updateWorkflowDto: UpdateWorkflowDto,
  ): Promise<Workflow> {
    const workflow = await this.workflowsRepository.preload({
      id: +id,
      ...updateWorkflowDto,
    });

    if (!workflow) {
      throw new NotFoundException(`Workflow #{id} does not exist`);
    }

    return await this.workflowsRepository.save(workflow);
  }

  async remove(id: number): Promise<Workflow> {
    const workflow = await this.findOne(id);

    if (!workflow) {
      throw new NotFoundException(`Workflow #${id} does not exist`);
    }

    return await this.workflowsRepository.remove(workflow);
  }
}
