import { Module } from '@nestjs/common';
import { LehrerService } from './lehrer.service';
import { LehrerController } from './lehrer.controller';

@Module({
  controllers: [LehrerController],
  providers: [LehrerService],
})
export class LehrerModule {}
