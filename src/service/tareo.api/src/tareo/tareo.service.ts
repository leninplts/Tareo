import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTareoDto } from './dto/create-tareo.dto';
import { UpdateTareoDto } from './dto/update-tareo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tareo } from './entities/tareo.entity';
import { Repository } from 'typeorm';
import { Worker } from 'src/worker/entities/worker.entity';

@Injectable()
export class TareoService {
  constructor(
    @InjectRepository(Tareo)
    private readonly tareoRepository: Repository<Tareo>,
    @InjectRepository(Worker)
    private readonly workerRepository: Repository<Worker>,
  ) {}
  async create(createTareoDto: CreateTareoDto) {
    console.log(createTareoDto);
    const { workerId, ...newCreateTareoDto } = createTareoDto;
    const { year, month } = newCreateTareoDto;
    const worker = await this.workerRepository.findOneBy({ id: workerId });
    if (!worker)
      throw new BadRequestException({
        message: `El nombre: ${workerId} aun no existe`,
      });
    const item = this.tareoRepository.create(createTareoDto);
    item.worker = worker;
    this.tareoRepository.save(item);
    return { message: `Tareo ${year}-${month} creado` };
  }

  findAll() {
    return `This action returns all tareo`;
  }

  async findOne(id: number, data: any) {
    // console.log(id, data);
    const worker = await this.workerRepository
      .createQueryBuilder('worker')
      .leftJoinAndSelect('worker.tareos', 'tareo')
      .where(`worker.id = ${id}`)
      .andWhere(`tareo.year = ${data.year}`)
      .andWhere(`tareo.month = ${data.month}`)
      .getOne();
    return worker;
  }

  async update(id: number, updateTareoDto: UpdateTareoDto) {
    console.log(updateTareoDto);
    const { workerId, year, month, tareo: inTareo } = updateTareoDto;
    const worker = await this.workerRepository.findOneBy({ id: workerId });
    const tareo = await this.tareoRepository.findOneBy({
      worker,
      year,
      month,
      id,
    });
    tareo.tareo = inTareo;
    await this.tareoRepository.save(tareo);
    return `Tareo actualizado`;
  }

  remove(id: number) {
    return `This action removes a #${id} tareo`;
  }
}
