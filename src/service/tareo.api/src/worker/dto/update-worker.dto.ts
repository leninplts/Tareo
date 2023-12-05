import { PartialType } from '@nestjs/mapped-types';
import { CreateWorkerDto } from './create-worker.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateWorkerDto extends PartialType(CreateWorkerDto) {
  @IsNotEmpty()
  tareo: string;
}
