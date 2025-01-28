import { PartialType } from '@nestjs/mapped-types';
import { CreateLehrerDto } from './create-lehrer.dto';

export class UpdateLehrerDto extends PartialType(CreateLehrerDto) {}
