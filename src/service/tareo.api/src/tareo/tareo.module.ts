import { Module } from '@nestjs/common';
import { TareoService } from './tareo.service';
import { TareoController } from './tareo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tareo } from './entities/tareo.entity';
import { Worker } from 'src/worker/entities/worker.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tareo, Worker])],
  controllers: [TareoController],
  providers: [TareoService],
})
export class TareoModule {}
