export class Vote {
  id: number;
  lehrerId: number;
  vote: number;

  constructor(id: number, lehrerId: number, vote: number) {
    this.id = id;
    this.lehrerId = lehrerId;
    this.vote = vote;
  }
}
