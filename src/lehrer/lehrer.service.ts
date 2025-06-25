import { Inject, Injectable } from '@nestjs/common';
import { drizzle, MySql2Database } from 'drizzle-orm/mysql2';
import { lehrerTable, lehrerPhotoTable } from '../db/schema';
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

  async getPhoto(id: number): Promise<Uint8Array | null> {
    // const result = await this.db
    //   .select({ photo: lehrerPhotoTable.photo })
    //   .from(lehrerPhotoTable)
    //   .where(eq(lehrerPhotoTable.lehrerId, id))
    //   .limit(1);
    const result = await this.db
      .select({ photo: lehrerPhotoTable.photo })
      .from(lehrerTable)
      .where(eq(lehrerTable.id, id))
      .leftJoin(lehrerPhotoTable, eq(lehrerTable.photo_id, lehrerPhotoTable.id))
      .limit(1);
    return result[0]?.photo ?? null;
  }
}
