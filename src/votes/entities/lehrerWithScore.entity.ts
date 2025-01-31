export class LehrerWithScore {
  name: string;
  score: number;
  rank: number;

  constructor(name: string, score: number, rank: number) {
    this.name = name;
    this.score = score;
    this.rank = rank;
  }
}
