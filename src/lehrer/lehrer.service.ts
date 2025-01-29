import { Inject, Injectable } from '@nestjs/common';
import { CreateLehrerDto } from './dto/create-lehrer.dto';
import { UpdateLehrerDto } from './dto/update-lehrer.dto';
import { drizzle, MySql2Database } from 'drizzle-orm/mysql2';
import { lehrerTable } from '../db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class LehrerService implements LehrerService {
  db: MySql2Database;
  constructor(@Inject('DATABASE_URL') database_url: string) {
    if (!database_url) throw new Error('no database url');

    this.db = drizzle(database_url);
  }

  async create(createLehrerDto: CreateLehrerDto) {
    await this.db.insert(lehrerTable).values(createLehrerDto);
    return null;
  }

  async findAll() {
    return this.db.select().from(lehrerTable);
  }

  async findOne(id: number) {
    const lehrer = await this.db
      .select()
      .from(lehrerTable)
      .where(eq(lehrerTable.id, id))
      .limit(1)
      .execute();
    return lehrer[0];
  }

  async update(id: number, updateLehrerDto: UpdateLehrerDto) {
    await this.db
      .update(lehrerTable)
      .set(updateLehrerDto)
      .where(eq(lehrerTable.id, id));
    return null;
  }

  async remove(id: number) {
    await this.db.delete(lehrerTable).where(eq(lehrerTable.id, id));
    return null;
  }
}
