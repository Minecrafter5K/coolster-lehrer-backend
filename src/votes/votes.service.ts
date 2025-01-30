import { Inject, Injectable } from '@nestjs/common';
import { CreateVoteDto } from './dto/create-vote.dto';
import { drizzle, MySql2Database } from 'drizzle-orm/mysql2';
import { lehrerTable, voteTable } from '../db/schema';

@Injectable()
export class VotesService {
  db: MySql2Database;
  constructor(@Inject('DATABASE_URL') database_url: string) {
    if (!database_url) throw new Error('no database url');

    this.db = drizzle(database_url);
  }

  async create(createVoteDto: CreateVoteDto) {
    await this.db.insert(voteTable).values(createVoteDto);
    return null;
  }

  async bulkCreate(createVoteDto: CreateVoteDto[]) {
    const result = await this.db.insert(voteTable).values(createVoteDto);
    return result[0].affectedRows;
  }

  async findAll() {
    return this.db.select().from(voteTable);
  }

  async rank() {
    const lehrer = await this.db.select().from(lehrerTable);
    const votes = await this.db.select().from(voteTable);

    const mappedLehrer = lehrer.map((l) => {
      let score = 0;

      votes
        .filter((v) => v.lehrerId === l.id)
        .forEach((v) => {
          score += v.vote;
        });

      return {
        ...l,
        score,
      };
    });

    return mappedLehrer.sort((a, b) => b.score - a.score);
  }

  // remove(id: number) {
  //   return `This action removes a #${id} vote`;
  // }
}
