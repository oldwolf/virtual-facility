import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateBuildingDto } from './dto/create-building.dto';
import { UpdateBuildingDto } from './dto/update-building.dto';
import { CreateWorkflowDto } from '@app/workflows';
import { InjectRepository } from '@nestjs/typeorm';
import { Building } from './entities/building.entity';
import { Repository } from 'typeorm';
import { WORKFLOWS_SERVICE } from '../constant';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class BuildingsService {
  private readonly logger = new Logger(BuildingsService.name);

  constructor(
    @InjectRepository(Building)
    private readonly buildingRepository: Repository<Building>,
    @Inject(WORKFLOWS_SERVICE)
    private readonly workflowsService: ClientProxy,
  ) {}

  async create(createBuildingDto: CreateBuildingDto) {
    await this.createWorkflow(1);
    return 'This action adds a new building';
  }

  async findAll(): Promise<Building[]> {
    return this.buildingRepository.find();
  }

  async findOne(id: number): Promise<Building> {
    const building = await this.buildingRepository.findOne({ where: { id } });

    if (!building) {
      throw new NotFoundException(`Building #${id} does not exist`);
    }

    return building;
  }

  async update(
    id: number,
    updateBuildingDto: UpdateBuildingDto,
  ): Promise<Building> {
    const building = await this.buildingRepository.preload({
      id,
      ...updateBuildingDto,
    });

    if (!building) {
      throw new NotFoundException(`Building #${id} does not exist`);
    }

    return building;
  }

  async remove(id: number): Promise<Building> {
    const building = await this.findOne(id);

    if (!building) {
      throw new NotFoundException(`Building #${id} does not exist`);
    }

    return await this.buildingRepository.remove(building);
  }

  async createWorkflow(buildingId: number) {
    this.logger.debug(`Create Workflow`);

    const newWorkflow = await lastValueFrom(
      this.workflowsService.send('workflows.create', {
        name: 'My Workflow',
        buildingId,
      } as CreateWorkflowDto),
    );

    console.log({ newWorkflow });

    return newWorkflow;
  }
}
