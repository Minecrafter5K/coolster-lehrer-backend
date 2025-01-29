import { Injectable } from '@nestjs/common';

import { ILehrerService } from './iLehrerService';
import { CreateLehrerDto } from './dto/create-lehrer.dto';
import { UpdateLehrerDto } from './dto/update-lehrer.dto';

@Injectable()
export class LehrerMockService implements ILehrerService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  create(createLehrerDto: CreateLehrerDto) {
    return Promise.resolve(null);
  }

  findAll(): Promise<CreateLehrerDto[]> {
    return Promise.resolve([
      {
        id: 1,
        name: 'Max Mustermann',
        coolness: 100,
      },
      {
        id: 2,
        name: 'Maxine Mustermann',
        coolness: 100,
      },
    ]);
  }

  findOne(id: number): Promise<CreateLehrerDto> {
    return Promise.resolve({
      id: id,
      name: 'Max Mustermann',
      coolness: 100,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  remove(id: number) {
    return Promise.resolve(null);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(id: number, updateLehrerDto: UpdateLehrerDto) {
    return Promise.resolve(null);
  }
}
