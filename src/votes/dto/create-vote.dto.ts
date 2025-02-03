export class CreateVoteDto {
  lehrerId: number;
  vote: number;
  abstimmungId: number;

  constructor(lehrerId: number, vote: number, abstimmungId: number) {
    this.lehrerId = lehrerId;
    this.vote = vote;
    this.abstimmungId = abstimmungId;
  }
}
