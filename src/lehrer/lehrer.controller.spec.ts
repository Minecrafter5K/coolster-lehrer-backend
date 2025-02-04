import { Test, TestingModule } from '@nestjs/testing';
import { LehrerController } from './lehrer.controller';
import { LehrerService } from './lehrer.service';
import { Provider } from '@nestjs/common';
import { MySqlContainer, StartedMySqlContainer } from '@testcontainers/mysql';
import { drizzle, MySql2Database } from 'drizzle-orm/mysql2';
import { migrate } from 'drizzle-orm/mysql2/migrator';
import { reset, seed } from 'drizzle-seed';
import { lehrerTable } from '../db/schema';

const SECONDS = 1000;
jest.setTimeout(70 * SECONDS);

describe('LehrerController', () => {
  let urlProvider: Provider;
  let dbContainer: StartedMySqlContainer;
  let db: MySql2Database;
  let controller: LehrerController;

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
    await reset(db, { lehrerTable });
    await seed(db, { lehrerTable });

    const module: TestingModule = await Test.createTestingModule({
      controllers: [LehrerController],
      providers: [LehrerService, urlProvider],
    }).compile();

    controller = module.get<LehrerController>(LehrerController);
  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should call findAll of service', async () => {
      const spy = jest.spyOn(controller['lehrerService'], 'findAll');

      await controller.findAll();

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should call findOne of service', async () => {
      const spy = jest.spyOn(controller['lehrerService'], 'findOne');

      await controller.findOne('1');

      expect(spy).toHaveBeenCalledWith(1);
    });
  });
});
