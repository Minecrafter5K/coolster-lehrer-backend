import { Module } from '@nestjs/common';
import { VotesService } from './votes.service';
import { VotesController } from './votes.controller';

const databaseUrlProvider = {
  provide: 'DATABASE_URL',
  useValue: process.env.DATABASE_URL,
};

@Module({
  controllers: [VotesController],
  providers: [VotesService, databaseUrlProvider],
})
export class VotesModule {}
