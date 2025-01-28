import { Injectable } from '@nestjs/common';
import { CreateLehrerDto } from './dto/create-lehrer.dto';
import { UpdateLehrerDto } from './dto/update-lehrer.dto';
import { drizzle, MySql2Database } from 'drizzle-orm/mysql2';
import { lehrerTable } from '../db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class LehrerService {
  db: MySql2Database;
  constructor() {
    this.db = drizzle(process.env.DATABASE_URL!);
  }

  async create(createLehrerDto: CreateLehrerDto) {
    return this.db.insert(lehrerTable).values(createLehrerDto);
  }

  async findAll() {
    return this.db.select().from(lehrerTable);
  }

  async findOne(id: number) {
    return this.db
      .select()
      .from(lehrerTable)
      .where(eq(lehrerTable.id, id))
      .limit(1);
  }

  update(id: number, updateLehrerDto: UpdateLehrerDto) {
    return this.db
      .update(lehrerTable)
      .set(updateLehrerDto)
      .where(eq(lehrerTable.id, id));
  }

  remove(id: number) {
    return this.db.delete(lehrerTable).where(eq(lehrerTable.id, id));
  }
}
