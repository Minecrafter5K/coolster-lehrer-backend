import { LehrerWithScore } from './lehrerWithScore.entity';

export class Abstimmung {
  id: number;
  name: string;
  startDate: Date;
  endDate: Date;

  constructor(id: number, name: string, startDate: Date, endDate: Date) {
    this.id = id;
    this.name = name;
    this.startDate = startDate;
    this.endDate = endDate;
  }
}

export class AbstimmungDetail {
  id: number;
  name: string;
  startDate: Date;
  endDate: Date;
  winner: LehrerWithScore;

  constructor(
    id: number,
    name: string,
    winner: LehrerWithScore,
    startDate: Date,
    endDate: Date,
  ) {
    this.id = id;
    this.name = name;
    this.winner = winner;
    this.startDate = startDate;
    this.endDate = endDate;
  }
}
