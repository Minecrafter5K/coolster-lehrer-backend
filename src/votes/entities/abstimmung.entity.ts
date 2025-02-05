import { LehrerWithScore } from './lehrerWithScore.entity';

export class Abstimmung {
  id: number;
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

export class AbstimmungDetail {
  id: number;
  name: string;
  status: AbstimmungStatus;
  endDate: Date;
  winner: LehrerWithScore;

  constructor(
    id: number,
    name: string,
    winner: LehrerWithScore,
    status: AbstimmungStatus,
    endDate: Date,
  ) {
    this.id = id;
    this.name = name;
    this.winner = winner;
    this.status = status;
    this.endDate = endDate;
  }
}

export type AbstimmungStatus = 'running' | 'finished';
