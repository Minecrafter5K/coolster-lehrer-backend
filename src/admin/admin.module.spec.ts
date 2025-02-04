import { Test } from '@nestjs/testing';
import { AdminModule } from './admin.module';
import { AdminService } from './admin.service';

describe('AdminModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [AdminModule],
    }).compile();

    expect(module).toBeDefined();
    expect(module.get(AdminService)).toBeInstanceOf(AdminService);
  });
});
