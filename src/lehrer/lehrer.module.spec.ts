import { Test } from '@nestjs/testing';
import { LehrerModule } from './lehrer.module';
import { LehrerService } from './lehrer.service';

describe('LehrerModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [LehrerModule],
    }).compile();

    expect(module).toBeDefined();
    expect(module.get(LehrerService)).toBeInstanceOf(LehrerService);
  });
});
