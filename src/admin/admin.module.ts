import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { databaseUrlProvider } from '../databaseUrlProvider';

@Module({
  controllers: [AdminController],
  providers: [AdminService, databaseUrlProvider],
})
export class AdminModule {}
