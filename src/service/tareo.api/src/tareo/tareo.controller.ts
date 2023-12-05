import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { TareoService } from './tareo.service';
import { CreateTareoDto } from './dto/create-tareo.dto';
import { UpdateTareoDto } from './dto/update-tareo.dto';

@Controller('tareo')
export class TareoController {
  constructor(private readonly tareoService: TareoService) {}

  @Post()
  create(@Body() createTareoDto: CreateTareoDto) {
    return this.tareoService.create(createTareoDto);
  }

  @Get()
  findAll() {
    return this.tareoService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Query('year') year: number,
    @Query('month') month: number,
  ) {
    const data = {
      year: +year,
      month: +month,
    };
    return this.tareoService.findOne(+id, data);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTareoDto: UpdateTareoDto) {
    return this.tareoService.update(+id, updateTareoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tareoService.remove(+id);
  }
}
