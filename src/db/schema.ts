import { int, mysqlTable, serial, varchar } from 'drizzle-orm/mysql-core';

export const lehrerTable = mysqlTable('lehrer_table', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  coolness: int('coolness').notNull(),
});
