import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LehrerModule } from './lehrer/lehrer.module';

@Module({
  imports: [LehrerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
