import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { LehrerService } from './lehrer.service';
import { CreateLehrerDto } from './dto/create-lehrer.dto';
import { UpdateLehrerDto } from './dto/update-lehrer.dto';

@Controller('lehrer')
export class LehrerController {
  constructor(private readonly lehrerService: LehrerService) {}

  @Post()
  create(@Body() createLehrerDto: CreateLehrerDto) {
    return this.lehrerService.create(createLehrerDto);
  }

  @Get()
  async findAll() {
    return this.lehrerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lehrerService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLehrerDto: UpdateLehrerDto) {
    return this.lehrerService.update(+id, updateLehrerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lehrerService.remove(+id);
  }
}
