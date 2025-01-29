import { Test, TestingModule } from '@nestjs/testing';
import { LehrerService } from './lehrer.service';

import { LehrerMockService } from './lehrerMock.service';

describe('LehrerService', () => {
  let service: LehrerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LehrerMockService],
    }).compile();

    service = module.get<LehrerService>(LehrerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
