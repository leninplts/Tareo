import { PartialType } from '@nestjs/mapped-types';
import { CreateTareoDto } from './create-tareo.dto';

export class UpdateTareoDto extends PartialType(CreateTareoDto) {}
