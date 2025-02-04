import { Test, TestingModule } from '@nestjs/testing';
import { Provider } from '@nestjs/common';
import { MySqlContainer, StartedMySqlContainer } from '@testcontainers/mysql';
import { drizzle, MySql2Database } from 'drizzle-orm/mysql2';
import { migrate } from 'drizzle-orm/mysql2/migrator';
import { reset, seed } from 'drizzle-seed';
import { lehrerTable, voteTable, abstimmungenTable } from '../db/schema';
import { AdminService } from './admin.service';

const SECONDS = 1000;
jest.setTimeout(70 * SECONDS);

describe('AdminService', () => {
  let urlProvider: Provider;
  let dbContainer: StartedMySqlContainer;
  let db: MySql2Database;
  let service: AdminService;

  beforeAll(async () => {
    dbContainer = await new MySqlContainer('mysql:8.4')
      .withDatabase('cooslterlehrer')
      .start();

    db = drizzle(dbContainer.getConnectionUri());
    const migrationPath = './src/db/migrations';
    await migrate(db, {
      migrationsFolder: migrationPath,
    });

    urlProvider = {
      provide: 'DATABASE_URL',
      useValue: dbContainer.getConnectionUri(),
    };
  });
  afterAll(async () => {
    await dbContainer.stop();
  });

  beforeEach(async () => {
    await reset(db, { lehrerTable, voteTable, abstimmungenTable });
    await seed(db, { lehrerTable, voteTable, abstimmungenTable });

    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminService, urlProvider],
    }).compile();

    service = module.get<AdminService>(AdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createAbstimmung', () => {
    it('should create a new abstimmung', async () => {
      const abstimmung = { name: 'test abstimmung' };

      await service.createAbstimmung(abstimmung);

      const result = await db.select().from(abstimmungenTable);
      expect(result).toHaveLength(11);
      expect(result.slice(-1)[0].name).toEqual('test abstimmung');
    });
  });

  describe('createLehrer', () => {
    it('should create a new lehrer', async () => {
      const lehrer = { name: 'test lehrer' };

      await service.createLehrer(lehrer);

      const result = await db.select().from(lehrerTable);
      expect(result).toHaveLength(11);
      expect(result.slice(-1)[0].name).toEqual('test lehrer');
    });
  });

  describe('updateLehrer', () => {
    it('should update a lehrer', async () => {
      const lehrer = { name: 'test lehrer' };

      await service.createLehrer(lehrer);

      const result = await db.select().from(lehrerTable);
      const lehrerId = result.slice(-1)[0].id;

      await service.updateLehrer(lehrerId, { name: 'updated lehrer' });

      const updatedResult = await db.select().from(lehrerTable);
      expect(updatedResult).toHaveLength(11);
      expect(updatedResult.slice(-1)[0].name).toEqual('updated lehrer');
    });
  });

  describe('deleteLehrer', () => {
    it('should delete a lehrer', async () => {
      const lehrer = { name: 'test lehrer' };

      await service.createLehrer(lehrer);

      const result = await db.select().from(lehrerTable);
      const lehrerId = result.slice(-1)[0].id;

      await service.deleteLehrer(lehrerId);

      const updatedResult = await db.select().from(lehrerTable);
      expect(updatedResult).toHaveLength(10);
    });
  });
});
