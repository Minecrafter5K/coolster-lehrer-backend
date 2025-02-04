import { Controller, Get, Param } from '@nestjs/common';
import { LehrerService } from './lehrer.service';

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
}
