export class CreateVoteDto {
  lehrerId: number;
  vote: number;

  constructor(lehrerId: number, vote: number) {
    this.lehrerId = lehrerId;
    this.vote = vote;
  }
}
