import { UpdateLehrerDto } from './dto/update-lehrer.dto';
import { CreateLehrerDto } from './dto/create-lehrer.dto';

export interface ILehrerService {
  create(createLehrerDto: CreateLehrerDto): Promise<null>;
  findAll(): Promise<CreateLehrerDto[]>;
  findOne(id: number): Promise<CreateLehrerDto>;
  update(id: number, updateLehrerDto: UpdateLehrerDto): Promise<null>;
  remove(id: number): Promise<null>;
}
