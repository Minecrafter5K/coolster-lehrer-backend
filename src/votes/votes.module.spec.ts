import { Test } from '@nestjs/testing';
import { VotesModule } from './votes.module';
import { VotesService } from './votes.service';

describe('VotesModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [VotesModule],
    }).compile();

    expect(module).toBeDefined();
    expect(module.get(VotesService)).toBeInstanceOf(VotesService);
  });
});
