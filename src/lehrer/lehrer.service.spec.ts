import { Test, TestingModule } from '@nestjs/testing';
import { LehrerService } from './lehrer.service';
import { MySqlContainer, StartedMySqlContainer } from '@testcontainers/mysql';
import { Provider } from '@nestjs/common';
import { drizzle, MySql2Database } from 'drizzle-orm/mysql2';
import { migrate } from 'drizzle-orm/mysql2/migrator';

import seedDb from '../utils/seed';

const SECONDS = 1000;
jest.setTimeout(70 * SECONDS);

describe('LehrerService', () => {
  let urlProvider: Provider;
  let dbContainer: StartedMySqlContainer;
  let db: MySql2Database;
  let service: LehrerService;

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
      providers: [LehrerService, urlProvider],
    }).compile();

    service = module.get<LehrerService>(LehrerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of lehrer', async () => {
      const result = await service.findAll();
      expect(result).toBeDefined();
      expect(result).toBeInstanceOf(Array);
    });
    it('should be more than one lehrer', async () => {
      const result = await service.findAll();
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('findOne', () => {
    it('should return something', async () => {
      const result = await service.findOne(1);
      expect(result).toBeDefined();
    });
    it('should return something of the type lehrer', async () => {
      const result = await service.findOne(1);
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('name');
    });
  });
});
