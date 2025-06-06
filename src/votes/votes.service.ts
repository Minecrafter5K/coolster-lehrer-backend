import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { CreateVoteDto } from './dto/create-vote.dto';
import { drizzle, MySql2Database } from 'drizzle-orm/mysql2';
import { abstimmungenTable, lehrerTable, voteTable } from '../db/schema';
import { LehrerWithScore } from './entities/lehrerWithScore.entity';
import { eq, desc } from 'drizzle-orm';
import { Abstimmung, AbstimmungDetail } from './entities/abstimmung.entity';

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

  async bulkCreate(
    createVoteDto: CreateVoteDto[],
    votedCookie: number[] = [],
  ): Promise<{ affectedRows: number; newVoted: number[] }> {
    const submittedIds = Array.from(
      new Set(createVoteDto.map((v) => v.abstimmungId)),
    );
    const overlap = submittedIds.filter((id) => votedCookie.includes(id));
    if (overlap.length > 0) {
      throw new BadRequestException(
        'User already voted for abstimmung ' + overlap.join(','),
      );
    }

    // insert votes
    const result = await this.db.insert(voteTable).values(createVoteDto);
    const affectedRows = result[0].affectedRows;

    // update cookie
    const newVoted = Array.from(new Set([...votedCookie, ...submittedIds]));
    return { affectedRows, newVoted };
  }

  async findAll() {
    return this.db.select().from(voteTable);
  }

  async rank(abstimmung_id: number): Promise<LehrerWithScore[]> {
    const lehrer = await this.db.select().from(lehrerTable);
    const votes = await this.db
      .select()
      .from(voteTable)
      .where(eq(voteTable.abstimmungId, abstimmung_id));

    const lehrerWithScore = lehrer.map((l) => {
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

    let currentRank = 0;

    return lehrerWithScore
      .sort((a, b) => b.score - a.score)
      .map((l, i, arr) => {
        if (i === 0 || arr[i - 1].score !== l.score) {
          currentRank += 1;
        }
        return {
          ...l,
          rank: currentRank,
        };
      });
  }

  async currentAbstimmung(): Promise<Abstimmung> {
    const result = await this.db
      .select()
      .from(abstimmungenTable)
      .orderBy(desc(abstimmungenTable.id))
      .limit(1);

    return result[0];
  }

  async abstimmungen() {
    return this.db.select().from(abstimmungenTable);
  }

  async getAbstimmungenDetail(): Promise<AbstimmungDetail[]> {
    const abstimmungen = await this.db.select().from(abstimmungenTable);

    return await Promise.all(
      abstimmungen.map(async (a) => {
        const lehrer = await this.rank(a.id);

        return {
          id: a.id,
          name: a.name,
          startDate: a.startDate,
          endDate: a.endDate,
          winner: lehrer[0],
        };
      }),
    );
  }

  // remove(id: number) {
  //   return `This action removes a #${id} vote`;
  // }
}
