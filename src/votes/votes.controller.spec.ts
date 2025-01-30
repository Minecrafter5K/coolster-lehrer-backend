import { Test, TestingModule } from '@nestjs/testing';
import { VotesController } from './votes.controller';
import { VotesService } from './votes.service';
import { Provider } from '@nestjs/common';
import { MySqlContainer, StartedMySqlContainer } from '@testcontainers/mysql';
import { drizzle, MySql2Database } from 'drizzle-orm/mysql2';
import { migrate } from 'drizzle-orm/mysql2/migrator';
import { reset, seed } from 'drizzle-seed';
import { voteTable } from '../db/schema';

const SECONDS = 1000;
jest.setTimeout(70 * SECONDS);

describe('VotesController', () => {
  let urlProvider: Provider;
  let dbContainer: StartedMySqlContainer;
  let db: MySql2Database;
  let controller: VotesController;

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
    await reset(db, { voteTable });
    await seed(db, { voteTable });

    const module: TestingModule = await Test.createTestingModule({
      controllers: [VotesController],
      providers: [VotesService, urlProvider],
    }).compile();

    controller = module.get<VotesController>(VotesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call create of service', async () => {
      const spy = jest.spyOn(controller['votesService'], 'create');

      await controller.create({
        lehrerId: 1,
        vote: 0,
      });

      expect(spy).toBeCalledWith({
        lehrerId: 1,
        vote: 0,
      });
    });
  });

  describe('findAll', () => {
    it('should call findAll of service', async () => {
      const spy = jest.spyOn(controller['votesService'], 'findAll');

      await controller.findAll();

      expect(spy).toBeCalled();
    });
  });
});
