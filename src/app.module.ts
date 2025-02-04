import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LehrerModule } from './lehrer/lehrer.module';
import { VotesModule } from './votes/votes.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [LehrerModule, VotesModule, AdminModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
