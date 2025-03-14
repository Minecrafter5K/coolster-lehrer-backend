import { Inject, Injectable } from '@nestjs/common';
import { drizzle, MySql2Database } from 'drizzle-orm/mysql2';
import { CreateAbstimmungDto } from './dto/create-abstimmung.dto';
import { abstimmungenTable, lehrerTable } from '../db/schema';
import { eq } from 'drizzle-orm';
import { CreateLehrerDto } from './dto/create-lehrer.dto';
import { UpdateLehrerDto } from './dto/update-lehrer.dto';
import { UpdateAbstimmungDto } from './dto/update-abstimmung.dto';

@Injectable()
export class AdminService {
  db: MySql2Database;
  constructor(@Inject('DATABASE_URL') database_url: string) {
    if (!database_url) throw new Error('no database url');

    this.db = drizzle(database_url);
  }

  async createAbstimmung(abstimmung: CreateAbstimmungDto): Promise<null> {
    await this.db.insert(abstimmungenTable).values(abstimmung);

    return null;
  }

  async createLehrer(createLehrerDto: CreateLehrerDto) {
    await this.db.insert(lehrerTable).values(createLehrerDto);
    return null;
  }

  async updateLehrer(id: number, updateLehrerDto: UpdateLehrerDto) {
    await this.db
      .update(lehrerTable)
      .set(updateLehrerDto)
      .where(eq(lehrerTable.id, id));
    return null;
  }

  async deleteLehrer(id: number) {
    await this.db.delete(lehrerTable).where(eq(lehrerTable.id, id));
    return null;
  }

  async updateAbstimmung(id: number, updateAbstimmungDto: UpdateAbstimmungDto) {
    await this.db
      .update(abstimmungenTable)
      .set(updateAbstimmungDto)
      .where(eq(abstimmungenTable.id, id));
    return null;
  }

  async deleteAbstimmung(id: number) {
    await this.db.delete(abstimmungenTable).where(eq(abstimmungenTable.id, id));
    return null;
  }
}
