import { Inject, Injectable } from '@nestjs/common';
import { drizzle, MySql2Database } from 'drizzle-orm/mysql2';
import { CreateAbstimmungDto } from './dto/create-abstimmung.dto';
import { abstimmungenTable, lehrerTable, lehrerPhotoTable } from '../db/schema';
import { eq } from 'drizzle-orm';
import { CreateLehrerDto } from './dto/create-lehrer.dto';
import { UpdateLehrerDto } from './dto/update-lehrer.dto';
import { UpdateAbstimmungDto } from './dto/update-abstimmung.dto';
import { CreateLehrerPhotoDto } from './dto/create-lehrer-photo.dto';

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

  async addLehrerPhoto(id: number, createLehrerPhotoDto: CreateLehrerPhotoDto) {
    const buffer = Buffer.from(createLehrerPhotoDto.photo, 'base64');
    // insert photo
    const inserted = await this.db
      .insert(lehrerPhotoTable)
      .values({ photo: buffer });

    // update teacher with photo_id
    await this.db
      .update(lehrerTable)
      .set({ photo_id: inserted[0].insertId })
      .where(eq(lehrerTable.id, id));
    return null;
  }

  async deleteLehrerPhoto(id: number) {
    // find existing photo_id
    const [lehrer] = await this.db
      .select({ photo_id: lehrerTable.photo_id })
      .from(lehrerTable)
      .where(eq(lehrerTable.id, id))
      .limit(1);
    if (lehrer?.photo_id) {
      await this.db
        .delete(lehrerPhotoTable)
        .where(eq(lehrerPhotoTable.id, lehrer.photo_id));
      await this.db
        .update(lehrerTable)
        .set({ photo_id: null })
        .where(eq(lehrerTable.id, id));
    }
    return null;
  }
}
