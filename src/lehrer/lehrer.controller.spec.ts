import { Test, TestingModule } from '@nestjs/testing';
import { LehrerController } from './lehrer.controller';
import { LehrerService } from './lehrer.service';

describe('LehrerController', () => {
  let controller: LehrerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LehrerController],
      providers: [LehrerService],
    }).compile();

    controller = module.get<LehrerController>(LehrerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
