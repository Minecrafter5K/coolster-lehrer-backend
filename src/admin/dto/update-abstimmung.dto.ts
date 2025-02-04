import { PartialType } from '@nestjs/mapped-types';
import { CreateAbstimmungDto } from './create-abstimmung.dto';

export class UpdateAbstimmungDto extends PartialType(CreateAbstimmungDto) {}
