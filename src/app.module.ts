import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LehrerModule } from './lehrer/lehrer.module';
import { VotesModule } from './votes/votes.module';

@Module({
  imports: [LehrerModule, VotesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
