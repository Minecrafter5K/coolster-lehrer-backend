import { Test, TestingModule } from '@nestjs/testing';
import { Provider } from '@nestjs/common';
import { MySqlContainer, StartedMySqlContainer } from '@testcontainers/mysql';
import { drizzle, MySql2Database } from 'drizzle-orm/mysql2';
import { migrate } from 'drizzle-orm/mysql2/migrator';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import seedDb from '../utils/seed';

const SECONDS = 1000;
jest.setTimeout(70 * SECONDS);

describe('AuthController', () => {
  let controller: AuthController;
  let urlProvider: Provider;
  let dbContainer: StartedMySqlContainer;
  let db: MySql2Database;

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
      controllers: [AuthController],
      providers: [AuthService, urlProvider],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
