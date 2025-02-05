import {
  int,
  mysqlEnum,
  mysqlTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core';

export const lehrerTable = mysqlTable('lehrer_table', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
});

export const voteTable = mysqlTable('vote_table', {
  id: serial('id').primaryKey(),
  lehrerId: int('lehrer_id').notNull(),
  vote: int('vote').notNull(),
  abstimmungId: int('abstimmung_id').notNull(),
});

export const abstimmungenTable = mysqlTable('abstimmungen_table', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  status: mysqlEnum('status', ['running', 'finished']).notNull(),
  endDate: timestamp('end_date').notNull(),
});
