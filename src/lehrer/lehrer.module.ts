import { Module } from '@nestjs/common';
import { LehrerService } from './lehrer.service';
import { LehrerController } from './lehrer.controller';

const databaseUrlProvider = {
  provide: 'DATABASE_URL',
  useValue: process.env.DATABASE_URL,
};

@Module({
  controllers: [LehrerController],
  providers: [LehrerService, databaseUrlProvider],
})
export class LehrerModule {}
