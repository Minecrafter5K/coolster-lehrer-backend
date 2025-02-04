import { Inject, Injectable } from '@nestjs/common';
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

  async findAll() {
    return this.db.select().from(lehrerTable);
  }

  async findOne(id: number) {
    const lehrer = await this.db
      .select()
      .from(lehrerTable)
      .where(eq(lehrerTable.id, id))
      .limit(1);

    return lehrer[0];
  }
}
