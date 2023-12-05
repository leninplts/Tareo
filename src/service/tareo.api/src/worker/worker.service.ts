import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { UpdateWorkerDto } from './dto/update-worker.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Worker } from './entities/worker.entity';
import { Repository } from 'typeorm';

@Injectable()
export class WorkerService {
  constructor(
    @InjectRepository(Worker)
    private readonly workerRepository: Repository<Worker>,
  ) {}
  async create(createWorkerDto: CreateWorkerDto) {
    console.log(createWorkerDto);
    const { name, dni } = createWorkerDto;
    const exist = await this.workerRepository.findOneBy({ dni });
    if (exist)
      throw new BadRequestException({
        message: `El nombre: ${name} ya existe`,
      });
    const item = await this.workerRepository.create(createWorkerDto);
    this.workerRepository.save(item);
    return { message: `Item ${item.name} creado` };
  }

  async findAll() {
    const workers = await this.workerRepository.find({
      relations: { tareos: false },
    });
    return workers;
  }

  findOne(id: number) {
    return `This action returns a #${id} worker`;
  }

  async update(id: number, updateWorkerDto: UpdateWorkerDto) {
    const item = await this.workerRepository.findOneBy({ id });
    if (!item)
      throw new NotFoundException({
        message: `Item ${id} no existe`,
      });
    // await this.workerRepository.update({ id: id }, updateWorkerDto);
    return { message: `Item ${updateWorkerDto.tareo} actualizado` };
  }

  remove(id: number) {
    return `This action removes a #${id} worker`;
  }
}
