import { Module } from '@nestjs/common';
import { LehrerService } from './lehrer.service';
import { LehrerController } from './lehrer.controller';
import { databaseUrlProvider } from '../databaseUrlProvider';

@Module({
  controllers: [LehrerController],
  providers: [LehrerService, databaseUrlProvider],
})
export class LehrerModule {}
