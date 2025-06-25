import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { LehrerService } from './lehrer.service';
import { Buffer } from 'buffer';

@Controller('lehrer')
export class LehrerController {
  constructor(private readonly lehrerService: LehrerService) {}

  @Get()
  findAll() {
    return this.lehrerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lehrerService.findOne(+id);
  }

  @Get(':id/photo')
  async getPhoto(@Param('id') id: string) {
    const photo = await this.lehrerService.getPhoto(+id);
    if (!photo) {
      throw new NotFoundException(`Photo for teacher ${id} not found`);
    }
    return Buffer.from(photo).toString('base64');
  }
}
