import { Module } from '@nestjs/common';
import { VotesService } from './votes.service';
import { VotesController } from './votes.controller';
import { databaseUrlProvider } from '../databaseUrlProvider';

@Module({
  controllers: [VotesController],
  providers: [VotesService, databaseUrlProvider],
})
export class VotesModule {}
