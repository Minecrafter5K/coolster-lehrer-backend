import { AbstimmungStatus } from 'src/votes/entities/abstimmung.entity';

export class CreateAbstimmungDto {
  id?: number;
  name: string;
  status: AbstimmungStatus;
  endDate: Date;

  constructor(
    id: number,
    name: string,
    status: AbstimmungStatus,
    endDate: Date,
  ) {
    this.id = id;
    this.name = name;
    this.status = status;
    this.endDate = endDate;
  }
}
