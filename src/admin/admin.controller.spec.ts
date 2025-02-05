import { Test, TestingModule } from '@nestjs/testing';
import { Provider } from '@nestjs/common';
import { MySqlContainer, StartedMySqlContainer } from '@testcontainers/mysql';
import { drizzle, MySql2Database } from 'drizzle-orm/mysql2';
import { migrate } from 'drizzle-orm/mysql2/migrator';
import { reset, seed } from 'drizzle-seed';
import { voteTable } from '../db/schema';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

const SECONDS = 1000;
jest.setTimeout(70 * SECONDS);

describe('AdminController', () => {
  let urlProvider: Provider;
  let dbContainer: StartedMySqlContainer;
  let db: MySql2Database;
  let controller: AdminController;

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
      controllers: [AdminController],
      providers: [AdminService, urlProvider],
    }).compile();

    controller = module.get<AdminController>(AdminController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createAbstimmung', () => {
    it('should call createAbstimmung of service', async () => {
      const spy = jest.spyOn(controller['adminService'], 'createAbstimmung');

      await controller.createAbstimmung({
        name: 'Test',
        startDate: new Date(),
        endDate: new Date(),
      });

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('createLehrer', () => {
    it('should call createLehrer of service', async () => {
      const spy = jest.spyOn(controller['adminService'], 'createLehrer');

      await controller.createLehrer({
        name: 'Test',
      });

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('updateLehrer', () => {
    it('should call updateLehrer of service', async () => {
      const spy = jest.spyOn(controller['adminService'], 'updateLehrer');

      await controller.update('1', {
        name: 'Test',
      });

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('removeLehrer', () => {
    it('should call deleteLehrer of service', async () => {
      const spy = jest.spyOn(controller['adminService'], 'deleteLehrer');

      await controller.remove('1');

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('updateAbstimmung', () => {
    it('should call updateAbstimmung of service', async () => {
      const spy = jest.spyOn(controller['adminService'], 'updateAbstimmung');

      await controller.updateAbstimmung('1', {
        name: 'Test',
        startDate: new Date(),
        endDate: new Date(),
      });

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('removeAbstimmung', () => {
    it('should call deleteAbstimmung of service', async () => {
      const spy = jest.spyOn(controller['adminService'], 'deleteAbstimmung');

      await controller.removeAbstimmung('1');

      expect(spy).toHaveBeenCalled();
    });
  });
});
