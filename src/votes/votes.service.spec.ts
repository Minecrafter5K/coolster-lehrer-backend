import { Test, TestingModule } from '@nestjs/testing';
import { VotesService } from './votes.service';
import { Provider } from '@nestjs/common';
import { MySqlContainer, StartedMySqlContainer } from '@testcontainers/mysql';
import { drizzle, MySql2Database } from 'drizzle-orm/mysql2';
import { migrate } from 'drizzle-orm/mysql2/migrator';
import { reset } from 'drizzle-seed';
import seedDb from '../utils/seed';
import { lehrerTable, voteTable } from '../db/schema';

const SECONDS = 1000;
jest.setTimeout(70 * SECONDS);

describe('VotesService', () => {
  let urlProvider: Provider;
  let dbContainer: StartedMySqlContainer;
  let db: MySql2Database;
  let service: VotesService;

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
    await seedDb(db);

    const module: TestingModule = await Test.createTestingModule({
      providers: [VotesService, urlProvider],
    }).compile();

    service = module.get<VotesService>(VotesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of votes', async () => {
      const result = await service.findAll();
      expect(result).toBeInstanceOf(Array);
    });
  });

  describe('create', () => {
    it('should return null', async () => {
      const result = await service.create({
        lehrerId: 1,
        vote: 0,
        abstimmungId: 1,
      });
      expect(result).toBeNull();
    });
    it('should create vote in DB', async () => {
      await reset(db, { voteTable });

      await service.create({ lehrerId: 2, vote: 0, abstimmungId: 1 });

      const votes = await db.select().from(voteTable);
      expect(votes).toEqual([
        {
          id: 1,
          lehrerId: 2,
          vote: 0,
          abstimmungId: 1,
        },
      ]);
    });
  });

  describe('bulkCreate', () => {
    it('should return number of inserted rows', async () => {
      const result1 = await service.bulkCreate([
        { lehrerId: 1, vote: 0, abstimmungId: 1 },
      ]);
      expect(result1).toBe(1);
      const result2 = await service.bulkCreate([
        { lehrerId: 1, vote: 0, abstimmungId: 1 },
        { lehrerId: 2, vote: 1, abstimmungId: 1 },
      ]);
      expect(result2).toBe(2);
    });
    it('should insert data into DB', async () => {
      await reset(db, { voteTable });

      const data = [
        { lehrerId: 1, vote: 0, abstimmungId: 1 },
        { lehrerId: 2, vote: 1, abstimmungId: 1 },
      ];

      await service.bulkCreate(data);

      const votes = await db.select().from(voteTable);
      expect(votes).toEqual(withID(data));
    });
  });

  describe('rank', () => {
    it('should return all lehrer', async () => {
      const result = await service.rank(1);
      const expectedLehrer = await db.select().from(lehrerTable);

      expect(result).toHaveLength(expectedLehrer.length);
    });

    it('should return ordered by votes', async () => {
      await reset(db, { voteTable });
      await db.insert(voteTable).values([
        { lehrerId: 2, vote: 0, abstimmungId: 1 },
        { lehrerId: 2, vote: 1, abstimmungId: 1 },
        { lehrerId: 3, vote: 1, abstimmungId: 1 },
        { lehrerId: 1, vote: -1, abstimmungId: 1 },
      ]);

      const result = await service.rank(1);
      const orderedResult = [...result].sort((a, b) => b.score - a.score);
      expect(result).toEqual(orderedResult);
    });
  });

  describe('currentAbstimmung', () => {
    it('should return current abstimmung', async () => {
      await seedDb(db);
      const result = await service.currentAbstimmung();

      expect(result).toBeDefined();
    });
  });

  describe('abstimmungen', () => {
    it('should return all abstimmungen', async () => {
      const result = await service.abstimmungen();
      expect(result).toBeDefined();
    });
  });
});

type WithID<T> = T & { id: number };
function withID<T>(data: T[]): WithID<T>[] {
  return data.map((item, index) => ({ ...item, id: index + 1 }));
}
