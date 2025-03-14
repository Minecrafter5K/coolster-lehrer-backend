import { LehrerWithScore } from './lehrerWithScore.entity';

export class Abstimmung {
  id: number;
  name: string;
  startDate: string;
  endDate: string;

  constructor(id: number, name: string, startDate: string, endDate: string) {
    this.id = id;
    this.name = name;
    this.startDate = startDate;
    this.endDate = endDate;
  }
}

export class AbstimmungDetail {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  winner: LehrerWithScore;

  constructor(
    id: number,
    name: string,
    winner: LehrerWithScore,
    startDate: string,
    endDate: string,
  ) {
    this.id = id;
    this.name = name;
    this.winner = winner;
    this.startDate = startDate;
    this.endDate = endDate;
  }
}
