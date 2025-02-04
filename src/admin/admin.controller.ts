import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAbstimmungDto } from './dto/create-abstimmung.dto';
import { CreateLehrerDto } from './dto/create-lehrer.dto';
import { UpdateLehrerDto } from './dto/update-lehrer.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('createAbstimmung')
  createAbstimmung(@Body() abstimmung: CreateAbstimmungDto) {
    return this.adminService.createAbstimmung(abstimmung);
  }

  @Post('createLehrer')
  createLehrer(@Body() lehrer: CreateLehrerDto) {
    return this.adminService.createLehrer(lehrer);
  }

  @Patch('lehrer/:id')
  update(@Param('id') id: string, @Body() updateLehrerDto: UpdateLehrerDto) {
    return this.adminService.updateLehrer(+id, updateLehrerDto);
  }

  @Delete('lehrer/:id')
  remove(@Param('id') id: string) {
    return this.adminService.deleteLehrer(+id);
  }

  @Patch('abstimmung/:id')
  updateAbstimmung(
    @Param('id') id: string,
    @Body() updateAbstimmungDto: CreateAbstimmungDto,
  ) {
    return this.adminService.updateAbstimmung(+id, updateAbstimmungDto);
  }

  @Delete('abstimmung/:id')
  removeAbstimmung(@Param('id') id: string) {
    return this.adminService.deleteAbstimmung(+id);
  }
}
